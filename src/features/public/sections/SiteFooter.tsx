import React from 'react';
import { Instagram, Facebook, Twitter, MapPin, Mail, Phone, ArrowUpRight } from 'lucide-react';
import type { SectionProps } from '../templates/types';

interface FooterProps extends SectionProps {
  variant?: 'minimal' | 'standard' | 'ctaHeavy';
}

export const SiteFooter: React.FC<FooterProps> = ({ business, onBook, scrollTo, variant = 'standard' }) => {
  const year = new Date().getFullYear();

  const socialLinks = (
    <div className="flex items-center gap-4">
      {business.socials?.instagram && (
        <a href={business.socials.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border flex items-center justify-center transition-all hover:scale-110"
           style={{ borderColor: 'var(--t-border)', color: 'var(--t-text-primary)' }}>
          <Instagram size={16} />
        </a>
      )}
      {business.socials?.facebook && (
        <a href={business.socials.facebook} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border flex items-center justify-center transition-all hover:scale-110"
           style={{ borderColor: 'var(--t-border)', color: 'var(--t-text-primary)' }}>
          <Facebook size={16} />
        </a>
      )}
      {business.socials?.twitter && (
        <a href={business.socials.twitter} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border flex items-center justify-center transition-all hover:scale-110"
           style={{ borderColor: 'var(--t-border)', color: 'var(--t-text-primary)' }}>
          <Twitter size={16} />
        </a>
      )}
    </div>
  );

  if (variant === 'ctaHeavy') {
    return (
      <footer style={{ backgroundColor: 'var(--t-bg-secondary)', borderTop: '1px solid var(--t-border)' }}>
        <div className="max-w-4xl mx-auto px-6 py-24 text-center border-b" style={{ borderColor: 'var(--t-border)' }}>
          <h2 className="text-4xl md:text-6xl font-bold mb-8" style={{ fontFamily: 'var(--t-heading-font)', fontWeight: 'var(--t-heading-weight)', color: 'var(--t-text-primary)' }}>
            Ready to transform?
          </h2>
          <button onClick={onBook} className="px-12 py-5 text-sm font-bold uppercase tracking-widest text-white transition-all hover:scale-105 shadow-2xl"
                  style={{ backgroundColor: 'var(--t-accent)', borderRadius: 'var(--t-radius)' }}>
            {business.ctaText || 'Book Your Session'}
          </button>
        </div>
        
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            {business.logo ? (
              <img src={business.logo} alt="Logo" className="h-6 w-auto grayscale opacity-50" />
            ) : (
              <span className="text-xl font-bold tracking-tight" style={{ fontFamily: 'var(--t-heading-font)', color: 'var(--t-text-primary)' }}>{business.name}</span>
            )}
          </div>
          {socialLinks}
          <div className="text-xs font-medium" style={{ color: 'var(--t-text-muted)' }}>
            © {year} {business.name}. All rights reserved. <br/>
            <a href="https://bukd.co" target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1 justify-center md:justify-end mt-2">
              Powered by Bukd <ArrowUpRight size={10} />
            </a>
          </div>
        </div>
      </footer>
    );
  }

  if (variant === 'minimal') {
    return (
      <footer className="py-16" style={{ backgroundColor: 'var(--t-bg-primary)', borderTop: '1px solid var(--t-border)' }}>
        <div className="max-w-4xl mx-auto px-6 text-center space-y-12">
          <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--t-heading-font)', color: 'var(--t-text-primary)' }}>{business.name}</h2>
          <div className="flex justify-center gap-8 text-sm font-medium" style={{ color: 'var(--t-text-secondary)' }}>
            <button onClick={() => scrollTo?.('services')} className="hover:opacity-70 transition-opacity">Services</button>
            <button onClick={() => scrollTo?.('about')} className="hover:opacity-70 transition-opacity">About</button>
            <button onClick={onBook} className="hover:opacity-70 transition-opacity" style={{ color: 'var(--t-accent)' }}>Book Now</button>
          </div>
          <div className="flex justify-center">
            {socialLinks}
          </div>
          <div className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--t-text-muted)' }}>
            © {year} {business.name} — <a href="https://bukd.co" target="_blank" rel="noreferrer" className="hover:underline">Built on Bukd</a>
          </div>
        </div>
      </footer>
    );
  }

  // standard
  return (
    <footer className="py-20" style={{ backgroundColor: 'var(--t-bg-secondary)', borderTop: '1px solid var(--t-border)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--t-heading-font)', color: 'var(--t-text-primary)' }}>{business.name}</h2>
            <p className="text-sm leading-relaxed max-w-sm" style={{ color: 'var(--t-text-secondary)' }}>
              {business.heroSubtitle || 'Delivering exceptional services to our community with dedication and expertise.'}
            </p>
            {socialLinks}
          </div>
          
          <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--t-text-primary)' }}>Explore</h3>
            <div className="flex flex-col gap-3 text-sm" style={{ color: 'var(--t-text-secondary)' }}>
              <button onClick={() => scrollTo?.('services')} className="text-left hover:opacity-70 w-max transition-opacity">Services</button>
              <button onClick={() => scrollTo?.('portfolio')} className="text-left hover:opacity-70 w-max transition-opacity">Portfolio</button>
              <button onClick={() => scrollTo?.('about')} className="text-left hover:opacity-70 w-max transition-opacity">About</button>
              <button onClick={() => scrollTo?.('reviews')} className="text-left hover:opacity-70 w-max transition-opacity">Reviews</button>
            </div>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--t-text-primary)' }}>Contact</h3>
            <div className="flex flex-col gap-4 text-sm" style={{ color: 'var(--t-text-secondary)' }}>
              {business.address && (
                <div className="flex items-start gap-3"><MapPin size={16} className="shrink-0 mt-0.5" style={{ color: 'var(--t-accent)' }} /> {business.address}</div>
              )}
              {business.email && (
                <a href={`mailto:${business.email}`} className="flex items-center gap-3 hover:opacity-70 transition-opacity"><Mail size={16} style={{ color: 'var(--t-accent)' }} /> {business.email}</a>
              )}
              {business.phone && (
                <a href={`tel:${business.phone}`} className="flex items-center gap-3 hover:opacity-70 transition-opacity"><Phone size={16} style={{ color: 'var(--t-accent)' }} /> {business.phone}</a>
              )}
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 text-xs" style={{ borderColor: 'var(--t-border)', color: 'var(--t-text-muted)' }}>
          <p>© {year} {business.name}. All rights reserved.</p>
          <p>Designed and powered by <a href="https://bukd.co" target="_blank" rel="noreferrer" className="font-bold hover:underline" style={{ color: 'var(--t-text-primary)' }}>Bukd</a></p>
        </div>
      </div>
    </footer>
  );
};
