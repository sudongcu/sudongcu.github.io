import { useEffect, useMemo, useRef, useState } from 'react';
import { Download, RotateCcw, Image as ImageIcon } from 'lucide-react';
import LabShell from './LabShell';
import { useSeo } from '../../hooks/useSeo';

const IDLE_META = 'Load a specimen to see its readout.';
const MAX_OUTPUT_SIDE = 5000; // cap the exported canvas so huge inputs stay safe

const SB_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Screenshot Beautifier',
  url: 'https://sudongcu.github.io/lab/screenshot-beautifier/',
  applicationCategory: 'DesignApplication',
  operatingSystem: 'Any (browser)',
  description:
    'Free browser-based tool that drops a screenshot onto a gradient background with padding, rounded corners and a soft shadow, then exports a PNG. No upload, no signup — runs entirely in your browser.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  isAccessibleForFree: true,
};

// Background presets. `css` drives the picker swatch; the canvas draw derives
// from the same kind/angle/stops so preview and export match.
const BACKGROUNDS = [
  { id: 'coral', name: 'Coral', kind: 'linear', angle: 135, stops: ['#ff758c', '#ff7eb3'] },
  { id: 'dusk', name: 'Dusk', kind: 'linear', angle: 135, stops: ['#a18cd1', '#fbc2eb'] },
  { id: 'ocean', name: 'Ocean', kind: 'linear', angle: 120, stops: ['#2193b0', '#6dd5ed'] },
  { id: 'aurora', name: 'Aurora', kind: 'linear', angle: 135, stops: ['#43cea2', '#185a9d'] },
  { id: 'sunrise', name: 'Sunrise', kind: 'linear', angle: 135, stops: ['#f6d365', '#fda085'] },
  { id: 'grape', name: 'Grape', kind: 'linear', angle: 135, stops: ['#667eea', '#764ba2'] },
  { id: 'mint', name: 'Mint', kind: 'linear', angle: 135, stops: ['#43e97b', '#38f9d7'] },
  { id: 'ink', name: 'Ink', kind: 'solid', color: '#0f172a' },
  { id: 'paper', name: 'Paper', kind: 'solid', color: '#f4f4f5' },
  { id: 'none', name: 'None', kind: 'none' },
];

const bgCss = (bg) => {
  if (bg.kind === 'linear') return `linear-gradient(${bg.angle}deg, ${bg.stops.join(', ')})`;
  if (bg.kind === 'solid') return bg.color;
  return 'transparent';
};

const AR_OPTIONS = [
  ['auto', 'Auto'],
  ['16:9', '16:9'],
  ['4:3', '4:3'],
  ['3:2', '3:2'],
  ['1:1', '1:1'],
  ['9:16', '9:16'],
];

/** CSS-convention linear gradient endpoints (0deg = to top, 90deg = to right). */
const gradientCoords = (angleDeg, w, h) => {
  const a = ((angleDeg % 360) * Math.PI) / 180;
  const dx = Math.sin(a);
  const dy = -Math.cos(a);
  const len = Math.abs(w * dx) + Math.abs(h * dy);
  const cx = w / 2;
  const cy = h / 2;
  return [cx - (dx * len) / 2, cy - (dy * len) / 2, cx + (dx * len) / 2, cy + (dy * len) / 2];
};

const roundRectPath = (ctx, x, y, w, h, r) => {
  const rr = Math.max(0, Math.min(r, w / 2, h / 2));
  if (ctx.roundRect) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, rr);
    return;
  }
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
};

/** Pure output geometry: canvas size, image box, and the export downscale. */
const computeGeom = (w, h, paddingPct, aspect) => {
  if (!w || !h) return null;
  const short = Math.min(w, h);
  const pad = (paddingPct / 100) * short;
  let cw = w + pad * 2;
  let ch = h + pad * 2;
  if (aspect !== 'auto') {
    const [aw, ah] = aspect.split(':').map(Number);
    const R = aw / ah;
    if (cw / ch >= R) ch = cw / R;
    else cw = ch * R;
  }
  const outScale = Math.min(1, MAX_OUTPUT_SIDE / Math.max(cw, ch));
  const CW = Math.round(cw * outScale);
  const CH = Math.round(ch * outScale);
  const iw = w * outScale;
  const ih = h * outScale;
  return { CW, CH, iw, ih, ix: (CW - iw) / 2, iy: (CH - ih) / 2, outScale, short };
};

/** A label + segmented switch row, matching the lab controls elsewhere. */
const Switch = ({ label, value, onChange, options }) => (
  <div className="flex items-center gap-4">
    <span className="lab-label min-w-[5.5rem]">{label}</span>
    <div className="lab-seg flex-wrap" role="group" aria-label={label}>
      {options.map(([val, text]) => (
        <button key={String(val)} type="button" aria-pressed={value === val} onClick={() => onChange(val)} className="lab-seg-btn">
          {text}
        </button>
      ))}
    </div>
  </div>
);

