import React, { useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { calculateDaysRemaining } from '../../lib/dateUtils';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Calendar, 
  ArrowRight, 
  Eye,
  CheckCircle2,
  Circle,
  AlertCircle,
  TrendingUp,
  Users
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const DashboardOverview: React.FC = () => {
  const { business } = useAppStore();
  const navigate = useNavigate();
  const [copying, setCopying] = React.useState(false);

  const handleCopyLink = React.useCallback(() => {
    if (!business) return;
    const rootDomain = import.meta.env.VITE_ROOT_DOMAIN || 'localhost:5173';
    const protocol = rootDomain.includes('localhost') ? 'http' : 'https';
    const publicUrl = `${protocol}://${business.slug || business.subdomain}.${rootDomain}`;
    navigator.clipboard.writeText(publicUrl);
    setCopying(true);
    setTimeout(() => setCopying(false), 2000);
  }, [business]);

  const onboardingSteps = useMemo(() => {
    if (!business) return [];
    
    return [
      {
        id: 'services',
        title: 'Add your services',
        description: 'Create what customers can book',
        isCompleted: business.services.length > 0,
        action: () => navigate('/dashboard/services'),
        actionLabel: 'Add service'
      },
      {
        id: 'availability',
        title: 'Set your availability',
        description: "Choose when you're open for bookings",
        isCompleted: business.workingHours.some(h => h.isOpen),
        action: () => navigate('/dashboard/availability'),
        actionLabel: 'Set schedule'
      },
      {
        id: 'payments',
        title: 'Connect payments',
        description: 'Start receiving payments for your services',
        isCompleted: business.stripeConnected && business.stripeDetailsSubmitted,
        action: () => navigate('/dashboard/settings?section=payments'),
        actionLabel: 'Set up'
      },
      {
        id: 'website',
        title: 'Customize your website',
        description: 'Make your booking page match your brand',
        isCompleted: business.isPublished || !!business.heroTitle,
        action: () => navigate('/dashboard/website'),
        actionLabel: 'Customize'
      },
      {
        id: 'share',
        title: 'Share your booking link',
        description: 'Start getting customers today',
        isCompleted: false, // Could be tracked via a meta flag
        action: handleCopyLink,
        actionLabel: copying ? 'Copied!' : 'Copy link'
      }
    ];
  }, [business, navigate, handleCopyLink, copying]);

  const completedSteps = onboardingSteps.filter(s => s.isCompleted).length;
  const progressPercent = Math.round((completedSteps / onboardingSteps.length) * 100);

  const trialDaysLeft = useMemo(() => {
    return calculateDaysRemaining(business?.trialEndDate);
  }, [business]);

  if (!business) return null;

  const today = new Date();
  const hour = today.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      
      {/* Trial Awareness Banner */}
      {trialDaysLeft !== null && trialDaysLeft <= 14 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-xl bg-text-primary text-white shadow-xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-110 transition-transform duration-1000" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-2 rounded-lg bg-white/10">
              <AlertCircle size={20} className="text-emerald-400" />
            </div>
            <p className="text-sm font-medium">Your free trial ends in <span className="text-emerald-400 font-bold">{trialDaysLeft} days</span>. Upgrade now to keep your business running.</p>
          </div>
          <Button 
            size="sm" 
            onClick={() => navigate('/dashboard/settings?section=billing')}
            className="w-full sm:w-auto px-8 h-10 bg-emerald-500 hover:bg-emerald-400 text-text-primary rounded-lg font-bold text-[10px] uppercase tracking-widest relative z-10 transition-all shadow-lg shadow-emerald-500/20"
          >
            Upgrade Now
          </Button>
        </div>
      )}

      {/* Top Greeting + Context */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
        <div className="space-y-1">
          <h1 className="text-2xl font-light tracking-tight text-text-primary">
            {greeting}, <span className="font-medium">{business.name.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-sm font-light text-text-secondary">
            Let's get your booking system ready for customers.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => window.open(`/preview`, '_blank')}
            className="rounded-xl h-9 px-4 font-medium text-[10px] uppercase tracking-widest border-black/5 bg-white hover:bg-bg-canvas/40"
          >
            <Eye size={14} className="mr-2" />
            Preview
          </Button>
          <Button 
            size="sm"
            onClick={() => navigate('/dashboard/bookings')}
            className="rounded-xl h-10 px-6 font-medium text-[10px] uppercase tracking-widest bg-brand text-white shadow-lg shadow-brand/10 transition-all"
          >
            <Calendar size={14} className="mr-2" />
            Calendar
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          
          {/* Primary Setup Progress */}
          <Card className="border-border-polaris shadow-none bg-white p-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-medium tracking-tight">Set up your business</h2>
                  <p className="text-[11px] font-light text-text-tertiary mt-1">{onboardingSteps.length - completedSteps} steps left to complete your setup</p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className="text-xs font-medium text-text-primary">{progressPercent}%</span>
                  <div className="w-32 h-1.5 bg-bg-canvas rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-emerald-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>

              <div className="h-px bg-border-polaris/50" />

              <div className="space-y-1">
                {onboardingSteps.map((step) => (
                  <div 
                    key={step.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-bg-canvas/30 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      {step.isCompleted ? (
                        <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
                      ) : (
                        <Circle size={20} className="text-text-tertiary shrink-0 group-hover:text-text-primary transition-colors" />
                      )}
                      <div>
                        <h3 className={`text-sm font-normal tracking-tight ${step.isCompleted ? 'text-text-primary' : 'text-text-secondary'}`}>
                          {step.title}
                        </h3>
                        <p className="text-[11px] text-text-tertiary font-light">{step.description}</p>
                      </div>
                    </div>
                    {!step.isCompleted && (
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={step.action}
                        className="h-8 px-3 rounded-md border-border-polaris bg-white text-[9px] font-bold uppercase tracking-widest hover:border-brand transition-colors"
                      >
                        {step.actionLabel}
                        <ArrowRight size={10} className="ml-1.5" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-8">
          {/* Mini Insights */}
          <div className="space-y-4">
            <h2 className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest px-1">Insights</h2>
            <Card className="border-border-polaris shadow-none bg-white p-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                  <TrendingUp size={16} />
                </div>
                <div className="space-y-1">
                  <p className="text-[13px] font-medium leading-tight">You have 0 bookings this week</p>
                  <p className="text-[11px] text-text-tertiary leading-normal">Setup is nearly done. Share your link to start seeing results.</p>
                </div>
              </div>

              {!business.isPublished && (
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                    <AlertCircle size={16} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[13px] font-medium leading-tight">Your page is not live yet</p>
                    <p className="text-[11px] text-text-tertiary leading-normal">Publish your website in the settings to allow public bookings.</p>
                  </div>
                </div>
              )}

              {completedSteps < onboardingSteps.length && (
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                    <Users size={16} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[13px] font-medium leading-tight">Complete setup to grow</p>
                    <p className="text-[11px] text-text-tertiary leading-normal">Finish the pending steps to unlock your full potential.</p>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="space-y-4">
            <h2 className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest px-1">Recent Activity</h2>
            <Card className="border-border-polaris shadow-none bg-white p-8">
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                 <div className="w-16 h-16 rounded-full bg-bg-canvas flex items-center justify-center text-text-tertiary">
                   <Calendar size={24} />
                 </div>
                 <div className="space-y-1">
                   <p className="text-sm font-semibold tracking-tight">No bookings yet</p>
                   <p className="text-[11px] text-text-tertiary leading-relaxed">Once you go live, your bookings will appear here.</p>
                 </div>
                 <Button 
                    size="sm"
                    variant="secondary"
                    onClick={() => window.open(`/preview`, '_blank')}
                    className="h-8 px-4 rounded-md border-border-polaris bg-white text-[9px] font-bold uppercase tracking-widest hover:bg-bg-canvas/30"
                 >
                   Preview your page
                 </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
