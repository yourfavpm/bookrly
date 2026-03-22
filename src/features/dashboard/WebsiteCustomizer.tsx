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
  ChevronRight,
  Plus,
  Trash2,
  Image as ImageIcon,
  Save
} from 'lucide-react';
import { PublicWebsite } from '../public/PublicWebsite';

const SettingsSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border-light last:border-none">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-5 group"
      >
        <div className="flex items-center gap-2.5">
          <div className={`transition-colors ${isOpen ? 'text-brand' : 'text-text-tertiary group-hover:text-brand'}`}>
            {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<{ size?: number }>, { size: 16 }) : icon}
          </div>
          <span className={`text-xs font-bold tracking-tight uppercase ${isOpen ? 'text-text-primary' : 'text-text-secondary group-hover:text-text-primary'}`}>{title}</span>
        </div>
        <ChevronRight size={14} className={`text-text-tertiary transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[1000px] pb-6' : 'max-h-0'}`}>
        <div className="space-y-6">
           {children}
        </div>
      </div>
    </div>
  );
};

export const WebsiteCustomizer: React.FC = () => {
  const { business, updateBusiness } = useAppStore();
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  const handleSocialChange = (key: keyof typeof business.socials, value: string) => {
    updateBusiness({
      socials: {
        ...business.socials,
        [key]: value
      }
    });
  };

  const handleAddReview = () => {
    const newReview = { id: Date.now().toString(), name: 'New Customer', text: 'Amazing service!', rating: 5 };
    updateBusiness({ reviews: [...business.reviews, newReview] });
  };

  const handleDeleteReview = (id: string) => {
    updateBusiness({ reviews: business.reviews.filter(r => r.id !== id) });
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)] gap-8 animate-in fade-in duration-700">
      {/* Settings Panel */}
      <aside className="w-full lg:w-96 flex flex-col gap-6 shrink-0 order-2 lg:order-1">
        <div className="space-y-1 px-1">
           <h1 className="text-xl lg:text-2xl font-black tracking-tight text-text-primary">Customize</h1>
           <p className="text-[10px] text-text-tertiary uppercase tracking-widest font-bold">Design & Content</p>
        </div>

        <Card className="flex-1 overflow-y-auto p-0 border-border-light/60 shadow-sm bg-white rounded-[32px]">
          <div className="p-6 lg:p-8 space-y-2">
            
            <SettingsSection title="Hero & Branding" icon={<Plus />} defaultOpen>
               <div className="space-y-4">
                  <div className="space-y-2">
                     <label className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest ml-1">Headline</label>
                     <Input 
                        value={business.name} 
                        onChange={e => updateBusiness({ name: e.target.value })}
                        className="h-10 rounded-xl bg-bg-secondary/30 border-border-light/40 focus:bg-white text-xs"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest ml-1">Accent Color</label>
                     <div className="flex items-center gap-3 bg-bg-secondary/30 p-2 rounded-xl border border-border-light/40">
                        <input 
                           type="color" 
                           value={business.primaryColor} 
                           onChange={e => updateBusiness({ primaryColor: e.target.value })}
                           className="w-8 h-8 rounded-lg border-none cursor-pointer"
                        />
                        <span className="text-[10px] font-bold text-text-primary uppercase tracking-tight">{business.primaryColor}</span>
                     </div>
                  </div>
               </div>
            </SettingsSection>

            <SettingsSection title="Footer & Contact" icon={<MapPin />}>
               <div className="space-y-4">
                  <div className="space-y-2">
                     <label className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest ml-1">Location Address</label>
                     <Input 
                        value={business.address || ''} 
                        placeholder="Street address city, country"
                        onChange={e => updateBusiness({ address: e.target.value })}
                        className="h-10 rounded-xl bg-bg-secondary/30 border-border-light/40 focus:bg-white text-xs"
                     />
                  </div>
                  <div className="space-y-4 pt-2">
                     <label className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest ml-1 block">Social Links</label>
                     <div className="space-y-3">
                        <div className="flex items-center gap-3 bg-bg-secondary/30 p-2.5 rounded-xl border border-border-light/40 focus-within:bg-white transition-all">
                           <Instagram size={14} className="text-text-tertiary" />
                           <input 
                              placeholder="Instagram profile"
                              value={business.socials?.instagram || ''}
                              onChange={e => handleSocialChange('instagram', e.target.value)}
                              className="bg-transparent border-none focus:ring-0 text-[11px] p-0 w-full font-medium"
                           />
                        </div>
                        <div className="flex items-center gap-3 bg-bg-secondary/30 p-2.5 rounded-xl border border-border-light/40 focus-within:bg-white transition-all">
                           <Facebook size={14} className="text-text-tertiary" />
                           <input 
                              placeholder="Facebook page"
                              value={business.socials?.facebook || ''}
                              onChange={e => handleSocialChange('facebook', e.target.value)}
                              className="bg-transparent border-none focus:ring-0 text-[11px] p-0 w-full font-medium"
                           />
                        </div>
                     </div>
                  </div>
               </div>
            </SettingsSection>

            <SettingsSection title="Testimonials" icon={<ImageIcon />}>
               <div className="space-y-4">
                  {business.reviews.map((review) => (
                    <div key={review.id} className="p-3 bg-bg-secondary/30 rounded-xl border border-border-light/40 space-y-2 relative group">
                       <button 
                         onClick={() => handleDeleteReview(review.id)}
                         className="absolute top-2 right-2 p-1 text-text-tertiary hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
                       >
                         <Trash2 size={12} />
                       </button>
                       <input 
                         className="bg-transparent border-none p-0 text-[11px] font-bold text-text-primary focus:ring-0 w-full"
                         value={review.name}
                         onChange={e => {
                            const updated = business.reviews.map(r => r.id === review.id ? { ...r, name: e.target.value } : r);
                            updateBusiness({ reviews: updated });
                         }}
                       />
                       <textarea 
                         className="bg-transparent border-none p-0 text-[10px] text-text-secondary focus:ring-0 w-full resize-none h-12 leading-relaxed"
                         value={review.text}
                         onChange={e => {
                            const updated = business.reviews.map(r => r.id === review.id ? { ...r, text: e.target.value } : r);
                            updateBusiness({ reviews: updated });
                         }}
                       />
                    </div>
                  ))}
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="w-full text-[10px] h-10 rounded-xl border-border-light uppercase tracking-widest font-bold"
                    onClick={handleAddReview}
                  >
                     <Plus size={12} className="mr-2" /> Add Review
                  </Button>
               </div>
            </SettingsSection>
          </div>
        </Card>

        <Button 
          className="w-full h-12 rounded-2xl shadow-xl shadow-brand/20 font-bold text-xs uppercase tracking-widest"
          style={{ backgroundColor: business.primaryColor }}
        >
           <Save size={16} className="mr-2" />
           Publish Site
        </Button>
      </aside>

      {/* Preview Area */}
      <main className="flex-1 flex flex-col gap-6 order-1 lg:order-2">
        <header className="flex items-center justify-between px-2">
           <div className="flex bg-white p-1 rounded-2xl border border-border-light/60 shadow-sm">
              <button 
                onClick={() => setViewMode('desktop')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${viewMode === 'desktop' ? 'bg-text-primary text-white shadow-md' : 'text-text-tertiary hover:bg-bg-secondary'}`}
              >
                 <Monitor size={14} /> Desktop
              </button>
              <button 
                onClick={() => setViewMode('mobile')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${viewMode === 'mobile' ? 'bg-text-primary text-white shadow-md' : 'text-text-tertiary hover:bg-bg-secondary'}`}
              >
                 <Smartphone size={14} /> Mobile
              </button>
           </div>
           <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Preview
           </div>
        </header>

        <div className="flex-1 bg-bg-tertiary rounded-[40px] border border-border-light shadow-inner flex items-center justify-center overflow-hidden h-full relative p-4 lg:p-8">
           <div className={`bg-white shadow-2xl transition-all duration-700 overflow-hidden relative ${viewMode === 'desktop' ? 'w-full h-full rounded-[32px]' : 'w-[320px] h-[640px] rounded-[48px] border-8 border-text-primary shadow-2xl relative'}`}>
              <div className={`w-full h-full overflow-y-auto ${viewMode === 'mobile' ? 'p-0' : ''}`}>
                 <div className="transform origin-top scale-100 min-h-10">
                    <PublicWebsite />
                 </div>
              </div>
              {viewMode === 'mobile' && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-8 h-1 bg-text-tertiary/20 rounded-full" />
              )}
           </div>
           
           {/* Background Grid */}
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        </div>
      </main>
    </div>
  );
};
