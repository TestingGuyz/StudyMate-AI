import { NavLink, useLocation } from 'react-router-dom';
import { Home, HelpCircle, Lightbulb, BarChart3, BookOpen, Settings } from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/explain', icon: Lightbulb, label: 'Explain' },
  { to: '/dashboard', icon: BarChart3, label: 'Dashboard' },
  { to: '/notes', icon: BookOpen, label: 'Notes' },
  { to: '/reminders', icon: HelpCircle, label: 'Remind' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Layout({ children }) {
  const location = useLocation();
  const isQuiz = location.pathname.startsWith('/quiz');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1A1A2E] flex flex-col">
      <main className={`flex-1 ${isQuiz ? '' : 'pb-20'} max-w-2xl mx-auto w-full`}>
        {children}
      </main>
      {!isQuiz && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#16213E] border-t border-gray-200 dark:border-gray-700 z-50">
          <div className="max-w-2xl mx-auto flex justify-around items-center h-16">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`
                }
              >
                <Icon size={20} />
                <span className="text-[10px] font-medium">{label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
