import { createContext, useContext, useReducer, useEffect } from 'react';
import { storage } from '../utils/storage';

const AppContext = createContext();

const initialState = {
  user: storage.getUser(),
  results: storage.getResults(),
  performance: storage.getPerformance(),
  reminders: storage.getReminders(),
  history: storage.getHistory(),
  concepts: storage.getConcepts(),
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'ADD_RESULT':
      return { ...state, results: [...state.results, action.payload] };
    case 'UPDATE_PERFORMANCE':
      return { ...state, performance: action.payload };
    case 'SET_REMINDERS':
      return { ...state, reminders: action.payload };
    case 'ADD_HISTORY':
      return { ...state, history: [...state.history, action.payload] };
    case 'ADD_CONCEPT':
      return { ...state, concepts: [...state.concepts, action.payload] };
    case 'RESET_ALL':
      return { ...initialState, user: { name: '', class: '10', board: 'ICSE', darkMode: false } };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    storage.setUser(state.user);
    if (state.user.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.user]);

  const setUser = (user) => {
    dispatch({ type: 'SET_USER', payload: { ...state.user, ...user } });
  };

  const addResult = (result) => {
    const saved = storage.addResult(result);
    const perf = storage.updatePerformance(result.subject, result.chapter, result.percentage);
    storage.addOrUpdateReminder(result.subject, result.chapter);
    storage.addHistory(result.subject, result.chapter, 'quiz');
    dispatch({ type: 'ADD_RESULT', payload: saved });
    dispatch({ type: 'UPDATE_PERFORMANCE', payload: perf });
    dispatch({ type: 'SET_REMINDERS', payload: storage.getReminders() });
    dispatch({ type: 'ADD_HISTORY', payload: { subject: result.subject, chapter: result.chapter, activityType: 'quiz', createdAt: new Date().toISOString() } });
  };

  const updateReminders = () => {
    dispatch({ type: 'SET_REMINDERS', payload: storage.getReminders() });
  };

  const markRevised = (id) => {
    storage.markRevised(id);
    dispatch({ type: 'SET_REMINDERS', payload: storage.getReminders() });
  };

  const addConcept = (topic, explanation, keyPoints, examMistakes) => {
    storage.addConcept(topic, explanation, keyPoints, examMistakes);
    dispatch({ type: 'ADD_CONCEPT', payload: { topic, explanation, keyPoints, examMistakes, createdAt: new Date().toISOString() } });
  };

  const addHistory = (subject, chapter, activityType) => {
    storage.addHistory(subject, chapter, activityType);
    dispatch({ type: 'ADD_HISTORY', payload: { subject, chapter, activityType, createdAt: new Date().toISOString() } });
  };

  const resetAll = () => {
    storage.resetAll();
    dispatch({ type: 'RESET_ALL' });
  };

  return (
    <AppContext.Provider value={{ state, setUser, addResult, updateReminders, markRevised, addConcept, addHistory, resetAll }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
