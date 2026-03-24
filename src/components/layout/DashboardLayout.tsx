import { LayoutDashboard, Globe, Scissors, Calendar, BarChart3, Settings, ExternalLink, Plus, Palette, Clock, ShieldCheck, Image, MessageSquare, LogOut, ChevronLeft } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Link, Navigate, useLocation, Outlet } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { InstallAppPrompt } from '../../components/ui/InstallAppPrompt';
import { GlobalError } from '../../components/ui/GlobalError';
import { NotificationPopover } from '../dashboard/NotificationPopover';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';
import { Bell } from 'lucide-react';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active?: boolean;
}

const SidebarItem: React.FC<NavItemProps & { onClick?: () => void }> = ({ icon, label, to, active, onClick }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className={`flex items-center gap-4 px-4 py-3 rounded-2xl cursor-pointer transition-all duration-300 ${active ? 'bg-bg-canvas text-text-primary font-medium' : 'text-text-secondary hover:bg-bg-canvas/50 hover:text-text-primary'}`}
  >
    <div className={`transition-colors duration-300 ${active ? 'text-brand' : 'text-text-tertiary'}`}>
      {icon}
    </div>
    <span className={`text-sm tracking-tight ${active ? 'font-semibold' : 'font-light'}`}>{label}</span>
  </Link>
);

