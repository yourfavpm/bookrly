import React from 'react';
import { motion } from 'framer-motion';

export const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white flex overflow-hidden">
      {/* Left Side: Visual (Desktop Only) */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 bg-bg-secondary relative items-center justify-center p-20">
        <div className="absolute inset-0 bg-linear-to-br from-brand/5 via-transparent to-transparent opacity-40" />
        <div className="relative z-10 max-w-sm space-y-10">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center text-white font-bold italic shadow-lg shadow-brand/10">
                B
              </div>
              <span className="font-semibold text-xl tracking-tight text-text-primary">Bukd</span>
           </div>
           
           <div className="space-y-6">
              <h2 className="text-4xl xl:text-5xl font-light tracking-tight text-text-primary leading-[1.1]">
                More than a <br />
                <span className="text-text-tertiary">booking link</span>
              </h2>
              <p className="text-sm text-text-secondary font-light max-w-xs leading-relaxed">
                Bukd gives you a complete booking website, not just a link. Focus on your craft, we'll handle the rest.
              </p>
           </div>
        </div>
        
        {/* Subtle Decorative Elements */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand/3 rounded-full blur-3xl" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand/3 rounded-full blur-3xl" />
      </div>

      {/* Right Side: Form Container */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-12 lg:p-20 relative bg-white">
        {/* Mobile Logo */}
        <div className="lg:hidden absolute top-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center text-white font-bold italic text-sm">
                B
            </div>
            <span className="font-semibold text-base tracking-tight text-text-primary">Bukd</span>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[380px]"
        >
          {children}
        </motion.div>
        
        <footer className="absolute bottom-8 left-0 right-0 text-center">
            <p className="text-[10px] text-text-tertiary uppercase tracking-widest font-normal opacity-50">
                &copy; 2026 Bukd Canada
            </p>
        </footer>
      </div>
    </div>
  );
};
