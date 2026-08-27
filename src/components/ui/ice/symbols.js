/**
 * Turn a lucide icon node (the `__iconNode` array) into a cloud of points that
 * particles can assemble into. Rasterises the icon offscreen and samples the
 * stroke on a grid; results are cached per icon+size.
 */

const SVG_ATTRS =
  'xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"';

export const iconToSvg = (iconNode) =>
  `<svg ${SVG_ATTRS}>${iconNode
    .map(
      ([tag, attrs]) =>
        `<${tag} ${Object.entries(attrs)
          .filter(([k]) => k !== 'key')
          .map(([k, v]) => `${k}="${v}"`)
          .join(' ')}/>`,
    )
    .join('')}</svg>`;

const cache = new Map();

export const symbolPoints = (iconNode, size = 160, step = 4) => {
  const key = `${size}:${step}:${iconNode.map((n) => n[1].key ?? JSON.stringify(n[1])).join('|')}`;
  if (cache.has(key)) return cache.get(key);

  const promise = new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = size;
      c.height = size;
      const g = c.getContext('2d');
      g.drawImage(img, 0, 0, size, size);
      const { data } = g.getImageData(0, 0, size, size);
      const pts = [];
      for (let y = 0; y < size; y += step) {
        for (let x = 0; x < size; x += step) {
          if (data[(y * size + x) * 4 + 3] > 90) {
            pts.push({
              x: x - size / 2 + (Math.random() - 0.5) * 2.4,
              y: y - size / 2 + (Math.random() - 0.5) * 2.4,
            });
          }
        }
      }
      resolve(pts);
    };
    img.onerror = () => resolve([]);
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(iconToSvg(iconNode))}`;
  });

  cache.set(key, promise);
  return promise;
};
