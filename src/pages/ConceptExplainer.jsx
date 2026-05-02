import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { explainConcept, initAI } from '../services/ai';
import Spinner from '../components/Spinner';
import { Search, Lightbulb, AlertTriangle, Link2, Clock, ChevronDown, ChevronUp } from 'lucide-react';

export default function ConceptExplainer() {
  const location = useLocation();
  const { state: appState, addConcept, addHistory } = useApp();
  const [topic, setTopic] = useState(location.state?.topic || '');
  const [simplify, setSimplify] = useState(true);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  const handleExplain = async (e) => {
    e?.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      if (!appState.user.apiKey) {
        setError('Please add your Groq API key in Settings first.');
        setLoading(false);
        return;
      }
      initAI(appState.user.apiKey);
      const data = await explainConcept({
        topic: topic.trim(),
        simplify,
        board: appState.user.board || 'ICSE',
        studentClass: appState.user.class || '10'
      });

      let parsed = data;
      if (typeof data === 'string') {
        try { parsed = JSON.parse(data); } catch { /* use as-is */ }
      }

      setResult(parsed);
      if (parsed.explanation) {
        addConcept(topic.trim(), parsed.explanation, parsed.keyPoints || [], parsed.examMistakes || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to explain concept. Please try again.');
    }
    setLoading(false);
  };

  const handleRelatedTopic = (t) => {
    setTopic(t);
    setResult(null);
    setTimeout(() => {
      const form = document.getElementById('explain-form');
      if (form) form.requestSubmit();
    }, 100);
  };

  return (
    <div className="p-4 space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold flex items-center gap-2">
          <Lightbulb size={22} className="text-yellow-500" /> Concept Explainer
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">Type any topic and get a simple explanation</p>
      </div>

      {/* Search Form */}
      <form id="explain-form" onSubmit={handleExplain} className="space-y-3">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Type any topic or concept..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#16213E] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button type="submit" className="btn-primary px-4" disabled={loading}>
            Explain
          </button>
        </div>

        {/* Simplify Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSimplify(!simplify)}
            className={`relative w-10 h-5 rounded-full transition-colors ${simplify ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${simplify ? 'translate-x-5' : ''}`} />
          </button>
          <span className="text-xs text-gray-600 dark:text-gray-300">Explain like I'm 14</span>
        </div>
      </form>

      {/* Loading */}
      {loading && <Spinner text="Explaining concept..." />}

      {/* Error */}
      {error && (
        <div className="card bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          <button onClick={handleExplain} className="btn-primary mt-2 text-xs">Retry</button>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-4">
          {/* Explanation */}
          <div className="card">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb size={16} className="text-yellow-500" />
              <h3 className="text-sm font-semibold">Explanation</h3>
            </div>
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              {typeof result.explanation === 'string' ? result.explanation : JSON.stringify(result.explanation)}
            </p>
          </div>

          {/* Key Points */}
          {result.keyPoints && Array.isArray(result.keyPoints) && result.keyPoints.length > 0 && (
            <div className="card bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
              <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2">Key Points</h3>
              <ul className="space-y-1">
                {result.keyPoints.map((p, i) => (
                  <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>{typeof p === 'string' ? p : JSON.stringify(p)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Exam Mistakes */}
          {result.examMistakes && Array.isArray(result.examMistakes) && result.examMistakes.length > 0 && (
            <div className="card bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={16} className="text-orange-500" />
                <h3 className="text-sm font-semibold text-orange-700 dark:text-orange-300">Common Exam Mistakes</h3>
              </div>
              <ul className="space-y-1">
                {result.examMistakes.map((m, i) => (
                  <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5">•</span>
                    <span>{typeof m === 'string' ? m : JSON.stringify(m)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Related Topics */}
          {result.relatedTopics && Array.isArray(result.relatedTopics) && result.relatedTopics.length > 0 && (
            <div className="card">
              <div className="flex items-center gap-2 mb-2">
                <Link2 size={16} className="text-purple-500" />
                <h3 className="text-sm font-semibold">Related Topics</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.relatedTopics.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => handleRelatedTopic(typeof t === 'string' ? t : String(t))}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                  >
                    {typeof t === 'string' ? t : String(t)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* History */}
      {appState.concepts.length > 0 && (
        <div className="card">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full flex items-center justify-between"
          >
            <span className="text-sm font-semibold flex items-center gap-2">
              <Clock size={14} /> Recent Explanations
            </span>
            {showHistory ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {showHistory && (
            <div className="mt-2 space-y-1">
              {appState.concepts.slice(-10).reverse().map((c, i) => (
                <button
                  key={i}
                  onClick={() => { setTopic(c.topic); setResult({ explanation: c.explanation, keyPoints: c.keyPoints, examMistakes: c.examMistakes }); }}
                  className="w-full text-left p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
                >
                  {c.topic}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
