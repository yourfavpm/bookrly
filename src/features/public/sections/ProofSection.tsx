import React from 'react';
import { getOptimizedImageUrl } from '../../../utils/images';
import type { SectionProps } from '../templates/types';

interface ProofProps extends SectionProps {
  variant?: 'masonryGrid' | 'carousel' | 'fullBleed' | 'cardGrid';
}

export const ProofSection: React.FC<ProofProps> = ({ business, variant = 'masonryGrid' }) => {
  const images = business.proofOfWork || [];

  if (images.length === 0) return null;

  if (variant === 'fullBleed') {
    return (
      <section id="portfolio" style={{ backgroundColor: 'var(--t-bg-primary)' }}>
        <div className="w-full flex overflow-x-auto snap-x snap-mandatory hide-scrollbar">
          {images.map((img, i) => (
            <div key={img.id || i} className="w-[85vw] md:w-1/2 lg:w-1/3 h-[60vh] shrink-0 snap-center relative group">
              <img src={getOptimizedImageUrl(img.image_url, { width: 800 })} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Work" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                <p className="text-white text-lg font-bold" style={{ fontFamily: 'var(--t-heading-font)' }}>{img.caption || 'Our Work'}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (variant === 'carousel') {
    return (
      <section id="portfolio" style={{ padding: `var(--t-section-gap, 80px) 0`, backgroundColor: 'var(--t-bg-secondary)', overflow: 'hidden' }}>
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center mb-16 space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: 'var(--t-accent)' }}>Portfolio</p>
            <h2 className="text-3xl md:text-5xl font-bold" style={{ fontFamily: 'var(--t-heading-font)', fontWeight: 'var(--t-heading-weight)', color: 'var(--t-text-primary)' }}>Featured Work</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-8 hide-scrollbar snap-x snap-mandatory">
            {images.map((img, i) => (
              <div key={img.id || i} className="snap-center shrink-0 w-[70vw] md:w-[400px] aspect-[4/5] overflow-hidden" style={{ borderRadius: 'var(--t-radius)' }}>
                <img src={getOptimizedImageUrl(img.image_url, { width: 600 })} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt="Work" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'cardGrid') {
    return (
      <section id="portfolio" style={{ padding: `var(--t-section-gap, 80px) 0` }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-16 space-y-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: 'var(--t-accent)' }}>Portfolio</p>
            <h2 className="text-3xl md:text-5xl font-bold" style={{ fontFamily: 'var(--t-heading-font)', fontWeight: 'var(--t-heading-weight)', color: 'var(--t-text-primary)' }}>Our Work</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((img, i) => (
              <div key={img.id || i} className="p-4 border group transition-all hover:scale-[1.02]"
                   style={{ borderColor: 'var(--t-border)', backgroundColor: 'var(--t-card-bg)', borderRadius: 'var(--t-radius)' }}>
                <div className="w-full aspect-[4/3] overflow-hidden mb-4" style={{ borderRadius: 'calc(var(--t-radius) * 0.8)' }}>
                  <img src={getOptimizedImageUrl(img.image_url, { width: 600 })} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Work" />
                </div>
                <h3 className="text-sm font-bold" style={{ color: 'var(--t-text-primary)' }}>{img.caption || 'Project Showcase'}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // masonryGrid (default)
  return (
    <section id="portfolio" style={{ padding: `var(--t-section-gap, 80px) 0` }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: 'var(--t-accent)' }}>Portfolio</p>
          <h2 className="text-3xl md:text-5xl font-bold" style={{ fontFamily: 'var(--t-heading-font)', fontWeight: 'var(--t-heading-weight)', color: 'var(--t-text-primary)' }}>Recent Work</h2>
        </div>
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {images.map((img, i) => (
            <div key={img.id || i} className="break-inside-avoid relative group overflow-hidden" style={{ borderRadius: 'var(--t-radius)' }}>
              <img src={getOptimizedImageUrl(img.image_url, { width: 600 })} className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700" alt="Work" />
              {img.caption && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <p className="text-white text-sm font-medium">{img.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
