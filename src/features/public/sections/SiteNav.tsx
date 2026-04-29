import React from 'react';
import { useAppStore } from '../../../store/useAppStore';
import type { SectionProps } from '../templates/types';

interface NavProps extends SectionProps {}

export const SiteNav: React.FC<NavProps> = ({ business, scrollTo, onBook }) => {
  const { isCanada } = useAppStore();

  return (
    <nav className="h-20 px-8 flex items-center justify-between sticky top-0 z-40 transition-colors"
         style={{ backgroundColor: 'var(--t-bg-primary)', borderBottom: '1px solid var(--t-border)' }}>
      <div className="flex items-center gap-3">
        {business.logo ? (
          <img src={business.logo} alt="Logo" className="h-8 w-auto" />
        ) : (
          <div className="w-8 h-8 rounded flex items-center justify-center font-bold text-white text-sm" 
               style={{ backgroundColor: 'var(--t-accent)', borderRadius: 'var(--t-radius)' }}>
            {business.name.charAt(0)}
          </div>
        )}
        <span className="text-lg font-bold tracking-tight" style={{ fontFamily: 'var(--t-heading-font)', color: 'var(--t-text-primary)' }}>
          {business.name || 'Your Business'}
        </span>
        {isCanada && (
          <div className="flex items-center gap-1.5 px-2 py-1 ml-2 border" 
               style={{ backgroundColor: 'var(--t-bg-secondary)', borderColor: 'var(--t-border)', borderRadius: 'var(--t-radius)' }}>
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--t-text-primary)' }}>Canada First</span>
          </div>
        )}
      </div>
      <div className="hidden md:flex items-center gap-8">
        {['services', 'about', 'reviews'].map(item => (
          <button 
            key={item}
            onClick={() => scrollTo?.(item)}
            className="text-sm font-medium transition-colors hover:opacity-70 capitalize"
            style={{ color: 'var(--t-text-secondary)' }}
          >
            {item}
          </button>
        ))}
        <button 
          onClick={onBook}
          className="px-6 py-2.5 text-sm font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 text-white"
          style={{ backgroundColor: 'var(--t-accent)', borderRadius: 'var(--t-radius)' }}
        >
          {business.ctaText || 'Book Now'}
        </button>
      </div>
    </nav>
  );
};
