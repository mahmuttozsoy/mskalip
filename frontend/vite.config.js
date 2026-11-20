import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-root-public-files',
      closeBundle() {
        const publicDir = path.resolve('public');
        const distDir = path.resolve('dist');
        if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });
        const filesToCopy = [
          'logo.png',
          'logo-icon.png',
          'favicon.ico',
          'favicon-48x48.png',
          'favicon-96x96.png',
          'favicon-192x192.png',
          'apple-touch-icon.png',
          'site.webmanifest',
          '.htaccess',
          'sitemap.xml',
          'robots.txt',
        ];
        for (const file of filesToCopy) {
          const src = path.join(publicDir, file);
          const dst = path.join(distDir, file);
          if (fs.existsSync(src)) {
            fs.copyFileSync(src, dst);
          }
        }
      },
    },
  ],
  build: {
    copyPublicDir: false,
  },
});
