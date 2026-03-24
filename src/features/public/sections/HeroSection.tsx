import React from 'react';
import { motion } from 'framer-motion';
import { getOptimizedImageUrl } from '../../../utils/images';
import { Star, Calendar as CalendarIcon, ShieldCheck, CheckCircle2, Zap, ChevronRight } from 'lucide-react';
import type { SectionProps } from '../templates/types';

interface HeroProps extends SectionProps {
  scrollTo: (id: string) => void;
  variant?: 'centered' | 'split' | 'full-image' | 'card' | 'minimal' | 'editorial-luxe' | 'visual-studio' | 'home-services-split';
}

export const HeroSection: React.FC<HeroProps> = ({ business, onBook, scrollTo, isMobile, variant = 'centered' }) => {
  if (variant === 'visual-studio') {
    return (
      <section className="relative min-h-[100svh] flex items-end pb-24 md:pb-32 px-6 md:px-12 lg:px-20 overflow-hidden bg-black">
        {/* Background Image with slow zoom */}
        <motion.div 
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          {business.coverImage ? (
            <img 
              src={getOptimizedImageUrl(business.coverImage, { width: 1920, quality: 85 })} 
              className="w-full h-full object-cover" 
              alt="Hero" 
              loading="eager"
              fetchPriority="high"
            />
          ) : (
             <div className="w-full h-full bg-[#1a1a1a]" />
          )}
          {/* Minimal soft overlay for text readability without darkening entire image */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        </motion.div>

        {/* Content Wrapper */}
        <div className="relative z-10 w-full max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-12 md:gap-24">
          
          {/* Left: Branding & Headline (Asymmetrical balance) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="space-y-6 max-w-3xl"
          >
            <div className="space-y-3">
              <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-white/50">
                {business.category || 'Creative Studio'}
              </span>
            </div>
            {/* Small, light typography but huge scale */}
            <h1 className={`${isMobile ? 'text-4xl' : 'text-5xl md:text-6xl lg:text-[5.5rem]'} font-light tracking-[-0.02em] leading-[1.05] text-white`}>
              {business.heroTitle || "Visual Studio"}
            </h1>
          </motion.div>

          {/* Right: Subtitle & CTA (Pushed to bottom right) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="flex flex-col space-y-10 md:max-w-[280px] shrink-0"
          >
            <p className="text-sm text-white/60 leading-relaxed font-light tracking-wide">
              {business.heroSubtitle || "A high-end visual experience tailored for the modern brand."}
            </p>
            <button 
              onClick={onBook}
              className="group flex items-center gap-4 text-white text-[10px] tracking-[0.2em] uppercase font-medium hover:text-white/70 transition-colors w-fit"
            >
              <div className="w-8 h-[1px] bg-white/40 group-hover:w-16 group-hover:bg-white transition-all duration-500 ease-out" />
              {business.ctaText || "Book Appointment"}
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  if (variant === 'home-services-split') {
    return (
      <section className="relative min-h-[90svh] w-full flex items-center pt-24 pb-16 px-6 lg:px-12 xl:px-24 bg-[#f8fafc] overflow-hidden">
        {/* Subtle background element */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-900/5 skew-x-[-15deg] translate-x-32 origin-top-right hidden lg:block" />
        
        <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 relative z-10 items-center">
          
          {/* Left: Text, CTA, Trust Badges */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8 max-w-2xl"
          >
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm">
              <Star size={14} className="text-amber-500 fill-amber-500" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">
                Top Rated {business.category || 'Service'}
              </span>
            </div>

            {/* Headline & Subtext */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-extrabold tracking-[-0.03em] leading-[1.05] text-slate-900">
                {business.name}
              </h1>
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium max-w-xl">
                {business.heroSubtitle || "Professional, reliable, and highly rated services tailored specifically for your needs."}
              </p>
            </div>

            {/* CTA & Trust Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-4">
              <button 
                onClick={onBook} 
                className="px-8 py-4 rounded-xl text-white font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-xl shadow-brand/20 flex items-center gap-2 border-none cursor-pointer" 
                style={{ backgroundColor: business.primaryColor }}
              >
                <CalendarIcon size={20} /> Request Service
              </button>
              
              <div className="flex items-center gap-4 text-sm font-bold text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-600">
                    <ShieldCheck size={16} />
                  </span>
                  Licensed & Insured
                </div>
              </div>
            </div>

            {/* Bottom Trust Row */}
            <div className="pt-8 mt-8 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-6">
              <div className="flex flex-col gap-1">
                <p className="font-extrabold text-2xl text-slate-900">5.0</p>
                <div className="flex gap-1 text-amber-500">
                  <Star size={12} className="fill-current" /><Star size={12} className="fill-current" /><Star size={12} className="fill-current" /><Star size={12} className="fill-current" /><Star size={12} className="fill-current" />
                </div>
                <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">Average Rating</p>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-2xl">
                  <CheckCircle2 size={24} className="text-emerald-500" /> 100%
                </div>
                <p className="text-xs font-bold text-slate-500 mt-2 uppercase tracking-wider">Satisfaction</p>
              </div>
              <div className="flex flex-col gap-1 hidden sm:flex">
                <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-2xl">
                  <Zap size={24} className="text-amber-500" /> 24/7
                </div>
                <p className="text-xs font-bold text-slate-500 mt-2 uppercase tracking-wider">Support Available</p>
              </div>
            </div>
          </motion.div>

          {/* Right: Booking Widget */}
          <motion.div 
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="w-full max-w-[500px] mx-auto lg:ml-auto lg:mr-0 p-8 md:p-10 bg-white rounded-[32px] shadow-2xl border border-slate-100 relative group"
          >
            {/* Top accent line */}
            <div className="absolute top-0 left-8 right-8 h-1.5 rounded-b-full" style={{ backgroundColor: business.primaryColor }} />
            
            <div className="text-center mb-8 space-y-2 mt-4">
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Get an Instant Quote</h3>
              <p className="text-sm font-medium text-slate-500">Fast, free, and no obligation.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-widest pl-2">Select Service</label>
                <div className="w-full h-14 bg-slate-50 border-2 border-slate-200 rounded-xl flex items-center justify-between px-4 text-slate-400 font-medium cursor-pointer hover:border-slate-300 transition-colors" onClick={onBook}>
                  <span>Choose what you need...</span>
                  <ChevronRight size={18} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-widest pl-2">Preferred Date</label>
                <div className="w-full h-14 bg-slate-50 border-2 border-slate-200 rounded-xl flex items-center justify-between px-4 text-slate-400 font-medium cursor-pointer hover:border-slate-300 transition-colors" onClick={onBook}>
                  <span>Select a date...</span>
                  <CalendarIcon size={18} />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  onClick={onBook}
                  className="w-full h-16 rounded-xl font-bold text-lg text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 border-none cursor-pointer"
                  style={{ backgroundColor: business.primaryColor }}
                >
                  Continue Booking
                </button>
                <p className="text-xs font-bold text-slate-400 text-center mt-4 flex items-center justify-center gap-1.5">
                  <ShieldCheck size={14} /> Secure & Encrypted Process
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </section>
    );
  }

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
                  src={getOptimizedImageUrl(business.coverImage, { width: 1200, quality: 80 })} 
                  alt="Hero"
                  className="w-full h-full object-cover"
                  loading="eager"
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
              <img 
                src={getOptimizedImageUrl(business.coverImage, { width: 1000, quality: 80 })} 
                className="w-full h-full object-cover" 
                alt="Hero" 
                loading="eager"
              />
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
          {business.coverImage && (
            <img 
              src={getOptimizedImageUrl(business.coverImage, { width: 1920, quality: 80 })} 
              className="w-full h-full object-cover" 
              alt="Hero" 
              loading="eager"
            />
          )}
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
        {business.coverImage && (
          <img 
            src={getOptimizedImageUrl(business.coverImage, { width: 1920, quality: 80 })} 
            className="w-full h-full object-cover" 
            alt="Hero" 
            loading="eager"
          />
        )}
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
