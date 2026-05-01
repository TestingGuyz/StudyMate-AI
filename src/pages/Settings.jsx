import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { initAI } from '../services/ai';
import { Settings as SettingsIcon, User, GraduationCap, Moon, Trash2, Key, Info, ExternalLink } from 'lucide-react';

export default function Settings() {
  const { state, setUser, resetAll } = useApp();
  const [showReset, setShowReset] = useState(false);

  const handleApiKey = (e) => {
    const apiKey = e.target.value.trim();
    setUser({ apiKey });
    if (apiKey) initAI(apiKey);
  };

  return (
    <div className="p-4 space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold flex items-center gap-2">
          <SettingsIcon size={22} className="text-gray-500" /> Settings
        </h1>
      </div>

      {/* API Key */}
      <div className="card">
        <div className="flex items-center gap-2 mb-2">
          <Key size={16} className="text-blue-500" />
          <h3 className="text-sm font-semibold">Groq API Key</h3>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          Required for AI features. Get a free key from{' '}
          <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline inline-flex items-center gap-0.5">
            Groq Console <ExternalLink size={10} />
          </a>{' '}
          (free: 1500 req/min). Key is stored locally in your browser.
        </p>
        <input
          type="password"
          value={state.user.apiKey || ''}
          onChange={handleApiKey}
          placeholder="gsk_... (your Groq API key)"
          className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#1A1A2E] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Profile */}
      <div className="card space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <User size={16} className="text-purple-500" />
          <h3 className="text-sm font-semibold">Profile</h3>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 block">Your Name</label>
          <input
            type="text"
            value={state.user.name || ''}
            onChange={(e) => setUser({ name: e.target.value })}
            placeholder="Enter your name"
            className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#1A1A2E] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 block">Class</label>
          <div className="flex gap-2">
            {['8', '9', '10'].map(c => (
              <button
                key={c}
                onClick={() => setUser({ class: c })}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  state.user.class === c
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                Class {c}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 block">Board</label>
          <div className="flex gap-2">
            {['ICSE', 'CBSE'].map(b => (
              <button
                key={b}
                onClick={() => setUser({ board: b })}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  state.user.board === b
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dark Mode */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Moon size={16} className="text-indigo-500" />
            <span className="text-sm font-semibold">Dark Mode</span>
          </div>
          <button
            onClick={() => setUser({ darkMode: !state.user.darkMode })}
            className={`relative w-10 h-5 rounded-full transition-colors ${state.user.darkMode ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${state.user.darkMode ? 'translate-x-5' : ''}`} />
          </button>
        </div>
      </div>

      {/* Reset */}
      <div className="card">
        <div className="flex items-center gap-2 mb-2">
          <Trash2 size={16} className="text-red-500" />
          <h3 className="text-sm font-semibold">Reset All Data</h3>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          This will delete all your quiz results, performance data, and reminders.
        </p>
        {showReset ? (
          <div className="flex gap-2">
            <button onClick={resetAll} className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-700">
              Confirm Reset
            </button>
            <button onClick={() => setShowReset(false)} className="btn-secondary text-sm">
              Cancel
            </button>
          </div>
        ) : (
          <button onClick={() => setShowReset(true)} className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-4 py-2 rounded-xl text-sm font-medium">
            Reset Data
          </button>
        )}
      </div>

      {/* App Info */}
      <div className="card bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center gap-2 mb-1">
          <Info size={14} className="text-gray-400" />
          <span className="text-xs font-semibold text-gray-500">About</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          StudyMate AI v1.0 — AI-powered study assistant for ICSE/CBSE students (Class 8-10). 
          Built for Hackazrds 3.0 hackathon.
        </p>
      </div>
    </div>
  );
}
