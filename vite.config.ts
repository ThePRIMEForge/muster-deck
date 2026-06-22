import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // GH_PAGES_BASE is set by the deploy workflow; local dev stays at /
  base: process.env.GH_PAGES_BASE ?? '/',
  plugins: [react()],
});
