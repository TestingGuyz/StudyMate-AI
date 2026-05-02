import { useApp } from '../context/AppContext';
import { SUBJECTS, SUBJECT_LIST } from '../data/syllabus';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Trophy, AlertCircle, Target, Award, BookOpen, ChevronDown, ChevronUp, Calendar, Timer, Sparkles, Zap, Flame, Star, TrendingUp, Clock } from 'lucide-react';
import { useState } from 'react';

export default function Dashboard() {
  const { state } = useApp();
  const navigate = useNavigate();
  const [expandedSubject, setExpandedSubject] = useState(null);

  const totalQuizzes = state.results.length;
  const avgScore = totalQuizzes > 0
    ? Math.round(state.results.reduce((sum, r) => sum + r.percentage, 0) / totalQuizzes)
    : 0;

  // Find best and weakest subjects
  const subjectScores = {};
  SUBJECT_LIST.forEach(s => {
    const entries = Object.values(state.performance).filter(p => p.subject === s);
    if (entries.length > 0) {
      subjectScores[s] = Math.round(entries.reduce((sum, e) => sum + e.averageScore, 0) / entries.length);
    }
  });

  const bestSubject = Object.entries(subjectScores).sort((a, b) => b[1] - a[1])[0];
  const weakestSubject = Object.entries(subjectScores).sort((a, b) => a[1] - b[1])[0];

  // Find the chapter with lowest score for suggestion
  const allPerf = Object.values(state.performance);
  const weakestChapter = allPerf.length > 0
    ? allPerf.sort((a, b) => a.averageScore - b.averageScore)[0]
    : null;

  // Achievement badges
  const badges = [
    { name: 'First Quiz', icon: '🎯', unlocked: totalQuizzes >= 1, desc: 'Complete your first quiz', color: 'bg-blue-100 text-blue-600' },
    { name: '5 Quizzes Done', icon: '📚', unlocked: totalQuizzes >= 5, desc: 'Complete 5 quizzes', color: 'bg-purple-100 text-purple-600' },
    { name: '10 Quizzes Done', icon: '📖', unlocked: totalQuizzes >= 10, desc: 'Complete 10 quizzes', color: 'bg-indigo-100 text-indigo-600' },
    { name: 'Scored 100%', icon: '💯', unlocked: state.results.some(r => r.percentage === 100), desc: 'Get a perfect score', color: 'bg-green-100 text-green-600' },
    { name: 'Score 90%+', icon: '🏆', unlocked: state.results.some(r => r.percentage >= 90), desc: 'Score 90% or higher', color: 'bg-yellow-100 text-yellow-600' },
    { name: 'Master Subject', icon: '⭐', unlocked: bestSubject && bestSubject[1] >= 85, desc: 'Achieve 85%+ in any subject', color: 'bg-orange-100 text-orange-600' },
    { name: 'Night Owl', icon: '🦉', unlocked: state.results.some(r => {
      const hour = new Date(r.createdAt).getHours();
      return hour >= 22 || hour <= 5;
    }), desc: 'Study late night (10PM-5AM)', color: 'bg-indigo-100 text-indigo-600' },
    { name: 'Early Bird', icon: '�', unlocked: state.results.some(r => {
      const hour = new Date(r.createdAt).getHours();
      return hour >= 5 && hour <= 8;
    }), desc: 'Study early morning (5AM-8AM)', color: 'bg-amber-100 text-amber-600' },
    { name: 'Streak 3 Days', icon: '🔥', unlocked: false, desc: 'Study 3 days in a row', color: 'bg-red-100 text-red-600' },
    { name: 'All Green', icon: '🌟', unlocked: SUBJECT_LIST.some(s => {
      const chapters = SUBJECTS[s].chapters;
      return chapters.length > 0 && chapters.every(c => {
        const key = `${s}|${c}`;
        return state.performance[key]?.status === 'green';
      });
    }), desc: 'All chapters green in a subject', color: 'bg-emerald-100 text-emerald-600' },
    { name: 'Concept Master', icon: '💡', unlocked: state.concepts.length >= 5, desc: 'Get 5+ concept explanations', color: 'bg-cyan-100 text-cyan-600' },
    { name: 'Revision Pro', icon: '📝', unlocked: state.history.filter(h => h.activityType === 'notes').length >= 3, desc: 'Generate 3+ revision notes', color: 'bg-pink-100 text-pink-600' },
  ];

  // Empty state
  if (totalQuizzes === 0) {
    return (
      <div className="p-4 space-y-4">
        <h1 className="text-lg font-bold flex items-center gap-2">
          <BarChart3 size={22} className="text-blue-500" /> Dashboard
        </h1>
        <div className="card text-center py-12">
          <Target size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Take your first quiz to see your performance!</p>
          <button onClick={() => navigate('/')} className="btn-primary">Start Studying</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-5">
      <h1 className="text-lg font-bold flex items-center gap-2">
        <BarChart3 size={22} className="text-blue-500" /> Dashboard
      </h1>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card text-center py-3">
          <BookOpen size={18} className="mx-auto text-blue-500 mb-1" />
          <p className="text-xl font-bold">{totalQuizzes}</p>
          <p className="text-[10px] text-gray-500">Total Quizzes</p>
        </div>
        <div className="card text-center py-3">
          <Target size={18} className="mx-auto text-purple-500 mb-1" />
          <p className="text-xl font-bold">{avgScore}%</p>
          <p className="text-[10px] text-gray-500">Avg Score</p>
        </div>
        <div className="card text-center py-3">
          <Trophy size={18} className="mx-auto text-green-500 mb-1" />
          <p className="text-sm font-bold truncate">{bestSubject ? bestSubject[0] : '—'}</p>
          <p className="text-[10px] text-gray-500">Best Subject</p>
        </div>
        <div className="card text-center py-3">
          <AlertCircle size={18} className="mx-auto text-red-500 mb-1" />
          <p className="text-sm font-bold truncate">{weakestSubject ? weakestSubject[0] : '—'}</p>
          <p className="text-[10px] text-gray-500">Needs Work</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => navigate('/focus')}
          className="card flex items-center gap-3 p-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Timer size={20} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold">Focus Timer</p>
            <p className="text-[10px] text-gray-500">Pomodoro study</p>
          </div>
        </button>
        <button
          onClick={() => navigate('/calendar')}
          className="card flex items-center gap-3 p-3 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <Calendar size={20} className="text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold">Exam Calendar</p>
            <p className="text-[10px] text-gray-500">Add events</p>
          </div>
        </button>
      </div>

      {/* Exam Countdown - Hardcoded for ICSE/CBSE 2026 */}
      <div className="card bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Clock size={16} /> Board Exams 2026
          </h3>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">Feb-March</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-white/10 rounded-lg p-2">
            <p className="text-xl font-bold">{Math.max(0, Math.ceil((new Date('2026-02-15') - new Date()) / (1000 * 60 * 60 * 24)))}</p>
            <p className="text-[10px] opacity-80">Days Left</p>
          </div>
          <div className="bg-white/10 rounded-lg p-2">
            <p className="text-xl font-bold">{Math.max(0, Math.ceil((new Date('2026-02-15') - new Date()) / (1000 * 60 * 60 * 24 * 30)))}</p>
            <p className="text-[10px] opacity-80">Months</p>
          </div>
          <div className="bg-white/10 rounded-lg p-2">
            <p className="text-xl font-bold">{new Date().getFullYear() === 2025 ? 'Class 10' : 'Class 10'}</p>
            <p className="text-[10px] opacity-80">Target</p>
          </div>
        </div>
      </div>

      {/* Suggested Revision */}
      {weakestChapter && (
        <div className="card bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-200 dark:border-red-700">
          <h3 className="text-sm font-semibold text-red-700 dark:text-red-300 mb-1">Suggested Revision</h3>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            Revise <strong>{weakestChapter.chapter}</strong> in <strong>{weakestChapter.subject}</strong> — your average is {weakestChapter.averageScore}%
          </p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => navigate('/notes', { state: { subject: weakestChapter.subject, chapter: weakestChapter.chapter } })}
              className="btn-primary text-xs py-1.5 px-3"
            >
              Get Notes
            </button>
            <button
              onClick={() => navigate('/quiz/config', { state: { subject: weakestChapter.subject, chapter: weakestChapter.chapter } })}
              className="btn-secondary text-xs py-1.5 px-3"
            >
              Take Quiz
            </button>
          </div>
        </div>
      )}

      {/* Subject-wise Breakdown */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Subject Performance</h3>
        {SUBJECT_LIST.map(subject => {
          const chapters = SUBJECTS[subject].chapters;
          const perfEntries = chapters.map(c => state.performance[`${subject}|${c}`]).filter(Boolean);
          if (perfEntries.length === 0) return null;

          const avgSubjectScore = Math.round(perfEntries.reduce((s, p) => s + p.averageScore, 0) / perfEntries.length);
          const isExpanded = expandedSubject === subject;

          return (
            <div key={subject} className="card">
              <button
                onClick={() => setExpandedSubject(isExpanded ? null : subject)}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: SUBJECTS[subject].hex }} />
                  <span className="text-sm font-medium">{subject}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{avgSubjectScore}%</span>
                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </div>
              </button>
              {isExpanded && (
                <div className="mt-2 space-y-1">
                  {chapters.map(ch => {
                    const perf = state.performance[`${subject}|${ch}`];
                    const status = perf?.status;
                    const dotColor = status === 'green' ? 'bg-green-500' : status === 'yellow' ? 'bg-yellow-500' : status === 'red' ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600';
                    return (
                      <div key={ch} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                        <div className={`w-2.5 h-2.5 rounded-full ${dotColor}`} />
                        <span className="text-xs flex-1 truncate">{ch}</span>
                        {perf && <span className="text-xs text-gray-500">{perf.averageScore}%</span>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Achievement Badges */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Award size={16} /> Achievements
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {badges.map((badge) => (
            <div key={badge.name} className={`card text-center py-3 ${!badge.unlocked ? 'opacity-40 grayscale' : ''}`}>
              <span className="text-2xl">{badge.icon}</span>
              <p className="text-xs font-semibold mt-1">{badge.name}</p>
              <p className="text-[10px] text-gray-500">{badge.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
