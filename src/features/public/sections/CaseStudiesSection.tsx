import React from 'react';
import { TrendingUp, ArrowUpRight } from 'lucide-react';
import type { SectionProps } from '../templates/types';

interface CaseStudiesProps extends SectionProps {
  variant?: 'cardGrid' | 'minimalList';
}

const SAMPLE_CASES = [
  { title: 'Revenue Growth Strategy', client: 'Tech Startup', metric: '+340%', metricLabel: 'Revenue Growth', desc: 'Implemented a comprehensive strategy that drove exponential growth in 6 months.' },
  { title: 'Brand Transformation', client: 'Retail Chain', metric: '2.5x', metricLabel: 'Customer Engagement', desc: 'Complete rebrand and digital transformation leading to doubled engagement.' },
  { title: 'Operational Efficiency', client: 'Healthcare Provider', metric: '-60%', metricLabel: 'Cost Reduction', desc: 'Streamlined operations reducing overhead while improving service quality.' },
  { title: 'Market Expansion', client: 'E-commerce Brand', metric: '+180%', metricLabel: 'Market Reach', desc: 'Successfully expanded to 3 new markets within the first quarter.' },
];

export const CaseStudiesSection: React.FC<CaseStudiesProps> = ({ variant = 'cardGrid' }) => {
  if (variant === 'minimalList') {
    return (
      <section id="case-studies" style={{ padding: `var(--t-section-gap, 80px) 0` }}>
        <div className="max-w-3xl mx-auto px-6">
          <div className="mb-12 space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: 'var(--t-accent)' }}>Case Studies</p>
            <h2 className="text-3xl font-bold" style={{ fontFamily: 'var(--t-heading-font)', fontWeight: 'var(--t-heading-weight)', color: 'var(--t-text-primary)' }}>Proven Results</h2>
          </div>
          <div className="space-y-8">
            {SAMPLE_CASES.map((c, i) => (
              <div key={i} className="flex items-start gap-6 pb-8 border-b group" style={{ borderColor: 'var(--t-border)' }}>
                <span className="text-3xl font-bold shrink-0" style={{ color: 'var(--t-accent)' }}>{c.metric}</span>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold group-hover:opacity-80 transition-opacity" style={{ color: 'var(--t-text-primary)' }}>{c.title}</h3>
                  <p className="text-xs" style={{ color: 'var(--t-text-muted)' }}>{c.client} — {c.metricLabel}</p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--t-text-secondary)' }}>{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="case-studies" style={{ padding: `var(--t-section-gap, 80px) 0`, backgroundColor: 'var(--t-bg-secondary)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14 space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: 'var(--t-accent)' }}>Case Studies</p>
          <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'var(--t-heading-font)', fontWeight: 'var(--t-heading-weight)', color: 'var(--t-text-primary)' }}>Proven Results</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SAMPLE_CASES.map((c, i) => (
            <div key={i} className="p-8 border group cursor-pointer transition-all hover:scale-[1.02]" style={{ borderColor: 'var(--t-border)', borderRadius: 'var(--t-radius)', backgroundColor: 'var(--t-card-bg)' }}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} style={{ color: 'var(--t-accent)' }} />
                  <span className="text-xs font-medium" style={{ color: 'var(--t-text-muted)' }}>{c.client}</span>
                </div>
                <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--t-accent)' }} />
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'var(--t-heading-font)', color: 'var(--t-text-primary)' }}>{c.title}</h3>
              <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--t-text-secondary)' }}>{c.desc}</p>
              <div className="pt-4 border-t" style={{ borderColor: 'var(--t-border)' }}>
                <span className="text-2xl font-bold" style={{ color: 'var(--t-accent)' }}>{c.metric}</span>
                <span className="text-xs ml-2" style={{ color: 'var(--t-text-muted)' }}>{c.metricLabel}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
