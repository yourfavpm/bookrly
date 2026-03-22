import React from 'react';
import { Instagram, Facebook, Twitter, ChevronRight } from 'lucide-react';
import type { SectionProps } from '../templates/types';

interface AboutProps extends SectionProps {
  variant?: 'split' | 'centered' | 'full-width';
}

export const AboutSection: React.FC<AboutProps> = ({ business, onBook, variant = 'split' }) => {
  if (!business.aboutDescription) return null;

  const socials = (
    <div className="flex gap-6">
      {business.socials?.instagram && <a href={business.socials.instagram} target="_blank" rel="noreferrer"><Instagram size={20} className="text-text-tertiary hover:text-brand transition-all cursor-pointer" /></a>}
      {business.socials?.facebook && <a href={business.socials.facebook} target="_blank" rel="noreferrer"><Facebook size={20} className="text-text-tertiary hover:text-brand transition-all cursor-pointer" /></a>}
      {business.socials?.twitter && <a href={business.socials.twitter} target="_blank" rel="noreferrer"><Twitter size={20} className="text-text-tertiary hover:text-brand transition-all cursor-pointer" /></a>}
    </div>
  );

  if (variant === 'centered') {
    return (
      <section id="about" className="py-24 px-6 max-w-3xl mx-auto text-center space-y-8">
        <span className="text-[10px] font-medium uppercase tracking-[0.3em]" style={{ color: business.primaryColor }}>Our Story</span>
        <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-text-primary">{business.aboutTitle || "About Us"}</h2>
        {business.aboutImage && <img src={business.aboutImage} alt="About" className="w-full rounded-[40px] shadow-lg aspect-video object-cover" />}
        <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">{business.aboutDescription}</p>
        <div className="flex justify-center gap-8 items-center">
          {socials}
          <button onClick={onBook} className="font-medium flex items-center gap-2 bg-transparent border-none cursor-pointer transition-all hover:translate-x-1" style={{ color: business.primaryColor }}>
            {business.ctaText || "Book Visit"} <ChevronRight size={20} />
          </button>
        </div>
      </section>
    );
  }

  if (variant === 'full-width') {
    return (
      <section id="about" className="py-24 px-6 bg-bg-secondary">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <span className="text-[10px] font-medium uppercase tracking-[0.3em]" style={{ color: business.primaryColor }}>Our Story</span>
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-text-primary leading-tight">{business.aboutTitle || "About Us"}</h2>
            <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">{business.aboutDescription}</p>
            <div className="flex items-center gap-8">
              {socials}
              <button onClick={onBook} className="font-medium flex items-center gap-2 bg-transparent border-none cursor-pointer transition-all hover:translate-x-1" style={{ color: business.primaryColor }}>
                {business.ctaText || "Book Visit"} <ChevronRight size={20} />
              </button>
            </div>
          </div>
          {business.aboutImage && (
            <img src={business.aboutImage} alt="About" className="rounded-[40px] shadow-2xl w-full object-cover aspect-4/5" />
          )}
        </div>
      </section>
    );
  }

  // Default: split
  return (
    <section id="about" className="py-24 px-6 max-w-6xl mx-auto w-full">
      <div className={`grid grid-cols-1 ${business.aboutImage ? 'lg:grid-cols-2' : ''} gap-16 md:gap-24 items-center`}>
        {business.aboutImage && (
          <div className="relative group">
            <div className="absolute -top-24 -left-20 w-64 h-64 rounded-full blur-2xl opacity-20 animate-pulse" style={{ backgroundColor: business.primaryColor }} />
            <img src={business.aboutImage} alt="About Us" className="rounded-[40px] shadow-2xl relative z-10 w-full object-cover aspect-4/5 transform group-hover:scale-[1.01] transition-transform duration-700" />
          </div>
        )}
        <div className="space-y-10 text-left">
          <div className="space-y-4">
            <span className="text-[10px] font-medium uppercase tracking-[0.3em]" style={{ color: business.primaryColor }}>Our Story</span>
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-text-primary leading-tight">{business.aboutTitle || "Elevating your lifestyle daily"}</h2>
            <div className="w-12 h-1 rounded-full" style={{ backgroundColor: business.primaryColor }} />
          </div>
          <p className="text-lg text-text-secondary leading-relaxed opacity-80 whitespace-pre-wrap">{business.aboutDescription}</p>
          <div className="pt-4 flex flex-wrap items-center gap-8">
            {socials}
            <button onClick={onBook} className="text-lg font-medium flex items-center gap-2 group bg-transparent border-none cursor-pointer transition-all hover:translate-x-1" style={{ color: business.primaryColor }}>
              {business.ctaText || "Book Visit"} <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
