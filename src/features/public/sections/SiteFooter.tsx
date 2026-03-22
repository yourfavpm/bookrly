import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import type { SectionProps } from '../templates/types';

interface FooterProps extends SectionProps {
  variant?: 'full' | 'simple' | 'minimal';
}

export const SiteFooter: React.FC<FooterProps> = ({ business, variant = 'full' }) => {
  if (variant === 'minimal') {
    return (
      <footer className="py-12 px-6 border-t border-border-light text-center">
        <p className="text-xs text-text-tertiary">© 2026 {business.name}. All rights reserved.</p>
        <p className="text-xs text-text-tertiary mt-2">Powered by <span className="font-medium" style={{ color: business.primaryColor }}>Bookflow</span></p>
      </footer>
    );
  }

  if (variant === 'simple') {
    return (
      <footer className="py-16 bg-bg-secondary w-full px-6 border-t border-border-light">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl text-white font-medium italic text-sm shadow-lg flex items-center justify-center" style={{ backgroundColor: business.primaryColor }}>B</div>
            <span className="text-lg font-medium tracking-tight text-text-primary">{business.name}</span>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-text-secondary">
            {business.email && <span className="flex items-center gap-2"><Mail size={14} /> {business.email}</span>}
            {business.phone && <span className="flex items-center gap-2"><Phone size={14} /> {business.phone}</span>}
          </div>
          <p className="text-[10px] text-text-tertiary uppercase tracking-widest">Powered by <span className="font-medium" style={{ color: business.primaryColor }}>Bookflow</span></p>
        </div>
      </footer>
    );
  }

  // Default: full
  return (
    <footer className="py-20 bg-bg-secondary w-full px-6 border-t border-border-light">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-left">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl text-white font-medium italic text-sm shadow-lg flex items-center justify-center" style={{ backgroundColor: business.primaryColor }}>B</div>
              <span className="text-xl font-medium tracking-tight text-text-primary">{business.name}</span>
            </div>
            <p className="text-sm text-text-secondary max-w-sm leading-relaxed opacity-70">A premium service destination. Book your next appointment online in seconds.</p>
          </div>
          <div className="space-y-6">
            <span className="text-[10px] font-medium text-text-tertiary uppercase tracking-[0.3em]">Contact</span>
            <ul className="list-none p-0 space-y-3 text-sm text-text-secondary">
              {business.address && <li className="flex items-center gap-3"><MapPin size={16} className="text-text-tertiary" /> {business.address}</li>}
              {business.phone && <li className="flex items-center gap-3"><Phone size={16} className="text-text-tertiary" /> {business.phone}</li>}
              {business.email && <li className="flex items-center gap-3"><Mail size={16} className="text-text-tertiary" /> {business.email}</li>}
            </ul>
          </div>
          <div className="space-y-6">
            <span className="text-[10px] font-medium text-text-tertiary uppercase tracking-[0.3em]">Platform</span>
            <p className="text-lg font-medium tracking-tight text-text-primary">Powered by <span className="italic" style={{ color: business.primaryColor }}>Bookflow</span></p>
          </div>
        </div>
        <div className="pt-10 border-t border-border-light flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[8px] font-medium text-text-tertiary uppercase tracking-[.25em]">© 2026 {business.name}. All rights reserved.</p>
          <div className="flex gap-8 text-[8px] font-medium text-text-tertiary uppercase tracking-[.25em]">
            <span className="hover:text-text-primary cursor-pointer transition-all">Privacy</span>
            <span className="hover:text-text-primary cursor-pointer transition-all">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
