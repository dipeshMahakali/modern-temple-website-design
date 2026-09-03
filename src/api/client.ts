/**
 * Central API Service
 * Axios instance with JWT auth, token refresh, error handling
 */
import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // for httpOnly cookies
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token storage
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

// Request interceptor — attach JWT
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    if (config.method?.toLowerCase() === 'get') {
      config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
      config.headers['Pragma'] = 'no-cache';
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 and auto-refresh
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value: string) => void; reject: (error: Error) => void }> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const isAuthRequest = originalRequest.url?.includes('/auth/refresh') || originalRequest.url?.includes('/auth/login');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await api.post('/auth/refresh');
        const { access_token } = response.data;
        setAccessToken(access_token);
        processQueue(null, access_token);
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        setAccessToken(null);
        window.dispatchEvent(new CustomEvent('auth:logout'));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Public API helpers
export const publicApi = {
  getTimeline: () => api.get('/public/timeline'),
  getGallery: (category?: string) => api.get('/public/gallery', { params: { category } }),
  getEvents: (limit = 10) => api.get('/public/events', { params: { limit } }),
  getNavigation: (location?: string) => api.get('/public/navigation', { params: { location } }),
  getTempleInfo: (group?: string) => api.get('/public/temple-info', { params: { group } }),
  getSeo: (slug: string) => api.get(`/public/seo/${slug}`),
  getSections: () => api.get('/public/all-sections'),
  getPageStatus: (slug: string) => api.get(`/public/page-status/${slug}`),
  getHero: () => api.get('/public/hero'),
  getStats: () => api.get('/public/stats'),
  getTrustees: () => api.get('/public/trustees'),
  getTestimonials: () => api.get('/public/testimonials'),
  getInstructions: () => api.get('/public/instructions'),
  getServices: () => api.get('/public/services'),
  getBankDetails: () => api.get('/public/bank-details'),
  getTimings: () => api.get('/public/timings'),
  getSectionsList: () => api.get('/public/sections-list'),
  getFormConfig: (slug: string) => api.get(`/public/forms/${slug}`),
  submitContact: (data: any) => api.post('/admin/contact/messages/submit', data),
};

export default api;
