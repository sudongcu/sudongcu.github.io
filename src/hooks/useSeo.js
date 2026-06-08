import { useEffect } from 'react';

const SITE_ORIGIN = 'https://sudongcu.github.io';

const setMeta = (selector, attr, value) => {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    const [, key, name] = selector.match(/^meta\[(name|property)="(.+)"\]$/) || [];
    if (key && name) el.setAttribute(key, name);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
};

const setCanonical = (href) => {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
};

const setJsonLd = (data) => {
  let el = document.head.querySelector('script[type="application/ld+json"][data-seo="route"]');
  if (data == null) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement('script');
    el.setAttribute('type', 'application/ld+json');
    el.setAttribute('data-seo', 'route');
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
};

export function useSeo({ title, description, path, jsonLd, image, robots = 'index, follow' }) {
  useEffect(() => {
    const canonical = `${SITE_ORIGIN}${path}`;
    const ogImage = image ? `${SITE_ORIGIN}${image}` : null;

    if (title) document.title = title;
    if (description) setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[name="robots"]', 'content', robots);
    setCanonical(canonical);

    if (title) setMeta('meta[property="og:title"]', 'content', title);
    if (description) setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:url"]', 'content', canonical);
    setMeta('meta[property="og:type"]', 'content', 'website');
    if (ogImage) setMeta('meta[property="og:image"]', 'content', ogImage);

    setMeta('meta[name="twitter:card"]', 'content', 'summary_large_image');
    if (title) setMeta('meta[name="twitter:title"]', 'content', title);
    if (description) setMeta('meta[name="twitter:description"]', 'content', description);
    if (ogImage) setMeta('meta[name="twitter:image"]', 'content', ogImage);

    setJsonLd(jsonLd ?? null);
  }, [title, description, path, robots, jsonLd, image]);
}
