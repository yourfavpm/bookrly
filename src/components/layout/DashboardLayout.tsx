import { LayoutDashboard, Globe, Scissors, Calendar, BarChart3, Settings, ExternalLink, ChevronDown, Plus, Palette, Clock } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Link, Navigate, useLocation, Outlet } from 'react-router-dom';
import React from 'react';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active?: boolean;
}

const SidebarItem: React.FC<NavItemProps> = ({ icon, label, to, active }) => (
  <Link to={to} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${active ? 'bg-brand text-white shadow-sm' : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'}`}>
    {icon}
    <span className="text-sm font-medium tracking-tight">{label}</span>
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
  const location = useLocation();

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
    { icon: <Clock />, label: 'Availability', to: '/dashboard/availability' },
    { icon: <Calendar />, label: 'Bookings', to: '/dashboard/bookings' },
    { icon: <BarChart3 />, label: 'Analytics', to: '/dashboard/analytics' }
  ];

  const currentPath = location.pathname;
  const isSelected = (to: string) => currentPath === to || (to === '/dashboard/overview' && currentPath === '/dashboard');

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-bg-secondary font-sans overflow-x-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-border-light fixed left-0 top-0 bottom-0 p-6 shrink-0 z-40">
        <div className="flex items-center gap-2 px-2 mb-10">
          <div className="w-8 h-8 rounded-xl bg-brand flex items-center justify-center text-white font-medium italic shadow-sm">B</div>
          <span className="font-medium text-xl tracking-tight text-text-primary">Bookflow</span>
        </div>

        <nav className="flex flex-col gap-1.5 flex-1">
          {navItems.map(item => (
            <SidebarItem 
              key={item.to} 
              icon={React.isValidElement(item.icon) ? React.cloneElement(item.icon as React.ReactElement<{ size?: number }>, { size: 18 }) : item.icon} 
              label={item.label} 
              to={item.to} 
              active={isSelected(item.to)} 
            />
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 pb-32 lg:pb-0 lg:pl-64">
        {/* Header - Stays at top */}
        <header className="h-16 lg:h-20 bg-white/80 backdrop-blur-md border-b border-border-light flex items-center justify-between px-6 lg:px-10 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <div className="lg:hidden w-8 h-8 rounded-xl bg-brand flex items-center justify-center text-white font-medium italic">B</div>
            <div className="flex flex-col lg:flex-row lg:items-center gap-0 lg:gap-2">
               <span className="text-sm font-medium text-text-primary leading-none">{business.name || 'Your Business'}</span>
               <span className="text-[9px] uppercase tracking-widest text-text-tertiary px-1.5 py-0.5 bg-bg-tertiary rounded-md font-normal w-fit mt-1 lg:mt-0">Pro</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link to={`/p/${business.subdomain}`} target="_blank" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white border border-border-default rounded-xl text-[10px] font-normal uppercase tracking-widest text-text-primary hover:bg-bg-secondary transition-all shadow-sm">
              <ExternalLink size={12} />
              Preview
            </Link>

            <Link 
              to="/dashboard/settings" 
              className={`p-2 rounded-full transition-all ${isSelected('/dashboard/settings') ? 'bg-brand/10 text-brand' : 'text-text-tertiary hover:bg-bg-secondary hover:text-text-primary'}`}
            >
              <Settings size={20} />
            </Link>
            
            <button className="flex items-center gap-2 px-1 py-1 rounded-full hover:bg-bg-secondary transition-all group">
              <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-brand-light border border-brand/10 flex items-center justify-center text-brand font-medium text-xs">
                {business.name?.charAt(0) || 'B'}
              </div>
              <ChevronDown size={12} className="text-text-tertiary hidden sm:block" />
            </button>
          </div>
        </header>

        {/* Content - Full width on mobile */}
        <div className="p-5 md:p-10 max-w-7xl mx-auto w-full flex-1">
          <Outlet />
        </div>
      </main>

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
    </div>
  );
};
