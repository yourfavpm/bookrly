import React from 'react';
import { Award, ShieldCheck, GraduationCap, BadgeCheck } from 'lucide-react';
import type { SectionProps } from '../templates/types';

interface CredentialsProps extends SectionProps {
  variant?: 'cardGrid' | 'minimalList';
}

const SAMPLE_CREDENTIALS = [
  { icon: GraduationCap, title: 'Board Certified', desc: 'Licensed and board-certified professional' },
  { icon: Award, title: '15+ Years Experience', desc: 'Extensive industry experience and expertise' },
  { icon: ShieldCheck, title: 'Fully Insured', desc: 'Complete liability and professional insurance' },
  { icon: BadgeCheck, title: 'Accredited Member', desc: 'Recognized by leading industry organizations' },
];

export const CredentialsSection: React.FC<CredentialsProps> = ({ variant = 'cardGrid' }) => {
  if (variant === 'minimalList') {
    return (
      <section id="credentials" style={{ padding: `var(--t-section-gap, 80px) 0` }}>
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-10" style={{ color: 'var(--t-accent)' }}>Credentials</p>
          <div className="space-y-6">
            {SAMPLE_CREDENTIALS.map((c, i) => (
              <div key={i} className="flex items-center gap-5 pb-6 border-b" style={{ borderColor: 'var(--t-border)' }}>
                <c.icon size={20} style={{ color: 'var(--t-accent)' }} />
                <div>
                  <h3 className="text-sm font-bold" style={{ color: 'var(--t-text-primary)' }}>{c.title}</h3>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--t-text-secondary)' }}>{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="credentials" style={{ padding: `var(--t-section-gap, 80px) 0`, backgroundColor: 'var(--t-bg-secondary)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14 space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: 'var(--t-accent)' }}>Why Trust Us</p>
          <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'var(--t-heading-font)', fontWeight: 'var(--t-heading-weight)', color: 'var(--t-text-primary)' }}>Our Credentials</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SAMPLE_CREDENTIALS.map((c, i) => (
            <div key={i} className="p-6 border text-center space-y-4 transition-all hover:scale-[1.02]" style={{ borderColor: 'var(--t-border)', borderRadius: 'var(--t-radius)', backgroundColor: 'var(--t-card-bg)' }}>
              <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-xl" style={{ backgroundColor: 'var(--t-bg-secondary)' }}>
                <c.icon size={22} style={{ color: 'var(--t-accent)' }} />
              </div>
              <h3 className="text-sm font-bold" style={{ color: 'var(--t-text-primary)' }}>{c.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--t-text-secondary)' }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
