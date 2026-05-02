# StudyMate AI — Follow-Up Refinement Prompts for Base44

Use these prompts AFTER the initial build is complete. Paste them one at a time into the Base44 AI chat to refine specific features. Use "Edit" mode for these.

---

## PROMPT 1: Refine Quiz Mode (use after initial build)

The quiz mode needs these specific improvements:

1. Before the quiz starts, show a configuration screen where the user selects:
   - Question type: MCQ (default), Short Answer, Long Answer — as radio buttons
   - Difficulty: Easy, Medium, Hard — as toggle buttons
   - Number of questions: 5, 10, 15 — as selectable chips

2. For MCQ quiz flow:
   - Show one question at a time with 4 clickable option cards (A, B, C, D)
   - Add a countdown timer at the top right that counts down from 30s (Easy), 45s (Medium), 60s (Hard)
   - When timer expires, auto-mark as wrong and show correct answer
   - After user selects an answer, highlight the selected option green if correct or red if wrong
   - Show the correct answer in green if user was wrong, with a brief explanation below
   - Add a "Next Question" button to proceed
   - Show a progress bar at top: "Question 3 of 10"

3. For the invokeLLM quiz generation call, use this exact prompt structure:
   "Generate {count} {difficulty} difficulty MCQ questions for Class {class} {board} {subject} chapter '{chapter}'. Each question must have 4 options (A, B, C, D) and one correct answer. Return as JSON array: [{question, options: [A, B, C, D], correct: 'A'|'B'|'C'|'D', explanation}]. Questions must follow {board} board exam pattern."

4. Score summary page at the end must show:
   - Big score display: "7/10" with percentage
   - Grade badge: A (90%+), B (75-89%), C (50-74%), D (below 50%)
   - Time taken
   - Expandable section showing all wrong answers with explanations
   - Save the result to QuizResult entity with all fields

5. After saving the quiz result, also update the TopicPerformance entity for that subject+chapter

---

## PROMPT 2: Refine Concept Explainer

Improve the Concept Explainer page:

1. Add a prominent search bar at the top with placeholder "Ask any concept... e.g., 'What is photosynthesis?'"
2. Add an "Explain like I'm 14" toggle switch that's ON by default — when ON, the AI prompt includes "Explain in very simple language a 14-year-old would understand. No technical jargon."
3. When the user submits a topic, call invokeLLM with this prompt:
   "You are a friendly tutor for Indian school students (Class 8-10, {board} board). Explain '{topic}' in simple language. {simplification_mode}. Provide your response as JSON: {explanation: '3-4 paragraph explanation', keyPoints: ['point1', 'point2', ...5-6 points], examMistakes: ['mistake1', 'mistake2', ...3-4 mistakes], relatedTopics: ['topic1', 'topic2', ...3-4 topics]}"

4. Display the response in a clean card layout:
   - Explanation text in a white card with a lightbulb icon header
   - Key Points in a highlighted card with bullet icons
   - Common Exam Mistakes in a warning-styled card (light red/orange background)
   - Related Topics as clickable chips at the bottom — clicking one triggers a new explanation

5. Show suggested topics below the search bar as chips based on the user's selected subject chapters
6. Save each explanation to ConceptHistory entity
7. Show a loading state with "Explaining concept..." spinner during the AI call

---

## PROMPT 3: Refine Performance Dashboard

Improve the Performance Dashboard page:

1. Top section: Overview cards in a horizontal scroll showing:
   - Total Quizzes Taken (number with quiz icon)
   - Average Score (percentage with chart icon)
   - Best Subject (subject name with trophy icon)
   - Weakest Subject (subject name with alert icon)

2. "Suggested Revision" card at the top (prominent, with a gradient background):
   - Shows the chapter with the lowest average score across all subjects
   - Text: "We recommend revising {chapter} in {subject} — your average is {score}%"
   - "Start Revision" button that navigates to revision notes for that chapter

3. Subject-wise breakdown section:
   - Each subject is a collapsible card with the subject color as left border
   - Inside, show a list of chapters with colored performance dots:
     - Red dot (below 50%): needs urgent revision
     - Yellow dot (50-75%): needs practice
     - Green dot (above 75%): doing well
   - Show average score next to each chapter name

4. Achievement badges section at the bottom:
   - "First Quiz" — unlocked after first quiz
   - "5 Quizzes Done" — unlocked after 5 quizzes
   - "Scored 100%" — unlocked for a perfect score
   - "Improved by 20%" — unlocked when score improves 20%+ from previous
   - "All Green" — unlocked when all chapters in a subject are above 75%
   - Show locked badges as grayed out, unlocked as colorful with a checkmark

