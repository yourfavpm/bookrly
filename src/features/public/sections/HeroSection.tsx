import React from 'react';
import { motion } from 'framer-motion';
import type { SectionProps } from '../templates/types';

interface HeroProps extends SectionProps {
  scrollTo: (id: string) => void;
  variant?: 'centered' | 'split' | 'full-image' | 'card' | 'minimal' | 'editorial-luxe';
}

export const HeroSection: React.FC<HeroProps> = ({ business, onBook, scrollTo, isMobile, variant = 'centered' }) => {
  if (variant === 'editorial-luxe') {
    return (
      <section className="relative min-h-[600px] md:min-h-[700px] lg:min-h-[750px] flex items-center overflow-hidden bg-white">
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-0">
          {/* Left text column - full width on mobile, 35% on desktop */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="col-span-1 md:col-span-5 px-6 md:px-8 lg:px-12 py-16 md:py-20 lg:py-0 flex flex-col justify-center space-y-8 md:space-y-12 order-2 md:order-1"
          >
            {/* Small intro text */}
            <div className="space-y-1">
              <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-text-tertiary">
                {business.category || 'Premium Service'}
              </span>
              <div className="w-8 h-0.5 bg-text-primary rounded-full" />
            </div>

            {/* Headline - responsive sizing */}
            <h1 className={`${isMobile ? 'text-3xl' : 'text-4xl md:text-5xl lg:text-5xl'} font-light tracking-tight leading-[1.15] text-text-primary max-w-xs`}>
              {business.heroTitle || "Editorial\nluxe"}
            </h1>

            {/* Subtext */}
            <p className="text-sm md:text-base text-text-secondary leading-relaxed max-w-xs font-light">
              {business.heroSubtitle || "Refined, minimal design for the discerning professional."}
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button 
                onClick={onBook}
                className="px-6 md:px-8 py-3 md:py-3.5 bg-text-primary text-white rounded-sm text-sm font-medium tracking-wide hover:opacity-90 transition-opacity active:scale-95"
              >
                Schedule Now
              </button>
              <button 
                onClick={() => scrollTo('services')}
                className="px-6 md:px-8 py-3 md:py-3.5 border border-text-primary text-text-primary rounded-sm text-sm font-medium tracking-wide hover:bg-text-primary/5 transition-colors active:scale-95"
              >
                View Services
              </button>
            </div>
          </motion.div>

          {/* Right image column - responsive height */}
          <div className="col-span-1 md:col-span-7 h-64 md:h-80 lg:h-auto lg:absolute lg:right-0 lg:inset-y-0 order-1 md:order-2 md:relative md:h-full">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full"
            >
              {business.coverImage && (
                <img 
                  src={business.coverImage} 
                  alt="Hero"
                  className="w-full h-full object-cover"
                />
              )}
              {!business.coverImage && (
                <div className="w-full h-full bg-gradient-to-br from-text-primary/5 to-text-primary/10" />
              )}
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'split') {
    return (
      <section className="min-h-[600px] flex items-center px-6 md:px-12 py-20">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="space-y-8">
            <h1 className={`${isMobile ? 'text-3xl' : 'text-4xl md:text-5xl'} font-medium tracking-tight leading-[1.1] text-text-primary`}>
              {business.heroTitle || "Your premium headline goes here"}
            </h1>
            <p className={`${isMobile ? 'text-sm' : 'text-base'} text-text-secondary leading-relaxed max-w-md`}>
              {business.heroSubtitle || "Enter a supporting subheadline."}
            </p>
            <div className="flex gap-4">
              <button onClick={onBook} className="px-8 py-4 rounded-2xl text-white font-medium text-base shadow-xl transition-all hover:scale-[1.03] active:scale-95 border-none cursor-pointer" style={{ backgroundColor: business.primaryColor }}>
                Schedule Now
              </button>
              <button onClick={() => scrollTo('services')} className="px-8 py-4 rounded-2xl font-medium text-base border-2 border-border-default text-text-primary transition-all hover:bg-bg-secondary active:scale-95 cursor-pointer">
                Our Services
              </button>
            </div>
          </motion.div>
          {business.coverImage && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="aspect-4/5 rounded-[40px] overflow-hidden shadow-2xl">
              <img src={business.coverImage} className="w-full h-full object-cover" alt="Hero" />
            </motion.div>
          )}
        </div>
      </section>
    );
  }

  if (variant === 'full-image') {
    return (
      <section className="relative min-h-[700px] flex items-center justify-center">
        <div className="absolute inset-0">
          {business.coverImage && <img src={business.coverImage} className="w-full h-full object-cover" alt="Hero" />}
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 text-center max-w-3xl px-6 space-y-8">
          <h1 className={`${isMobile ? 'text-3xl' : 'text-4xl md:text-6xl'} font-medium tracking-tight leading-[1.1] text-white`}>
            {business.heroTitle || "Your premium headline goes here"}
          </h1>
          <p className={`${isMobile ? 'text-sm' : 'text-base md:text-lg'} text-white/80 leading-relaxed max-w-xl mx-auto`}>
            {business.heroSubtitle || "Enter a supporting subheadline."}
          </p>
          <button onClick={onBook} className="px-10 py-4 rounded-2xl text-white font-medium text-lg shadow-xl transition-all hover:scale-[1.03] active:scale-95 border-none cursor-pointer" style={{ backgroundColor: business.primaryColor }}>
            {business.ctaText || "Book Now"}
          </button>
        </motion.div>
      </section>
    );
  }

  if (variant === 'card') {
    return (
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="bg-bg-secondary rounded-[40px] p-12 md:p-20 text-center space-y-8">
            <span className="text-[10px] font-medium uppercase tracking-[0.3em]" style={{ color: business.primaryColor }}>{business.category}</span>
            <h1 className={`${isMobile ? 'text-3xl' : 'text-3xl md:text-5xl'} font-medium tracking-tight leading-[1.1] text-text-primary`}>
              {business.heroTitle || "Your premium headline goes here"}
            </h1>
            <p className={`text-text-secondary leading-relaxed max-w-lg mx-auto`}>
              {business.heroSubtitle || "Enter a supporting subheadline."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button onClick={onBook} className="px-10 py-4 rounded-2xl text-white font-medium text-base shadow-xl transition-all hover:scale-[1.03] active:scale-95 border-none cursor-pointer" style={{ backgroundColor: business.primaryColor }}>
                Schedule Now
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  if (variant === 'minimal') {
    return (
      <section className="py-32 px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-2xl mx-auto space-y-8">
          <h1 className={`${isMobile ? 'text-3xl' : 'text-4xl md:text-5xl'} font-light tracking-tight leading-[1.2] text-text-primary`}>
            {business.heroTitle || "Your premium headline goes here"}
          </h1>
          <p className="text-text-secondary leading-relaxed">
            {business.heroSubtitle || "Enter a supporting subheadline."}
          </p>
          <button onClick={onBook} className="px-10 py-4 rounded-full text-white font-medium shadow-lg transition-all hover:scale-[1.03] active:scale-95 border-none cursor-pointer" style={{ backgroundColor: business.primaryColor }}>
            {business.ctaText || "Get Started"}
          </button>
        </motion.div>
      </section>
    );
  }

  // Default: centered (current layout)
  return (
    <section className="relative min-h-[600px] flex items-center justify-center text-center overflow-hidden">
      <div className={`absolute inset-0 transition-opacity duration-1000 ${business.coverImage ? 'opacity-100' : 'opacity-0'}`}>
        {business.coverImage && <img src={business.coverImage} className="w-full h-full object-cover" alt="Hero" />}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
      </div>
      <div className={`absolute inset-0 transition-opacity duration-1000 ${business.coverImage ? 'opacity-0' : 'opacity-100'} bg-bg-secondary`} />
      
      <div className="relative z-10 max-w-4xl px-6 space-y-8 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-6">
          <h1 className={`${isMobile ? 'text-3xl' : 'text-4xl md:text-6xl'} font-medium tracking-tight leading-[1.1] ${business.coverImage ? 'text-white' : 'text-text-primary'}`}>
            {business.heroTitle || "Your premium headline goes here"}
          </h1>
          <p className={`${isMobile ? 'text-sm' : 'text-base md:text-lg'} max-w-xl mx-auto leading-relaxed opacity-90 ${business.coverImage ? 'text-white' : 'text-text-secondary'}`}>
            {business.heroSubtitle || "Enter a supporting subheadline."}
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 0.6 }} className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={onBook} className="px-10 py-4 rounded-2xl text-white font-medium text-lg shadow-xl transition-all hover:scale-[1.03] active:scale-95 border-none cursor-pointer" style={{ backgroundColor: business.primaryColor }}>
            Schedule Now
          </button>
          <button onClick={() => scrollTo('services')} className={`px-10 py-4 rounded-2xl font-medium text-lg border-2 backdrop-blur-md transition-all hover:bg-white/10 active:scale-95 cursor-pointer ${business.coverImage ? 'border-white/40 text-white' : 'border-border-default text-text-primary'}`}>
            Our Services
          </button>
        </motion.div>
      </div>
    </section>
  );
};
