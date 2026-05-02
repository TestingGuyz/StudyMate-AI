import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SUBJECTS, DIFFICULTY_TIMER } from '../data/syllabus';
import { ArrowLeft, Play } from 'lucide-react';

export default function QuizConfig() {
  const location = useLocation();
  const navigate = useNavigate();
  const { subject, chapter } = location.state || {};

  const [questionType, setQuestionType] = useState('MCQ');
  const [difficulty, setDifficulty] = useState('Medium');
  const [count, setCount] = useState(5);

  if (!subject || !chapter) {
    return <div className="p-4 text-center text-gray-500">No chapter selected. Go back and pick a chapter.</div>;
  }

  const data = SUBJECTS[subject];

  const startQuiz = () => {
    navigate('/quiz/play', {
      state: {
        subject,
        chapter,
        questionType,
        difficulty,
        count,
        timerDuration: DIFFICULTY_TIMER[difficulty]
      }
    });
  };

  return (
    <div className="p-4 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-lg font-bold" style={{ color: data?.hex }}>{subject}</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">{chapter}</p>
        </div>
      </div>

      {/* Config Cards */}
      <div className="space-y-4">
        {/* Question Type */}
        <div className="card">
          <h3 className="text-sm font-semibold mb-3">Question Type</h3>
          <div className="flex gap-2">
            {['MCQ', 'Short', 'Long'].map(type => (
              <button
                key={type}
                onClick={() => setQuestionType(type)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  questionType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {type === 'MCQ' ? 'MCQ' : type === 'Short' ? 'Short Answer' : 'Long Answer'}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div className="card">
          <h3 className="text-sm font-semibold mb-3">Difficulty</h3>
          <div className="flex gap-2">
            {['Easy', 'Medium', 'Hard'].map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  difficulty === d
                    ? d === 'Easy' ? 'bg-green-600 text-white' : d === 'Medium' ? 'bg-yellow-600 text-white' : 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {d} ({DIFFICULTY_TIMER[d]}s)
              </button>
            ))}
          </div>
        </div>

        {/* Number of Questions */}
        <div className="card">
          <h3 className="text-sm font-semibold mb-3">Number of Questions</h3>
          <div className="flex gap-2">
            {[5, 10, 15].map(n => (
              <button
                key={n}
                onClick={() => setCount(n)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  count === n
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Start Button */}
      <button
        onClick={startQuiz}
        className="w-full btn-primary py-3 flex items-center justify-center gap-2 text-base"
      >
        <Play size={20} />
        Start Quiz
      </button>
    </div>
  );
}
