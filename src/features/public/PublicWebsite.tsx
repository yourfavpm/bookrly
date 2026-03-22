import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { Globe } from 'lucide-react';
import { getTemplateComponent } from './templates/templateRegistry';
import { BookingModal } from './sections/BookingModal';

interface PublicWebsiteProps {
  forcedView?: 'desktop' | 'mobile';
  isPreview?: boolean;
}

export const PublicWebsite: React.FC<PublicWebsiteProps> = ({ forcedView, isPreview }) => {
  const { subdomain: paramSubdomain } = useParams<{ subdomain: string }>();
  const { business, fetchPublicBusiness, loading, error, user } = useAppStore();
  const [isBooking, setIsBooking] = useState(false);
  const isMobile = forcedView === 'mobile';

  const layoutElement = useMemo(() => {
    if (!business) return null;
    const component = getTemplateComponent(business.templateKey || 'clean_classic');
    return React.createElement(component, {
      business: business as any,
      onBook: () => setIsBooking(true),
      isMobile
    });
  }, [business, isMobile]);

  useEffect(() => {
    const resolveTenant = async () => {
      if (isPreview) return;

      let targetSubdomain = paramSubdomain;
      if (!targetSubdomain) {
        const host = window.location.hostname;
        const rootDomain = import.meta.env.VITE_ROOT_DOMAIN || 'localhost';
        
        if (host !== rootDomain && host.endsWith(rootDomain)) {
          // Subdomain case (e.g. biz.bukd.co)
          targetSubdomain = host.replace(`.${rootDomain}`, '');
        } else if (host !== rootDomain && host !== 'localhost' && !host.includes('vercel.app')) {
          // Custom domain case (e.g. mybiz.com)
          targetSubdomain = host;
        }
      }

      if (targetSubdomain) {
        fetchPublicBusiness(targetSubdomain);
      }
    };
    resolveTenant();
  }, [paramSubdomain, fetchPublicBusiness, isPreview]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error || !business) return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black text-text-primary">404</h1>
        <p className="text-text-secondary">Website not found or unavailable.</p>
      </div>
    </div>
  );

  if (!business.isPublished && !user && !isPreview) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <div className="text-center space-y-4">
          <Globe className="mx-auto text-text-tertiary" size={48} />
          <h1 className="text-2xl font-bold text-text-primary">Under Construction</h1>
          <p className="text-text-secondary max-w-sm mx-auto">This website has been unpublished by the owner. Please check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-white flex flex-col relative font-sans">
      {/* Owner preview bar - only show on actual public site, not in-editor preview */}
      {user && !isPreview && (
        <div className="bg-text-primary text-white px-4 py-2.5 flex items-center justify-between text-xs sticky top-0 z-50">
          <span className="font-medium opacity-80">You're previewing your live site</span>
          <button 
            onClick={() => window.location.href = '/dashboard/website'} 
            className="bg-white text-text-primary px-4 py-1.5 rounded-lg font-semibold hover:bg-gray-100 transition-colors no-underline"
          >
            Exit Preview
          </button>
        </div>
      )}

      {/* Template-driven layout */}
      {layoutElement}

      {/* Booking Flow Modal — shared across all templates */}
      <BookingModal isOpen={isBooking} onClose={() => setIsBooking(false)} />
    </div>
  );
};