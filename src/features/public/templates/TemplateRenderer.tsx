// ═══════════════════════════════════════════════════════════
// BUKD TEMPLATE SYSTEM — Universal Template Renderer
// ═══════════════════════════════════════════════════════════
//
// Renders ANY template from its definition data.
// No per-template layout files needed.
//
import React from 'react';
import type { SectionProps, SectionType, TemplateDefinition } from './types';
import { getTheme, getThemeStyles, GOOGLE_FONTS_URL } from './themes';

// Section components
import { SiteNav } from '../sections/SiteNav';
import { HeroSection } from '../sections/HeroSection';
import { ServicesSection } from '../sections/ServicesSection';
import { ReviewsSection } from '../sections/ReviewsSection';
import { ProofSection } from '../sections/ProofSection';
import { AboutSection } from '../sections/AboutSection';
import { SiteFooter } from '../sections/SiteFooter';
import { FAQSection } from '../sections/FAQSection';
import { ContactSection } from '../sections/ContactSection';
import { CredentialsSection } from '../sections/CredentialsSection';
import { TeamSection } from '../sections/TeamSection';
import { PricingSection } from '../sections/PricingSection';
import { ScheduleSection } from '../sections/ScheduleSection';
import { BeforeAfterSection } from '../sections/BeforeAfterSection';
import { CaseStudiesSection } from '../sections/CaseStudiesSection';
import { BookingSectionInline } from '../sections/BookingSectionInline';

// ── Hero variant mapper ──────────────────────────────────
const mapHeroVariant = (v?: string) => v || 'centered';

// ── Services variant mapper ──────────────────────────────
const mapServicesVariant = (v?: string) => v || 'cardGrid';

// ── Reviews variant mapper ───────────────────────────────
const mapReviewsVariant = (v?: string) => v || 'grid';

// ── About variant mapper ─────────────────────────────────
const mapAboutVariant = (v?: string) => v || 'centered';

// ── Gallery variant mapper ───────────────────────────────
const mapGalleryVariant = (v?: string) => v || 'masonryGrid';

// ── Footer variant mapper ────────────────────────────────
const mapFooterVariant = (v?: string) => v || 'standard';

// ── Section Renderer ─────────────────────────────────────
const renderSection = (
  section: SectionType,
  template: TemplateDefinition,
  props: SectionProps,
  scrollTo: (id: string) => void
): React.ReactNode => {
  const layouts = template.layouts;
  const key = `section-${section}`;

  switch (section) {
    case 'hero':
      return <HeroSection key={key} {...props} scrollTo={scrollTo} variant={mapHeroVariant(layouts.hero) as any} />;

    case 'services':
      return <ServicesSection key={key} {...props} variant={mapServicesVariant(layouts.services) as any} />;

    case 'about':
      return <AboutSection key={key} {...props} variant={mapAboutVariant(layouts.about) as any} />;

    case 'reviews':
    case 'testimonials':
      return <ReviewsSection key={key} {...props} variant={mapReviewsVariant(layouts.reviews || layouts.testimonials) as any} />;

    case 'gallery':
    case 'portfolio':
      return <ProofSection key={key} {...props} variant={mapGalleryVariant(layouts.gallery || layouts.portfolio) as any} />;

    case 'footer':
      return <SiteFooter key={key} {...props} variant={mapFooterVariant(layouts.footer) as any} />;

    case 'faq':
      return <FAQSection key={key} {...props} variant={layouts.faq || 'accordion'} />;

    case 'contact':
      return <ContactSection key={key} {...props} variant={layouts.contact || 'centered'} />;

    case 'credentials':
      return <CredentialsSection key={key} {...props} variant={layouts.credentials || 'cardGrid'} />;

    case 'team':
      return <TeamSection key={key} {...props} variant={layouts.team || 'cardGrid'} />;

    case 'pricing':
      return <PricingSection key={key} {...props} variant={layouts.pricing || 'pricingCards'} />;

    case 'schedule':
      return <ScheduleSection key={key} {...props} variant={layouts.schedule || 'cardGrid'} />;

    case 'before_after':
      return <BeforeAfterSection key={key} {...props} variant={layouts.before_after || 'split'} />;

    case 'case_studies':
      return <CaseStudiesSection key={key} {...props} variant={layouts.case_studies || 'cardGrid'} />;

    case 'booking':
      return <BookingSectionInline key={key} {...props} variant={layouts.booking || 'centered'} />;

    default:
      return null;
  }
};

// ── Template Renderer Component ──────────────────────────
interface TemplateRendererProps extends SectionProps {
  template: TemplateDefinition;
}

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({ template, ...props }) => {
  const theme = getTheme(template.theme);
  const themeStyles = getThemeStyles(theme);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="stylesheet" href={GOOGLE_FONTS_URL} />

      <div style={themeStyles} data-theme={template.theme} data-template={template.id}>
        {/* Nav */}
        <SiteNav {...props} scrollTo={scrollTo} />

        {/* Sections in order */}
        {template.sectionOrder.map(section =>
          renderSection(section, template, props, scrollTo)
        )}
      </div>
    </>
  );
};
