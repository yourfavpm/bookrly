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
 * Modern Appointments — Booking-forward layout.
 * Compact services, polished feel. Ideal for salons and spas.
 */
export const ModernAppointmentsLayout: React.FC<TemplateLayoutProps> = (props) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <SiteNav {...props} scrollTo={scrollTo} />
      <HeroSection {...props} scrollTo={scrollTo} variant="minimal" />
      <ServicesSection {...props} variant="compact" />
      <ReviewsSection {...props} variant="grid" />
      <AboutSection {...props} variant="centered" />
      <ProofSection {...props} variant="grid" />
      <SiteFooter {...props} variant="simple" />
    </>
  );
};

/**
 * Modern Appointments Alt — Card hero, horizontal scroll services.
 * Polished, clean, booking emphasis.
 */
export const ModernAppointmentsAltLayout: React.FC<TemplateLayoutProps> = (props) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <SiteNav {...props} scrollTo={scrollTo} />
      <HeroSection {...props} scrollTo={scrollTo} variant="card" />
      <ServicesSection {...props} variant="horizontal" />
      <ProofSection {...props} variant="filmstrip" />
      <ReviewsSection {...props} variant="featured" />
      <AboutSection {...props} variant="split" />
      <SiteFooter {...props} variant="full" />
    </>
  );
};
