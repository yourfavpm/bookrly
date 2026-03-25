import React from 'react';
import { HeroSection } from '../../sections/HeroSection';
import { ServicesSection } from '../../sections/ServicesSection';
import { ProofSection } from '../../sections/ProofSection';
import { AboutSection } from '../../sections/AboutSection';
import { ReviewsSection } from '../../sections/ReviewsSection';
import { SiteFooter } from '../../sections/SiteFooter';
import type { TemplateLayoutProps } from '../types';

export const NoirEditorialLayout: React.FC<TemplateLayoutProps> = ({ business, onBook, scrollTo, isPreview }) => {
  return (
    <div className="font-sans text-text-primary bg-[#0B0B0D] selection:bg-[#E8CFC0]/30 selection:text-[#E8CFC0]">
      <HeroSection 
        business={business} 
        onBook={onBook} 
        scrollTo={scrollTo}
        variant="noir"
        isPreview={isPreview}
      />
      
      <ServicesSection 
        business={business} 
        onBook={onBook} 
        scrollTo={scrollTo}
        variant="editorial-grid"
        isPreview={isPreview}
      />
      
      <ProofSection 
        business={business} 
        onBook={onBook}
        scrollTo={scrollTo}
        variant="noir-gallery"
        isPreview={isPreview}
      />
      
      <AboutSection 
        business={business} 
        onBook={onBook} 
        scrollTo={scrollTo}
        variant="noir"
        isPreview={isPreview}
      />
      
      <ReviewsSection 
        business={business} 
        onBook={onBook}
        scrollTo={scrollTo}
        variant="noir-quotes"
        isPreview={isPreview}
      />
      
      <SiteFooter 
        business={business} 
        onBook={onBook}
        scrollTo={scrollTo}
        variant="noir"
      />
    </div>
  );
};