export const DashboardLayout: React.FC = () => {
  const business = useAppStore((state) => state.business);
  const loading = useAppStore((state) => state.loading);
  const createSubscription = useAppStore((state) => state.createSubscription);
  const updateBusiness = useAppStore((state) => state.updateBusiness);
  const signOut = useAppStore((state) => state.signOut);
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
  
  const getPageTitle = () => {
    const item = navItems.find(i => currentPath === i.to) || (currentPath === '/dashboard' ? navItems[0] : null);
    if (currentPath === '/dashboard/settings') return 'Settings';
    return item?.label || 'Dashboard';
  };

  return (
    <div className="flex flex-col h-screen bg-bg-header font-sans overflow-hidden">
      {/* Dynamic Mobile/Desktop Header */}
      <header className="h-16 lg:h-20 flex items-center justify-between px-5 lg:px-8 z-50 text-white shrink-0">
        <div className="flex items-center gap-4 lg:gap-6">
          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -ml-2 lg:hidden text-white/80 hover:text-white transition-colors"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <div className="h-0.5 w-full bg-current rounded-full" />
              <div className="h-0.5 w-full bg-current rounded-full opacity-60" />
              <div className="h-0.5 w-2/3 bg-current rounded-full" />
            </div>
          </button>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-xl bg-brand flex items-center justify-center text-white font-bold italic text-sm">B</div>
            <div className="flex flex-col lg:flex-row lg:items-center gap-0 lg:gap-2">
               {/* Show Business Name on Desktop, Page Title on Mobile */}
               <span className="text-sm font-semibold text-white tracking-tight hidden lg:block">
                 {business?.name || (loading ? 'Loading...' : 'Your Business')}
               </span>
               <span className="text-sm font-medium text-white tracking-tight lg:hidden">
                 {getPageTitle()}
               </span>
               {business && (
                 <span className={`text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded-md font-bold w-fit mt-1 lg:mt-0 ${isActive ? 'bg-success text-white' : 'bg-white/10 text-white/40'}`}>
                   {isActive ? 'Pro' : 'Trial'}
                 </span>
               )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 lg:gap-6">
          <div className="hidden lg:flex items-center gap-2 mr-2 border-r border-white/10 pr-6">
            <span className="text-[10px] font-medium text-white/60 uppercase tracking-widest">Site</span>
            <button 
              onClick={() => business && updateBusiness({ isPublished: !business.isPublished })}
              disabled={!business}
              className={`w-9 h-5 rounded-full transition-all duration-300 relative flex items-center px-0.5 cursor-pointer ${business?.isPublished ? 'bg-emerald-500 shadow-md shadow-emerald-500/20' : 'bg-white/10'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${business?.isPublished ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
            <span className={`text-[10px] font-bold uppercase tracking-widest min-w-8 ${business?.isPublished ? 'text-emerald-400' : 'text-white/40'}`}>
              {business ? (business.isPublished ? 'Live' : 'Draft') : '...'}
            </span>
          </div>

          <Link to="/preview" target="_blank" className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white/20 transition-all">
            <ExternalLink size={12} />
            Preview
          </Link>

          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2 rounded-xl transition-all relative ${showNotifications ? 'bg-white/20 text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}
            >
              <Bell size={20} />
              <div className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-bg-header" />
            </button>
            <AnimatePresence>
              {showNotifications && (
                <NotificationPopover onClose={() => setShowNotifications(false)} />
              )}
            </AnimatePresence>
          </div>

          <Link 
            to="/dashboard/settings" 
            className={`p-2 rounded-xl transition-all hidden lg:block ${isSelected('/dashboard/settings') ? 'bg-white/20 text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}
          >
            <Settings size={20} />
          </Link>
          
          <div className="h-6 w-px bg-white/10 mx-1 hidden lg:block" />

          <button onClick={() => signOut()} className="hidden lg:flex items-center gap-2 px-1 py-1 rounded-lg hover:bg-white/10 transition-all group" title="Sign Out">
            <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-white font-medium text-xs group-hover:bg-red-500 group-hover:border-red-500 transition-colors">
              <LogOut size={14} className="group-hover:text-white" />
            </div>
          </button>
        </div>
      </header>

      {/* Slide-out Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60 lg:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-white z-70 lg:hidden flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-black/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-xl bg-brand flex items-center justify-center text-white font-bold italic text-sm">B</div>
                   <span className="font-bold tracking-tight">Console</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-black/20 hover:text-black/40"><ChevronLeft size={20} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 py-8">
                 <nav className="space-y-2">
                    {navItems.map(item => (
                      <SidebarItem 
                        key={item.to} 
                        icon={React.isValidElement(item.icon) ? React.cloneElement(item.icon as React.ReactElement<{ size?: number; strokeWidth?: number }>, { size: 18, strokeWidth: 1.5 }) : item.icon} 
                        label={item.label} 
                        to={item.to} 
                        active={isSelected(item.to)}
                        onClick={() => setIsMobileMenuOpen(false)}
                      />
                    ))}
                    <SidebarItem 
                      icon={<Settings size={18} strokeWidth={1.5} />} 
                      label="Settings" 
                      to="/dashboard/settings" 
                      active={isSelected('/dashboard/settings')} 
                      onClick={() => setIsMobileMenuOpen(false)}
                    />
                 </nav>
              </div>

              <div className="p-6 border-t border-black/5 bg-bg-secondary/30">
                 <button 
                   onClick={() => {
                     setIsMobileMenuOpen(false);
                     signOut();
                   }}
                   className="w-full flex items-center gap-3 px-4 py-3 text-text-tertiary hover:text-red-500 transition-colors"
                 >
                    <LogOut size={18} strokeWidth={1.5} />
                    <span className="text-sm font-light">Sign Out</span>
                 </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex flex-1 overflow-hidden relative bg-white lg:rounded-t-[24px] lg:shadow-[0_-8px_30px_rgba(0,0,0,0.2)] lg:ring-1 lg:ring-white/10 lg:mx-2 lg:border-t lg:border-white/10">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:flex flex-col w-64 bg-bg-sidebar border-r border-border-polaris/40 overflow-y-auto shrink-0 z-40 p-6 rounded-tl-[24px]">
          {isTrialing && !isTrialExpired && (
            <div className="mb-8 p-5 rounded-2xl bg-white border border-border-polaris/10 shadow-sm space-y-4">
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
                className="w-full py-2.5 bg-brand text-white text-[10px] font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-brand/20 hover:bg-brand-hover transition-all"
              >
                Upgrade Now
              </button>
            </div>
          )}

          <nav className="flex flex-col gap-1 flex-1">
            {navItems.map(item => (
              <SidebarItem 
                key={item.to} 
                icon={React.isValidElement(item.icon) ? React.cloneElement(item.icon as React.ReactElement<{ size?: number; strokeWidth?: number }>, { size: 18, strokeWidth: 1.5 }) : item.icon} 
                label={item.label} 
                to={item.to} 
                active={isSelected(item.to)} 
              />
            ))}
          </nav>

          <div className="pt-6 border-t border-border-polaris/30 mt-auto">
             <p className="text-[9px] font-medium text-text-tertiary uppercase tracking-widest mb-4 px-3">Quick Links</p>
             <Link to="/onboarding" className="flex items-center gap-3 px-3 py-2 text-text-secondary hover:text-text-primary transition-colors font-light text-xs">
                <Plus size={16} />
                <span>Business Setup</span>
             </Link>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 bg-white relative overflow-y-auto">
          <div className="p-6 lg:p-12 max-w-[1200px] mx-auto min-h-full">
            {!business && loading ? (
              <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
                <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-sm text-text-secondary font-medium uppercase tracking-widest">Loading business console...</p>
              </div>
            ) : (
              <Outlet />
            )}
          </div>
        </main>
      </div>


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
