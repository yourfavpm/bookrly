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
 * Personal Brand — Founder-focused layout.
 * About section appears early, large image, testimonial-driven.
 */
export const PersonalBrandLayout: React.FC<TemplateLayoutProps> = (props) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <SiteNav {...props} scrollTo={scrollTo} />
      <HeroSection {...props} scrollTo={scrollTo} variant="split" />
      <AboutSection {...props} variant="full-width" />
      <ReviewsSection {...props} variant="featured" />
      <ServicesSection {...props} variant="grid" />
      <ProofSection {...props} variant="grid" />
      <SiteFooter {...props} variant="full" />
    </>
  );
};

/**
 * Personal Brand Alt — Full-width about, vertical testimonials, minimal nav.
 * Very clean, founder-centric.
 */
export const PersonalBrandAltLayout: React.FC<TemplateLayoutProps> = (props) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <SiteNav {...props} scrollTo={scrollTo} variant="minimal" />
      <HeroSection {...props} scrollTo={scrollTo} variant="minimal" />
      <AboutSection {...props} variant="centered" />
      <ReviewsSection {...props} variant="vertical" />
      <ServicesSection {...props} variant="list" />
      <ProofSection {...props} variant="filmstrip" />
      <SiteFooter {...props} variant="minimal" />
    </>
  );
};
