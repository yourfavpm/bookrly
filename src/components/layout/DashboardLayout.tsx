import { LayoutDashboard, Globe, Scissors, Calendar, BarChart3, Settings, ExternalLink, Plus, Palette, Clock, ShieldCheck, Image, MessageSquare, LogOut } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Link, Navigate, useLocation, Outlet } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { InstallAppPrompt } from '../../components/ui/InstallAppPrompt';
import { GlobalError } from '../../components/ui/GlobalError';
import React from 'react';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active?: boolean;
}

const SidebarItem: React.FC<NavItemProps> = ({ icon, label, to, active }) => (
  <Link to={to} className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 ${active ? 'bg-bg-canvas text-text-primary font-semibold' : 'text-text-secondary hover:bg-bg-canvas/50 hover:text-text-primary'}`}>
    <div className={`${active ? 'text-brand' : 'text-text-secondary'}`}>
      {icon}
    </div>
    <span className="text-sm tracking-tight">{label}</span>
  </Link>
);

const BottomNavItem: React.FC<NavItemProps> = ({ icon, label, to, active }) => (
  <Link to={to} className={`flex flex-col items-center justify-center gap-1 flex-1 py-3 transition-all ${active ? 'text-brand' : 'text-text-tertiary hover:text-text-secondary'}`}>
    <div className={`transition-transform duration-300 ${active ? 'scale-110' : ''}`}>
      {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<{ size?: number }>, { size: 20 }) : icon}
    </div>
    <span className="text-[10px] font-normal uppercase tracking-tighter">{label}</span>
  </Link>
);

export const DashboardLayout: React.FC = () => {
  const business = useAppStore((state) => state.business);
  const loading = useAppStore((state) => state.loading);
  const createSubscription = useAppStore((state) => state.createSubscription);
  const updateBusiness = useAppStore((state) => state.updateBusiness);
  const signOut = useAppStore((state) => state.signOut);
  const location = useLocation();

  const isTrialing = business?.subscriptionStatus === 'trialing';
  const trialEndDate = business?.trialEndDate ? new Date(business.trialEndDate) : null;
  const isTrialExpired = isTrialing && trialEndDate && new Date() > trialEndDate;
  const isActive = business?.subscriptionStatus === 'active';
  const isRestricted = isTrialExpired || (!isTrialing && !isActive);

  const trialDaysLeft = trialEndDate 
    ? Math.max(0, Math.ceil((trialEndDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  const handleSubscribe = async () => {
    const url = await createSubscription();
    if (url) window.location.href = url;
  };

  if (!business && !loading) {
    return <Navigate to="/onboarding" replace />;
  }

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-secondary">
        <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const navItems = [
    { icon: <LayoutDashboard />, label: 'Overview', to: '/dashboard/overview' },
    { icon: <Globe />, label: 'Website', to: '/dashboard/website' },
    { icon: <Palette />, label: 'Templates', to: '/dashboard/templates' },
    { icon: <Scissors />, label: 'Services', to: '/dashboard/services' },
    { icon: <Image />, label: 'Portfolio', to: '/dashboard/portfolio' },
    { icon: <MessageSquare />, label: 'Testimonials', to: '/dashboard/testimonials' },
    { icon: <Clock />, label: 'Availability', to: '/dashboard/availability' },
    { icon: <Calendar />, label: 'Bookings', to: '/dashboard/bookings' },
    { icon: <BarChart3 />, label: 'Analytics', to: '/dashboard/analytics' }
  ];

  const currentPath = location.pathname;
  const isSelected = (to: string) => currentPath === to || (to === '/dashboard/overview' && currentPath === '/dashboard');

  return (
    <div className="flex flex-col h-screen bg-bg-header font-sans overflow-hidden">
      {/* Header - System Frame Anchor (Layer 0) - Static */}
      <header className="h-16 flex items-center justify-between px-6 lg:px-8 z-50 text-white shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center text-white font-medium italic">B</div>
          <div className="flex flex-col lg:flex-row lg:items-center gap-0 lg:gap-2">
             <span className="text-sm font-semibold text-white tracking-tight">{business.name || 'Your Business'}</span>
             <span className={`text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded-md font-bold w-fit mt-1 lg:mt-0 ${isActive ? 'bg-success text-white' : 'bg-white/10 text-white/40'}`}>
               {isActive ? 'Pro' : isTrialing ? 'Trial' : 'Inactive'}
             </span>
          </div>
        </div>

        <div className="flex items-center gap-4 lg:gap-6">
          <div className="flex items-center gap-2 mr-1 lg:mr-2 border-r border-white/10 pr-4 lg:pr-6">
            <span className="text-[10px] font-medium text-white/60 uppercase tracking-widest hidden sm:block">Site</span>
            <button 
              onClick={() => updateBusiness({ isPublished: !business.isPublished })}
              className={`w-9 h-5 rounded-full transition-all duration-300 relative flex items-center px-0.5 cursor-pointer ${business.isPublished ? 'bg-emerald-500 shadow-md shadow-emerald-500/20' : 'bg-white/10'}`}
              title={business.isPublished ? "Unpublish Site" : "Publish Site"}
            >
              <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${business.isPublished ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
            <span className={`text-[10px] font-bold uppercase tracking-widest min-w-8 ${business.isPublished ? 'text-emerald-400' : 'text-white/40'}`}>
              {business.isPublished ? 'Live' : 'Draft'}
            </span>
          </div>

          <Link to="/preview" target="_blank" className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white/20 transition-all">
            <ExternalLink size={12} />
            Preview
          </Link>

          <Link 
            to="/dashboard/settings" 
            className={`p-2 rounded-lg transition-all ${isSelected('/dashboard/settings') ? 'bg-white/20 text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}
          >
            <Settings size={20} />
          </Link>
          
          <div className="h-6 w-px bg-white/10 mx-1 hidden sm:block" />

          <button onClick={() => signOut()} className="flex items-center gap-2 px-1 py-1 rounded-lg hover:bg-white/10 transition-all group" title="Sign Out">
            <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-white font-medium text-xs group-hover:bg-red-500 group-hover:border-red-500 transition-colors">
              <LogOut size={14} className="group-hover:text-white" />
            </div>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative bg-white rounded-t-[24px] shadow-[0_-8px_30px_rgba(0,0,0,0.2)] ring-1 ring-white/10 mx-1 lg:mx-2 border-t border-white/10">
        {/* Sidebar - Static Sidebar with independent scroll (Layer 1) */}
        <aside className="hidden lg:flex flex-col w-64 bg-bg-sidebar border-r border-border-polaris/40 overflow-y-auto shrink-0 z-40 p-6 rounded-tl-[24px]">
          {isTrialing && !isTrialExpired && (
            <div className="mb-8 p-5 rounded-xl bg-white border border-border-polaris/30 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-text-primary uppercase tracking-widest">Trial Mode</span>
                <span className="text-[10px] font-bold text-brand">{trialDaysLeft} days left</span>
              </div>
              <div className="h-1.5 w-full bg-bg-canvas rounded-full overflow-hidden">
                <div 
                  className="h-full bg-brand transition-all duration-1000" 
                  style={{ width: `${(trialDaysLeft / 14) * 100}%` }}
                />
              </div>
              <button 
                onClick={handleSubscribe}
                className="w-full py-2.5 bg-brand text-white text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-lg shadow-brand/20 hover:bg-brand-hover transition-all"
              >
                Upgrade Now
              </button>
            </div>
          )}

          <nav className="flex flex-col gap-1 flex-1">
            {navItems.map(item => (
              <SidebarItem 
                key={item.to} 
                icon={React.isValidElement(item.icon) ? React.cloneElement(item.icon as React.ReactElement<{ size?: number; strokeWidth?: number }>, { size: 18, strokeWidth: 2 }) : item.icon} 
                label={item.label} 
                to={item.to} 
                active={isSelected(item.to)} 
              />
            ))}
          </nav>

          <div className="pt-6 border-t border-border-polaris/30 mt-auto">
             <p className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest mb-4 px-3">Quick Links</p>
             <Link to="/onboarding" className="flex items-center gap-3 px-3 py-2 text-text-secondary hover:text-text-primary transition-colors">
                <Plus size={16} />
                <span className="text-xs font-medium">Business Setup</span>
             </Link>
             <button onClick={() => signOut()} className="w-full flex items-center gap-3 px-3 py-2 text-text-secondary hover:text-red-500 transition-colors mt-1">
                <LogOut size={16} />
                <span className="text-xs font-medium">Sign Out</span>
             </button>
          </div>
        </aside>

        {/* Main Content Area - Work Surface (Layer 2) - Scrollable */}
        <main className="flex-1 min-w-0 bg-white relative overflow-y-auto">
          <div className="p-8 lg:p-12 max-w-[1200px] mx-auto min-h-full">
            <Outlet />
          </div>
          
          {/* Mobile padding for bottom nav */}
          <div className="h-24 lg:hidden" />
        </main>
      </div>

      {/* Bottom Navigation - Mobile App Look */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-xl border-t border-border-light flex items-center justify-around px-2 lg:hidden z-50 safe-area-bottom shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
        <BottomNavItem icon={<LayoutDashboard />} label="Home" to="/dashboard/overview" active={isSelected('/dashboard/overview')} />
        <BottomNavItem icon={<Globe />} label="Site" to="/dashboard/website" active={isSelected('/dashboard/website')} />
        <div className="relative -mt-8">
           <Link to="/dashboard/services" className="w-14 h-14 rounded-2xl bg-brand text-white flex items-center justify-center shadow-2xl shadow-brand/40 active:scale-90 transition-all">
              <Plus size={28} />
           </Link>
        </div>
        <BottomNavItem icon={<Palette />} label="Design" to="/dashboard/templates" active={isSelected('/dashboard/templates')} />
        <BottomNavItem icon={<BarChart3 />} label="Stats" to="/dashboard/analytics" active={isSelected('/dashboard/analytics')} />
      </nav>

      {/* Subscription Overlay */}
      {isRestricted && (
        <div className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-500">
          <div className="w-full max-w-sm text-center space-y-8">
            <div className="w-20 h-20 bg-brand/10 rounded-[32px] flex items-center justify-center text-brand mx-auto shadow-xl shadow-brand/5 border border-brand/10">
              <ShieldCheck size={40} />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-medium tracking-tight text-text-primary">
                {isTrialExpired ? 'Trial Ended' : 'Subscription Required'}
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed max-w-[280px] mx-auto">
                {isTrialExpired 
                  ? "Your 14-day free trial has come to an end. Upgrade to Pro to keep growing your business."
                  : "An active subscription is required to access your dashboard and receive bookings."}
              </p>
            </div>
            <div className="space-y-4 pt-4">
              <Button 
                onClick={handleSubscribe}
                className="w-full h-16 rounded-[24px] bg-brand text-white font-medium text-xs uppercase tracking-widest shadow-2xl shadow-brand/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Go Pro — $19/mo
              </Button>
              <p className="text-[10px] text-text-tertiary font-normal">
                Includes all features, custom domains, and zero platform fees.
              </p>
            </div>
            <button 
              onClick={() => useAppStore.getState().signOut()}
              className="text-[10px] font-medium text-text-tertiary uppercase tracking-widest hover:text-text-primary transition-colors py-4"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}

      <InstallAppPrompt />
      <GlobalError />
    </div>
  );
};
