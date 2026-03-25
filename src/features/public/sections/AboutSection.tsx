import React from 'react';
import { Instagram, Facebook, Twitter, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { SectionProps } from '../templates/types';

interface AboutProps extends SectionProps {
  variant?: 'split' | 'centered' | 'full-width' | 'editorial' | 'visual-studio-split' | 'home-services-short' | 'noir';
}

export const AboutSection: React.FC<AboutProps> = ({ business, onBook, variant = 'split' }) => {
  if (!business.aboutDescription) return null;

  const socials = (
    <div className="flex gap-6">
      {business.socials?.instagram && <a href={business.socials.instagram} target="_blank" rel="noreferrer"><Instagram size={20} className="text-text-tertiary hover:text-text-primary transition-all cursor-pointer" /></a>}
      {business.socials?.facebook && <a href={business.socials.facebook} target="_blank" rel="noreferrer"><Facebook size={20} className="text-text-tertiary hover:text-text-primary transition-all cursor-pointer" /></a>}
      {business.socials?.twitter && <a href={business.socials.twitter} target="_blank" rel="noreferrer"><Twitter size={20} className="text-text-tertiary hover:text-text-primary transition-all cursor-pointer" /></a>}
    </div>
  );

  if (variant === 'noir') {
    return (
      <section id="about" className="py-32 px-6 md:px-12 lg:px-24 bg-[#0B0B0D] overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
            {/* Left: Provider Portrait */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] overflow-hidden bg-[#121216] relative z-10">
                {business.aboutImage ? (
                  <img src={business.aboutImage} alt="Founder" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#121216] to-[#0B0B0D]" />
                )}
              </div>
              {/* Decorative Frame */}
              <div className="absolute -inset-4 border border-[#E8CFC0]/20 -z-0 translate-x-8 translate-y-8" />
            </motion.div>

            {/* Right: Story */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-10"
            >
              <div className="space-y-4">
                <span className="text-[10px] uppercase tracking-[0.4em] text-[#E8CFC0]/60 font-medium">The Art of Beauty</span>
                <h2 className="text-4xl md:text-5xl font-serif text-[#F5F5F7] leading-tight">
                  {business.aboutTitle || "Crafting Confidence Through Beauty"}
                </h2>
                <div className="w-12 h-[1px] bg-[#E8CFC0]" />
              </div>
              
              <div className="space-y-6">
                <p className="text-[#A1A1AA] text-lg leading-relaxed font-light whitespace-pre-wrap">
                  {business.aboutDescription}
                </p>
                
                <div className="flex flex-col sm:flex-row items-center gap-8 pt-4">
                   {socials}
                   <button 
                    onClick={() => scrollToSection('services')}
                    className="flex items-center gap-3 text-[#F5F5F7] text-[10px] tracking-[0.3em] uppercase font-bold hover:text-[#E8CFC0] transition-colors group"
                   >
                     Meet Your Artist
                     <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                   </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  if (variant === 'editorial') {
    return (
      <section id="about" className="py-16 md:py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-20 items-start">
            {/* Narrow text column - full width on mobile, left side on desktop */}
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="col-span-1 md:col-span-5 space-y-8"
            >
              <div className="space-y-3">
                <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-text-tertiary">
                  About
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-text-primary leading-[1.15]">
                  {business.aboutTitle || "About Us"}
                </h2>
              </div>

              {/* Editorial text */}
              <p className="text-sm md:text-base leading-relaxed text-text-secondary font-light whitespace-pre-wrap">
                {business.aboutDescription}
              </p>

              {/* Social links */}
              <div className="flex gap-6 pt-4">
                {socials}
              </div>
            </motion.div>

            {/* Image on right - full width on mobile, right side on desktop */}
            {business.aboutImage && (
              <motion.div 
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="col-span-1 md:col-span-7"
              >
                <div className="aspect-4/5 md:aspect-3/4 bg-text-primary/5 rounded-sm overflow-hidden">
                  <img 
                    src={business.aboutImage} 
                    alt="About"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    );
  }

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
