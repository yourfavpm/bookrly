import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { 
  Monitor, 
  Smartphone,
  Instagram,
  Facebook,
  Twitter,
  ChevronRight,
  Plus,
  Trash2,
  Image as ImageIcon,
  Save,
  ExternalLink,
  Type,
  Layout,
  Camera,
  Upload,
  Building2,
  X,
  Star,
  Globe
} from 'lucide-react';
import { PublicWebsite } from '../public/PublicWebsite';
import { AnimatePresence, motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';

interface SettingsSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ title, icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <Card className="p-0 border-border-light/60 shadow-sm bg-white rounded-[28px] overflow-hidden transition-all duration-300">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 group"
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isOpen ? 'bg-brand text-white shadow-md' : 'bg-bg-secondary text-text-tertiary group-hover:bg-bg-tertiary'}`}>
            {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<{ size?: number }>, { size: 16 }) : icon}
          </div>
          <span className={`text-[10px] font-bold tracking-widest uppercase ${isOpen ? 'text-text-primary' : 'text-text-secondary group-hover:text-text-primary'}`}>{title}</span>
        </div>
        <ChevronRight size={14} className={`text-text-tertiary transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-8 space-y-8 animate-in fade-in duration-500">
              <div className="h-px bg-border-light/40 -mx-6 mb-6" />
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export const WebsiteCustomizer: React.FC = () => {
  const { business, updateBusiness } = useAppStore();
  const [showPreview, setShowPreview] = useState(false);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [uploading, setUploading] = useState<string | null>(null);

  if (!business) return null;

  const handleSocialChange = (key: keyof typeof business.socials, value: string) => {
    updateBusiness({
      socials: {
        ...business.socials,
        [key]: value
      }
    });
  };

  const handleAddField = async (field: 'reviews' | 'proofOfWork') => {
    const { addReview, addProofItem } = useAppStore.getState();
    if (field === 'reviews') {
      await addReview({ customer_name: 'New Customer', comment: 'Amazing service!', rating: 5 });
    } else {
      await addProofItem({ image_url: '', caption: 'New Work' });
    }
  };

  const handleDeleteField = async (field: 'reviews' | 'proofOfWork', id: string) => {
    const { deleteReview, deleteProofItem } = useAppStore.getState();
    if (field === 'reviews') {
      await deleteReview(id);
    } else {
      await deleteProofItem(id);
    }
  };

  const handleUpload = async (file: File, type: 'logo' | 'cover' | 'about' | 'proof', extraId?: string) => {
    if (!file) return;
    setUploading(extraId || type);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${type}-${Date.now()}.${fileExt}`;
      const filePath = `${business.id}/${fileName}`;
      await supabase.storage.from('business-assets').upload(filePath, file);
      const { data: { publicUrl } } = supabase.storage.from('business-assets').getPublicUrl(filePath);
      
      if (type === 'logo') await updateBusiness({ logo: publicUrl });
      else if (type === 'cover') await updateBusiness({ coverImage: publicUrl });
      else if (type === 'about') await updateBusiness({ aboutImage: publicUrl });
      else if (type === 'proof' && extraId) {
        const { updateProofItem } = useAppStore.getState();
        await updateProofItem(extraId, { image_url: publicUrl });
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-24 relative animate-in fade-in duration-700">
       <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-1 sticky top-0 bg-bg-secondary/80 backdrop-blur-md pt-4 pb-4 z-40 border-b border-border-light/20 -mx-1">
         <div className="space-y-1">
            <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight text-text-primary">Website Studio</h1>
            <p className="text-[10px] lg:text-xs text-text-tertiary uppercase tracking-widest font-medium">Design your public brand identity</p>
         </div>
         <div className="flex items-center gap-3">
            <a 
               href={`/p/${business.subdomain}`}
               target="_blank"
               rel="noopener noreferrer"
               className="flex-1 sm:flex-none h-11 px-6 rounded-xl font-semibold bg-white shadow-sm border border-border-light text-xs uppercase tracking-widest text-text-primary flex items-center justify-center gap-2 hover:bg-bg-secondary transition-colors"
            >
              <ExternalLink size={14} />
              View Live Site
            </a>
            <Button 
              size="sm"
              className="flex-1 sm:flex-none h-11 px-8 rounded-xl font-semibold shadow-xl shadow-brand/20 transition-all text-xs uppercase tracking-widest bg-brand text-white"
              onClick={() => updateBusiness({ isPublished: true })}
            >
              <Save size={16} className="mr-2" />
              {business.isPublished ? 'Published ✓' : 'Publish Site'}
            </Button>
         </div>
      </header>

      <div className="space-y-6">
        <SettingsSection title="Visual Identity" icon={<Layout />} defaultOpen>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                 <div className="space-y-2.5">
                    <label className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest ml-1">Business Name</label>
                    <Input 
                       value={business.name} 
                       onChange={e => updateBusiness({ name: e.target.value })}
                       className="h-12 rounded-xl bg-bg-secondary/40 border-border-light/40 focus:bg-white text-sm"
                    />
                 </div>
                 <div className="space-y-2.5">
                    <label className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest ml-1">Accent Theme</label>
                    <div className="flex items-center gap-4 bg-bg-secondary/40 p-3 rounded-2xl border border-border-light/40">
                       <input 
                          type="color" 
                          value={business.primaryColor} 
                          onChange={e => updateBusiness({ primaryColor: e.target.value })}
                          className="w-12 h-12 rounded-xl border-none cursor-pointer p-0 overflow-hidden shadow-sm"
                       />
                       <div className="space-y-1">
                          <span className="text-xs font-black block tracking-tight">{business.primaryColor.toUpperCase()}</span>
                          <span className="text-[8px] font-bold text-text-tertiary uppercase tracking-[0.2em]">Application Accent</span>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="space-y-6">
                 <div className="space-y-2.5">
                    <label className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest ml-1">Company Logo</label>
                    <div className="flex items-center gap-5 bg-bg-secondary/40 p-4 rounded-2xl border border-border-light/40">
                       <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center border border-border-light shadow-sm overflow-hidden p-2 relative">
                          {business.logo ? <img src={business.logo} className="object-contain w-full h-full" alt="Logo" /> : <Upload size={18} className="text-text-tertiary" />}
                          {uploading === 'logo' && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><div className="w-4 h-4 border-2 border-brand border-t-transparent rounded-full animate-spin" /></div>}
                          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0], 'logo')} />
                       </div>
                       <div className="flex-1 space-y-2">
                          <p className="text-[10px] font-bold text-text-primary uppercase">Click to upload brand logo</p>
                          <p className="text-[8px] text-text-tertiary uppercase tracking-widest">Transparent PNG recommended</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </SettingsSection>

        <SettingsSection title="Hero & Entrance" icon={<Type />}>
           <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="space-y-6">
                    <div className="space-y-2.5">
                       <label className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest ml-1">Main Headline</label>
                       <Input 
                          value={business.heroTitle} 
                          onChange={e => updateBusiness({ heroTitle: e.target.value })}
                          className="h-12 rounded-xl bg-bg-secondary/40 border-border-light/40 focus:bg-white text-sm"
                       />
                    </div>
                    <div className="space-y-2.5">
                       <label className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest ml-1">Sub-headline</label>
                       <Input 
                          value={business.heroSubtitle} 
                          onChange={e => updateBusiness({ heroSubtitle: e.target.value })}
                          className="h-12 rounded-xl bg-bg-secondary/40 border-border-light/40 focus:bg-white text-sm"
                       />
                    </div>
                    <div className="space-y-2.5">
                       <label className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest ml-1">Button Text</label>
                       <Input 
                          value={business.ctaText} 
                          onChange={e => updateBusiness({ ctaText: e.target.value })}
                          className="h-12 rounded-xl bg-bg-secondary/40 border-border-light/40 focus:bg-white text-sm"
                       />
                    </div>
                 </div>
                 <div className="space-y-2.5">
                    <label className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest ml-1">Hero Image</label>
                    <div className="aspect-video rounded-3xl bg-bg-secondary/40 border border-border-light/40 flex items-center justify-center relative overflow-hidden group">
                       {business.coverImage ? (
                         <img src={business.coverImage} className="w-full h-full object-cover" alt="Cover" />
                       ) : (
                         <div className="text-center space-y-2">
                           <ImageIcon className="mx-auto text-text-tertiary" size={32} />
                           <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">No Image</p>
                         </div>
                       )}
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                          <div className="flex flex-col items-center gap-2 text-white">
                             <Camera size={24} />
                             <span className="text-[10px] font-bold uppercase tracking-widest">Change Photo</span>
                          </div>
                          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0], 'cover')} />
                       </div>
                       {uploading === 'cover' && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><div className="w-6 h-6 border-4 border-brand border-t-transparent rounded-full animate-spin" /></div>}
                    </div>
                 </div>
              </div>
           </div>
        </SettingsSection>

        <SettingsSection title="Proof & Showcase" icon={<ImageIcon />}>
           <div className="space-y-8">
              <div className="flex items-center justify-between">
                 <div>
                    <h4 className="text-[10px] font-bold text-text-primary uppercase tracking-widest">Portfolio Gallery</h4>
                    <p className="text-[9px] text-text-tertiary">Showcase your best work and transformations.</p>
                 </div>
                 <Button variant="secondary" size="sm" className="h-9 px-4 rounded-xl font-bold text-[10px] uppercase tracking-widest" onClick={() => handleAddField('proofOfWork')}>
                    <Plus size={14} className="mr-2" />
                    Add Entry
                 </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 {(business.proofOfWork || []).map((item: any) => (
                    <div key={item.id} className="group flex flex-col bg-bg-secondary/40 rounded-2xl border border-border-light/40 overflow-hidden relative">
                       <div className="aspect-video bg-bg-tertiary flex items-center justify-center relative">
                          {item.image_url ? (
                            <img src={item.image_url} className="w-full h-full object-cover" alt="Proof" />
                          ) : (
                            <ImageIcon className="text-text-tertiary" size={24} />
                          )}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <Camera className="text-white cursor-pointer" size={20} />
                             <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0], 'proof', item.id)} />
                          </div>
                          {uploading === item.id && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><div className="w-5 h-5 border-3 border-brand border-t-transparent rounded-full animate-spin" /></div>}
                       </div>
                       <div className="p-3 pr-10">
                          <Input 
                             value={item.caption || ''} 
                             onChange={e => {
                               const { updateProofItem } = useAppStore.getState();
                               updateProofItem(item.id, { caption: e.target.value });
                             }}
                             className="h-8 bg-transparent border-none text-[10px] p-0 font-medium placeholder:text-text-tertiary"
                             placeholder="Add a caption..."
                          />
                          <button 
                             onClick={() => handleDeleteField('proofOfWork', item.id)}
                             className="absolute bottom-3 right-3 p-1.5 text-text-tertiary hover:text-error transition-colors"
                          >
                             <Trash2 size={12} />
                          </button>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </SettingsSection>

        <SettingsSection title="Consumer Reviews" icon={<Star />}>
           <div className="space-y-8">
              <div className="flex items-center justify-between">
                 <div>
                    <h4 className="text-[10px] font-bold text-text-primary uppercase tracking-widest">Testimonials</h4>
                    <p className="text-[9px] text-text-tertiary">What your customers say about you.</p>
                 </div>
                 <Button variant="secondary" size="sm" className="h-9 px-4 rounded-xl font-bold text-[10px] uppercase tracking-widest" onClick={() => handleAddField('reviews')}>
                    <Plus size={14} className="mr-2" />
                    Add Review
                 </Button>
              </div>

              <div className="space-y-4">
                 {(business.reviews || []).map((review: any) => (
                    <div key={review.id} className="p-5 bg-bg-secondary/40 rounded-2xl border border-border-light/40 relative group">
                       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                          <div className="space-y-1.5">
                             <label className="text-[8px] font-bold text-text-tertiary uppercase tracking-widest">Customer</label>
                             <Input 
                                value={review.customer_name} 
                                onChange={e => {
                                  const { updateReview } = useAppStore.getState();
                                  updateReview(review.id, { customer_name: e.target.value });
                                }}
                                className="h-10 bg-white border-border-light/60 rounded-xl text-xs font-bold"
                             />
                          </div>
                          <div className="md:col-span-3 space-y-1.5">
                             <label className="text-[8px] font-bold text-text-tertiary uppercase tracking-widest">Comment</label>
                             <Input 
                                value={review.comment} 
                                onChange={e => {
                                  const { updateReview } = useAppStore.getState();
                                  updateReview(review.id, { comment: e.target.value });
                                }}
                                className="h-10 bg-white border-border-light/60 rounded-xl text-xs"
                             />
                          </div>
                       </div>
                       <button 
                          onClick={() => handleDeleteField('reviews', review.id)}
                          className="absolute top-4 right-4 p-1.5 text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity hover:text-error"
                       >
                          <Trash2 size={14} />
                       </button>
                    </div>
                 ))}
              </div>
           </div>
        </SettingsSection>

        <SettingsSection title="About & Story" icon={<Building2 />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               <div className="space-y-6">
                  <div className="space-y-2.5">
                     <label className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest ml-1">About Title</label>
                     <Input 
                        value={business.aboutTitle} 
                        onChange={e => updateBusiness({ aboutTitle: e.target.value })}
                        className="h-11 rounded-xl bg-bg-secondary/40 border-border-light/40 text-xs font-bold"
                     />
                  </div>
                  <div className="space-y-2.5">
                     <label className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest ml-1">Description</label>
                     <textarea 
                        value={business.aboutDescription} 
                        onChange={e => updateBusiness({ aboutDescription: e.target.value })}
                        rows={6}
                        className="w-full p-4 rounded-2xl bg-bg-secondary/40 border border-border-light/40 focus:bg-white text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand/10 focus:border-brand transition-all"
                     />
                  </div>
               </div>
               <div className="space-y-6">
                  <div className="space-y-2.5">
                     <label className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest ml-1">About Photo</label>
                     <div className="aspect-square rounded-3xl bg-bg-secondary/40 border border-border-light/40 flex items-center justify-center relative overflow-hidden group">
                        {business.aboutImage ? (
                          <img src={business.aboutImage} className="w-full h-full object-cover" alt="About" />
                        ) : (
                          <div className="text-center space-y-2">
                             <ImageIcon className="mx-auto text-text-tertiary" size={24} />
                             <p className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest">No Selection</p>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                           <Camera className="text-white" size={24} />
                           <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0], 'about')} />
                        </div>
                        {uploading === 'about' && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><div className="w-6 h-6 border-4 border-brand border-t-transparent rounded-full animate-spin" /></div>}
                     </div>
                  </div>
               </div>
            </div>
        </SettingsSection>

        <SettingsSection title="Social Presence" icon={<Globe />}>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2.5">
                 <div className="flex items-center gap-2 ml-1">
                    <Instagram size={14} className="text-text-tertiary" />
                    <label className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest">Instagram</label>
                 </div>
                 <Input 
                   value={business.socials.instagram}
                   onChange={e => handleSocialChange('instagram', e.target.value)}
                   className="h-11 rounded-xl bg-bg-secondary/40 border-border-light/40 text-xs"
                   placeholder="@yourhandle"
                 />
              </div>
              <div className="space-y-2.5">
                 <div className="flex items-center gap-2 ml-1">
                    <Facebook size={14} className="text-text-tertiary" />
                    <label className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest">Facebook</label>
                  </div>
                 <Input 
                   value={business.socials.facebook}
                   onChange={e => handleSocialChange('facebook', e.target.value)}
                   className="h-11 rounded-xl bg-bg-secondary/40 border-border-light/40 text-xs"
                   placeholder="Facebook ID"
                 />
              </div>
              <div className="space-y-2.5">
                 <div className="flex items-center gap-2 ml-1">
                    <Twitter size={14} className="text-text-tertiary" />
                    <label className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest">Twitter/X</label>
                 </div>
                 <Input 
                   value={business.socials.twitter}
                   onChange={e => handleSocialChange('twitter', e.target.value)}
                   className="h-11 rounded-xl bg-bg-secondary/40 border-border-light/40 text-xs"
                   placeholder="@handle"
                 />
              </div>
           </div>
        </SettingsSection>
      </div>

      <AnimatePresence>
        {showPreview && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 bg-black/60 backdrop-blur-xl flex items-center justify-center p-4 lg:p-8"
          >
            <div className="w-full h-full max-w-7xl bg-bg-secondary rounded-[40px] shadow-2xl overflow-hidden flex flex-col relative">
              <div className="p-6 border-b border-border-light flex items-center justify-between bg-white">
                <div className="flex items-center gap-8">
                  <div className="flex flex-col">
                    <h2 className="text-lg font-black tracking-tight text-text-primary">Live Preview</h2>
                    <p className="text-[10px] text-text-tertiary uppercase tracking-widest font-bold">Currently viewing: {viewMode}</p>
                  </div>
                  
                  <div className="bg-bg-secondary p-1 rounded-2xl flex items-center gap-1 border border-border-light">
                    <button 
                      onClick={() => setViewMode('desktop')}
                      className={`h-9 px-6 rounded-xl flex items-center gap-2 text-xs font-bold transition-all ${viewMode === 'desktop' ? 'bg-white text-brand shadow-sm' : 'text-text-tertiary hover:text-text-primary'}`}
                    >
                      <Monitor size={14} />
                      Desktop
                    </button>
                    <button 
                      onClick={() => setViewMode('mobile')}
                      className={`h-9 px-6 rounded-xl flex items-center gap-2 text-xs font-bold transition-all ${viewMode === 'mobile' ? 'bg-white text-brand shadow-sm' : 'text-text-tertiary hover:text-text-primary'}`}
                    >
                      <Smartphone size={14} />
                      Mobile
                    </button>
                  </div>
                </div>
                
                <button 
                  onClick={() => setShowPreview(false)}
                  className="w-11 h-11 rounded-2xl bg-bg-secondary flex items-center justify-center text-text-tertiary hover:bg-error/10 hover:text-error transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 bg-bg-tertiary/50 p-4 lg:p-10 overflow-auto flex items-center justify-center">
                <div className={`transition-all duration-700 bg-white shadow-2xl rounded-[32px] overflow-hidden ${viewMode === 'mobile' ? 'w-[375px] h-[700px] ring-12 ring-black/5' : 'w-full h-full'}`}>
                   <PublicWebsite forcedView={viewMode} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
