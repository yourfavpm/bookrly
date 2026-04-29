import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import type { SectionProps } from '../templates/types';

interface ContactProps extends SectionProps {
  variant?: 'centered' | 'split';
}

export const ContactSection: React.FC<ContactProps> = ({ business, variant = 'centered' }) => {
  const formContent = (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input type="text" placeholder="Your Name" className="w-full px-4 py-3 text-sm border outline-none transition-colors" style={{ borderColor: 'var(--t-border)', borderRadius: 'var(--t-radius)', backgroundColor: 'var(--t-bg-secondary)', color: 'var(--t-text-primary)' }} />
        <input type="email" placeholder="Your Email" className="w-full px-4 py-3 text-sm border outline-none transition-colors" style={{ borderColor: 'var(--t-border)', borderRadius: 'var(--t-radius)', backgroundColor: 'var(--t-bg-secondary)', color: 'var(--t-text-primary)' }} />
      </div>
      <input type="text" placeholder="Subject" className="w-full px-4 py-3 text-sm border outline-none transition-colors" style={{ borderColor: 'var(--t-border)', borderRadius: 'var(--t-radius)', backgroundColor: 'var(--t-bg-secondary)', color: 'var(--t-text-primary)' }} />
      <textarea placeholder="Your Message" rows={5} className="w-full px-4 py-3 text-sm border outline-none resize-none transition-colors" style={{ borderColor: 'var(--t-border)', borderRadius: 'var(--t-radius)', backgroundColor: 'var(--t-bg-secondary)', color: 'var(--t-text-primary)' }} />
      <button type="submit" className="inline-flex items-center gap-2 px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition-all hover:scale-105" style={{ backgroundColor: 'var(--t-accent)', borderRadius: 'var(--t-radius)' }}>
        <Send size={14} /> Send Message
      </button>
    </form>
  );

  const contactInfo = (
    <div className="space-y-6">
      <h3 className="text-xl font-bold" style={{ fontFamily: 'var(--t-heading-font)', color: 'var(--t-text-primary)' }}>Get in Touch</h3>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--t-text-secondary)' }}>Have questions? We'd love to hear from you.</p>
      <div className="space-y-4 pt-4">
        {business.email && (
          <a href={`mailto:${business.email}`} className="flex items-center gap-3 text-sm hover:opacity-80 transition-opacity" style={{ color: 'var(--t-text-secondary)' }}>
            <Mail size={16} style={{ color: 'var(--t-accent)' }} /> {business.email}
          </a>
        )}
        {business.phone && (
          <a href={`tel:${business.phone}`} className="flex items-center gap-3 text-sm hover:opacity-80 transition-opacity" style={{ color: 'var(--t-text-secondary)' }}>
            <Phone size={16} style={{ color: 'var(--t-accent)' }} /> {business.phone}
          </a>
        )}
        {business.address && (
          <div className="flex items-start gap-3 text-sm" style={{ color: 'var(--t-text-secondary)' }}>
            <MapPin size={16} className="shrink-0 mt-0.5" style={{ color: 'var(--t-accent)' }} /> {business.address}
          </div>
        )}
      </div>
    </div>
  );

  if (variant === 'split') {
    return (
      <section id="contact" style={{ padding: `var(--t-section-gap, 80px) 0` }}>
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
          {contactInfo}
          {formContent}
        </div>
      </section>
    );
  }

  return (
    <section id="contact" style={{ padding: `var(--t-section-gap, 80px) 0` }}>
      <div className="max-w-2xl mx-auto px-6 text-center">
        <div className="mb-12 space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: 'var(--t-accent)' }}>Contact</p>
          <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'var(--t-heading-font)', fontWeight: 'var(--t-heading-weight)', color: 'var(--t-text-primary)' }}>Let's Connect</h2>
        </div>
        {formContent}
      </div>
    </section>
  );
};
