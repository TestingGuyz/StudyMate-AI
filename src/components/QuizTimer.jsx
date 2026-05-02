import { useEffect, useState } from 'react';

export default function QuizTimer({ duration, onTimeUp, isActive }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) {
      if (timeLeft <= 0 && isActive) onTimeUp();
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isActive, onTimeUp]);

  const percent = (timeLeft / duration) * 100;
  const color = timeLeft > duration * 0.5 ? 'bg-green-500' : timeLeft > duration * 0.25 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="flex items-center gap-2">
      <div className="progress-bar w-24">
        <div className={`progress-fill ${color}`} style={{ width: `${percent}%` }} />
      </div>
      <span className={`text-sm font-mono font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'}`}>
        {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
      </span>
    </div>
  );
}
