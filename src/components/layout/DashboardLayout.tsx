import { LayoutDashboard, Globe, Scissors, Calendar, BarChart3, Settings, ExternalLink, Plus, Clock, Image, MessageSquare, LogOut, ChevronLeft, Users, UserPlus, CreditCard } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { calculateDaysRemaining } from '../../lib/dateUtils';
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
    className={`flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer transition-all duration-300 ${active ? 'bg-bg-canvas text-text-primary' : 'text-text-secondary hover:bg-bg-canvas/50 hover:text-text-primary'}`}
  >
    <div className={`transition-colors duration-300 ${active ? 'text-brand' : 'text-text-tertiary'}`}>
      {icon}
    </div>
    <span className={`text-[11px] uppercase tracking-wider font-bold ${active ? 'text-text-primary' : 'text-text-tertiary group-hover:text-text-primary'}`}>{label}</span>
  </Link>);

export const DashboardLayout: React.FC = () => {
  const { 
    business, 
    loading, 
    error,
    updateBusiness, 
    signOut, 
    staffRole 
  } = useAppStore();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isTrialing = business?.subscriptionStatus === 'trialing';
  const gracePeriodDays = 3;
  const trialEndDate = business?.trialEndDate ? new Date(business.trialEndDate) : null;
  const restrictionDate = trialEndDate ? new Date(trialEndDate.getTime() + gracePeriodDays * 24 * 60 * 60 * 1000) : null;
  const isTrialExpired = isTrialing && restrictionDate && new Date() > restrictionDate;
  const isActive = business?.subscriptionStatus === 'active';
  const isRestricted = !!business && (isTrialExpired || (!isTrialing && !isActive));

  const trialDaysLeft = calculateDaysRemaining(trialEndDate);

  const handleSubscribe = () => {
    window.location.href = '/dashboard/settings?section=billing';
  };

  // Only redirect to onboarding if we are sure there is no business AND no error
  // If there's an error, we stay on the page to show the GlobalError
  if (!business && !loading && !error) {
    return <Navigate to="/onboarding" replace />;
  }

  const allNavItems = [
    { icon: <LayoutDashboard />, label: 'Overview', to: '/dashboard/overview', roles: ['owner', 'admin', 'manager', 'staff'] },
    { icon: <Globe />, label: 'Website', to: '/dashboard/website', roles: ['owner', 'admin'] },
    { icon: <Scissors />, label: 'Services', to: '/dashboard/services', roles: ['owner', 'admin'] },
    { icon: <Image />, label: 'Portfolio', to: '/dashboard/portfolio', roles: ['owner', 'admin'] },
    { icon: <MessageSquare />, label: 'Testimonials', to: '/dashboard/testimonials', roles: ['owner', 'admin'] },
    { icon: <Clock />, label: 'Availability', to: '/dashboard/availability', roles: ['owner', 'admin', 'manager'] },
    { icon: <Users />, label: 'Team', to: '/dashboard/team', roles: ['owner', 'admin', 'manager'] },
    { icon: <UserPlus />, label: 'Clients', to: '/dashboard/clients', roles: ['owner', 'admin', 'manager', 'staff'] },
    { icon: <Calendar />, label: 'Bookings', to: '/dashboard/bookings', roles: ['owner', 'admin', 'manager', 'staff'] },
    { icon: <CreditCard />, label: 'Billing', to: '/dashboard/billing', roles: ['owner', 'admin'] },
    { icon: <Globe />, label: 'Domains', to: '/dashboard/domains', roles: ['owner', 'admin'] },
    { icon: <Bell />, label: 'Notifications', to: '/dashboard/settings/notifications', roles: ['owner', 'admin', 'manager'] },
    { icon: <BarChart3 />, label: 'Analytics', to: '/dashboard/analytics', roles: ['owner', 'admin'] }
  ];

  const currentRole = staffRole || 'owner';
  const navItems = allNavItems.filter(item => item.roles.includes(currentRole));

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
            <img src="/images/logomain.png" alt="Skeduley Logo" className="h-[96px] lg:h-[108px] w-auto filter brightness-0 invert" />
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
              className="fixed inset-y-0 left-0 w-[260px] bg-white z-70 lg:hidden flex flex-col shadow-2xl"
            >
              <div className="p-4 border-b border-black/5 flex items-center justify-between">
                <div className="flex items-center">
                   <img src="/images/logomain.png" alt="Skeduley Console" className="h-[40px] w-auto" />
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-black/20 hover:text-black/40"><ChevronLeft size={20} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 py-4">
                 <nav className="space-y-1">
                    {navItems.map(item => (
                      <SidebarItem 
                        key={item.to} 
                        icon={React.isValidElement(item.icon) ? React.cloneElement(item.icon as React.ReactElement<{ size?: number; strokeWidth?: number }>, { size: 16, strokeWidth: 1.5 }) : item.icon} 
                        label={item.label} 
                        to={item.to} 
                        active={isSelected(item.to)}
                        onClick={() => setIsMobileMenuOpen(false)}
                      />
                    ))}
                    {(currentRole === 'owner' || currentRole === 'admin') && (
                      <SidebarItem 
                        icon={<Settings size={16} strokeWidth={1.5} />} 
                        label="Settings" 
                        to="/dashboard/settings" 
                        active={isSelected('/dashboard/settings')} 
                        onClick={() => setIsMobileMenuOpen(false)}
                      />
                    )}
                 </nav>
              </div>

              <div className="p-4 border-t border-black/5 bg-bg-secondary/30">
                 <button 
                   onClick={() => {
                     setIsMobileMenuOpen(false);
                     signOut();
                   }}
                   className="w-full flex items-center gap-3 px-3 py-2 text-text-tertiary hover:text-red-500 transition-colors rounded-lg hover:bg-black/5"
                 >
                    <LogOut size={16} strokeWidth={1.5} />
                    <span className="text-sm font-light">Sign Out</span>
                 </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex flex-1 overflow-hidden relative bg-white rounded-t-[20px] shadow-[0_-8px_30px_rgba(0,0,0,0.2)] ring-1 ring-white/10 mx-1 mt-1 border-t border-white/10 lg:rounded-t-[24px] lg:mx-2 lg:mt-0">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:flex flex-col w-64 bg-bg-sidebar border-r border-border-polaris/40 overflow-y-auto shrink-0 z-40 p-5 rounded-tl-[24px]">
          {isTrialing && !isTrialExpired && (
            <div className="mb-4 p-4 rounded-2xl bg-white border border-border-polaris/10 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-text-primary uppercase tracking-widest">Trial Mode</span>
                <span className="text-[10px] font-bold text-brand">{trialDaysLeft > 0 ? `${trialDaysLeft} days left` : 'Trial Ended'}</span>
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

          {(currentRole === 'owner' || currentRole === 'admin') && (
            <div className="pt-4 border-t border-border-polaris/30 mt-4 space-y-1">
               <p className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest mb-2 px-3">System</p>
               <SidebarItem 
                icon={<Plus size={18} strokeWidth={1.5} />} 
                label="Setup" 
                to="/onboarding" 
                active={isSelected('/onboarding')} 
              />
              <SidebarItem 
                icon={<Settings size={18} strokeWidth={1.5} />} 
                label="Settings" 
                to="/dashboard/settings" 
                active={isSelected('/dashboard/settings')} 
              />
            </div>
          )}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 bg-white relative overflow-y-auto">
          <div className="p-6 lg:p-12 max-w-[1200px] mx-auto min-h-full">
            {/* Restricted Banner - Non-blocking */}
            {isRestricted && (
              <div className="mb-8 p-4 md:p-6 rounded-2xl md:rounded-[32px] bg-linear-to-br from-brand/10 to-brand/5 border border-brand/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6 animate-in slide-in-from-top duration-500">
                <div className="flex items-center gap-3 md:gap-5 text-left">
                  <div className="hidden md:flex w-14 h-14 bg-white rounded-2xl items-center justify-center text-brand shadow-sm border border-brand/10 shrink-0">
                    <CreditCard size={24} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xs md:text-sm font-bold text-text-primary uppercase tracking-wider">
                      {isTrialExpired ? 'Trial Ended' : 'Subscription Required'}
                    </h3>
                    <p className="text-[10px] md:text-[11px] text-text-secondary leading-relaxed max-w-sm">
                      {isTrialExpired 
                        ? "Your trial ended. Upgrade to Pro to go live again."
                        : "An active subscription is required to stay published."}
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={handleSubscribe}
                  className="w-full md:w-auto h-10 md:h-12 px-6 md:px-8 rounded-xl md:rounded-2xl bg-brand text-white font-medium text-[10px] uppercase tracking-widest shadow-lg shadow-brand/20 hover:scale-105 active:scale-95 transition-all whitespace-nowrap shrink-0"
                >
                  Upgrade to Pro
                </Button>
              </div>
            )}

            {loading ? (
              <div className="h-full flex flex-col items-center justify-center gap-4 py-20">
                <div className="w-1.5 h-1.5 rounded-full bg-brand animate-ping" />
                <p className="text-sm text-text-secondary font-medium uppercase tracking-widest">Loading business console...</p>
              </div>
            ) : (
              <Outlet />
            )}

            <button 
              onClick={() => signOut()}
              className="mt-12 text-[10px] font-medium text-text-tertiary uppercase tracking-widest hover:text-text-primary transition-colors py-4"
            >
              Sign Out
            </button>
          </div>
        </main>
      </div>

      {/* Floating Mobile Trial Banner */}
      {isTrialing && !isTrialExpired && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-sm lg:hidden z-50 bg-brand text-white px-4 py-3 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.2)] flex items-center justify-between gap-3 animate-in slide-in-from-bottom-8 fade-in duration-500 border border-white/10">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">Trial Mode</span>
            <span className="text-xs font-medium">{trialDaysLeft > 0 ? `${trialDaysLeft} days left` : 'Trial Ended'}</span>
          </div>
          <button 
            onClick={handleSubscribe}
            className="px-4 py-2 bg-white text-brand text-[10px] font-bold uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-transform whitespace-nowrap shadow-sm"
          >
            Upgrade
          </button>
        </div>
      )}

      <InstallAppPrompt />
      <GlobalError />
    </div>
  );
};
