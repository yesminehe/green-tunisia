// Configuration file for frontend
// Create a .env.local file with: NEXT_PUBLIC_API_URL=http://localhost:5000/api

export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
};
