import { useLocation, useNavigate } from 'react-router-dom';
import { SUBJECTS, getGrade } from '../data/syllabus';
import { Trophy, ArrowLeft, RotateCcw, Home, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export default function QuizResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showWrong, setShowWrong] = useState(false);
  const result = location.state || {};

  if (!result.score && result.score !== 0) {
    return <div className="p-4 text-center text-gray-500">No results to show</div>;
  }

  const { score, total, percentage, timeTaken, wrongAnswers, subject, chapter, difficulty } = result;
  const gradeInfo = getGrade(percentage);
  const data = SUBJECTS[subject];
  const mins = Math.floor(timeTaken / 60);
  const secs = timeTaken % 60;

  return (
    <div className="p-4 space-y-5">
      {/* Score Card */}
      <div className="card text-center py-8" style={{ borderColor: data?.hex + '40' }}>
        <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-3"
          style={{ backgroundColor: data?.hex + '20' }}>
          <Trophy size={36} style={{ color: data?.hex }} />
        </div>
        <h2 className="text-4xl font-extrabold">{score}/{total}</h2>
        <p className="text-2xl font-bold mt-1">{percentage}%</p>
        <div className="mt-2 inline-flex items-center gap-2 px-4 py-1 rounded-full text-sm font-bold"
          style={{ backgroundColor: gradeInfo.color.includes('green') ? '#10B98120' : gradeInfo.color.includes('blue') ? '#3B82F620' : gradeInfo.color.includes('yellow') ? '#F59E0B20' : '#EF444420' }}>
          <span className={gradeInfo.color}>Grade {gradeInfo.grade}</span>
          <span className="text-gray-500 dark:text-gray-400">— {gradeInfo.label}</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Time: {mins}m {secs}s | {difficulty}
        </p>
      </div>

      {/* Chapter Info */}
      <div className="card">
        <p className="text-xs text-gray-500 dark:text-gray-400">Subject</p>
        <p className="text-sm font-semibold" style={{ color: data?.hex }}>{subject}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Chapter</p>
        <p className="text-sm">{chapter}</p>
      </div>

      {/* Wrong Answers */}
      {wrongAnswers && wrongAnswers.length > 0 && (
        <div className="card">
          <button
            onClick={() => setShowWrong(!showWrong)}
            className="w-full flex items-center justify-between"
          >
            <span className="text-sm font-semibold text-red-600 dark:text-red-400">
              {wrongAnswers.length} Wrong Answer{wrongAnswers.length > 1 ? 's' : ''}
            </span>
            {showWrong ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {showWrong && (
            <div className="mt-3 space-y-3">
              {wrongAnswers.map((w, i) => (
                <div key={i} className="p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800">
                  <p className="text-sm font-medium">{w.question}</p>
                  {w.userAnswer && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">Your answer: {w.userAnswer}</p>
                  )}
                  <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">Correct: {w.correctAnswer}</p>
                  {w.explanation && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">{w.explanation}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => navigate('/quiz/config', { state: { subject, chapter } })}
          className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"
        >
          <RotateCcw size={18} /> Retry
        </button>
        <button
          onClick={() => navigate('/')}
          className="flex-1 btn-secondary py-3 flex items-center justify-center gap-2"
        >
          <Home size={18} /> Home
        </button>
      </div>
    </div>
  );
}
