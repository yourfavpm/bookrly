import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronLeft, 
  Upload, 
  Check, 
  Globe, 
  LayoutDashboard, 
  Plus, 
  Trash2,
  Clock,
  ShieldCheck,
  Star,
  Image as ImageIcon
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';

const StepWrapper: React.FC<{ children: React.ReactNode, title: string, subtitle?: string, showPreview?: boolean }> = ({ children, title, subtitle, showPreview }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className={`w-full ${showPreview ? 'max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12' : 'max-w-md mx-auto'} py-12 px-6`}
  >
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-text-primary mb-2">{title}</h1>
        {subtitle && <p className="text-sm text-text-secondary font-normal">{subtitle}</p>}
      </div>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  </motion.div>
);

const PreviewCard: React.FC<{ business: { name: string; category: string; logo: string | null; primaryColor: string; coverImage: string | null; headline?: string; heroTitle?: string; subtext?: string; heroSubtitle?: string } }> = ({ business }) => (
  <div className="hidden lg:block sticky top-24">
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-border-light min-h-[500px] flex flex-col">
      <div className="h-4 w-full bg-bg-secondary flex gap-1.5 px-3 items-center border-b border-border-light">
        <div className="w-1.5 h-1.5 rounded-full bg-border-default" />
        <div className="w-1.5 h-1.5 rounded-full bg-border-default" />
        <div className="w-1.5 h-1.5 rounded-full bg-border-default" />
      </div>
      
      {/* Header Preview */}
      <div className="p-6 flex items-center justify-between border-b border-border-light bg-white">
        <div className="flex items-center gap-2">
           {business.logo ? (
             <img src={business.logo} alt="Logo" className="h-6 w-auto" />
           ) : (
             <div className="w-6 h-6 rounded bg-brand flex items-center justify-center text-white text-[10px] font-bold">B</div>
           )}
           <span className="text-sm font-semibold tracking-tight">{business.name || 'Your Business'}</span>
        </div>
        <div className="flex gap-4">
          <div className="h-2 w-10 bg-bg-secondary rounded" />
          <div className="h-2 w-10 bg-bg-secondary rounded" />
        </div>
      </div>

      {/* Hero Preview */}
      <div className="relative flex-1">
        <div className={`absolute inset-0 transition-all duration-700 ${business.coverImage ? 'bg-black/20' : 'bg-bg-tertiary'}`}>
          {business.coverImage && <img src={business.coverImage} className="w-full h-full object-cover" alt="Hero" />}
        </div>
        <div className="relative h-full p-10 flex flex-col justify-center items-center text-center space-y-4">
          <h2 className={`text-2xl font-bold tracking-tight transition-all ${business.coverImage ? 'text-white drop-shadow-md' : 'text-text-primary'}`}>
            {business.headline || 'Your Headline Here'}
          </h2>
          <p className={`text-xs max-w-[240px] leading-relaxed ${business.coverImage ? 'text-white/90 drop-shadow-sm' : 'text-text-secondary'}`}>
            {business.subtext || 'Provide more details about what you offer to your potential customers.'}
          </p>
          <div 
            className="px-6 py-2.5 rounded-xl text-white text-xs font-bold shadow-lg transition-transform" 
            style={{ backgroundColor: business.primaryColor }}
          >
            Book Now
          </div>
        </div>
      </div>
      
      {/* Services Preview Mockup */}
      <div className="p-8 bg-white space-y-4">
        <div className="h-3 w-24 bg-bg-secondary rounded" />
        <div className="grid grid-cols-2 gap-4">
           <div className="h-20 border border-border-light rounded-xl bg-bg-secondary/50 p-4 space-y-2">
              <div className="h-2 w-16 bg-border-light rounded" />
              <div className="h-3 w-10 bg-border-default rounded" />
           </div>
           <div className="h-20 border border-border-light rounded-xl bg-bg-secondary/50 p-4 space-y-2">
              <div className="h-2 w-16 bg-border-light rounded" />
              <div className="h-3 w-10 bg-border-default rounded" />
           </div>
        </div>
      </div>
    </div>
  </div>
);

