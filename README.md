<img width="4320" height="1440" alt="hh26 main poster 2 with sponsors 3x1 (4320 x 1440 px) (2)" src="https://github.com/user-attachments/assets/c698b2cd-da84-4cb0-9276-125c6a7244aa" />


# 🚀 StudyMate AI

> An AI-powered study assistant for ICSE/CBSE Class 8-10 students to generate practice questions, explain concepts, and track weak topics.

---

## 📌 Problem & Domain

Indian school students (Class 8-10) preparing for board exams face three major challenges:
1. **Finding quality practice questions** that match their specific syllabus (ICSE/CBSE)
2. **Getting instant, simple explanations** when stuck on difficult concepts
3. **Knowing what to revise** — students struggle to identify their weak areas

**Themes Selected (at least one):**
- [x] Learning & Knowledge Systems  
- [ ] Human Experience & Productivity  
- [ ] Climate & Sustainability Systems  
- [ ] HealthTech & Bio Platforms  
- [ ] Work, Finance & Digital Economy  
- [ ] Infrastructure, Mobility & Smart Systems  
- [ ] Trust, Identity & Security  
- [ ] Media, Social & Interactive Platforms  
- [ ] Public Systems, Governance and Civic Tech  
- [ ] Developer Tools & Software Infrastructure  

---

## 🎯 Objective

**Target Users:** Indian school students in Class 8-10 studying under ICSE and CBSE boards.

**Pain Points:**
- Students can't find MCQs and practice questions that match their exact chapter
- Textbooks are dry and don't explain "why" something works
- No way to track which chapters need more attention
- Revision notes are scattered across multiple sources

**Value Proposition:**
- AI generates unlimited practice questions for any chapter in seconds
- "Explain like I'm 14" mode breaks down complex concepts with zero jargon
- Performance dashboard shows exactly which chapters need revision
- Spaced repetition system reminds students what to study before they forget

---

## 🧠 Team & Approach

### Team Name:  
`Testing Guyz`

### Team Members:  
- Abhishek Subramanian (GitHub: @TestingGuyz) - Full Stack Developer
- [Add other members here]

### Your Approach:
**Why we chose this problem:**
As recent high school graduates, we personally experienced the struggle of finding focused, syllabus-aligned study material. Existing apps are either too generic or too expensive. We wanted to build something specifically for Indian board students.

**Key challenges addressed:**
- **AI Question Generation:** Used Groq's Llama 3.3 70B to generate board-exam-style questions with proper JSON formatting
- **Mobile-First Design:** Students study on phones — we built a responsive PWA with bottom navigation
- **Offline-First Storage:** Used localStorage so data persists without a backend
- **Syllabus Alignment:** Hardcoded ICSE/CBSE chapter lists for 8 subjects

**Pivots:**
- Initially planned to use Base44, but switched to React + Vite for more control
- Moved from Gemini to Groq for faster, free API access with higher rate limits

---

## 🛠️ Tech Stack

### Core Technologies Used:
- Frontend: React 18, Vite, TailwindCSS
- Backend: Groq API (Serverless)
- Database: localStorage (client-side persistence)
- APIs: Groq (Llama 3.3 70B) for AI content generation
- Hosting: Netlify (recommended) / GitHub Pages

### Additional Technologies Used (Optional):
- [x] AI / ML  
- [ ] Web3 / Blockchain  
- [ ] Cyber Security 
- [ ] Cloud  

---

## 🏆 Sponsored Track (Optional)

Select if your project participates in any track:

- [ ] **Expo Track** – Built using Expo  
- [ ] **Neo4j Track** – Uses AuraDB as primary database  
- [x] **Base44 Track** – Prototype/Final Product built using Base44  

Provide a short note on how you used the partner technology:

> We created comprehensive Base44 prompts (in `01_MASTER_PROMPT.md` and `02_REFINEMENT_PROMPTS.md`) as an alternative deployment path. The prompts can be pasted into app.base44.com to generate the same app without code. Our primary deliverable is the React app, but Base44 prompts are included as backup documentation.

