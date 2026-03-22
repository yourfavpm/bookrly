import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Camera, Image as ImageIcon, Plus, Trash2, Save } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { supabase } from '../../lib/supabase';

export const PortfolioPage: React.FC = () => {
  const { business, fetchBusiness } = useAppStore();
  const [items, setItems] = useState<any[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (business) {
      setItems(business.proofOfWork || []);
    }
  }, [business]);

  if (!business) return null;

  const handleAdd = () => {
    setItems([{ id: `temp-${Date.now()}`, image_url: '', caption: '' }, ...items]);
  };

  const handleUpdate = (id: string, updates: any) => {
    setItems(items.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const handleDelete = (id: string) => {
    setItems(items.filter(p => p.id !== id));
  };

  const handleUpload = async (file: File, itemId: string) => {
    if (!file) return;
    setUploading(itemId);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `proof-${Date.now()}.${fileExt}`;
      const filePath = `${business.id}/${fileName}`;
      await supabase.storage.from('business-assets').upload(filePath, file);
      const { data: { publicUrl } } = supabase.storage.from('business-assets').getPublicUrl(filePath);
      
      handleUpdate(itemId, { image_url: publicUrl });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(null);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const currentIds = items.map(p => p.id);
      const originalIds = (business.proofOfWork || []).map((p: any) => p.id);
      const toDelete = originalIds.filter((id: string) => !currentIds.includes(id));
      
      if (toDelete.length > 0) {
        await supabase.from('proof_items').delete().in('id', toDelete);
      }
      
      const toUpsert = items.map(p => ({
        ...(p.id.startsWith('temp-') ? {} : { id: p.id }),
        business_id: business.id,
        image_url: p.image_url || '',
        caption: p.caption || ''
      }));
      
      if (toUpsert.length > 0) {
        await supabase.from('proof_items').upsert(toUpsert);
      }
      
      await fetchBusiness();
    } catch (err) {
      console.error(err);
      alert('Failed to save portfolio');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between border-b border-border-default pb-6">
         <div>
            <h1 className="text-2xl font-bold text-text-primary">Portfolio Gallery</h1>
            <p className="text-sm text-text-secondary mt-1">Showcase your best work to clients.</p>
         </div>
         <div className="flex items-center gap-3">
           <Button variant="secondary" onClick={handleAdd} className="h-10 px-4 rounded-xl font-bold text-[10px] uppercase tracking-widest bg-white border border-border-polaris shadow-sm hover:bg-bg-canvas/50 transition-all">
             <Plus size={16} className="mr-2" /> Add Image
           </Button>
           <Button onClick={handleSave} disabled={isSaving} className="h-10 px-6 rounded-xl font-bold text-[10px] uppercase tracking-widest bg-brand text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50">
             {isSaving ? (
               <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" /> Saving...</>
             ) : (
               <><Save size={16} className="mr-2" /> Save Changes</>
             )}
           </Button>
         </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <div key={item.id} className="p-4 rounded-2xl border border-border-polaris shadow-sm bg-white flex flex-col gap-4 relative group hover:shadow-md transition-shadow">
            <div className="w-full aspect-square rounded-xl bg-bg-canvas/50 flex items-center justify-center shrink-0 relative overflow-hidden">
              {item.image_url ? <img src={item.image_url} className="w-full h-full object-cover" alt="Proof" /> : <ImageIcon size={24} className="text-text-tertiary" />}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <Camera className="text-white" size={20} />
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0], item.id)} disabled={uploading === item.id} />
              </div>
              {uploading === item.id && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                   <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <Input 
                value={item.caption || ''} 
                onChange={e => handleUpdate(item.id, { caption: e.target.value })}
                className="h-10 border-border-default focus:ring-0 text-sm font-medium placeholder:text-text-tertiary"
                placeholder="Enter a caption..."
              />
            </div>
            <button onClick={() => handleDelete(item.id)} className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur rounded-lg text-text-tertiary shadow-sm hover:text-error hover:bg-white transition-colors opacity-0 group-hover:opacity-100">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {(items.length === 0) && (
           <div className="col-span-full py-20 text-center border-2 border-dashed border-border-default rounded-3xl">
              <ImageIcon className="mx-auto text-text-tertiary mb-4" size={32} />
              <p className="text-text-secondary font-medium">Your portfolio is currently empty.</p>
           </div>
        )}
      </div>
    </div>
  );
};
