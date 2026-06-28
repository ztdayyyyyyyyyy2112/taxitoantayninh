const FALLBACK_API_URL = 'https://taxi-tayninh-backend.onrender.com';
const rawUrl = import.meta.env.VITE_API_URL || '';

export const API_BASE_URL = (rawUrl.trim() || (import.meta.env.PROD ? FALLBACK_API_URL : '')).replace(/\/+$/, '');

export const getApiUrl = path => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};