---

## ✨ Key Features

Highlight the most important features of your project:

- ✅ **AI Question Generator** — Generate 5/10/15 MCQs for any chapter with Easy/Medium/Hard difficulty  
- ✅ **Concept Explainer** — "Explain like I'm 14" mode simplifies any topic with key points & common exam mistakes  
- ✅ **Quiz Mode** — Timed quizzes with instant feedback, score tracking, and wrong answer review  
- ✅ **Weak Topic Tracker** — Dashboard shows performance per chapter (Red/Yellow/Green) with revision suggestions  
- ✅ **Revision Notes** — AI generates exam-focused notes with formulas highlighted (Science) and dates (History)  
- ✅ **Spaced Repetition** — Automated reminders based on forgetting curve (1→3→7→14→30 days)  
- ✅ **8 Subjects Covered** — Physics, Chemistry, Maths, Biology, Computer, History, Geography, English  
- ✅ **Dark Mode** — Full dark theme support for night studying  

*(Screenshots below)*

![Home Screen](./screenshots/home.png)
![Quiz Mode](./screenshots/quiz.png)
![Dashboard](./screenshots/dashboard.png)

---

## 📽️ Demo & Deliverables

- **Demo Video Link (Mandatory):** [Add YouTube/Loom link here]  
- **Deployment Link (Recommended):** https://studymate-ai.netlify.app (example)  
- **Pitch Deck / PPT (Optional):** [Add Google Slides link here]  

---

## ✅ Tasks & Bonus Checklist

- [ ] All team members completed the mandatory social task  
- [ ] Bonus Task 1 – Badge sharing  
- [ ] Bonus Task 2 – Blog/article  

---

## 🧪 How to Run the Project

### Requirements:
- Node.js 18+ 
- Groq API key (free at https://console.groq.com/keys)
- Git

### Local Setup:
```bash
# Clone the repository
git clone https://github.com/TestingGuyz/StudyMate-AI.git
cd StudyMate-AI

# Install dependencies
npm install

# Start dev server
npm run dev

# Open http://localhost:5173
# Then go to Settings and add your Groq API key
```

### Build for Production:
```bash
npm run build
# Deploy 'dist' folder to Netlify/Vercel
```

---

## 🧬 Future Scope

- 📈 **More boards:** Add state boards (Maharashtra, Karnataka, etc.)
- 📈 **Previous year papers:** Integration with 10-year question bank
- 📈 **Study groups:** Multiplayer quizzes with friends
- 📈 **AI tutor:** Voice-enabled conversational tutoring
- 📈 **Offline mode:** Service workers for full offline functionality
- 🛡️ **Security:** Backend with user accounts for cross-device sync
- 🌐 **Regional languages:** Hindi, Tamil, Telugu support

---

## 📎 Resources / Credits

- **Groq API:** https://console.groq.com/ (AI content generation)
- **Groq Llama 3.3 70B:** Question generation, concept explanation, revision notes
- **Lucide React:** Icons (https://lucide.dev/)
- **TailwindCSS:** Styling framework
- **Vite:** Build tool
- **ICSE/CBSE Syllabus:** Standardized chapter lists from official board documents

---

## 🏁 Final Words

Building StudyMate AI in 24 hours was intense! The biggest challenge was getting the AI to consistently return valid JSON for quiz questions. We went through multiple iterations of prompt engineering before landing on the right format with system/user message separation.

Shout-out to our mentor who suggested using Groq instead of Gemini — the speed difference was incredible (under 1 second vs 5+ seconds per request).

This project was personal for us. We wish we had this tool when we were in Class 10!

---

**Made with ❤️ at Hackazrds 3.0**

<p align="center">
  <a href="https://github.com/TestingGuyz/StudyMate-AI">
    <img src="https://img.shields.io/badge/StudyMate-AI-blue?style=for-the-badge" alt="StudyMate AI">
  </a>
</p>
