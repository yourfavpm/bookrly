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
  Camera,
  Upload,
  ExternalLink,
  ChevronDown,
  XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type SettingsSection = 'menu' | 'profile' | 'website' | 'payments' | 'team' | 'security';

export const SettingsPage: React.FC = () => {
  const { business, updateBusiness, user } = useAppStore();
  const [activeSection, setActiveSection] = useState<SettingsSection>('menu');
  const [formData, setFormData] = useState({ ...business });

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
      <div className="space-y-1 px-1">
        <h1 className="text-2xl font-medium tracking-tight text-text-primary">Settings</h1>
        <p className="text-xs text-text-secondary font-normal">Manage your business and platform configuration.</p>
      </div>

      <div className="space-y-3">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => !item.isPlaceholder && setActiveSection(item.id)}
            className={`w-full text-left p-5 rounded-[24px] bg-white border border-border-light/50 shadow-sm hover:shadow-md hover:border-brand/10 transition-all flex items-center justify-between group active:scale-[0.98] ${item.isPlaceholder ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-bg-secondary flex items-center justify-center text-text-tertiary group-hover:bg-brand/5 group-hover:text-brand transition-colors">
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
          className="p-2 hover:bg-bg-secondary rounded-xl text-text-tertiary transition-all"
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
          <Card className="p-6 lg:p-8 space-y-6 rounded-[32px] border-border-light/50">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input 
                label="Business Name"
                value={formData.name} 
                onChange={e => handleUpdate({ name: e.target.value })}
                className="rounded-xl border-border-light/50 bg-bg-secondary/20 text-sm"
              />
              <div className="space-y-1">
                <Input 
                  label="Email Address"
                  type="email"
                  value={user?.email || formData.email} 
                  readOnly
                  className="rounded-xl border-border-light/50 bg-bg-secondary/10 text-sm opacity-70 cursor-not-allowed"
                />
                <p className="text-[9px] text-text-tertiary font-normal ml-1 border-none">Managed by account</p>
              </div>
              <Input 
                label="Phone Number"
                type="tel"
                value={formData.phone} 
                onChange={e => handleUpdate({ phone: e.target.value })}
                className="rounded-xl border-border-light/50 bg-bg-secondary/20 text-sm"
              />
            </div>
            
            <div className="pt-4 flex justify-end">
               <Button size="sm" className="rounded-xl font-medium px-6 h-11 bg-brand text-white shadow-lg shadow-brand/10">Save Changes</Button>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
           <Card className="p-6 rounded-[32px] border-border-light/50 space-y-6">
              <div className="space-y-3">
                 <label className="text-[10px] font-normal text-text-tertiary uppercase tracking-widest ml-1">Business Logo</label>
                 <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-bg-secondary/50 flex items-center justify-center border border-dashed border-border-light relative group overflow-hidden">
                       {formData.logo ? (
                         <img src={formData.logo} className="w-full h-full object-cover p-2" alt="Logo" />
                       ) : (
                         <Upload size={14} className="text-text-tertiary" />
                       )}
                    </div>
                    <Button variant="secondary" size="sm" className="rounded-xl font-medium h-9 text-[10px] uppercase tracking-widest">Update</Button>
                 </div>
              </div>
              <div className="space-y-3">
                 <label className="text-[10px] font-normal text-text-tertiary uppercase tracking-widest ml-1">Primary Color</label>
                 <div className="flex items-center gap-4 p-3 bg-bg-secondary/20 rounded-2xl border border-border-light/40">
                    <input 
                       type="color" 
                       value={formData.primaryColor || '#6b21a8'} 
                       onChange={e => handleUpdate({ primaryColor: e.target.value })}
                       className="w-8 h-8 rounded-lg border-none cursor-pointer p-0 overflow-hidden shadow-sm"
                    />
                    <span className="text-xs font-medium tabular-nums uppercase text-text-primary tracking-tight">{(formData.primaryColor || '#6b21a8')}</span>
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
        <Card className="p-8 rounded-[32px] border-border-light/50 space-y-8">
          <div className="space-y-4">
            <Input 
              label="Subdomain"
              value={formData.subdomain}
              onChange={e => handleUpdate({ subdomain: e.target.value })}
              className="rounded-xl border-border-light/50 bg-bg-secondary/20 pr-24 font-medium"
            />
            <div className="flex items-center justify-between p-4 bg-bg-secondary/30 rounded-2xl border border-border-light/30">
               <div>
                  <h4 className="text-xs font-medium text-text-primary">URL Status</h4>
                  <p className="text-[10px] text-text-tertiary font-normal">Your site is currently active on {formData.subdomain}.bookflow.ca</p>
               </div>
               <button className="text-brand hover:underline text-[10px] uppercase tracking-widest font-medium">Verify</button>
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
                  className="flex-1 h-11 rounded-xl bg-brand text-white font-medium text-[11px] uppercase tracking-widest"
                  onClick={() => window.open(`/p/${formData.subdomain}`, '_blank')}
                >
                   <ExternalLink size={12} className="mr-2" /> View Live Site
                </Button>
                <Button 
                  variant="secondary"
                  size="sm" 
                  className="flex-1 h-11 rounded-xl font-medium text-[11px] uppercase tracking-widest"
                >
                   Copy URL
                </Button>
             </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderPayments = () => (
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
        <Card className="p-0 overflow-hidden border-border-light/50 rounded-[32px] shadow-sm">
           <div className="p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                 <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${formData.stripeConnected ? 'bg-[#635BFF]' : 'bg-bg-secondary text-text-tertiary shadow-none border border-border-light/30'}`}>
                    <CreditCard size={24} />
                 </div>
                 <div className="space-y-1">
                    <h3 className="text-lg font-medium text-text-primary">Stripe</h3>
                    <p className="text-[11px] text-text-tertiary font-normal max-w-[240px] leading-tight opacity-70">Payouts are sent directly to your bank account.</p>
                    <div className="flex items-center gap-2 pt-1">
                       {formData.stripeConnected ? (
                         <span className="text-[8px] font-normal text-success uppercase tracking-[0.2em] flex items-center gap-1.5 px-2.5 py-1 bg-success/5 rounded-full border border-success/10">
                            <CheckCircle2 size={10} /> Account Connected
                         </span>
                       ) : (
                         <span className="text-[8px] font-normal text-text-tertiary uppercase tracking-[0.2em] flex items-center gap-1.5 px-2.5 py-1 bg-bg-secondary rounded-full border border-border-light/50">
                            <XCircle size={10} /> Link Account
                         </span>
                       )}
                    </div>
                 </div>
              </div>
              <Button 
                onClick={() => handleUpdate({ stripeConnected: !formData.stripeConnected })}
                className={`h-11 px-8 rounded-xl font-medium text-[11px] uppercase tracking-widest ${formData.stripeConnected ? 'bg-bg-secondary text-text-primary hover:bg-bg-tertiary border-border-light/50' : 'bg-[#635BFF] text-white shadow-lg shadow-[#635bff20]'}`}
              >
                 {formData.stripeConnected ? 'Configure' : 'Connect'}
              </Button>
           </div>
           {!formData.stripeConnected && (
             <div className="px-8 py-3 bg-brand/5 border-t border-border-light/20">
                <p className="text-[9px] font-normal text-brand uppercase tracking-widest flex items-center gap-2">
                   <ShieldCheck size={12} /> Secure PCI-Compliant Payouts
                </p>
             </div>
           )}
        </Card>
      </div>
    </div>
  );

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
        <Card className="p-8 rounded-[32px] border-border-light/50 space-y-6">
          <div className="space-y-4">
             <Input label="Current Password" type="password" className="rounded-xl border-border-light/50 bg-bg-secondary/20" />
             <Input label="New Password" type="password" className="rounded-xl border-border-light/50 bg-bg-secondary/20" />
             <Input label="Confirm New Password" type="password" className="rounded-xl border-border-light/50 bg-bg-secondary/20" />
          </div>
          <div className="pt-2 flex flex-col gap-3">
             <Button className="w-full h-11 bg-brand text-white rounded-xl font-medium text-[11px] uppercase tracking-widest">Update Password</Button>
             <p className="text-[10px] text-text-tertiary text-center font-normal px-4">Updating your password will sign you out from all other active sessions.</p>
          </div>
        </Card>

        <Card className="p-6 rounded-[32px] border-border-light/50 bg-error/5 border-error/10 flex items-center justify-between">
           <div className="space-y-0.5">
              <h4 className="text-xs font-medium text-error flex items-center gap-2">
                 Two-Factor Authentication
              </h4>
              <p className="text-[10px] text-error/60 font-normal">Add extra security to your login.</p>
           </div>
           <Button variant="ghost" size="sm" className="text-error hover:bg-error/5 rounded-xl text-[10px] uppercase tracking-widest font-medium">Enable</Button>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto pb-24 lg:pb-0 min-h-[600px]">
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
         {activeSection === 'security' && (
          <motion.div key="security" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
            {renderSecurity()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
