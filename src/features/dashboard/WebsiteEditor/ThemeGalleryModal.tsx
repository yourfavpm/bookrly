import React from 'react';
import { useAppStore } from '../../../store/useAppStore';
import { TEMPLATES } from '../../public/templates/templateRegistry';
import { X, Check, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

interface ThemeGalleryModalProps {
  onClose: () => void;
}

export const ThemeGalleryModal: React.FC<ThemeGalleryModalProps> = ({ onClose }) => {
  const { business, updateBusiness, previewTemplateKey, setPreviewTemplateKey } = useAppStore();

  if (!business) return null;

  const closeAndRevert = () => {
    setPreviewTemplateKey(null);
    onClose();
  };

  const applyTemplate = async (key: string) => {
    await updateBusiness({ templateKey: key }, true);
    setPreviewTemplateKey(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        className="absolute inset-0 bg-text-primary/40 backdrop-blur-sm"
        onClick={closeAndRevert}
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        exit={{ opacity: 0, scale: 0.95, y: 20 }} 
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-[95vw] h-[90vh] max-w-7xl bg-[#f8fafc] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-white/20"
      >
        <header className="p-6 md:p-8 flex items-center justify-between shrink-0 bg-white border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-bold text-text-primary tracking-tight">Theme Gallery</h2>
            <p className="text-sm text-text-secondary mt-1">Select a template to start designing your website.</p>
          </div>
          <button 
            onClick={closeAndRevert} 
            className="p-3 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
          >
            <X size={24} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {TEMPLATES.map((template) => {
              const isActive = business.templateKey === template.key;
              
              return (
                <div 
                  key={template.key} 
                  className={`group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col border-2 ${
                    isActive ? 'border-brand ring-4 ring-brand/10' : 'border-transparent hover:border-brand/30'
                  }`}
                >
                  {/* Template Preview Area (Placeholder/Color block for now, replace with image if available) */}
                  <div 
                    className="aspect-[4/3] w-full relative overflow-hidden flex items-center justify-center p-8"
                    style={{ backgroundColor: template.color + '10' }} // 10% opacity of brand color
                  >
                     <div 
                       className="w-full h-full rounded-xl shadow-lg border border-black/5 flex flex-col overflow-hidden bg-white"
                     >
                        {/* Mock Header */}
                        <div className="h-8 border-b border-black/5 flex items-center px-4" style={{ backgroundColor: template.color }}>
                           <div className="w-16 h-2 bg-white/50 rounded-full" />
                        </div>
                        {/* Mock Body */}
                        <div className="flex-1 p-6 space-y-4">
                           <div className="w-3/4 h-6 rounded-lg bg-slate-200" />
                           <div className="w-1/2 h-3 rounded-full bg-slate-100" />
                           <div className="w-1/3 h-8 rounded-lg mt-4" style={{ backgroundColor: template.color }} />
                        </div>
                     </div>

                     {/* Overlay Actions */}
                     <div className="absolute inset-0 bg-text-primary/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                        <button
                          onClick={() => setPreviewTemplateKey(template.key)}
                          className="px-5 py-3 bg-white/90 text-text-primary rounded-xl font-bold uppercase tracking-widest text-xs hover:scale-105 transition-transform shadow-xl flex items-center gap-2"
                        >
                          <Eye size={14} /> Preview
                        </button>
                        <button
                          onClick={() => applyTemplate(template.key)}
                          className="px-6 py-3 bg-white text-text-primary rounded-xl font-bold uppercase tracking-widest text-xs hover:scale-105 transition-transform shadow-xl"
                        >
                          {isActive ? 'Keep Theme' : 'Apply'}
                        </button>
                     </div>
                  </div>

                  <div className="p-6 border-t border-slate-50 flex items-center justify-between">
                     <div>
                       <h3 className="text-lg font-bold text-text-primary tracking-tight">{template.name}</h3>
                       <p className="text-xs text-text-tertiary uppercase tracking-widest mt-1">{template.category.replace('_', ' ')}</p>
                     </div>
                     {(isActive || previewTemplateKey === template.key) && (
                       <div className="w-8 h-8 rounded-full bg-brand/10 text-brand flex items-center justify-center">
                         <Check size={16} strokeWidth={3} />
                       </div>
                     )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
