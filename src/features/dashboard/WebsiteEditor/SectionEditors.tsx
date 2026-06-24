import React, { useState } from 'react';
import { useAppStore } from '../../../store/useAppStore';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Plus, ChevronRight, ChevronLeft, Trash2, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { uploadEditorAsset } from './editorUtils';

const EditorEmptyState: React.FC<{ title: string; action: string; onAction: () => void }> = ({ title, action, onAction }) => (
  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-6 text-center space-y-3">
    <p className="text-xs font-medium text-slate-500">{title}</p>
    <button onClick={onAction} className="text-[10px] font-bold uppercase tracking-widest text-brand hover:text-brand-hover">
      {action}
    </button>
  </div>
);

const EditorError: React.FC<{ message: string | null }> = ({ message }) => {
  if (!message) return null;
  return (
    <div className="p-3 rounded-xl border border-red-100 bg-red-50 text-red-600 flex items-start gap-2">
      <AlertCircle size={14} className="mt-0.5 shrink-0" />
      <p className="text-xs leading-relaxed">{message}</p>
    </div>
  );
};

// ----------------------------------------------------------------------
// SERVICES EDITOR
// ----------------------------------------------------------------------
export const ServicesEditor: React.FC = () => {
  const { business, addService, updateService, deleteService } = useAppStore();
  const [editingId, setEditingId] = useState<string | null | 'new'>(null);
  const [formData, setFormData] = useState<any>({});

  if (!business) return null;

  const handleEdit = (id: string | 'new') => {
    if (id === 'new') {
      setFormData({ name: '', price: 0, duration: 60, active: true });
    } else {
      const s = business.services.find(s => s.id === id);
      if (s) setFormData({ ...s });
    }
    setEditingId(id);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) return alert('Service name is required');
    if (editingId === 'new') {
      await addService({ ...formData, id: Date.now().toString() });
    } else if (editingId) {
      await updateService(editingId, formData);
    }
    setEditingId(null);
  };

  if (editingId) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
          <button onClick={() => setEditingId(null)} className="p-1 -ml-1 text-slate-400 hover:text-slate-600"><ChevronLeft size={16} /></button>
          <h3 className="text-xs font-bold text-text-primary uppercase tracking-widest">{editingId === 'new' ? 'Add Service' : 'Edit Service'}</h3>
        </div>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-text-tertiary">Service Name</label>
            <Input value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} className="h-10" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-text-tertiary">Price ($)</label>
            <Input type="number" value={formData.price || 0} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} className="h-10" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-text-tertiary">Duration (mins)</label>
            <Input type="number" value={formData.duration || 0} onChange={e => setFormData({ ...formData, duration: Number(e.target.value) })} className="h-10" />
          </div>
          <Button onClick={handleSave} className="w-full h-10 bg-brand text-white rounded-xl text-xs font-bold">Save Service</Button>
          {editingId !== 'new' && (
            <button onClick={() => { deleteService(editingId); setEditingId(null); }} className="w-full py-3 text-red-500 text-[10px] font-bold uppercase tracking-widest hover:bg-red-50 rounded-xl transition-colors">
              Delete Service
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xs font-bold text-text-primary uppercase tracking-widest">Services</h3>
        <button onClick={() => handleEdit('new')} className="text-brand hover:text-brand-hover"><Plus size={16} /></button>
      </div>
      <div className="space-y-2">
        {business.services?.map(service => (
          <button key={service.id} onClick={() => handleEdit(service.id)} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center group hover:border-brand/40 transition-all text-left">
            <div>
              <p className="text-xs font-bold text-text-primary">{service.name}</p>
              <p className="text-[10px] text-text-tertiary">{service.duration} mins • ${service.price}</p>
            </div>
            <ChevronRight size={14} className="text-slate-300 group-hover:text-brand transition-colors" />
          </button>
        ))}
        <button onClick={() => handleEdit('new')} className="w-full py-3 rounded-xl border-2 border-dashed border-slate-200 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:border-brand/40 hover:text-brand transition-all mt-2">
          + Add New Service
        </button>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// REVIEWS EDITOR
// ----------------------------------------------------------------------
export const ReviewsEditor: React.FC = () => {
  const { business, addReview, updateReview, deleteReview } = useAppStore();
  const [editingIndex, setEditingIndex] = useState<number | null | 'new'>(null);
  const [formData, setFormData] = useState<any>({});

  if (!business) return null;

  const handleEdit = (index: number | 'new') => {
    if (index === 'new') {
      setFormData({ id: Date.now().toString(), author_name: '', content: '', rating: 5 });
    } else {
      setFormData({ ...business.reviews[index] });
    }
    setEditingIndex(index);
  };

  const handleSave = async () => {
    if (editingIndex === 'new') {
      await addReview({
        author_name: formData.author_name || '',
        content: formData.content || '',
        rating: Number(formData.rating || 5)
      });
    } else {
      const review = business.reviews[editingIndex as number];
      if (review) await updateReview(review.id, formData);
    }
    setEditingIndex(null);
  };

  const handleDelete = (index: number) => {
    const review = business.reviews[index];
    if (review) deleteReview(review.id);
  };

  if (editingIndex !== null) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
          <button onClick={() => setEditingIndex(null)} className="p-1 -ml-1 text-slate-400 hover:text-slate-600"><ChevronLeft size={16} /></button>
          <h3 className="text-xs font-bold text-text-primary uppercase tracking-widest">{editingIndex === 'new' ? 'Add Review' : 'Edit Review'}</h3>
        </div>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-text-tertiary">Reviewer Name</label>
            <Input value={formData.author_name || ''} onChange={e => setFormData({ ...formData, author_name: e.target.value })} className="h-10" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-text-tertiary">Review Content</label>
            <textarea value={formData.content || ''} onChange={e => setFormData({ ...formData, content: e.target.value })} className="w-full p-3 rounded-lg border border-slate-200 text-sm min-h-[100px]" />
          </div>
          <Button onClick={handleSave} className="w-full h-10 bg-brand text-white rounded-xl text-xs font-bold">Save Review</Button>
          {editingIndex !== 'new' && (
            <button onClick={() => { handleDelete(editingIndex); setEditingIndex(null); }} className="w-full py-3 text-red-500 text-[10px] font-bold uppercase tracking-widest hover:bg-red-50 rounded-xl transition-colors">
              Delete Review
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xs font-bold text-text-primary uppercase tracking-widest">Reviews</h3>
        <button onClick={() => handleEdit('new')} className="text-brand hover:text-brand-hover"><Plus size={16} /></button>
      </div>
      <div className="space-y-3">
        {(business.reviews || []).length === 0 && (
          <EditorEmptyState title="No reviews yet." action="Add Review" onAction={() => handleEdit('new')} />
        )}
        {business.reviews?.map((review, idx) => (
          <div key={review.id} onClick={() => handleEdit(idx)} className="p-3 bg-slate-50 border border-slate-100 rounded-xl cursor-pointer hover:border-brand/40 transition-all">
            <p className="text-[10px] font-bold text-text-primary">{review.author_name}</p>
            <p className="text-[10px] text-text-tertiary line-clamp-2 mt-1 leading-relaxed">"{review.content}"</p>
          </div>
        ))}
        <button onClick={() => handleEdit('new')} className="w-full py-3 rounded-xl border-2 border-dashed border-slate-200 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:border-brand/40 hover:text-brand transition-all mt-2">
          + Add New Review
        </button>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// GALLERY EDITOR
// ----------------------------------------------------------------------
export const GalleryEditor: React.FC = () => {
  const { business, addProofItem, deleteProofItem } = useAppStore();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  if (!business) return null;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const publicUrl = await uploadEditorAsset({ businessId: business.id, file, folder: 'gallery', maxSizeMb: 10 });
      await addProofItem({ image_url: publicUrl, caption: '' });
    } catch (err) {
      setUploadError((err as Error).message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = (id: string) => {
    deleteProofItem(id);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xs font-bold text-text-primary uppercase tracking-widest">Gallery</h3>
        <label className="text-brand hover:text-brand-hover cursor-pointer flex items-center gap-1">
          <Plus size={16} /> <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>
      <EditorError message={uploadError} />
      {(business.proofOfWork || []).length === 0 && !uploading && (
        <EditorEmptyState title="No gallery images yet." action="Upload Image" onAction={() => document.getElementById('gallery-upload-input')?.click()} />
      )}
      <div className="grid grid-cols-2 gap-3">
        {business.proofOfWork?.map(item => (
          <div key={item.id} className="relative aspect-square rounded-lg bg-slate-100 overflow-hidden border border-slate-200 group">
            <img src={item.image_url} className="w-full h-full object-cover" />
            <button onClick={() => handleDelete(item.id)} className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 size={12} />
            </button>
          </div>
        ))}
        {uploading && (
          <div className="aspect-square rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-brand border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
      <label className="w-full py-3 rounded-xl border-2 border-dashed border-slate-200 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:border-brand/40 hover:text-brand transition-all flex items-center justify-center cursor-pointer mt-2">
        + Upload Image
        <input id="gallery-upload-input" type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
      </label>
    </div>
  );
};

// ----------------------------------------------------------------------
// FAQ EDITOR
// ----------------------------------------------------------------------
export const FAQEditor: React.FC = () => {
  const { business, updateBusiness } = useAppStore();
  const [editingIndex, setEditingIndex] = useState<number | null | 'new'>(null);
  const [formData, setFormData] = useState<any>({});

  if (!business) return null;

  const handleEdit = (index: number | 'new') => {
    if (index === 'new') {
      setFormData({ id: Date.now().toString(), question: '', answer: '', orderIndex: (business.faqs?.length || 0) });
    } else {
      setFormData({ ...business.faqs[index] });
    }
    setEditingIndex(index);
  };

  const handleSave = () => {
    const faqs = [...(business.faqs || [])];
    if (editingIndex === 'new') faqs.push(formData);
    else faqs[editingIndex as number] = formData;
    updateBusiness({ faqs });
    setEditingIndex(null);
  };

  const handleDelete = (index: number) => {
    const faqs = business.faqs.filter((_, i) => i !== index);
    updateBusiness({ faqs });
  };

  if (editingIndex !== null) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
          <button onClick={() => setEditingIndex(null)} className="p-1 -ml-1 text-slate-400 hover:text-slate-600"><ChevronLeft size={16} /></button>
          <h3 className="text-xs font-bold text-text-primary uppercase tracking-widest">{editingIndex === 'new' ? 'Add FAQ' : 'Edit FAQ'}</h3>
        </div>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-text-tertiary">Question</label>
            <Input value={formData.question || ''} onChange={e => setFormData({ ...formData, question: e.target.value })} className="h-10" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-text-tertiary">Answer</label>
            <textarea value={formData.answer || ''} onChange={e => setFormData({ ...formData, answer: e.target.value })} className="w-full p-3 rounded-lg border border-slate-200 text-sm min-h-[100px]" />
          </div>
          <Button onClick={handleSave} className="w-full h-10 bg-brand text-white rounded-xl text-xs font-bold">Save FAQ</Button>
          {editingIndex !== 'new' && (
            <button onClick={() => { handleDelete(editingIndex); setEditingIndex(null); }} className="w-full py-3 text-red-500 text-[10px] font-bold uppercase tracking-widest hover:bg-red-50 rounded-xl transition-colors">
              Delete FAQ
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xs font-bold text-text-primary uppercase tracking-widest">FAQs</h3>
        <button onClick={() => handleEdit('new')} className="text-brand hover:text-brand-hover"><Plus size={16} /></button>
      </div>
      <div className="space-y-3">
        {(business.faqs || []).length === 0 && (
          <EditorEmptyState title="No FAQs yet." action="Add FAQ" onAction={() => handleEdit('new')} />
        )}
        {business.faqs?.map((faq, idx) => (
          <div key={faq.id} onClick={() => handleEdit(idx)} className="p-3 bg-slate-50 border border-slate-100 rounded-xl cursor-pointer hover:border-brand/40 transition-all">
            <p className="text-xs font-bold text-text-primary line-clamp-1">{faq.question}</p>
            <p className="text-[10px] text-text-tertiary line-clamp-2 mt-1 leading-relaxed">{faq.answer}</p>
          </div>
        ))}
        <button onClick={() => handleEdit('new')} className="w-full py-3 rounded-xl border-2 border-dashed border-slate-200 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:border-brand/40 hover:text-brand transition-all mt-2">
          + Add New FAQ
        </button>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// BEFORE / AFTER EDITOR (WITH VIDEO SUPPORT)
// ----------------------------------------------------------------------
export const BeforeAfterEditor: React.FC = () => {
  const { business, updateBusiness } = useAppStore();
  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  if (!business) return null;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: string, type: 'beforeUrl' | 'afterUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(`${id}-${type}`);
    setUploadError(null);
    try {
      const publicUrl = await uploadEditorAsset({ businessId: business.id, file, folder: 'before-after', allowVideo: true, maxSizeMb: 30 });
      const newItems = business.beforeAfterImages.map(item => item.id === id ? { ...item, [type]: publicUrl } : item);
      updateBusiness({ beforeAfterImages: newItems });
    } catch (err) {
      setUploadError((err as Error).message);
    } finally {
      setUploading(null);
      e.target.value = '';
    }
  };

  const handleAdd = () => {
    const newItems = [...(business.beforeAfterImages || []), { id: Date.now().toString(), beforeUrl: '', afterUrl: '', title: 'New Transformation', description: '' }];
    updateBusiness({ beforeAfterImages: newItems });
  };

  const handleDelete = (id: string) => {
    updateBusiness({ beforeAfterImages: business.beforeAfterImages.filter(i => i.id !== id) });
  };

  const handleChange = (id: string, field: string, value: string) => {
    updateBusiness({ beforeAfterImages: business.beforeAfterImages.map(i => i.id === id ? { ...i, [field]: value } : i) });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xs font-bold text-text-primary uppercase tracking-widest">Transformations</h3>
        <button onClick={handleAdd} className="text-brand hover:text-brand-hover"><Plus size={16} /></button>
      </div>
      <EditorError message={uploadError} />
      {(business.beforeAfterImages || []).length === 0 && (
        <EditorEmptyState title="No before and after results yet." action="Add Result" onAction={handleAdd} />
      )}
      
      <div className="space-y-6">
        {business.beforeAfterImages?.map((item) => (
          <div key={item.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-4 relative">
             <div className="absolute top-2 right-2">
                <button onClick={() => handleDelete(item.id)} className="p-1 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
             </div>
             
             <div className="space-y-1 pr-6">
               <label className="text-[10px] font-bold text-text-tertiary">Title</label>
               <Input value={item.title || ''} onChange={e => handleChange(item.id, 'title', e.target.value)} className="h-8 text-xs" />
             </div>
             
             <div className="grid grid-cols-2 gap-3">
                {/* Before Media */}
                <div className="space-y-1">
                   <p className="text-[10px] font-bold text-text-tertiary text-center">BEFORE</p>
                   <label className="aspect-[4/5] rounded-lg bg-slate-200 border border-slate-300 flex items-center justify-center cursor-pointer overflow-hidden relative group">
                      {item.beforeUrl ? (
                        item.beforeUrl.match(/\.(mp4|webm)$/i) 
                          ? <video src={item.beforeUrl} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                          : <img src={item.beforeUrl} className="w-full h-full object-cover" />
                      ) : <span className="text-[10px] font-bold text-slate-400">+ Add</span>}
                      {uploading === `${item.id}-beforeUrl` && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><div className="w-4 h-4 border-2 border-brand border-t-transparent rounded-full animate-spin" /></div>}
                      <input type="file" accept="image/*,video/mp4,video/webm" className="hidden" onChange={e => handleUpload(e, item.id, 'beforeUrl')} disabled={!!uploading} />
                   </label>
                </div>
                {/* After Media */}
                <div className="space-y-1">
                   <p className="text-[10px] font-bold text-text-tertiary text-center">AFTER</p>
                   <label className="aspect-[4/5] rounded-lg bg-slate-200 border border-slate-300 flex items-center justify-center cursor-pointer overflow-hidden relative group">
                      {item.afterUrl ? (
                        item.afterUrl.match(/\.(mp4|webm)$/i) 
                          ? <video src={item.afterUrl} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                          : <img src={item.afterUrl} className="w-full h-full object-cover" />
                      ) : <span className="text-[10px] font-bold text-slate-400">+ Add</span>}
                      {uploading === `${item.id}-afterUrl` && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><div className="w-4 h-4 border-2 border-brand border-t-transparent rounded-full animate-spin" /></div>}
                      <input type="file" accept="image/*,video/mp4,video/webm" className="hidden" onChange={e => handleUpload(e, item.id, 'afterUrl')} disabled={!!uploading} />
                   </label>
                </div>
             </div>
          </div>
        ))}
      </div>
      <button onClick={handleAdd} className="w-full py-3 rounded-xl border-2 border-dashed border-slate-200 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:border-brand/40 hover:text-brand transition-all">
        + Add Transformation
      </button>
    </div>
  );
};


// ----------------------------------------------------------------------
// HERO EDITOR
// ----------------------------------------------------------------------
export const HeroEditor: React.FC = () => {
  const { business, updateBusiness } = useAppStore();
  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  if (!business) return null;

  const handleUpload = async (file: File, type: 'logo' | 'cover') => {
    if (!file) return;
    setUploading(type);
    setUploadError(null);
    try {
      const publicUrl = await uploadEditorAsset({ businessId: business.id, file, folder: type, maxSizeMb: type === 'logo' ? 5 : 10 });
      if (type === 'logo') updateBusiness({ logo: publicUrl });
      else if (type === 'cover') updateBusiness({ coverImage: publicUrl });
    } catch (err) {
      setUploadError((err as Error).message);
    } finally {
      setUploading(null);
    }
  };

  return (
    <div className="space-y-6">
      <EditorError message={uploadError} />
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-text-tertiary">Cover Image</label>
        <label className="block w-full h-32 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden relative group cursor-pointer">
          {business.coverImage ? (
            <img src={business.coverImage} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 group-hover:text-brand transition-colors"><ImageIcon size={24} /></div>
          )}
          {uploading === 'cover' && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><div className="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin" /></div>}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white text-xs font-bold tracking-wide">Upload Cover</span>
          </div>
          <input type="file" className="hidden" accept="image/*" onChange={e => { if (e.target.files?.[0]) handleUpload(e.target.files[0], 'cover'); }} disabled={!!uploading} />
        </label>
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-text-tertiary">Logo</label>
        <div className="flex items-end gap-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0 relative">
             {business.logo ? <img src={business.logo} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-400"><ImageIcon size={16} /></div>}
             {uploading === 'logo' && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><div className="w-4 h-4 border-2 border-brand border-t-transparent rounded-full animate-spin" /></div>}
          </div>
          <label className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:text-brand hover:border-brand/30 transition-all cursor-pointer bg-white shadow-sm mb-1">
             Upload Logo
             <input type="file" className="hidden" accept="image/*" onChange={e => { if (e.target.files?.[0]) handleUpload(e.target.files[0], 'logo'); }} disabled={!!uploading} />
          </label>
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-text-tertiary">Business Name</label>
        <Input value={business.name} onChange={e => updateBusiness({ name: e.target.value })} className="h-10 text-sm font-bold" />
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-text-tertiary">Slogan / Short Bio</label>
        <textarea value={business.heroSubtitle || ''} onChange={e => updateBusiness({ heroSubtitle: e.target.value })} className="w-full p-3 rounded-lg border border-slate-200 text-sm min-h-[80px]" placeholder="A short catchy phrase about your business..." />
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// ABOUT EDITOR
// ----------------------------------------------------------------------
export const AboutEditor: React.FC = () => {
  const { business, updateBusiness } = useAppStore();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  if (!business) return null;

  const handleUpload = async (file: File) => {
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const publicUrl = await uploadEditorAsset({ businessId: business.id, file, folder: 'about', maxSizeMb: 10 });
      updateBusiness({ aboutImage: publicUrl });
    } catch (err) {
      setUploadError((err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <EditorError message={uploadError} />
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-text-tertiary">About Image</label>
        <label className="block w-full aspect-video rounded-xl bg-slate-100 border border-slate-200 overflow-hidden relative group cursor-pointer">
          {business.aboutImage ? (
            <img src={business.aboutImage} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 group-hover:text-brand transition-colors"><ImageIcon size={24} /></div>
          )}
          {uploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><div className="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin" /></div>}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white text-xs font-bold tracking-wide">Upload Image</span>
          </div>
          <input type="file" className="hidden" accept="image/*" onChange={e => { if (e.target.files?.[0]) handleUpload(e.target.files[0]); }} disabled={uploading} />
        </label>
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-text-tertiary">About Text</label>
        <textarea 
          value={business.aboutDescription || ''} 
          onChange={e => updateBusiness({ aboutDescription: e.target.value })} 
          className="w-full p-3 rounded-lg border border-slate-200 text-sm min-h-[200px]" 
          placeholder="Tell your story..." 
        />
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// AVAILABILITY EDITOR
// ----------------------------------------------------------------------
export const AvailabilityEditor: React.FC = () => {
  const { business, updateBusiness } = useAppStore();
  
  if (!business) return null;

  const days = [
    { label: 'Sunday', value: 0 },
    { label: 'Monday', value: 1 },
    { label: 'Tuesday', value: 2 },
    { label: 'Wednesday', value: 3 },
    { label: 'Thursday', value: 4 },
    { label: 'Friday', value: 5 },
    { label: 'Saturday', value: 6 }
  ];

  const getDayHours = (dayOfWeek: number) => {
    return business.workingHours.find((h) => h.dayOfWeek === dayOfWeek || h.day_of_week === dayOfWeek) || {
      dayOfWeek,
      day_of_week: dayOfWeek,
      startTime: '09:00',
      start_time: '09:00',
      endTime: '17:00',
      end_time: '17:00',
      isOpen: false,
      is_open: false
    };
  };

  const handleUpdate = (dayOfWeek: number, field: 'isOpen' | 'startTime' | 'endTime', value: boolean | string) => {
    const nextHours = days.map(({ value: currentDay }) => {
      const hours = getDayHours(currentDay);
      if (currentDay !== dayOfWeek) return hours;

      if (field === 'isOpen') {
        return { ...hours, isOpen: value as boolean, is_open: value as boolean };
      }

      if (field === 'startTime') {
        return { ...hours, startTime: value as string, start_time: value as string };
      }

      return { ...hours, endTime: value as string, end_time: value as string };
    });

    updateBusiness({ workingHours: nextHours });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xs font-bold text-text-primary uppercase tracking-widest">Business Hours</h3>
      </div>
      <div className="space-y-3">
        {(business.workingHours || []).filter((hours) => hours.isOpen).length === 0 && (
          <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-xs leading-relaxed text-amber-700">
            No open hours yet. Turn on at least one day so customers can find available times.
          </div>
        )}
        {days.map(({ label, value }) => {
          const hours = getDayHours(value);
          return (
            <div key={value} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
               <label className="flex items-center gap-2 w-28 shrink-0 cursor-pointer">
                  <input type="checkbox" checked={hours.isOpen} onChange={e => handleUpdate(value, 'isOpen', e.target.checked)} className="rounded border-slate-300 text-brand focus:ring-brand" />
                  <span className="text-xs font-bold text-text-primary">{label}</span>
               </label>
               {hours.isOpen ? (
                 <div className="flex items-center gap-2 flex-1">
                   <Input type="time" value={hours.startTime} onChange={e => handleUpdate(value, 'startTime', e.target.value)} className="h-8 text-xs px-2" />
                   <span className="text-xs text-text-tertiary">to</span>
                   <Input type="time" value={hours.endTime} onChange={e => handleUpdate(value, 'endTime', e.target.value)} className="h-8 text-xs px-2" />
                 </div>
               ) : (
                 <div className="flex-1 text-xs text-slate-400 font-medium">Closed</div>
               )}
            </div>
          );
        })}
      </div>
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
        <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Contact Email</label>
        <Input value={business.email || ''} onChange={e => updateBusiness({ email: e.target.value })} type="email" className="h-10 text-sm" placeholder="e.g. hello@mybusiness.com" />
      </div>
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
