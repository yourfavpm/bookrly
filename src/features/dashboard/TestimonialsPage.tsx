import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { MessageSquare, Plus, Trash2, Save } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { supabase } from '../../lib/supabase';

export const TestimonialsPage: React.FC = () => {
  const { business, fetchBusiness } = useAppStore();
  const [reviews, setReviews] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (business) {
      setReviews(business.reviews || []);
    }
  }, [business]);

  if (!business) return null;

  const handleAdd = () => {
    setReviews([{ id: `temp-${Date.now()}`, customer_name: '', comment: '', rating: 5 }, ...reviews]);
  };

  const handleUpdate = (id: string, updates: any) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const handleDelete = (id: string) => {
    setReviews(reviews.filter(r => r.id !== id));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const currentIds = reviews.map(r => r.id);
      const originalIds = (business.reviews || []).map((r: any) => r.id);
      const toDelete = originalIds.filter((id: string) => !currentIds.includes(id));
      
      if (toDelete.length > 0) {
        await supabase.from('reviews').delete().in('id', toDelete);
      }
      
      const toUpsert = reviews.map(r => ({
        ...(r.id.startsWith('temp-') ? {} : { id: r.id }),
        business_id: business.id,
        customer_name: r.customer_name || 'Anonymous',
        comment: r.comment || '',
        rating: r.rating || 5
      }));
      
      if (toUpsert.length > 0) {
        await supabase.from('reviews').upsert(toUpsert);
      }
      
      await fetchBusiness();
    } catch (err) {
      console.error(err);
      alert('Failed to save reviews');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between border-b border-border-default pb-6">
         <div>
            <h1 className="text-2xl font-bold text-text-primary">Client Reviews</h1>
            <p className="text-sm text-text-secondary mt-1">Manage what clients say about you.</p>
         </div>
         <div className="flex items-center gap-3">
           <Button variant="secondary" onClick={handleAdd} className="h-10 px-4 rounded-xl font-bold text-[10px] uppercase tracking-widest bg-white border border-border-polaris shadow-sm hover:bg-bg-canvas/50 transition-all">
             <Plus size={16} className="mr-2" /> Add Review
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((review) => (
          <div key={review.id} className="p-6 rounded-2xl border border-border-polaris shadow-sm bg-white space-y-4 relative group hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between gap-4">
              <Input 
                value={review.customer_name} 
                onChange={e => handleUpdate(review.id, { customer_name: e.target.value })}
                className="h-10 w-1/2 text-sm font-bold border-border-default focus:ring-0"
                placeholder="Client Name"
              />
              <button onClick={() => handleDelete(review.id)} className="text-text-tertiary hover:text-error transition-colors p-2">
                <Trash2 size={18} />
              </button>
            </div>
            <textarea 
              value={review.comment} 
              onChange={e => handleUpdate(review.id, { comment: e.target.value })}
              className="w-full text-sm text-text-secondary bg-slate-50 border border-transparent rounded-xl focus:border-border-default focus:bg-white p-4 focus:ring-0 min-h-[100px] resize-none leading-relaxed transition-colors"
              placeholder="What did the client say?"
            />
          </div>
        ))}
        {(reviews.length === 0) && (
           <div className="col-span-full py-20 text-center border-2 border-dashed border-border-default rounded-3xl">
              <MessageSquare className="mx-auto text-text-tertiary mb-4" size={32} />
              <p className="text-text-secondary font-medium">No reviews added yet.</p>
           </div>
        )}
      </div>
    </div>
  );
};
