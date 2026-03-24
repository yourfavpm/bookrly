import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Home, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg-canvas flex items-center justify-center p-6 text-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="space-y-4">
          <div className="w-24 h-24 bg-brand/5 rounded-3xl flex items-center justify-center mx-auto border border-brand/10">
            <XCircle size={40} className="text-brand" />
          </div>
          <h1 className="text-5xl font-bold tracking-tighter text-text-primary">404</h1>
          <h2 className="text-xl font-semibold text-text-primary">Page not found</h2>
          <p className="text-sm text-text-tertiary font-normal px-8">
            The page you're looking for doesn't exist or has been moved. 
            Check the URL or return to safety below.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button 
            variant="secondary" 
            className="flex-1 h-12 rounded-xl text-[10px] font-bold uppercase tracking-widest border-border-polaris"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={14} className="mr-2" /> Go Back
          </Button>
          <Button 
            className="flex-1 h-12 rounded-xl bg-brand text-white font-bold text-[10px] uppercase tracking-widest shadow-xl shadow-brand/20"
            onClick={() => navigate('/dashboard')}
          >
            <Home size={14} className="mr-2" /> Dashboard
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

// Internal icon import for consistency
const XCircle = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);
