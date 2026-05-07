import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../../store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { X, Eye, Monitor, Smartphone, Globe, ExternalLink } from 'lucide-react';
import { ContextualSidebar } from './ContextualSidebar';
import { PreviewCanvas } from './PreviewCanvas';
import { getBusinessUrl } from '../../../lib/domainUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { ServiceEditor } from '../ServiceEditor';
import { AvailabilityPage } from '../AvailabilityPage';
import { TestimonialsPage } from '../TestimonialsPage';
import { PortfolioPage } from '../PortfolioPage';
import { FAQEditorModal } from './FAQEditorModal';
import { BeforeAfterEditorModal } from './BeforeAfterEditorModal';
import { Button } from '../../../components/ui/Button';

export const WebsiteEditor: React.FC = () => {
  const { business, updateBusiness, setPreviewTemplateKey, setActiveEditorSection } = useAppStore();
  const navigate = useNavigate();
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isSaving, setIsSaving] = useState(false);
  const [activeModal, setActiveModal] = useState<'services' | 'reviews' | 'gallery' | 'availability' | 'faq' | 'before_after' | null>(null);
  const [editingServiceId, setEditingServiceId] = useState<string | null | undefined>(undefined);

  // Clean up ephemeral editor state on unmount
  useEffect(() => {
    return () => {
      setPreviewTemplateKey(null);
      setActiveEditorSection(null);
    };
  }, [setPreviewTemplateKey, setActiveEditorSection]);

  // Fake save indicator for UX whenever business updates
  useEffect(() => {
    setIsSaving(true);
    const timer = setTimeout(() => setIsSaving(false), 800);
    return () => clearTimeout(timer);
  }, [business]);

  if (!business) return null;

  const togglePublished = () => {
    updateBusiness({ isPublished: !business.isPublished });
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#f6f6f7] overflow-hidden font-sans">
      {/* Top Header */}
      <header className="h-14 shrink-0 bg-white border-b border-[#e0e0e0] flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard/overview')} 
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-text-secondary"
            title="Exit Editor"
          >
            <X size={20} />
          </button>
          
          <div className="h-4 w-px bg-slate-200" />
          
          <h1 className="text-sm font-semibold text-text-primary tracking-tight">Website Editor</h1>
          
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${isSaving ? 'text-amber-500' : 'text-slate-400'}`}>
             <div className={`w-1.5 h-1.5 rounded-full ${isSaving ? 'bg-amber-500 animate-pulse' : 'bg-slate-300'}`} />
             {isSaving ? 'Saving...' : 'Saved'}
          </div>
        </div>

        {/* Device Toggles */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setDeviceMode('desktop')}
            className={`p-1.5 rounded-lg transition-all ${deviceMode === 'desktop' ? 'bg-white shadow-sm text-text-primary' : 'text-slate-400 hover:text-text-primary'}`}
          >
            <Monitor size={16} />
          </button>
          <button 
            onClick={() => setDeviceMode('mobile')}
            className={`p-1.5 rounded-lg transition-all ${deviceMode === 'mobile' ? 'bg-white shadow-sm text-text-primary' : 'text-slate-400 hover:text-text-primary'}`}
          >
            <Smartphone size={16} />
          </button>
        </div>

        <div className="flex items-center gap-4">
           {/* Publish Toggle */}
           <div className="hidden md:flex items-center gap-2 mr-2">
             <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Site</span>
             <button 
               onClick={togglePublished}
               className={`w-9 h-5 rounded-full transition-all relative flex items-center px-0.5 cursor-pointer ${business.isPublished ? 'bg-emerald-500' : 'bg-slate-300'}`}
             >
               <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-all ${business.isPublished ? 'translate-x-4' : 'translate-x-0'}`} />
             </button>
             <span className={`text-[10px] font-bold uppercase tracking-widest min-w-[32px] ${business.isPublished ? 'text-emerald-500' : 'text-slate-400'}`}>
               {business.isPublished ? 'Live' : 'Draft'}
             </span>
           </div>

           <a 
             href={getBusinessUrl(business.subdomain)}
             target="_blank"
             rel="noreferrer"
             className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-[10px] font-bold uppercase tracking-widest hover:border-slate-300 transition-colors text-text-secondary hover:text-text-primary bg-white"
           >
             <ExternalLink size={12} /> View Live
           </a>
           <button 
             onClick={() => navigate('/dashboard/overview')}
             className="px-5 py-1.5 rounded-lg bg-brand text-white text-[11px] font-semibold tracking-wide hover:bg-brand-hover transition-colors"
           >
             Finish
           </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Control Panel */}
        <div className="w-96 h-full shrink-0">
          <ContextualSidebar onOpenModal={setActiveModal} onEditService={setEditingServiceId} />
        </div>
        
        {/* Right Canvas Area */}
        <div className="flex-1 bg-[#f6f6f7] flex items-center justify-center p-4 lg:p-8 overflow-hidden relative">
          <PreviewCanvas deviceMode={deviceMode} />
        </div>
      </div>

      {/* Slide-over Modals */}
      <AnimatePresence>
        {activeModal === 'availability' && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveModal(null)} className="absolute inset-0 bg-text-primary/20 backdrop-blur-sm" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="relative w-full max-w-5xl bg-white h-full shadow-2xl flex flex-col">
              <header className="p-6 border-b border-black/5 flex items-center justify-between">
                <h2 className="text-lg font-bold text-text-primary">Manage Availability</h2>
                <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"><X size={20} /></button>
              </header>
              <div className="flex-1 overflow-y-auto p-8"><AvailabilityPage /></div>
              <footer className="p-6 border-t border-slate-100"><Button onClick={() => setActiveModal(null)} className="w-full h-12 bg-text-primary text-white rounded-xl font-bold uppercase tracking-widest text-[11px]">Done</Button></footer>
            </motion.div>
          </div>
        )}

        {activeModal === 'reviews' && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveModal(null)} className="absolute inset-0 bg-text-primary/20 backdrop-blur-sm" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="relative w-full max-w-5xl bg-white h-full shadow-2xl flex flex-col">
              <header className="p-6 border-b border-black/5 flex items-center justify-between">
                <h2 className="text-lg font-bold text-text-primary">Manage Reviews</h2>
                <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"><X size={20} /></button>
              </header>
              <div className="flex-1 overflow-y-auto p-8"><TestimonialsPage /></div>
              <footer className="p-6 border-t border-slate-100"><Button onClick={() => setActiveModal(null)} className="w-full h-12 bg-text-primary text-white rounded-xl font-bold uppercase tracking-widest text-[11px]">Done</Button></footer>
            </motion.div>
          </div>
        )}

        {activeModal === 'gallery' && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveModal(null)} className="absolute inset-0 bg-text-primary/20 backdrop-blur-sm" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="relative w-full max-w-5xl bg-white h-full shadow-2xl flex flex-col">
              <header className="p-6 border-b border-black/5 flex items-center justify-between">
                <h2 className="text-lg font-bold text-text-primary">Manage Portfolio</h2>
                <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"><X size={20} /></button>
              </header>
              <div className="flex-1 overflow-y-auto p-8"><PortfolioPage /></div>
              <footer className="p-6 border-t border-slate-100"><Button onClick={() => setActiveModal(null)} className="w-full h-12 bg-text-primary text-white rounded-xl font-bold uppercase tracking-widest text-[11px]">Done</Button></footer>
            </motion.div>
          </div>
        )}

        {activeModal === 'faq' && <FAQEditorModal onClose={() => setActiveModal(null)} />}
        {activeModal === 'before_after' && <BeforeAfterEditorModal onClose={() => setActiveModal(null)} />}
        
        {editingServiceId !== undefined && (
          <ServiceEditor serviceId={editingServiceId} onClose={() => setEditingServiceId(undefined)} />
        )}
      </AnimatePresence>
    </div>
  );
};
