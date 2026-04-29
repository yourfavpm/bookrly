import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getOptimizedImageUrl } from '../../../utils/images';
import type { SectionProps } from '../templates/types';

interface BeforeAfterProps extends SectionProps {
  variant?: 'split' | 'carousel';
}

export const BeforeAfterSection: React.FC<BeforeAfterProps> = ({ business, variant = 'split' }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [sliderPos, setSliderPos] = useState(50);
  const images = business.proofOfWork && business.proofOfWork.length > 0 ? business.proofOfWork : [
    { id: '1', image_url: 'https://images.unsplash.com/photo-1516975080661-46bbf69b614c?q=80&w=1000', caption: 'Before' },
    { id: '2', image_url: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=1000', caption: 'After' },
    { id: '3', image_url: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=1000', caption: 'Before' },
    { id: '4', image_url: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=1000', caption: 'After' },
  ];

  // Need pairs for before/after — use sequential pairs from proofOfWork
  const pairs = [];
  for (let i = 0; i < images.length - 1; i += 2) {
    pairs.push({ before: images[i], after: images[i + 1] || images[i] });
  }
  if (pairs.length === 0 && images.length > 0) {
    pairs.push({ before: images[0], after: images[0] });
  }

  const hasPairs = pairs.length > 0;

  const SliderView = ({ before, after }: { before: typeof images[0]; after: typeof images[0] }) => (
    <div className="relative aspect-[4/3] overflow-hidden cursor-col-resize select-none" style={{ borderRadius: 'var(--t-radius)' }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setSliderPos(Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100)));
      }}
    >
      {/* After (full) */}
      <img src={getOptimizedImageUrl(after.image_url, { width: 800 })} alt="After" className="absolute inset-0 w-full h-full object-cover" />
      {/* Before (clipped) */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderPos}%` }}>
        <img src={getOptimizedImageUrl(before.image_url, { width: 800 })} alt="Before" className="absolute inset-0 w-full h-full object-cover" style={{ width: `${100 / (sliderPos / 100)}%`, maxWidth: 'none' }} />
      </div>
      {/* Divider */}
      <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10" style={{ left: `${sliderPos}%` }}>
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
          <ChevronLeft size={10} className="text-gray-600" /><ChevronRight size={10} className="text-gray-600" />
        </div>
      </div>
      {/* Labels */}
      <span className="absolute top-4 left-4 px-3 py-1 text-[9px] font-bold uppercase tracking-widest bg-black/50 text-white rounded-full z-10">Before</span>
      <span className="absolute top-4 right-4 px-3 py-1 text-[9px] font-bold uppercase tracking-widest bg-black/50 text-white rounded-full z-10">After</span>
    </div>
  );

  if (!hasPairs) {
    return (
      <section id="before-after" style={{ padding: `var(--t-section-gap, 80px) 0` }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-sm italic" style={{ color: 'var(--t-text-muted)' }}>Before & after gallery coming soon</p>
        </div>
      </section>
    );
  }

  if (variant === 'carousel') {
    return (
      <section id="before-after" style={{ padding: `var(--t-section-gap, 80px) 0` }}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14 space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: 'var(--t-accent)' }}>Results</p>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'var(--t-heading-font)', fontWeight: 'var(--t-heading-weight)', color: 'var(--t-text-primary)' }}>Before & After</h2>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={activeIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <SliderView before={pairs[activeIndex].before} after={pairs[activeIndex].after} />
            </motion.div>
          </AnimatePresence>
          {pairs.length > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <button onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))} disabled={activeIndex === 0} className="p-2 border rounded-full disabled:opacity-30 transition-opacity" style={{ borderColor: 'var(--t-border)' }}>
                <ChevronLeft size={16} style={{ color: 'var(--t-text-primary)' }} />
              </button>
              <span className="text-xs font-medium" style={{ color: 'var(--t-text-muted)' }}>{activeIndex + 1} / {pairs.length}</span>
              <button onClick={() => setActiveIndex(Math.min(pairs.length - 1, activeIndex + 1))} disabled={activeIndex === pairs.length - 1} className="p-2 border rounded-full disabled:opacity-30 transition-opacity" style={{ borderColor: 'var(--t-border)' }}>
                <ChevronRight size={16} style={{ color: 'var(--t-text-primary)' }} />
              </button>
            </div>
          )}
        </div>
      </section>
    );
  }

  // Split: side-by-side grid
  return (
    <section id="before-after" style={{ padding: `var(--t-section-gap, 80px) 0` }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14 space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: 'var(--t-accent)' }}>Results</p>
          <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'var(--t-heading-font)', fontWeight: 'var(--t-heading-weight)', color: 'var(--t-text-primary)' }}>Before & After</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pairs.slice(0, 4).map((pair, i) => (
            <SliderView key={i} before={pair.before} after={pair.after} />
          ))}
        </div>
      </div>
    </section>
  );
};
