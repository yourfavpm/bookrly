import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SectionProps } from '../templates/types';

interface FAQProps extends SectionProps {
  variant?: 'accordion';
}

const DEFAULT_FAQS = [
  { q: 'How do I book an appointment?', a: 'Simply click the "Book Now" button and choose your preferred service, date, and time. You\'ll receive a confirmation instantly.' },
  { q: 'What is your cancellation policy?', a: 'We require at least 24 hours notice for cancellations. Late cancellations may incur a fee.' },
  { q: 'Do you offer gift cards?', a: 'Yes! Gift cards are available in any denomination and make the perfect present.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, debit cards, and cash payments.' },
  { q: 'How early should I arrive?', a: 'Please arrive 5-10 minutes before your scheduled appointment to ensure we can start on time.' },
];

export const FAQSection: React.FC<FAQProps> = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" style={{ padding: `var(--t-section-gap, 80px) 0` }}>
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16 space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: 'var(--t-accent)' }}>FAQ</p>
          <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'var(--t-heading-font)', fontWeight: 'var(--t-heading-weight)', color: 'var(--t-text-primary)' }}>
            Frequently Asked Questions
          </h2>
        </div>
        <div className="space-y-3">
          {DEFAULT_FAQS.map((faq, i) => (
            <div
              key={i}
              className="border overflow-hidden transition-all"
              style={{ borderColor: 'var(--t-border)', borderRadius: 'var(--t-radius)', backgroundColor: openIndex === i ? 'var(--t-bg-secondary)' : 'transparent' }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left transition-colors"
              >
                <span className="text-sm font-semibold pr-4" style={{ color: 'var(--t-text-primary)' }}>{faq.q}</span>
                <ChevronDown
                  size={18}
                  className="shrink-0 transition-transform duration-300"
                  style={{ color: 'var(--t-text-muted)', transform: openIndex === i ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="px-5 pb-5 text-sm leading-relaxed" style={{ color: 'var(--t-text-secondary)' }}>{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
