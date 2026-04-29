import React from 'react';
import { Star, Quote } from 'lucide-react';
import type { SectionProps } from '../templates/types';

interface ReviewsProps extends SectionProps {
  variant?: 'floating-stack' | 'grid' | 'minimal' | 'editorial';
}

export const ReviewsSection: React.FC<ReviewsProps> = ({ business, variant = 'grid' }) => {
  const reviews = business.reviews || [];

  if (reviews.length === 0) return null;

  if (variant === 'floating-stack') {
    return (
      <section id="reviews" style={{ padding: `var(--t-section-gap, 80px) 0`, backgroundColor: 'var(--t-bg-secondary)', overflow: 'hidden' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: 'var(--t-accent)' }}>Kind Words</p>
            <h2 className="text-3xl md:text-5xl font-bold" style={{ fontFamily: 'var(--t-heading-font)', fontWeight: 'var(--t-heading-weight)', color: 'var(--t-text-primary)' }}>Client Stories</h2>
          </div>
          
          <div className="flex gap-6 overflow-x-auto pb-8 hide-scrollbar snap-x snap-mandatory">
            {reviews.map((review, i) => (
              <div key={review.id || i} className="snap-center shrink-0 w-[85vw] md:w-[400px] p-8 shadow-xl"
                   style={{ backgroundColor: 'var(--t-card-bg)', borderRadius: 'var(--t-radius)', border: '1px solid var(--t-border)' }}>
                <div className="flex gap-1 mb-6">
                  {[...Array(review.rating)].map((_, j) => (
                    <Star key={j} size={14} fill="var(--t-accent)" style={{ color: 'var(--t-accent)' }} />
                  ))}
                </div>
                <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--t-text-secondary)', fontFamily: 'var(--t-body-font)' }}>
                  "{review.comment}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-xs"
                       style={{ backgroundColor: 'var(--t-accent)' }}>
                    {review.customer_name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: 'var(--t-text-primary)' }}>{review.customer_name}</p>
                    <p className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--t-text-muted)' }}>Verified Client</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'editorial') {
    return (
      <section id="reviews" style={{ padding: `var(--t-section-gap, 80px) 0` }}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-6 mb-16">
            <h2 className="text-4xl font-bold shrink-0" style={{ fontFamily: 'var(--t-heading-font)', color: 'var(--t-text-primary)' }}>Client Feedback</h2>
            <div className="h-px w-full" style={{ backgroundColor: 'var(--t-border)' }} />
          </div>
          
          <div className="space-y-16">
            {reviews.map((review, i) => (
              <div key={review.id || i} className="relative">
                <Quote size={48} className="absolute -top-6 -left-6 opacity-10" style={{ color: 'var(--t-accent)' }} />
                <div className="pl-6 md:pl-12 border-l" style={{ borderColor: 'var(--t-accent)' }}>
                  <p className="text-xl md:text-2xl leading-relaxed mb-6" style={{ color: 'var(--t-text-primary)', fontFamily: 'var(--t-heading-font)', fontWeight: 'var(--t-heading-weight)' }}>
                    "{review.comment}"
                  </p>
                  <div className="flex items-center gap-4">
                    <p className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--t-text-primary)' }}>— {review.customer_name}</p>
                    <div className="flex gap-0.5">
                      {[...Array(review.rating)].map((_, j) => (
                        <Star key={j} size={12} fill="var(--t-accent)" style={{ color: 'var(--t-accent)' }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'minimal') {
    return (
      <section id="reviews" style={{ padding: `var(--t-section-gap, 80px) 0`, backgroundColor: 'var(--t-bg-secondary)' }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-12" style={{ color: 'var(--t-accent)' }}>Testimonials</p>
          <div className="space-y-12">
            {reviews.map((review, i) => (
              <div key={review.id || i} className="space-y-4">
                <div className="flex justify-center gap-1">
                  {[...Array(review.rating)].map((_, j) => (
                    <Star key={j} size={16} fill="var(--t-accent)" style={{ color: 'var(--t-accent)' }} />
                  ))}
                </div>
                <p className="text-lg md:text-xl leading-relaxed" style={{ color: 'var(--t-text-primary)' }}>"{review.comment}"</p>
                <p className="text-sm font-bold" style={{ color: 'var(--t-text-secondary)' }}>— {review.customer_name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // default grid
  return (
    <section id="reviews" style={{ padding: `var(--t-section-gap, 80px) 0` }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: 'var(--t-accent)' }}>Testimonials</p>
          <h2 className="text-3xl md:text-5xl font-bold" style={{ fontFamily: 'var(--t-heading-font)', fontWeight: 'var(--t-heading-weight)', color: 'var(--t-text-primary)' }}>What Our Clients Say</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <div key={review.id || i} className="p-8 border flex flex-col"
                 style={{ backgroundColor: 'var(--t-card-bg)', borderColor: 'var(--t-border)', borderRadius: 'var(--t-radius)' }}>
              <div className="flex gap-1 mb-4">
                {[...Array(review.rating)].map((_, j) => (
                  <Star key={j} size={14} fill="var(--t-accent)" style={{ color: 'var(--t-accent)' }} />
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-6 flex-1" style={{ color: 'var(--t-text-secondary)' }}>"{review.comment}"</p>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--t-text-primary)' }}>{review.customer_name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
