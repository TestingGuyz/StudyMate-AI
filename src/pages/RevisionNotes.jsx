import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { generateRevisionNotes, initAI } from '../services/ai';
import { SUBJECTS, SUBJECT_LIST } from '../data/syllabus';
import Spinner from '../components/Spinner';
import { BookOpen, FileText, HelpCircle, Download, Sigma, Calendar, GitBranch } from 'lucide-react';

export default function RevisionNotes() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state: appState, addHistory } = useApp();

  const [subject, setSubject] = useState(location.state?.subject || '');
  const [chapter, setChapter] = useState(location.state?.chapter || '');
  const [notes, setNotes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const data = subject ? SUBJECTS[subject] : null;
  const chapters = data ? data.chapters : [];
  const isScience = ['Physics', 'Chemistry', 'Mathematics'].includes(subject);
  const isHistory = subject === 'History';
  const isBiology = subject === 'Biology';

  useEffect(() => {
    if (subject && chapter) {
      generateNotes();
    }
  }, [chapter]);

  const generateNotes = async () => {
    if (!subject || !chapter) return;

    setLoading(true);
    setError(null);
    setNotes(null);

    try {
      if (!appState.user.apiKey) {
        setError('Please add your Groq API key in Settings first.');
        setLoading(false);
        return;
      }
      initAI(appState.user.apiKey);
      const result = await generateRevisionNotes({
        subject,
        chapter,
        board: appState.user.board || 'ICSE',
        studentClass: appState.user.class || '10'
      });

      let parsed = result;
      if (typeof result === 'string') {
        try { parsed = JSON.parse(result); } catch { /* use as-is */ }
      }

      setNotes(parsed);
      addHistory(subject, chapter, 'notes');
    } catch (err) {
      setError(err.message || 'Failed to generate notes. Please try again.');
    }
    setLoading(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold flex items-center gap-2">
          <BookOpen size={22} className="text-green-500" /> Revision Notes
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">AI-generated, exam-focused notes</p>
      </div>

      {/* Selectors */}
      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 block">Subject</label>
          <select
            value={subject}
            onChange={(e) => { setSubject(e.target.value); setChapter(''); setNotes(null); }}
            className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#16213E] text-sm"
          >
            <option value="">Select subject</option>
            {SUBJECT_LIST.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        {subject && (
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 block">Chapter</label>
            <select
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#16213E] text-sm"
            >
              <option value="">Select chapter</option>
              {chapters.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && <Spinner text="Generating revision notes..." />}

      {/* Error */}
      {error && (
        <div className="card bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          <button onClick={generateNotes} className="btn-primary mt-2 text-xs">Retry</button>
        </div>
      )}

      {/* Notes Content */}
      {notes && (
        <div className="space-y-4">
          <h2 className="text-base font-bold" style={{ color: data?.hex }}>{notes.title || chapter}</h2>

          {/* Sections */}
          {notes.sections && Array.isArray(notes.sections) && notes.sections.map((section, i) => (
            <div key={i} className="card">
              <h3 className="text-sm font-semibold mb-2" style={{ color: data?.hex }}>{section.heading}</h3>
              <ul className="space-y-1">
                {section.points?.map((p, j) => (
                  <li key={j} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                    <span style={{ color: data?.hex }}>•</span>
                    <span>{typeof p === 'string' ? p : JSON.stringify(p)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Formulas (Science/Maths) */}
          {isScience && notes.formulas && Array.isArray(notes.formulas) && notes.formulas.length > 0 && (
            <div className="card bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700">
              <div className="flex items-center gap-2 mb-2">
                <Sigma size={16} className="text-purple-600 dark:text-purple-400" />
                <h3 className="text-sm font-semibold text-purple-700 dark:text-purple-300">Key Formulas</h3>
              </div>
              <div className="space-y-2">
                {notes.formulas.map((f, i) => (
                  <div key={i} className="p-2 rounded-lg bg-white dark:bg-[#1A1A2E] border border-purple-100 dark:border-purple-800">
                    <p className="text-sm font-mono font-bold text-purple-700 dark:text-purple-300">
                      {typeof f === 'object' ? f.formula : f}
                    </p>
                    {typeof f === 'object' && f.description && (
                      <p className="text-xs text-gray-500 mt-0.5">{f.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Dates (History) */}
          {isHistory && notes.keyDates && Array.isArray(notes.keyDates) && notes.keyDates.length > 0 && (
            <div className="card bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={16} className="text-red-600 dark:text-red-400" />
                <h3 className="text-sm font-semibold text-red-700 dark:text-red-300">Important Dates</h3>
              </div>
              <div className="space-y-2">
                {notes.keyDates.map((d, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{typeof d === 'object' ? d.event : d}</p>
                      {typeof d === 'object' && d.date && (
                        <p className="text-xs text-red-600 dark:text-red-400">{d.date}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Processes (Biology) */}
          {isBiology && notes.keyProcesses && Array.isArray(notes.keyProcesses) && notes.keyProcesses.length > 0 && (
            <div className="card bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700">
              <div className="flex items-center gap-2 mb-2">
                <GitBranch size={16} className="text-green-600 dark:text-green-400" />
                <h3 className="text-sm font-semibold text-green-700 dark:text-green-300">Key Processes</h3>
              </div>
              <div className="space-y-3">
                {notes.keyProcesses.map((p, i) => (
                  <div key={i}>
                    <p className="text-sm font-semibold">{typeof p === 'object' ? p.name : p}</p>
                    {typeof p === 'object' && p.steps && (
                      <ol className="list-decimal list-inside ml-2 mt-1">
                        {p.steps.map((s, j) => (
                          <li key={j} className="text-xs text-gray-600 dark:text-gray-400">{s}</li>
                        ))}
                      </ol>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Terms (Other subjects) */}
          {!isScience && !isHistory && !isBiology && notes.keyTerms && Array.isArray(notes.keyTerms) && notes.keyTerms.length > 0 && (
            <div className="card bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-700">
              <h3 className="text-sm font-semibold text-pink-700 dark:text-pink-300 mb-2">Key Terms</h3>
              <div className="space-y-1">
                {notes.keyTerms.map((t, i) => (
                  <div key={i} className="text-sm">
                    <span className="font-semibold">{typeof t === 'object' ? t.term : t}:</span>
                    {typeof t === 'object' && t.definition && <span className="text-gray-600 dark:text-gray-300"> {t.definition}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button onClick={handlePrint} className="flex-1 btn-secondary py-2.5 flex items-center justify-center gap-2">
              <Download size={16} /> Download
            </button>
            <button
              onClick={() => navigate('/quiz/config', { state: { subject, chapter } })}
              className="flex-1 btn-primary py-2.5 flex items-center justify-center gap-2"
            >
              <HelpCircle size={16} /> Test Yourself
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
