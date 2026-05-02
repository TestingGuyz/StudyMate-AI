import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { generateQuizQuestions, initAI } from '../services/ai';
import QuizTimer from '../components/QuizTimer';
import Spinner from '../components/Spinner';
import { SUBJECTS, DIFFICULTY_TIMER, getGrade } from '../data/syllabus';
import { ArrowLeft, CheckCircle, XCircle, ChevronRight } from 'lucide-react';

export default function QuizMode() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state: appState, addResult } = useApp();
  const config = location.state || {};

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [quizStartTime] = useState(Date.now());
  const [timerActive, setTimerActive] = useState(true);

  const { subject, chapter, questionType, difficulty, count, timerDuration } = config;
  const data = SUBJECTS[subject];

  useEffect(() => {
    if (!subject || !chapter) {
      navigate('/');
      return;
    }
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!appState.user.apiKey) {
        setError('Please add your Groq API key in Settings first.');
        setLoading(false);
        return;
      }
      initAI(appState.user.apiKey);
      const result = await generateQuizQuestions({
        subject,
        chapter,
        difficulty,
        questionType,
        count,
        board: appState.user.board || 'ICSE',
        studentClass: appState.user.class || '10'
      });

      let qs = [];
      if (Array.isArray(result)) {
        qs = result;
      } else if (result && typeof result === 'object') {
        // Try to find the array in the response
        const keys = Object.keys(result);
        for (const key of keys) {
          if (Array.isArray(result[key])) {
            qs = result[key];
            break;
          }
        }
        if (qs.length === 0 && result.question) {
          qs = [result];
        }
      }

      if (qs.length === 0) throw new Error('No questions generated');
      setQuestions(qs);
    } catch (err) {
      setError(err.message || 'Failed to generate questions. Please try again.');
    }
    setLoading(false);
  };

  const handleTimeUp = useCallback(() => {
    if (showFeedback) return;
    setTimerActive(false);
    const q = questions[currentQ];
    const isCorrect = false;
    setShowFeedback(true);
    setAnswers(prev => [...prev, { questionIndex: currentQ, selected: null, correct: q.correct || q.modelAnswer, isCorrect }]);
  }, [currentQ, questions, showFeedback]);

  const handleAnswer = (answer) => {
    if (showFeedback) return;
    setTimerActive(false);
    const q = questions[currentQ];
    const isCorrect = questionType === 'MCQ' ? answer === q.correct : true; // For non-MCQ, we just record
    setSelectedAnswer(answer);
    setShowFeedback(true);
    setAnswers(prev => [...prev, { questionIndex: currentQ, selected: answer, correct: q.correct || q.modelAnswer, isCorrect }]);
  };

  const nextQuestion = () => {
    if (currentQ + 1 >= questions.length) {
      // Quiz done — save results
      const score = answers.filter(a => a.isCorrect).length;
      const percentage = Math.round((score / questions.length) * 100);
      const timeTaken = Math.round((Date.now() - quizStartTime) / 1000);

      const wrongAnswers = answers
        .filter(a => !a.isCorrect)
        .map(a => ({
          question: questions[a.questionIndex]?.question,
          userAnswer: a.selected,
          correctAnswer: a.correct,
          explanation: questions[a.questionIndex]?.explanation
        }));

      addResult({
        subject,
        chapter,
        difficulty,
        questionType,
        score,
        totalQuestions: questions.length,
        percentage,
        timeTaken,
        wrongAnswers
      });

      navigate('/quiz/results', {
        state: {
          score,
          total: questions.length,
          percentage,
          timeTaken,
          wrongAnswers,
          subject,
          chapter,
          difficulty
        }
      });
      return;
    }

    setCurrentQ(prev => prev + 1);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setTimerActive(true);
  };

  if (loading) return <Spinner text="Generating questions..." />;

  if (error) {
    return (
      <div className="p-4 space-y-4">
        <div className="card text-center py-8">
          <XCircle size={40} className="mx-auto text-red-500 mb-3" />
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <div className="flex gap-2 justify-center">
            <button onClick={loadQuestions} className="btn-primary">Retry</button>
            <button onClick={() => navigate(-1)} className="btn-secondary">Go Back</button>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) return <Spinner text="Preparing quiz..." />;

  const q = questions[currentQ];
  const isLast = currentQ + 1 >= questions.length;

  return (
    <div className="p-4 space-y-4 min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
          <ArrowLeft size={20} />
        </button>
        <span className="text-sm font-medium" style={{ color: data?.hex }}>{subject}</span>
        {questionType === 'MCQ' && (
          <QuizTimer duration={timerDuration || 30} onTimeUp={handleTimeUp} isActive={timerActive} />
        )}
      </div>

      {/* Progress */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Question {currentQ + 1} of {questions.length}</span>
          <span>{answers.filter(a => a.isCorrect).length} correct</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill bg-blue-500" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 space-y-4">
        <div className="card">
          <p className="text-sm font-medium leading-relaxed">{q.question}</p>
        </div>

        {/* Options (MCQ) */}
        {questionType === 'MCQ' && q.options && (
          <div className="space-y-2">
            {q.options.map((opt, idx) => {
              const letter = String.fromCharCode(65 + idx); // A, B, C, D
              const isSelected = selectedAnswer === letter;
              const isCorrectOption = q.correct === letter;
              const showCorrect = showFeedback && isCorrectOption;
              const showWrong = showFeedback && isSelected && !isCorrectOption;

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(letter)}
                  disabled={showFeedback}
                  className={`w-full text-left p-3 rounded-xl border-2 transition-all text-sm ${
                    showCorrect
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : showWrong
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : isSelected
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      showCorrect ? 'bg-green-500 text-white' : showWrong ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-600'
                    }`}>
                      {showCorrect ? <CheckCircle size={14} /> : showWrong ? <XCircle size={14} /> : letter}
                    </span>
                    <span>{typeof opt === 'string' && opt.match(/^[A-D]\)/) ? opt.substring(3) : opt}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Short/Long answer display */}
        {questionType !== 'MCQ' && q.modelAnswer && showFeedback && (
          <div className="card bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
            <h4 className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">Model Answer</h4>
            <p className="text-sm">{q.modelAnswer}</p>
            {q.keyPoints && (
              <div className="mt-2">
                <p className="text-xs font-semibold text-gray-500">Key Points:</p>
                <ul className="list-disc list-inside text-xs text-gray-600 dark:text-gray-300">
                  {q.keyPoints.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Feedback */}
        {showFeedback && questionType === 'MCQ' && (
          <div className={`card ${answers[answers.length - 1]?.isCorrect ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'}`}>
            <div className="flex items-center gap-2 mb-1">
              {answers[answers.length - 1]?.isCorrect ? (
                <CheckCircle size={16} className="text-green-600" />
              ) : (
                <XCircle size={16} className="text-red-600" />
              )}
              <span className="text-sm font-semibold">
                {answers[answers.length - 1]?.isCorrect ? 'Correct!' : 'Wrong!'}
              </span>
            </div>
            {q.explanation && <p className="text-xs text-gray-600 dark:text-gray-300">{q.explanation}</p>}
          </div>
        )}
      </div>

      {/* Next Button */}
      {showFeedback && (
        <button
          onClick={nextQuestion}
          className="w-full btn-primary py-3 flex items-center justify-center gap-2"
        >
          {isLast ? 'View Results' : 'Next Question'} <ChevronRight size={18} />
        </button>
      )}
    </div>
  );
}
