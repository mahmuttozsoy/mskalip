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
        for (const file of ['logo.png', 'logo-icon.png', 'favicon.svg', 'icons.svg', '.htaccess', 'sitemap.xml', 'robots.txt']) {
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
