import { defineConfig } from 'astro/config';
import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";


// https://astro.build/config
export default defineConfig({
  output: 'server',
  site: 'https://corvallisalt.org',
  adapter: cloudflare(),
  integrations: [mdx()]
});