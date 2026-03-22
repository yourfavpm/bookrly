import { LayoutDashboard, Globe, Scissors, Calendar, BarChart3, Settings, ExternalLink, ChevronDown, Plus } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Link, useLocation } from 'react-router-dom';
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
    <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
  </Link>
);

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const business = useAppStore((state) => state.business);
  const location = useLocation();

  const navItems = [
    { icon: <LayoutDashboard />, label: 'Overview', to: '/dashboard/overview' },
    { icon: <Globe />, label: 'Website', to: '/dashboard/website' },
    { icon: <Scissors />, label: 'Services', to: '/dashboard/services' },
    { icon: <Calendar />, label: 'Bookings', to: '/dashboard/bookings' },
    { icon: <BarChart3 />, label: 'Analytics', to: '/dashboard/analytics' },
    { icon: <Settings />, label: 'Settings', to: '/dashboard/settings' }
  ];

  const currentPath = location.pathname;
  const isSelected = (to: string) => currentPath === to || (to === '/dashboard/overview' && currentPath === '/dashboard');

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-bg-secondary font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-border-light sticky top-0 h-screen p-6 shrink-0">
        <div className="flex items-center gap-2 px-2 mb-10">
          <div className="w-8 h-8 rounded-xl bg-brand flex items-center justify-center text-white font-bold italic shadow-sm">B</div>
          <span className="font-bold text-xl tracking-tight text-text-primary">Bookflow</span>
        </div>

        <nav className="flex flex-col gap-1.5 flex-1">
          {navItems.slice(0, 5).map(item => (
            <SidebarItem 
              key={item.to} 
              icon={React.isValidElement(item.icon) ? React.cloneElement(item.icon as React.ReactElement<{ size?: number }>, { size: 18 }) : item.icon} 
              label={item.label} 
              to={item.to} 
              active={isSelected(item.to)} 
            />
          ))}
        </nav>

        <div className="pt-6 border-t border-border-light">
          <SidebarItem 
            icon={<Settings size={18} />} 
            label="Settings" 
            to="/dashboard/settings" 
            active={isSelected('/dashboard/settings')} 
          />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0">
        {/* Header - Stays at top */}
        <header className="h-16 lg:h-20 bg-white/80 backdrop-blur-md border-b border-border-light flex items-center justify-between px-6 lg:px-10 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <div className="lg:hidden w-8 h-8 rounded-xl bg-brand flex items-center justify-center text-white font-bold italic">B</div>
            <div className="flex flex-col lg:flex-row lg:items-center gap-0 lg:gap-2">
               <span className="text-sm font-bold text-text-primary leading-none">{business.name || 'Your Business'}</span>
               <span className="text-[9px] uppercase tracking-widest text-text-tertiary px-1.5 py-0.5 bg-bg-tertiary rounded-md font-bold w-fit mt-1 lg:mt-0">Pro</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link to={`/p/${business.id}`} target="_blank" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white border border-border-default rounded-xl text-[10px] font-bold uppercase tracking-widest text-text-primary hover:bg-bg-secondary transition-all shadow-sm">
              <ExternalLink size={12} />
              Preview
            </Link>
            
            <button className="flex items-center gap-2 px-1 py-1 rounded-full hover:bg-bg-secondary transition-all group">
              <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-brand-light border border-brand/10 flex items-center justify-center text-brand font-black text-xs">
                {business.name?.charAt(0) || 'B'}
              </div>
              <ChevronDown size={12} className="text-text-tertiary hidden sm:block" />
            </button>
          </div>
        </header>

        {/* Content - Full width on mobile */}
        <div className="p-5 md:p-10 max-w-7xl mx-auto w-full flex-1">
          {children}
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
        <BottomNavItem icon={<Calendar />} label="Book" to="/dashboard/bookings" active={isSelected('/dashboard/bookings')} />
        <BottomNavItem icon={<Settings />} label="Misc" to="/dashboard/settings" active={isSelected('/dashboard/settings')} />
      </nav>
    </div>
  );
};
