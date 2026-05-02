import { useParams, useNavigate } from 'react-router-dom';
import { SUBJECTS } from '../data/syllabus';
import { useApp } from '../context/AppContext';
import { ArrowLeft, HelpCircle, BookOpen, FileText } from 'lucide-react';

export default function ChapterSelector() {
  const { subject } = useParams();
  const decodedSubject = decodeURIComponent(subject);
  const navigate = useNavigate();
  const { state } = useApp();
  const data = SUBJECTS[decodedSubject];

  if (!data) {
    return <div className="p-4 text-center text-gray-500">Subject not found</div>;
  }

  const getChapterStatus = (chapter) => {
    const key = `${decodedSubject}|${chapter}`;
    const perf = state.performance[key];
    if (!perf) return null;
    return perf.status; // 'green', 'yellow', 'red'
  };

  const statusDot = (status) => {
    if (!status) return 'bg-gray-300 dark:bg-gray-600';
    if (status === 'green') return 'bg-green-500';
    if (status === 'yellow') return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/')} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-lg font-bold" style={{ color: data.hex }}>{decodedSubject}</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">{data.chapters.length} chapters</p>
        </div>
      </div>

      {/* Chapters */}
      <div className="space-y-2">
        {data.chapters.map((chapter, idx) => {
          const status = getChapterStatus(chapter);
          return (
            <div key={idx} className="card flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full flex-shrink-0 ${statusDot(status)}`} />
              <span className="flex-1 text-sm font-medium">{chapter}</span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => navigate('/quiz/config', { state: { subject: decodedSubject, chapter } })}
                  className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  title="Take Quiz"
                >
                  <HelpCircle size={18} />
                </button>
                <button
                  onClick={() => navigate('/explain', { state: { topic: chapter } })}
                  className="p-1.5 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                  title="Revise Concept"
                >
                  <BookOpen size={18} />
                </button>
                <button
                  onClick={() => navigate('/notes', { state: { subject: decodedSubject, chapter } })}
                  className="p-1.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400"
                  title="Get Notes"
                >
                  <FileText size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
