import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar as CalendarIcon, Plus, Trash2, Clock, BookOpen, AlertCircle, ChevronLeft, ChevronRight, GraduationCap } from 'lucide-react';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function Calendar() {
  const { state, setUser } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('studymate_events');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'ICSE Board Exams Begin', date: '2026-02-15', type: 'exam', subject: 'All Subjects' },
      { id: '2', title: 'CBSE Board Exams Begin', date: '2026-02-20', type: 'exam', subject: 'All Subjects' },
      { id: '3', title: 'Pre-Board 1', date: '2025-12-15', type: 'exam', subject: 'All Subjects' },
      { id: '4', title: 'Pre-Board 2', date: '2026-01-15', type: 'exam', subject: 'All Subjects' },
    ];
  });
  const [newEvent, setNewEvent] = useState({ title: '', type: 'study', subject: '', time: '' });

  useEffect(() => {
    localStorage.setItem('studymate_events', JSON.stringify(events));
  }, [events]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date().toDateString();

  const getEventsForDate = (dateStr) => events.filter(e => e.date === dateStr);

  const addEvent = () => {
    if (!newEvent.title) return;
    const dateStr = selectedDate.toISOString().split('T')[0];
    const event = {
      id: Date.now().toString(),
      ...newEvent,
      date: dateStr
    };
    setEvents([...events, event]);
    setNewEvent({ title: '', type: 'study', subject: '', time: '' });
    setShowAddModal(false);
  };

  const deleteEvent = (id) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const getDaysUntil = (dateStr) => {
    const diff = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? `${diff} days left` : diff === 0 ? 'Today!' : 'Passed';
  };

  const upcomingEvents = events
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold flex items-center gap-2">
          <CalendarIcon size={22} className="text-purple-500" /> Exam Calendar
        </h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Exam Countdown Banner */}
      <div className="card bg-gradient-to-r from-red-500 to-orange-500 text-white">
        <div className="flex items-center gap-2 mb-2">
          <GraduationCap size={18} />
          <span className="text-sm font-semibold">Board Exams 2026</span>
        </div>
        <div className="text-2xl font-bold">
          {Math.max(0, Math.ceil((new Date('2026-02-15') - new Date()) / (1000 * 60 * 60 * 24)))} Days
        </div>
        <p className="text-xs opacity-90">Until ICSE/CBSE exams begin</p>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between card py-2">
        <button
          onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="text-sm font-semibold">{MONTHS[month]} {year}</span>
        <button
          onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="card">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-center text-[10px] font-medium text-gray-500 py-1">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayEvents = getEventsForDate(dateStr);
            const isToday = new Date(dateStr).toDateString() === today;
            const isSelected = selectedDate.toISOString().split('T')[0] === dateStr;
            
            return (
              <button
                key={day}
                onClick={() => setSelectedDate(new Date(dateStr))}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm relative transition-all ${
                  isSelected 
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' 
                    : isToday
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <span className={isToday ? 'font-bold' : ''}>{day}</span>
                {dayEvents.length > 0 && (
                  <div className="flex gap-0.5 mt-0.5">
                    {dayEvents.slice(0, 3).map((e, j) => (
                      <div 
                        key={j} 
                        className={`w-1.5 h-1.5 rounded-full ${
                          e.type === 'exam' ? 'bg-red-500' : e.type === 'study' ? 'bg-blue-500' : 'bg-green-500'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Date Events */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">
            {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </h3>
          <button
            onClick={() => setShowAddModal(true)}
            className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-1 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50"
          >
            + Add Event
          </button>
        </div>
        <div className="space-y-2">
          {getEventsForDate(selectedDate.toISOString().split('T')[0]).length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No events for this day</p>
          ) : (
            getEventsForDate(selectedDate.toISOString().split('T')[0]).map(event => (
              <div key={event.id} className={`p-3 rounded-xl flex items-center gap-3 ${
                event.type === 'exam' ? 'bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800' :
                event.type === 'study' ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800' :
                'bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800'
              }`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  event.type === 'exam' ? 'bg-red-100 dark:bg-red-900/40 text-red-600' :
                  event.type === 'study' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600' :
                  'bg-green-100 dark:bg-green-900/40 text-green-600'
                }`}>
                  {event.type === 'exam' ? <GraduationCap size={18} /> :
                   event.type === 'study' ? <BookOpen size={18} /> :
                   <Clock size={18} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{event.title}</p>
                  {event.subject && <p className="text-[10px] text-gray-500">{event.subject}</p>}
                  {event.time && <p className="text-[10px] text-gray-500">{event.time}</p>}
                </div>
                {!['1', '2', '3', '4'].includes(event.id) && (
                  <button
                    onClick={() => deleteEvent(event.id)}
                    className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="card">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <AlertCircle size={16} className="text-orange-500" /> Upcoming
        </h3>
        <div className="space-y-2">
          {upcomingEvents.map(event => (
            <div key={event.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className={`w-2 h-2 rounded-full ${
                event.type === 'exam' ? 'bg-red-500' : event.type === 'study' ? 'bg-blue-500' : 'bg-green-500'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{event.title}</p>
                <p className="text-[10px] text-gray-500">
                  {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  {' · '}
                  <span className={new Date(event.date) - new Date() < 7 * 24 * 60 * 60 * 1000 ? 'text-red-500 font-medium' : ''}>
                    {getDaysUntil(event.date)}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="card w-full max-w-sm space-y-4">
            <h3 className="text-lg font-semibold">Add Event</h3>
            
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 block">Title</label>
              <input
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="e.g., Physics Mock Test"
                className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#16213E] text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 block">Type</label>
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#16213E] text-sm"
                >
                  <option value="study">Study Session</option>
                  <option value="exam">Exam/Test</option>
                  <option value="reminder">Reminder</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 block">Subject</label>
                <input
                  type="text"
                  value={newEvent.subject}
                  onChange={(e) => setNewEvent({ ...newEvent, subject: e.target.value })}
                  placeholder="e.g., Physics"
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#16213E] text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 block">Time (optional)</label>
              <input
                type="time"
                value={newEvent.time}
                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#16213E] text-sm"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={addEvent}
                className="flex-1 btn-primary"
              >
                Add Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
