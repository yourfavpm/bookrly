import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Check, Palette, ArrowRight, ExternalLink } from 'lucide-react';
import { TEMPLATES } from '../public/templates/templateRegistry';
import { motion } from 'framer-motion';

export const TemplateSelector: React.FC = () => {
  const { business, updateBusiness } = useAppStore();

  if (!business) return null;

  const currentTemplate = business.templateKey || 'clean_classic';

  return (
    <div className="space-y-10 pb-20 max-w-5xl mx-auto">
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
            <Palette size={16} />
          </div>
          <h1 className="text-2xl font-medium tracking-tight text-text-primary">Design & Templates</h1>
        </div>
        <p className="text-[11px] text-text-tertiary font-normal max-w-2xl leading-relaxed">
          Choose a layout that reflects your brand's personality. Switch anytime—your content adapts automatically.
        </p>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {TEMPLATES.map((t, index) => {
          const isActive = currentTemplate === t.key;
          return (
            <motion.div
              key={t.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={`group relative overflow-hidden border transition-all duration-500 rounded-[24px] bg-white cursor-pointer hover:shadow-xl hover:shadow-brand/5 ${
                  isActive ? 'border-brand shadow-lg shadow-brand/5 ring-4 ring-brand/5' : 'border-border-light hover:border-brand/30'
                }`}
                onClick={() => updateBusiness({ templateKey: t.key })}
              >
                {/* Visual Representation (Live Thumbnail) */}
                <div className="h-40 relative overflow-hidden bg-bg-secondary">
                  {t.thumbnail ? (
                    <img 
                      src={t.thumbnail} 
                      alt={t.name} 
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110" 
                    />
                  ) : (
                    <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity" 
                         style={{ backgroundImage: `radial-gradient(circle at 2px 2px, ${t.color} 1px, transparent 0)`, backgroundSize: '16px 16px' }} />
                  )}
                  
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />

                  {isActive && (
                    <div className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-brand text-white flex items-center justify-center shadow-lg animate-in zoom-in duration-300 ring-2 ring-white">
                      <Check size={14} strokeWidth={3} />
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-text-primary group-hover:text-brand transition-colors truncate">{t.name}</h3>
                      <p className="text-[8px] uppercase tracking-[0.2em] font-bold mt-0.5" style={{ color: t.color }}>{t.category}</p>
                    </div>
                  </div>
                  
                  <p className="text-[11px] text-text-tertiary leading-normal line-clamp-1">
                    {t.description}
                  </p>

                  <div className="pt-1 flex items-center justify-between gap-2">
                    <Button 
                      variant={isActive ? "primary" : "secondary"}
                      className={`h-8 px-4 flex-1 rounded-lg text-[9px] font-bold uppercase tracking-widest ${isActive ? 'bg-brand' : ''}`}
                    >
                      {isActive ? 'Active' : 'Select'}
                    </Button>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`/demo/${t.key}`, '_blank');
                      }}
                      className="p-1.5 rounded-lg bg-bg-secondary text-text-tertiary hover:text-brand transition-colors shrink-0" 
                      title="Full Live Demo"
                    >
                      <ExternalLink size={14} />
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Card className="p-8 border-dashed border-2 border-border-light bg-bg-secondary/30 rounded-[32px] text-center space-y-4">
         <h4 className="text-lg font-medium text-text-primary">Don't see what you're looking for?</h4>
         <p className="text-sm text-text-secondary max-w-md mx-auto">We're constantly building new templates for different service industries. Your current site will never break when we release new designs.</p>
         <Button variant="ghost" className="text-brand font-bold text-xs uppercase tracking-widest">
            Suggest a layout
            <ArrowRight size={14} className="ml-2" />
         </Button>
      </Card>
    </div>
  );
};
