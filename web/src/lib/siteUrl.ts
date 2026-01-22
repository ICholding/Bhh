/**
 * Site URL Configuration
 * Provides consistent site URL across the application
 */

// Try Vite environment variable first, then Next.js, then fallback to window.location.origin
const getEnvSiteUrl = (): string | undefined => {
  // Vite environment
  if (import.meta.env?.VITE_PUBLIC_SITE_URL) {
    return import.meta.env.VITE_PUBLIC_SITE_URL;
  }
  
  // Next.js environment (for compatibility)
  if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  
  return undefined;
};

// Get site URL with fallback to window.location.origin if in browser
export const SITE_URL = getEnvSiteUrl() || 
  (typeof window !== 'undefined' ? window.location.origin : 'https://bhh.icholding.cloud');
