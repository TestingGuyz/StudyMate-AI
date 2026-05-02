import { useNavigate } from 'react-router-dom';
import { SUBJECTS, getPerformanceBg } from '../data/syllabus';
import { useApp } from '../context/AppContext';
import { Atom, FlaskConical, Calculator, Leaf, Monitor, Landmark, Globe2, BookOpen } from 'lucide-react';

const iconMap = {
  Atom, FlaskConical, Calculator, Leaf, Monitor, Landmark, Globe2, BookOpen
};

export default function SubjectCard({ subject }) {
  const navigate = useNavigate();
  const { state } = useApp();
  const data = SUBJECTS[subject];
  const Icon = iconMap[data.icon] || Atom;

  // Calculate progress for this subject
  const perfEntries = Object.values(state.performance).filter(p => p.subject === subject);
  const chaptersPracticed = perfEntries.length;
  const totalChapters = data.chapters.length;
  const progressPercent = totalChapters > 0 ? Math.round((chaptersPracticed / totalChapters) * 100) : 0;

  return (
    <div
      onClick={() => navigate(`/chapters/${encodeURIComponent(subject)}`)}
      className="card-hover flex flex-col gap-2"
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: data.hex + '20' }}
        >
          <Icon size={20} style={{ color: data.hex }} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm truncate">{subject}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{chaptersPracticed}/{totalChapters} chapters</p>
        </div>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progressPercent}%`, backgroundColor: data.hex }}
        />
      </div>
    </div>
  );
}
