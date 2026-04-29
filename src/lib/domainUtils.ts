/**
 * Utility to get the base domain of the current environment.
 * Handles localhost and production domains dynamically.
 */
export const getBaseDomain = () => {
  const host = window.location.host;
  
  // If we're on localhost or Vercel, just return the full host
  if (host.includes('localhost') || host.includes('vercel.app')) {
    return host;
  }
  
  // For production, we want the root domain (e.g., bukd.co or opsly.com)
  // Even if we're on a subdomain like app.bukd.co
  const parts = host.split('.');
  if (parts.length > 2) {
    // Check for common TLDs like .co.uk if necessary, 
    // but for bukd.co / bukd.com, taking the last two is enough
    return parts.slice(-2).join('.');
  }
  
  return host;
};

/**
 * Generates the full public URL for a business based on its subdomain slug.
 * Free users: domain.com/p/slug
 * (In the future, Pro users with custom domains will use their domain)
 */
export const getBusinessUrl = (subdomain: string, customDomain?: string | null) => {
  if (customDomain) {
    return `https://${customDomain}`;
  }
  
  const base = getBaseDomain();
  const protocol = base.includes('localhost') ? window.location.protocol : 'https:';
  // Using the path-based pattern for free subdomains
  return `${protocol}//${base}/p/${subdomain}`;
};
