import React from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon } from 'lucide-react';
import type { SectionProps } from '../templates/types';

interface ProofProps extends SectionProps {
  variant?: 'grid' | 'masonry' | 'filmstrip' | 'overlap-gallery';
}

export const ProofSection: React.FC<ProofProps> = ({ business, isMobile, isPreview, variant = 'grid' }) => {
  const items = business.proofOfWork || [];

  if ((business.trustSection !== 'proof' && business.trustSection !== 'both')) {
    return null;
  }

  if (items.length === 0 && !isPreview) {
    return null;
  }

  if (variant === 'overlap-gallery') {
    const displayItems = items.slice(0, 3);
    
    return (
      <section id="gallery" className="relative pt-0 pb-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Overlapping first image from hero - uses negative margin */}
          {displayItems.length > 0 && displayItems[0].image_url && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-16 -mt-32 md:-mt-40 relative z-10 max-w-2xl"
            >
              <div className="aspect-4/5 bg-white p-2 rounded-sm shadow-lg">
                <div className="w-full h-full bg-text-primary/5 rounded-sm overflow-hidden">
                  <img 
                    src={displayItems[0].image_url} 
                    alt={displayItems[0].caption || 'Portfolio'} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              {displayItems[0].caption && (
                <p className="mt-3 text-xs text-text-tertiary uppercase tracking-wider font-medium">
                  {displayItems[0].caption}
                </p>
              )}
            </motion.div>
          )}

          {/* Gallery section title */}
          <div className="space-y-2 mb-16">
            <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-text-tertiary">
              Portfolio
            </span>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-text-primary">
              Featured Work
            </h2>
          </div>

          {/* 2 Large + 1 Small Mixed Grid */}
          {displayItems.length > 1 && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Large image top-left */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                viewport={{ once: true }}
                className="md:col-span-7 aspect-4/3 bg-text-primary/5 rounded-sm overflow-hidden group cursor-zoom-in"
              >
                {displayItems[1].image_url && (
                  <img 
                    src={displayItems[1].image_url} 
                    alt={displayItems[1].caption || 'Portfolio'} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                )}
              </motion.div>

              {/* Right column: small on top, large below */}
              <div className="md:col-span-5 space-y-6">
                {displayItems.length > 2 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="aspect-square bg-text-primary/5 rounded-sm overflow-hidden group cursor-zoom-in"
                  >
                    {displayItems[2].image_url && (
                      <img 
                        src={displayItems[2].image_url} 
                        alt={displayItems[2].caption || 'Portfolio'} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          )}

          {/* Captions below grid */}
          {displayItems.length > 1 && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-4">
              <div className="md:col-span-7">
                {displayItems[1].caption && (
                  <p className="text-xs text-text-tertiary uppercase tracking-wider font-medium">
                    {displayItems[1].caption}
                  </p>
                )}
              </div>
              <div className="md:col-span-5">
                {displayItems.length > 2 && displayItems[2].caption && (
                  <p className="text-xs text-text-tertiary uppercase tracking-wider font-medium">
                    {displayItems[2].caption}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

  if (variant === 'filmstrip') {
    return (
      <section id="gallery" className="py-24 w-full space-y-12">
        <div className="max-w-6xl mx-auto px-6 space-y-3">
          <span className="text-[10px] font-medium uppercase tracking-[0.3em]" style={{ color: business.primaryColor }}>Our Work</span>
          <h2 className="text-3xl font-medium tracking-tight text-text-primary">Portfolio</h2>
        </div>
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 px-6 min-w-min">
            {business.proofOfWork.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} viewport={{ once: true }} className="w-64 h-80 shrink-0 rounded-3xl overflow-hidden shadow-md group relative">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.caption} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full bg-bg-secondary flex items-center justify-center text-text-tertiary"><ImageIcon size={32} /></div>
                )}
                {item.caption && (
                  <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-medium">{item.caption}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Default: grid
  return (
    <section id="gallery" className="py-24 px-6 max-w-7xl mx-auto w-full space-y-16 text-center">
      <div className="space-y-3">
        <span className="text-[10px] font-medium uppercase tracking-[0.3em]" style={{ color: business.primaryColor }}>Our Work</span>
        <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-text-primary">Portfolio Showcase</h2>
        <div className="w-12 h-1 mx-auto rounded-full" style={{ backgroundColor: business.primaryColor }} />
      </div>
      <div className={`grid grid-cols-2 ${isMobile ? '' : 'lg:grid-cols-4'} gap-4 md:gap-6`}>
        {items.length > 0 ? items.map((item, index) => (
          <motion.div key={item.id} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }} viewport={{ once: true }} className="group relative aspect-square rounded-[32px] overflow-hidden shadow-md">
            {item.image_url ? (
              <img src={item.image_url} alt={item.caption} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
            ) : (
              <div className="w-full h-full bg-bg-secondary flex items-center justify-center text-text-tertiary"><ImageIcon size={32} /></div>
            )}
            {item.caption && (
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                <span className="text-white text-xs font-medium tracking-wider uppercase">{item.caption}</span>
              </div>
            )}
          </motion.div>
        )) : (
          <div className="col-span-full py-12 px-6 rounded-[32px] border-2 border-dashed border-border-light bg-bg-secondary/20 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-text-tertiary"><ImageIcon size={24} /></div>
            <div>
              <p className="text-sm font-bold text-text-primary">Gallery is empty</p>
              <p className="text-xs text-text-tertiary">Portfolio images you add will appear here.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