export const OnboardingFlow: React.FC = () => {
  const { onboardingStep, setOnboardingStep, business, updateBusiness, user, fetchBusiness } = useAppStore();
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(false);

  // Initialize business if it doesn't exist
  useEffect(() => {
    if (!user) return;
    if (business) return;
    if (initializing) return;

    const init = async () => {
      setInitializing(true);
      setInitError(null);
      
      try {
        // First check if business already exists
        const { data: existing, error: fetchError } = await supabase
          .from('businesses')
          .select('id')
          .eq('owner_id', user.id)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (existing) {
          // Business exists, just fetch it fully
          await fetchBusiness();
          return;
        }

        // Create new business
        const { data, error } = await supabase
          .from('businesses')
          .insert([{ 
            owner_id: user.id, 
            name: '',
            subdomain: `biz-${user.id.slice(0, 8)}`,
            primary_color: '#4F46E5',
            trust_section: 'none'
          }])
          .select()
          .single();
        
        if (error) throw error;

        if (data) {
          // Initialize availability
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
        console.error('Onboarding init error:', err);
        setInitError(err instanceof Error ? err.message : 'Failed to initialize. Please try again.');
      } finally {
        setInitializing(false);
      }
    };
    init();
  }, [user, business, fetchBusiness, initializing]);

  const totalSteps = 13;

  const handleNext = () => {
    if (onboardingStep < totalSteps) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      setIsSuccess(true);
    }
  };

  const handleBack = () => {
    if (onboardingStep > 1) {
      setOnboardingStep(onboardingStep - 1);
    }
  };

  const categories = ['Beauty', 'Fitness', 'Wellness', 'Education', 'Events', 'Professional', 'Other'];

  if (isSuccess && business) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in duration-700">
        <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center text-white mb-8 shadow-xl shadow-success/20">
          <Check size={32} strokeWidth={3} />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-text-primary mb-2">Your site is ready</h1>
        <p className="text-text-secondary mb-12 text-center max-w-sm">Congratulations! You've successfully set up your professional booking presence.</p>
        
        <Card className="w-full max-w-sm p-6 mb-12 border-border-light shadow-xl shadow-black/5 overflow-hidden group">
           <div className="h-40 bg-bg-secondary rounded-xl mb-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-brand/5 flex items-center justify-center">
                 <Globe className="text-brand opacity-10" size={100} />
              </div>
              <div className="absolute inset-0 p-4 flex flex-col justify-end">
                <p className="text-[10px] font-bold text-brand uppercase tracking-widest mb-1">Live Website</p>
                <p className="text-sm font-semibold truncate">{business.name?.toLowerCase().replace(/\s+/g, '-') || 'site'}.bookflow.ca</p>
              </div>
           </div>
           <div className="space-y-4">
              <Button className="w-full h-12 rounded-xl text-sm font-bold shadow-lg" onClick={() => window.open('/p/preview', '_blank')}>
                View website
              </Button>
              <Button variant="secondary" className="w-full h-12 rounded-xl text-sm font-bold border-border-default" onClick={() => navigate('/dashboard')}>
                Go to dashboard
              </Button>
           </div>
        </Card>
      </div>
    );
  }

  // Not logged in — redirect
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg-secondary gap-4">
        <p className="text-sm text-text-secondary font-medium">Please sign in to continue</p>
        <Button className="h-10 px-6 rounded-xl font-bold" onClick={() => navigate('/login')}>Go to Login</Button>
      </div>
    );
  }

  // Still loading business
  if (!business) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg-secondary gap-6">
        {initError ? (
          <>
            <div className="w-12 h-12 bg-error/10 rounded-2xl flex items-center justify-center">
              <span className="text-xl text-error">!</span>
            </div>
            <p className="text-sm text-error font-medium text-center max-w-xs">{initError}</p>
            <Button className="h-10 px-6 rounded-xl font-bold" onClick={() => { setInitError(null); setInitializing(false); }}>
              Try Again
            </Button>
          </>
        ) : (
          <>
            <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-text-tertiary font-medium">Setting up your workspace...</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-secondary flex flex-col items-center">
      {/* Navigation & Progress */}
      <header className="w-full h-20 bg-white/80 backdrop-blur-md border-b border-border-light sticky top-0 z-50 flex items-center px-6 lg:px-12 justify-between">
         <div className="flex items-center gap-3">
           <div className="w-8 h-8 rounded-xl bg-brand flex items-center justify-center text-white font-bold italic">B</div>
           <span className="font-semibold text-lg tracking-tight hidden sm:block">Bookflow</span>
         </div>
         
         <div className="flex flex-col items-center gap-2 flex-1 max-w-md px-10">
            <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
               <motion.div 
                 className="h-full bg-brand" 
                 initial={false}
                 animate={{ width: `${(onboardingStep / totalSteps) * 100}%` }}
               />
            </div>
            <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Setup step {onboardingStep} of {totalSteps}</span>
         </div>

         <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="hidden sm:flex text-text-secondary hover:text-text-primary px-3" onClick={() => navigate('/dashboard')}>Exit</Button>
         </div>
      </header>

      <main className="flex-1 w-full flex justify-center">
        <AnimatePresence mode="wait">
          {onboardingStep === 1 && (
            <StepWrapper key="step1" title="What’s your business called?" subtitle="This is the primary name your customers will see.">
              <Input 
                placeholder="e.g. Glow Beauty Bar" 
                value={business.name} 
                className="h-14 text-lg"
                onChange={(e) => updateBusiness({ name: e.target.value })}
                autoFocus
              />
              <Button className="w-full h-12 rounded-xl font-bold mt-4" onClick={handleNext} disabled={!business.name}>Continue</Button>
              <button onClick={handleNext} className="text-xs font-bold text-text-tertiary hover:text-text-primary tracking-widest uppercase mt-3">Skip for now</button>
            </StepWrapper>
          )}

          {onboardingStep === 2 && (
            <StepWrapper key="step2" title="Pick your category" subtitle="Help us tailor the experience for your industry.">
              <div className="grid grid-cols-2 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { updateBusiness({ category: cat }); handleNext(); }}
                    className={`h-14 rounded-xl border-2 transition-all flex items-center justify-center text-sm font-semibold ${business.category === cat ? 'border-brand bg-brand-light text-brand shadow-sm shadow-brand/10' : 'border-border-default bg-white hover:border-border-light hover:bg-bg-tertiary text-text-secondary'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="pt-6">
                <button onClick={handleBack} className="flex items-center gap-2 text-xs font-bold text-text-tertiary hover:text-text-primary tracking-widest uppercase"><ChevronLeft size={14} /> Back</button>
              </div>
            </StepWrapper>
          )}

          {onboardingStep === 3 && (
            <StepWrapper key="step3" title="Add your logo" subtitle="PNG or JPG preferred. We recommend a square icon." showPreview>
              <div className="space-y-6 flex-1">
                <div className="h-48 rounded-2xl border-2 border-dashed border-border-default flex flex-col items-center justify-center bg-white group hover:border-brand/40 transition-colors cursor-pointer relative overflow-hidden">
                  {business.logo ? (
                    <img src={business.logo} className="h-20 w-auto" alt="Logo preview" />
                  ) : (
                    <>
                      <Upload className="text-text-tertiary mb-3 group-hover:text-brand transition-colors" size={24} />
                      <p className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors">Click to upload</p>
                    </>
                  )}
                  <input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    disabled={uploading}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file && business) {
                        setUploading(true);
                        try {
                          const fileExt = file.name.split('.').pop();
                          const fileName = `logo-${Date.now()}.${fileExt}`;
                          const filePath = `${business.id}/${fileName}`;

                          const { error: uploadError } = await supabase.storage
                            .from('business-assets')
                            .upload(filePath, file);

                          if (uploadError) throw uploadError;

                          const { data: { publicUrl } } = supabase.storage
                            .from('business-assets')
                            .getPublicUrl(filePath);

                          await updateBusiness({ logo: publicUrl });
                        } catch (err: any) {
                          alert(err.message);
                        } finally {
                          setUploading(false);
                        }
                      }
                    }}
                  />
                </div>
                <div className="flex gap-4">
                  <Button variant="secondary" className="flex-1 h-12 rounded-xl font-bold" onClick={handleNext}>Skip for now</Button>
                  <Button className="flex-1 h-12 rounded-xl font-bold" onClick={handleNext} disabled={!business.logo}>Continue</Button>
                </div>
                <button onClick={handleBack} className="flex items-center gap-2 text-xs font-bold text-text-tertiary hover:text-text-primary tracking-widest uppercase"><ChevronLeft size={14} /> Back</button>
              </div>
              <PreviewCard business={{ ...business, headline: business.heroTitle || '', subtext: business.heroSubtitle || '', logo: business.logo, primaryColor: business.primaryColor, coverImage: business.coverImage, category: business.category, name: business.name } as any} />
            </StepWrapper>
          )}

          {onboardingStep === 4 && (
            <StepWrapper key="step4" title="Pick your brand color" subtitle="This will be used for buttons, links, and highlights." showPreview>
              <div className="space-y-6 flex-1">
                <div className="grid grid-cols-4 gap-4">
                  {['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#8B5CF6', '#3B82F6', '#111111'].map((color) => (
                    <button
                      key={color}
                      onClick={() => updateBusiness({ primaryColor: color })}
                      className={`h-12 w-full rounded-xl transition-transform hover:scale-105 ${business.primaryColor === color ? 'ring-4 ring-offset-2 ring-brand/10 border-4 border-white' : ''}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <div className="col-span-4 relative h-12 rounded-xl border border-border-default overflow-hidden flex items-center px-4 bg-white">
                    <input 
                      type="color" 
                      value={business.primaryColor} 
                      onChange={(e) => updateBusiness({ primaryColor: e.target.value })}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="w-5 h-5 rounded-full mr-3" style={{ backgroundColor: business.primaryColor }} />
                    <span className="text-sm font-medium uppercase">{business.primaryColor}</span>
                    <span className="ml-auto text-[10px] font-bold text-text-tertiary tracking-widest">CUSTOM</span>
                  </div>
                </div>
                <div className="flex gap-4 mt-4">
                  <Button variant="secondary" className="flex-1 h-12 rounded-xl font-bold" onClick={handleNext}>Skip</Button>
                  <Button className="flex-1 h-12 rounded-xl font-bold" onClick={handleNext}>Continue</Button>
                </div>
                <button onClick={handleBack} className="flex items-center gap-2 text-xs font-bold text-text-tertiary hover:text-text-primary tracking-widest uppercase"><ChevronLeft size={14} /> Back</button>
              </div>
              <PreviewCard business={business} />
            </StepWrapper>
          )}

          {onboardingStep === 5 && (
            <StepWrapper key="step5" title="Set a cover image" subtitle="The first thing customers see when they land on your site." showPreview>
              <div className="space-y-6 flex-1">
                <div className="h-64 rounded-2xl border-2 border-dashed border-border-default flex flex-col items-center justify-center bg-white group hover:border-brand/40 transition-colors cursor-pointer relative overflow-hidden">
                  {business.coverImage ? (
                    <img src={business.coverImage} className="w-full h-full object-cover" alt="Cover preview" />
                  ) : (
                    <>
                      <ImageIcon className="text-text-tertiary mb-3 group-hover:text-brand transition-colors" size={32} />
                      <p className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors">Add your business photo</p>
                      <p className="text-[10px] text-text-tertiary mt-2">Landscape works best</p>
                    </>
                  )}
                  <input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    disabled={uploading}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file && business) {
                        setUploading(true);
                        try {
                          const fileExt = file.name.split('.').pop();
                          const fileName = `cover-${Date.now()}.${fileExt}`;
                          const filePath = `${business.id}/${fileName}`;

                          const { error: uploadError } = await supabase.storage
                            .from('business-assets')
                            .upload(filePath, file);

                          if (uploadError) throw uploadError;

                          const { data: { publicUrl } } = supabase.storage
                            .from('business-assets')
                            .getPublicUrl(filePath);

                          await updateBusiness({ coverImage: publicUrl });
                        } catch (err: any) {
                          alert(err.message);
                        } finally {
                          setUploading(false);
                        }
                      }
                    }}
                  />
                </div>
                <div className="flex gap-4">
                  <Button variant="secondary" className="flex-1 h-12 rounded-xl font-bold" onClick={handleNext}>Skip for now</Button>
                  <Button className="flex-1 h-12 rounded-xl font-bold" onClick={handleNext} disabled={!business.coverImage}>Continue</Button>
                </div>
                <button onClick={handleBack} className="flex items-center gap-2 text-xs font-bold text-text-tertiary hover:text-text-primary tracking-widest uppercase"><ChevronLeft size={14} /> Back</button>
              </div>
              <PreviewCard business={business} />
            </StepWrapper>
          )}

          {onboardingStep === 6 && business && (
            <StepWrapper key="step6" title="Welcome your customers" subtitle="Write a clear headline and subtext for your hero section." showPreview>
              <div className="space-y-6 flex-1">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-tertiary uppercase tracking-wider">Headline</label>
                  <Input 
                    placeholder="e.g. Look your best with curated beauty" 
                    value={business.heroTitle || ''} 
                    className="h-12"
                    onChange={(e) => updateBusiness({ heroTitle: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-tertiary uppercase tracking-wider">Subtext</label>
                  <textarea 
                    placeholder="Briefly explain what you do..." 
                    value={business.heroSubtitle || ''} 
                    rows={3}
                    className="w-full rounded-xl border border-border-default p-4 text-sm focus:outline-none focus:border-brand transition-colors"
                    onChange={(e) => updateBusiness({ heroSubtitle: e.target.value })}
                  />
                </div>
                <div className="flex gap-4 mt-4">
                  <Button variant="secondary" className="flex-1 h-12 rounded-xl font-bold" onClick={handleNext}>Skip</Button>
                  <Button className="flex-1 h-12 rounded-xl font-bold" onClick={handleNext} disabled={!business.heroTitle}>Continue</Button>
                </div>
                <button onClick={handleBack} className="flex items-center gap-2 text-xs font-bold text-text-tertiary hover:text-text-primary tracking-widest uppercase"><ChevronLeft size={14} /> Back</button>
              </div>
              <PreviewCard business={{ ...business, headline: business.heroTitle, subtext: business.heroSubtitle } as any} />
            </StepWrapper>
          )}

          {onboardingStep === 7 && (
            <StepWrapper key="step7" title="Add your first service" subtitle="What is the main service you want to start with?">
              <Input 
                placeholder="e.g. Signature Haircut or Consultation" 
                className="h-14 text-lg"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleNext();
                }}
              />
              <p className="text-[10px] text-text-tertiary mt-2 text-center font-medium opacity-60 italic">You can add more services later in the dashboard.</p>
              <div className="flex gap-4 mt-8">
                <Button variant="secondary" className="flex-1 h-12 rounded-xl font-bold" onClick={handleNext}>Skip</Button>
                <Button className="flex-1 h-12 rounded-xl font-bold" onClick={handleNext}>Continue</Button>
              </div>
            </StepWrapper>
          )}

          {onboardingStep === 8 && (
            <StepWrapper key="step8" title="Set price and duration" subtitle="Help your customers know what to expect.">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2 text-center">
                  <label className="text-xs font-bold text-text-tertiary uppercase tracking-wider">Base Price</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary font-bold">$</span>
                    <Input placeholder="0" className="h-14 pl-10 text-xl font-bold text-center pr-4" type="number" />
                  </div>
                </div>
                <div className="space-y-2 text-center">
                  <label className="text-xs font-bold text-text-tertiary uppercase tracking-wider">Duration</label>
                  <div className="relative">
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-text-tertiary tracking-widest uppercase">MIN</span>
                    <Input placeholder="30" className="h-14 pr-12 text-xl font-bold text-center pl-4" type="number" />
                  </div>
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <Button variant="secondary" className="flex-1 h-12 rounded-xl font-bold" onClick={handleNext}>Skip</Button>
                <Button className="flex-1 h-12 rounded-xl font-bold" onClick={handleNext}>Continue</Button>
              </div>
              <button onClick={handleBack} className="mt-6 flex items-center gap-2 text-xs font-bold text-text-tertiary hover:text-text-primary tracking-widest uppercase"><ChevronLeft size={14} /> Back</button>
            </StepWrapper>
          )}

          {onboardingStep === 9 && (
            <StepWrapper key="step9" title="Add a booking fee?" subtitle="Collect a non-refundable deposit to secure appointments.">
              <div className="grid grid-cols-1 gap-4">
                 <button className="h-20 w-full rounded-2xl border-2 border-border-default bg-white p-6 flex items-center justify-between group hover:border-brand transition-all">
                    <div className="text-left">
                      <p className="font-semibold text-text-primary">No booking fee</p>
                      <p className="text-[10px] text-text-tertiary mt-0.5">Customers pay full amount after service.</p>
                    </div>
                    <div className="w-6 h-6 rounded-full border-2 border-border-default" />
                 </button>
                 <div className="h-24 w-full rounded-2xl border-2 border-brand bg-brand-light/20 p-6 flex items-center justify-between">
                    <div className="text-left flex-1 mr-6">
                      <p className="font-semibold text-brand">Add deposit</p>
                      <div className="relative mt-2 max-w-[120px]">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand font-bold text-sm">$</span>
                        <input className="w-full h-10 border-2 border-brand/20 rounded-lg bg-white pl-7 pr-3 text-sm font-bold focus:outline-none focus:border-brand" placeholder="25" />
                      </div>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-brand flex items-center justify-center text-white"><Check size={14} strokeWidth={4} /></div>
                 </div>
              </div>
              <div className="flex gap-4 mt-8">
                <Button variant="secondary" className="flex-1 h-12 rounded-xl font-bold" onClick={handleNext}>Skip</Button>
                <Button className="flex-1 h-12 rounded-xl font-bold" onClick={handleNext}>Continue</Button>
              </div>
              <button onClick={handleBack} className="mt-6 flex items-center gap-2 text-xs font-bold text-text-tertiary hover:text-text-primary tracking-widest uppercase"><ChevronLeft size={14} /> Back</button>
            </StepWrapper>
          )}

          {onboardingStep === 10 && (
            <StepWrapper key="step10" title="Offer any add-ons?" subtitle="Perfect for upsells like 'Extra hydration mask' or '+15 min massage'.">
               <div className="space-y-4">
                  <div className="flex gap-4 p-4 rounded-xl bg-white border border-border-light items-center group">
                    <div className="flex-1">
                      <p className="text-sm font-semibold">Extra hot stones</p>
                      <p className="text-[10px] text-text-tertiary">+$15</p>
                    </div>
                    <button className="p-2 text-text-tertiary hover:text-error hover:bg-error/5 rounded-lg"><Trash2 size={16} /></button>
                  </div>
                  <button className="w-full h-12 rounded-xl border-2 border-dashed border-border-default flex items-center justify-center gap-2 text-xs font-bold text-text-tertiary hover:border-brand/40 hover:text-brand transition-all">
                     <Plus size={16} />
                     Add option
                  </button>
               </div>
               <div className="flex gap-4 pt-8">
                  <Button variant="secondary" className="flex-1 h-12 rounded-xl font-bold" onClick={handleNext}>Maybe later</Button>
                  <Button className="flex-1 h-12 rounded-xl font-bold" onClick={handleNext}>Continue</Button>
               </div>
               <button onClick={handleBack} className="mt-6 flex items-center gap-2 text-xs font-bold text-text-tertiary hover:text-text-primary tracking-widest uppercase"><ChevronLeft size={14} /> Back</button>
            </StepWrapper>
          )}

          {onboardingStep === 11 && (
            <StepWrapper key="step11" title="Build direct trust" subtitle="Which sections should we include to show your expertise?">
               <div className="grid grid-cols-1 gap-4">
                  {[
                    { id: 'reviews' as const, label: 'Client Reviews' as const, sub: 'Import or add text reviews.' as const, icon: <Star className="text-amber-400" size={20} /> },
                    { id: 'proof' as const, label: 'Proof of Work' as const, sub: 'Photos of your best results.' as const, icon: <ImageIcon className="text-blue-400" size={20} /> },
                    { id: 'both' as const, label: 'Both Sections' as const, sub: 'The ultimate professional look.' as const, icon: <ShieldCheck className="text-success" size={20} /> },
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => updateBusiness({ trustSection: option.id })}
                      className={`p-5 rounded-2xl border-2 transition-all flex items-center gap-5 text-left ${business.trustSection === option.id ? 'border-brand bg-brand-light/30 shadow-sm' : 'border-border-default bg-white hover:border-border-light'}`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${business.trustSection === option.id ? 'bg-white shadow-sm' : 'bg-bg-secondary'}`}>
                        {option.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-text-primary">{option.label}</h4>
                        <p className="text-[10px] text-text-secondary">{option.sub}</p>
                      </div>
                      {business.trustSection === option.id && <div className="w-6 h-6 rounded-full bg-brand flex items-center justify-center text-white"><Check size={14} strokeWidth={4} /></div>}
                    </button>
                  ))}
               </div>
               <div className="flex gap-4 mt-8">
                 <Button variant="secondary" className="flex-1 h-12 rounded-xl font-bold" onClick={handleNext}>Skip</Button>
                 <Button className="flex-1 h-12 rounded-xl font-bold" onClick={handleNext} disabled={business.trustSection === 'none'}>Continue</Button>
               </div>
               <button onClick={handleBack} className="mt-6 flex items-center gap-2 text-xs font-bold text-text-tertiary hover:text-text-primary tracking-widest uppercase"><ChevronLeft size={14} /> Back</button>
            </StepWrapper>
          )}

          {onboardingStep === 12 && (
            <StepWrapper key="step12" title="When are you open?" subtitle="Define your default working hours for the week.">
                <div className="space-y-3">
                  {business.workingHours.map((hours) => (
                    <div key={hours.dayOfWeek} className={`flex items-center justify-between p-4 rounded-xl border ${hours.isOpen ? 'border-border-light bg-white' : 'border-dashed border-border-default opacity-50 bg-bg-secondary'}`}>
                       <div className="flex items-center gap-4">
                          <input 
                            type="checkbox" 
                            checked={hours.isOpen} 
                            onChange={() => {
                              const updated = business.workingHours.map(h => 
                                h.dayOfWeek === hours.dayOfWeek ? { ...h, isOpen: !h.isOpen } : h
                              );
                              updateBusiness({ workingHours: updated });
                            }}
                            className="w-4 h-4 rounded text-brand focus:ring-brand"
                          />
                          <span className="text-sm font-semibold capitalize w-24">
                            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][hours.dayOfWeek]}
                          </span>
                       </div>
                       {hours.isOpen ? (
                         <div className="flex items-center gap-3">
                            <input className="w-20 px-2 py-1.5 border border-border-default rounded-lg text-xs font-medium" type="time" value={hours.startTime} readOnly />
                            <span className="text-text-tertiary">–</span>
                            <input className="w-20 px-2 py-1.5 border border-border-default rounded-lg text-xs font-medium" type="time" value={hours.endTime} readOnly />
                         </div>
                       ) : (
                         <span className="text-[10px] font-bold text-text-tertiary tracking-widest uppercase">Closed</span>
                       )}
                    </div>
                  ))}
               </div>
               <div className="flex gap-4 mt-8">
                 <Button variant="secondary" className="flex-1 h-12 rounded-xl font-bold" onClick={handleNext}>Skip</Button>
                 <Button className="flex-1 h-12 rounded-xl font-bold" onClick={handleNext}>Continue</Button>
               </div>
               <button onClick={handleBack} className="mt-6 flex items-center gap-2 text-xs font-bold text-text-tertiary hover:text-text-primary tracking-widest uppercase"><ChevronLeft size={14} /> Back</button>
            </StepWrapper>
          )}

          {onboardingStep === 13 && (
            <StepWrapper key="step13" title="Review & Publish" subtitle="Take a final look. Your beautiful booking site is just a click away.">
               <div className="space-y-10">
                  <div className="space-y-4">
                     <div className="bg-white p-6 rounded-2xl border border-border-light shadow-sm flex items-center gap-6">
                        <div className="w-16 h-16 rounded-xl bg-bg-secondary flex items-center justify-center p-2">
                           {business.logo ? <img src={business.logo} className="w-full h-auto" alt="Logo" /> : <ImageIcon className="text-text-tertiary" />}
                        </div>
                        <div className="flex-1 min-w-0">
                           <h4 className="font-semibold truncate">{business.name || 'Setup Pending'}</h4>
                           <p className="text-xs text-text-secondary">{business.category}</p>
                           <div className="flex gap-1.5 mt-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: business.primaryColor }} />
                              <div className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">{business.primaryColor}</div>
                           </div>
                        </div>
                        <button className="text-xs font-bold text-brand hover:underline" onClick={() => setOnboardingStep(1)}>Edit</button>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <Card className="p-5 flex flex-col gap-2">
                           <Clock size={18} className="text-text-tertiary" />
                           <p className="text-[10px] font-bold text-text-tertiary tracking-widest uppercase">Availability</p>
                           <p className="text-xs font-semibold">5 Days Active</p>
                        </Card>
                        <Card className="p-5 flex flex-col gap-2">
                           <LayoutDashboard size={18} className="text-text-tertiary" />
                           <p className="text-[10px] font-bold text-text-tertiary tracking-widest uppercase">Services</p>
                           <p className="text-xs font-semibold">Ready to launch</p>
                        </Card>
                     </div>
                  </div>

                  <div className="space-y-6">
                    <div className="p-6 bg-brand/5 border border-brand/10 rounded-2xl">
                       <p className="text-xs text-brand font-medium leading-relaxed">
                         By publishing, you agree to our Terms of Service and Privacy Policy. You can unpublish your site at any time from the dashboard.
                       </p>
                    </div>
                    <Button 
                      className="w-full h-14 rounded-2xl font-bold text-lg shadow-xl shadow-brand/20 group relative overflow-hidden" 
                      onClick={() => {
                        updateBusiness({ isPublished: true });
                        handleNext();
                      }}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        Publish My Website
                        <ChevronRight size={18} />
                      </span>
                      <motion.div 
                        className="absolute inset-0 bg-brand-hover opacity-0 group-hover:opacity-100 transition-opacity"
                        whileTap={{ scale: 0.98 }}
                      />
                    </Button>
                  </div>
               </div>
               <button onClick={handleBack} className="mt-10 flex items-center gap-2 text-xs font-bold text-text-tertiary hover:text-text-primary tracking-widest uppercase"><ChevronLeft size={14} /> Back</button>
            </StepWrapper>
          )}
        </AnimatePresence>
      </main>
      
      {/* Footer Disclaimer */}
      <footer className="w-full py-8 px-6 text-center">
         <p className="text-[10px] text-text-tertiary font-bold tracking-[0.2em] uppercase">Built with Bookflow Canada &bull; Secure Setup</p>
      </footer>
    </div>
  );
};
