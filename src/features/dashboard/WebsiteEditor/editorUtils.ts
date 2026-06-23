import { supabase } from '../../../lib/supabase';

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
const VIDEO_TYPES = ['video/mp4', 'video/webm'];

interface UploadOptions {
  businessId: string;
  file: File;
  folder: string;
  allowVideo?: boolean;
  maxSizeMb?: number;
}

export const normalizeEditorSectionKey = (section: string): string => {
  if (section === 'results' || section === 'before-after') return 'before_after';
  if (section === 'testimonials') return 'reviews';
  if (section === 'portfolio') return 'gallery';
  if (section === 'schedule') return 'availability';
  return section;
};

export const getEditorSectionLabel = (section: string): string => {
  const key = normalizeEditorSectionKey(section);
  const labels: Record<string, string> = {
    before_after: 'Results',
    case_studies: 'Case Studies',
    services: 'Services',
    reviews: 'Reviews',
    gallery: 'Gallery',
    availability: 'Availability',
    contact: 'Contact',
    hero: 'Hero',
    about: 'About',
    faq: 'FAQ',
    footer: 'Footer',
    booking: 'Booking',
    pricing: 'Pricing',
    team: 'Team',
    credentials: 'Credentials'
  };

  return labels[key] || key.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
};

export const validateEditorUpload = (file: File, allowVideo = false, maxSizeMb = allowVideo ? 30 : 10): string | null => {
  const allowedTypes = allowVideo ? [...IMAGE_TYPES, ...VIDEO_TYPES] : IMAGE_TYPES;
  if (!allowedTypes.includes(file.type)) {
    return allowVideo ? 'Upload a JPG, PNG, WEBP, SVG, MP4, or WEBM file.' : 'Upload a JPG, PNG, WEBP, or SVG image.';
  }

  if (file.size > maxSizeMb * 1024 * 1024) {
    return `File is too large. Maximum size is ${maxSizeMb}MB.`;
  }

  return null;
};

export const uploadEditorAsset = async ({ businessId, file, folder, allowVideo = false, maxSizeMb }: UploadOptions): Promise<string> => {
  const validationError = validateEditorUpload(file, allowVideo, maxSizeMb);
  if (validationError) throw new Error(validationError);

  const ext = file.name.split('.').pop()?.toLowerCase() || 'asset';
  const uniqueName = `${folder}-${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
  const filePath = `${businessId}/${folder}/${uniqueName}`;
  const { error } = await supabase.storage.from('business-assets').upload(filePath, file, { upsert: false });
  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage.from('business-assets').getPublicUrl(filePath);
  return publicUrl;
};
