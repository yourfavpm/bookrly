import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  Upload, 
  Check, 
  Plus, 
  Trash2,
  ShieldCheck,
  Star,
  Image as ImageIcon,
  CreditCard,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { AddOn } from '../../store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { getBusinessUrl } from '../../lib/domainUtils';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { formatPrice } from '../../utils/formatters';

const StepWrapper: React.FC<{ 
  children: React.ReactNode, 
  title: string, 
  subtitle?: string,
  onNext?: () => void,
  onBack?: () => void,
  nextDisabled?: boolean,
  showNext?: boolean,
  showBack?: boolean,
  nextLabel?: string
}> = ({ 
  children, 
  title, 
  subtitle, 
  onNext, 
  onBack, 
  nextDisabled = false, 
  showNext = true, 
  showBack = true,
  nextLabel = "Next"
}) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    className="w-full max-w-[420px] mx-auto pt-20 pb-12 px-6 flex flex-col min-h-[500px]"
  >
    <div className="flex-1 flex flex-col justify-center space-y-10">
      <div className="space-y-1 text-center">
        <h1 className="text-xl font-medium tracking-tight text-text-primary px-4">{title}</h1>
        {subtitle && <p className="text-[11px] text-text-tertiary font-normal max-w-[280px] mx-auto leading-relaxed">{subtitle}</p>}
      </div>
      
      <div className="flex-1 flex flex-col justify-center">
        {children}
      </div>
    </div>

    <div className="pt-10 flex flex-col gap-3">
      {showNext && (
        <Button 
          onClick={onNext} 
          disabled={nextDisabled} 
          className="w-full h-12 rounded-2xl bg-brand text-white font-medium text-[11px] uppercase tracking-widest shadow-lg shadow-brand/10 transition-all active:scale-[0.98] disabled:opacity-30"
        >
          {nextLabel}
        </Button>
      )}
      {showBack && (
        <button 
          onClick={onBack} 
          className="w-full py-2 text-[10px] font-normal text-text-tertiary uppercase tracking-widest hover:text-text-primary transition-colors flex items-center justify-center gap-1.5"
        >
          <ChevronLeft size={12} /> Back
        </button>
      )}
    </div>
  </motion.div>
);

