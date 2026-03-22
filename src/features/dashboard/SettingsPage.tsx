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
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  Upload,
  ExternalLink,
  XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type SettingsSection = 'menu' | 'profile' | 'website' | 'payments' | 'billing' | 'team' | 'security';

export const SettingsPage: React.FC = () => {
  const { business, updateBusiness, user, setupStripeConnect, refreshStripeStatus, createSubscription } = useAppStore();
  const [activeSection, setActiveSection] = useState<SettingsSection>('menu');
  const [formData, setFormData] = useState({ ...business });
  const [isConnecting, setIsConnecting] = useState(false);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('return') === 'true' || params.get('refresh') === 'true') {
      refreshStripeStatus();
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname + (activeSection !== 'menu' ? `?section=${activeSection}` : ''));
    }
  }, [refreshStripeStatus, activeSection]);

  if (!business) return null;

  const handleUpdate = (updates: Partial<NonNullable<typeof business>>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    updateBusiness(updates);
  };

  const navItems = [
    { 
      id: 'profile' as const, 
      title: 'Profile', 
      description: 'Manage your personal and business details', 
      icon: <User size={18} /> 
    },
    { 
      id: 'website' as const, 
      title: 'Website', 
      description: 'Configure your domain, slug and site status', 
      icon: <Globe size={18} /> 
    },
    { 
      id: 'payments' as const, 
      title: 'Payments', 
      description: 'Connect Stripe and manage transaction settings', 
      icon: <CreditCard size={18} /> 
    },
    { 
      id: 'billing' as const, 
      title: 'Billing & Subscription', 
      description: 'Manage your plan and view billing history', 
      icon: <ShieldCheck size={18} /> 
    },
    { 
      id: 'team' as const, 
      title: 'Team', 
      description: 'Invite members and manage permissions', 
      icon: <Users size={18} />,
      isPlaceholder: true
    },
    { 
      id: 'security' as const, 
      title: 'Password & Security', 
      description: 'Secure your account and update password', 
      icon: <ShieldCheck size={18} /> 
    }
  ];

  const renderMenu = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-1">
        <h1 className="text-2xl font-medium tracking-tight text-text-primary">Settings</h1>
        <p className="text-[11px] text-text-tertiary font-normal">Manage your business and platform configuration.</p>
      </div>

      <div className="space-y-3">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => !item.isPlaceholder && setActiveSection(item.id)}
            className={`w-full text-left p-6 rounded-lg bg-white border border-border-polaris hover:bg-bg-canvas/30 transition-all flex items-center justify-between group ${item.isPlaceholder ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-bg-canvas flex items-center justify-center text-text-tertiary group-hover:bg-brand group-hover:text-white transition-colors">
                {item.icon}
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-medium text-text-primary">{item.title}</h3>
                <p className="text-[11px] text-text-tertiary font-normal">{item.description}</p>
              </div>
            </div>
            {!item.isPlaceholder && (
              <ChevronRight size={16} className="text-text-tertiary group-hover:text-brand group-hover:translate-x-1 transition-all" />
            )}
            {item.isPlaceholder && (
              <span className="text-[8px] font-normal uppercase tracking-widest bg-bg-tertiary px-2 py-0.5 rounded-full text-text-tertiary">Soon</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setActiveSection('menu')}
          className="p-2 hover:bg-bg-canvas rounded-lg text-text-tertiary transition-all"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="space-y-0.5">
          <h1 className="text-xl font-medium tracking-tight text-text-primary">Profile</h1>
          <p className="text-[11px] text-text-tertiary font-normal max-w-xs">Manage your business identity and contact info.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card className="space-y-8 border-border-polaris bg-white">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input 
                label="Business Name"
                value={formData.name} 
                onChange={e => handleUpdate({ name: e.target.value })}
                className="rounded-lg border-border-polaris bg-bg-canvas/20 text-sm"
              />
              <div className="space-y-1">
                <Input 
                  label="Email Address"
                  type="email"
                  value={user?.email || formData.email} 
                  readOnly
                  className="rounded-lg border-border-polaris bg-bg-canvas/10 text-sm opacity-70 cursor-not-allowed"
                />
                <p className="text-[9px] text-text-tertiary font-normal ml-1 border-none">Managed by account</p>
              </div>
              <Input 
                label="Phone Number"
                type="tel"
                value={formData.phone} 
                onChange={e => handleUpdate({ phone: e.target.value })}
                className="rounded-lg border-border-polaris bg-bg-canvas/20 text-sm"
              />
            </div>
            
            <div className="pt-4 flex justify-end">
               <Button size="sm" className="rounded-lg font-semibold px-8 h-11 bg-brand text-white shadow-none text-[10px] uppercase tracking-widest">Save Changes</Button>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
           <Card className="border-border-polaris space-y-8 bg-white">
              <div className="space-y-3">
                 <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest ml-1">Business Logo</label>
                 <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-bg-canvas flex items-center justify-center border border-border-polaris relative group overflow-hidden p-2">
                       {formData.logo ? (
                         <img src={formData.logo} className="w-full h-full object-contain" alt="Logo" />
                       ) : (
                         <Upload size={14} className="text-text-tertiary" />
                       )}
                    </div>
                    <Button variant="secondary" size="sm" className="rounded-lg font-bold h-9 text-[9px] uppercase tracking-widest border-border-polaris">Update</Button>
                 </div>
              </div>
              <div className="space-y-3">
                 <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest ml-1">Primary Color</label>
                 <div className="flex items-center gap-4 p-3 bg-bg-canvas/20 rounded-lg border border-border-polaris">
                    <input 
                       type="color" 
                       value={formData.primaryColor || '#111111'} 
                       onChange={e => handleUpdate({ primaryColor: e.target.value })}
                       className="w-8 h-8 rounded-lg border-none cursor-pointer p-0 overflow-hidden shadow-none"
                    />
                    <span className="text-xs font-semibold tabular-nums uppercase text-text-primary tracking-tight">{(formData.primaryColor || '#111111')}</span>
                 </div>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );

  const renderWebsite = () => (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setActiveSection('menu')}
          className="p-2 hover:bg-bg-secondary rounded-xl text-text-tertiary transition-all"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="space-y-0.5">
          <h1 className="text-xl font-medium tracking-tight text-text-primary">Website</h1>
          <p className="text-[11px] text-text-tertiary font-normal max-w-xs">Domain and storefront configuration.</p>
        </div>
      </div>

      <div className="max-w-2xl space-y-6">
        <Card className="space-y-8 border-border-polaris bg-white">
          <div className="space-y-4">
            <Input 
              label="Subdomain"
              value={formData.subdomain}
              onChange={e => handleUpdate({ subdomain: e.target.value })}
              className="rounded-lg border-border-polaris bg-bg-canvas/20 pr-24 font-semibold"
            />
            <div className="flex items-center justify-between p-4 bg-bg-canvas/30 rounded-lg border border-border-polaris/40">
               <div>
                  <h4 className="text-xs font-bold text-text-primary uppercase tracking-tight">URL Status</h4>
                  <p className="text-[10px] text-text-tertiary font-normal">Active on {formData.subdomain}.bookflow.ca</p>
               </div>
               <button className="text-brand hover:underline text-[9px] uppercase tracking-[0.2em] font-bold">Verify</button>
            </div>
          </div>

          <div className="pt-6 border-t border-border-light/30 space-y-6">
             <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                   <h4 className="text-sm font-medium text-text-primary tracking-tight">Public Publication</h4>
                   <p className="text-[11px] text-text-tertiary font-normal">Control your website visibility.</p>
                </div>
                <button 
                  onClick={() => handleUpdate({ isPublished: !formData.isPublished })}
                  className={`w-11 h-6.5 rounded-full transition-all duration-300 relative flex items-center px-1 cursor-pointer ${formData.isPublished ? 'bg-brand shadow-lg shadow-brand/20' : 'bg-bg-tertiary'}`}
                >
                   <div className={`w-4.5 h-4.5 rounded-full bg-white shadow-sm transition-all duration-300 ${formData.isPublished ? 'translate-x-4.5' : 'translate-x-0'}`} />
                </button>
             </div>

             <div className="flex gap-4">
                <Button 
                  size="sm" 
                  className="flex-1 h-11 rounded-lg bg-brand text-white font-bold text-[10px] uppercase tracking-widest shadow-none"
                  onClick={() => window.open(`/p/${formData.subdomain}`, '_blank')}
                >
                   <ExternalLink size={12} className="mr-2" /> View Site
                </Button>
                <Button 
                  variant="secondary"
                  size="sm" 
                  className="flex-1 h-11 rounded-lg font-bold text-[10px] uppercase tracking-widest border-border-polaris border"
                >
                   Copy URL
                </Button>
             </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const handleConnectStripe = async () => {
    setIsConnecting(true);
    try {
      const url = await setupStripeConnect();
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      console.error('Stripe connect error:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const renderPayments = () => {
    const isConnected = business.stripeConnected && business.stripeDetailsSubmitted;
    const isPending = business.stripeAccountId && !business.stripeDetailsSubmitted;
    
    return (
      <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveSection('menu')}
            className="p-2 hover:bg-bg-secondary rounded-xl text-text-tertiary transition-all"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="space-y-0.5">
            <h1 className="text-xl font-medium tracking-tight text-text-primary">Payments</h1>
            <p className="text-[11px] text-text-tertiary font-normal max-w-xs">Payouts and transaction fees.</p>
          </div>
        </div>

        <div className="max-w-2xl space-y-6">
          <Card className="p-0 overflow-hidden border-border-polaris shadow-none bg-white">
             <div className="p-10 flex flex-col sm:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                   <div className={`w-14 h-14 rounded-lg flex items-center justify-center text-white shadow-none ${isConnected ? 'bg-[#635BFF]' : 'bg-bg-canvas text-text-tertiary border border-border-polaris'}`}>
                      <CreditCard size={24} />
                   </div>
                   <div className="space-y-1">
                      <h3 className="text-lg font-medium text-text-primary">Stripe</h3>
                      <p className="text-[11px] text-text-tertiary font-normal max-w-[240px] leading-tight opacity-70">Payouts sent directly to your bank.</p>
                      <div className="flex items-center gap-2 pt-1">
                         {isConnected ? (
                           <span className="text-[8px] font-bold text-success uppercase tracking-[0.2em] flex items-center gap-1.5 px-3 py-1 bg-success/5 rounded-full border border-success/10">
                              <CheckCircle2 size={10} /> Connected
                           </span>
                         ) : isPending ? (
                           <span className="text-[8px] font-bold text-amber-500 uppercase tracking-[0.2em] flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-full border border-amber-200">
                              <CheckCircle2 size={10} /> Pending
                           </span>
                         ) : (
                           <span className="text-[8px] font-bold text-text-tertiary uppercase tracking-[0.2em] flex items-center gap-1.5 px-3 py-1 bg-bg-canvas rounded-full border border-border-polaris">
                              <XCircle size={10} /> Disconnected
                           </span>
                         )}
                      </div>
                   </div>
                </div>
                <Button 
                  onClick={handleConnectStripe}
                  disabled={isConnecting}
                  className={`h-11 px-8 rounded-lg font-bold text-[10px] uppercase tracking-widest shadow-none ${isConnected ? 'bg-bg-canvas text-text-primary hover:bg-bg-canvas/80 border-border-polaris border' : 'bg-[#635BFF] text-white'}`}
                >
                   {isConnecting ? 'Opening...' : isConnected ? 'Dashboard' : isPending ? 'Resume' : 'Connect'}
                </Button>
             </div>
             {!isConnected && (
               <div className="px-10 py-4 bg-emerald-50/30 border-t border-border-polaris">
                  <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest flex items-center gap-2">
                     <ShieldCheck size={14} /> Secure PCI-Compliant Payouts
                  </p>
               </div>
             )}
          </Card>
        </div>
      </div>
    );
  };

  const renderBilling = () => {
    const isTrialing = business.subscriptionStatus === 'trialing';
    const trialEndDate = business.trialEndDate ? new Date(business.trialEndDate) : null;
    const isActive = business.subscriptionStatus === 'active';
    
    const trialDaysLeft = trialEndDate 
      ? Math.max(0, Math.ceil((trialEndDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
      : 0;

    const handleUpgrade = async () => {
      const url = await createSubscription();
      if (url) window.location.href = url;
    };

    return (
      <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveSection('menu')}
            className="p-2 hover:bg-bg-secondary rounded-xl text-text-tertiary transition-all"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="space-y-0.5">
            <h1 className="text-xl font-medium tracking-tight text-text-primary">Billing</h1>
            <p className="text-[11px] text-text-tertiary font-normal max-w-xs">Manage your subscription and invoices.</p>
          </div>
        </div>

        <div className="max-w-2xl space-y-6">
          <Card className="space-y-10 border-border-polaris bg-white">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-brand uppercase tracking-widest bg-brand/5 px-3 py-1 rounded-full border border-brand/10">
                  {isTrialing ? 'Free Trial' : isActive ? 'Pro Plan' : 'No Active Plan'}
                </span>
                <h3 className="text-2xl font-semibold text-text-primary tracking-tight">
                  {isActive ? 'GetBukd Pro' : isTrialing ? '14-Day Free Trial' : 'Upgrade required'}
                </h3>
                <p className="text-xs text-text-tertiary leading-relaxed font-normal">
                  {isActive 
                    ? 'Full access to all platform power features.' 
                    : isTrialing 
                    ? `Your trial expires in ${trialDaysLeft} days.` 
                    : 'Unlock the future of booking.'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-text-primary">$19<span className="text-sm font-medium text-text-tertiary">/mo</span></p>
                <p className="text-[9px] text-text-tertiary font-bold uppercase tracking-widest mt-1">Billed monthly</p>
              </div>
            </div>
 
            <div className="space-y-4 pt-4 border-t border-border-polaris">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                {[
                  'Custom domain support',
                  'Unlimited bookings',
                  'Zero platform fees',
                  'Advanced analytics',
                  'All website templates',
                  'Priority support'
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-[10px] font-medium text-text-secondary uppercase tracking-wide">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
 
            <div className="pt-8">
              <Button 
                onClick={handleUpgrade}
                disabled={isActive && !isTrialing}
                className="w-full h-14 rounded-lg bg-text-primary text-white font-bold text-[11px] uppercase tracking-widest shadow-none hover:bg-black transition-all disabled:opacity-50"
              >
                {isActive ? 'Manage Subscription' : isTrialing ? 'Go Pro Today' : 'Start Subscription'}
              </Button>
            </div>
          </Card>

          {isActive && (
            <Card className="border-border-polaris bg-bg-canvas/20 border-dashed">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-text-tertiary border border-border-polaris">
                        <CreditCard size={18} />
                     </div>
                     <div>
                        <h4 className="text-xs font-bold text-text-primary uppercase">Payment Method</h4>
                        <p className="text-[10px] text-text-tertiary font-normal">Managed via Stripe Secure Portal</p>
                     </div>
                  </div>
                  <button onClick={handleUpgrade} className="text-[9px] font-bold text-brand uppercase tracking-widest hover:underline px-4 py-2 bg-brand/5 rounded-lg border border-brand/10">Manage</button>
               </div>
            </Card>
          )}
        </div>
      </div>
    );
  };

  const renderSecurity = () => (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setActiveSection('menu')}
          className="p-2 hover:bg-bg-secondary rounded-xl text-text-tertiary transition-all"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="space-y-0.5">
          <h1 className="text-xl font-medium tracking-tight text-text-primary">Password & Security</h1>
          <p className="text-[11px] text-text-tertiary font-normal max-w-xs">Secure your account and authentication methods.</p>
        </div>
      </div>

      <div className="max-w-xl space-y-6">
        <Card className="space-y-8 border-border-polaris bg-white">
          <div className="space-y-4">
             <Input label="Current Password" type="password" className="rounded-lg border-border-polaris bg-bg-canvas/20" />
             <Input label="New Password" type="password" className="rounded-lg border-border-polaris bg-bg-canvas/20" />
             <Input label="Confirm New Password" type="password" className="rounded-lg border-border-polaris bg-bg-canvas/20" />
          </div>
          <div className="pt-2 flex flex-col gap-3">
             <Button className="w-full h-11 bg-text-primary text-white rounded-lg font-bold text-[10px] uppercase tracking-widest shadow-none">Update Password</Button>
             <p className="text-[10px] text-text-tertiary text-center font-normal px-4">Updating your password will sign you out from all other active sessions.</p>
          </div>
        </Card>
 
        <Card className="rounded-lg bg-red-50/30 border-red-100 flex items-center justify-between">
           <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-red-600 flex items-center gap-2 uppercase tracking-tight">
                 Two-Factor Authentication
              </h4>
              <p className="text-[10px] text-red-600/60 font-normal">Add extra security to your login.</p>
           </div>
           <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 rounded-lg text-[10px] uppercase tracking-widest font-bold border border-red-100">Enable</Button>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="max-w-none pb-24 lg:pb-0 min-h-[600px]">
      <AnimatePresence mode="wait">
        {activeSection === 'menu' && (
          <motion.div key="menu" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
            {renderMenu()}
          </motion.div>
        )}
        {activeSection === 'profile' && (
          <motion.div key="profile" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
            {renderProfile()}
          </motion.div>
        )}
        {activeSection === 'website' && (
          <motion.div key="website" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
            {renderWebsite()}
          </motion.div>
        )}
        {activeSection === 'payments' && (
          <motion.div key="payments" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
            {renderPayments()}
          </motion.div>
        )}
        {activeSection === 'billing' && (
          <motion.div key="billing" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
            {renderBilling()}
          </motion.div>
        )}
         {activeSection === 'security' && (
          <motion.div key="security" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
            {renderSecurity()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
