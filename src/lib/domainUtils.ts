const RESERVED_SUBDOMAINS = [
  'www',
  'app',
  'api',
  'admin',
  'dashboard',
  'mail',
  'smtp',
  'support',
  'help',
  'billing',
  'auth',
  'login',
  'signup',
  'onboarding',
  'preview',
  'demo',
  'invite',
  'unsubscribe',
  'p'
];

export const isReservedSubdomain = (subdomain: string): boolean => {
  return RESERVED_SUBDOMAINS.includes(subdomain.toLowerCase());
};

export const slugifyDomainLabel = (value: string): string => {
  return value
    .toLowerCase()
    .trim()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 63)
    .replace(/-+$/g, '');
};

export const isDefaultSubdomain = (subdomain?: string | null): boolean => {
  return !subdomain || /^biz-[a-z0-9-]+$/i.test(subdomain);
};

export const generateBusinessSubdomain = (businessName: string, businessId?: string): string => {
  const fromName = slugifyDomainLabel(businessName).slice(0, 50).replace(/-+$/g, '');
  const candidate = fromName.length >= 3 ? fromName : `biz-${(businessId || crypto.randomUUID()).slice(0, 8)}`;
  return isReservedSubdomain(candidate) ? `${candidate}-${(businessId || 'site').slice(0, 6)}` : candidate;
};

export const normalizeDomainIdentifier = (identifier: string): string => {
  return identifier
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')
    .replace(/\.$/, '');
};

export const getDomainLookupCandidates = (identifier: string): string[] => {
  const normalized = normalizeDomainIdentifier(identifier);
  if (!normalized) return [];

  const rootDomain = getRootDomain().split(':')[0];
  const withoutWww = normalized.startsWith('www.') ? normalized.slice(4) : normalized;
  const label = withoutWww.endsWith(`.${rootDomain}`)
    ? withoutWww.slice(0, -(rootDomain.length + 1))
    : withoutWww;

  return Array.from(new Set([
    normalized,
    withoutWww,
    label,
    `${label}.${rootDomain}`
  ].filter(Boolean)));
};

/**
 * Returns the root domain of the app (e.g. "skeduley.com" in prod, "localhost:5173" locally).
 * Reads VITE_ROOT_DOMAIN env var first, then falls back to runtime detection.
 */
export const getRootDomain = (): string => {
  const host = window.location.hostname;

  // 1. Local dev must win over VITE_ROOT_DOMAIN so local preview/live links
  // resolve to localhost instead of the production domain.
  if (host === 'localhost' || host === '127.0.0.1') {
    return window.location.host; // includes port e.g. "localhost:5173"
  }

  // 2. Use explicit env var in deployed environments.
  const envDomain = import.meta.env.VITE_ROOT_DOMAIN;
  if (envDomain && !envDomain.includes('localhost')) {
    return normalizeDomainIdentifier(envDomain);
  }

  // 3. Vercel preview deployments — use the full host as root
  if (host.includes('vercel.app')) {
    return host;
  }

  // 4. Production: strip subdomains to get root domain
  // e.g. "app.skeduley.com" → "skeduley.com"
  const parts = host.split('.');
  if (parts.length > 2) {
    return parts.slice(-2).join('.');
  }

  return host;
};

/**
 * @deprecated Use getRootDomain() instead.
 */
export const getBaseDomain = getRootDomain;

/**
 * Returns the canonical public booking URL for a business.
 *
 * Pattern preference:
 *  1. Custom domain:  https://mybiz.com
 *  2. Subdomain:      https://businessname.skeduley.com  (production)
 *  3. Path-based:     http://localhost:5173/businessname  (local dev / Vercel previews)
 *
 * Note: Subdomain URLs only work once *.skeduley.com wildcard DNS is configured on Vercel.
 */
export const getBusinessUrl = (subdomain: string, customDomain?: string | null): string => {
  if (!subdomain) return '';

  if (customDomain) {
    return `https://${customDomain}`;
  }

  const rootDomain = getRootDomain();
  const isLocalDev = rootDomain.includes('localhost') || rootDomain.includes('127.0.0.1');
  const isVercelPreview = rootDomain.includes('vercel.app');

  if (isVercelPreview) {
    // Path-based for Vercel previews (subdomain DNS not available)
    const protocol = window.location.protocol;
    return `${protocol}//${rootDomain}/${subdomain}`;
  }

  // Production and Local Dev: subdomain-based URL
  const url = `https://${subdomain}.${rootDomain}`;
  return isLocalDev ? url.replace('https://', 'http://') : url;
};

export const getBookingConfirmationUrl = (
  bookingUrlBase: string,
  params: { bookingId?: string; sessionId?: string; cancelled?: boolean } = {}
): string => {
  const base = `${bookingUrlBase.replace(/\/$/, '')}/`;
  const url = new URL('booking/confirmation', base);
  const queryParts: string[] = [];

  if (params.bookingId) queryParts.push(`booking_id=${encodeURIComponent(params.bookingId)}`);
  if (params.cancelled) queryParts.push('cancelled=true');
  if (params.sessionId) {
    queryParts.push(params.sessionId === '{CHECKOUT_SESSION_ID}'
      ? 'session_id={CHECKOUT_SESSION_ID}'
      : `session_id=${encodeURIComponent(params.sessionId)}`);
  }

  return `${url.toString()}${queryParts.length > 0 ? `?${queryParts.join('&')}` : ''}`;
};

export const appendPathToUrl = (baseUrl: string, path: string): string => {
  const normalizedBase = baseUrl.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
};

/**
 * Extracts the business identifier from the current browser URL.
 * Works for both subdomain routing (businessname.skeduley.com) 
 * and path routing (skeduley.com/businessname).
 * Returns null if we're on the root domain or a known app route.
 */
export const extractSubdomainFromHost = (): string | null => {
  const host = window.location.hostname;
  const rootDomain = getRootDomain();

  // Remove port for comparison
  const rootDomainHost = rootDomain.split(':')[0];

  if (host === rootDomainHost || host === 'localhost' || host === '127.0.0.1') {
    return null; // We're on the root domain, not a tenant subdomain
  }

  if (host.endsWith(`.${rootDomainHost}`)) {
    // Subdomain case: businessname.skeduley.com
    const sub = host.replace(`.${rootDomainHost}`, '');
    // Exclude reserved/app subdomains
    if (!isReservedSubdomain(sub)) {
      return sub;
    }
  }

  if (!host.includes('vercel.app') && !host.endsWith('.localhost')) {
    return normalizeDomainIdentifier(host);
  }

  return null;
};
