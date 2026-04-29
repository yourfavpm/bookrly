import React from 'react';
import { motion } from 'framer-motion';
import { getOptimizedImageUrl } from '../../../utils/images';
import type { SectionProps } from '../templates/types';

interface HeroProps extends SectionProps {
  variant?: 'full-image' | 'split' | 'centered' | 'noir' | 'card'; // Matching what TemplateRenderer maps to
}

export const HeroSection: React.FC<HeroProps> = ({ business, onBook, scrollTo, variant = 'centered' }) => {
  const renderTextContent = (align: 'left' | 'center' = 'left') => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className={`space-y-6 ${align === 'center' ? 'text-center items-center flex flex-col' : ''}`}
    >
      <div className="space-y-3">
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold" style={{ color: 'var(--t-accent)' }}>
          {business.category || 'Welcome'}
        </span>
        <h1 className={`text-4xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight`}
            style={{ fontFamily: 'var(--t-heading-font)', fontWeight: 'var(--t-heading-weight)', color: 'var(--t-text-primary)' }}>
          {business.heroTitle || 'Your premium headline goes here'}
        </h1>
      </div>
      
      <p className={`text-sm md:text-lg leading-relaxed max-w-xl`} style={{ color: 'var(--t-text-secondary)' }}>
        {business.heroSubtitle || 'Enter a supporting subheadline that builds trust and explains what you do best.'}
      </p>

      <div className={`flex flex-col sm:flex-row gap-4 pt-4 ${align === 'center' ? 'justify-center' : ''}`}>
        <button 
          onClick={onBook}
          className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-white transition-all hover:scale-105"
          style={{ backgroundColor: 'var(--t-accent)', borderRadius: 'var(--t-radius)' }}
        >
          {business.ctaText || 'Book Appointment'}
        </button>
        <button 
          onClick={() => scrollTo?.('services')}
          className="px-8 py-4 text-xs font-bold uppercase tracking-widest border transition-all hover:scale-105"
          style={{ borderColor: 'var(--t-border)', color: 'var(--t-text-primary)', borderRadius: 'var(--t-radius)' }}
        >
          View Services
        </button>
      </div>
    </motion.div>
  );

  if (variant === 'noir' || variant === 'full-image') {
    return (
      <section className="relative min-h-[90svh] flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {business.coverImage ? (
            <img src={getOptimizedImageUrl(business.coverImage, { width: 1920 })} className="w-full h-full object-cover" alt="Hero" />
          ) : (
            <div className="w-full h-full" style={{ backgroundColor: 'var(--t-bg-secondary)' }} />
          )}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
        </div>
        
        <div className="relative z-10 max-w-4xl px-6 py-20" style={{ '--t-text-primary': '#FFFFFF', '--t-text-secondary': '#E5E5E5' } as any}>
          {renderTextContent('center')}
        </div>
      </section>
    );
  }

  if (variant === 'split') {
    return (
      <section className="relative min-h-[85svh] flex items-center overflow-hidden">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 min-h-[85svh]">
          <div className="flex flex-col justify-center px-8 md:px-16 lg:px-24 py-20 z-10" style={{ backgroundColor: 'var(--t-bg-primary)' }}>
            {renderTextContent('left')}
          </div>
          <div className="relative h-[50vh] md:h-auto overflow-hidden">
            {business.coverImage ? (
              <img src={getOptimizedImageUrl(business.coverImage, { width: 1400 })} className="w-full h-full object-cover" alt="Hero" />
            ) : (
              <div className="w-full h-full" style={{ backgroundColor: 'var(--t-bg-secondary)' }} />
            )}
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'card') {
    return (
      <section className="relative py-20 md:py-32 px-6" style={{ backgroundColor: 'var(--t-bg-secondary)' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            {renderTextContent('left')}
          </div>
          <div className="flex-1 w-full max-w-md p-8 shadow-2xl" style={{ backgroundColor: 'var(--t-card-bg)', borderRadius: 'var(--t-radius)', border: '1px solid var(--t-border)' }}>
            <h3 className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--t-heading-font)', color: 'var(--t-text-primary)' }}>Request an Appointment</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Your Name" className="w-full p-3 text-sm border" style={{ borderColor: 'var(--t-border)', borderRadius: 'var(--t-radius)', background: 'transparent', color: 'var(--t-text-primary)' }} />
              <input type="email" placeholder="Email Address" className="w-full p-3 text-sm border" style={{ borderColor: 'var(--t-border)', borderRadius: 'var(--t-radius)', background: 'transparent', color: 'var(--t-text-primary)' }} />
              <button onClick={onBook} className="w-full py-4 text-xs font-bold uppercase tracking-widest text-white mt-2" style={{ backgroundColor: 'var(--t-accent)', borderRadius: 'var(--t-radius)' }}>
                Select Service & Time
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Centered
  return (
    <section className="relative min-h-[75svh] flex flex-col items-center justify-center text-center px-6 py-20">
      <div className="max-w-3xl z-10">
        {renderTextContent('center')}
      </div>
      {business.coverImage && (
        <div className="w-full max-w-6xl mx-auto mt-16 h-[40vh] md:h-[60vh] overflow-hidden shadow-2xl" style={{ borderRadius: 'var(--t-radius)' }}>
          <img src={getOptimizedImageUrl(business.coverImage, { width: 1600 })} className="w-full h-full object-cover" alt="Hero" />
        </div>
      )}
    </section>
  );
};
