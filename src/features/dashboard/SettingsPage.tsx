import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { 
  User,
  Globe,
  CreditCard,
  Users,
  ShieldCheck,
  ArrowLeft,
  Upload,
  ExternalLink,
  Check,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getBusinessUrl } from '../../lib/domainUtils';

type SettingsSection = 'menu' | 'profile' | 'website' | 'payments' | 'billing' | 'team' | 'security';

export const SettingsPage: React.FC = () => {
  const { business, updateBusiness, user, setupStripeConnect, refreshStripeStatus, createSubscription, openBillingPortal, uploadLogo, updatePassword } = useAppStore();
  const [activeSection, setActiveSection] = useState<SettingsSection>('menu');
  const [formData, setFormData] = useState({ ...business });
  const [isConnecting, setIsConnecting] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('return') === 'true' || params.get('refresh') === 'true') {
      refreshStripeStatus();
      window.history.replaceState({}, '', window.location.pathname + (activeSection !== 'menu' ? `?section=${activeSection}` : ''));
    }
  }, [refreshStripeStatus, activeSection]);

  if (!business) return null;

  const handleUpdate = (updates: Partial<NonNullable<typeof business>>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    updateBusiness(updates);
  };

  const navItems = [
    { id: 'profile' as const, title: 'Profile', description: 'Manage your business details', icon: <User size={18} /> },
    { id: 'website' as const, title: 'Website', description: 'Configure your subdomain and site status', icon: <Globe size={18} /> },
    { id: 'payments' as const, title: 'Payments', description: 'Connect Stripe and manage payouts', icon: <CreditCard size={18} /> },
    { id: 'billing' as const, title: 'Billing', description: 'Manage your plan and invoices', icon: <ShieldCheck size={18} /> },
    { id: 'team' as const, title: 'Team', description: 'Invite members (Coming Soon)', icon: <Users size={18} />, isPlaceholder: true },
    { id: 'security' as const, title: 'Security', description: 'Update your password', icon: <ShieldCheck size={18} /> }
  ];

  const renderMenu = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-1">
        <h1 className="text-2xl font-medium tracking-tight text-text-primary">Settings</h1>
        <p className="text-[11px] text-text-tertiary font-normal">Manage your business configuration.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => !item.isPlaceholder && setActiveSection(item.id)}
            className={`w-full text-left p-6 rounded-2xl bg-white border border-border-polaris hover:bg-bg-canvas/30 transition-all flex flex-col gap-4 group ${item.isPlaceholder ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}`}
          >
            <div className="w-10 h-10 rounded-xl bg-bg-canvas flex items-center justify-center text-text-tertiary group-hover:bg-brand group-hover:text-white transition-colors">
              {item.icon}
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                {item.title}
                {item.isPlaceholder && <span className="text-[8px] font-normal uppercase tracking-widest bg-bg-tertiary px-2 py-0.5 rounded-full text-text-tertiary">Soon</span>}
              </h3>
              <p className="text-[11px] text-text-tertiary font-normal leading-tight">{item.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4">
        <button onClick={() => setActiveSection('menu')} className="p-3 -ml-2 hover:bg-bg-canvas rounded-xl text-text-tertiary transition-all active:scale-90">
          <ArrowLeft size={20} />
        </button>
        <div className="space-y-0.5">
          <h1 className="text-xl font-medium tracking-tight text-text-primary">Profile</h1>
          <p className="text-[11px] text-text-tertiary font-normal">Manage your business identity.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="space-y-8 p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input label="Business Name" value={formData.name} onChange={e => handleUpdate({ name: e.target.value })} className="rounded-xl" />
              <Input label="Email Address" value={user?.email || ''} readOnly className="rounded-xl opacity-70 bg-bg-canvas/10" />
              <Input label="Phone Number" value={formData.phone || ''} onChange={e => handleUpdate({ phone: e.target.value })} className="rounded-xl" />
            </div>
            <div className="flex justify-end pt-4">
               <Button onClick={() => { updateBusiness(formData); alert('Saved!'); }} className="rounded-xl px-10 h-12 bg-brand text-white font-bold text-[10px] uppercase tracking-widest shadow-xl shadow-brand/10">Save Changes</Button>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
           <Card className="p-8 space-y-6">
              <div className="space-y-3">
                 <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Logo</label>
                 <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-xl bg-bg-canvas flex items-center justify-center border border-dashed border-border-polaris overflow-hidden">
                       {isUploadingLogo ? <div className="animate-pulse w-full h-full bg-bg-tertiary" /> : formData.logo ? <img src={formData.logo} className="w-full h-full object-contain p-2" alt="Logo" /> : <Upload size={20} className="text-text-tertiary" />}
                    </div>
                    <div className="flex flex-col gap-2">
                      <input type="file" id="logo-input" className="hidden" accept="image/*" onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setIsUploadingLogo(true);
                          const url = await uploadLogo(file);
                          if (url) handleUpdate({ logo: url });
                          setIsUploadingLogo(false);
                        }
                      }} />
                      <Button variant="secondary" size="sm" onClick={() => document.getElementById('logo-input')?.click()} disabled={isUploadingLogo} className="h-9 px-4 rounded-lg text-[9px] font-bold uppercase tracking-widest">Update</Button>
                    </div>
                 </div>
              </div>
              <div className="space-y-3">
                 <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Brand Color</label>
                 <div className="flex items-center gap-3 p-3 bg-bg-canvas/30 rounded-xl border border-border-polaris">
                    <input type="color" value={formData.primaryColor || '#111111'} onChange={e => handleUpdate({ primaryColor: e.target.value })} className="w-10 h-10 rounded-lg border-none cursor-pointer p-0 overflow-hidden" />
                    <span className="text-sm font-semibold tabular-nums uppercase">{formData.primaryColor || '#111111'}</span>
                 </div>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );

  const renderWebsite = () => {
    const siteUrl = getBusinessUrl(formData.subdomain || '');
    const displayUrl = siteUrl.replace(/^https?:\/\//, '');
    return (
      <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
        <div className="flex items-center gap-4">
          <button onClick={() => setActiveSection('menu')} className="p-3 -ml-2 hover:bg-bg-canvas rounded-xl text-text-tertiary transition-all active:scale-90">
            <ArrowLeft size={20} />
          </button>
          <div className="space-y-0.5">
            <h1 className="text-xl font-medium tracking-tight text-text-primary">Website</h1>
            <p className="text-[11px] text-text-tertiary font-normal">Your public store settings.</p>
          </div>
        </div>

        <div className="max-w-xl">
          <Card className="p-8 space-y-8">
            <div className="space-y-4">
              <Input label="Subdomain" value={formData.subdomain} onChange={e => handleUpdate({ subdomain: e.target.value })} className="rounded-xl font-semibold text-brand" />
              <div className="p-4 bg-bg-canvas/30 rounded-xl border border-border-polaris flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Live URL</p>
                  <p className="text-xs font-medium tabular-nums mt-1">{displayUrl}</p>
                </div>
                {formData.isPublished ? <div className="px-3 py-1 bg-success/5 border border-success/10 rounded-full text-[8px] font-bold text-success uppercase">Active</div> : <div className="px-3 py-1 bg-bg-tertiary border border-border-polaris rounded-full text-[8px] font-bold text-text-tertiary uppercase">Draft</div>}
              </div>
            </div>

            <div className="pt-6 border-t border-border-polaris space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold">Publish Status</h4>
                  <p className="text-[11px] text-text-tertiary">Visibility for your customers.</p>
                </div>
                <button onClick={() => handleUpdate({ isPublished: !formData.isPublished })} className={`w-12 h-7 rounded-full transition-all relative p-1 ${formData.isPublished ? 'bg-brand' : 'bg-bg-tertiary'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full transition-all ${formData.isPublished ? 'translate-x-5' : 'translate-x-0'} shadow-sm`} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button onClick={() => window.open(siteUrl, '_blank')} className="rounded-xl h-11 bg-brand text-white font-bold text-[9px] uppercase tracking-widest">
                  <ExternalLink size={12} className="mr-2" /> Open Site
                </Button>
                <Button variant="secondary" onClick={() => { navigator.clipboard.writeText(siteUrl); alert('Copied!'); }} className="rounded-xl h-11 border-border-polaris font-bold text-[9px] uppercase tracking-widest">
                  Copy Link
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  };

  const renderPayments = () => {
    const isConnected = business.stripeConnected && business.stripeDetailsSubmitted;
    const params = new URLSearchParams(window.location.search);
    const justReturned = params.get('return') === 'true';

    return (
      <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
        <div className="flex items-center gap-4">
          <button onClick={() => setActiveSection('menu')} className="p-3 -ml-2 hover:bg-bg-canvas rounded-xl text-text-tertiary transition-all active:scale-90">
            <ArrowLeft size={20} />
          </button>
          <div className="space-y-0.5">
            <h1 className="text-xl font-medium tracking-tight text-text-primary">Payments</h1>
            <p className="text-[11px] text-text-tertiary font-normal">Accept payments from your customers.</p>
          </div>
        </div>

        <div className="max-w-xl space-y-4">
          {justReturned && isConnected && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-success/5 border border-success/10 text-success">
              <CreditCard size={18} />
              <p className="text-sm font-medium">Stripe connected successfully! You can now accept payments.</p>
            </div>
          )}

          <Card className="p-8 space-y-8 overflow-hidden relative">
            <div className="flex items-center gap-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white ${isConnected ? 'bg-[#635BFF]' : 'bg-bg-canvas text-text-tertiary border'}`}>
                <CreditCard size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">Stripe Connect</h3>
                <div className="flex items-center gap-2">
                   {isConnected ? <span className="text-[9px] font-bold text-success uppercase tracking-widest bg-success/5 px-2 py-0.5 rounded border border-success/10">Connected</span> : <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Not Connected</span>}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-text-tertiary leading-relaxed">
              {isConnected
                ? 'Your Stripe account is connected. Customers can pay you directly when they book. A 3% platform fee applies per transaction.'
                : 'Connect your Stripe account to start accepting payments from customers. Funds go directly to your bank account.'}
            </p>

            {isConnected && (
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-bg-canvas/30 border border-border-polaris space-y-1">
                  <p className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest">Charges</p>
                  <p className={`text-sm font-semibold ${business.stripeChargesEnabled ? 'text-success' : 'text-amber-500'}`}>{business.stripeChargesEnabled ? 'Enabled' : 'Pending'}</p>
                </div>
                <div className="p-4 rounded-xl bg-bg-canvas/30 border border-border-polaris space-y-1">
                  <p className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest">Payouts</p>
                  <p className={`text-sm font-semibold ${business.stripePayouts_enabled ? 'text-success' : 'text-amber-500'}`}>{business.stripePayouts_enabled ? 'Enabled' : 'Pending'}</p>
                </div>
              </div>
            )}

            <Button onClick={async () => { setIsConnecting(true); const url = await setupStripeConnect(); if (url) window.location.href = url; setIsConnecting(false); }} disabled={isConnecting} className={`w-full h-14 rounded-xl font-bold text-[10px] uppercase tracking-widest ${isConnected ? 'bg-bg-canvas text-text-primary border border-border-polaris' : 'bg-[#635BFF] text-white'}`}>
              {isConnecting ? 'Opening...' : isConnected ? 'Open Stripe Dashboard' : 'Connect Stripe Account'}
            </Button>
          </Card>
        </div>
      </div>
    );
  };

  const BillingSection: React.FC<{ business: any, createSubscription: any, openBillingPortal: any }> = ({ business, createSubscription, openBillingPortal }) => {
    const isTrialing = business.subscriptionStatus === 'trialing';
    const isActive = business.subscriptionStatus === 'active';
    const isPastDue = business.subscriptionStatus === 'past_due';
    const isCanceled = business.subscriptionStatus === 'canceled';

    const params = new URLSearchParams(window.location.search);
    const showUpgradeSuccess = params.get('upgraded') === 'true';
    const showCanceled = params.get('canceled') === 'true';

    const [isRedirecting, setIsRedirecting] = useState(false);
    const [showPricing, setShowPricing] = useState(isTrialing || !isActive);
    const [cadence, setCadence] = useState<'monthly' | 'quarterly' | 'biannual' | 'annual'>('annual');

    const handleUpgrade = async (priceId: string | undefined) => {
      if (!priceId) {
        window.location.href = 'mailto:hello@skeduley.com?subject=Enterprise Inquiry';
        return;
      }
      setIsRedirecting(true);
      const url = await createSubscription(priceId);
      if (url) window.location.href = url;
      else setIsRedirecting(false);
    };

    const handleManageBilling = async () => {
      setIsRedirecting(true);
      const url = await openBillingPortal();
      if (url) window.location.href = url;
      else setIsRedirecting(false);
    };

    const statusLabel = isTrialing ? 'Free Trial' : isActive ? 'Active Plan' : isPastDue ? 'Past Due' : isCanceled ? 'Canceled' : 'No Plan';
    const statusColor = isActive ? 'text-success bg-success/5 border-success/10' : isPastDue ? 'text-red-500 bg-red-50 border-red-200' : isCanceled ? 'text-text-tertiary bg-bg-tertiary border-border-polaris' : 'text-brand bg-brand/5 border-brand/10';

    const plans = [
      {
        name: 'Starter',
        description: 'For solo providers just getting started',
        prices: {
          monthly: { amount: 9, id: import.meta.env.VITE_STRIPE_STARTER_MONTHLY },
          quarterly: { amount: 8, id: import.meta.env.VITE_STRIPE_STARTER_QUARTERLY },
          biannual: { amount: 7, id: import.meta.env.VITE_STRIPE_STARTER_BIANNUAL },
          annual: { amount: 6, id: import.meta.env.VITE_STRIPE_STARTER_ANNUAL },
        },
        features: [
          '1 provider profile',
          'Booking website',
          'Unlimited services',
          'Basic booking calendar',
          'Online payments (2.5% fee)',
          'Client history (50 clients)',
          'Email confirmations',
          '1 starter template'
        ]
      },
      {
        name: 'Pro',
        badge: 'MOST POPULAR',
        description: 'For growing providers ready to scale',
        prices: {
          monthly: { amount: 25, id: import.meta.env.VITE_STRIPE_PRO_MONTHLY },
          quarterly: { amount: 22, id: import.meta.env.VITE_STRIPE_PRO_QUARTERLY },
          biannual: { amount: 20, id: import.meta.env.VITE_STRIPE_PRO_BIANNUAL },
          annual: { amount: 18, id: import.meta.env.VITE_STRIPE_PRO_ANNUAL },
        },
        features: [
          'Custom domain connection',
          'Revenue & analytics',
          'Unlimited client CRM',
          'SMS & email reminders',
          'Automated reviews',
          'Waitlist & backfill',
          'AI website copy',
          '5 premium templates',
          'Reduced fee (1.5%)'
        ]
      },
      {
        name: 'Business',
        description: 'For multi-staff businesses & salons',
        prices: {
          monthly: { amount: 59, id: import.meta.env.VITE_STRIPE_BUSINESS_MONTHLY },
          quarterly: { amount: 52, id: import.meta.env.VITE_STRIPE_BUSINESS_QUARTERLY },
          biannual: { amount: 48, id: import.meta.env.VITE_STRIPE_BUSINESS_BIANNUAL },
          annual: { amount: 44, id: import.meta.env.VITE_STRIPE_BUSINESS_ANNUAL },
        },
        features: [
          'Multi-staff (up to 10)',
          'Per-staff calendars',
          'Packages & bundles',
          'Provider mobile app',
          'Advanced analytics',
          'All premium templates (10+)',
          'Zero transaction fees',
          'Priority email support'
        ]
      },
      {
        name: 'Enterprise',
        description: 'For chains, franchises & large teams',
        prices: {
          monthly: { amount: 'Custom', id: '' },
          quarterly: { amount: 'Custom', id: '' },
          biannual: { amount: 'Custom', id: '' },
          annual: { amount: 'Custom', id: '' },
        },
        features: [
          'Unlimited staff & locations',
          'Dedicated account manager',
          'Custom onboarding',
          'White-label option',
          'API access',
          'Custom reporting',
          'Phone & Slack support',
          'SLA guarantees'
        ]
      }
    ];

    return (
      <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
        <div className="flex items-center gap-4">
          <button onClick={() => setActiveSection('menu')} className="p-3 -ml-2 hover:bg-bg-canvas rounded-xl text-text-tertiary transition-all active:scale-90">
            <ArrowLeft size={20} />
          </button>
          <div className="space-y-0.5">
            <h1 className="text-xl font-medium tracking-tight text-text-primary">Billing & Plans</h1>
            <p className="text-[11px] text-text-tertiary font-normal">Manage your subscription.</p>
          </div>
        </div>

        <div className="space-y-6">
          {showUpgradeSuccess && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-success/5 border border-success/10 text-success">
              <ShieldCheck size={18} />
              <p className="text-sm font-medium">Your subscription is now active!</p>
            </div>
          )}

          {showCanceled && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-bg-canvas border border-border-polaris text-text-secondary">
              <CreditCard size={18} />
              <p className="text-sm font-medium">Checkout was canceled. You can upgrade anytime.</p>
            </div>
          )}

          {isPastDue && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600">
              <CreditCard size={18} />
              <p className="text-sm font-medium">Your last payment failed. Please update your payment method to avoid interruption.</p>
            </div>
          )}

          {!showPricing ? (
            <Card className="p-8 max-w-xl space-y-8">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full w-fit border ${statusColor}`}>
                    {statusLabel}
                  </div>
                  <h3 className="text-2xl font-bold">Your Plan</h3>
                  <p className="text-xs text-text-tertiary">
                    {isActive ? 'Your subscription is active and in good standing.' : isPastDue ? 'Update your payment to continue.' : isCanceled ? 'Your subscription has been canceled.' : 'Manage your subscription.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handleManageBilling}
                  disabled={isRedirecting}
                  className={`w-full h-12 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100 ${isPastDue ? 'bg-red-600 text-white' : 'bg-bg-canvas text-text-primary border border-border-polaris'}`}
                >
                  {isRedirecting ? 'Redirecting...' : isPastDue ? 'Update Payment Method' : 'Manage Billing'}
                </Button>
                <Button
                  onClick={() => setShowPricing(true)}
                  className="w-full h-12 rounded-xl bg-text-primary text-white font-bold text-[10px] uppercase tracking-widest transition-all hover:scale-[1.02]"
                >
                  Change Plan
                </Button>
              </div>
            </Card>
          ) : (
            <div className="space-y-12">
              <div className="text-center max-w-2xl mx-auto space-y-4">
                <h2 className="text-3xl font-bold tracking-tight">Choose the right plan for your business</h2>
                <p className="text-text-secondary text-sm">Cancel anytime. All plans include a 14-day free trial.</p>
              </div>

              <div className="flex flex-col items-center gap-4 mb-12">
                <div className="bg-bg-canvas p-1 rounded-full flex items-center shadow-inner">
                  <button onClick={() => setCadence('monthly')} className={`px-6 py-2.5 rounded-full text-[13px] font-semibold transition-all ${cadence === 'monthly' ? 'bg-white shadow-sm text-text-primary' : 'text-text-tertiary hover:text-text-primary'}`}>Monthly</button>
                  <button onClick={() => setCadence('annual')} className={`px-6 py-2.5 rounded-full text-[13px] font-semibold transition-all ${cadence === 'annual' ? 'bg-white shadow-sm text-text-primary' : 'text-text-tertiary hover:text-text-primary flex items-center gap-2'}`}>
                    Annual <span className="text-[10px] text-success bg-success/10 px-2 py-0.5 rounded-full leading-none">Save ~30%</span>
                  </button>
                </div>
                
                <div className="relative group">
                  <select 
                    value={['monthly', 'annual'].includes(cadence) ? '' : cadence}
                    onChange={(e) => setCadence(e.target.value as any)}
                    className="appearance-none bg-transparent border-none text-[12px] font-medium text-brand hover:underline cursor-pointer focus:ring-0 outline-none pl-2 pr-6 py-1"
                  >
                    <option value="" disabled>Or select another billing cycle...</option>
                    <option value="quarterly">Quarterly (Save ~12%)</option>
                    <option value="biannual">Bi-Annual (Save ~20%)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-brand">
                    <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 relative z-10">
                {plans.map((plan) => {
                  const priceInfo = plan.prices[cadence];
                  const isEnterprise = plan.name === 'Enterprise';
                  const isPopular = plan.name === 'Pro';
                  
                  return (
                    <div key={plan.name} className={`relative flex flex-col p-8 rounded-3xl transition-all duration-300 ${isPopular ? 'bg-brand text-white shadow-2xl scale-[1.02] xl:scale-105 z-20' : 'bg-white border border-border-polaris shadow-lg hover:shadow-xl'}`}>
                      {isPopular && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[9px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                          <Sparkles size={12} /> MOST POPULAR
                        </div>
                      )}
                      
                      <div className="space-y-4 mb-8">
                        <h3 className={`text-xl font-bold ${isPopular ? 'text-white' : 'text-text-primary'}`}>{plan.name}</h3>
                        <p className={`text-xs min-h-[40px] leading-relaxed ${isPopular ? 'text-white/80' : 'text-text-secondary'}`}>{plan.description}</p>
                        <div className="flex items-end gap-1">
                          {isEnterprise ? (
                            <span className={`text-4xl font-black ${isPopular ? 'text-white' : 'text-text-primary'}`}>Custom</span>
                          ) : (
                            <>
                              <span className={`text-4xl font-black ${isPopular ? 'text-white' : 'text-text-primary'}`}>${priceInfo.amount}</span>
                              <span className={`text-sm font-medium pb-1 ${isPopular ? 'text-white/70' : 'text-text-tertiary'}`}>/mo</span>
                            </>
                          )}
                        </div>
                        {!isEnterprise && (
                          <p className={`text-[10px] font-medium uppercase tracking-widest ${isPopular ? 'text-white/60' : 'text-text-tertiary'}`}>Billed {cadence}</p>
                        )}
                      </div>

                      <div className="flex-1 space-y-4 mb-8">
                        {plan.features.map((feature, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <div className={`mt-0.5 rounded-full p-0.5 flex-shrink-0 ${isPopular ? 'bg-white/20 text-white' : 'bg-brand/10 text-brand'}`}>
                              <Check size={12} strokeWidth={3} />
                            </div>
                            <span className={`text-sm ${isPopular ? 'text-white/90' : 'text-text-secondary'}`}>{feature}</span>
                          </div>
                        ))}
                      </div>

                      <Button
                        onClick={() => handleUpgrade(priceInfo.id)}
                        disabled={isRedirecting}
                        className={`w-full h-12 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all ${
                          isPopular 
                            ? 'bg-white text-brand hover:bg-gray-50' 
                            : 'bg-black text-white hover:bg-black/90'
                        }`}
                      >
                        {isRedirecting ? 'Processing...' : isEnterprise ? 'Contact Us' : 'Choose Plan'}
                      </Button>
                    </div>
                  );
                })}
              </div>
              
              {isActive && (
                <div className="text-center mt-12">
                   <button onClick={() => setShowPricing(false)} className="text-xs text-text-tertiary hover:text-text-primary underline underline-offset-4">Back to Billing Management</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const SecuritySection: React.FC<{ updatePassword: any }> = ({ updatePassword }) => {
    const [passwords, setPasswords] = useState({ next: '', confirm: '' });
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

    return (
      <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
        <div className="flex items-center gap-4">
          <button onClick={() => setActiveSection('menu')} className="p-3 -ml-2 hover:bg-bg-canvas rounded-xl text-text-tertiary transition-all active:scale-90">
            <ArrowLeft size={20} />
          </button>
          <div className="space-y-0.5">
            <h1 className="text-xl font-medium tracking-tight text-text-primary">Security</h1>
            <p className="text-[11px] text-text-tertiary font-normal">Account protection settings.</p>
          </div>
        </div>

        <div className="max-w-xl">
          <Card className="p-8 space-y-8">
            <div className="space-y-4">
              <Input label="New Password" type="password" value={passwords.next} onChange={e => setPasswords(p => ({ ...p, next: e.target.value }))} className="rounded-xl" />
              <Input label="Confirm New Password" type="password" value={passwords.confirm} onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))} className="rounded-xl" />
            </div>
            <Button 
              onClick={async () => {
                if (passwords.next.length < 6) return alert('Min 6 characters');
                setIsUpdatingPassword(true);
                const { error } = await updatePassword(passwords.next);
                setIsUpdatingPassword(false);
                if (error) alert(error.message);
                else { alert('Success!'); setPasswords({ next: '', confirm: '' }); }
              }}
              disabled={isUpdatingPassword || !passwords.next || passwords.next !== passwords.confirm}
              className="w-full h-14 rounded-xl bg-text-primary text-white font-bold text-[10px] uppercase tracking-widest"
            >
              {isUpdatingPassword ? 'Updating...' : 'Update Password'}
            </Button>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-none pb-24 lg:pb-0 min-h-[600px]">
      <AnimatePresence mode="wait">
        {activeSection === 'menu' && <motion.div key="menu" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>{renderMenu()}</motion.div>}
        {activeSection === 'profile' && <motion.div key="profile" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>{renderProfile()}</motion.div>}
        {activeSection === 'website' && <motion.div key="website" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>{renderWebsite()}</motion.div>}
        {activeSection === 'payments' && <motion.div key="payments" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>{renderPayments()}</motion.div>}
        {activeSection === 'billing' && <motion.div key="billing" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}><BillingSection business={business} createSubscription={createSubscription} openBillingPortal={openBillingPortal} /></motion.div>}
        {activeSection === 'security' && <motion.div key="security" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}><SecuritySection updatePassword={updatePassword} /></motion.div>}
      </AnimatePresence>
    </div>
  );
};
