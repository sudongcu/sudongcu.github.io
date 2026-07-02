import { useCallback, useEffect, useRef, useState } from 'react';
import { Download, RotateCcw, Sparkles, Wand2, Loader2, Lock } from 'lucide-react';
import LabLinkButton from '../../components/LabLinkButton';
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
        try { sessionStorage.setItem(GATE_KEY, '1'); } catch {}
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
    <div className="min-h-screen bg-dark-900 text-white flex items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-6 text-primary-400">
          <Lock className="w-5 h-5" />
          <span className="text-sm tracking-wider uppercase">Restricted</span>
        </div>
        <input
          ref={inputRef}
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          disabled={busy}
          autoComplete="current-password"
          className="w-full px-4 py-3 bg-dark-800 border border-dark-600 focus:border-primary-400 outline-none rounded-lg text-white"
          placeholder="Password"
        />
        {err && <div className="text-red-400 text-sm mt-2 text-center">{err}</div>}
        <button
          type="submit"
          disabled={!pw || busy}
          className="w-full mt-4 px-4 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-dark-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
        >
          {busy ? 'Checking…' : 'Enter'}
        </button>
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

  return (
    <div className={`min-h-screen bg-dark-900 text-white ${isProcessing ? 'cursor-wait' : ''}`}>
      <header className="border-b border-dark-700 bg-dark-800/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 grid grid-cols-[auto_1fr_auto] items-center gap-3">
          <div className="justify-self-start">
            <LabLinkButton to="/lab" direction="back" />
          </div>
          <div className="justify-self-center inline-flex items-center gap-2 min-w-0">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary-400 flex-shrink-0" />
            <span className="text-base sm:text-xl lg:text-2xl font-bold text-gradient tracking-wide whitespace-nowrap">
              Gemini Watermark Remover
            </span>
          </div>
          <div className="justify-self-end" aria-hidden="true" />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col items-center gap-4">
        {!imageUrl && (
          <div className="text-center max-w-2xl mt-4">
            <p className="text-gray-300">
              Erase the visible Gemini / Nano Banana watermark from AI-generated images.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Runs entirely in your browser — your image is never uploaded.
            </p>
          </div>
        )}

        {!imageUrl && (
          <label
            htmlFor="gwr-file-input"
            onDragEnter={handleDragOver}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`w-full max-w-md border-2 border-dashed rounded-2xl px-5 py-10 text-center cursor-pointer transition-all ${
              isDragOver
                ? 'border-primary-400 bg-primary-500/5'
                : 'border-dark-600 hover:border-primary-500/50 hover:bg-dark-800/50'
            }`}
          >
            <div className="text-base font-semibold mb-1">Drop an image or click to choose</div>
            <div className="text-gray-400 text-sm">PNG · JPG · WebP — or paste from clipboard</div>
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
          <div className="w-full flex flex-col items-center gap-4">
            <div
              ref={stageRef}
              className="relative inline-block max-w-full rounded-lg overflow-hidden border border-dark-700 bg-dark-800"
              style={{ touchAction: 'none' }}
            >
              <img
                ref={imgRef}
                src={displaySrc}
                alt="Working image"
                onLoad={handleImageLoad}
                className="block max-w-full max-h-[50vh] w-auto h-auto select-none"
                draggable={false}
              />
              {!resultUrl && naturalSize.w > 0 && (
                <div
                  onMouseDown={startInteraction('move')}
                  onTouchStart={startInteraction('move')}
                  className={`absolute border-2 border-primary-400 bg-primary-500/20 cursor-move ${isProcessing ? 'pointer-events-none opacity-60' : ''}`}
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
                        className="absolute bg-primary-400 border border-white rounded-sm"
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
                <div className="absolute inset-0 bg-dark-900/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3 pointer-events-none">
                  <Loader2 className="w-12 h-12 text-primary-400 animate-spin" />
                  <span className="text-sm text-gray-200">{status}</span>
                </div>
              )}
            </div>

            <div className="text-gray-500 text-xs text-center max-w-md flex items-center justify-center gap-2 flex-wrap">
              {naturalSize.w > 0 && (
                <>
                  <span className="text-gray-400">{naturalSize.w} × {naturalSize.h}px</span>
                  <span className="text-gray-700">·</span>
                </>
              )}
              <span>
                {resultUrl
                  ? 'Cleaned image — original resolution preserved on download.'
                  : 'Drag the box or corners to cover the watermark precisely.'}
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3 justify-center">
          {!resultUrl && (
            <button
              type="button"
              onClick={handleRemove}
              disabled={!imageUrl || isProcessing}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-dark-600 disabled:cursor-not-allowed disabled:text-gray-500 text-white rounded-lg font-medium transition-all"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
              {isProcessing ? 'Working…' : 'Remove watermark'}
            </button>
          )}
          {resultUrl && (
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-all"
            >
              <Download className="w-4 h-4" />
              Download PNG
            </button>
          )}
          <button
            type="button"
            onClick={handleReset}
            disabled={!imageUrl}
            className="inline-flex items-center gap-2 px-6 py-3 border border-dark-600 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        <div className="text-gray-400 text-sm text-center min-h-[1.2em]">{status}</div>

        <p className="text-xs text-gray-600 text-center max-w-xl">
          Removes the visible Gemini logo only. Google also embeds an invisible SynthID watermark — please don&apos;t use this to misrepresent AI-generated content as human-made.
        </p>
        <p className="text-[11px] text-gray-700 text-center">
          Inpainting by{' '}
          <a
            href="https://github.com/Picsart-AI-Research/MI-GAN"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-500"
          >
            MI-GAN
          </a>
          {' '}(MIT, © 2024 Picsart AI Research).{' '}
          <a
            href="/models/LICENSE-MIGAN.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-500"
          >
            License
          </a>
        </p>
      </main>
    </div>
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
