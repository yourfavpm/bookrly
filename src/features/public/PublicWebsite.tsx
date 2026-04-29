import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { Globe, ShieldCheck, Sparkles, ArrowLeft } from 'lucide-react';
import { getBaseDomain } from '../../lib/domainUtils';
import { getTemplate } from './templates/templateRegistry';
import { BookingModal } from './sections/BookingModal';
import { getSampleBusiness } from './templates/sampleData';
import { TemplateRenderer } from './templates/TemplateRenderer';

interface PublicWebsiteProps {
  forcedView?: 'desktop' | 'mobile';
  isPreview?: boolean;
  isDemo?: boolean;
}

export const PublicWebsite: React.FC<PublicWebsiteProps> = ({ forcedView, isPreview, isDemo: propIsDemo }) => {
  const { subdomain: paramSubdomain, templateKey: demoTemplateKey } = useParams<{ subdomain: string, templateKey: string }>();
  const { business: storeBusiness, fetchPublicBusiness, loading, error, user, updateBusiness, isCanada } = useAppStore();
  const [isBooking, setIsBooking] = useState(false);
  const isMobile = forcedView === 'mobile';
  const navigate = useNavigate();

  // Determine if we are in demo mode
  const isDemo = propIsDemo || !!demoTemplateKey;

  const business = useMemo(() => {
    if (!storeBusiness && !isDemo) return null;
    if (isDemo && demoTemplateKey) {
      const sample = getSampleBusiness(demoTemplateKey, storeBusiness || { id: 'demo', primaryColor: '#000000', services: [], proofOfWork: [], reviews: [] } as any);
      return {
        ...sample,
        subscriptionStatus: 'active', // Mock for demo
        isPublished: true,
      } as any;
    }
    return storeBusiness;
  }, [storeBusiness, isDemo, demoTemplateKey]);

  const layoutElement = useMemo(() => {
    if (!business) return null;
    const templateKey = (demoTemplateKey as string) || business.templateKey || 'beauty_editorial_luxe';
    const template = getTemplate(templateKey);
    
    return (
      <TemplateRenderer
        template={template}
        business={business as any}
        onBook={() => setIsBooking(true)}
        isMobile={isMobile}
        isPreview={isPreview || isDemo}
      />
    );
  }, [business, isMobile, isPreview, isDemo, demoTemplateKey]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('booking_success') === 'true' || params.get('booking_cancel') === 'true') {
      setTimeout(() => setIsBooking(true), 0);
    }

    const resolveTenant = async () => {
      if (isPreview) return;

      let targetSubdomain = paramSubdomain;
      if (!targetSubdomain) {
        const host = window.location.hostname;
        const rootDomain = getBaseDomain();
        
        if (host !== rootDomain && host.endsWith(rootDomain)) {
          // Subdomain case (e.g. biz.bukd.co)
          targetSubdomain = host.replace(`.${rootDomain}`, '');
        } else if (host !== rootDomain && host !== 'localhost' && !host.includes('vercel.app')) {
          // Custom domain case (e.g. mybiz.com)
          targetSubdomain = host;
        }
      }

      if (targetSubdomain) {
        try {
          await fetchPublicBusiness(targetSubdomain);
        } catch (err) {
          console.error('[PublicWebsite] Failed to fetch business:', err);
        }
      }
    };
    resolveTenant();
  }, [paramSubdomain, fetchPublicBusiness, isPreview]);

  const isTrialing = business?.subscriptionStatus === 'trialing';
  const gracePeriodDays = 3;
  const trialEndDate = business?.trialEndDate ? new Date(business.trialEndDate) : null;
  const restrictionDate = trialEndDate ? new Date(trialEndDate.getTime() + gracePeriodDays * 24 * 60 * 60 * 1000) : null;
  const isTrialExpired = isTrialing && restrictionDate && new Date() > restrictionDate;
  const isActive = business?.subscriptionStatus === 'active';
  const isRestricted = (isTrialExpired || (!isTrialing && !isActive)) && !isPreview;

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

  if (isRestricted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <div className="text-center space-y-4">
          <ShieldCheck className="mx-auto text-brand opacity-20" size={48} />
          <h1 className="text-2xl font-bold text-text-primary">Service Temporarily Unavailable</h1>
          <p className="text-text-secondary max-w-sm mx-auto">This business website is currently not accepting bookings. Please check back later or contact the owner directly.</p>
        </div>
      </div>
    );
  }

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
      {/* Canada First Banner */}
      {isCanada && !isDemo && (
        <div className="bg-red-600 text-white px-4 py-2 flex items-center justify-center gap-2 sticky top-0 z-60 shadow-md">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] flex items-center gap-2">
            🇨🇦 Proudly Supporting Canadian Businesses
          </span>
        </div>
      )}

      {/* Demo Header - Only show on standalone demo page, not in-editor preview */}
      {isDemo && !isPreview && (
        <div className="bg-brand text-white px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-xl overflow-hidden">
          <div className="absolute inset-0 bg-white/10 -skew-x-12 translate-x-1/2" />
          <div className="flex items-center gap-4 relative z-10">
            <button 
              onClick={() => navigate('/dashboard/templates')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-white/80" />
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-80">Viewing Template Demo</span>
              </div>
              <h3 className="text-lg font-bold tracking-tight">
                {demoTemplateKey?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-3 relative z-10">
            <button 
              onClick={() => {
                if (demoTemplateKey) {
                  updateBusiness({ templateKey: demoTemplateKey });
                  navigate('/dashboard/website');
                }
              }}
              className="bg-white text-brand px-6 py-2 rounded-xl font-bold text-sm shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              Use This Template
            </button>
          </div>
        </div>
      )}

      {/* Owner preview bar - only show on actual public site, not in-editor preview */}
      {user && !isPreview && !isDemo && (
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