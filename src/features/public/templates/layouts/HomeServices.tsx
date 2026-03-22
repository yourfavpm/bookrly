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
 * Home Services Pro — Strong CTA, trust-first.
 * Reviews appear early, bold hero CTA. Ideal for cleaning & home services.
 */
export const HomeServicesLayout: React.FC<TemplateLayoutProps> = (props) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <SiteNav {...props} scrollTo={scrollTo} />
      <HeroSection {...props} scrollTo={scrollTo} variant="home-services-split" />
      <ServicesSection {...props} variant="home-services-grid" />
      <ProofSection {...props} variant="home-services-slider" />
      <ReviewsSection {...props} variant="home-services-trust" />
      <AboutSection {...props} variant="home-services-short" />
      <SiteFooter {...props} variant="full" />
    </>
  );
};

/**
 * Home Services Alt — Stats bar under hero, sidebar testimonials.
 * Compact services with vertical reviews.
 */
export const HomeServicesAltLayout: React.FC<TemplateLayoutProps> = (props) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <SiteNav {...props} scrollTo={scrollTo} />
      <HeroSection {...props} scrollTo={scrollTo} variant="card" />
      <ServicesSection {...props} variant="list" />
      <ReviewsSection {...props} variant="vertical" />
      <ProofSection {...props} variant="grid" />
      <AboutSection {...props} variant="split" />
      <SiteFooter {...props} variant="simple" />
    </>
  );
};
