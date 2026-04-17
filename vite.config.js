import { defineConfig } from 'vite';

export default defineConfig({
  // Ensures assets are linked relatively so they load correctly after deployment
  base: './',
  
  build: {
    // Vercel will look for this 'dist' folder after running 'vite build'
    outDir: 'dist',
    emptyOutDir: true,
  },
  
  server: {
    port: 3000,
  }
});
