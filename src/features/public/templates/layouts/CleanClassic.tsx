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
 * Clean Classic — The default template.
 * Minimal, elegant, text-first. Ideal for consultants and coaches.
 * Section order: Hero → Services → Reviews → Proof → About → Footer
 */
export const CleanClassicLayout: React.FC<TemplateLayoutProps> = (props) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <SiteNav {...props} scrollTo={scrollTo} />
      <HeroSection {...props} scrollTo={scrollTo} variant="centered" />
      <ServicesSection {...props} variant="grid" />
      <ReviewsSection {...props} variant="grid" />
      <ProofSection {...props} variant="grid" />
      <AboutSection {...props} variant="split" />
      <SiteFooter {...props} variant="full" />
    </>
  );
};

/**
 * Clean Classic Alt — Soft split layout.
 * Text left + image right hero, tighter spacing.
 */
export const CleanClassicAltLayout: React.FC<TemplateLayoutProps> = (props) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <SiteNav {...props} scrollTo={scrollTo} />
      <HeroSection {...props} scrollTo={scrollTo} variant="split" />
      <ServicesSection {...props} variant="list" />
      <ReviewsSection {...props} variant="vertical" />
      <ProofSection {...props} variant="grid" />
      <AboutSection {...props} variant="centered" />
      <SiteFooter {...props} variant="simple" />
    </>
  );
};
