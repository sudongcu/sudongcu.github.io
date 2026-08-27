import { useCallback, useEffect, useRef, useState } from 'react';
import { Download, RotateCcw, Sparkles, Wand2, Loader2, Lock } from 'lucide-react';
import LabShell from './LabShell';
import useLabPalette from './useLabPalette';
import { useSeo } from '../../hooks/useSeo';
import { preloadMigan, inpaintWithMigan } from '../../utils/migan';

const GATE_HASH = 'd1a5e76347c48f515e147c752f3576fed4cd3aaf6e8ebd69fb0cc996b99361a8';
const GATE_KEY = 'gwr-unlocked';

const sha256Hex = async (text) => {
  const buf = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', buf);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
};

const Gate = ({ onUnlock }) => {
  useLabPalette();
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!pw || busy) return;
    setBusy(true);
    setErr('');
    try {
      const h = await sha256Hex(pw);
      if (h === GATE_HASH) {
        try { sessionStorage.setItem(GATE_KEY, '1'); } catch { /* private mode — the unlock just won't persist */ }
        onUnlock();
      } else {
        setErr('Wrong password.');
        setPw('');
      }
    } catch {
      setErr('Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="lab-grid flex min-h-screen items-center justify-center bg-abyss px-4 text-ice-100">
      <form onSubmit={submit} className="lab-panel w-full max-w-sm overflow-hidden">
        <div className="lab-hazard-warn h-2" aria-hidden />
        <div className="p-6">
          <div className="mb-1 flex items-center gap-2 text-aurora">
            <Lock className="h-4 w-4" />
            <span className="lab-label text-aurora">Restricted area</span>
          </div>
          <p className="mb-5 text-sm text-ice-300">This bench needs a key.</p>
          <input
            ref={inputRef}
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            disabled={busy}
            autoComplete="current-password"
            className="w-full rounded-md border border-white/15 bg-abyss px-4 py-3 font-mono text-sm text-ice-50 outline-none transition-colors placeholder:text-ice-400 focus:border-frost disabled:opacity-60"
            placeholder="Password"
          />
          {err && <div className="mt-2 font-mono text-xs text-aurora">{err}</div>}
          <button type="submit" disabled={!pw || busy} className="lab-btn mt-4 w-full justify-center">
            {busy ? 'Checking…' : 'Enter'}
          </button>
        </div>
      </form>
    </div>
  );
};

const SEO_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Gemini Watermark Remover',
  url: 'https://sudongcu.github.io/lab/gemini-watermark-remover/',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Any (browser)',
  description: 'Free browser-based tool that removes the visible Gemini / Nano Banana watermark from AI-generated images using inpainting. Works entirely in your browser — no upload, no signup.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  isAccessibleForFree: true,
};

const DEFAULT_BOX = { x: 0.92, y: 0.93, w: 0.06, h: 0.045 };
const MIN_DIM = 0.008;
const HANDLE_SIZE = 10;

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

const getGeminiBox = (W, H) => {
  if (!W || !H) return null;
  const isLarge = W > 1024 && H > 1024;
  const size = isLarge ? 96 : 48;
  const margin = isLarge ? 64 : 32;
  const pad = isLarge ? 6 : 4;

  const bx = W - margin - size - pad;
  const by = H - margin - size - pad;
  const bw = size + pad * 2;
  const bh = size + pad * 2;

  return { x: bx / W, y: by / H, w: bw / W, h: bh / H };
};

const normaliseBox = (b) => {
  let { x, y, w, h } = b;
  if (w < 0) { x += w; w = -w; }
  if (h < 0) { y += h; h = -h; }
  x = clamp(x, 0, 1 - MIN_DIM);
  y = clamp(y, 0, 1 - MIN_DIM);
  w = clamp(w, MIN_DIM, 1 - x);
  h = clamp(h, MIN_DIM, 1 - y);
  return { x, y, w, h };
};

