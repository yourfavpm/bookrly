import React from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon } from 'lucide-react';
import type { SectionProps } from '../templates/types';

interface ProofProps extends SectionProps {
  variant?: 'grid' | 'masonry' | 'filmstrip';
}

export const ProofSection: React.FC<ProofProps> = ({ business, isMobile, variant = 'grid' }) => {
  if ((business.trustSection !== 'proof' && business.trustSection !== 'both') || (business.proofOfWork || []).length === 0) {
    return null;
  }

  if (variant === 'filmstrip') {
    return (
      <section id="gallery" className="py-24 w-full space-y-12">
        <div className="max-w-6xl mx-auto px-6 space-y-3">
          <span className="text-[10px] font-medium uppercase tracking-[0.3em]" style={{ color: business.primaryColor }}>Our Work</span>
          <h2 className="text-3xl font-medium tracking-tight text-text-primary">Portfolio</h2>
        </div>
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 px-6 min-w-min">
            {business.proofOfWork.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} viewport={{ once: true }} className="w-64 h-80 shrink-0 rounded-3xl overflow-hidden shadow-md group relative">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.caption} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full bg-bg-secondary flex items-center justify-center text-text-tertiary"><ImageIcon size={32} /></div>
                )}
                {item.caption && (
                  <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-medium">{item.caption}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Default: grid
  return (
    <section id="gallery" className="py-24 px-6 max-w-7xl mx-auto w-full space-y-16 text-center">
      <div className="space-y-3">
        <span className="text-[10px] font-medium uppercase tracking-[0.3em]" style={{ color: business.primaryColor }}>Our Work</span>
        <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-text-primary">Portfolio Showcase</h2>
        <div className="w-12 h-1 mx-auto rounded-full" style={{ backgroundColor: business.primaryColor }} />
      </div>
      <div className={`grid grid-cols-2 ${isMobile ? '' : 'lg:grid-cols-4'} gap-4 md:gap-6`}>
        {business.proofOfWork.map((item, index) => (
          <motion.div key={item.id} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }} viewport={{ once: true }} className="group relative aspect-square rounded-[32px] overflow-hidden shadow-md">
            {item.image_url ? (
              <img src={item.image_url} alt={item.caption} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
            ) : (
              <div className="w-full h-full bg-bg-secondary flex items-center justify-center text-text-tertiary"><ImageIcon size={32} /></div>
            )}
            {item.caption && (
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                <span className="text-white text-xs font-medium tracking-wider uppercase">{item.caption}</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};
