import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { 
  Building2, 
  Palette, 
  CreditCard, 
  ShieldCheck, 
  Globe,
  Upload,
  Camera,
  CheckCircle2,
  XCircle,
  ExternalLink
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { business, updateBusiness, isPublished, setPublished } = useAppStore();
  const [formData, setFormData] = useState({ ...business });

  const handleUpdate = (updates: Partial<typeof business>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    updateBusiness(updates);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 lg:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-12 lg:pb-0">
      {/* Header */}
      <div className="space-y-1.5 px-1">
         <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-text-primary">Settings</h1>
         <p className="text-[10px] lg:text-xs text-text-tertiary uppercase tracking-widest font-bold">Business & Platform Config</p>
      </div>

      <div className="space-y-6 lg:space-y-10">
        {/* Business Info */}
        <div className="space-y-4">
           <div className="flex items-center gap-3 px-1">
              <Building2 size={16} className="text-text-tertiary" />
              <h2 className="text-sm lg:text-base font-bold text-text-primary uppercase tracking-widest">Business profile</h2>
           </div>
           <Card className="p-6 lg:p-8 space-y-6 rounded-[28px] lg:rounded-[32px] border-border-light/60 shadow-sm bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-8">
                 <div className="space-y-2">
                    <label className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest ml-1">Name</label>
                    <Input 
                       value={formData.name} 
                       onChange={e => handleUpdate({ name: e.target.value })}
                       className="h-11 rounded-xl bg-bg-secondary/30 border-border-light/50 focus:bg-white transition-all text-xs"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest ml-1">Email</label>
                    <Input 
                       type="email"
                       value={formData.email} 
                       onChange={e => handleUpdate({ email: e.target.value })}
                       className="h-11 rounded-xl bg-bg-secondary/30 border-border-light/50 focus:bg-white transition-all text-xs"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest ml-1">Phone</label>
                    <Input 
                       type="tel"
                       value={formData.phone} 
                       onChange={e => handleUpdate({ phone: e.target.value })}
                       className="h-11 rounded-xl bg-bg-secondary/30 border-border-light/50 focus:bg-white transition-all text-xs"
                    />
                 </div>
              </div>
           </Card>
        </div>

        {/* Branding */}
        <div className="space-y-4">
           <div className="flex items-center gap-3 px-1">
              <Palette size={16} className="text-text-tertiary" />
              <h2 className="text-sm lg:text-base font-bold text-text-primary uppercase tracking-widest">Visual identity</h2>
           </div>
           <Card className="p-6 lg:p-8 space-y-8 rounded-[28px] lg:rounded-[32px] border-border-light/60 shadow-sm bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-6">
                    <div className="space-y-3">
                       <label className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest ml-1">Primary Color</label>
                       <div className="flex items-center gap-4">
                          <input 
                             type="color" 
                             value={formData.primaryColor} 
                             onChange={e => handleUpdate({ primaryColor: e.target.value })}
                             className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl border-none cursor-pointer p-0 overflow-hidden shadow-sm hover:scale-105 transition-transform"
                          />
                          <div className="space-y-0.5">
                             <span className="text-xs font-black block tracking-tight">{formData.primaryColor.toUpperCase()}</span>
                             <span className="text-[8px] font-bold text-text-tertiary uppercase tracking-widest">Brand Accent</span>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-3">
                       <label className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest ml-1">Business Logo</label>
                       <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl bg-bg-secondary/50 flex items-center justify-center border border-dashed border-border-light relative group overflow-hidden">
                             {formData.logo ? (
                               <img src={formData.logo} className="w-full h-full object-cover p-2" alt="Logo" />
                             ) : (
                               <Upload size={14} className="text-text-tertiary" />
                             )}
                          </div>
                          <Button variant="secondary" size="sm" className="rounded-xl font-bold h-9 px-4 text-[10px] uppercase tracking-widest border-border-light">Update</Button>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest ml-1">Hero Image</label>
                    <div className="relative w-full aspect-video rounded-2xl bg-bg-secondary/50 border border-dashed border-border-light overflow-hidden group">
                       {formData.coverImage ? (
                         <img src={formData.coverImage} className="w-full h-full object-cover" alt="Cover" />
                       ) : (
                         <div className="absolute inset-0 flex flex-col items-center justify-center text-text-tertiary space-y-1">
                            <Camera size={18} />
                            <span className="text-[7px] font-bold uppercase tracking-widest">Upload Hero</span>
                         </div>
                       )}
                       <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="sm" className="bg-white text-text-primary px-4 h-9 rounded-xl font-bold text-[10px] shadow-md uppercase tracking-widest">Change</Button>
                       </div>
                    </div>
                 </div>
              </div>
           </Card>
        </div>

        {/* Payment */}
        <div className="space-y-4">
           <div className="flex items-center gap-3 px-1">
              <CreditCard size={16} className="text-text-tertiary" />
              <h2 className="text-sm lg:text-base font-bold text-text-primary uppercase tracking-widest">Transaction hub</h2>
           </div>
           <Card className="p-0 border border-border-light/60 shadow-sm bg-white overflow-hidden rounded-[28px] lg:rounded-[32px]">
              <div className="p-6 lg:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                 <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${formData.stripeConnected ? 'bg-[#635BFF]' : 'bg-bg-secondary text-text-tertiary'}`}>
                       <CreditCard size={20} />
                    </div>
                    <div className="space-y-0.5">
                       <h3 className="text-base lg:text-lg font-black tracking-tight text-text-primary">Stripe</h3>
                       <p className="text-[10px] font-medium text-text-tertiary max-w-[200px] leading-tight opacity-70">Accept secure payments via credit card.</p>
                       <div className="flex items-center gap-2 pt-0.5">
                          {formData.stripeConnected ? (
                            <span className="text-[7px] font-bold text-success uppercase tracking-[0.2em] flex items-center gap-1 px-2 py-0.5 bg-success/10 rounded-full border border-success/10">
                               <CheckCircle2 size={8} /> Connected
                            </span>
                          ) : (
                            <span className="text-[7px] font-bold text-text-tertiary uppercase tracking-[0.2em] flex items-center gap-1 px-2 py-0.5 bg-bg-secondary rounded-full">
                               <XCircle size={8} /> Ready to link
                            </span>
                          )}
                       </div>
                    </div>
                 </div>
                 <Button 
                   size="sm"
                   className={`h-11 px-8 rounded-xl font-bold transition-all text-xs uppercase tracking-widest w-full sm:w-auto ${formData.stripeConnected ? 'bg-bg-secondary text-text-primary hover:bg-bg-tertiary shadow-sm' : 'bg-[#635BFF] text-white hover:bg-[#5851e0] shadow-xl shadow-[#635bff15]'}`}
                   onClick={() => handleUpdate({ stripeConnected: !formData.stripeConnected })}
                 >
                    {formData.stripeConnected ? 'Configure' : 'Start Connecting'}
                 </Button>
              </div>
              {!formData.stripeConnected && (
                <div className="px-6 lg:px-8 py-3 bg-brand/5 flex items-center justify-between border-t border-border-light/40">
                   <p className="text-[7px] font-bold text-brand uppercase tracking-[0.3em] flex items-center gap-1.5" style={{ color: business.primaryColor }}>
                      <ShieldCheck size={10} /> PCI-Compliant Data Security
                   </p>
                </div>
              )}
           </Card>
        </div>

        {/* Site Settings */}
        <div className="space-y-4">
           <div className="flex items-center gap-3 px-1">
              <Globe size={16} className="text-text-tertiary" />
              <h2 className="text-sm lg:text-base font-bold text-text-primary uppercase tracking-widest">Storefront controls</h2>
           </div>
           <Card className="p-6 lg:p-8 space-y-8 rounded-[28px] lg:rounded-[32px] border-border-light/60 shadow-sm bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-3">
                    <label className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest ml-1">Subdomain</label>
                    <div className="relative">
                       <Input 
                          value={formData.subdomain}
                          onChange={e => handleUpdate({ subdomain: e.target.value })}
                          className="h-11 pl-5 pr-24 rounded-xl bg-bg-secondary/30 border-border-light/50 font-bold text-xs"
                       />
                       <div className="absolute right-3 top-1/2 -translate-y-1/2 border-l border-border-light/50 pl-3 py-1.5 grayscale opacity-50">
                          <span className="text-[9px] font-bold text-text-tertiary">.bookflow.ca</span>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest ml-1">Publication status</label>
                    <div className="p-4 rounded-xl bg-bg-secondary/30 border border-border-light/50 flex items-center justify-between group">
                       <div className="space-y-0.5">
                          <h4 className="text-xs font-bold text-text-primary tracking-tight">
                             {isPublished ? 'Site is Live' : 'Under Maintenance'}
                          </h4>
                          <p className="text-[8px] font-bold text-text-tertiary uppercase tracking-widest">Public discovery</p>
                       </div>
                       <button 
                         onClick={() => setPublished(!isPublished)}
                         className={`w-11 h-6.5 rounded-full transition-all duration-300 relative flex items-center px-1 cursor-pointer ${isPublished ? 'bg-success shadow-lg shadow-success/20' : 'bg-bg-tertiary'}`}
                         style={{ backgroundColor: isPublished ? business.primaryColor : undefined }}
                       >
                          <div className={`w-4.5 h-4.5 rounded-full bg-white shadow-sm transition-all duration-300 ${isPublished ? 'translate-x-4.5' : 'translate-x-0'}`} />
                       </button>
                    </div>
                 </div>
              </div>
           </Card>
        </div>
      </div>

      {/* Footer Area */}
      <footer className="pt-6 lg:pt-10 flex items-center justify-between px-2">
         <div className="space-y-0.5">
            <p className="text-[9px] font-bold text-text-primary flex items-center gap-1.5 uppercase tracking-widest">
               <CheckCircle2 size={12} className="text-success" /> Live Sync Active
            </p>
         </div>
         <Button 
            size="sm"
            className="h-11 px-6 lg:px-8 rounded-xl font-bold text-[10px] lg:text-xs shadow-xl shadow-brand/10 transition-all uppercase tracking-widest"
            style={{ backgroundColor: business.primaryColor }}
            onClick={() => window.open(`/p/${formData.subdomain}`, '_blank')}
         >
            <ExternalLink size={12} className="mr-2" /> View Site
         </Button>
      </footer>
    </div>
  );
};
