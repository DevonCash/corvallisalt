import { defineConfig } from 'astro/config';

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  experimental: {
    redirects: true
  },
  output: 'hybrid',
  site: 'https://corvallisalt.org',
  redirects: {
    '/': '/events'
  },
  adapter: cloudflare()
});