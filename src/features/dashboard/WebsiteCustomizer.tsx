import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Input } from '../../components/ui/Input';
import { Image as ImageIcon, Upload, Camera, Instagram, Facebook, ExternalLink, Sparkles, Link2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';


const STEPS = [
  { id: 'info', title: 'Business Info', description: 'Basic contact details' },
  { id: 'branding', title: 'Branding', description: 'Logo and colors' },
  { id: 'hero', title: 'Hero Section', description: 'Your main headline' },
  { id: 'socials', title: 'Socials', description: 'Connect accounts' },
  { id: 'publish', title: 'Publish', description: 'Go live with your site' }
];

export const WebsiteCustomizer: React.FC = () => {
  const { 
    business, 
    updateBusiness, 
    updateProofItem
  } = useAppStore();
  const [activeTab, setActiveTab] = useState(STEPS[0].id);
  const [uploading, setUploading] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Autosave simulation/feedback
  useEffect(() => {
    setIsSaving(true);
    const timer = setTimeout(() => setIsSaving(false), 800);
    return () => clearTimeout(timer);
  }, [business]);

  if (!business) return null;

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
        await updateProofItem(extraId, { image_url: publicUrl });
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(null);
    }
  };

  const rootDomain = import.meta.env.VITE_ROOT_DOMAIN || 'localhost:5173';

  const renderStepContent = () => {
    switch (activeTab) {
      case 'info':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Business Name</label>
                <Input 
                  value={business.name} 
                  onChange={e => updateBusiness({ name: e.target.value })}
                  placeholder="e.g. Studio Bloom"
                  className="h-11 rounded-lg border-border-polaris shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Public Email</label>
                <Input 
                  value={business.email || ''} 
                  onChange={e => updateBusiness({ email: e.target.value })}
                  placeholder="contact@business.com"
                  className="h-11 rounded-lg border-border-polaris shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Physical Address</label>
                <Input 
                  value={business.address || ''} 
                  onChange={e => updateBusiness({ address: e.target.value })}
                  placeholder="123 Creative Way, London"
                  className="h-11 rounded-lg border-border-polaris shadow-sm"
                />
              </div>
            </div>
          </div>
        );
      case 'branding':
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Business Logo</label>
                <div className="flex items-center gap-6 p-4 rounded-xl border border-dashed border-border-polaris bg-bg-canvas/20">
                  <div className="w-20 h-20 rounded-lg bg-white border border-border-polaris flex items-center justify-center relative overflow-hidden group p-2">
                    {business.logo ? <img src={business.logo} className="w-full h-full object-contain" alt="Logo" /> : <Upload size={20} className="text-text-tertiary" />}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                      <Camera className="text-white" size={20} />
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0], 'logo')} />
                    </div>
                    {uploading === 'logo' && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><div className="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin" /></div>}
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold">Upload your identity</p>
                    <p className="text-[10px] text-text-tertiary uppercase tracking-widest leading-relaxed">PNG or SVG recommended.<br />Max 2MB.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Brand Accent</label>
                <div className="flex items-center gap-4 p-4 rounded-xl border border-border-polaris bg-bg-canvas/20">
                  <input 
                    type="color" 
                    value={business.primaryColor} 
                    onChange={e => updateBusiness({ primaryColor: e.target.value })}
                    className="w-12 h-12 rounded-lg border-none cursor-pointer p-0 overflow-hidden bg-transparent"
                  />
                  <div>
                    <p className="text-xs font-bold font-mono uppercase">{business.primaryColor}</p>
                    <p className="text-[10px] text-text-tertiary uppercase tracking-widest">Used for buttons and links</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'hero':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Main Headline</label>
                <Input 
                  value={business.heroTitle} 
                  onChange={e => updateBusiness({ heroTitle: e.target.value })}
                  placeholder="Headline that grabs attention"
                  className="h-11 rounded-lg border-border-polaris shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Sub-headline</label>
                <textarea 
                  value={business.heroSubtitle} 
                  onChange={e => updateBusiness({ heroSubtitle: e.target.value })}
                  placeholder="Describe what makes you special"
                  className="w-full p-3 rounded-lg border border-border-polaris bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand/5 focus:border-brand min-h-[80px]"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Hero Background</label>
                <div className="aspect-video rounded-xl bg-bg-canvas/30 border border-border-polaris flex items-center justify-center relative overflow-hidden group">
                  {business.coverImage ? <img src={business.coverImage} className="w-full h-full object-cover" alt="Cover" /> : <ImageIcon className="text-text-tertiary" size={24} />}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                    <Camera className="text-white" size={24} />
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0], 'cover')} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'socials':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
             <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-pink-50 text-pink-600 shrink-0"><Instagram size={18} /></div>
                  <Input 
                    value={business.socials?.instagram || ''} 
                    onChange={e => updateBusiness({ socials: { ...business.socials, instagram: e.target.value } })}
                    placeholder="Instagram profile URL"
                    className="h-10 rounded-lg border-border-polaris shadow-sm text-xs"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600 shrink-0"><Facebook size={18} /></div>
                  <Input 
                    value={business.socials?.facebook || ''} 
                    onChange={e => updateBusiness({ socials: { ...business.socials, facebook: e.target.value } })}
                    placeholder="Facebook page URL"
                    className="h-10 rounded-lg border-border-polaris shadow-sm text-xs"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-slate-900 text-white shrink-0 font-bold italic p-0 w-9 h-9 flex items-center justify-center">X</div>
                  <Input 
                    value={business.socials?.twitter || ''} 
                    onChange={e => updateBusiness({ socials: { ...business.socials, twitter: e.target.value } })}
                    placeholder="Twitter URL"
                    className="h-10 rounded-lg border-border-polaris shadow-sm text-xs"
                  />
                </div>
             </div>
          </div>
        );
      case 'publish':
        return (
          <div className="space-y-8 animate-in fade-in duration-300 text-center py-10">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto shadow-xl shadow-emerald-500/10">
              <Sparkles size={40} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">Your site is ready for the world</h2>
              <p className="text-sm text-text-tertiary">Congratulations! Review your details and hit publish to start accepting bookings.</p>
            </div>
            <div className="p-5 rounded-2xl border border-border-polaris bg-bg-canvas/20 max-w-sm mx-auto space-y-4">
               <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-text-tertiary uppercase tracking-widest">Public Domain</span>
                  <span className="font-bold text-brand">{rootDomain}</span>
               </div>
               <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-border-polaris shadow-sm cursor-pointer hover:bg-bg-canvas/40 transition-colors" onClick={() => {
                 const previewId = business.subdomain || business.slug;
                 if (previewId) {
                   window.open(`/preview`, '_blank');
                 }
               }}>
                  <Link2 size={14} className="text-text-tertiary shrink-0" />
                  <span className="text-[11px] font-medium text-text-primary truncate">
                    {(business.subdomain || business.slug)}.{rootDomain}
                  </span>
               </div>
               <p className="text-[9px] text-text-tertiary uppercase tracking-widest">Click link above to view in new tab</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative animate-in fade-in duration-300">
      {/* Simple Professional Header */}
      <header className="min-h-[56px] py-3 md:py-0 shrink-0 border-b border-border-default flex flex-col md:flex-row md:items-center justify-between px-4 md:px-6 bg-white z-10 gap-3 md:gap-0">
        <div className="flex items-center justify-between w-full md:w-auto md:gap-6">
          <h1 className="text-sm font-semibold tracking-tight text-text-primary">Website Editor</h1>
          <div className="flex items-center gap-2">
            {isSaving ? (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-xs font-medium text-text-tertiary">Saving changes...</span>
              </>
            ) : (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-medium text-text-tertiary">All changes saved</span>
              </>
            )}
          </div>
        </div>
        <button 
          onClick={() => {
            const previewId = business.subdomain || business.slug;
            if (previewId) {
              window.open(`/preview`, '_blank');
            } else {
              alert('Save your site details first');
            }
          }}
          className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-md border border-border-default bg-white text-text-primary text-xs font-medium hover:bg-slate-50 transition-colors shadow-sm w-full md:w-auto"
        >
          <ExternalLink size={14} />
          View Live Site
        </button>
      </header>

      {/* Main Builder Content Area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-border-default bg-white flex flex-row md:flex-col overflow-x-auto md:overflow-y-auto no-scrollbar">
          <div className="flex flex-row md:flex-col p-2 md:p-4 gap-1 min-w-max md:min-w-0 w-full items-start">
            {STEPS.map(step => (
              <button
                key={step.id}
                onClick={() => setActiveTab(step.id)}
                className={`text-left px-4 md:px-3 py-2.5 rounded-md text-sm transition-colors flex flex-col gap-0.5 whitespace-nowrap md:whitespace-normal md:w-full ${activeTab === step.id ? 'bg-slate-100 font-medium text-text-primary' : 'text-text-secondary hover:bg-slate-50 hover:text-text-primary'}`}
              >
                <span>{step.title}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Central Form Area */}
        <section className="flex-1 bg-white p-4 sm:p-8 lg:p-12 overflow-y-auto custom-scrollbar flex justify-center pb-24 md:pb-12">
          <div className="w-full max-w-3xl">
            <div className="mb-6 md:mb-8 border-b border-border-default pb-4 md:pb-6">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-text-primary">{STEPS.find(s => s.id === activeTab)?.title}</h2>
              <p className="text-sm md:text-base text-text-secondary mt-1 md:mt-2">{STEPS.find(s => s.id === activeTab)?.description}</p>
            </div>
            <div className="max-w-xl">
              {renderStepContent()}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
