// config/api.ts
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Add a debug log to check what URL is being used
console.log('API_URL configured as:', API_URL);