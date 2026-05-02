const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
let groqApiKey = null;

export const initAI = (apiKey) => {
  groqApiKey = apiKey ? apiKey.trim() : null;
};

const groqFetch = async (messages, temperature = 0.7) => {
  const key = (groqApiKey || '').trim();
  if (!key) throw new Error('API key not configured. Go to Settings to add your Groq API key.');

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature,
      max_tokens: 4000,
      response_format: { type: 'json_object' }
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `HTTP ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '';
  
  // Try to extract JSON from the response
  try {
    return JSON.parse(content);
  } catch {
    // If direct parse fails, try to find JSON in the text
    const jsonMatch = content.match(/\{[\s\S]*\}/) || content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      try { return JSON.parse(jsonMatch[0]); } catch { /* fall through */ }
    }
    throw new Error('Failed to parse AI response as JSON');
  }
};

export const generateQuizQuestions = async ({ subject, chapter, difficulty, questionType, count, board, studentClass }) => {
  const typeInstructions = questionType === 'MCQ' 
    ? `Each question must have 4 options (A, B, C, D) and one correct answer. Return as JSON array: [{"question": "...", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "correct": "A|B|C|D", "explanation": "..."}]`
    : questionType === 'Short'
    ? `Each question should be a 2-3 mark short answer type. Return as JSON array: [{"question": "...", "modelAnswer": "...", "keyPoints": ["point1", "point2"], "explanation": "..."}]`
    : `Each question should be a 5 mark long answer type. Return as JSON array: [{"question": "...", "modelAnswer": "...", "keyPoints": ["point1", "point2", "point3", "point4", "point5"], "explanation": "..."}]`;

  const userPrompt = `Generate exactly ${count} ${difficulty} difficulty ${questionType} questions for the chapter "${chapter}".
Questions must follow ${board} board exam pattern and be appropriate for Class ${studentClass} students.
${typeInstructions}`;

  return groqFetch([
    { role: 'system', content: `You are an expert ${board} board exam question paper setter for Class ${studentClass} ${subject}. Return only valid JSON.` },
    { role: 'user', content: userPrompt }
  ], 0.7);
};

export const explainConcept = async ({ topic, simplify = true, board = 'ICSE', studentClass = '10' }) => {
  const simplifyInstruction = simplify 
    ? 'Explain in very simple language that a 14-year-old would understand. Avoid technical jargon. Use everyday analogies.'
    : 'Explain at a Class 10 level with appropriate terminology.';

  const userPrompt = `Explain the concept: "${topic}"
${simplifyInstruction}
Return your response as JSON: {"explanation": "3-4 paragraph explanation", "keyPoints": ["point1", "point2", "point3", "point4", "point5"], "examMistakes": ["mistake1", "mistake2", "mistake3"], "relatedTopics": ["topic1", "topic2", "topic3"]}`;

  return groqFetch([
    { role: 'system', content: `You are a friendly and encouraging tutor for Indian school students (Class ${studentClass}, ${board} board). Return only valid JSON.` },
    { role: 'user', content: userPrompt }
  ], 0.8);
};

export const generateRevisionNotes = async ({ subject, chapter, board = 'ICSE', studentClass = '10' }) => {
  const isScience = ['Physics', 'Chemistry', 'Mathematics'].includes(subject);
  const isHistory = subject === 'History';
  const isBiology = subject === 'Biology';

  const extraInstructions = isScience 
    ? 'Include a "formulas" array with key formulas, each having "formula" and "description" fields.'
    : isHistory 
    ? 'Include a "keyDates" array with important dates, each having "event" and "date" fields.'
    : isBiology
    ? 'Include a "keyProcesses" array with important processes, each having "name" and "steps" array.'
    : 'Include a "keyTerms" array with important terms and their definitions.';

  const userPrompt = `Create concise, exam-focused revision notes for the chapter "${chapter}".
Format as bullet points, keeping it brief and to the point.
${extraInstructions}
Return as JSON: {"title": "${chapter}", "sections": [{"heading": "section title", "points": ["point1", "point2", "point3"]}], "formulas": [{"formula": "...", "description": "..."}], "keyDates": [{"event": "...", "date": "..."}], "keyProcesses": [{"name": "...", "steps": ["step1", "step2"]}], "keyTerms": [{"term": "...", "definition": "..."}]}
Only include the arrays relevant to this subject. Omit irrelevant ones.`;

  return groqFetch([
    { role: 'system', content: `You are an expert ${board} board exam tutor for Class ${studentClass} ${subject}. Return only valid JSON.` },
    { role: 'user', content: userPrompt }
  ], 0.5);
};
