// ═══════════════════════════════════════════════════════════
// SKEDULEY TEMPLATE SYSTEM — Universal Template Renderer
// ═══════════════════════════════════════════════════════════
//
// Renders ANY template from its definition data.
// No per-template layout files needed.
//
import React from 'react';
import type { SectionProps, SectionType, TemplateDefinition } from './types';
import { getTheme, getThemeStyles, GOOGLE_FONTS_URL } from './themes';
import { useAppStore } from '../../../store/useAppStore';

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

const normalizeSectionKey = (section: string): string => {
  if (section === 'results' || section === 'before-after') return 'before_after';
  if (section === 'testimonials') return 'reviews';
  if (section === 'portfolio') return 'gallery';
  if (section === 'schedule') return 'availability';
  return section;
};

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

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({ template, isEditing, ...props }) => {
  const theme = getTheme(template.theme);
  const themeStyles = getThemeStyles(theme);

  const customStyles = {
    ...themeStyles,
    ...(props.business?.primaryColor && {
      '--t-accent': props.business.primaryColor,
      '--t-accent-hover': `${props.business.primaryColor}e6`,
      '--t-accent-foreground': '#ffffff' // Assuming white text on accent for simplicity, though could calculate luminance
    }),
    ...(props.business?.themeMode === 'dark' && {
      '--t-bg-primary': '#020617',    // slate-950
      '--t-bg-secondary': '#0f172a',  // slate-900
      '--t-bg-tertiary': '#1e293b',   // slate-800
      '--t-text-primary': '#f8fafc',  // slate-50
      '--t-text-secondary': '#94a3b8',// slate-400
      '--t-text-tertiary': '#64748b', // slate-500
      '--t-border': '#1e293b',        // slate-800
    }),
    ...(props.business?.themeMode === 'light' && {
      '--t-bg-primary': '#ffffff',
      '--t-bg-secondary': '#f8fafc',  // slate-50
      '--t-bg-tertiary': '#f1f5f9',   // slate-100
      '--t-text-primary': '#0f172a',  // slate-900
      '--t-text-secondary': '#475569',// slate-600
      '--t-text-tertiary': '#64748b', // slate-500
      '--t-border': '#e2e8f0',        // slate-200
    })
  } as React.CSSProperties;

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

      <div 
        style={customStyles} 
        data-theme={template.theme} 
        data-template={template.id}
        data-theme-mode={props.business?.themeMode || 'light'}
      >
        <style dangerouslySetInnerHTML={{ __html: `
          [data-theme-mode="dark"] h1, 
          [data-theme-mode="dark"] h2, 
          [data-theme-mode="dark"] h3, 
          [data-theme-mode="dark"] h4, 
          [data-theme-mode="dark"] h5, 
          [data-theme-mode="dark"] h6,
          [data-theme-mode="dark"] .text-gray-900,
          [data-theme-mode="dark"] .text-slate-900 {
            color: var(--t-text-primary) !important;
          }
          [data-theme-mode="dark"] p, 
          [data-theme-mode="dark"] span:not(.no-dark-override),
          [data-theme-mode="dark"] .text-gray-600,
          [data-theme-mode="dark"] .text-slate-600,
          [data-theme-mode="dark"] .text-gray-500,
          [data-theme-mode="dark"] .text-slate-500 {
            color: var(--t-text-secondary) !important;
          }
          [data-theme-mode="dark"] .bg-white {
            background-color: var(--t-bg-secondary) !important;
          }
          [data-theme-mode="dark"] .bg-gray-50,
          [data-theme-mode="dark"] .bg-slate-50 {
            background-color: var(--t-bg-tertiary) !important;
          }
          [data-theme-mode="dark"] .border-gray-100,
          [data-theme-mode="dark"] .border-slate-100,
          [data-theme-mode="dark"] .border-gray-200,
          [data-theme-mode="dark"] .border-slate-200 {
            border-color: var(--t-border) !important;
          }
        `}} />
        {/* Nav */}
        <SiteNav {...props} scrollTo={scrollTo} />

        {/* Sections in order */}
        {template.sectionOrder.map((section) => {
          const normalizedSection = normalizeSectionKey(section);
          const hiddenSections = (props.business?.hiddenSections || []).map(normalizeSectionKey);
          const isHidden = hiddenSections.includes(normalizedSection);
          
          // Hide on live site
          if (isHidden && !isEditing) return null;

          const rendered = renderSection(section, template, { ...props, isEditing }, scrollTo);
          if (!rendered) return null;
          
          if (isEditing) {
            return (
              <EditorSectionWrapper key={`wrap-${section}`} section={normalizedSection} label={section} isHidden={isHidden}>
                {rendered}
              </EditorSectionWrapper>
            );
          }
          return rendered;
        })}
      </div>
    </>
  );
};

// ── Editor Wrapper Component ─────────────────────────────
const EditorSectionWrapper: React.FC<{ section: string; label?: string; isHidden?: boolean; children: React.ReactNode }> = ({ section, label, isHidden, children }) => {
  const { activeEditorSection, setActiveEditorSection } = useAppStore();
  const isActive = activeEditorSection === section;
  const displayLabel = (label || section).replace(/_/g, ' ');
  
  return (
    <div 
      id={`editor-section-${section}`}
      className={`relative group transition-all duration-300 cursor-pointer ${isActive ? 'ring-2 ring-brand ring-inset z-10' : 'hover:ring-2 hover:ring-brand/40 hover:ring-inset'} ${isHidden ? 'opacity-50 grayscale' : ''}`}
      onClick={(e) => {
         e.stopPropagation();
         setActiveEditorSection(section);
      }}
    >
      {/* Active State Label */}
      {isActive && (
        <div className="absolute top-0 left-0 bg-brand text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 z-20 rounded-br-lg shadow-sm flex items-center gap-2">
          {displayLabel}
          {isHidden && <span className="text-white/70 border-l border-white/20 pl-2">HIDDEN</span>}
        </div>
      )}

      {/* Hover Overlay */}
      {!isActive && (
        <div className="absolute inset-0 bg-brand/5 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center justify-center pointer-events-none">
          <div className="bg-brand text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            Click to Edit {displayLabel}
          </div>
        </div>
      )}

      {children}
    </div>
  );
};
