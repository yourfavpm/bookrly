/**
 * Returns the root domain of the app (e.g. "skeduley.com" in prod, "localhost:5173" locally).
 * Reads VITE_ROOT_DOMAIN env var first, then falls back to runtime detection.
 */
export const getRootDomain = (): string => {
  // 1. Use explicit env var if provided (most reliable)
  const envDomain = import.meta.env.VITE_ROOT_DOMAIN;
  if (envDomain && !envDomain.includes('localhost')) {
    return envDomain;
  }

  const host = window.location.hostname;

  // 2. Local dev
  if (host === 'localhost' || host === '127.0.0.1') {
    return window.location.host; // includes port e.g. "localhost:5173"
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

  if (isLocalDev || isVercelPreview) {
    // Path-based for local dev and Vercel previews (subdomain DNS not available)
    const protocol = window.location.protocol;
    return `${protocol}//${rootDomain}/${subdomain}`;
  }

  // Production: subdomain-based URL
  return `https://${subdomain}.${rootDomain}`;
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
    const reserved = ['www', 'app', 'api', 'admin', 'dashboard', 'mail', 'smtp'];
    if (!reserved.includes(sub)) {
      return sub;
    }
  }

  return null;
};

