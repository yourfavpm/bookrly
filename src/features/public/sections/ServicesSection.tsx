import React from 'react';
import { Clock } from 'lucide-react';
import type { SectionProps } from '../templates/types';

interface ServicesProps extends SectionProps {
  variant?: 'grid' | 'list' | 'compact' | 'horizontal';
}

export const ServicesSection: React.FC<ServicesProps> = ({ business, onBook, isMobile, variant = 'grid' }) => {
  if (variant === 'list') {
    return (
      <section id="services" className="py-24 px-6 max-w-4xl mx-auto w-full space-y-12">
        <div className="space-y-3">
          <span className="text-[10px] font-medium uppercase tracking-[0.3em]" style={{ color: business.primaryColor }}>Services</span>
          <h2 className="text-3xl font-medium tracking-tight text-text-primary">What We Offer</h2>
        </div>
        <div className="space-y-4">
          {business.services.map(s => (
            <div key={s.id} className="flex items-center justify-between p-6 rounded-2xl border border-border-light bg-white hover:shadow-md transition-all group">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-text-primary">{s.name}</h3>
                <p className="text-sm text-text-secondary mt-1 line-clamp-1">{s.description}</p>
              </div>
              <div className="flex items-center gap-6 ml-6">
                <div className="text-right">
                  <span className="text-lg font-medium" style={{ color: business.primaryColor }}>${s.price}</span>
                  <span className="block text-[10px] text-text-tertiary uppercase tracking-widest">{s.duration} min</span>
                </div>
                <button onClick={onBook} className="px-5 py-2.5 rounded-xl text-white text-xs font-medium transition-all hover:scale-105 active:scale-95 border-none cursor-pointer" style={{ backgroundColor: business.primaryColor }}>
                  Book
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (variant === 'compact') {
    return (
      <section id="services" className="py-24 px-6 max-w-5xl mx-auto w-full space-y-12">
        <div className="text-center space-y-3">
          <span className="text-[10px] font-medium uppercase tracking-[0.3em]" style={{ color: business.primaryColor }}>Services</span>
          <h2 className="text-3xl font-medium tracking-tight text-text-primary">Our Services</h2>
        </div>
        <div className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-2'} gap-4`}>
          {business.services.map(s => (
            <div key={s.id} className="p-5 rounded-2xl border border-border-light bg-white hover:shadow-md transition-all flex items-center gap-4 cursor-pointer" onClick={onBook}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${business.primaryColor}10`, color: business.primaryColor }}>
                <Clock size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm text-text-primary">{s.name}</h3>
                <span className="text-xs text-text-tertiary">{s.duration} min • ${s.price}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (variant === 'horizontal') {
    return (
      <section id="services" className="py-24 px-6 w-full space-y-12">
        <div className="max-w-6xl mx-auto space-y-3">
          <span className="text-[10px] font-medium uppercase tracking-[0.3em]" style={{ color: business.primaryColor }}>Services</span>
          <h2 className="text-3xl font-medium tracking-tight text-text-primary">What We Do</h2>
        </div>
        <div className="max-w-full overflow-x-auto pb-4">
          <div className="flex gap-6 px-6 min-w-min">
            {business.services.map(s => (
              <div key={s.id} className="w-72 shrink-0 p-6 rounded-3xl border border-border-light bg-white hover:shadow-lg transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${business.primaryColor}10`, color: business.primaryColor }}>
                    <Clock size={18} />
                  </div>
                  <span className="text-lg font-medium" style={{ color: business.primaryColor }}>${s.price}</span>
                </div>
                <h3 className="font-medium text-lg mb-2 text-text-primary">{s.name}</h3>
                <p className="text-sm text-text-secondary line-clamp-2 mb-6">{s.description}</p>
                <button onClick={onBook} className="w-full py-3 rounded-xl text-white text-xs font-medium transition-all hover:scale-[1.03] active:scale-95 border-none cursor-pointer" style={{ backgroundColor: business.primaryColor }}>
                  Book
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Default: grid
  return (
    <section id="services" className="py-24 px-6 max-w-6xl mx-auto w-full space-y-16 text-center">
      <div className="space-y-3">
        <span className="text-[10px] font-medium uppercase tracking-[0.3em]" style={{ color: business.primaryColor }}>The Experience</span>
        <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-text-primary">Our Signature Services</h2>
        <div className="w-12 h-1 mx-auto rounded-full" style={{ backgroundColor: business.primaryColor }} />
      </div>
      <div className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-2 lg:grid-cols-3'} gap-8`}>
        {business.services.map(s => (
          <div key={s.id} className="p-8 rounded-3xl border border-border-light bg-white hover:shadow-xl transition-all duration-500 group flex flex-col items-start text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-[64px] translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform duration-700" style={{ backgroundColor: `${business.primaryColor}08` }} />
            <div className="flex justify-between items-start w-full mb-8 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-bg-secondary flex items-center justify-center text-text-tertiary transition-all duration-500 group-hover:scale-105" style={{ color: business.primaryColor }}>
                <Clock size={24} />
              </div>
              <span className="text-2xl font-medium tracking-tight" style={{ color: business.primaryColor }}>${s.price}</span>
            </div>
            <h3 className="font-medium text-xl mb-3 text-text-primary leading-tight">{s.name}</h3>
            <p className="text-text-secondary text-sm leading-relaxed mb-8 line-clamp-3 opacity-80">{s.description}</p>
            <div className="flex items-center gap-4 mt-auto w-full relative z-10">
              <div className="flex items-center gap-2 text-[10px] font-medium text-text-tertiary uppercase tracking-widest bg-bg-secondary px-4 py-2 rounded-full">
                <Clock size={12} /> {s.duration} MIN
              </div>
              <button onClick={onBook} className="flex-1 py-3 px-6 rounded-xl text-white font-medium text-xs hover:scale-[1.03] active:scale-95 transition-all shadow-lg border-none cursor-pointer" style={{ backgroundColor: business.primaryColor }}>
                Book
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
