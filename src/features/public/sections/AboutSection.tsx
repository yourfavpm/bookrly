import React from 'react';
import { getOptimizedImageUrl } from '../../../utils/images';
import type { SectionProps } from '../templates/types';

interface AboutProps extends SectionProps {
  variant?: 'editorial' | 'split' | 'centered';
}

export const AboutSection: React.FC<AboutProps> = ({ business, variant = 'centered' }) => {
  if (variant === 'editorial') {
    return (
      <section id="about" style={{ padding: `var(--t-section-gap, 80px) 0` }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-16 md:gap-24 items-start">
            <div className="w-full md:w-5/12 space-y-6 sticky top-32">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: 'var(--t-accent)' }}>The Philosophy</p>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight" style={{ fontFamily: 'var(--t-heading-font)', fontWeight: 'var(--t-heading-weight)', color: 'var(--t-text-primary)' }}>
                {business.aboutTitle || 'Our Story'}
              </h2>
            </div>
            <div className="w-full md:w-7/12 space-y-8">
              {business.aboutImage && (
                <div className="aspect-[4/5] w-full overflow-hidden mb-12" style={{ borderRadius: 'var(--t-radius)' }}>
                  <img src={getOptimizedImageUrl(business.aboutImage, { width: 800 })} className="w-full h-full object-cover" alt="About" />
                </div>
              )}
              <div className="prose prose-sm md:prose-base leading-loose" style={{ color: 'var(--t-text-secondary)', fontFamily: 'var(--t-body-font)' }}>
                <p>{business.aboutDescription || 'Share the story behind your business. What drives you? What makes your approach unique? This is the place to connect with your clients on a personal level.'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'split') {
    return (
      <section id="about" style={{ padding: `var(--t-section-gap, 80px) 0`, backgroundColor: 'var(--t-bg-secondary)' }}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          {business.aboutImage && (
            <div className="aspect-square md:aspect-[4/5] w-full overflow-hidden shadow-2xl" style={{ borderRadius: 'var(--t-radius)' }}>
              <img src={getOptimizedImageUrl(business.aboutImage, { width: 1000 })} className="w-full h-full object-cover" alt="About" />
            </div>
          )}
          <div className="space-y-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: 'var(--t-accent)' }}>About Us</p>
            <h2 className="text-3xl md:text-5xl font-bold" style={{ fontFamily: 'var(--t-heading-font)', fontWeight: 'var(--t-heading-weight)', color: 'var(--t-text-primary)' }}>
              {business.aboutTitle || 'Our Story'}
            </h2>
            <div className="w-12 h-1 mb-8" style={{ backgroundColor: 'var(--t-accent)' }} />
            <p className="text-base md:text-lg leading-relaxed" style={{ color: 'var(--t-text-secondary)' }}>
              {business.aboutDescription || 'Share the story behind your business. What drives you? What makes your approach unique? This is the place to connect with your clients on a personal level.'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  // centered
  return (
    <section id="about" style={{ padding: `var(--t-section-gap, 80px) 0` }}>
      <div className="max-w-4xl mx-auto px-6 text-center">
        {business.aboutImage && (
          <div className="w-32 h-32 md:w-48 md:h-48 mx-auto mb-10 overflow-hidden shadow-xl" style={{ borderRadius: 'var(--t-radius)' }}>
            <img src={getOptimizedImageUrl(business.aboutImage, { width: 400 })} className="w-full h-full object-cover" alt="Founder" />
          </div>
        )}
        <div className="space-y-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: 'var(--t-accent)' }}>Welcome</p>
          <h2 className="text-3xl md:text-5xl font-bold" style={{ fontFamily: 'var(--t-heading-font)', fontWeight: 'var(--t-heading-weight)', color: 'var(--t-text-primary)' }}>
            {business.aboutTitle || 'Our Story'}
          </h2>
          <p className="text-base md:text-lg leading-relaxed mx-auto max-w-2xl" style={{ color: 'var(--t-text-secondary)' }}>
            {business.aboutDescription || 'Share the story behind your business. What drives you? What makes your approach unique? This is the place to connect with your clients on a personal level.'}
          </p>
        </div>
      </div>
    </section>
  );
};
