import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { calculateDaysRemaining } from '../../lib/dateUtils';
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
  ExternalLink
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
    const trialEndDate = business.trialEndDate ? new Date(business.trialEndDate) : null;
    const isActive = business.subscriptionStatus === 'active';
    const isPastDue = business.subscriptionStatus === 'past_due';
    const isCanceled = business.subscriptionStatus === 'canceled';
    const trialDaysLeft = calculateDaysRemaining(trialEndDate);

    const params = new URLSearchParams(window.location.search);
    const showUpgradeSuccess = params.get('upgraded') === 'true';
    const showCanceled = params.get('canceled') === 'true';

    const [isRedirecting, setIsRedirecting] = useState(false);

    const handleUpgrade = async () => {
      setIsRedirecting(true);
      const url = await createSubscription();
      if (url) window.location.href = url;
      else setIsRedirecting(false);
    };

    const handleManageBilling = async () => {
      setIsRedirecting(true);
      const url = await openBillingPortal();
      if (url) window.location.href = url;
      else setIsRedirecting(false);
    };

    const statusLabel = isTrialing ? 'Free Trial' : isActive ? 'Pro Plan' : isPastDue ? 'Past Due' : isCanceled ? 'Canceled' : 'No Plan';
    const statusColor = isActive ? 'text-success bg-success/5 border-success/10' : isPastDue ? 'text-red-500 bg-red-50 border-red-200' : isCanceled ? 'text-text-tertiary bg-bg-tertiary border-border-polaris' : 'text-brand bg-brand/5 border-brand/10';

    return (
      <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
        <div className="flex items-center gap-4">
          <button onClick={() => setActiveSection('menu')} className="p-3 -ml-2 hover:bg-bg-canvas rounded-xl text-text-tertiary transition-all active:scale-90">
            <ArrowLeft size={20} />
          </button>
          <div className="space-y-0.5">
            <h1 className="text-xl font-medium tracking-tight text-text-primary">Billing</h1>
            <p className="text-[11px] text-text-tertiary font-normal">Your plan and invoices.</p>
          </div>
        </div>

        <div className="max-w-xl space-y-4">
          {showUpgradeSuccess && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-success/5 border border-success/10 text-success">
              <ShieldCheck size={18} />
              <p className="text-sm font-medium">You're on Pro! Your subscription is now active.</p>
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

          <Card className="p-8 space-y-8">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full w-fit border ${statusColor}`}>
                  {statusLabel}
                </div>
                <h3 className="text-2xl font-bold">Skeduley Pro</h3>
                <p className="text-xs text-text-tertiary">
                  {isTrialing ? `Your trial expires in ${trialDaysLeft} days.` : isActive ? 'Full power for your business.' : isPastDue ? 'Update your payment to continue.' : isCanceled ? 'Your subscription has been canceled.' : 'Subscribe to unlock all features.'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">$10<span className="text-sm font-medium text-text-tertiary">/mo</span></p>
              </div>
            </div>

            {(isTrialing || isCanceled || (!isActive && !isPastDue)) && (
              <Button
                onClick={handleUpgrade}
                disabled={isRedirecting}
                className="w-full h-14 rounded-xl bg-black text-white font-bold text-[10px] uppercase tracking-widest transition-all hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
              >
                {isRedirecting ? 'Redirecting...' : isCanceled ? 'Resubscribe' : 'Upgrade Now'}
              </Button>
            )}

            {(isActive || isPastDue) && (
              <Button
                onClick={handleManageBilling}
                disabled={isRedirecting}
                className={`w-full h-14 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100 ${isPastDue ? 'bg-red-600 text-white' : 'bg-bg-canvas text-text-primary border border-border-polaris'}`}
              >
                {isRedirecting ? 'Redirecting...' : isPastDue ? 'Update Payment Method' : 'Manage Billing'}
              </Button>
            )}
          </Card>
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
