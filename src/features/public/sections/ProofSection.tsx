import React from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon } from 'lucide-react';
import { getOptimizedImageUrl } from '../../../utils/images';
import type { SectionProps } from '../templates/types';

interface ProofProps extends SectionProps {
  variant?: 'grid' | 'masonry' | 'filmstrip' | 'overlap-gallery' | 'visual-studio-masonry' | 'home-services-slider';
}

export const ProofSection: React.FC<ProofProps> = ({ business, isMobile, isPreview, variant = 'grid' }) => {
  const items = business.proofOfWork || [];
  const [sliderPos, setSliderPos] = React.useState(50);

  if ((business.trustSection !== 'proof' && business.trustSection !== 'both')) {
    return null;
  }

  if (items.length === 0 && !isPreview) {
    return null;
  }

  if (variant === 'home-services-slider') {
    const hasEnoughImages = items.length >= 2 && items[0].image_url && items[1].image_url;

    return (
      <section id="gallery" className="py-24 bg-slate-50 w-full px-6">
        <div className="max-w-[1200px] mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-sm font-bold tracking-widest uppercase text-slate-500 flex items-center justify-center gap-2">
              <span className="w-8 h-[2px]" style={{ backgroundColor: business.primaryColor }} />
              Real Results
              <span className="w-8 h-[2px]" style={{ backgroundColor: business.primaryColor }} />
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
              Before & After
            </h2>
            <p className="text-slate-600 font-medium text-lg pt-2">
              Slide to see the transformation difference our service makes.
            </p>
          </div>

          {hasEnoughImages ? (
            <div className="space-y-12">
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative w-full aspect-square md:aspect-[21/9] rounded-[32px] overflow-hidden shadow-2xl bg-slate-200 group"
              >
                {/* After Image (Background) */}
                <div className="absolute inset-0">
                  <img 
                    src={getOptimizedImageUrl(items[1].image_url!, { width: 1200, quality: 80 })} 
                    alt={items[1].caption || "After result"} 
                    className="w-full h-full object-cover" 
                    loading="lazy"
                  />
                  <div className="absolute top-6 right-6 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-slate-900 shadow-sm z-0">AFTER</div>
                </div>
                
                {/* Before Image (Foreground, Clipped) */}
                <div 
                  className="absolute inset-0 z-10"
                  style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
                >
                  <img 
                    src={getOptimizedImageUrl(items[0].image_url!, { width: 1200, quality: 80 })} 
                    alt={items[0].caption || "Before result"} 
                    className="w-full h-full object-cover" 
                    loading="lazy"
                  />
                  <div className="absolute top-6 left-6 px-4 py-2 bg-slate-900/90 backdrop-blur-sm rounded-full text-xs font-bold text-white shadow-sm">BEFORE</div>
                </div>

                {/* Slider Handle & Line */}
                <div 
                  className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize drop-shadow-lg z-20 pointer-events-none" 
                  style={{ left: `calc(${sliderPos}% - 2px)` }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8l4 4-4 4M6 16l-4-4 4-4"/></svg>
                  </div>
                </div>

                {/* Invisible Range Input for Dragging */}
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={sliderPos}
                  onChange={(e) => setSliderPos(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
                />
              </motion.div>

              {/* Remaining grid if more than 2 items exist */}
              {items.length > 2 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {items.slice(2).map((item, idx) => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      className="aspect-square rounded-2xl overflow-hidden shadow-sm relative group cursor-pointer"
                    >
                      {item.image_url ? (
                        <img 
                          src={getOptimizedImageUrl(item.image_url, { width: 600, quality: 75 })} 
                          alt={item.caption} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400"><ImageIcon size={24} /></div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="w-full py-20 border-2 border-dashed border-slate-200 rounded-[32px] text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-slate-400 mx-auto"><ImageIcon size={24} /></div>
              <div>
                <p className="text-slate-900 font-bold">Add at least 2 images for the Before & After Slider</p>
                <p className="text-sm font-medium text-slate-500 mt-1">The first two images in your portfolio will be used as the split comparison.</p>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

  if (variant === 'overlap-gallery') {
    const displayItems = items.slice(0, 3);
    
    return (
      <section id="gallery" className="relative pt-0 pb-16 md:pb-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Overlapping first image from hero - only on desktop */}
          {!isMobile && displayItems.length > 0 && displayItems[0].image_url && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-12 md:mb-16 -mt-32 md:-mt-40 relative z-10 max-w-2xl"
            >
              <div className="aspect-4/5 bg-white p-2 rounded-sm shadow-lg">
                <div className="w-full h-full bg-text-primary/5 rounded-sm overflow-hidden">
                  <img 
                    src={getOptimizedImageUrl(displayItems[0].image_url, { width: 800, quality: 80 })} 
                    alt={displayItems[0].caption || 'Portfolio'} 
                    className="w-full h-full object-cover"
                    loading="lazy"
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
          <div className="space-y-2 mb-12 md:mb-16">
            <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-text-tertiary">
              Portfolio
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-text-primary">
              Featured Work
            </h2>
          </div>

          {/* Mobile: standard grid, Desktop: 2 Large + 1 Small Mixed Grid */}
          {displayItems.length > 1 && (
            <>
              <div className={isMobile ? "grid grid-cols-2 gap-4" : "grid grid-cols-12 gap-6"}>
                {/* Large image - full width on mobile, 7/12 on desktop */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  viewport={{ once: true }}
                  className={`${isMobile ? 'col-span-2' : 'md:col-span-7'} aspect-4/3 bg-text-primary/5 rounded-sm overflow-hidden group cursor-zoom-in`}
                >
                  {displayItems[1].image_url && (
                    <img 
                      src={getOptimizedImageUrl(displayItems[1].image_url, { width: 1000, quality: 80 })} 
                      alt={displayItems[1].caption || 'Portfolio'} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                  )}
                </motion.div>

                {/* Right column: small on top, large below - full width on mobile */}
                {displayItems.length > 2 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                    className={`${isMobile ? 'col-span-2' : 'md:col-span-5'} aspect-square bg-text-primary/5 rounded-sm overflow-hidden group cursor-zoom-in`}
                  >
                    {displayItems[2].image_url && (
                      <img 
                        src={getOptimizedImageUrl(displayItems[2].image_url, { width: 800, quality: 80 })} 
                        alt={displayItems[2].caption || 'Portfolio'} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                    )}
                  </motion.div>
                )}
              </div>

              {/* Captions below grid */}
              <div className={isMobile ? "grid grid-cols-2 gap-4 mt-4" : "grid grid-cols-12 gap-6 mt-4"}>
                <div className={isMobile ? "col-span-2" : "md:col-span-7"}>
                  {displayItems[1].caption && (
                    <p className="text-xs text-text-tertiary uppercase tracking-wider font-medium">
                      {displayItems[1].caption}
                    </p>
                  )}
                </div>
                <div className={isMobile ? "col-span-2" : "md:col-span-5"}>
                  {displayItems.length > 2 && displayItems[2].caption && (
                    <p className="text-xs text-text-tertiary uppercase tracking-wider font-medium">
                      {displayItems[2].caption}
                    </p>
                  )}
                </div>
              </div>
            </>
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
                  <img 
                    src={getOptimizedImageUrl(item.image_url, { width: 400, quality: 75 })} 
                    alt={item.caption} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    loading="lazy"
                  />
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
              <img 
                src={getOptimizedImageUrl(item.image_url, { width: 600, quality: 80 })} 
                alt={item.caption} 
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                loading="lazy"
              />
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
