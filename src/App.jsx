import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useApp } from './context/AppContext';
import { initAI } from './services/ai';
import Layout from './components/Layout';
import Home from './pages/Home';
import ChapterSelector from './pages/ChapterSelector';
import QuizConfig from './pages/QuizConfig';
import QuizMode from './pages/QuizMode';
import QuizResults from './pages/QuizResults';
import ConceptExplainer from './pages/ConceptExplainer';
import Dashboard from './pages/Dashboard';
import RevisionNotes from './pages/RevisionNotes';
import Reminders from './pages/Reminders';
import Settings from './pages/Settings';

function App() {
  const { state } = useApp();

  useEffect(() => {
    if (state.user.apiKey) {
      initAI(state.user.apiKey);
    }
    if (state.user.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.user.apiKey, state.user.darkMode]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chapters/:subject" element={<ChapterSelector />} />
        <Route path="/quiz/config" element={<QuizConfig />} />
        <Route path="/quiz/play" element={<QuizMode />} />
        <Route path="/quiz/results" element={<QuizResults />} />
        <Route path="/explain" element={<ConceptExplainer />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/notes" element={<RevisionNotes />} />
        <Route path="/reminders" element={<Reminders />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  );
}

export default App;
