import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain, Settings, CheckCircle, Volume2, VolumeX } from 'lucide-react';

const TIMER_PRESETS = {
  pomodoro: { work: 25, break: 5, longBreak: 15, cycles: 4 },
  short: { work: 15, break: 3, longBreak: 10, cycles: 4 },
  long: { work: 50, break: 10, longBreak: 30, cycles: 3 },
  exam: { work: 45, break: 5, longBreak: 15, cycles: 3 },
};

export default function FocusTimer() {
  const [preset, setPreset] = useState('pomodoro');
  const [timeLeft, setTimeLeft] = useState(TIMER_PRESETS.pomodoro.work * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work'); // work, break, longBreak
  const [cycle, setCycle] = useState(1);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [customTimes, setCustomTimes] = useState(TIMER_PRESETS.pomodoro);
  
  const audioRef = useRef(null);
  const timerRef = useRef(null);

  const currentConfig = preset === 'custom' ? customTimes : TIMER_PRESETS[preset];

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft]);

  const handleComplete = () => {
    if (soundEnabled) playNotificationSound();
    
    if (mode === 'work') {
      setCompletedSessions(prev => prev + 1);
      const nextCycle = cycle + 1;
      
      if (nextCycle > currentConfig.cycles) {
        // All cycles complete
        setMode('longBreak');
        setTimeLeft(currentConfig.longBreak * 60);
        setCycle(1);
      } else {
        // Regular break
        setMode('break');
        setTimeLeft(currentConfig.break * 60);
        setCycle(nextCycle);
      }
    } else {
      // Break complete, back to work
      setMode('work');
      setTimeLeft(currentConfig.work * 60);
    }
    setIsActive(false);
  };

  const playNotificationSound = () => {
    try {
      const audio = new Audio();
      audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZSA0PVanu87plHQUuh9Dz2YU2Bhxqv+zplkcODVGm5O+4ZSAEMYrO89GFNwYdcfDr4ZdJDQtPp+XyxGUhBjqT1/PQhTYGH3Dw6uGXSA0MTKjl8cpmIAU2jc7zzYU1Bhxw8OrhlUgNC1Gn5O/EZSAFNo/M89CEMwYdcfDr4pVHDAtQp+TwxWUgBTePzvPXhTYGHXHw6+GVSQwsSZ8HwxmUgBDePzvPWgjEGG3Dw6+KWSA0LUqjl8b1kHwU3jc7z2YU1Bhxw8OvgmUgNC1Ko5fC+ZSAF';
      audio.play().catch(() => {});
    } catch {}
  };

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setMode('work');
    setCycle(1);
    setTimeLeft(currentConfig.work * 60);
  };

  const skipToNext = () => {
    setIsActive(false);
    handleComplete();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const getProgress = () => {
    const total = mode === 'work' ? currentConfig.work * 60 : 
                  mode === 'break' ? currentConfig.break * 60 : 
                  currentConfig.longBreak * 60;
    return ((total - timeLeft) / total) * 100;
  };

  const getModeColor = () => {
    switch (mode) {
      case 'work': return 'from-blue-500 to-indigo-600';
      case 'break': return 'from-green-500 to-emerald-600';
      case 'longBreak': return 'from-purple-500 to-violet-600';
      default: return 'from-blue-500 to-indigo-600';
    }
  };

  const getModeIcon = () => {
    switch (mode) {
      case 'work': return <Brain size={24} />;
      case 'break': return <Coffee size={24} />;
      case 'longBreak': return <Coffee size={24} />;
      default: return <Brain size={24} />;
    }
  };

  return (
    <div className="p-4 space-y-5 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold flex items-center gap-2">
          <Brain size={22} className="text-blue-500" /> Focus Timer
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {Object.entries(TIMER_PRESETS).map(([key, config]) => (
          <button
            key={key}
            onClick={() => {
              setPreset(key);
              setCustomTimes(config);
              resetTimer();
            }}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              preset === key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
            }`}
          >
            {key === 'pomodoro' ? 'Pomodoro' : key === 'short' ? 'Short' : key === 'long' ? 'Deep Work' : 'Exam Mode'}
            <span className="block text-[10px] opacity-80">{config.work}min work / {config.break}min break</span>
          </button>
        ))}
      </div>

      {/* Main Timer */}
      <div className="card py-8 relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${getModeColor()} opacity-5`} />
        
        {/* Progress Ring */}
        <div className="relative w-48 h-48 mx-auto mb-6">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 88}
              strokeDashoffset={2 * Math.PI * 88 * (1 - getProgress() / 100)}
              strokeLinecap="round"
              className={`text-blue-500 transition-all duration-1000`}
              style={{
                filter: mode === 'work' ? 'hue-rotate(0deg)' : mode === 'break' ? 'hue-rotate(100deg)' : 'hue-rotate(200deg)'
              }}
            />
          </svg>
          
          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={`p-3 rounded-full bg-gradient-to-br ${getModeColor()} text-white mb-2`}>
              {getModeIcon()}
            </div>
            <div className="text-4xl font-bold tabular-nums">
              {formatTime(timeLeft)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 capitalize mt-1">
              {mode === 'longBreak' ? 'Long Break' : mode}
            </div>
          </div>
        </div>

        {/* Cycle Indicators */}
        <div className="flex justify-center gap-2 mb-6">
          {Array.from({ length: currentConfig.cycles }).map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all ${
                i < cycle - (mode === 'work' ? 1 : 0)
                  ? 'bg-green-500'
                  : i === cycle - (mode === 'work' ? 1 : 0) && mode === 'work'
                  ? 'bg-blue-500 animate-pulse'
                  : 'bg-gray-200 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-3">
          <button
            onClick={resetTimer}
            className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <RotateCcw size={20} />
          </button>
          
          <button
            onClick={toggleTimer}
            className={`p-4 rounded-2xl text-white transition-all transform active:scale-95 ${
              isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isActive ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
          </button>
          
          <button
            onClick={skipToNext}
            className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <CheckCircle size={20} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card text-center py-3">
          <p className="text-2xl font-bold text-blue-600">{completedSessions}</p>
          <p className="text-[10px] text-gray-500">Sessions Done</p>
        </div>
        <div className="card text-center py-3">
          <p className="text-2xl font-bold text-purple-600">
            {Math.floor(completedSessions * currentConfig.work / 60)}h {completedSessions * currentConfig.work % 60}m
          </p>
          <p className="text-[10px] text-gray-500">Focus Time</p>
        </div>
        <div className="card text-center py-3">
          <p className="text-2xl font-bold text-green-600">{cycle}/{currentConfig.cycles}</p>
          <p className="text-[10px] text-gray-500">Current Cycle</p>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="card space-y-4">
          <h3 className="text-sm font-semibold">Timer Settings</h3>
          
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] text-gray-500 mb-1 block">Work (min)</label>
              <input
                type="number"
                value={customTimes.work}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1;
                  setCustomTimes({ ...customTimes, work: val });
                  if (mode === 'work') setTimeLeft(val * 60);
                }}
                className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-600 text-sm"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 mb-1 block">Break (min)</label>
              <input
                type="number"
                value={customTimes.break}
                onChange={(e) => setCustomTimes({ ...customTimes, break: parseInt(e.target.value) || 1 })}
                className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-600 text-sm"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 mb-1 block">Long Break (min)</label>
              <input
                type="number"
                value={customTimes.longBreak}
                onChange={(e) => setCustomTimes({ ...customTimes, longBreak: parseInt(e.target.value) || 1 })}
                className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-600 text-sm"
              />
            </div>
          </div>
          
          <button
            onClick={() => setShowSettings(false)}
            className="w-full btn-primary py-2 text-sm"
          >
            Save Settings
          </button>
        </div>
      )}

      {/* Tips */}
      <div className="card bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
        <h4 className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-2">Focus Tips</h4>
        <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
          <li>• Put your phone in another room</li>
          <li>• Use the break to stretch or walk</li>
          <li>• Close all unnecessary tabs</li>
          <li>• Keep water nearby</li>
        </ul>
      </div>
    </div>
  );
}
