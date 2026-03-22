import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { 
  Monitor, 
  Smartphone,
  MapPin,
  Instagram,
  Facebook,
  Twitter,
  ChevronRight,
  Plus,
  Trash2,
  Image as ImageIcon,
  Save,
  Eye,
  Type,
  Layout,
  Camera,
  Upload,
  ArrowLeft,
  Settings,
  Building2
} from 'lucide-react';
import { PublicWebsite } from '../public/PublicWebsite';
import { AnimatePresence, motion } from 'framer-motion';

const SettingsSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, icon, children, defaultOpen = false }) => {
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

  const handleSocialChange = (key: keyof typeof business.socials, value: string) => {
    updateBusiness({
      socials: {
        ...business.socials,
        [key]: value
      }
    });
  };

  const handleAddField = (field: 'reviews' | 'proofOfWork') => {
    if (field === 'reviews') {
      const newReview = { id: Date.now().toString(), name: 'New Customer', text: 'Amazing service!', rating: 5 };
      updateBusiness({ reviews: [...business.reviews, newReview] });
    } else {
      const newProof = { id: Date.now().toString(), image: '', caption: 'New Work' };
      updateBusiness({ proofOfWork: [...business.proofOfWork, newProof] });
    }
  };

  const handleDeleteField = (field: 'reviews' | 'proofOfWork', id: string) => {
    if (field === 'reviews') {
      updateBusiness({ reviews: business.reviews.filter(r => r.id !== id) });
    } else {
      updateBusiness({ proofOfWork: business.proofOfWork.filter(p => p.id !== id) });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-24 relative animate-in fade-in duration-700">
      {/* Header Sticky */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-1 sticky top-0 bg-bg-secondary/80 backdrop-blur-md pt-4 pb-4 z-40 border-b border-border-light/20 -mx-1">
         <div className="space-y-1">
            <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-text-primary">Website Studio</h1>
            <p className="text-[10px] lg:text-xs text-text-tertiary uppercase tracking-widest font-bold">Design your public brand identity</p>
         </div>
         <div className="flex items-center gap-3">
            <Button 
               variant="secondary" 
               size="sm"
               className="flex-1 sm:flex-none h-11 px-6 rounded-xl font-bold bg-white shadow-sm border-border-light text-xs uppercase tracking-widest"
               onClick={() => setShowPreview(true)}
            >
              <Eye size={16} className="mr-2" />
              Preview Mode
            </Button>
            <Button 
              size="sm"
              className="flex-1 sm:flex-none h-11 px-8 rounded-xl font-bold shadow-xl shadow-brand/20 transition-all text-xs uppercase tracking-widest"
              style={{ backgroundColor: business.primaryColor }}
            >
              <Save size={16} className="mr-2" />
              Publish Changes
            </Button>
         </div>
      </header>

      <div className="space-y-6">
        {/* Core Branding Section */}
        <SettingsSection title="Visual Identity" icon={<Layout />} defaultOpen>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                 {/* Business Name */}
                 <div className="space-y-2.5">
                    <label className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest ml-1">Business Name</label>
                    <Input 
                       value={business.name} 
                       onChange={e => updateBusiness({ name: e.target.value })}
                       className="h-12 rounded-xl bg-bg-secondary/40 border-border-light/40 focus:bg-white text-sm"
                    />
                 </div>

                 {/* Main Accent Color */}
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

              {/* Logo Upload Simulation */}
              <div className="space-y-6">
                 <div className="space-y-2.5">
                    <label className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest ml-1">Company Logo</label>
                    <div className="flex items-center gap-5 bg-bg-secondary/40 p-4 rounded-2xl border border-border-light/40">
                       <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center border border-border-light shadow-sm overflow-hidden p-2">
                          {business.logo ? <img src={business.logo} className="object-contain w-full h-full" alt="Logo" /> : <Upload size={18} className="text-text-tertiary" />}
                       </div>
                       <div className="flex-1 space-y-2">
                          <Input 
                             placeholder="Logo URL (simulation)"
                             value={business.logo || ''}
                             onChange={e => updateBusiness({ logo: e.target.value })}
                             className="h-9 rounded-lg bg-white/50 border-border-light/50 text-[10px]"
                          />
                          <p className="text-[8px] text-text-tertiary uppercase tracking-widest px-1">Transparent PNG recommended</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </SettingsSection>

        {/* Hero Section Strategy */}
        <SettingsSection title="Hero & Entrance" icon={<Type />}>
           <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="space-y-6">
                    <div className="space-y-2.5">
                       <label className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest ml-1">Main Headline</label>
                       <Input 
                          value={business.headline} 
                          onChange={e => updateBusiness({ headline: e.target.value })}
                          placeholder="Your Bold Catchphrase"
                          className="h-12 rounded-xl bg-bg-secondary/40 border-border-light/40 focus:bg-white text-sm"
                       />
                    </div>
                    <div className="space-y-2.5">
                       <label className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest ml-1">Supportive Subtext</label>
                       <textarea 
                          value={business.subtext}
                          onChange={e => updateBusiness({ subtext: e.target.value })}
                          placeholder="Briefly explain your value proposition..."
                          className="w-full h-24 rounded-xl p-4 bg-bg-secondary/40 border-border-light/40 focus:bg-white text-sm transition-all outline-none resize-none font-medium leading-relaxed"
                       />
                    </div>
                 </div>

                 <div className="space-y-2.5">
                    <label className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest ml-1">Cover Image (Hero)</label>
                    <div className="relative aspect-video rounded-3xl bg-bg-secondary/40 border border-border-light/40 overflow-hidden group">
                       {business.coverImage ? (
                         <img src={business.coverImage} className="w-full h-full object-cover" alt="Cover" />
                       ) : (
                         <div className="absolute inset-0 flex flex-col items-center justify-center text-text-tertiary space-y-2">
                            <Camera size={24} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Select Image</span>
                         </div>
                       )}
                       <div className="absolute inset-x-4 bottom-4">
                          <Input 
                             placeholder="Cover Image URL"
                             value={business.coverImage || ''}
                             onChange={e => updateBusiness({ coverImage: e.target.value })}
                             className="h-10 bg-white shadow-xl rounded-xl border-none text-[10px] w-full"
                          />
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </SettingsSection>

        {/* Gallery / Proof of Work */}
        <SettingsSection title="Portfolio Gallery" icon={<ImageIcon />}>
           <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {business.proofOfWork.map((item) => (
                   <div key={item.id} className="relative aspect-square rounded-2xl bg-bg-secondary overflow-hidden border border-border-light group">
                      {item.image ? (
                        <img src={item.image} className="w-full h-full object-cover" alt="Portfolio" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-text-tertiary/40">
                           <Camera size={20} />
                        </div>
                      )}
                      
                      <div className="absolute inset-x-2 bottom-2 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                         <div className="flex justify-end pr-1">
                            <button 
                               onClick={() => handleDeleteField('proofOfWork', item.id)}
                               className="bg-white/90 backdrop-blur-md text-error p-1 rounded-lg hover:bg-error hover:text-white transition-all border-none cursor-pointer shadow-lg"
                            >
                               <Trash2 size={10} />
                            </button>
                         </div>
                         <Input 
                            placeholder="Image URL"
                            value={item.image}
                            onChange={(e) => {
                               const updated = business.proofOfWork.map(p => p.id === item.id ? { ...p, image: e.target.value } : p);
                               updateBusiness({ proofOfWork: updated });
                            }}
                            className="h-7 bg-white/90 border-none rounded-md text-[8px] p-2 w-full shadow-lg"
                         />
                         <Input 
                            placeholder="Caption"
                            value={item.caption}
                            onChange={(e) => {
                               const updated = business.proofOfWork.map(p => p.id === item.id ? { ...p, caption: e.target.value } : p);
                               updateBusiness({ proofOfWork: updated });
                            }}
                            className="h-7 bg-white/90 border-none rounded-md text-[8px] p-2 w-full shadow-lg"
                         />
                      </div>
                   </div>
                 ))}
                 <button 
                   onClick={() => handleAddField('proofOfWork')}
                   className="aspect-square rounded-2xl border-2 border-dashed border-border-light flex flex-col items-center justify-center gap-2 text-text-tertiary hover:border-brand/40 hover:text-brand transition-all group cursor-pointer bg-transparent"
                 >
                    <Plus size={20} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Add item</span>
                 </button>
              </div>
           </div>
        </SettingsSection>

        {/* About Experience */}
        <SettingsSection title="Our Story" icon={<Building2 />}>
           <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
              <div className="md:col-span-3 space-y-6">
                 <div className="space-y-2.5">
                    <label className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest ml-1">About Text</label>
                    <textarea 
                       value={business.aboutText}
                       onChange={e => updateBusiness({ aboutText: e.target.value })}
                       placeholder="Tell your clients who you are..."
                       className="w-full h-48 rounded-xl p-4 bg-bg-secondary/40 border-border-light/40 focus:bg-white text-sm transition-all outline-none resize-none font-medium leading-relaxed"
                    />
                 </div>
              </div>
              <div className="md:col-span-2 space-y-6">
                 <div className="space-y-2.5">
                    <label className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest ml-1">Side Image</label>
                    <div className="relative aspect-3/4 rounded-3xl bg-bg-secondary/40 border border-border-light/40 overflow-hidden group">
                       {business.aboutImage ? (
                          <img src={business.aboutImage} className="w-full h-full object-cover" alt="About" />
                       ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-text-tertiary space-y-2">
                             <ImageIcon size={24} />
                             <span className="text-[10px] font-bold uppercase tracking-widest">About Image</span>
                          </div>
                       )}
                       <div className="absolute inset-x-4 bottom-4">
                          <Input 
                             placeholder="About Image URL"
                             value={business.aboutImage || ''}
                             onChange={e => updateBusiness({ aboutImage: e.target.value })}
                             className="h-10 bg-white shadow-xl rounded-xl border-none text-[10px]"
                          />
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </SettingsSection>

        {/* Global Connections */}
        <SettingsSection title="Social & Footer" icon={<Settings />}>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                 <div className="space-y-2.5">
                    <label className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest ml-1">Store Location</label>
                    <div className="relative flex items-center">
                       <MapPin size={16} className="absolute left-4 text-text-tertiary" />
                       <Input 
                         value={business.address || ''} 
                         placeholder="Street address city, country"
                         onChange={e => updateBusiness({ address: e.target.value })}
                         className="h-11 pl-12 rounded-xl bg-bg-secondary/40 border-border-light/40 focus:bg-white text-xs"
                       />
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2.5">
                       <label className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest ml-1">Public Email</label>
                       <Input 
                         value={business.email || ''} 
                         onChange={e => updateBusiness({ email: e.target.value })}
                         className="h-11 rounded-xl bg-bg-secondary/40 border-border-light/40 focus:bg-white text-xs"
                       />
                    </div>
                    <div className="space-y-2.5">
                       <label className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest ml-1">Public Phone</label>
                       <Input 
                         value={business.phone || ''} 
                         onChange={e => updateBusiness({ phone: e.target.value })}
                         className="h-11 rounded-xl bg-bg-secondary/40 border-border-light/40 focus:bg-white text-xs"
                       />
                    </div>
                 </div>
              </div>

              <div className="space-y-6">
                 <label className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest ml-1 block">Social Presence</label>
                 <div className="space-y-3">
                    <div className="flex items-center gap-3 bg-bg-secondary/40 p-3 rounded-xl border border-border-light/40 focus-within:bg-white transition-all">
                       <Instagram size={14} className="text-text-tertiary" />
                       <input 
                          placeholder="Instagram URL"
                          value={business.socials?.instagram || ''}
                          onChange={e => handleSocialChange('instagram', e.target.value)}
                          className="bg-transparent border-none focus:ring-0 text-[11px] p-0 w-full font-medium"
                       />
                    </div>
                    <div className="flex items-center gap-3 bg-bg-secondary/40 p-3 rounded-xl border border-border-light/40 focus-within:bg-white transition-all">
                       <Facebook size={14} className="text-text-tertiary" />
                       <input 
                          placeholder="Facebook URL"
                          value={business.socials?.facebook || ''}
                          onChange={e => handleSocialChange('facebook', e.target.value)}
                          className="bg-transparent border-none focus:ring-0 text-[11px] p-0 w-full font-medium"
                       />
                    </div>
                    <div className="flex items-center gap-3 bg-bg-secondary/40 p-3 rounded-xl border border-border-light/40 focus-within:bg-white transition-all">
                       <Twitter size={14} className="text-text-tertiary" />
                       <input 
                          placeholder="Twitter URL"
                          value={business.socials?.twitter || ''}
                          onChange={e => handleSocialChange('twitter', e.target.value)}
                          className="bg-transparent border-none focus:ring-0 text-[11px] p-0 w-full font-medium"
                       />
                    </div>
                 </div>
              </div>
           </div>
        </SettingsSection>
      </div>

      {/* Preview Fullscreen Modal */}
      <AnimatePresence>
         {showPreview && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-60 bg-white flex flex-col"
           >
              <header className="h-20 border-b border-border-light flex items-center justify-between px-6 lg:px-10 shrink-0">
                 <button 
                   onClick={() => setShowPreview(false)}
                   className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-tertiary hover:text-text-primary transition-all border-none bg-transparent cursor-pointer"
                 >
                    <ArrowLeft size={16} /> Back to Editor
                 </button>

                 <div className="hidden lg:flex bg-bg-secondary p-1 rounded-2xl border border-border-light shadow-sm">
                    <button 
                      onClick={() => setViewMode('desktop')}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border-none cursor-pointer ${viewMode === 'desktop' ? 'bg-white text-text-primary shadow-sm' : 'text-text-tertiary hover:text-text-primary'}`}
                    >
                       <Monitor size={14} /> Desktop
                    </button>
                    <button 
                      onClick={() => setViewMode('mobile')}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border-none cursor-pointer ${viewMode === 'mobile' ? 'bg-white text-text-primary shadow-sm' : 'text-text-tertiary hover:text-text-primary'}`}
                    >
                       <Smartphone size={14} /> Mobile
                    </button>
                 </div>

                 {/* On mobile devices, only show mobile badge as per user request */}
                 <div className="lg:hidden">
                    <div className="flex items-center gap-2 text-[8px] font-bold text-text-tertiary uppercase tracking-widest bg-bg-secondary px-3 py-1.5 rounded-full border border-border-light/50">
                       <Smartphone size={10} /> Mobile Preview
                    </div>
                 </div>

                 <div className="flex items-center gap-3">
                    <span className="hidden sm:flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg border border-emerald-100">
                       <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Mode
                    </span>
                    <Button 
                      size="sm" 
                      onClick={() => setShowPreview(false)}
                      className="h-10 px-6 rounded-xl font-bold transition-all text-[10px] uppercase tracking-widest"
                      style={{ backgroundColor: business.primaryColor }}
                    >
                      Apply
                    </Button>
                 </div>
              </header>

              <div className="flex-1 bg-bg-tertiary flex items-center justify-center overflow-hidden relative p-4 lg:p-12">
                 <div className={`bg-white shadow-2xl transition-all duration-700 overflow-hidden relative ${viewMode === 'desktop' ? 'w-full h-full rounded-[32px]' : 'w-[320px] max-w-full h-[640px] max-h-full rounded-[48px] border-12 border-text-primary shadow-2xl relative flex flex-col'}`}>
                 <div className="w-full h-full overflow-y-auto overflow-x-hidden custom-scrollbar bg-white">
                    <div className="min-h-full w-full">
                       <PublicWebsite forcedView={viewMode} />
                    </div>
                 </div>
                    {viewMode === 'mobile' && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-10 h-1.5 bg-text-tertiary/20 rounded-full" />
                    )}
                 </div>
                 
                 {/* Background Decorative Grid */}
                 <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
              </div>
           </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
};
