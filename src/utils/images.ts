/**
 * Standardizes image optimization for Supabase storage URLs.
 * Adds transformation parameters for width, quality, and resizing.
 */
export const getOptimizedImageUrl = (
  url: string | null | undefined, 
  options: { width?: number; quality?: number; resize?: 'cover' | 'contain' } = {}
): string => {
  if (!url) return '';
  
  // Only apply transformations to Supabase storage URLs
  if (url.includes('.supabase.co/storage/v1/object/public/')) {
    const { width = 800, quality = 80, resize = 'cover' } = options;
    
    // Change 'object/public' to 'render/image/public' for transformation support
    const transformedUrl = url.replace('/object/public/', '/render/image/public/');
    
    // Append transformation parameters
    const params = new URLSearchParams();
    params.append('width', width.toString());
    params.append('quality', quality.toString());
    params.append('resize', resize);
    
    return `${transformedUrl}?${params.toString()}`;
  }
  
  return url;
};
