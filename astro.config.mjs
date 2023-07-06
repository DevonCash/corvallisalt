import { defineConfig } from 'astro/config';
import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";

import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  output: 'hybrid',
  site: 'https://corvallisalt.org',
  adapter: cloudflare(),
  integrations: [mdx(), svelte()]
});