export const OnboardingFlow: React.FC = () => {
  const { onboardingStep, setOnboardingStep, business, updateBusiness, user, fetchBusiness, addService, currency } = useAppStore();
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const [initAttempted, setInitAttempted] = useState(false);

  // Local state for complex steps
  const [tempService, setTempService] = useState({ name: '', price: 0, duration: 60 });
  const [tempAddOns, setTempAddOns] = useState<Partial<AddOn>[]>([]);
  const [feeEnabled, setFeeEnabled] = useState(false);
  const [feeAmount, setFeeAmount] = useState(0);

  useEffect(() => {
    if (!user || business || initializing || initAttempted) return;

    const init = async () => {
      setInitializing(true);
      setInitAttempted(true);
      try {
        const { data: existing, error: fetchError } = await supabase
          .from('businesses')
          .select('id')
          .eq('owner_id', user.id)
          .maybeSingle();

        if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;
        if (existing) {
          await fetchBusiness();
          return;
        }

        const { data, error } = await supabase
          .from('businesses')
          .insert([{ 
            owner_id: user.id, 
            name: '',
            subdomain: `biz-${user.id.slice(0, 8)}`,
            primary_color: '#111111',
            trust_section: 'none',
            template_key: 'clean_classic',
            is_published: true
          }])
          .select()
          .single();
        
        if (error) throw error;
        if (data) {
          const days = [0, 1, 2, 3, 4, 5, 6];
          const availability = days.map(d => ({
            business_id: data.id,
            day_of_week: d,
            start_time: '09:00',
            end_time: '17:00',
            is_open: d !== 0 && d !== 6
          }));
          await supabase.from('availability').insert(availability);
          await fetchBusiness();
        }
      } catch (err: unknown) {
        console.error('Onboarding init error:', err instanceof Error ? err.message : err);
      } finally {
        setInitializing(false);
      }
    };
    init();
  }, [user, business, fetchBusiness, initializing, initAttempted]);

  // Prevent users from looping back into onboarding if they're already finished
  useEffect(() => {
    if (business && onboardingStep > 13) {
       navigate('/dashboard', { replace: true });
    }
  }, [business, onboardingStep, navigate]);

  const totalSteps = 13;

  const handleNext = async () => {
    if (onboardingStep === 7) {
       // Save the first service
        if (tempService.name) {
           const finalAddOns = tempAddOns.map((a, i) => ({
              id: `temp-${i}`,
              name: a.name || '',
              price: a.price || 0,
              duration: 0,
              active: true
           })) as AddOn[];
           
           await addService({ 
              ...tempService, 
              id: 'temp',
              description: '',
              active: true, 
              bookingFeeEnabled: feeEnabled, 
              bookingFeeAmount: feeAmount, 
              addOns: finalAddOns 
           });
        }
    }
    
    if (onboardingStep < totalSteps) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      // Force publish the business IMMEDIATELY once onboarding is finished
      await updateBusiness({ isPublished: true }, true);
      setIsSuccess(true);
    }
  };

  const handleBack = () => {
    if (onboardingStep > 1) {
      setOnboardingStep(onboardingStep - 1);
    }
  };

  const categories = ['Beauty', 'Fitness', 'Wellness', 'Education', 'Events', 'Professional', 'Other'];

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
        <p className="text-sm text-text-tertiary font-normal mb-6">Access restricted. Please sign in.</p>
        <Button className="h-12 px-8 rounded-2xl font-medium text-[11px] uppercase tracking-widest bg-brand text-white" onClick={() => navigate('/login')}>Sign In</Button>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
           <div className="w-1.5 h-1.5 rounded-full bg-brand animate-ping" />
           <p className="text-[10px] text-text-tertiary uppercase tracking-widest font-normal">Initializing your workspace</p>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 animate-in fade-in duration-700">
           <div className="w-full max-w-sm space-y-12 text-center">
              <div className="space-y-4">
                <div className="w-14 h-14 bg-success/5 rounded-3xl flex items-center justify-center text-success mx-auto">
                    <CheckCircle2 size={32} />
                </div>
                <h1 className="text-2xl font-medium tracking-tight text-text-primary">Your site is ready</h1>
                <p className="text-[11px] text-text-tertiary font-normal max-w-[280px] mx-auto leading-relaxed">Your professional booking site is live and ready for customers.</p>
              </div>

              <Card className="p-8 rounded-[38px] border-border-light/50 shadow-sm bg-bg-secondary/20 space-y-8">
                 <div className="space-y-2">
                    <p className="text-[10px] font-normal text-text-tertiary uppercase tracking-widest leading-none">Live URL</p>
                    <p className="text-sm font-medium text-brand truncate">{getBusinessUrl(business.subdomain).replace(/^https?:\/\//, '')}</p>
                 </div>
                 <div className="space-y-3">
                    <Button className="w-full h-12 rounded-2xl bg-brand text-white font-medium text-[11px] uppercase tracking-widest shadow-lg shadow-brand/10" onClick={() => window.open(getBusinessUrl(business.subdomain), '_blank')}>
                        <ExternalLink size={14} className="mr-2" /> View Site
                    </Button>
                    <Button variant="secondary" className="w-full h-12 rounded-2xl font-medium text-[11px] uppercase tracking-widest border-border-light/50" onClick={() => navigate('/dashboard')}>
                        Dashboard
                    </Button>
                 </div>
              </Card>
           </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="fixed top-0 left-0 w-full h-[3px] bg-bg-tertiary z-60">
        <motion.div 
          className="h-full bg-brand" 
          initial={false}
          animate={{ width: `${(onboardingStep / totalSteps) * 100}%` }}
          transition={{ duration: 0.5, ease: "circOut" }}
        />
      </div>

      <header className="fixed top-0 left-0 w-full h-20 flex items-center justify-between px-8 z-50">
         <div className="flex items-center">
            <img src="/images/logomain.png" alt="Skeduley Logo" className="h-[72px] w-auto" />
         </div>
         <button onClick={() => navigate('/dashboard')} className="text-[10px] font-normal text-text-tertiary uppercase tracking-widest hover:text-text-primary transition-colors">Exit</button>
      </header>

      <main className="flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {onboardingStep === 1 && (
            <StepWrapper 
              key="step1" 
              title="What’s your business called?" 
              onNext={handleNext}
              showBack={false}
              nextDisabled={!business.name}
            >
              <Input 
                placeholder="e.g. Lavender Spa" 
                value={business.name} 
                onChange={(e) => updateBusiness({ name: e.target.value })}
                className="h-14 border-none bg-bg-secondary/30 rounded-2xl text-center text-lg placeholder:text-text-tertiary focus:bg-white focus:shadow-sm transition-all"
                autoFocus
              />
            </StepWrapper>
          )}

          {onboardingStep === 2 && (
            <StepWrapper 
              key="step2" 
              title="What do you offer?" 
              onNext={handleNext}
              onBack={handleBack}
              nextDisabled={!business.category}
            >
              <div className="grid grid-cols-2 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { updateBusiness({ category: cat }); handleNext(); }}
                    className={`h-16 rounded-2xl border transition-all text-[11px] font-medium uppercase tracking-widest ${business.category === cat ? 'border-brand/40 bg-brand/5 text-brand' : 'border-border-light/50 bg-white text-text-tertiary hover:bg-bg-secondary/40'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </StepWrapper>
          )}

          {onboardingStep === 3 && (
            <StepWrapper 
              key="step3" 
              title="Add your logo" 
              onNext={handleNext}
              onBack={handleBack}
            >
              <div className="flex flex-col items-center gap-6">
                 <div className="w-24 h-24 rounded-[32px] border border-dashed border-border-light bg-bg-secondary/20 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer hover:bg-bg-secondary/40 transition-all">
                    {uploading ? (
                      <div className="w-4 h-4 rounded-full bg-brand animate-pulse" />
                    ) : (
                      business.logo ? (
                        <img src={business.logo} className="w-full h-full object-cover p-3" alt="Logo preview" />
                      ) : (
                        <Upload className="text-text-tertiary group-hover:text-brand transition-colors" size={20} />
                      )
                    )}
                    <input 
                       type="file" 
                       className="absolute inset-0 opacity-0 cursor-pointer"
                       onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                             if (file.size > 5 * 1024 * 1024) { alert('File too large. Maximum size is 5MB.'); return; }
                             if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) { alert('Invalid file type. Please upload a JPG, PNG, or WEBP.'); return; }
                             
                             setUploading(true);
                             const fileExt = file.name.split('.').pop();
                             const filePath = `${business.id}/logo-${Date.now()}.${fileExt}`;
                             const { error } = await supabase.storage.from('business-assets').upload(filePath, file);
                             if (!error) {
                                const { data: { publicUrl } } = supabase.storage.from('business-assets').getPublicUrl(filePath);
                                await updateBusiness({ logo: publicUrl });
                             }
                             setUploading(false);
                          }
                       }}
                    />
                 </div>
                 <p className="text-[10px] text-text-tertiary font-normal text-center opacity-60">PNG or JPG, square preferred.</p>
              </div>
            </StepWrapper>
          )}

          {onboardingStep === 4 && (
            <StepWrapper 
              key="step4" 
              title="Pick a color" 
              onNext={handleNext}
              onBack={handleBack}
            >
              <div className="space-y-8">
                 <div className="flex flex-wrap justify-center gap-3">
                    {['#111111', '#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#8B5CF6', '#3B82F6'].map((color) => (
                      <button
                        key={color}
                        onClick={() => updateBusiness({ primaryColor: color })}
                        className={`w-9 h-9 rounded-xl transition-all ${business.primaryColor === color ? 'ring-4 ring-brand/10 border-2 border-white scale-110 shadow-sm' : 'opacity-60 hover:opacity-100'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                 </div>
                 <div className="flex justify-center flex-col items-center gap-3">
                    <div className="relative w-full h-12 bg-bg-secondary/30 rounded-2xl flex items-center px-4 overflow-hidden border border-border-light/20">
                       <input 
                         type="color" 
                         value={business.primaryColor} 
                         onChange={(e) => updateBusiness({ primaryColor: e.target.value })}
                         className="absolute inset-0 opacity-0 cursor-pointer"
                       />
                       <div className="w-4 h-4 rounded-full mr-3 border border-border-light/50" style={{ backgroundColor: business.primaryColor }} />
                       <span className="text-[11px] font-medium uppercase tabular-nums text-text-primary">{business.primaryColor}</span>
                       <span className="ml-auto text-[9px] font-normal text-text-tertiary uppercase tracking-widest">Custom</span>
                    </div>
                 </div>
              </div>
            </StepWrapper>
          )}

          {onboardingStep === 5 && (
            <StepWrapper 
              key="step5" 
              title="Add a cover image" 
              onNext={handleNext}
              onBack={handleBack}
            >
              <div className="flex flex-col items-center gap-6">
                 <div className="w-full h-44 rounded-[32px] border border-dashed border-border-light bg-bg-secondary/10 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer hover:bg-bg-secondary/20 transition-all">
                    {uploading ? (
                      <div className="w-4 h-4 rounded-full bg-brand animate-pulse" />
                    ) : (
                      business.coverImage ? (
                        <img src={business.coverImage} className="w-full h-full object-cover" alt="Cover preview" />
                      ) : (
                        <ImageIcon className="text-text-tertiary group-hover:text-brand transition-colors" size={24} />
                      )
                    )}
                    <input 
                       type="file" 
                       className="absolute inset-0 opacity-0 cursor-pointer"
                       onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                             if (file.size > 10 * 1024 * 1024) { alert('Cover image too large. Maximum size is 10MB.'); return; }
                             if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) { alert('Invalid file type. Please upload a JPG, PNG, or WEBP.'); return; }

                             setUploading(true);
                             const fileExt = file.name.split('.').pop();
                             const filePath = `${business.id}/cover-${Date.now()}.${fileExt}`;
                             await supabase.storage.from('business-assets').upload(filePath, file);
                             const { data: { publicUrl } } = supabase.storage.from('business-assets').getPublicUrl(filePath);
                             await updateBusiness({ coverImage: publicUrl });
                             setUploading(false);
                          }
                       }}
                    />
                 </div>
                 <p className="text-[10px] text-text-tertiary font-normal text-center opacity-60 px-8">This background defines your brand's atmosphere.</p>
              </div>
            </StepWrapper>
          )}

          {onboardingStep === 6 && (
            <StepWrapper 
              key="step6" 
              title="Describe your service" 
              onNext={handleNext}
              onBack={handleBack}
              nextDisabled={!business.heroTitle}
            >
              <div className="space-y-4">
                 <Input 
                   label="Headline"
                   placeholder="e.g. Masterful Skin Care"
                   value={business.heroTitle}
                   onChange={(e) => updateBusiness({ heroTitle: e.target.value })}
                   className="rounded-2xl bg-bg-secondary/20 border-border-light/40"
                 />
                 <Input 
                   label="Subtext"
                   placeholder="e.g. Luxury treatments in a calm environment."
                   value={business.heroSubtitle}
                   onChange={(e) => updateBusiness({ heroSubtitle: e.target.value })}
                   className="rounded-2xl bg-bg-secondary/20 border-border-light/40"
                 />
                 <Input 
                   label="Primary Button Text"
                   placeholder="e.g. Book Appointment"
                   value={business.ctaText || 'Book Now'}
                   onChange={(e) => updateBusiness({ ctaText: e.target.value })}
                   className="rounded-2xl bg-bg-secondary/20 border-border-light/40"
                 />
              </div>
            </StepWrapper>
          )}

          {onboardingStep === 7 && (
            <StepWrapper 
              key="step7" 
              title="Add your first service" 
              onNext={handleNext}
              onBack={handleBack}
              nextDisabled={!tempService.name}
            >
              <div className="space-y-4">
                 <Input 
                    label="Name" 
                    placeholder="e.g. Classic Mani" 
                    value={tempService.name}
                    onChange={e => setTempService(p => ({ ...p, name: e.target.value }))}
                    className="rounded-2xl bg-bg-secondary/20 border-border-light/40" 
                 />
                 <div className="grid grid-cols-2 gap-4">
                    <Input 
                      label={`Price (${currency})`} 
                      placeholder="0" 
                      type="number" 
                      min="0"
                      value={tempService.price || ''}
                      onChange={e => setTempService(p => ({ ...p, price: Math.max(0, parseFloat(e.target.value) || 0) }))}
                      className="rounded-2xl bg-bg-secondary/20 border-border-light/40" 
                    />
                    <Input 
                      label="Duration (m)" 
                      placeholder="60" 
                      type="number" 
                      min="5"
                      step="5"
                      value={tempService.duration || ''}
                      onChange={e => setTempService(p => ({ ...p, duration: Math.max(5, parseInt(e.target.value) || 60) }))}
                      className="rounded-2xl bg-bg-secondary/20 border-border-light/40" 
                    />
                 </div>
              </div>
            </StepWrapper>
          )}

          {onboardingStep === 8 && (
            <StepWrapper 
              key="step8" 
              title="Require a booking fee?" 
              onNext={handleNext}
              onBack={handleBack}
            >
              <Card className="p-6 rounded-[32px] border-border-light/50 bg-bg-secondary/10 space-y-6">
                 <div className="flex items-center justify-between">
                    <div>
                       <p className="text-xs font-medium text-text-primary">Enable Fee</p>
                       <p className="text-[10px] text-text-tertiary font-normal">Collect deposit upfront</p>
                    </div>
                    <button 
                      onClick={() => setFeeEnabled(!feeEnabled)}
                      className={`w-11 h-6.5 rounded-full transition-all duration-300 relative flex items-center px-1 cursor-pointer ${feeEnabled ? 'bg-brand shadow-lg shadow-brand/10' : 'bg-bg-tertiary'}`}
                    >
                      <div className={`w-4.5 h-4.5 rounded-full bg-white shadow-sm transition-all duration-300 ${feeEnabled ? 'translate-x-4.5' : 'translate-x-0'}`} />
                    </button>
                 </div>
                 {feeEnabled && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                      <Input 
                        placeholder={`Deposit Amount (${currency})`} 
                        type="number"
                        value={feeAmount || ''}
                        onChange={e => setFeeAmount(parseFloat(e.target.value) || 0)}
                        className="rounded-2xl bg-white border-border-light/40 text-center"
                      />
                    </motion.div>
                 )}
              </Card>
            </StepWrapper>
          )}

          {onboardingStep === 9 && (
            <StepWrapper 
              key="step9" 
              title="Add extras (optional)" 
              onNext={handleNext} 
              onBack={handleBack}
              nextLabel={tempAddOns.length > 0 ? "Continue" : "Skip for now"}
            >
              <div className="space-y-3">
                 {tempAddOns.map((addon, i) => (
                   <div key={i} className="flex gap-2 p-4 rounded-2xl bg-bg-secondary/20 border border-border-light/40 items-center">
                      <div className="flex-1 min-w-0">
                         <p className="text-[11px] font-medium text-text-primary truncate">{addon.name}</p>
                         <p className="text-[9px] text-text-tertiary font-normal">{formatPrice(addon.price || 0, currency)}</p>
                      </div>
                      <button 
                        onClick={() => setTempAddOns(p => p.filter((_, idx) => idx !== i))}
                        className="p-2 text-text-tertiary hover:text-error transition-colors"
                      >
                         <Trash2 size={12} />
                      </button>
                   </div>
                 ))}
                 <button 
                    onClick={() => {
                        const name = prompt('Add-on Name?');
                        const price = parseFloat(prompt('Price?') || '0');
                        if (name) setTempAddOns(p => [...p, { name, price }]);
                    }}
                    className="w-full h-12 rounded-2xl border border-dashed border-border-light flex items-center justify-center gap-2 text-[10px] font-medium text-text-tertiary uppercase tracking-widest hover:border-brand/40 hover:text-brand transition-all"
                 >
                    <Plus size={14} /> Add option
                 </button>
              </div>
            </StepWrapper>
          )}

          {onboardingStep === 10 && (
            <StepWrapper 
              key="step10" 
              title="Show reviews or work?" 
              onNext={handleNext}
              onBack={handleBack}
            >
              <div className="space-y-3">
                 {[
                   { id: 'reviews', label: 'Reviews', icon: <Star size={16} className="text-amber-400" /> },
                   { id: 'proof', label: 'Photos', icon: <ImageIcon size={16} className="text-blue-400" /> },
                   { id: 'both', label: 'Both Sections', icon: <ShieldCheck size={16} className="text-success" /> }
                 ].map((opt) => (
                   <button
                    key={opt.id}
                    onClick={() => { updateBusiness({ trustSection: opt.id as 'reviews' | 'proof' | 'both' | 'none' }); handleNext(); }}
                    className={`w-full p-5 rounded-3xl border transition-all flex items-center gap-4 ${business.trustSection === opt.id ? 'border-brand/40 bg-brand/5' : 'border-border-light/50 bg-white hover:bg-bg-secondary/10'}`}
                   >
                     <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${business.trustSection === opt.id ? 'bg-white shadow-sm' : 'bg-bg-secondary/50'}`}>
                        {opt.icon}
                     </div>
                     <span className="text-[11px] font-medium text-text-primary uppercase tracking-widest">{opt.label}</span>
                     {business.trustSection === opt.id && <Check size={14} className="ml-auto text-brand" />}
                   </button>
                 ))}
              </div>
            </StepWrapper>
          )}

          {onboardingStep === 11 && (
            <StepWrapper 
              key="step11" 
              title="When are you available?" 
              onNext={handleNext}
              onBack={handleBack}
            >
              <div className="space-y-2">
                 {[
                   { id: 1, label: 'Mon' },
                   { id: 2, label: 'Tue' },
                   { id: 3, label: 'Wed' },
                   { id: 4, label: 'Thu' },
                   { id: 5, label: 'Fri' },
                 ].map((day) => {
                   const hours = business.workingHours.find(h => h.dayOfWeek === day.id);
                   return (
                    <div key={day.id} className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${hours?.isOpen ? 'bg-bg-secondary/20 border-border-light/30' : 'bg-transparent border-dashed border-border-light/50 opacity-40'}`}>
                        <span className="text-[11px] font-medium uppercase tracking-widest text-text-primary w-12">{day.label}</span>
                        <div className="flex items-center gap-2">
                          <input 
                             type="time" 
                             className="w-16 text-[10px] text-text-tertiary font-medium bg-transparent border-none outline-none p-0 cursor-pointer" 
                             value={hours?.startTime || '09:00'}
                             onChange={(e) => {
                                 const updated = business.workingHours.map(h => h.dayOfWeek === day.id ? { ...h, startTime: e.target.value } : h);
                                 updateBusiness({ workingHours: updated });
                             }}
                          />
                          <span className="text-text-tertiary">-</span>
                          <input 
                             type="time" 
                             className="w-16 text-[10px] text-text-tertiary font-medium bg-transparent border-none outline-none p-0 cursor-pointer text-right" 
                             value={hours?.endTime || '17:00'}
                             onChange={(e) => {
                                 const updated = business.workingHours.map(h => h.dayOfWeek === day.id ? { ...h, endTime: e.target.value } : h);
                                 updateBusiness({ workingHours: updated });
                             }}
                          />
                        </div>
                        <button 
                          onClick={() => {
                            const updated = business.workingHours.map(h => h.dayOfWeek === day.id ? { ...h, isOpen: !h.isOpen } : h);
                            updateBusiness({ workingHours: updated });
                          }}
                          className={`w-10 h-6 rounded-full transition-all relative flex items-center px-0.5 ${hours?.isOpen ? 'bg-brand' : 'bg-bg-tertiary'}`}
                        >
                          <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-all ${hours?.isOpen ? 'translate-x-4.5' : 'translate-x-0'}`} />
                        </button>
                    </div>
                   );
                 })}
                 <p className="text-[9px] text-text-tertiary font-normal text-center pt-2 opacity-60 uppercase tracking-widest">Adjust full hours in settings later.</p>
              </div>
            </StepWrapper>
          )}

          {onboardingStep === 12 && (
            <StepWrapper 
              key="step12" 
              title="Set up payments" 
              onNext={handleNext}
              onBack={handleBack}
              nextLabel="Skip for now"
            >
              <div className="flex flex-col items-center gap-8 py-4">
                 <div className="w-16 h-16 rounded-[28px] bg-[#635BFF]/5 flex items-center justify-center text-[#635BFF]">
                    <CreditCard size={28} />
                 </div>
                 <Button 
                    className="w-full h-13 bg-[#635BFF] text-white rounded-2xl font-medium text-[11px] uppercase tracking-widest shadow-lg shadow-[#635bff20]"
                    onClick={() => {
                       alert('Stripe integration coming soon!');
                       handleNext();
                    }}
                 >
                    Connect Stripe
                 </Button>
                 <p className="text-[10px] text-text-tertiary font-normal text-center max-w-[240px] leading-relaxed">Accept secure card payments and deposits directly to your bank account.</p>
              </div>
            </StepWrapper>
          )}

          {onboardingStep === 13 && (
            <StepWrapper 
              key="step13" 
              title="Your site is ready" 
              onNext={handleNext}
              onBack={handleBack}
              nextLabel="Publish My Site"
            >
              <div className="space-y-8">
                 <Card className="p-0 overflow-hidden rounded-[40px] border-border-light/40 bg-white flex flex-col h-64 relative shadow-2xl shadow-black/5 group">
                     <div className="h-28 bg-bg-secondary relative overflow-hidden">
                        {business.coverImage ? (
                          <motion.img 
                            initial={{ scale: 1.1 }}
                            animate={{ scale: 1 }}
                            src={business.coverImage} 
                            className="w-full h-full object-cover opacity-90 transition-transform duration-1000" 
                          />
                        ) : (
                          <div className="w-full h-full bg-linear-to-br from-bg-secondary to-bg-tertiary/30" />
                        )}
                        <div className="absolute top-4 right-4 px-2 py-1 rounded-full bg-white/80 backdrop-blur-sm border border-white/20 text-[8px] font-medium uppercase tracking-widest text-text-tertiary">Preview</div>
                     </div>
                     <div className="flex-1 px-8 py-6 flex items-center gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-white shadow-xl shadow-black/5 border border-border-light/20 flex items-center justify-center p-2.5 -mt-12 relative z-10">
                           {business.logo ? <img src={business.logo} className="w-full h-full object-contain" /> : <div className="text-brand font-medium italic text-xl">B</div>}
                        </div>
                        <div className="flex-1 min-w-0">
                           <h4 className="text-sm font-medium text-text-primary tracking-tight truncate">{business.name || 'Your Brand'}</h4>
                           <p className="text-[10px] text-text-tertiary font-normal truncate opacity-70">{getBusinessUrl(business.subdomain).replace(/^https?:\/\//, '')}</p>
                        </div>
                     </div>
                 </Card>
                 <div className="px-6 text-center space-y-1">
                    <p className="text-[10px] text-text-tertiary font-normal leading-relaxed italic opacity-60">"The best way to predict the future is to create it."</p>
                    <p className="text-[9px] text-brand/60 font-medium uppercase tracking-[0.2em]">Ready to Launch</p>
                 </div>
              </div>
            </StepWrapper>
          )}
        </AnimatePresence>
      </main>

      <footer className="fixed bottom-0 left-0 w-full py-8 text-center pointer-events-none opacity-40">
         <p className="text-[9px] font-normal text-text-tertiary uppercase tracking-[0.3em]">Pure Flow &bull; Skeduley</p>
      </footer>
    </div>
  );
};
