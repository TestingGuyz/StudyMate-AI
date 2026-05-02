import { useApp } from '../context/AppContext';
import { SUBJECTS } from '../data/syllabus';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function Reminders() {
  const { state, markRevised } = useApp();
  const navigate = useNavigate();

  const now = new Date();
  const reminders = state.reminders.map(r => {
    const next = new Date(r.nextRevision);
    const diffDays = Math.ceil((next - now) / (1000 * 60 * 60 * 24));
    let urgency = 'upcoming';
    if (diffDays <= 0) urgency = 'overdue';
    else if (diffDays <= 1) urgency = 'due';
    return { ...r, urgency, diffDays };
  }).sort((a, b) => {
    const order = { overdue: 0, due: 1, upcoming: 2 };
    return (order[a.urgency] || 2) - (order[b.urgency] || 2);
  });

  const overdueCount = reminders.filter(r => r.urgency === 'overdue').length;

  const handleMarkRevised = (id) => {
    markRevised(id);
  };

  const urgencyStyle = (urgency) => {
    switch (urgency) {
      case 'overdue': return 'border-l-4 border-l-red-500 bg-red-50 dark:bg-red-900/10';
      case 'due': return 'border-l-4 border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/10';
      default: return 'border-l-4 border-l-green-500';
    }
  };

  const urgencyBadge = (urgency, diffDays) => {
    switch (urgency) {
      case 'overdue': return <span className="text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-full">OVERDUE</span>;
      case 'due': return <span className="text-[10px] font-bold text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-0.5 rounded-full">DUE TODAY</span>;
      default: return <span className="text-[10px] text-gray-500 dark:text-gray-400">In {diffDays} day{diffDays !== 1 ? 's' : ''}</span>;
    }
  };

  return (
    <div className="p-4 space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold flex items-center gap-2">
          <Bell size={22} className="text-orange-500" />
          Reminders
          {overdueCount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{overdueCount}</span>
          )}
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">Spaced repetition — revise before you forget</p>
      </div>

      {/* Empty State */}
      {reminders.length === 0 && (
        <div className="card text-center py-12">
          <Clock size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-sm text-gray-500 dark:text-gray-400">No reminders yet. Take a quiz to start tracking!</p>
          <button onClick={() => navigate('/')} className="btn-primary mt-3">Start Studying</button>
        </div>
      )}

      {/* Reminder List */}
      <div className="space-y-2">
        {reminders.map(r => {
          const sData = SUBJECTS[r.subject];
          return (
            <div key={r.id} className={`card ${urgencyStyle(r.urgency)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: sData?.hex }} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{r.chapter}</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">{r.subject}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {urgencyBadge(r.urgency, r.diffDays)}
                  <button
                    onClick={() => handleMarkRevised(r.id)}
                    className="p-1.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400"
                    title="Mark as Revised"
                  >
                    <CheckCircle size={18} />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-1.5 text-[10px] text-gray-400">
                <span>Last studied: {new Date(r.lastStudied).toLocaleDateString()}</span>
                <span>Revise by: {new Date(r.nextRevision).toLocaleDateString()}</span>
                <span>Revisions: {r.revisionCount}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info */}
      <div className="card bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
        <div className="flex items-center gap-2 mb-1">
          <AlertCircle size={14} className="text-blue-500" />
          <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">How it works</span>
        </div>
        <p className="text-[10px] text-gray-600 dark:text-gray-400">
          After each quiz, we schedule revision reminders based on the forgetting curve: 
          1 day → 3 days → 7 days → 14 days → 30 days. Mark topics as revised to reset the timer.
        </p>
      </div>
    </div>
  );
}
