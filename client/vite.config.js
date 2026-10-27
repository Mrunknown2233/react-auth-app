import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Proxy keeps API + app on one origin, so the httpOnly cookie works without CORS setup
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, proxy: { '/api': 'http://localhost:5000' } },
});
