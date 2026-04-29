import React from 'react';
import { Check } from 'lucide-react';
import type { SectionProps } from '../templates/types';

interface PricingProps extends SectionProps {
  variant?: 'pricingCards';
}

export const PricingSection: React.FC<PricingProps> = ({ business, onBook }) => {
  const tiers = [
    { name: 'Essential', price: business.services[0]?.price || 49, features: ['1 session', 'Standard service', 'Email support', 'Online booking'], popular: false },
    { name: 'Professional', price: business.services[1]?.price || 99, features: ['3 sessions', 'Premium service', 'Priority support', 'Custom scheduling', 'Follow-up included'], popular: true },
    { name: 'Premium', price: business.services[2]?.price || 199, features: ['Unlimited sessions', 'VIP treatment', 'Dedicated support', 'Flexible scheduling', 'All add-ons included', 'Priority access'], popular: false },
  ];

  return (
    <section id="pricing" style={{ padding: `var(--t-section-gap, 80px) 0`, backgroundColor: 'var(--t-bg-secondary)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14 space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: 'var(--t-accent)' }}>Pricing</p>
          <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'var(--t-heading-font)', fontWeight: 'var(--t-heading-weight)', color: 'var(--t-text-primary)' }}>Simple, Transparent Pricing</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier, i) => (
            <div key={i} className="relative p-8 border flex flex-col transition-all hover:scale-[1.02]" style={{ borderColor: tier.popular ? 'var(--t-accent)' : 'var(--t-border)', borderRadius: 'var(--t-radius)', backgroundColor: 'var(--t-card-bg)', borderWidth: tier.popular ? '2px' : '1px' }}>
              {tier.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-[9px] font-bold uppercase tracking-widest text-white" style={{ backgroundColor: 'var(--t-accent)', borderRadius: 'var(--t-radius)' }}>Most Popular</span>
              )}
              <h3 className="text-lg font-bold" style={{ fontFamily: 'var(--t-heading-font)', color: 'var(--t-text-primary)' }}>{tier.name}</h3>
              <div className="mt-4 mb-6">
                <span className="text-4xl font-bold" style={{ color: 'var(--t-text-primary)' }}>${tier.price}</span>
                <span className="text-sm ml-1" style={{ color: 'var(--t-text-muted)' }}>/session</span>
              </div>
              <ul className="space-y-3 flex-1 mb-8">
                {tier.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm" style={{ color: 'var(--t-text-secondary)' }}>
                    <Check size={14} style={{ color: 'var(--t-accent)' }} /> {f}
                  </li>
                ))}
              </ul>
              <button onClick={onBook} className="w-full py-3 text-xs font-bold uppercase tracking-widest transition-all hover:scale-105" style={{ backgroundColor: tier.popular ? 'var(--t-accent)' : 'transparent', color: tier.popular ? '#fff' : 'var(--t-accent)', border: tier.popular ? 'none' : '1px solid var(--t-accent)', borderRadius: 'var(--t-radius)' }}>
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
