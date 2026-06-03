import React, { useState } from 'react';
import { useAppStore } from '../../../store/useAppStore';
import type { BeforeAfterImage } from '../../../store/useAppStore';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { X, Plus, Trash2, Wand2, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../../lib/supabase';

interface BeforeAfterEditorModalProps {
  onClose: () => void;
}

export const BeforeAfterEditorModal: React.FC<BeforeAfterEditorModalProps> = ({ onClose }) => {
  const { business, updateBusiness } = useAppStore();
  const [uploading, setUploading] = useState<string | null>(null);

  if (!business) return null;

  const images = business.beforeAfterImages || [];

  const handleAdd = () => {
    const newItem: BeforeAfterImage = {
      id: crypto.randomUUID(),
      beforeUrl: '',
      afterUrl: '',
      title: 'New Result',
      description: ''
    };
    updateBusiness({ beforeAfterImages: [...images, newItem] });
  };

  const handleUpdate = (id: string, updates: Partial<BeforeAfterImage>) => {
    updateBusiness({
      beforeAfterImages: images.map(img => img.id === id ? { ...img, ...updates } : img)
    });
  };

  const handleDelete = (id: string) => {
    updateBusiness({
      beforeAfterImages: images.filter(img => img.id !== id)
    });
  };

  const handleUpload = async (id: string, type: 'before' | 'after', file: File) => {
    setUploading(`${id}-${type}`);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${id}-${type}-${Date.now()}.${fileExt}`;
      const filePath = `${business.id}/before-after/${fileName}`;
      
      await supabase.storage.from('business-assets').upload(filePath, file);
      const { data: { publicUrl } } = supabase.storage.from('business-assets').getPublicUrl(filePath);
      
      handleUpdate(id, { [type === 'before' ? 'beforeUrl' : 'afterUrl']: publicUrl });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(null);
    }
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
        className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col"
      >
        <header className="p-6 border-b border-black/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Wand2 size={18} />
            </div>
            <div>
              <h2 className="text-lg font-medium text-text-primary">Results Showcase</h2>
              <p className="text-[10px] text-text-tertiary uppercase tracking-widest font-light">Before & After comparison sliders</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
            <X size={20} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {images.map((item) => (
            <div key={item.id} className="p-6 rounded-3xl border border-slate-100 bg-slate-50/50 space-y-6 relative group">
              <button 
                onClick={() => handleDelete(item.id)}
                className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={16} />
              </button>

              <div className="grid grid-cols-2 gap-6">
                {/* Before Image */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Before Image</label>
                  <div className="aspect-[4/5] rounded-2xl border-2 border-dashed border-slate-200 bg-white flex items-center justify-center relative overflow-hidden group/img cursor-pointer">
                    {item.beforeUrl ? (
                      <img src={item.beforeUrl} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <ImageIcon size={24} className="mx-auto text-slate-300 mb-2" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Upload Before</span>
                      </div>
                    )}
                    <input 
                      type="file" 
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={e => e.target.files?.[0] && handleUpload(item.id, 'before', e.target.files[0])}
                    />
                    {uploading === `${item.id}-before` && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                </div>

                {/* After Image */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">After Image</label>
                  <div className="aspect-[4/5] rounded-2xl border-2 border-dashed border-slate-200 bg-white flex items-center justify-center relative overflow-hidden group/img cursor-pointer">
                    {item.afterUrl ? (
                      <img src={item.afterUrl} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <ImageIcon size={24} className="mx-auto text-slate-300 mb-2" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Upload After</span>
                      </div>
                    )}
                    <input 
                      type="file" 
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={e => e.target.files?.[0] && handleUpload(item.id, 'after', e.target.files[0])}
                    />
                    {uploading === `${item.id}-after` && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Title / Service Name</label>
                  <Input 
                    placeholder="e.g. Volume Lash Extension"
                    value={item.title}
                    onChange={e => handleUpdate(item.id, { title: e.target.value })}
                    className="bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Description (Optional)</label>
                  <textarea 
                    placeholder="Briefly describe the results..."
                    value={item.description}
                    onChange={e => handleUpdate(item.id, { description: e.target.value })}
                    className="w-full p-4 rounded-xl border border-slate-200 bg-white text-sm focus:border-brand focus:ring-1 focus:ring-brand/20 outline-none min-h-[80px] resize-none transition-all"
                  />
                </div>
              </div>
            </div>
          ))}

          {images.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-[32px]">
              <Wand2 size={32} className="mx-auto text-slate-200 mb-4" />
              <p className="text-sm text-text-tertiary">No comparison results added yet.</p>
            </div>
          )}

          <button 
            onClick={handleAdd}
            className="w-full py-5 rounded-[32px] border-2 border-dashed border-slate-200 text-xs font-bold uppercase tracking-widest text-slate-400 hover:border-brand/40 hover:text-brand transition-all flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Add New Comparison
          </button>
        </div>

        <footer className="p-8 border-t border-slate-100 bg-slate-50/30">
          <Button onClick={onClose} className="w-full h-12 bg-text-primary text-white rounded-xl font-bold uppercase tracking-widest text-[11px]">
            Save & Close
          </Button>
        </footer>
      </motion.div>
    </div>
  );
};
