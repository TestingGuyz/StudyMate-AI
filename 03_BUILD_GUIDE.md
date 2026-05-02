# StudyMate AI — Step-by-Step Build Guide for Base44

## Overview
This guide walks you through building the StudyMate AI app on Base44, an AI-powered app builder. You describe what you want in plain English, and Base44 generates the app.

---

## Step 1: Set Up Base44 Account
1. Go to https://app.base44.com/
2. Sign up for an account (you'll need at least a Starter plan for invokeLLM)
3. You start with some free credits — enough to build and test

---

## Step 2: Initial Build with Plan Mode
1. On the Base44 home screen, click the prompt input box
2. **TURN ON the "Plan" toggle** — this gives a better first build by letting you refine requirements before consuming credits
3. Copy the ENTIRE prompt from `01_MASTER_PROMPT.md` (everything below the "copy everything below this line" marker)
4. Paste it into the prompt box
5. The AI will ask clarifying questions — answer them:
   - "Yes, use invokeLLM for all AI content generation"
   - "Store all data in the entities I defined"
   - "Make it mobile-first, responsive"
6. Review the generated plan carefully
7. Click **"Start Building"** when satisfied
8. Wait for the app to be generated (this uses credits)

---

## Step 3: Test the Initial Build
1. Use the **Preview** panel to test the app
2. Check each page:
   - Does the landing page show all 8 subjects?
   - Does clicking a subject show the correct chapters?
   - Does quiz mode generate real questions?
   - Does the concept explainer work?
   - Does the dashboard show data?
3. Note any issues or missing features

---

## Step 4: Refine with Follow-Up Prompts
Switch to **Edit mode** in the AI chat, then apply refinement prompts one at a time from `02_REFINEMENT_PROMPTS.md`:

### Order of refinement (most impactful first):
1. **PROMPT 1: Quiz Mode** — This is the core feature. Make sure MCQ generation, timer, scoring, and feedback all work perfectly.
2. **PROMPT 2: Concept Explainer** — Refine the AI explanation flow and display.
3. **PROMPT 3: Dashboard** — Make performance tracking visual and useful.
4. **PROMPT 4: Revision Notes** — Ensure notes are well-formatted and subject-aware.
5. **PROMPT 5: Spaced Repetition** — Add the reminder system.
6. **PROMPT 6: UI Polish** — Dark mode, responsiveness, animations.
7. **PROMPT 7: Final Polish** — Edge cases, error handling, persistence.

### Tips for each refinement:
- After pasting each prompt, wait for the AI to make changes
- Test the changes in Preview before moving to the next prompt
- If something breaks, use **Revert History** to go back
- You can also make manual visual edits by clicking elements directly

---

## Step 5: Test Thoroughly
1. Test the complete quiz flow: Select subject → chapter → configure quiz → answer questions → see results
2. Test concept explainer: Type a topic → see explanation → click related topics
3. Test dashboard: Take multiple quizzes → check that scores are tracked correctly
4. Test revision notes: Generate notes for different subjects → check formatting
5. Test on mobile: Open the preview URL on your phone browser
6. Test dark mode: Toggle in settings → verify all pages look good

---

## Step 6: Publish and Share
1. Click **Publish App** to push changes live
2. Copy the app's web URL
3. Click **Share your app** to get a shareable link
4. This is the link you give to hackathon judges

---

## Troubleshooting

### If invokeLLM isn't generating good questions:
- Switch to a stronger model: "Switch invokeLLM to use gpt_4o for this app"
- Make the prompt more specific in the backend function
- Test with different subjects and chapters

### If data isn't persisting:
- Check that entities are properly defined in the Data section
- Make sure quiz results are being saved with all required fields
- Verify TopicPerformance is being updated after each quiz

### If the app looks bad on mobile:
- Use the prompt: "Make the entire app mobile-first responsive. Use a bottom navigation bar. Cards should stack vertically on small screens."
- Test in an incognito mobile viewport

### If you run out of credits:
- Base44 gives credits with each plan
- You can upgrade your plan for more credits
- Use Discuss mode (free) to plan changes before using Edit mode (costs credits)

---

## Quick Reference: Key Base44 Features

| Feature | How to Use |
|---------|-----------|
| Plan Mode | Toggle ON before first prompt — better first build, no credits used |
| Discuss Mode | Brainstorm without making changes — free |
| Edit Mode | Make changes to the app — uses credits |
| invokeLLM | Built-in AI — generates questions, explanations, notes |
| Entities | Data models — QuizResult, TopicPerformance, etc. |
| Flows | Automated workflows — e.g., update reminders after quiz |
| Visual Editor | Click elements to manually adjust design |
| Revert History | Undo any change — experiment freely |
| Publish | Push changes live for sharing |

---

## Hackathon Demo Script

When presenting to judges, follow this flow:

1. **Show Landing Page** — "StudyMate AI, an AI study companion for ICSE/CBSE students"
2. **Pick Physics → Motion** — "Let's take a quiz on Motion"
3. **Configure Quiz** — Select MCQ, Medium, 10 questions
4. **Take Quiz** — Answer a few questions, show timer and instant feedback
5. **Show Results** — Point out the score, grade, and wrong answer explanations
6. **Concept Explainer** — Type "Newton's Second Law" — show the simple explanation
7. **Dashboard** — Show performance tracking with color-coded chapters
8. **Revision Notes** — Generate notes for a Chemistry chapter — show formula highlighting
9. **Spaced Repetition** — Show the reminder system with overdue items
10. **Dark Mode** — Toggle dark mode to show the feature
11. **Mobile** — Show the app on your phone (open the URL)

Total demo time: ~5-7 minutes
