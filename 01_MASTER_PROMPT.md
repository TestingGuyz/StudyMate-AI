# StudyMate AI — Master Prompt for Base44

## INSTRUCTIONS
1. Go to https://app.base44.com/
2. Turn ON the "Plan" toggle in the prompt box
3. Paste the ENTIRE prompt below
4. Answer any follow-up questions the AI asks
5. Click "Start Building" when the plan looks good

---

## PROMPT (copy everything below this line)

Build an AI-powered study assistant app called "StudyMate AI" for Indian school students in Class 8-10 studying under ICSE and CBSE boards.

WHO: Indian school students aged 13-16 preparing for board exams
WHAT: An AI study companion that generates practice questions, explains concepts, tracks weak topics, and creates revision notes
WHY: To help students study smarter with personalized practice, instant explanations, and performance tracking

VISUAL STYLE: Modern, clean, student-friendly — not childish and not corporate. Think "study app aesthetic" like Duolingo meets Notion. Use a soft white/light gray background with vibrant accent colors per subject. Rounded corners, subtle shadows, smooth transitions. Include a dark mode toggle. Font should be clean sans-serif (Inter or similar).

LAYOUT: Bento grid style for the landing page subject cards. Tab-based navigation at the bottom for mobile. Card-based layouts for content. Split layouts for quiz mode (question on top, options below).

COLOR CODING BY SUBJECT:
- Physics: #3B82F6 (blue)
- Chemistry: #F59E0B (amber)
- Mathematics: #8B5CF6 (purple)
- Biology: #10B981 (green)
- Computer Applications: #6366F1 (indigo)
- History: #EF4444 (red)
- Geography: #14B8A6 (teal)
- English: #EC4899 (pink)

PAGES AND FLOWS:

PAGE 1 — LANDING PAGE (Home):
- App logo and name "StudyMate AI" at top with a motivational tagline
- Grid of 8 subject cards, each with the subject icon, name, and color coding
- Each card shows a small progress bar indicating how much of the subject the user has practiced
- Quick stats bar at top: total quizzes taken, average score, topics mastered
- Bottom navigation bar with icons: Home, Quiz, Explain, Dashboard, Notes, Settings

PAGE 2 — CHAPTER SELECTOR:
- When user taps a subject card, show a list of chapters for that subject
- Each chapter row shows: chapter name, a small colored dot (red/yellow/green based on performance), and a "Start Quiz" button
- Three action buttons per chapter: "Take Quiz", "Revise", "Get Notes"
- Back button to return to subject grid
- Chapters are hardcoded per subject (see SYLLABUS DATA below)

PAGE 3 — QUIZ MODE:
- Before quiz starts: select question type (MCQ / Short Answer / Long Answer), difficulty (Easy/Medium/Hard), and number of questions (5/10/15)
- MCQ Quiz flow: Show one question at a time with 4 options
- Timer per question: 30s (Easy), 45s (Medium), 60s (Hard) — visible countdown
- After answering: instant feedback — green checkmark or red X with correct answer and explanation
- Progress bar at top showing question X of Y
- At quiz end: Score summary page showing score/total, percentage, grade (A: 90%+, B: 75-89%, C: 50-74%, D: below 50%), time taken
- List all wrong answers with correct answers and explanations
- "Retry Quiz" and "Back to Chapters" buttons
- Use invokeLLM to generate questions dynamically based on the selected subject, chapter, difficulty, and question type

PAGE 4 — CONCEPT EXPLAINER:
- Search bar at top: "Type any topic or concept..."
- "Explain like I'm 14" toggle switch (on by default) — simplifies language, avoids jargon
- When user submits a topic, use invokeLLM to generate:
  - A clear, simple explanation (3-4 paragraphs, age-appropriate)
  - "Key Points" summary section (5-6 bullet points)
  - "Common Exam Mistakes" section (3-4 mistakes students typically make)
  - "Related Topics" suggestions (clickable chips that trigger new explanations)
- Suggested topic chips below search bar based on previously studied chapters
- History of explained topics in a collapsible section

PAGE 5 — PERFORMANCE DASHBOARD (Weak Topic Tracker):
- Overview card: Total quizzes, Average score, Best subject, Weakest subject
- Per-subject breakdown cards showing chapter-by-chapter performance
- Each chapter row has a colored badge: Red (below 50%), Yellow (50-75%), Green (above 75%)
- "Suggested Revision" card at top: AI recommends which chapter to revise next based on lowest scores
- Bar chart or visual showing subject-wise average scores
- Achievement badges section: "First Quiz", "5 Quizzes Done", "Scored 100%", "Improved by 20%", "All Green in Subject"
- Use data from QuizResult entity to calculate all metrics

PAGE 6 — REVISION NOTES:
- Select subject → chapter dropdown
- Use invokeLLM to generate concise revision notes for the selected chapter
- Notes format: Bullet points, exam-focused
- For Physics/Chemistry/Maths: Key formulas highlighted in a distinct styled box with a formula icon
- For History: Important dates and events highlighted in a timeline-style box
- For Biology: Key diagrams described in text, processes in step-by-step format
- "Download Notes" button (generates a printable view)
- "Test Yourself" button that jumps to quiz for that chapter