5. All data comes from QuizResult and TopicPerformance entities

---

## PROMPT 4: Refine Revision Notes Generator

Improve the Revision Notes page:

1. Top section: Subject selector dropdown and Chapter selector dropdown (chapters filter based on selected subject)

2. When user selects a chapter and clicks "Generate Notes", call invokeLLM with:
   "Create concise revision notes for Class {class} {board} {subject} chapter '{chapter}'. Format as JSON: {title: 'chapter name', notes: [{heading: 'section title', points: ['point1', 'point2', ...]}], formulas: ['formula1 with description', ...] (only for Physics/Chemistry/Maths), keyDates: [{event: 'event', date: 'date'}] (only for History), keyProcesses: [{name: 'process name', steps: ['step1', 'step2', ...]}] (only for Biology)}. Keep it exam-focused and concise. Use bullet points."

3. Display notes in a clean, readable format:
   - Section headings with the subject color accent
   - Bullet points under each heading
   - Formulas displayed in a special styled box with a purple/amber background and formula icon (only for science/maths subjects)
   - Key dates in a timeline-style format (only for History)
   - Key processes in a step-by-step numbered format (only for Biology)

4. Add action buttons at the bottom:
   - "Test Yourself" — navigates to quiz for that chapter
   - "Mark as Revised" — updates RevisionReminder entity

5. Show loading state with "Generating revision notes..." during AI call
6. Save the generation event to StudyHistory entity

---

## PROMPT 5: Refine Spaced Repetition System

Add the spaced repetition reminder system:

1. Create a "Reminders" section accessible from the dashboard or as a tab

2. Logic for spaced repetition intervals:
   - After first study: revise in 1 day
   - After 1st revision: revise in 3 days
   - After 2nd revision: revise in 7 days
   - After 3rd revision: revise in 14 days
   - After 4th revision: revise in 30 days

3. Display reminders as a list sorted by urgency:
   - Overdue items (red left border, "OVERDUE" badge)
   - Due today items (yellow left border, "DUE TODAY" badge)
   - Upcoming items (green left border, shows due date)

4. Each reminder row shows:
   - Subject icon with color
   - Chapter name
   - "Revise by" date
   - "Mark as Revised" button — clicking it updates the RevisionReminder entity:
     - Sets lastStudied to now
     - Calculates nextRevision based on revisionCount
     - Increments revisionCount

5. When a quiz is completed, automatically create or update a RevisionReminder for that chapter

6. Show a count badge on the Reminders tab icon for overdue items

---

## PROMPT 6: Refine UI and Mobile Responsiveness

Apply these UI refinements across the entire app:

1. Add a dark mode toggle in Settings that switches the entire app to a dark theme:
   - Dark background: #1A1A2E
   - Card background: #16213E
   - Text: #E0E0E0
   - Accent colors remain the same but slightly desaturated

2. Make sure the bottom navigation bar works well on mobile:
   - Fixed at the bottom
   - Icons: Home (house), Quiz (help-circle), Explain (lightbulb), Dashboard (bar-chart), Notes (book), Settings (settings)
   - Active tab highlighted with subject color or primary color
   - Labels below icons

3. Add smooth page transitions — fade or slide animations between pages

4. Add loading states everywhere AI content is generated:
   - Centered spinner with descriptive text ("Generating questions...", "Explaining concept...", "Creating notes...")
   - Subtle pulse animation on the spinner

5. Make all subject cards on the landing page the same size in a responsive grid:
   - 2 columns on mobile, 4 columns on desktop
   - Each card shows: subject icon, subject name, small progress bar

6. Ensure all buttons have hover/active states with slight scale transform

7. Add a motivational quote or tip at the bottom of the home page that changes on refresh

---

## PROMPT 7: Final Polish — Data Persistence and Edge Cases

Apply these final fixes:

1. Make sure all quiz results persist properly — when I close and reopen the app, my past quiz scores should still be visible in the dashboard

2. When invokeLLM fails or returns an error, show a friendly error message: "Couldn't generate content right now. Please try again." with a retry button

3. If a user hasn't taken any quizzes yet, the dashboard should show an empty state with a message: "Take your first quiz to see your performance!" with a CTA button

4. Add a "Quick Quiz" button on the home page that lets users immediately start a 5-question MCQ quiz on a random chapter from a random subject

5. Make the timer in quiz mode visually prominent — use a circular countdown animation that changes color from green to yellow to red as time runs out

6. Ensure the chapter selector shows the correct chapters for each subject based on the hardcoded syllabus data

7. Add haptic-like visual feedback (brief scale animation) when users select an answer in quiz mode
