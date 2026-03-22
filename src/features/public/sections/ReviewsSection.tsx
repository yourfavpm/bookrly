import React from 'react';
import { Star } from 'lucide-react';
import type { SectionProps } from '../templates/types';

interface ReviewsProps extends SectionProps {
  variant?: 'grid' | 'vertical' | 'featured';
}

export const ReviewsSection: React.FC<ReviewsProps> = ({ business, isMobile, variant = 'grid' }) => {
  if ((business.trustSection !== 'reviews' && business.trustSection !== 'both') || (business.reviews || []).length === 0) {
    return null;
  }

  const renderStars = (rating: number) => (
    <div className="flex gap-1 text-amber-400">
      {[1,2,3,4,5].map(s => <Star key={s} size={14} className={s <= (rating || 5) ? 'fill-current' : 'text-border-default'} />)}
    </div>
  );

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
          {business.reviews.map(r => (
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
          ))}
        </div>
      </div>
    </section>
  );
};
