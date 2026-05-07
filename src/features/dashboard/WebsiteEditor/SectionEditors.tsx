import React, { useState } from 'react';
import { useAppStore } from '../../../store/useAppStore';
import { Input } from '../../../components/ui/Input';
import { supabase } from '../../../lib/supabase';
import { Plus, Trash2, Image as ImageIcon, Check, ChevronRight } from 'lucide-react';

interface ServicesEditorProps {
  onEdit: (id: string) => void;
  onAdd: () => void;
}

export const ServicesEditor: React.FC<ServicesEditorProps> = ({ onEdit, onAdd }) => {
  const { business } = useAppStore();
  if (!business) return null;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xs font-bold text-text-primary uppercase tracking-widest">Services</h3>
        <button onClick={onAdd} className="text-brand hover:text-brand-hover"><Plus size={16} /></button>
      </div>
      <div className="space-y-2">
        {business.services?.map(service => (
          <button 
            key={service.id} 
            onClick={() => onEdit(service.id)}
            className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center group hover:border-brand/40 transition-all text-left"
          >
            <div>
              <p className="text-xs font-bold text-text-primary">{service.name}</p>
              <p className="text-[10px] text-text-tertiary">{service.duration} mins • ${service.price}</p>
            </div>
            <ChevronRight size={14} className="text-slate-300 group-hover:text-brand transition-colors" />
          </button>
        ))}
        <button 
          onClick={onAdd}
          className="w-full py-3 rounded-xl border-2 border-dashed border-slate-200 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:border-brand/40 hover:text-brand transition-all mt-2"
        >
          + Add New Service
        </button>
      </div>
    </div>
  );
};

interface ReviewsEditorProps {
  onManage: () => void;
}

export const ReviewsEditor: React.FC<ReviewsEditorProps> = ({ onManage }) => {
  const { business } = useAppStore();
  if (!business) return null;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xs font-bold text-text-primary uppercase tracking-widest">Reviews</h3>
        <button onClick={onManage} className="text-brand text-[10px] font-bold uppercase tracking-widest hover:underline">Manage All</button>
      </div>
      <div className="space-y-3">
        {business.reviews?.slice(0, 3).map(review => (
          <div key={review.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
            <p className="text-[10px] font-bold text-text-primary">{review.authorName}</p>
            <p className="text-[10px] text-text-tertiary line-clamp-2 mt-1 leading-relaxed">"{review.text}"</p>
          </div>
        ))}
        <button 
          onClick={onManage}
          className="w-full py-3 rounded-xl border border-slate-200 text-[10px] font-bold uppercase tracking-widest hover:border-brand hover:text-brand transition-all bg-white shadow-sm mt-2"
        >
          Open Reviews Editor
        </button>
      </div>
    </div>
  );
};

interface GalleryEditorProps {
  onManage: () => void;
}

export const GalleryEditor: React.FC<GalleryEditorProps> = ({ onManage }) => {
  const { business } = useAppStore();
  if (!business) return null;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xs font-bold text-text-primary uppercase tracking-widest">Gallery</h3>
        <button onClick={onManage} className="text-brand text-[10px] font-bold uppercase tracking-widest hover:underline">Manage All</button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {business.proofOfWork?.slice(0, 5).map(item => (
          <div key={item.id} className="aspect-square rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
            <img src={item.imageUrl} className="w-full h-full object-cover" />
          </div>
        ))}
        <button 
          onClick={onManage}
          className="aspect-square rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400 hover:border-brand/40 hover:text-brand transition-all"
        >
          <Plus size={16} />
        </button>
      </div>
      <button 
        onClick={onManage}
        className="w-full py-3 rounded-xl border border-slate-200 text-[10px] font-bold uppercase tracking-widest hover:border-brand hover:text-brand transition-all bg-white shadow-sm mt-2"
      >
        Open Gallery Manager
      </button>
    </div>
  );
};

export const FooterEditor: React.FC = () => {
  const { business, updateBusiness } = useAppStore();
  if (!business) return null;

  const handleUpdate = (platform: keyof typeof business.socials, url: string) => {
    updateBusiness({
      socials: { ...(business.socials || { instagram: '', facebook: '', twitter: '' }), [platform]: url }
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Address</label>
        <Input value={business.address || ''} onChange={e => updateBusiness({ address: e.target.value })} className="h-10 text-sm" placeholder="e.g. 123 Main St, City" />
      </div>
      
      <div className="pt-4 border-t border-slate-100 space-y-4">
        <h3 className="text-xs font-bold text-text-primary uppercase tracking-widest">Social Links</h3>
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-text-tertiary">Instagram URL</label>
            <Input value={business.socials?.instagram || ''} onChange={e => handleUpdate('instagram', e.target.value)} className="h-8 text-xs" placeholder="https://instagram.com/..." />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-text-tertiary">Facebook URL</label>
            <Input value={business.socials?.facebook || ''} onChange={e => handleUpdate('facebook', e.target.value)} className="h-8 text-xs" placeholder="https://facebook.com/..." />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-text-tertiary">Twitter/X URL</label>
            <Input value={business.socials?.twitter || ''} onChange={e => handleUpdate('twitter', e.target.value)} className="h-8 text-xs" placeholder="https://twitter.com/..." />
          </div>
        </div>
      </div>
    </div>
  );
};
