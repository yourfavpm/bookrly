import React from 'react';
import { Calendar } from 'lucide-react';
import type { SectionProps } from '../templates/types';

interface BookingInlineProps extends SectionProps {
  variant?: 'centered' | 'split';
}

export const BookingSectionInline: React.FC<BookingInlineProps> = ({ business, onBook, variant = 'centered' }) => {
  if (variant === 'split') {
    return (
      <section id="booking" style={{ padding: `var(--t-section-gap, 80px) 0`, backgroundColor: 'var(--t-bg-secondary)' }}>
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold" style={{ fontFamily: 'var(--t-heading-font)', fontWeight: 'var(--t-heading-weight)', color: 'var(--t-text-primary)' }}>
              Ready to begin?
            </h2>
            <p className="text-lg leading-relaxed max-w-md" style={{ color: 'var(--t-text-secondary)' }}>
              Schedule your appointment online. It only takes a minute.
            </p>
          </div>
          <div className="p-8 border shadow-lg flex flex-col items-center justify-center space-y-6 text-center" style={{ borderColor: 'var(--t-border)', borderRadius: 'var(--t-radius)', backgroundColor: 'var(--t-card-bg)' }}>
            <Calendar size={48} style={{ color: 'var(--t-accent)' }} className="opacity-80" />
            <h3 className="text-xl font-bold" style={{ fontFamily: 'var(--t-heading-font)', color: 'var(--t-text-primary)' }}>Book an Appointment</h3>
            <button onClick={onBook} className="w-full sm:w-auto px-10 py-4 text-xs font-bold uppercase tracking-widest text-white transition-all hover:scale-105" style={{ backgroundColor: 'var(--t-accent)', borderRadius: 'var(--t-radius)' }}>
              {business.ctaText || 'Book Now'}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" style={{ padding: `var(--t-section-gap, 80px) 0`, backgroundColor: 'var(--t-bg-secondary)' }}>
      <div className="max-w-3xl mx-auto px-6 text-center">
        <div className="p-12 border shadow-lg space-y-8" style={{ borderColor: 'var(--t-border)', borderRadius: 'var(--t-radius)', backgroundColor: 'var(--t-card-bg)' }}>
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold" style={{ fontFamily: 'var(--t-heading-font)', fontWeight: 'var(--t-heading-weight)', color: 'var(--t-text-primary)' }}>
              Ready to begin?
            </h2>
            <p className="text-lg leading-relaxed mx-auto max-w-lg" style={{ color: 'var(--t-text-secondary)' }}>
              Schedule your appointment online. It only takes a minute to secure your spot.
            </p>
          </div>
          <button onClick={onBook} className="inline-block px-12 py-4 text-xs font-bold uppercase tracking-widest text-white transition-all hover:scale-105 shadow-xl" style={{ backgroundColor: 'var(--t-accent)', borderRadius: 'var(--t-radius)' }}>
            {business.ctaText || 'Book Appointment'}
          </button>
        </div>
      </div>
    </section>
  );
};
