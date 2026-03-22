import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import type { SectionProps } from '../templates/types';

interface NavProps extends SectionProps {
  scrollTo: (id: string) => void;
  variant?: 'default' | 'minimal' | 'transparent';
}

export const SiteNav: React.FC<NavProps> = ({ business, onBook, scrollTo, isMobile, variant = 'default' }) => {
  const isTransparent = variant === 'transparent';
  const isMinimal = variant === 'minimal';
  
  return (
    <nav className={`h-16 px-6 md:px-12 flex items-center justify-between ${isTransparent ? '' : 'border-b border-border-light'} sticky top-0 ${isTransparent ? 'bg-transparent' : 'bg-white/95 backdrop-blur-md'} z-40`}>
      <div className={`flex items-center gap-2 ${isMobile ? 'scale-90 origin-left' : ''}`}>
        {business.logo ? (
          <img src={business.logo} alt="Logo" className="h-6 w-auto" />
        ) : (
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-medium italic text-sm" style={{ backgroundColor: business.primaryColor }}>B</div>
        )}
        <span className={`text-lg font-medium tracking-tight ${isTransparent ? 'text-white' : 'text-text-primary'}`}>{business.name || 'Your Business'}</span>
      </div>
      {!isMinimal && (
        <div className={`${isMobile ? 'hidden' : 'hidden md:flex'} items-center gap-8`}>
          <button onClick={() => scrollTo('services')} className={`text-xs font-medium ${isTransparent ? 'text-white/80 hover:text-white' : 'text-text-secondary hover:text-brand'} transition-colors bg-transparent border-none cursor-pointer`}>Services</button>
          <button onClick={() => scrollTo('about')} className={`text-xs font-medium ${isTransparent ? 'text-white/80 hover:text-white' : 'text-text-secondary hover:text-brand'} transition-colors bg-transparent border-none cursor-pointer`}>About</button>
          <button
            onClick={onBook}
            className="px-6 py-2.5 rounded-xl text-white text-xs font-medium shadow-lg transition-all hover:scale-[1.03] active:scale-95 border-none cursor-pointer"
            style={{ backgroundColor: business.primaryColor }}
          >
            Book Now
          </button>
        </div>
      )}
      <button
        onClick={onBook}
        className={`${isMobile ? 'block' : 'md:hidden'} p-2 rounded-xl text-white border-none cursor-pointer`}
        style={{ backgroundColor: business.primaryColor }}
      >
        <CalendarIcon size={18} />
      </button>
    </nav>
  );
};
