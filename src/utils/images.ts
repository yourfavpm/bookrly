/**
 * Standardizes image URLs for public templates.
 *
 * Supabase's image transformation endpoint is not guaranteed for every bucket
 * or object type, so uploaded business assets must render from the public
 * object URL first. Broken transformed URLs are worse than unoptimized images.
 */
export const getOptimizedImageUrl = (
  url: string | null | undefined, 
  options: { width?: number; quality?: number; resize?: 'cover' | 'contain' } = {}
): string => {
  if (!url) return '';

  if (url.startsWith('data:') || url.startsWith('blob:') || url.startsWith('/')) {
    return url;
  }

  try {
    const parsed = new URL(url);

    if (parsed.hostname.endsWith('.supabase.co') && parsed.pathname.includes('/storage/v1/object/public/')) {
      return url;
    }

    if (parsed.hostname.includes('images.unsplash.com')) {
      const { width = 800, quality = 80, resize = 'cover' } = options;
      parsed.searchParams.set('w', String(width));
      parsed.searchParams.set('q', String(quality));
      parsed.searchParams.set('fit', resize === 'contain' ? 'max' : 'crop');
      parsed.searchParams.set('auto', 'format');
      return parsed.toString();
    }
  } catch {
    return url;
  }

  return url;
};
