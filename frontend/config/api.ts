// config/api.ts
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Optional: Add debug logging that only shows in development
if (import.meta.env.DEV) {
  console.log('API_URL configured as:', API_URL);
}