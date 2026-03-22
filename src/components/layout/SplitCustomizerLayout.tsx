import React from 'react';
import { ChevronLeft, Monitor, Smartphone, Check, Globe } from 'lucide-react';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';

interface CustomizerLayoutProps {
  settings: React.ReactNode;
  preview: React.ReactNode;
  onSave?: () => void;
  isSaving?: boolean;
}

export const SplitCustomizerLayout: React.FC<CustomizerLayoutProps> = ({ 
  settings, 
  preview, 
  onSave, 
  isSaving 
}) => {
  const [device, setDevice] = React.useState<'desktop' | 'mobile'>('desktop');
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col bg-bg-secondary overflow-hidden">
      {/* Top Action Bar */}
      <header className="h-16 bg-white border-b border-border-light flex items-center justify-between px-6 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-bg-secondary rounded-xl text-text-secondary transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="h-6 w-px bg-border-light mx-1" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center text-white font-bold italic text-sm">B</div>
            <span className="text-sm font-semibold tracking-tight">Website Customizer</span>
          </div>
          <span className="hidden sm:inline-flex text-[10px] font-bold text-text-tertiary px-2 py-0.5 bg-bg-tertiary rounded-full uppercase tracking-wider ml-2">Live Sync</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center bg-bg-tertiary rounded-xl p-1 gap-1">
            <button 
              onClick={() => setDevice('desktop')}
              className={`p-2 rounded-lg transition-all ${device === 'desktop' ? 'bg-white shadow-sm text-brand' : 'text-text-secondary hover:text-text-primary'}`}
              title="Desktop View"
            >
              <Monitor size={16} />
            </button>
            <button 
              onClick={() => setDevice('mobile')}
              className={`p-2 rounded-lg transition-all ${device === 'mobile' ? 'bg-white shadow-sm text-brand' : 'text-text-secondary hover:text-text-primary'}`}
              title="Mobile View"
            >
              <Smartphone size={16} />
            </button>
          </div>
          
          <div className="h-6 w-px bg-border-light hidden md:block" />

          <Button 
            size="sm" 
            onClick={onSave} 
            isLoading={isSaving}
            className="h-10 px-5 rounded-xl font-bold shadow-lg shadow-brand/10"
          >
            <Check size={18} className="mr-2" />
            Publish Updates
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Settings Panel */}
        <aside className="w-80 md:w-[400px] bg-white border-r border-border-light overflow-y-auto shadow-xl z-10">
          <div className="p-8">
            {settings}
          </div>
        </aside>

        {/* Right Preview Area */}
        <main className="flex-1 bg-bg-tertiary p-4 md:p-12 overflow-y-auto flex justify-center items-start relative box-border">
          <div className="absolute top-4 left-4 flex items-center gap-2 text-[10px] font-bold text-text-tertiary uppercase tracking-widest opacity-60">
             <Globe size={12} />
             Live Preview
          </div>
          
          <div className={`bg-white shadow-2xl transition-all duration-700 ease-in-out border border-border-light overflow-y-auto shrink-0 relative ${device === 'desktop' ? 'w-full max-w-[1100px] h-[calc(100vh-10rem)] rounded-2xl' : 'w-[375px] h-[750px] rounded-[48px] border-12 border-gray-950 shadow-3xl'}`}>
            {device === 'mobile' && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-950 rounded-b-2xl z-50 flex justify-center items-start pt-1">
                 <div className="w-10 h-1 bg-gray-800 rounded-full" />
              </div>
            )}
            <div className="h-full overflow-y-auto custom-scrollbar">
              {preview}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
