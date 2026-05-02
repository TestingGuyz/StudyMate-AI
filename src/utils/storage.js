const KEYS = {
  USER: 'studymate_user',
  RESULTS: 'studymate_results',
  PERFORMANCE: 'studymate_performance',
  REMINDERS: 'studymate_reminders',
  HISTORY: 'studymate_history',
  CONCEPTS: 'studymate_concepts',
};

export const storage = {
  getUser() {
    try {
      return JSON.parse(localStorage.getItem(KEYS.USER)) || { name: '', class: '10', board: 'ICSE', darkMode: false };
    } catch { return { name: '', class: '10', board: 'ICSE', darkMode: false }; }
  },
  setUser(user) {
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
  },

  getResults() {
    try { return JSON.parse(localStorage.getItem(KEYS.RESULTS)) || []; }
    catch { return []; }
  },
  addResult(result) {
    const results = this.getResults();
    results.push({ ...result, id: Date.now().toString(), createdAt: new Date().toISOString() });
    localStorage.setItem(KEYS.RESULTS, JSON.stringify(results));
    return result;
  },

  getPerformance() {
    try { return JSON.parse(localStorage.getItem(KEYS.PERFORMANCE)) || {}; }
    catch { return {}; }
  },
  updatePerformance(subject, chapter, score) {
    const perf = this.getPerformance();
    const key = `${subject}|${chapter}`;
    const existing = perf[key] || { subject, chapter, totalQuizzes: 0, totalScore: 0, averageScore: 0, lastPracticed: null };
    existing.totalQuizzes += 1;
    existing.totalScore += score;
    existing.averageScore = Math.round(existing.totalScore / existing.totalQuizzes);
    existing.lastPracticed = new Date().toISOString();
    existing.status = this.getStatus(existing.averageScore);
    perf[key] = existing;
    localStorage.setItem(KEYS.PERFORMANCE, JSON.stringify(perf));
    return perf;
  },
  getStatus(avg) {
    if (avg >= 75) return 'green';
    if (avg >= 50) return 'yellow';
    return 'red';
  },

  getReminders() {
    try { return JSON.parse(localStorage.getItem(KEYS.REMINDERS)) || []; }
    catch { return []; }
  },
  addOrUpdateReminder(subject, chapter) {
    const reminders = this.getReminders();
    const INTERVALS = [1, 3, 7, 14, 30];
    const existingIdx = reminders.findIndex(r => r.subject === subject && r.chapter === chapter);
    const now = new Date();
    
    if (existingIdx >= 0) {
      const existing = reminders[existingIdx];
      existing.lastStudied = now.toISOString();
      existing.revisionCount = (existing.revisionCount || 0) + 1;
      const intervalDays = INTERVALS[Math.min(existing.revisionCount - 1, INTERVALS.length - 1)];
      const next = new Date(now);
      next.setDate(next.getDate() + intervalDays);
      existing.nextRevision = next.toISOString();
      existing.status = 'upcoming';
    } else {
      const next = new Date(now);
      next.setDate(next.getDate() + INTERVALS[0]);
      reminders.push({
        id: Date.now().toString(),
        subject,
        chapter,
        lastStudied: now.toISOString(),
        nextRevision: next.toISOString(),
        revisionCount: 0,
        status: 'upcoming'
      });
    }
    localStorage.setItem(KEYS.REMINDERS, JSON.stringify(reminders));
    return reminders;
  },
  markRevised(id) {
    const reminders = this.getReminders();
    const r = reminders.find(r => r.id === id);
    if (r) {
      const INTERVALS = [1, 3, 7, 14, 30];
      const now = new Date();
      r.lastStudied = now.toISOString();
      r.revisionCount = (r.revisionCount || 0) + 1;
      const intervalDays = INTERVALS[Math.min(r.revisionCount - 1, INTERVALS.length - 1)];
      const next = new Date(now);
      next.setDate(next.getDate() + intervalDays);
      r.nextRevision = next.toISOString();
      r.status = 'upcoming';
    }
    localStorage.setItem(KEYS.REMINDERS, JSON.stringify(reminders));
    return reminders;
  },

  getHistory() {
    try { return JSON.parse(localStorage.getItem(KEYS.HISTORY)) || []; }
    catch { return []; }
  },
  addHistory(subject, chapter, activityType) {
    const history = this.getHistory();
    history.push({ subject, chapter, activityType, createdAt: new Date().toISOString() });
    localStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
  },

  getConcepts() {
    try { return JSON.parse(localStorage.getItem(KEYS.CONCEPTS)) || []; }
    catch { return []; }
  },
  addConcept(topic, explanation, keyPoints, examMistakes) {
    const concepts = this.getConcepts();
    concepts.push({ topic, explanation, keyPoints, examMistakes, createdAt: new Date().toISOString() });
    localStorage.setItem(KEYS.CONCEPTS, JSON.stringify(concepts));
  },

  resetAll() {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
  }
};
