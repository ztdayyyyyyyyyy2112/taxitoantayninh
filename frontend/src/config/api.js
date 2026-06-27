const DEFAULT_LOCAL_API = 'http://localhost:5000';

export const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? DEFAULT_LOCAL_API : '');

export const getApiUrl = path => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};
