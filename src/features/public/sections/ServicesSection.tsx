import React from 'react';
import { ChevronRight } from 'lucide-react';
import { formatPrice } from '../../../utils/formatters';
import type { SectionProps } from '../templates/types';

interface ServicesProps extends SectionProps {
  variant?: 'card-grid' | 'horizontal' | 'pricing'; // Matching TemplateRenderer
}

export const ServicesSection: React.FC<ServicesProps> = ({ business, onBook, variant = 'card-grid' }) => {
  const services = business.services || [];

  if (services.length === 0) return null;

  if (variant === 'horizontal') {
    return (
      <section id="services" style={{ padding: `var(--t-section-gap, 80px) 0`, backgroundColor: 'var(--t-bg-secondary)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-3 max-w-xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: 'var(--t-accent)' }}>Menu</p>
              <h2 className="text-3xl md:text-5xl font-bold" style={{ fontFamily: 'var(--t-heading-font)', fontWeight: 'var(--t-heading-weight)', color: 'var(--t-text-primary)' }}>Our Services</h2>
            </div>
          </div>
          
          <div className="space-y-4">
            {services.map((service, i) => (
              <div key={service.id || i} className="group flex flex-col md:flex-row justify-between p-6 md:p-8 border transition-all hover:scale-[1.01]"
                   style={{ borderColor: 'var(--t-border)', backgroundColor: 'var(--t-card-bg)', borderRadius: 'var(--t-radius)' }}>
                <div className="flex-1 pr-8">
                  <h3 className="text-lg font-bold group-hover:opacity-80 transition-opacity" style={{ fontFamily: 'var(--t-heading-font)', color: 'var(--t-text-primary)' }}>{service.name}</h3>
                  <p className="text-sm mt-2 max-w-2xl leading-relaxed" style={{ color: 'var(--t-text-secondary)' }}>{service.description}</p>
                </div>
                <div className="flex items-center gap-8 mt-6 md:mt-0 shrink-0">
                  <div className="text-right">
                    <p className="text-xl font-bold" style={{ color: 'var(--t-text-primary)' }}>{formatPrice(service.price)}</p>
                    <p className="text-xs" style={{ color: 'var(--t-text-muted)' }}>{service.duration} mins</p>
                  </div>
                  <button onClick={onBook} className="w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
                          style={{ backgroundColor: 'var(--t-bg-secondary)', color: 'var(--t-accent)' }}>
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'pricing') {
    return (
      <section id="services" style={{ padding: `var(--t-section-gap, 80px) 0` }}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16 space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: 'var(--t-accent)' }}>Pricing</p>
            <h2 className="text-3xl md:text-5xl font-bold" style={{ fontFamily: 'var(--t-heading-font)', fontWeight: 'var(--t-heading-weight)', color: 'var(--t-text-primary)' }}>Investment</h2>
          </div>
          <div className="space-y-6">
            {services.map((service, i) => (
              <div key={service.id || i} className="flex items-start justify-between pb-6 border-b group" style={{ borderColor: 'var(--t-border)' }}>
                <div className="flex-1 pr-6">
                  <h3 className="text-base font-bold group-hover:opacity-80 transition-opacity" style={{ color: 'var(--t-text-primary)' }}>{service.name}</h3>
                  <p className="text-sm mt-1" style={{ color: 'var(--t-text-secondary)' }}>{service.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-lg font-bold" style={{ color: 'var(--t-text-primary)' }}>{formatPrice(service.price)}</span>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--t-text-muted)' }}>{service.duration} mins</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <button onClick={onBook} className="px-10 py-4 text-xs font-bold uppercase tracking-widest text-white transition-all hover:scale-105"
                    style={{ backgroundColor: 'var(--t-accent)', borderRadius: 'var(--t-radius)' }}>
              Book an Appointment
            </button>
          </div>
        </div>
      </section>
    );
  }

  // default card grid
  return (
    <section id="services" style={{ padding: `var(--t-section-gap, 80px) 0`, backgroundColor: 'var(--t-bg-secondary)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: 'var(--t-accent)' }}>Services</p>
          <h2 className="text-3xl md:text-5xl font-bold" style={{ fontFamily: 'var(--t-heading-font)', fontWeight: 'var(--t-heading-weight)', color: 'var(--t-text-primary)' }}>What We Offer</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <div key={service.id || i} className="flex flex-col p-8 border transition-all hover:scale-[1.02]"
                 style={{ borderColor: 'var(--t-border)', backgroundColor: 'var(--t-card-bg)', borderRadius: 'var(--t-radius)' }}>
              <div className="mb-4">
                <span className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-wider mb-4"
                      style={{ backgroundColor: 'var(--t-bg-secondary)', color: 'var(--t-accent)', borderRadius: 'var(--t-radius)' }}>
                  {service.duration} mins
                </span>
                <h3 className="text-xl font-bold" style={{ fontFamily: 'var(--t-heading-font)', color: 'var(--t-text-primary)' }}>{service.name}</h3>
              </div>
              <p className="text-sm leading-relaxed flex-1 mb-8" style={{ color: 'var(--t-text-secondary)' }}>{service.description}</p>
              <div className="flex items-center justify-between pt-6 border-t" style={{ borderColor: 'var(--t-border)' }}>
                <span className="text-lg font-bold" style={{ color: 'var(--t-text-primary)' }}>{formatPrice(service.price)}</span>
                <button onClick={onBook} className="text-sm font-bold transition-opacity hover:opacity-70 flex items-center gap-1"
                        style={{ color: 'var(--t-accent)' }}>
                  Book <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
