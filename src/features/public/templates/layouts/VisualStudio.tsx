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
 * Visual Studio — Image-first, gallery-heavy.
 * Gallery before services to showcase work upfront.
 * Ideal for beauty professionals and creatives.
 */
export const VisualStudioLayout: React.FC<TemplateLayoutProps> = (props) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <SiteNav {...props} scrollTo={scrollTo} variant="minimal" />
      <HeroSection {...props} scrollTo={scrollTo} variant="visual-studio" />
      <ProofSection {...props} variant="visual-studio-masonry" />
      <ServicesSection {...props} variant="visual-studio-floating" />
      <ReviewsSection {...props} variant="visual-studio-strip" />
      <AboutSection {...props} variant="visual-studio-split" />
      <SiteFooter {...props} variant="minimal" />
    </>
  );
};

/**
 * Visual Studio Alt — Filmstrip gallery + floating service cards.
 * Horizontal scrolling portfolio + compact services.
 */
export const VisualStudioAltLayout: React.FC<TemplateLayoutProps> = (props) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <SiteNav {...props} scrollTo={scrollTo} variant="minimal" />
      <HeroSection {...props} scrollTo={scrollTo} variant="full-image" />
      <ProofSection {...props} variant="filmstrip" />
      <ServicesSection {...props} variant="compact" />
      <AboutSection {...props} variant="full-width" />
      <ReviewsSection {...props} variant="featured" />
      <SiteFooter {...props} variant="simple" />
    </>
  );
};
