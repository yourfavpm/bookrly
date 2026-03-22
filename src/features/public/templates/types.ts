// Shared props interface for all template section components
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
    trustSection: 'reviews' | 'proof' | 'both' | 'none';
    aboutTitle: string;
    aboutDescription: string;
    aboutImage: string | null;
    address: string;
    socials: { instagram: string; facebook: string; twitter: string };
    reviews: Array<{ id: string; customer_name: string; rating: number; comment: string }>;
    proofOfWork: Array<{ id: string; image_url: string; caption: string }>;
    services: Array<{ id: string; name: string; description: string; price: number; duration: number }>;
    templateKey: string;
    isPublished: boolean;
    workingHours: Array<{ dayOfWeek: number; startTime: string; endTime: string; isOpen: boolean }>;
  };
  onBook: () => void;
  isMobile?: boolean;
  isPreview?: boolean;
}

// Shared props for template layout components
export type TemplateLayoutProps = SectionProps;

// Template metadata
export interface TemplateInfo {
  key: string;
  name: string;
  category: string;
  description: string;
  color: string; // For the thumbnail card
}
