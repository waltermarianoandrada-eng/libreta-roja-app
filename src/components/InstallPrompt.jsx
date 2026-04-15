import React, { useState, useEffect } from 'react';
import { DownloadCloud, X } from 'lucide-react';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      // Clear the deferredPrompt so it can be garbage collected
      setDeferredPrompt(null);
      setIsInstallable(false);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    await deferredPrompt.userChoice;
    // We've used the prompt, and can't use it again
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  if (!isInstallable || isHidden) return null;

  return (
    <div className="fixed bottom-24 md:bottom-10 right-4 z-[60] animate-in slide-in-from-bottom-5 fade-in duration-500">
      <div className="bg-slate-900 shadow-xl border border-slate-700 p-1.5 pl-4 pr-1.5 rounded-full flex items-center gap-3">
        <button 
          onClick={handleInstallClick}
          className="flex items-center gap-2 text-white hover:text-red-400 transition-colors"
        >
          <DownloadCloud size={20} className="text-red-400" />
          <span className="font-semibold text-sm mr-2">Instalar App</span>
        </button>
        <button 
          onClick={() => setIsHidden(true)}
          className="text-slate-400 hover:text-white bg-slate-800 p-1.5 rounded-full transition-colors"
          title="Ocultar"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default InstallPrompt;
