import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Check, Palette, ExternalLink, ChevronRight, Filter } from 'lucide-react';
import { TEMPLATES, getCategories } from '../public/templates/templateRegistry';
import { motion, AnimatePresence } from 'framer-motion';

export const TemplateSelector: React.FC = () => {
  const { business, updateBusiness } = useAppStore();
  const categories = getCategories();
  
  const currentTemplate = business?.templateKey || 'beauty_editorial_luxe';
  const initialCategory = TEMPLATES.find(t => t.key === currentTemplate)?.category || categories[0];
  
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);

  if (!business) return null;

  const filteredTemplates = TEMPLATES.filter(t => t.category === activeCategory);

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Design Library</h1>
          <p className="text-sm text-text-secondary mt-1">Select a template that fits your business style</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-border-default">
          <Filter size={14} className="text-text-tertiary" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Filter</span>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Categories Sidebar */}
        <aside className="w-48 shrink-0 space-y-1">
          <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-[0.2em] mb-4 px-3">Industries</p>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between group ${
                activeCategory === category 
                  ? 'bg-text-primary text-white shadow-md' 
                  : 'text-text-secondary hover:bg-slate-50 hover:text-text-primary'
              }`}
            >
              <span className="capitalize">{category.replace('_', ' ')}</span>
              {activeCategory === category && <ChevronRight size={14} className="text-white/60" />}
            </button>
          ))}
        </aside>

        {/* Templates Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredTemplates.map((t, index) => {
                const isActive = currentTemplate === t.key;
                return (
                  <motion.div
                    key={t.key}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card 
                      className={`group relative overflow-hidden border transition-all duration-500 rounded-2xl bg-white cursor-pointer hover:shadow-2xl ${
                        isActive ? 'border-brand shadow-lg ring-1 ring-brand/20' : 'border-border-default hover:border-brand/40'
                      }`}
                      onClick={() => updateBusiness({ templateKey: t.key })}
                    >
                      {/* Visual Preview */}
                      <div className="h-44 relative overflow-hidden flex items-center justify-center bg-slate-50">
                        {/* Dot Pattern Background */}
                        <div className="absolute inset-0 opacity-[0.03]" 
                             style={{ backgroundImage: `radial-gradient(circle at 2px 2px, ${t.color} 1px, transparent 0)`, backgroundSize: '12px 12px' }} />
                        
                        {/* Template "Avatar" */}
                        <div className="relative z-10 w-20 h-20 rounded-[2rem] flex items-center justify-center text-white font-black text-3xl shadow-2xl transition-all duration-700 group-hover:scale-110 group-hover:rotate-6"
                             style={{ backgroundColor: t.color }}>
                          {t.name.charAt(0)}
                        </div>

                        {isActive && (
                          <div className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center shadow-xl animate-in zoom-in duration-500 ring-4 ring-white">
                            <Check size={16} strokeWidth={3} />
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>

                      <div className="p-5">
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div>
                            <h3 className="text-sm font-bold text-text-primary transition-colors">{t.name}</h3>
                            <p className="text-[11px] text-text-secondary mt-1 leading-relaxed line-clamp-2 italic">
                              {t.description}
                            </p>
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(`/demo/${t.key}`, '_blank');
                            }}
                            className="w-8 h-8 rounded-full bg-slate-50 text-text-tertiary flex items-center justify-center hover:bg-brand hover:text-white transition-all shadow-sm shrink-0" 
                            title="Open Full Demo"
                          >
                            <ExternalLink size={14} />
                          </button>
                        </div>

                        <Button 
                          variant={isActive ? "primary" : "secondary"}
                          className={`w-full h-10 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                            isActive 
                              ? 'bg-brand text-white shadow-lg shadow-brand/20' 
                              : 'bg-slate-50 text-text-primary hover:bg-slate-100'
                          }`}
                        >
                          {isActive ? 'Current Selection' : 'Apply Template'}
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