const GeminiWatermarkRemoverTool = () => {
  useSeo({
    title: 'Gemini Watermark Remover — Free AI Image Cleanup | DG.DEV Lab',
    description: 'Remove the Gemini / Nano Banana watermark from AI-generated images in seconds. Free, browser-based, no uploads — your image never leaves your device.',
    path: '/lab/gemini-watermark-remover',
    image: '/labs/gemini-watermark-remover.png',
    jsonLd: SEO_JSON_LD,
  });

  const [imageUrl, setImageUrl] = useState('');
  const [fileName, setFileName] = useState('cleaned');
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });
  const [box, setBox] = useState(DEFAULT_BOX);
  const [resultUrl, setResultUrl] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState('Drop a Gemini image to start. The watermark area is highlighted — adjust if needed.');

  const imgRef = useRef(null);
  const stageRef = useRef(null);
  const fileInputRef = useRef(null);
  const objectUrlRef = useRef(null);
  const dragStateRef = useRef(null);

  useEffect(() => () => {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
  }, []);

  const resetResult = () => setResultUrl('');

  const loadFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      setStatus('Only image files are supported.');
      return;
    }
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setFileName((file.name || 'cleaned').replace(/\.[^.]+$/, '') || 'cleaned');
    setImageUrl(url);
    setBox(DEFAULT_BOX);
    setResultUrl('');
    setStatus('Adjust the box if needed, then click "Remove watermark".');
    preloadMigan().catch(() => {});
  };

  const handleImageLoad = () => {
    const el = imgRef.current;
    if (!el) return;
    const W = el.naturalWidth;
    const H = el.naturalHeight;
    setNaturalSize({ w: W, h: H });
    const placed = getGeminiBox(W, H);
    if (placed) {
      setBox(normaliseBox(placed));
      setStatus('Box placed on the Gemini watermark — fine-tune if needed, then click "Remove watermark".');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) loadFile(file);
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragOver(false); };
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

  const startInteraction = useCallback((mode) => (e) => {
    if (!stageRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    const rect = stageRef.current.getBoundingClientRect();
    dragStateRef.current = {
      mode,
      startBox: box,
      startX: e.clientX,
      startY: e.clientY,
      rect,
    };
    resetResult();
  }, [box]);

  useEffect(() => {
    const onMove = (e) => {
      const ds = dragStateRef.current;
      if (!ds) return;
      const dx = (e.clientX - ds.startX) / ds.rect.width;
      const dy = (e.clientY - ds.startY) / ds.rect.height;
      const sb = ds.startBox;
      let next = { ...sb };
      if (ds.mode === 'move') {
        next.x = sb.x + dx;
        next.y = sb.y + dy;
      } else if (ds.mode === 'nw') {
        next.x = sb.x + dx; next.y = sb.y + dy;
        next.w = sb.w - dx; next.h = sb.h - dy;
      } else if (ds.mode === 'ne') {
        next.y = sb.y + dy;
        next.w = sb.w + dx; next.h = sb.h - dy;
      } else if (ds.mode === 'sw') {
        next.x = sb.x + dx;
        next.w = sb.w - dx; next.h = sb.h + dy;
      } else if (ds.mode === 'se') {
        next.w = sb.w + dx; next.h = sb.h + dy;
      }
      setBox(normaliseBox(next));
    };
    const onUp = () => { dragStateRef.current = null; };
    const onTouchMove = (e) => {
      if (!dragStateRef.current || !e.touches[0]) return;
      onMove({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY });
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onUp);
    };
  }, []);

  const handleRemove = async () => {
    if (!imgRef.current || !naturalSize.w) return;
    setIsProcessing(true);
    setStatus('Loading model (first time only, ~27 MB)…');
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    try {
      const W = naturalSize.w;
      const H = naturalSize.h;

      const pad = Math.max(2, Math.round(Math.min(W, H) * 0.004));
      const bx = clamp(Math.round(box.x * W) - pad, 0, W - 1);
      const by = clamp(Math.round(box.y * H) - pad, 0, H - 1);
      const bw = clamp(Math.round(box.w * W) + pad * 2, 1, W - bx);
      const bh = clamp(Math.round(box.h * H) + pad * 2, 1, H - by);

      const canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(imgRef.current, 0, 0, W, H);

      await preloadMigan();
      setStatus('Removing watermark…');
      await new Promise((r) => requestAnimationFrame(() => r()));

      await inpaintWithMigan(canvas, bx, by, bw, bh);

      const dataUrl = canvas.toDataURL('image/png');
      setResultUrl(dataUrl);
      setStatus('Done. Download below or reset to try another image.');
    } catch (err) {
      console.error(err);
      setStatus(`Something went wrong: ${err.message || 'unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = `${fileName}-dgdev-clean.png`;
    a.click();
  };

  const handleReset = () => {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = null;
    setImageUrl('');
    setResultUrl('');
    setNaturalSize({ w: 0, h: 0 });
    setBox(DEFAULT_BOX);
    setStatus('Drop a Gemini image to start. The watermark area is highlighted — adjust if needed.');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const displaySrc = resultUrl || imageUrl;

  const readout = isProcessing
    ? { text: 'Inpainting…', state: 'busy' }
    : resultUrl
      ? { text: 'Clean', state: 'on' }
      : imageUrl
        ? { text: 'Specimen loaded', state: 'on' }
        : { text: 'Awaiting specimen', state: 'off' };

  return (
    <LabShell
      id="EXP-02"
      name="Gemini Watermark Remover"
      icon={Sparkles}
      readout={readout}
      className={isProcessing ? 'cursor-wait' : ''}
    >
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-5">
        {!imageUrl && (
          <div className="max-w-2xl text-center">
            <p className="text-ice-200">Erase the visible Gemini / Nano Banana watermark from AI-generated images.</p>
            <p className="mt-2 text-sm text-ice-400">Runs entirely in your browser — your image is never uploaded.</p>
          </div>
        )}

        {!imageUrl && (
          <label
            htmlFor="gwr-file-input"
            onDragEnter={handleDragOver}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`lab-tray lab-corners max-w-md px-6 py-10 ${isDragOver ? 'is-over' : ''}`}
          >
            <span className="lab-label mb-3 block">Specimen tray</span>
            <div className="text-base font-semibold text-ice-50">Drop an image here or click to choose</div>
            <div className="mt-1 font-mono text-[11px] tracking-wide text-ice-400">PNG · JPG · WebP — or paste from clipboard</div>
            <input
              id="gwr-file-input"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}

        {imageUrl && (
          <div className="flex w-full flex-col items-center gap-4">
            <div
              ref={stageRef}
              className="lab-panel relative inline-block max-w-full overflow-hidden"
              style={{ touchAction: 'none' }}
            >
              <img
                ref={imgRef}
                src={displaySrc}
                alt="Working image"
                onLoad={handleImageLoad}
                className="block h-auto max-h-[50vh] w-auto max-w-full select-none"
                draggable={false}
              />
              {!resultUrl && naturalSize.w > 0 && (
                <div
                  onMouseDown={startInteraction('move')}
                  onTouchStart={startInteraction('move')}
                  className={`absolute cursor-move border-2 border-frost bg-frost/20 ${isProcessing ? 'pointer-events-none opacity-60' : ''}`}
                  style={{
                    left: `${box.x * 100}%`,
                    top: `${box.y * 100}%`,
                    width: `${box.w * 100}%`,
                    height: `${box.h * 100}%`,
                  }}
                >
                  {['nw', 'ne', 'sw', 'se'].map((corner) => {
                    const isN = corner.includes('n');
                    const isW = corner.includes('w');
                    return (
                      <span
                        key={corner}
                        onMouseDown={startInteraction(corner)}
                        onTouchStart={startInteraction(corner)}
                        className="absolute rounded-sm border border-abyss bg-frost"
                        style={{
                          width: HANDLE_SIZE,
                          height: HANDLE_SIZE,
                          left: isW ? -HANDLE_SIZE / 2 : 'auto',
                          right: isW ? 'auto' : -HANDLE_SIZE / 2,
                          top: isN ? -HANDLE_SIZE / 2 : 'auto',
                          bottom: isN ? 'auto' : -HANDLE_SIZE / 2,
                          cursor: `${corner}-resize`,
                        }}
                      />
                    );
                  })}
                </div>
              )}
              {isProcessing && (
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 bg-abyss/70 backdrop-blur-sm">
                  <Loader2 className="h-10 w-10 animate-spin text-frost" />
                  <span className="lab-readout">{status}</span>
                </div>
              )}
            </div>

            <div className="lab-readout flex max-w-md flex-wrap items-center justify-center gap-2 text-center text-ice-400">
              {naturalSize.w > 0 && (
                <>
                  <span className="text-ice-200">{naturalSize.w} × {naturalSize.h} px</span>
                  <span className="text-ice-400/50">·</span>
                </>
              )}
              <span>
                {resultUrl
                  ? 'Cleaned — original resolution is kept on download.'
                  : 'Drag the box or its corners to cover the watermark.'}
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-3">
          {!resultUrl && (
            <button type="button" onClick={handleRemove} disabled={!imageUrl || isProcessing} className="lab-btn">
              {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
              {isProcessing ? 'Working…' : 'Remove watermark'}
            </button>
          )}
          {resultUrl && (
            <button type="button" onClick={handleDownload} className="lab-btn">
              <Download className="h-4 w-4" />
              Download PNG
            </button>
          )}
          <button type="button" onClick={handleReset} disabled={!imageUrl} className="lab-btn-ghost">
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>

        <div className="lab-readout flex min-h-[1.2em] items-center gap-2 text-center">
          <span className={`lab-led ${isProcessing ? 'lab-led-warn animate-pulse' : imageUrl ? 'lab-led-on' : ''}`} aria-hidden />
          {status}
        </div>

        <p className="max-w-xl text-center text-xs text-ice-400">
          Removes the visible Gemini logo only. Google also embeds an invisible SynthID watermark — please don&apos;t use this to misrepresent AI-generated content as human-made.
        </p>
        <p className="text-center font-mono text-[10px] tracking-wide text-ice-400/70">
          Inpainting by{' '}
          <a
            href="https://github.com/Picsart-AI-Research/MI-GAN"
            target="_blank"
            rel="noopener noreferrer"
            className="underline transition-colors hover:text-frost"
          >
            MI-GAN
          </a>
          {' '}(MIT, © 2024 Picsart AI Research).{' '}
          <a
            href="/models/LICENSE-MIGAN.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="underline transition-colors hover:text-frost"
          >
            License
          </a>
        </p>
      </div>
    </LabShell>
  );
};

const GeminiWatermarkRemover = () => {
  const [unlocked, setUnlocked] = useState(() => {
    try { return sessionStorage.getItem(GATE_KEY) === '1'; } catch { return false; }
  });

  if (!unlocked) return <Gate onUnlock={() => setUnlocked(true)} />;
  return <GeminiWatermarkRemoverTool />;
};

export default GeminiWatermarkRemover;
