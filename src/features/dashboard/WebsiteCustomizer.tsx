import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { 
  ChevronRight,
  Layout,
  Type,
  Image as ImageIcon,
  Star,
  Building2,
  Upload,
  Camera,
  Save,
  Check,
  Trash2,
  Globe,
  ExternalLink,
  Instagram,
  Facebook,
  Twitter,
  Plus
} from 'lucide-react';
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
  const [uploading, setUploading] = useState<string | null>(null);

  const [copying, setCopying] = useState(false);

  if (!business) return null;

  const rootDomain = import.meta.env.VITE_ROOT_DOMAIN || 'localhost:5173';
  const protocol = rootDomain.includes('localhost') ? 'http' : 'https';
  const publicUrl = `${protocol}://${business.slug || business.subdomain}.${rootDomain}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopying(true);
    setTimeout(() => setCopying(false), 2000);
  };

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
    <div className="max-w-4xl mx-auto py-12 px-6 lg:px-8 space-y-12 pb-32">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-10 border-b border-border-light/60">
        <div className="space-y-1">
          <h1 className="text-2xl font-medium tracking-tight text-text-primary">Website Studio</h1>
          <p className="text-[11px] text-text-tertiary font-normal leading-relaxed">Customize your public presence and brand story.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 bg-bg-secondary/50 rounded-xl border border-border-light/40 mr-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500/80 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
            <span className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest">Auto-saved</span>
          </div>

          <div className="flex items-center gap-3">
            {business.isPublished && (
              <button 
                onClick={handleCopyLink}
                className="h-10 px-4 rounded-xl bg-bg-secondary border border-border-light text-text-tertiary hover:text-brand transition-all flex items-center justify-center gap-2 group"
                title="Copy Live Link"
              >
                {copying ? <Check size={14} className="text-success" /> : <Save size={14} />}
                <span className="text-[10px] font-bold uppercase tracking-widest">{copying ? 'Copied' : 'Link'}</span>
              </button>
            )}
            
            <Button 
                variant={business.isPublished ? 'secondary' : 'primary'}
                className={`h-10 px-6 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${business.isPublished ? 'hover:text-error hover:border-error/20 bg-white' : 'shadow-lg shadow-brand/10'}`}
                onClick={() => updateBusiness({ isPublished: !business.isPublished })}
            >
                {business.isPublished ? 'Unpublish' : 'Go Live'}
            </Button>
          </div>
        </div>
      </header>

      <div className="space-y-8">
        <div className="flex items-center justify-between px-2">
           <h3 className="text-[11px] font-bold text-text-tertiary uppercase tracking-[0.2em]">Start Editing</h3>
           {business.isPublished && (
              <a 
                href={publicUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="text-[10px] font-medium text-brand hover:underline flex items-center gap-1.5"
              >
                View Site <ExternalLink size={10} />
              </a>
           )}
        </div>

        {/* Unified Content Editor */}
        <SettingsSection title="Visual Identity" icon={<Layout />} defaultOpen>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                 <div className="space-y-2.5">
                    <label className="text-[10px] font-medium text-text-tertiary uppercase tracking-widest ml-1">Business Name</label>
                    <Input 
                       value={business.name} 
                       onChange={e => updateBusiness({ name: e.target.value })}
                       className="h-11 rounded-xl bg-bg-secondary/40 border-border-light/40 focus:bg-white text-sm"
                    />
                 </div>
                 <div className="space-y-2.5">
                    <label className="text-[10px] font-medium text-text-tertiary uppercase tracking-widest ml-1">Accent Theme</label>
                    <div className="flex items-center gap-4 bg-bg-secondary/40 p-3 rounded-2xl border border-border-light/40">
                       <input 
                          type="color" 
                          value={business.primaryColor} 
                          onChange={e => updateBusiness({ primaryColor: e.target.value })}
                          className="w-10 h-10 rounded-xl border-none cursor-pointer p-0 overflow-hidden shadow-sm"
                       />
                       <div className="space-y-0.5">
                          <span className="text-xs font-medium block">{business.primaryColor.toUpperCase()}</span>
                          <span className="text-[9px] font-medium text-text-tertiary uppercase tracking-wider">Brand Accent</span>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="space-y-6">
                 <div className="space-y-2.5">
                    <label className="text-[10px] font-medium text-text-tertiary uppercase tracking-widest ml-1">Logo</label>
                    <div className="flex items-center gap-5 bg-bg-secondary/40 p-3 rounded-2xl border border-border-light/40">
                       <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center border border-border-light/60 shadow-sm overflow-hidden p-2 relative shrink-0">
                          {business.logo ? <img src={business.logo} className="object-contain w-full h-full" alt="Logo" /> : <Upload size={16} className="text-text-tertiary" />}
                          {uploading === 'logo' && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><div className="w-4 h-4 border-2 border-brand border-t-transparent rounded-full animate-spin" /></div>}
                          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0], 'logo')} />
                       </div>
                       <div className="flex-1">
                          <p className="text-[10px] font-medium text-text-primary uppercase tracking-wide">Brand Icon</p>
                          <p className="text-[8px] text-text-tertiary uppercase mt-1 tracking-widest">Supports PNG/SVG</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </SettingsSection>

        <SettingsSection title="Hero & Entrance" icon={<Type />}>
           <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="space-y-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-medium text-text-tertiary uppercase tracking-widest ml-1">Main Headline</label>
                       <Input 
                          value={business.heroTitle} 
                          onChange={e => updateBusiness({ heroTitle: e.target.value })}
                          className="h-11 rounded-xl bg-bg-secondary/40 border-border-light/40 focus:bg-white text-sm"
                       />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-medium text-text-tertiary uppercase tracking-widest ml-1">Secondary Text</label>
                       <Input 
                          value={business.heroSubtitle} 
                          onChange={e => updateBusiness({ heroSubtitle: e.target.value })}
                          className="h-11 rounded-xl bg-bg-secondary/40 border-border-light/40 focus:bg-white text-sm"
                       />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-medium text-text-tertiary uppercase tracking-widest ml-1">Call to Action</label>
                       <Input 
                          value={business.ctaText} 
                          onChange={e => updateBusiness({ ctaText: e.target.value })}
                          className="h-11 rounded-xl bg-bg-secondary/40 border-border-light/40 focus:bg-white text-sm"
                       />
                    </div>
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-medium text-text-tertiary uppercase tracking-widest ml-1">Background Image</label>
                    <div className="aspect-video rounded-[32px] bg-bg-secondary/40 border border-border-light/60 flex items-center justify-center relative overflow-hidden group">
                       {business.coverImage ? (
                         <img src={business.coverImage} className="w-full h-full object-cover" alt="Cover" />
                       ) : (
                         <div className="text-center space-y-2">
                           <ImageIcon className="mx-auto text-text-tertiary" size={24} />
                           <p className="text-[8px] font-bold text-text-tertiary uppercase tracking-[0.2em]">Select Cover</p>
                         </div>
                       )}
                       <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                          <Camera className="text-white" size={24} />
                          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0], 'cover')} />
                       </div>
                       {uploading === 'cover' && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><div className="w-6 h-6 border-4 border-brand border-t-transparent rounded-full animate-spin" /></div>}
                    </div>
                 </div>
              </div>
           </div>
        </SettingsSection>

        <SettingsSection title="Proof & Showcase" icon={<ImageIcon />}>
           <div className="space-y-10">
              <div className="flex items-center justify-between">
                 <div className="space-y-1">
                    <h4 className="text-base font-medium text-text-primary">Portfolio Gallery</h4>
                    <p className="text-xs text-text-tertiary leading-relaxed">Let the quality of your work do the talking.</p>
                 </div>
                 <Button variant="secondary" size="sm" className="h-10 px-5 rounded-xl font-bold text-[10px] uppercase tracking-widest" onClick={() => handleAddField('proofOfWork')}>
                    <Plus size={14} className="mr-2" />
                    New Entry
                 </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 {(business.proofOfWork || []).sort((a: any, b: any) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()).map((item: any) => (
                    <motion.div 
                      key={item.id} 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="group flex flex-col bg-bg-secondary/40 rounded-[24px] border border-border-light/60 overflow-hidden relative transition-all hover:bg-white hover:shadow-md"
                    >
                       <div className="aspect-video bg-bg-tertiary flex items-center justify-center relative">
                          {item.image_url ? (
                            <img src={item.image_url} className="w-full h-full object-cover" alt="Proof" />
                          ) : (
                            <ImageIcon className="text-text-tertiary" size={20} />
                          )}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <Camera className="text-white cursor-pointer" size={20} />
                             <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0], 'proof', item.id)} />
                          </div>
                          {uploading === item.id && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><div className="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin" /></div>}
                       </div>
                       <div className="p-4 pr-10">
                          <input 
                             value={item.caption || ''} 
                             onChange={e => {
                               const { updateProofItem } = useAppStore.getState();
                               updateProofItem(item.id, { caption: e.target.value });
                             }}
                             className="w-full bg-transparent border-none text-[10px] p-0 font-medium placeholder:text-text-tertiary focus:outline-none"
                             placeholder="Entry label..."
                          />
                          <button 
                             onClick={() => handleDeleteField('proofOfWork', item.id)}
                             className="absolute bottom-4 right-4 p-1.5 text-text-tertiary hover:text-error transition-colors"
                          >
                             <Trash2 size={12} />
                          </button>
                       </div>
                    </motion.div>
                 ))}
              </div>
           </div>
        </SettingsSection>

        <SettingsSection title="Consumer Reviews" icon={<Star />}>
           <div className="space-y-10">
              <div className="flex items-center justify-between">
                 <div className="space-y-1">
                    <h4 className="text-base font-medium text-text-primary">Testimonials</h4>
                    <p className="text-xs text-text-tertiary leading-relaxed">Real words from real customers.</p>
                 </div>
                 <Button variant="secondary" size="sm" className="h-10 px-5 rounded-xl font-bold text-[10px] uppercase tracking-widest" onClick={() => handleAddField('reviews')}>
                    <Plus size={14} className="mr-2" />
                    Add Review
                 </Button>
              </div>

              <div className="space-y-4">
                 {(business.reviews || []).sort((a: any, b: any) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()).map((review: any) => (
                    <motion.div 
                      key={review.id} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-6 bg-bg-secondary/40 rounded-[28px] border border-border-light/60 relative group transition-all hover:bg-white hover:shadow-md"
                    >
                       <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                          <div className="space-y-2">
                             <label className="text-[9px] font-medium text-text-tertiary uppercase tracking-widest">Reviewer</label>
                             <Input 
                                value={review.customer_name} 
                                onChange={e => {
                                  const { updateReview } = useAppStore.getState();
                                  updateReview(review.id, { customer_name: e.target.value });
                                }}
                                className="h-10 bg-white border-border-light/80 rounded-xl text-xs"
                             />
                          </div>
                          <div className="md:col-span-3 space-y-2">
                             <label className="text-[9px] font-medium text-text-tertiary uppercase tracking-widest">Endorsement</label>
                             <Input 
                                value={review.comment} 
                                onChange={e => {
                                  const { updateReview } = useAppStore.getState();
                                  updateReview(review.id, { comment: e.target.value });
                                }}
                                className="h-10 bg-white border-border-light/80 rounded-xl text-sm"
                             />
                          </div>
                       </div>
                       <button 
                          onClick={() => handleDeleteField('reviews', review.id)}
                          className="absolute top-4 right-4 p-2 text-text-tertiary opacity-0 group-hover:opacity-100 transition-all hover:text-error"
                       >
                          <Trash2 size={14} />
                       </button>
                    </motion.div>
                 ))}
              </div>
           </div>
        </SettingsSection>

        <SettingsSection title="Story & Identity" icon={<Building2 />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <div className="space-y-8">
                  <div className="space-y-3">
                     <label className="text-[10px] font-medium text-text-tertiary uppercase tracking-widest ml-1">Section Title</label>
                     <Input 
                        value={business.aboutTitle} 
                        onChange={e => updateBusiness({ aboutTitle: e.target.value })}
                        className="h-10 rounded-xl bg-bg-secondary/40 border-border-light/60 text-xs font-medium"
                     />
                  </div>
                  <div className="space-y-3">
                     <label className="text-[10px] font-medium text-text-tertiary uppercase tracking-widest ml-1">The Full Story</label>
                     <textarea 
                        value={business.aboutDescription} 
                        onChange={e => updateBusiness({ aboutDescription: e.target.value })}
                        rows={10}
                        className="w-full p-5 rounded-[28px] bg-bg-secondary/40 border border-border-light/60 focus:bg-white text-sm leading-relaxed focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand transition-all font-light"
                        placeholder="Share your journey..."
                     />
                  </div>
               </div>
               <div className="space-y-3 shrink-0">
                  <label className="text-[10px] font-medium text-text-tertiary uppercase tracking-widest ml-1">About Photo</label>
                  <div className="aspect-4/5 rounded-[40px] bg-bg-secondary/40 border border-border-light/60 flex items-center justify-center relative overflow-hidden group">
                     {business.aboutImage ? (
                       <img src={business.aboutImage} className="w-full h-full object-cover" alt="About" />
                     ) : (
                       <div className="text-center space-y-2">
                          <ImageIcon className="mx-auto text-text-tertiary" size={24} />
                          <p className="text-[8px] font-bold text-text-tertiary uppercase tracking-widest">Upload Photo</p>
                       </div>
                     )}
                     <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                        <Camera className="text-white shadow-xl" size={28} />
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0], 'about')} />
                     </div>
                     {uploading === 'about' && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" /></div>}
                  </div>
               </div>
            </div>
        </SettingsSection>

        <SettingsSection title="Social & Contact" icon={<Globe />}>
           <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                    <div className="flex items-center gap-2 ml-1">
                      <Instagram size={14} className="text-text-tertiary" />
                      <label className="text-[10px] font-medium text-text-tertiary uppercase tracking-widest">Instagram</label>
                    </div>
                    <Input 
                      value={business.socials.instagram}
                      onChange={e => handleSocialChange('instagram', e.target.value)}
                      className="h-11 rounded-xl bg-bg-secondary/40 border-border-light/60 text-xs"
                      placeholder="@id"
                    />
                </div>
                <div className="space-y-3">
                    <div className="flex items-center gap-2 ml-1">
                      <Facebook size={14} className="text-text-tertiary" />
                      <label className="text-[10px] font-medium text-text-tertiary uppercase tracking-widest">Facebook</label>
                    </div>
                    <Input 
                      value={business.socials.facebook}
                      onChange={e => handleSocialChange('facebook', e.target.value)}
                      className="h-11 rounded-xl bg-bg-secondary/40 border-border-light/60 text-xs"
                      placeholder="Profile link"
                    />
                </div>
                <div className="space-y-3">
                    <div className="flex items-center gap-2 ml-1">
                      <Twitter size={14} className="text-text-tertiary" />
                      <label className="text-[10px] font-medium text-text-tertiary uppercase tracking-widest">Twitter</label>
                    </div>
                    <Input 
                      value={business.socials.twitter}
                      onChange={e => handleSocialChange('twitter', e.target.value)}
                      className="h-11 rounded-xl bg-bg-secondary/40 border-border-light/60 text-xs"
                      placeholder="@handle"
                    />
                </div>
              </div>

              <div className="pt-8 border-t border-border-light/40">
                <div className="flex flex-col gap-1 mb-6">
                   <h4 className="text-sm font-medium text-text-primary">Footer Contact Details</h4>
                   <p className="text-[10px] text-text-tertiary font-normal uppercase tracking-widest">These appear on your public website</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-3">
                      <label className="text-[10px] font-medium text-text-tertiary uppercase tracking-widest ml-1">Public Email</label>
                      <Input 
                        value={business.email || ''} 
                        onChange={e => updateBusiness({ email: e.target.value })}
                        className="h-11 rounded-xl bg-bg-secondary/40 border-border-light/60 text-sm"
                        placeholder="hello@business.com"
                      />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-medium text-text-tertiary uppercase tracking-widest ml-1">Public Phone</label>
                      <Input 
                        value={business.phone || ''} 
                        onChange={e => updateBusiness({ phone: e.target.value })}
                        className="h-11 rounded-xl bg-bg-secondary/40 border-border-light/60 text-sm"
                        placeholder="+1 (555) 000-0000"
                      />
                   </div>
                   <div className="md:col-span-2 space-y-3">
                      <label className="text-[10px] font-medium text-text-tertiary uppercase tracking-widest ml-1">Physical Address / Location</label>
                      <Input 
                        value={business.address || ''} 
                        onChange={e => updateBusiness({ address: e.target.value })}
                        className="h-11 rounded-xl bg-bg-secondary/40 border-border-light/60 text-sm"
                        placeholder="123 Studio St, City, Country"
                      />
                   </div>
                </div>
              </div>
           </div>
        </SettingsSection>
      </div>
    </div>
  );
};
