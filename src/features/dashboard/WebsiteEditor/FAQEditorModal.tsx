import React from 'react';
import { useAppStore, FAQ } from '../../../store/useAppStore';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { X, Plus, Trash2, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface FAQEditorModalProps {
  onClose: () => void;
}

export const FAQEditorModal: React.FC<FAQEditorModalProps> = ({ onClose }) => {
  const { business, updateBusiness } = useAppStore();
  if (!business) return null;

  const faqs = business.faqs || [];

  const handleAdd = () => {
    const newFaq: FAQ = {
      id: crypto.randomUUID(),
      question: '',
      answer: '',
      orderIndex: faqs.length
    };
    updateBusiness({ faqs: [...faqs, newFaq] });
  };

  const handleUpdate = (id: string, updates: Partial<FAQ>) => {
    updateBusiness({
      faqs: faqs.map(f => f.id === id ? { ...f, ...updates } : f)
    });
  };

  const handleDelete = (id: string) => {
    updateBusiness({
      faqs: faqs.filter(f => f.id !== id)
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-text-primary/20 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col"
      >
        <header className="p-6 border-b border-black/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <HelpCircle size={18} />
            </div>
            <div>
              <h2 className="text-lg font-medium text-text-primary">Manage FAQs</h2>
              <p className="text-[10px] text-text-tertiary uppercase tracking-widest font-light">Answer common customer questions</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
            <X size={20} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {faqs.map((faq, index) => (
            <div key={faq.id} className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-4 relative group">
              <button 
                onClick={() => handleDelete(faq.id)}
                className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={16} />
              </button>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Question {index + 1}</label>
                <Input 
                  placeholder="e.g. Do you offer parking?"
                  value={faq.question}
                  onChange={e => handleUpdate(faq.id, { question: e.target.value })}
                  className="bg-white"
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Answer</label>
                <textarea 
                  placeholder="Yes, we have free parking available..."
                  value={faq.answer}
                  onChange={e => handleUpdate(faq.id, { answer: e.target.value })}
                  className="w-full p-4 rounded-xl border border-slate-200 bg-white text-sm focus:border-brand focus:ring-1 focus:ring-brand/20 outline-none min-h-[100px] resize-none transition-all"
                />
              </div>
            </div>
          ))}

          {faqs.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-3xl">
              <HelpCircle size={32} className="mx-auto text-slate-200 mb-4" />
              <p className="text-sm text-text-tertiary">No FAQs added yet.</p>
            </div>
          )}

          <button 
            onClick={handleAdd}
            className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-200 text-xs font-bold uppercase tracking-widest text-slate-400 hover:border-brand/40 hover:text-brand transition-all flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Add FAQ Item
          </button>
        </div>

        <footer className="p-8 border-t border-slate-100 bg-slate-50/30">
          <Button onClick={onClose} className="w-full h-12 bg-text-primary text-white rounded-xl font-bold uppercase tracking-widest text-[11px]">
            Done
          </Button>
        </footer>
      </motion.div>
    </div>
  );
};
