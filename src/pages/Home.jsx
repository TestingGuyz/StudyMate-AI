import { useApp } from '../context/AppContext';
import { SUBJECT_LIST, MOTIVATIONAL_QUOTES } from '../data/syllabus';
import SubjectCard from '../components/SubjectCard';
import { BookOpen, Trophy, Target } from 'lucide-react';

export default function Home() {
  const { state } = useApp();
  const totalQuizzes = state.results.length;
  const avgScore = totalQuizzes > 0
    ? Math.round(state.results.reduce((sum, r) => sum + r.percentage, 0) / totalQuizzes)
    : 0;
  const topicsMastered = Object.values(state.performance).filter(p => p.status === 'green').length;
  const quote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];

  return (
    <div className="p-4 space-y-5">
      {/* Header */}
      <div className="text-center pt-2">
        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          StudyMate AI
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your AI Study Companion for ICSE & CBSE</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card text-center py-3">
          <BookOpen size={18} className="mx-auto text-blue-500 mb-1" />
          <p className="text-lg font-bold">{totalQuizzes}</p>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">Quizzes</p>
        </div>
        <div className="card text-center py-3">
          <Target size={18} className="mx-auto text-purple-500 mb-1" />
          <p className="text-lg font-bold">{avgScore}%</p>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">Avg Score</p>
        </div>
        <div className="card text-center py-3">
          <Trophy size={18} className="mx-auto text-green-500 mb-1" />
          <p className="text-lg font-bold">{topicsMastered}</p>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">Mastered</p>
        </div>
      </div>

      {/* Subject Grid */}
      <div>
        <h2 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3">Pick a Subject</h2>
        <div className="grid grid-cols-2 gap-3">
          {SUBJECT_LIST.map(subject => (
            <SubjectCard key={subject} subject={subject} />
          ))}
        </div>
      </div>

      {/* Motivational Quote */}
      <div className="card bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-center py-3">
        <p className="text-sm text-gray-600 dark:text-gray-300">{quote}</p>
      </div>
    </div>
  );
}
