import React from 'react';
import { Star, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import type { SectionProps } from '../templates/types';

interface ReviewsProps extends SectionProps {
  variant?: 'grid' | 'vertical' | 'featured' | 'floating-stack' | 'visual-studio-strip' | 'home-services-trust';
}

export const ReviewsSection: React.FC<ReviewsProps> = ({ business, isMobile, isPreview, variant = 'grid' }) => {
  const reviews = business.reviews || [];

  if ((business.trustSection !== 'reviews' && business.trustSection !== 'both')) {
    return null;
  }

  if (reviews.length === 0 && !isPreview) {
    return null;
  }

  const renderStars = (rating: number) => (
    <div className="flex gap-1 text-amber-400">
      {[1,2,3,4,5].map(s => <Star key={s} size={14} className={s <= (rating || 5) ? 'fill-current' : 'text-border-default'} />)}
    </div>
  );

  if (variant === 'floating-stack') {
    const displayReviews = reviews.slice(0, 3);
    
    return (
      <section id="reviews" className="py-16 md:py-24 px-6 w-full bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="mb-12 md:mb-20 space-y-2">
            <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-text-tertiary">
              Reviews
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-text-primary">
              What clients say
            </h2>
          </div>

          {/* Mobile: vertical list, Desktop: floating stacked cards */}
          {isMobile ? (
            <div className="space-y-4">
              {displayReviews.map((review, idx) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="w-full bg-white border border-text-primary/10 rounded-sm p-6 space-y-4"
                >
                  {/* Stars */}
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star
                        key={s}
                        size={14}
                        className={s <= (review.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-border-default'}
                      />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-sm text-text-secondary leading-relaxed font-light">
                    "{review.comment}"
                  </p>

                  {/* Author */}
                  <div className="pt-4 border-t border-text-primary/5">
                    <p className="text-xs font-medium text-text-primary">
                      {review.customer_name || 'Client'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="relative h-[450px] flex items-center">
              {displayReviews.map((review, idx) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="w-96 bg-white border border-text-primary/10 rounded-sm p-6 space-y-4 shadow-lg absolute"
                  style={{
                    top: `${idx * 24}px`,
                    left: `${idx * 32}px`,
                    zIndex: displayReviews.length - idx,
                    transform: `rotate(${idx * 1.5}deg)`,
                  }}
                >
                  {/* Stars */}
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star
                        key={s}
                        size={14}
                        className={s <= (review.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-border-default'}
                      />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-sm text-text-secondary leading-relaxed font-light">
                    "{review.comment}"
                  </p>

                  {/* Author */}
                  <div className="pt-4 border-t border-text-primary/5">
                    <p className="text-xs font-medium text-text-primary">
                      {review.customer_name || 'Client'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  if (variant === 'vertical') {
    return (
      <section id="reviews" className="py-24 px-6 max-w-3xl mx-auto w-full space-y-12">
        <div className="space-y-3">
          <span className="text-[10px] font-medium uppercase tracking-[0.3em]" style={{ color: business.primaryColor }}>Testimonials</span>
          <h2 className="text-3xl font-medium tracking-tight text-text-primary">What our clients say</h2>
        </div>
        <div className="space-y-6">
          {business.reviews.map(r => (
            <div key={r.id} className="p-8 rounded-3xl border border-border-light bg-white space-y-4">
              {renderStars(r.rating)}
              <p className="text-text-secondary leading-relaxed italic">"{r.comment}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-border-light">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm" style={{ backgroundColor: `${business.primaryColor}10`, color: business.primaryColor }}>
                  {(r.customer_name || 'C').charAt(0)}
                </div>
                <span className="font-medium text-sm text-text-primary">{r.customer_name || 'Client'}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (variant === 'featured') {
    const featured = business.reviews[0];
    const rest = business.reviews.slice(1);
    return (
      <section id="reviews" className="py-24 px-6 max-w-6xl mx-auto w-full space-y-16 text-center">
        <div className="space-y-3">
          <span className="text-[10px] font-medium uppercase tracking-[0.3em]" style={{ color: business.primaryColor }}>Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-text-primary">What our clients say</h2>
        </div>
        {featured && (
          <div className="p-10 md:p-16 rounded-[40px] border border-border-light bg-bg-secondary/30 text-center space-y-6 max-w-3xl mx-auto">
            {renderStars(featured.rating)}
            <p className="text-xl md:text-2xl text-text-primary leading-relaxed italic font-light">"{featured.comment}"</p>
            <span className="text-sm font-medium text-text-secondary block">— {featured.customer_name || 'Client'}</span>
          </div>
        )}
        {rest.length > 0 && (
          <div className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-2'} gap-6`}>
            {rest.map(r => (
              <div key={r.id} className="p-6 rounded-2xl border border-border-light bg-white text-left space-y-3">
                {renderStars(r.rating)}
                <p className="text-sm text-text-secondary italic line-clamp-3">"{r.comment}"</p>
                <span className="text-xs font-medium text-text-primary">{r.customer_name || 'Client'}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    );
  }

  if (variant === 'visual-studio-strip') {
    return (
      <section id="reviews" className="py-24 md:py-32 w-full bg-[#f8f8f8] overflow-hidden flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-4 mb-16 md:mb-24 px-6"
        >
          <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-text-tertiary">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-5xl font-light tracking-[-0.02em] text-text-primary">
            Client Stories
          </h2>
        </motion.div>

        {/* Edge-to-edge horizontally scrolling strip */}
        <div className="w-full relative">
          <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-12 px-6 md:px-[10vw] gap-6 md:gap-12" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {reviews.map((r, idx) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "0px -50px" }}
                transition={{ duration: 1, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="snap-center shrink-0 w-[85vw] md:w-[600px] lg:w-[700px] flex flex-col space-y-8"
              >
                <div className="flex gap-1 text-black">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star
                      key={s}
                      size={12}
                      className={s <= (r.rating || 5) ? 'fill-current' : 'text-border-default fill-border-default/20'}
                    />
                  ))}
                </div>
                
                <p className="text-2xl md:text-3xl lg:text-4xl font-light text-text-primary leading-[1.3] tracking-tight text-balance">
                  "{r.comment}"
                </p>
                
                <div className="flex items-center gap-4 pt-4 border-t border-border-polaris/40 w-fit">
                  <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-text-primary">
                    {r.customer_name || 'Client'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Subtle fade edges on desktop */}
          <div className="hidden md:block absolute inset-y-0 left-0 w-[10vw] bg-gradient-to-r from-[#f8f8f8] to-transparent pointer-events-none" />
          <div className="hidden md:block absolute inset-y-0 right-0 w-[10vw] bg-gradient-to-l from-[#f8f8f8] to-transparent pointer-events-none" />
        </div>
        
        {/* CSS to hide scrollbar */}
        <style dangerouslySetInnerHTML={{__html: `
          .hide-scrollbar::-webkit-scrollbar { display: none; }
        `}} />
      </section>
    );
  }

  if (variant === 'home-services-trust') {
    return (
      <section id="reviews" className="py-24 px-6 w-full bg-white border-y border-slate-100 z-10 relative">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
          
          {/* Left: Trust Block Summary */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-8">
             <span className="text-sm font-bold tracking-widest uppercase text-slate-500 flex items-center gap-2">
               <span className="w-8 h-[2px]" style={{ backgroundColor: business.primaryColor }} />
               Client Reviews
             </span>
             <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
               Trusted by Homeowners
             </h2>
             
             <div className="p-8 rounded-[32px] bg-slate-50 border border-slate-200 space-y-4">
                <p className="text-6xl font-extrabold text-slate-900">5.0</p>
                <div className="flex gap-2 text-amber-500">
                  <Star size={24} className="fill-current" /><Star size={24} className="fill-current" /><Star size={24} className="fill-current" /><Star size={24} className="fill-current" /><Star size={24} className="fill-current" />
                </div>
                <p className="text-slate-600 font-bold max-w-[200px]">
                  Based on multiple verified reviews
                </p>
             </div>
          </div>

          {/* Right: Testimonials Grid */}
          <div className="lg:col-span-8">
            {reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map((r, idx) => (
                  <motion.div 
                    key={r.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="p-8 rounded-[32px] bg-white border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-start gap-6 relative"
                  >
                     <div className="flex gap-1 text-amber-500">
                        {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} className={s <= (r.rating || 5) ? 'fill-current' : 'text-slate-200 fill-slate-100'} />)}
                     </div>
                     <p className="text-lg text-slate-700 font-medium leading-relaxed italic">"{r.comment}"</p>
                     
                     <div className="mt-auto pt-6 flex items-center gap-4 w-full">
                        <div className="w-10 h-10 rounded-full flex shrink-0 items-center justify-center font-bold text-slate-600 bg-slate-100">
                          {(r.customer_name || 'C').charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="block font-bold text-slate-900 truncate">{r.customer_name || 'Anonymous Client'}</span>
                          <span className="text-xs font-bold text-slate-500 tracking-wider flex items-center gap-1.5 mt-0.5"><ShieldCheck size={14} className="text-emerald-500"/> Verified</span>
                        </div>
                     </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="w-full h-full min-h-[300px] border-2 border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center text-center space-y-4 p-12">
                <ShieldCheck size={48} className="text-slate-300" />
                <div>
                  <p className="text-slate-900 font-bold text-lg">Build Trust with Reviews</p>
                  <p className="text-slate-500 font-medium">Add reviews in the customizer to populate this section.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // Default: grid
  return (
    <section id="reviews" className="py-24 bg-bg-secondary/40 w-full px-6 text-center">
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="space-y-3">
          <span className="text-[10px] font-medium uppercase tracking-[0.3em]" style={{ color: business.primaryColor }}>Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-text-primary">What our clients say</h2>
          <div className="w-12 h-1 mx-auto rounded-full" style={{ backgroundColor: business.primaryColor }} />
        </div>
        <div className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-2 lg:grid-cols-3'} gap-8`}>
          {reviews.length > 0 ? reviews.map(r => (
            <div key={r.id} className="p-8 rounded-3xl bg-white border border-border-light shadow-sm space-y-6 flex flex-col h-full hover:shadow-lg transition-all duration-500">
              {renderStars(r.rating)}
              <p className="text-lg text-text-secondary leading-relaxed italic opacity-90 overflow-hidden line-clamp-4">"{r.comment}"</p>
              <div className="flex items-center gap-4 pt-6 mt-auto border-t border-dashed border-border-light">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center font-medium text-lg shadow-sm" style={{ backgroundColor: `${business.primaryColor}10`, color: business.primaryColor }}>
                  {(r.customer_name || 'C').charAt(0)}
                </div>
                <div className="text-left">
                  <span className="block font-medium text-sm text-text-primary">{r.customer_name || 'Anonymous Client'}</span>
                  <span className="text-[10px] font-medium text-text-tertiary uppercase tracking-widest">Client</span>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-12 px-6 rounded-3xl border-2 border-dashed border-border-light bg-bg-secondary/20 flex flex-col items-center justify-center text-center space-y-4">
               <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-amber-400"><Star size={24} /></div>
               <div>
                  <p className="text-sm font-bold text-text-primary">No testimonials yet</p>
                  <p className="text-xs text-text-tertiary">Add client reviews in the sidebar to see them here.</p>
               </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
