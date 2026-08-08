/**
 * Helper to resolve image URLs for both local dev and production hosting
 * (e.g. Vercel / Render / single domain / multi domain).
 */
export const getImageUrl = (url?: string | null, fallback = '/assets/hero-bg.png'): string => {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return fallback;
  }

  const trimmed = url.trim();

  // Full URL or data URI
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }

  // Backend uploaded file starting with /uploads/
  if (trimmed.startsWith('/uploads/')) {
    const apiBase = import.meta.env.VITE_API_URL || '';
    
    // If VITE_API_URL is an absolute HTTP URL (e.g. http://localhost:8000/api/v1 or https://my-backend.com/api/v1)
    if (apiBase.startsWith('http://') || apiBase.startsWith('https://')) {
      const rootHost = apiBase.replace(/\/api\/v1\/?$/, '');
      return `${rootHost}${trimmed}`;
    }

    // In local dev browser window, if running frontend on port (e.g. 5173 / 5174) and backend is on 8000
    if (typeof window !== 'undefined' && window.location && window.location.port && window.location.port !== '8000') {
      const protocol = window.location.protocol || 'http:';
      const hostname = window.location.hostname || 'localhost';
      return `${protocol}//${hostname}:8000${trimmed}`;
    }

    return trimmed;
  }

  // Static assets or relative paths starting with /assets/ or /
  return trimmed;
};
