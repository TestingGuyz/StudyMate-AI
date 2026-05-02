import { useState, useEffect } from 'react';
import { X, Smartphone, Download } from 'lucide-react';

export default function AppInstallPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed the popup
    const dismissed = localStorage.getItem('studymate_app_popup_dismissed');
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    // Show popup after 5 seconds
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setShowPopup(false);
    setIsDismissed(true);
    localStorage.setItem('studymate_app_popup_dismissed', 'true');
  };

  const handleInstallClick = () => {
    // Open the Expo app download link (placeholder - update with actual link)
    window.open('https://github.com/TestingGuyz/StudyMate-AI/releases', '_blank');
    handleDismiss();
  };

  if (!showPopup || isDismissed) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-4 z-50">
      <div className="card w-full max-w-sm animate-in slide-in-from-bottom-4 duration-300">
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400"
        >
          <X size={18} />
        </button>

        <div className="flex items-start gap-4 pt-2">
          {/* App Icon */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <Smartphone size={32} className="text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold mb-1">Get StudyMate AI App</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Download our mobile app for better experience with offline access, push notifications, and more features!
            </p>

            <div className="flex gap-2">
              <button
                onClick={handleInstallClick}
                className="flex-1 btn-primary py-2.5 flex items-center justify-center gap-2 text-sm"
              >
                <Download size={16} />
                Get the App
              </button>
              <button
                onClick={handleDismiss}
                className="btn-secondary py-2.5 px-4 text-sm"
              >
                Later
              </button>
            </div>
          </div>
        </div>

        {/* Features List */}
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <p className="text-[10px] text-gray-400 uppercase font-medium mb-2">App Features</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Push Notifications
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              Offline Access
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              Account Sync
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              Better Performance
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
