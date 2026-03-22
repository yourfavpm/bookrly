import React from 'react';
import { Card } from '../ui/Card';


export const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-bg-secondary flex flex-col items-center justify-center p-6 animate-in fade-in duration-700">
      <div className="mb-10 flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center text-white font-bold italic shadow-lg shadow-brand/20">
          B
        </div>
        <span className="font-semibold text-xl tracking-tight text-text-primary">Bookflow</span>
      </div>
      
      <Card className="w-full max-w-[420px] p-10 md:p-12 shadow-xl shadow-black/5 bg-white border-none rounded-xl">
        {children}
      </Card>
      
      <footer className="mt-10 text-center">
        <p className="text-[10px] text-text-tertiary uppercase tracking-widest font-bold">
          &copy; 2026 Bookflow Canada
        </p>
      </footer>
    </div>
  );
};
