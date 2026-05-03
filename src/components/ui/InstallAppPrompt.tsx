import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Share } from 'lucide-react';

export const InstallAppPrompt = () => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true) {
      setIsStandalone(true);
      return;
    }

    // Check if iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Handle Android/Chrome install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      
      // Auto-show after a short delay if not dismissed recently
      const dismissed = localStorage.getItem('skeduley_install_dismissed');
      if (!dismissed) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For iOS, show after a delay if not dismissed
    if (isIosDevice) {
      const dismissed = localStorage.getItem('skeduley_install_dismissed');
      if (!dismissed) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('skeduley_install_dismissed', 'true');
  };

  if (isStandalone || !showPrompt) return null;
  if (!isInstallable && !isIOS) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 20, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0, scale: 0.95 }}
        className="fixed bottom-6 right-6 z-100 max-w-[320px] w-[calc(100vw-48px)]"
      >
        <div className="bg-white rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 flex items-start gap-4 relative overflow-hidden group">
          <div className="absolute inset-0 bg-linear-to-br from-brand/5 to-transparent pointer-events-none" />
          
          <button 
            onClick={handleDismiss}
            className="absolute top-3 right-3 text-text-tertiary hover:text-text-primary p-1.5 rounded-full hover:bg-bg-secondary transition-colors z-10"
          >
            <X size={14} />
          </button>
          
          <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center shrink-0 shadow-inner">
            <Download size={20} className="text-brand" />
          </div>
          
          <div className="flex-1 pr-6 relative z-10">
            <h3 className="text-[13px] font-semibold text-text-primary mb-1 tracking-tight">
              Get the App
            </h3>
            <p className="text-[11px] text-text-secondary leading-relaxed mb-3">
              {isIOS 
                ? "Install Skeduley for the best dashboard experience and instant access."
                : "Install Skeduley for the best dashboard experience and instant access."}
            </p>
            
            {!isIOS ? (
              <button 
                onClick={handleInstall}
                className="w-full text-xs font-semibold text-white bg-brand hover:bg-brand-focus hover:shadow-md hover:-translate-y-0.5 px-4 py-2 rounded-lg transition-all"
              >
                Install Now
              </button>
            ) : (
              <div className="w-full flex flex-col items-center justify-center gap-1.5 bg-bg-secondary/80 border border-gray-100 rounded-lg p-2.5">
                <span className="text-[10px] font-medium text-text-tertiary uppercase tracking-widest">How to install</span>
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-text-primary">
                  Tap <Share size={12} className="text-brand shrink-0" /> <span className="text-text-tertiary mx-0.5">then</span> <span className="bg-white px-1.5 py-0.5 rounded shadow-sm border border-gray-100 whitespace-nowrap">Add to Home Screen</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
