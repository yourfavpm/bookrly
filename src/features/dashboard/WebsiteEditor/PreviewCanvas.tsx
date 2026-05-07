import React, { useMemo } from 'react';
import { useAppStore } from '../../../store/useAppStore';
import { TemplateRenderer } from '../../public/templates/TemplateRenderer';
import { getTemplate } from '../../public/templates/templateRegistry';
import { motion } from 'framer-motion';

export const PreviewCanvas: React.FC<{ deviceMode: 'desktop' | 'mobile' }> = ({ deviceMode }) => {
  const { business, previewTemplateKey } = useAppStore();

  const activeTemplate = useMemo(() => {
    if (!business) return null;
    // Fallback to editorial_luxe if no template is set (shouldn't happen)
    return getTemplate(previewTemplateKey || business.templateKey || 'editorial_luxe');
  }, [business, previewTemplateKey]);

  if (!business || !activeTemplate) return (
     <div className="h-full w-full flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-brand border-t-transparent animate-spin" />
     </div>
  );

  return (
    <motion.div 
      layout
      initial={false}
      className={`h-full bg-white shadow-[0_0_40px_rgba(0,0,0,0.08)] rounded-xl overflow-y-auto overflow-x-hidden border border-slate-200 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] relative ${
        deviceMode === 'mobile' ? 'w-[375px]' : 'w-full max-w-[1400px]'
      }`}
    >
      {/* Editor overlay blocking default interactions on links/buttons to prevent navigation */}
      <div className="min-h-full" onClick={(e) => {
         // Prevent link navigation in editor
         const target = e.target as HTMLElement;
         if (target.closest('a') || target.tagName === 'A') {
            e.preventDefault();
         }
      }}>
         <TemplateRenderer template={activeTemplate} business={business} isEditing={true} />
      </div>
    </motion.div>
  );
};
