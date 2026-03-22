import React from 'react';
import type { TemplateLayoutProps } from '../types';
import { SiteNav } from '../../sections/SiteNav';
import { HeroSection } from '../../sections/HeroSection';
import { ServicesSection } from '../../sections/ServicesSection';
import { ReviewsSection } from '../../sections/ReviewsSection';
import { ProofSection } from '../../sections/ProofSection';
import { AboutSection } from '../../sections/AboutSection';
import { SiteFooter } from '../../sections/SiteFooter';

/**
 * Editorial Luxe — Premium, asymmetrical, minimal aesthetic.
 * 
 * A curated, magazine-style template with refined typography and
 * controlled asymmetry. Perfect for luxury brands, independent professionals,
 * and high-end service providers.
 * 
 * Sections (required):
 * - Hero: 35% text (left), 65% image (right) asymmetrical split
 * - Services: Horizontal scroll cards with minimal styling
 * - Reviews: Floating stacked cards with subtle offset
 * - Proof: Overlapping portfolio with mixed grid (2 large, 1 small)
 * - About: Narrow text column (editorial magazine feel)
 * - Footer: Minimal contact details with social links
 * 
 * Design language:
 * - Small, light typography (no heavy bold)
 * - Strong whitespace and breathing room
 * - Minimal, sharp UI elements (square corners, thin borders)
 * - Premium color usage - text-primary as primary accent
 * - Refined motion (fade-in, image reveal, subtle hover)
 */
export const EditorialLuxeLayout: React.FC<TemplateLayoutProps> = (props) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <SiteNav {...props} scrollTo={scrollTo} />
      <HeroSection {...props} scrollTo={scrollTo} variant="editorial-luxe" />
      <ProofSection {...props} variant="overlap-gallery" />
      <ServicesSection {...props} variant="horizontal" />
      <ReviewsSection {...props} variant="floating-stack" />
      <AboutSection {...props} variant="editorial" />
      <SiteFooter {...props} variant="editorial" />
    </>
  );
};

/**
 * Editorial Luxe Alt — Same premium aesthetic with alternate section order.
 * 
 * Reviews appear earlier in the journey,
 * emphasizing social proof and trust.
 */
export const EditorialLuxeAltLayout: React.FC<TemplateLayoutProps> = (props) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <SiteNav {...props} scrollTo={scrollTo} />
      <HeroSection {...props} scrollTo={scrollTo} variant="editorial-luxe" />
      <ReviewsSection {...props} variant="floating-stack" />
      <ServicesSection {...props} variant="horizontal" />
      <ProofSection {...props} variant="overlap-gallery" />
      <AboutSection {...props} variant="editorial" />
      <SiteFooter {...props} variant="editorial" />
    </>
  );
};