/** A label + range slider row. */
const Slider = ({ label, value, min, max, step = 1, onChange, suffix = '%' }) => (
  <div className="flex items-center gap-4">
    <span className="lab-label min-w-[5.5rem]">{label}</span>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="h-1.5 flex-1 cursor-pointer accent-frost"
      aria-label={label}
    />
    <span className="w-10 shrink-0 text-right font-mono text-[11px] tabular-nums text-ice-400">
      {value}
      {suffix}
    </span>
  </div>
);

const ScreenshotBeautifier = () => {
  useSeo({
    title: 'Screenshot Beautifier — Free Gradient Background Tool | DG.DEV Lab',
    description:
      'Drop a screenshot onto a gradient background with padding, rounded corners and a soft shadow, then download the PNG. Free, browser-based, no uploads.',
    path: '/lab/screenshot-beautifier',
    jsonLd: SB_JSON_LD,
  });

  const [imageUrl, setImageUrl] = useState('');
  const [fileName, setFileName] = useState('screenshot');
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });
  const [note, setNote] = useState(''); // transient error message; '' shows the derived readout
  const [isDragOver, setIsDragOver] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const [bgId, setBgId] = useState('grape');
  const [customColor, setCustomColor] = useState('#3b82f6');
  const [useCustom, setUseCustom] = useState(false);
  const [padding, setPadding] = useState(12); // % of short side
  const [radius, setRadius] = useState(24); // 0..100 → fraction of short side
  const [shadow, setShadow] = useState(55); // 0..100, 0 = off
  const [aspect, setAspect] = useState('auto');

  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const fileInputRef = useRef(null);
  const objectUrlRef = useRef(null);

  useEffect(
    () => () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    },
    [],
  );

  const loadFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      setNote('Only image files are supported.');
      return;
    }
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setNote('');
    setFileName(file.name.replace(/\.[^.]+$/, '') || 'screenshot');
    setImageUrl(url);
  };

  const handleImageLoad = () => {
    const el = imgRef.current;
    if (!el || !el.naturalWidth || !el.naturalHeight) return;
    setNaturalSize({ w: el.naturalWidth, h: el.naturalHeight });
  };

  const geom = useMemo(
    () => computeGeom(naturalSize.w, naturalSize.h, padding, aspect),
    [naturalSize, padding, aspect],
  );

  // Redraw whenever the image, its geometry, or a styling setting changes.
  useEffect(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !geom || !img || !img.complete) return;

    const { CW, CH, iw, ih, ix, iy, outScale, short } = geom;
    const r = (radius / 100) * Math.min(iw, ih) * 0.5;

    canvas.width = CW;
    canvas.height = CH;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, CW, CH);

    // Background.
    const bg = BACKGROUNDS.find((b) => b.id === bgId) || BACKGROUNDS[0];
    if (useCustom) {
      ctx.fillStyle = customColor;
      ctx.fillRect(0, 0, CW, CH);
    } else if (bg.kind === 'linear') {
      const [x0, y0, x1, y1] = gradientCoords(bg.angle, CW, CH);
      const grad = ctx.createLinearGradient(x0, y0, x1, y1);
      bg.stops.forEach((c, i) => grad.addColorStop(i / (bg.stops.length - 1), c));
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, CW, CH);
    } else if (bg.kind === 'solid') {
      ctx.fillStyle = bg.color;
      ctx.fillRect(0, 0, CW, CH);
    } // 'none' → leave transparent

    // Soft drop shadow cast by the screenshot's rounded rectangle.
    if (shadow > 0) {
      const s = shadow / 100;
      ctx.save();
      ctx.shadowColor = `rgba(15, 23, 42, ${0.45 * s})`;
      ctx.shadowBlur = s * short * outScale * 0.12;
      ctx.shadowOffsetY = s * short * outScale * 0.05;
      roundRectPath(ctx, ix, iy, iw, ih, r);
      ctx.fillStyle = '#000';
      ctx.fill();
      ctx.restore();
    }

    // The screenshot itself, clipped to the rounded rectangle.
    ctx.save();
    roundRectPath(ctx, ix, iy, iw, ih, r);
    ctx.clip();
    ctx.drawImage(img, ix, iy, iw, ih);
    ctx.restore();
  }, [imageUrl, geom, bgId, useCustom, customColor, radius, shadow]);

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) loadFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) loadFile(file);
  };

  useEffect(() => {
    const onPaste = (e) => {
      const item = [...(e.clipboardData?.items || [])].find((i) => i.type.startsWith('image/'));
      if (item) loadFile(item.getAsFile());
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, []);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imageUrl) return;
    setIsExporting(true);
    try {
      canvas.toBlob((blob) => {
        if (!blob) {
          setNote('Something went wrong while generating the download.');
          setIsExporting(false);
          return;
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}-dgdev-shot.png`;
        a.click();
        URL.revokeObjectURL(url);
        setIsExporting(false);
      }, 'image/png');
    } catch (err) {
      console.error(err);
      setNote('Something went wrong while generating the download.');
      setIsExporting(false);
    }
  };

  const handleReset = () => {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = null;
    setImageUrl('');
    setNaturalSize({ w: 0, h: 0 });
    setNote('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const readout = isExporting
    ? { text: 'Exporting…', state: 'busy' }
    : imageUrl
      ? { text: 'Specimen loaded', state: 'on' }
      : { text: 'Awaiting specimen', state: 'off' };

  const dimText = geom
    ? `${naturalSize.w} × ${naturalSize.h} px in · ${geom.CW} × ${geom.CH} px out${geom.outScale < 1 ? ' (capped)' : ''}`
    : IDLE_META;
  const bottomText = note || dimText;

  return (
    <LabShell id="EXP-03" name="Screenshot Beautifier" icon={ImageIcon} readout={readout}>
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-8">
        <p className="text-center text-sm text-ice-300">Drop a screenshot; it comes back on a background, ready to share.</p>

        <label
          htmlFor="sb-file-input"
          onDragEnter={handleDragOver}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`lab-tray lab-corners max-w-md px-6 py-8 ${isDragOver ? 'is-over' : ''}`}
        >
          <span className="lab-label mb-3 block">Specimen tray</span>
          <div className="text-base font-semibold text-ice-50">Drag an image here or click to choose</div>
          <div className="mt-1 font-mono text-[11px] tracking-wide text-ice-400">
            PNG · JPG · WebP · GIF — paste works too
          </div>
          <input id="sb-file-input" ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>

        {/* Hidden decode target; the canvas is the real output. */}
        {imageUrl && <img ref={imgRef} src={imageUrl} alt="" onLoad={handleImageLoad} className="hidden" />}

        <div className="flex w-full justify-center overflow-x-auto">
          {imageUrl ? (
            <div className={`rounded-xl p-2 ${!useCustom && bgId === 'none' ? 'sb-check' : ''}`}>
              <canvas ref={canvasRef} className="block h-auto max-w-full rounded-lg" style={{ maxHeight: '60vh' }} />
            </div>
          ) : (
            <div className="lab-corners grid aspect-[16/10] w-full max-w-md place-items-center bg-abyss/60 text-ice-400">
              <ImageIcon className="h-10 w-10 opacity-50" />
            </div>
          )}
        </div>

        {imageUrl && (
          <div className="flex w-full max-w-md flex-col gap-5">
            <div className="lab-panel flex flex-col gap-3 p-4">
              <span className="lab-label text-frost/80">Background</span>
              <div className="flex flex-wrap gap-2">
                {BACKGROUNDS.map((bg) => {
                  const active = !useCustom && bgId === bg.id;
                  return (
                    <button
                      key={bg.id}
                      type="button"
                      title={bg.name}
                      aria-label={bg.name}
                      aria-pressed={active}
                      onClick={() => {
                        setUseCustom(false);
                        setBgId(bg.id);
                      }}
                      className={`sb-swatch ${bg.id === 'none' ? 'sb-check' : ''} ${active ? 'is-active' : ''}`}
                      style={bg.id === 'none' ? undefined : { background: bgCss(bg) }}
                    />
                  );
                })}
                <label
                  title="Custom colour"
                  aria-label="Custom colour"
                  className={`sb-swatch relative overflow-hidden ${useCustom ? 'is-active' : ''}`}
                  style={{ background: customColor }}
                >
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => {
                      setCustomColor(e.target.value);
                      setUseCustom(true);
                    }}
                    className="absolute inset-0 cursor-pointer opacity-0"
                  />
                  <span className="pointer-events-none absolute inset-0 grid place-items-center text-[10px] font-bold text-white mix-blend-difference">
                    +
                  </span>
                </label>
              </div>
            </div>

            <div className="lab-panel flex flex-col gap-3 p-4">
              <span className="lab-label text-frost/80">Frame</span>
              <Slider label="Padding" value={padding} min={0} max={40} onChange={setPadding} />
              <Slider label="Corners" value={radius} min={0} max={100} onChange={setRadius} />
              <Slider label="Shadow" value={shadow} min={0} max={100} onChange={setShadow} />
              <Switch label="Aspect" value={aspect} onChange={setAspect} options={AR_OPTIONS} />
            </div>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-3">
          <button type="button" onClick={handleDownload} disabled={!imageUrl || isExporting} className="lab-btn">
            <Download className="h-4 w-4" />
            {isExporting ? 'Generating…' : 'Download PNG'}
          </button>
          <button type="button" onClick={handleReset} disabled={!imageUrl} className="lab-btn-ghost">
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>

        <div className="lab-readout flex min-h-[1.2em] items-center gap-2 text-center">
          <span className={`lab-led ${imageUrl ? 'lab-led-on' : ''}`} aria-hidden />
          {bottomText}
        </div>
      </div>
    </LabShell>
  );
};

export default ScreenshotBeautifier;
