// ═══════════════════════════════════════════════════════════
// BUKD TEMPLATE SYSTEM — Core Type Definitions
// ═══════════════════════════════════════════════════════════

// ── Business Categories ──────────────────────────────────
export type BusinessCategory =
  | 'beauty'
  | 'fitness'
  | 'health'
  | 'professional'
  | 'creative'
  | 'events'
  | 'education'
  | 'home_services'
  | 'digital'
  | 'hybrid';

// ── Section Types (reusable building blocks) ─────────────
export type SectionType =
  | 'hero'
  | 'services'
  | 'about'
  | 'reviews'
  | 'gallery'
  | 'booking'
  | 'contact'
  | 'faq'
  | 'credentials'
  | 'portfolio'
  | 'testimonials'
  | 'pricing'
  | 'case_studies'
  | 'before_after'
  | 'schedule'
  | 'team'
  | 'footer';

// ── Layout Variants per Section ──────────────────────────
export type HeroVariant = 'fullBleed' | 'split' | 'centered' | 'overlay' | 'bookingEmbed';
export type ServicesVariant = 'cardGrid' | 'pricingCards' | 'minimalList';
export type AboutVariant = 'editorial' | 'split' | 'centered';
export type ReviewsVariant = 'carousel' | 'grid' | 'minimal' | 'editorial';
export type GalleryVariant = 'masonryGrid' | 'carousel' | 'fullBleed';
export type FooterVariant = 'minimal' | 'standard' | 'ctaHeavy';
export type FAQVariant = 'accordion';
export type CredentialsVariant = 'cardGrid' | 'minimalList';
export type TeamVariant = 'cardGrid';
export type PricingVariant = 'pricingCards';
export type ContactVariant = 'centered' | 'split';
export type ScheduleVariant = 'cardGrid' | 'minimalList';
export type BeforeAfterVariant = 'split' | 'carousel';
export type CaseStudiesVariant = 'cardGrid' | 'minimalList';
export type PortfolioVariant = 'masonryGrid' | 'cardGrid' | 'fullBleed';
export type BookingVariant = 'centered' | 'split';

// ── Theme Keys ───────────────────────────────────────────
export type ThemeKey =
  | 'luxurySoft'
  | 'modernBold'
  | 'warmNeutral'
  | 'darkLuxury'
  | 'darkTech'
  | 'darkEnergy'
  | 'darkAuthority'
  | 'playfulBright'
  | 'clinicalClean'
  | 'warmCare'
  | 'zenMinimal'
  | 'industrialStrong'
  | 'energeticBrand'
  | 'editorialMinimal'
  | 'organicEarth'
  | 'craftMinimal'
  | 'utilitarian';

// ── Theme Definition ─────────────────────────────────────
export interface ThemeDefinition {
  key: ThemeKey;
  name: string;
  // Colors
  bgPrimary: string;
  bgSecondary: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentHover: string;
  border: string;
  cardBg: string;
  // Typography
  headingFont: string;
  bodyFont: string;
  headingWeight: string;
  // Spacing
  sectionGap: string; // e.g. '120px', '80px', '60px'
  density: 'airy' | 'balanced' | 'dense';
  // Mood
  isDark: boolean;
  borderRadius: string; // e.g. '0px', '8px', '16px', '24px'
}

// ── Section Layout Mapping ───────────────────────────────
export interface SectionLayoutMap {
  hero?: HeroVariant;
  services?: ServicesVariant;
  about?: AboutVariant;
  reviews?: ReviewsVariant;
  gallery?: GalleryVariant;
  footer?: FooterVariant;
  faq?: FAQVariant;
  credentials?: CredentialsVariant;
  team?: TeamVariant;
  pricing?: PricingVariant;
  contact?: ContactVariant;
  schedule?: ScheduleVariant;
  before_after?: BeforeAfterVariant;
  case_studies?: CaseStudiesVariant;
  portfolio?: PortfolioVariant;
  booking?: BookingVariant;
  testimonials?: ReviewsVariant; // Testimonials share reviews layout system
}

// ── Template Definition ──────────────────────────────────
export interface TemplateDefinition {
  id: string;
  name: string;
  category: BusinessCategory;
  theme: ThemeKey;
  description: string;
  conversionStrategy: string;
  sectionOrder: SectionType[];
  layouts: SectionLayoutMap;
  color: string; // Thumbnail card accent color
}

// ── Business Data (passed to all sections) ───────────────
export interface SectionProps {
  business: {
    id: string;
    name: string;
    category: string;
    email: string;
    phone: string;
    subdomain: string;
    logo: string | null;
    coverImage: string | null;
    primaryColor: string;
    heroTitle: string;
    heroSubtitle: string;
    ctaText: string;
    secondaryCtaText?: string;
    trustSection: 'reviews' | 'proof' | 'both' | 'none';
    aboutTitle: string;
    aboutDescription: string;
    aboutImage: string | null;
    address: string;
    socials: { instagram: string; facebook: string; twitter: string };
    reviews: Array<{ id: string; customer_name: string; rating: number; comment: string }>;
    proofOfWork: Array<{ id: string; image_url: string; caption: string }>;
    services: Array<{ id: string; name: string; description: string; price: number; duration: number }>;
    staff?: Array<{ id: string; name: string; role: string; avatarUrl?: string }>;
    templateKey: string;
    isPublished: boolean;
    workingHours: Array<{ dayOfWeek: number; startTime: string; endTime: string; isOpen: boolean }>;
  };
  onBook: () => void;
  scrollTo?: (id: string) => void;
  isMobile?: boolean;
  isPreview?: boolean;
}

// ── Template Layout Component Props ──────────────────────
export interface TemplateLayoutProps extends SectionProps {
  template: TemplateDefinition;
}

// ── Template Info (for the switcher UI) ──────────────────
export interface TemplateInfo {
  key: string;
  name: string;
  category: string;
  description: string;
  color: string;
  thumbnail?: string;
}