PAGE 7 — SPACED REPETITION REMINDERS:
- Shows a list of topics due for revision based on the forgetting curve
- Topics studied recently: revise in 1 day, then 3 days, then 7 days, then 14 days
- Each reminder row shows: topic name, subject, "Revise by" date, urgency indicator (overdue = red, due today = yellow, upcoming = green)
- "Mark as Revised" button that resets the timer for that topic
- Auto-generates reminders when a quiz is completed

PAGE 8 — PROFILE/SETTINGS:
- Student name input (stored locally)
- Class selection (8/9/10)
- Board selection (ICSE/CBSE)
- Dark mode toggle
- Reset all data button (with confirmation)
- App info and version

DATA ENTITIES:

1. QuizResult:
   - id (auto)
   - subject (text)
   - chapter (text)
   - difficulty (text: Easy/Medium/Hard)
   - questionType (text: MCQ/Short/Long)
   - score (number)
   - totalQuestions (number)
   - percentage (number)
   - timeTaken (number, seconds)
   - wrongAnswers (list of objects: {question, userAnswer, correctAnswer, explanation})
   - createdAt (datetime)

2. TopicPerformance:
   - id (auto)
   - subject (text)
   - chapter (text)
   - totalQuizzes (number)
   - averageScore (number)
   - lastPracticed (datetime)
   - status (text: red/yellow/green based on averageScore)

3. StudyHistory:
   - id (auto)
   - subject (text)
   - chapter (text)
   - activityType (text: quiz/explain/notes)
   - createdAt (datetime)

4. RevisionReminder:
   - id (auto)
   - subject (text)
   - chapter (text)
   - lastStudied (datetime)
   - nextRevision (datetime)
   - revisionCount (number)
   - status (text: overdue/due/upcoming)

5. ConceptHistory:
   - id (auto)
   - topic (text)
   - explanation (text)
   - keyPoints (list of text)
   - examMistakes (list of text)
   - createdAt (datetime)

SYLLABUS DATA (hardcode these chapters):

Physics: ["Measurements and Experimentation", "Motion in One Dimension", "Laws of Motion", "Forces", "Pressure and Floatation", "Work, Energy and Power", "Sound", "Light - Reflection and Refraction", "Electricity and Magnetism", "Heat"]

Chemistry: ["Matter and its Composition", "Atomic Structure and Chemical Bonding", "Acids, Bases and Salts", "Metals and Non-metals", "Carbon and its Compounds", "Periodic Table and Periodicity", "Study of Compounds", "Mole Concept and Stoichiometry"]

Mathematics: ["Algebra - Factorisation and Quadratic Equations", "Geometry - Triangles and Circles", "Trigonometry", "Statistics and Probability", "Mensuration", "Commercial Mathematics", "Coordinate Geometry", "Linear Inequations"]

Biology: ["Cell Biology and Division", "Nutrition and Photosynthesis", "Respiration", "Transport in Plants and Animals", "Excretion", "Nervous System and Sense Organs", "Reproduction", "Ecology and Environment"]

Computer Applications: ["Algorithms and Flowcharts", "Java Basics and Data Types", "Conditional Statements and Loops", "Arrays and Strings", "OOP Concepts and Classes", "HTML and CSS Basics", "SQL and Database Concepts"]

History: ["The Harappan Civilization", "The Vedic Period", "Mauryan and Gupta Empires", "The Delhi Sultanate", "The Mughal Empire", "The British Raj and Revolt of 1857", "Indian National Movement", "World War I and II"]

Geography: ["Earth as a Planet", "Latitude, Longitude and Time", "Rotation and Revolution", "Landforms and Mountains", "Water Bodies and Oceans", "Climate and Weather", "Natural Vegetation", "Map Work and Interpretation"]

English: ["Grammar - Tenses and Voice", "Grammar - Prepositions and Conjunctions", "Comprehension and Summary Writing", "Formal and Informal Letters", "Essay and Article Writing", "Poetry Analysis", "Prose and Drama", "Vocabulary and Idioms"]

AI INTEGRATIONS:
- Use invokeLLM for ALL AI-generated content (questions, explanations, notes)
- When generating quiz questions, the LLM prompt should specify: subject, chapter, difficulty, question type, board (ICSE/CBSE), and that questions must follow board exam patterns
- When generating explanations, the LLM prompt should specify: "Explain in simple language appropriate for a Class 9-10 student. Avoid jargon. Include key points and common exam mistakes."
- When generating revision notes, the LLM prompt should specify: "Create concise, exam-focused revision notes in bullet points. Highlight key formulas for science subjects and key dates for history."
- All invokeLLM responses for quiz questions should be structured as JSON so the app can parse them properly

IMPORTANT CONSTRAINTS:
- No placeholder screens — every page must be fully functional
- Quiz mode must work end-to-end with real AI-generated questions
- Performance tracking must persist data across sessions using the entities
- The app must be responsive and work well on mobile browsers
- Include smooth page transitions and loading states while AI generates content
- Show a loading spinner with "Generating questions..." or "Explaining concept..." during AI calls
- All data should be stored per user session (use the entities above)
