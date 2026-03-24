import React, { useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { XCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const GlobalError: React.FC = () => {
  const { error, setError } = useAppStore();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, setError]);

  return (
    <AnimatePresence>
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 20, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 20, x: '-50%' }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 min-w-[320px] max-w-md"
        >
          <div className="bg-white border border-red-100 shadow-2xl rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500 shrink-0">
              <XCircle size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest leading-none mb-1">Error</p>
              <p className="text-xs text-text-primary font-medium truncate">{error}</p>
            </div>
            <button 
              onClick={() => setError(null)}
              className="p-2 hover:bg-bg-canvas rounded-lg text-text-tertiary transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
