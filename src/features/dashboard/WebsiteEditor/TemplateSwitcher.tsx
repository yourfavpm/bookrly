import React from 'react';
import { useAppStore } from '../../../store/useAppStore';
import { TEMPLATES } from '../../public/templates/templateRegistry';
import { Check, ChevronRight } from 'lucide-react';

interface TemplateSwitcherProps {
  onNext: () => void;
}

export const TemplateSwitcher: React.FC<TemplateSwitcherProps> = ({ onNext }) => {
  const { business, updateBusiness, setPreviewTemplateKey } = useAppStore();

  if (!business) return null;

  return (
    <div className="space-y-4">
      <div className="px-5">
        <h2 className="text-sm font-bold text-text-primary tracking-tight">Templates</h2>
        <p className="text-[10px] text-text-tertiary mt-1">Hover to preview, click to apply.</p>
      </div>
      
      <div className="px-3 space-y-1">
        {TEMPLATES.map(t => {
          const isActive = business.templateKey === t.key;
          return (
            <button
              key={t.key}
              onMouseEnter={() => setPreviewTemplateKey(t.key)}
              onMouseLeave={() => setPreviewTemplateKey(null)}
              onClick={() => updateBusiness({ templateKey: t.key })}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 text-left ${
                isActive ? 'bg-brand/5 border border-brand/20' : 'hover:bg-slate-50 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold shadow-sm"
                  style={{ backgroundColor: t.color }}
                >
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-bold text-text-primary">{t.name}</p>
                  <p className="text-[9px] text-text-tertiary uppercase tracking-widest">{t.category.replace('_', ' ')}</p>
                </div>
              </div>
              {isActive && <Check size={14} className="text-brand" />}
            </button>
          );
        })}
      </div>
      
      <div className="sticky bottom-0 p-4 bg-white border-t border-slate-100 mt-4">
         <button 
           onClick={onNext} 
           className="w-full bg-text-primary text-white py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-lg shadow-black/5"
         >
            Continue to Design <ChevronRight size={16} />
         </button>
      </div>
    </div>
  );
};
