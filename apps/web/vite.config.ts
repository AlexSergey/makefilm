import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import react from '@vitejs/plugin-react';
import { config } from 'dotenv';
/// <reference types='vitest' />
import { defineConfig } from 'vite';

config({
  override: false,
});

export default defineConfig({
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    emptyOutDir: true,
    outDir: '../../dist/apps/web',
    reportCompressedSize: true,
  },
  cacheDir: '../../node_modules/.vite/apps/web',
  define: {
    'process.env': {
      API_PREFIX: process.env['API_PREFIX'],
      API_URL: process.env['API_URL'],
    },
  },
  envDir: '../../env',
  plugins: [react(), nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],
  preview: {
    host: 'localhost',
    port: 4300,
  },
  root: __dirname,
  server: {
    host: 'localhost',
    port: 4200,
  },
});
