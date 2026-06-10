import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, '..', 'dist');
const SITE_ORIGIN = 'https://sudongcu.github.io';

const withTrailingSlash = (p) => (p.endsWith('/') ? p : `${p}/`);
const url = (p) => `${SITE_ORIGIN}${withTrailingSlash(p)}`;

const ROUTES = [
  {
    path: '/lab',
    title: 'Lab — Free Browser Developer Tools | DG.DEV',
    description: 'Compact web tools that run entirely in your browser. No signup, no uploads. PhoneFrame mockup generator and more.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'DG.DEV Lab',
      url: url('/lab'),
      description: 'Collection of free browser-based developer tools.',
    },
  },
  {
    path: '/lab/gemini-watermark-remover',
    title: 'Gemini Watermark Remover — Free AI Image Cleanup | DG.DEV Lab',
    description: 'Remove the Gemini / Nano Banana watermark from AI-generated images in seconds. Free, browser-based, no uploads — your image never leaves your device.',
    image: '/labs/gemini-watermark-remover.png',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Gemini Watermark Remover',
      url: url('/lab/gemini-watermark-remover'),
      applicationCategory: 'MultimediaApplication',
      operatingSystem: 'Any (browser)',
      description: 'Free browser-based tool that removes the visible Gemini / Nano Banana watermark from AI-generated images using inpainting.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      isAccessibleForFree: true,
    },
  },
  {
    path: '/lab/phoneframe',
    title: 'PhoneFrame — Free iPhone Mockup Generator | DG.DEV Lab',
    description: 'Wrap any screenshot in a realistic iPhone-style mockup frame. Free, browser-based, no uploads. Export as PNG in seconds.',
    image: '/labs/phoneframe.png',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'PhoneFrame',
      url: url('/lab/phoneframe'),
      applicationCategory: 'DesignApplication',
      operatingSystem: 'Any (browser)',
      description: 'Free browser-based tool that wraps a screenshot in an iPhone-style mockup frame and exports as PNG.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      isAccessibleForFree: true,
    },
  },
];

const escapeAttr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function buildHead({ title, description, path, jsonLd, image }) {
  const canonical = url(path);
  const ogImage = `${SITE_ORIGIN}${image || '/logo.png'}`;
  return `
    <title>${escapeAttr(title)}</title>
    <meta name="description" content="${escapeAttr(description)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${canonical}" />

    <meta property="og:title" content="${escapeAttr(title)}" />
    <meta property="og:description" content="${escapeAttr(description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="${ogImage}" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeAttr(title)}" />
    <meta name="twitter:description" content="${escapeAttr(description)}" />
    <meta name="twitter:image" content="${ogImage}" />

    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`;
}

function rewriteHead(template, headInjection) {
  let out = template;

  out = out.replace(/<title>[\s\S]*?<\/title>/i, '');
  out = out.replace(/<meta\s+name="description"[^>]*>/gi, '');
  out = out.replace(/<meta\s+name="robots"[^>]*>/gi, '');
  out = out.replace(/<link\s+rel="canonical"[^>]*>/gi, '');
  out = out.replace(/<meta\s+property="og:[^"]+"[^>]*>/gi, '');
  out = out.replace(/<meta\s+name="twitter:[^"]+"[^>]*>/gi, '');

  out = out.replace(/<\/head>/i, `${headInjection}\n  </head>`);
  return out;
}

async function main() {
  const indexPath = resolve(distDir, 'index.html');
  const template = await readFile(indexPath, 'utf8');

  for (const route of ROUTES) {
    const head = buildHead(route);
    const html = rewriteHead(template, head);
    const outDir = resolve(distDir, route.path.replace(/^\//, ''));
    await mkdir(outDir, { recursive: true });
    const outPath = resolve(outDir, 'index.html');
    await writeFile(outPath, html, 'utf8');
    console.log(`prerendered: ${route.path} → ${outPath.replace(distDir, 'dist')}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
