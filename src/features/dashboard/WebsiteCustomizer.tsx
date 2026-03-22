import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { 
  Plus,
  Eye,
  Smartphone,
  Monitor,
  Sparkles,
  Link2,
  ChevronRight,
  Image as ImageIcon,
  Upload,
  Camera,
  Check,
  Trash2,
  Instagram,
  Facebook
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { PublicWebsite } from '../public/PublicWebsite';

const STEPS = [
  { id: 'info', title: 'Business Info', description: 'Basic contact details' },
  { id: 'branding', title: 'Branding', description: 'Logo and colors' },
  { id: 'hero', title: 'Hero Section', description: 'Your main headline' },
  { id: 'services', title: 'Services', description: 'Check your offerings' },
  { id: 'portfolio', title: 'Portfolio', description: 'Showcase your work' },
  { id: 'testimonials', title: 'Testimonials', description: 'Customer reviews' },
  { id: 'socials', title: 'Socials', description: 'Connect accounts' },
  { id: 'publish', title: 'Publish', description: 'Go live with your site' }
];

export const WebsiteCustomizer: React.FC = () => {
  const { 
    business, 
    updateBusiness, 
    addReview, 
    addProofItem, 
    deleteReview, 
    deleteProofItem, 
    updateReview, 
    updateProofItem,
    addService,
    updateService,
    deleteService
  } = useAppStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [uploading, setUploading] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

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

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const rootDomain = import.meta.env.VITE_ROOT_DOMAIN || 'localhost:5173';

  const renderStepContent = () => {
    const stepId = STEPS[currentStep].id;

    switch (stepId) {
      case 'info':
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
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
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
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
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
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
      case 'portfolio':
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
            <div className="flex items-center justify-between">
               <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Gallery Entries</span>
               <Button variant="secondary" size="sm" onClick={() => addProofItem({ image_url: '', caption: 'New Entry' })} className="h-8 px-4 rounded-lg font-bold text-[9px] uppercase tracking-widest">
                  <Plus size={14} className="mr-1.5" />
                  Add New
               </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {(business.proofOfWork || []).map((item: any) => (
                <div key={item.id} className="p-4 rounded-xl border border-border-polaris bg-white flex items-center gap-4 relative group">
                  <div className="w-16 h-16 rounded-lg bg-bg-canvas/50 flex items-center justify-center shrink-0 relative overflow-hidden">
                    {item.image_url ? <img src={item.image_url} className="w-full h-full object-cover" alt="Proof" /> : <ImageIcon size={16} className="text-text-tertiary" />}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                      <Camera className="text-white" size={12} />
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0], 'proof', item.id)} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <Input 
                      value={item.caption || ''} 
                      onChange={e => updateProofItem(item.id, { caption: e.target.value })}
                      className="h-8 border-none p-0 focus:ring-0 text-xs font-medium placeholder:text-text-tertiary"
                      placeholder="Enter a caption..."
                    />
                  </div>
                  <button onClick={() => deleteProofItem(item.id)} className="p-2 text-text-tertiary hover:text-error transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      case 'services':
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
            <div className="flex items-center justify-between">
               <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Your Offerings</span>
               <Button variant="secondary" size="sm" onClick={() => addService({ name: 'New Service', price: 0, duration: 30, description: '', active: true, bookingFeeEnabled: false, bookingFeeAmount: 0 })} className="h-8 px-4 rounded-lg font-bold text-[9px] uppercase tracking-widest">
                  <Plus size={14} className="mr-1.5" />
                  Add Service
               </Button>
            </div>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {(business.services || []).map((service: any) => (
                <div key={service.id} className="p-4 rounded-xl border border-border-polaris bg-white space-y-3 relative group">
                  <div className="flex items-center justify-between gap-4">
                    <Input 
                      value={service.name} 
                      onChange={e => updateService(service.id, { ...service, name: e.target.value })}
                      className="h-8 w-2/3 text-xs font-bold border-none p-0 focus:ring-0"
                    />
                     <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-text-tertiary">$</span>
                        <Input 
                          value={service.price} 
                          type="number"
                          onChange={e => updateService(service.id, { ...service, price: Number(e.target.value) })}
                          className="h-8 w-16 text-xs font-bold border-none p-0 focus:ring-0"
                        />
                     </div>
                    <button onClick={() => deleteService(service.id)} className="text-text-tertiary hover:text-error transition-colors p-1 shrink-0">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <textarea 
                    value={service.description} 
                    onChange={e => updateService(service.id, { ...service, description: e.target.value })}
                    className="w-full text-xs text-text-secondary bg-transparent border-none p-0 focus:ring-0 min-h-10 resize-none leading-relaxed"
                    placeholder="Describe this service..."
                  />
                  <div className="flex items-center gap-4 pt-2 border-t border-border-polaris/30">
                     <div className="flex items-center gap-1.5">
                        <Camera size={10} className="text-text-tertiary" />
                        <span className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest">{service.duration} mins</span>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'testimonials':
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
            <div className="flex items-center justify-between">
               <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Client Reviews</span>
               <Button variant="secondary" size="sm" onClick={() => addReview({ customer_name: 'Name', comment: 'Review text...', rating: 5 })} className="h-8 px-4 rounded-lg font-bold text-[9px] uppercase tracking-widest">
                  <Plus size={14} className="mr-1.5" />
                  Add Review
               </Button>
            </div>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {business.reviews?.map((review: any) => (
                <div key={review.id} className="p-4 rounded-xl border border-border-polaris bg-white space-y-3 relative group">
                  <div className="flex items-center justify-between gap-4">
                    <Input 
                      value={review.customer_name} 
                      onChange={e => updateReview(review.id, { customer_name: e.target.value })}
                      className="h-8 w-1/3 text-xs font-bold border-none p-0 focus:ring-0"
                    />
                    <button onClick={() => deleteReview(review.id)} className="text-text-tertiary hover:text-error transition-colors p-1">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <textarea 
                    value={review.comment} 
                    onChange={e => updateReview(review.id, { comment: e.target.value })}
                    className="w-full text-xs text-text-secondary bg-transparent border-none p-0 focus:ring-0 min-h-[40px] resize-none leading-relaxed"
                  />
                </div>
              ))}
            </div>
          </div>
        );
      case 'socials':
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
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
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700 text-center py-10">
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
               <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-border-polaris shadow-sm cursor-pointer hover:bg-bg-canvas/40 transition-colors" onClick={() => window.open(`/p/${business.subdomain}`, '_blank')}>
                  <Link2 size={14} className="text-text-tertiary shrink-0" />
                  <span className="text-[11px] font-medium text-text-primary truncate">{business.subdomain}.{rootDomain}</span>
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
    <div className="flex flex-col h-full bg-white animate-in fade-in duration-500">
      {/* Redesigned Header */}
      <header className="h-16 shrink-0 border-b border-border-polaris flex items-center justify-between px-6 lg:px-10 bg-white">
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-text-primary uppercase tracking-widest text-[14px]">Website Setup</h1>
            <div className="flex items-center gap-2 mt-0.5">
               {isSaving ? (
                 <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                   <span className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest">Saving changes...</span>
                 </div>
               ) : (
                 <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500" />
                   <span className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest">Auto-saved</span>
                 </div>
               )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowMobilePreview(!showMobilePreview)}
            className="lg:hidden p-2.5 rounded-xl bg-bg-canvas/50 text-text-secondary hover:text-text-primary transition-all"
          >
            <Eye size={20} />
          </button>
          
          <Button 
            onClick={() => {
              if (business.isPublished && !confirm('Are you sure you want to unpublish your site? It will no longer be visible to customers.')) return;
              updateBusiness({ isPublished: !business.isPublished });
            }}
            variant={business.isPublished ? "secondary" : "primary"}
            className="h-10 px-8 rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-brand/10 transition-all active:scale-95"
          >
            {business.isPublished ? "Unpublish Site" : "Publish Site"}
          </Button>
        </div>
      </header>

      {/* Progress Bar Container */}
      <div className="bg-bg-sidebar/30 border-b border-border-polaris/40 py-4 px-6 lg:px-10 shrink-0">
        <div className="max-w-[1200px] mx-auto w-full">
           <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-text-primary uppercase tracking-widest">
                Step {currentStep + 1} of {STEPS.length}
              </p>
              <div className="flex items-center gap-3 h-1.5 w-64 bg-bg-canvas rounded-full overflow-hidden">
                 <motion.div 
                    className="h-full bg-brand"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                 />
              </div>
           </div>
           
           <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-hide">
              {STEPS.map((step, idx) => (
                <button 
                  key={step.id} 
                  onClick={() => setCurrentStep(idx)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg flex-1 min-w-fit transition-all border ${idx === currentStep ? 'bg-white border-brand/20 shadow-sm' : 'border-transparent text-text-tertiary hover:text-text-secondary hover:bg-white/40'}`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${idx < currentStep ? 'bg-emerald-500 text-white' : idx === currentStep ? 'bg-brand text-white' : 'bg-bg-canvas text-text-tertiary'}`}>
                    {idx < currentStep ? <Check size={10} /> : idx + 1}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">{step.title}</span>
                </button>
              ))}
           </div>
        </div>
      </div>

      {/* Main Builder Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Editor Form */}
        <section className="flex-1 lg:max-w-[500px] lg:border-r border-border-polaris overflow-y-auto custom-scrollbar p-6 lg:p-10 bg-[#fbfbfb]">
          <div className="max-w-md mx-auto space-y-8 min-h-full flex flex-col pt-4">
            {/* Top Navigation Buttons (Underlined style) */}
            <div className="flex items-center justify-between border-b border-border-polaris pb-6 mb-2">
              <button 
                onClick={prevStep}
                disabled={currentStep === 0}
                className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary hover:text-text-primary disabled:opacity-0 transition-all underline underline-offset-4 decoration-2 decoration-transparent hover:decoration-text-tertiary"
              >
                Back
              </button>
              
              <button 
                onClick={nextStep}
                disabled={currentStep === STEPS.length - 1}
                className="text-[10px] font-bold uppercase tracking-widest text-brand hover:opacity-80 transition-all underline underline-offset-4 decoration-2 decoration-brand/30 hover:decoration-brand disabled:opacity-0"
              >
                Continue
              </button>
            </div>

            <div className="space-y-1.5">
               <h2 className="text-2xl font-semibold tracking-tight text-text-primary">{STEPS[currentStep].title}</h2>
               <p className="text-sm text-text-tertiary font-normal">{STEPS[currentStep].description}</p>
            </div>

            <div className="flex-1 py-4">
              {renderStepContent()}
            </div>

            {/* Bottom Primary Button (Keep for Save & Continue prominence) */}
            <div className="pt-10 flex items-center justify-end mt-auto">
              <Button 
                onClick={nextStep}
                disabled={currentStep === STEPS.length - 1}
                className="h-12 px-10 rounded-xl bg-brand font-bold text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-brand/10 hover:shadow-brand/20 transition-all disabled:hidden"
              >
                Save & Continue
                <ChevronRight size={14} className="ml-2" />
              </Button>
            </div>
          </div>
        </section>

        {/* Right Side: Live Preview (Desktop Only) */}
        <section className="hidden lg:flex flex-1 bg-bg-canvas/30 items-center justify-center p-12 overflow-hidden relative">
           {/* Preview Toggle Contols */}
           <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1 bg-white rounded-xl border border-border-polaris shadow-lg z-10">
              <button 
                onClick={() => setPreviewDevice('desktop')}
                className={`p-2 rounded-lg transition-all ${previewDevice === 'desktop' ? 'bg-brand text-white shadow-md' : 'text-text-tertiary hover:bg-bg-canvas'}`}
              >
                <Monitor size={16} />
              </button>
              <button 
                onClick={() => setPreviewDevice('mobile')}
                className={`p-2 rounded-lg transition-all ${previewDevice === 'mobile' ? 'bg-brand text-white shadow-md' : 'text-text-tertiary hover:bg-bg-canvas'}`}
              >
                <Smartphone size={16} />
              </button>
           </div>

           <div className="absolute top-8 right-10 flex items-center gap-2 text-text-tertiary font-bold uppercase tracking-widest text-[9px] animate-pulse">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Live Preview
           </div>

           {/* Preview Frame */}
           <div className={`transition-all duration-700 h-full w-full flex items-center justify-center`}>
              <div className={`relative transition-all duration-700 bg-white shadow-2xl overflow-hidden border border-border-polaris ${previewDevice === 'mobile' ? 'w-[375px] h-[760px] rounded-[48px] border-[12px] border-slate-900' : 'w-full h-full rounded-2xl'}`}>
                {previewDevice === 'mobile' && (
                  <>
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-20" />
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-slate-200/20 rounded-full z-20" />
                  </>
                )}
                <div className={`w-full h-full overflow-y-auto custom-scrollbar bg-white ${previewDevice === 'mobile' ? 'p-0' : 'p-0'}`}>
                   <PublicWebsite isPreview forcedView={previewDevice === 'mobile' ? 'mobile' : 'desktop'} />
                </div>
              </div>
           </div>
        </section>
      </div>

      {/* Mobile Preview Modal Overlay */}
      <AnimatePresence>
        {showMobilePreview && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed inset-0 z-[100] lg:hidden bg-white"
          >
             <header className="h-16 flex items-center justify-between px-6 border-b border-border-polaris shrink-0">
                <span className="text-xs font-bold uppercase tracking-widest text-text-tertiary">Site Preview</span>
                <button onClick={() => setShowMobilePreview(false)} className="px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest bg-bg-canvas">Close</button>
             </header>
             <div className="flex-1 h-[calc(100vh-64px)] overflow-y-auto">
               <PublicWebsite isPreview forcedView="mobile" />
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
