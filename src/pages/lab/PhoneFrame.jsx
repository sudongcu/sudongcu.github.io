import { useEffect, useRef, useState } from 'react';
import { Download, RotateCcw, Smartphone } from 'lucide-react';
import { toPng } from 'html-to-image';
import LabShell from './LabShell';
import { useSeo } from '../../hooks/useSeo';
import './phoneframe.css';

const REF_SHORT_SIDE = 390;
const IDLE_META = 'Load a specimen to see its readout.';

const PHONEFRAME_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'PhoneFrame',
  url: 'https://sudongcu.github.io/lab/phoneframe/',
  applicationCategory: 'DesignApplication',
  operatingSystem: 'Any (browser)',
  description: 'Free browser-based tool that wraps a screenshot in an iPhone-style mockup frame and exports as PNG. No upload, no signup — runs entirely in your browser.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  isAccessibleForFree: true,
};

/** A row of the status-bar controls: a label and a segmented switch. */
const Switch = ({ label, value, onChange, options }) => (
  <div className="flex items-center gap-4">
    <span className="lab-label min-w-[6.5rem]">{label}</span>
    <div className="lab-seg" role="group" aria-label={label}>
      {options.map(([val, text]) => (
        <button key={String(val)} type="button" aria-pressed={value === val} onClick={() => onChange(val)} className="lab-seg-btn">
          {text}
        </button>
      ))}
    </div>
  </div>
);

const PhoneFrame = () => {
  useSeo({
    title: 'PhoneFrame — Free iPhone Mockup Generator | DG.DEV Lab',
    description: 'Wrap any screenshot in a realistic iPhone-style mockup frame. Free, browser-based, no uploads. Export as PNG in seconds.',
    path: '/lab/phoneframe',
    image: '/labs/phoneframe.png',
    jsonLd: PHONEFRAME_JSON_LD,
  });

  const [imageUrl, setImageUrl] = useState('');
  const [fileName, setFileName] = useState('phone-mockup');
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });
  const [isLandscape, setIsLandscape] = useState(false);
  const [scale, setScale] = useState(1);
  const [meta, setMeta] = useState(IDLE_META);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [statusTime, setStatusTime] = useState('');
  const [statusBarStyle, setStatusBarStyle] = useState('dark');
  const [showStatusContent, setShowStatusContent] = useState(true);
  const [overlayTextColor, setOverlayTextColor] = useState('white');

  const phoneRef = useRef(null);
  const imgRef = useRef(null);
  const fileInputRef = useRef(null);
  const objectUrlRef = useRef(null);

  useEffect(() => () => {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
  }, []);

  const loadFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      setMeta('Only image files are supported.');
      return;
    }
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setFileName(file.name.replace(/\.[^.]+$/, '') || 'phone-mockup');
    setImageUrl(url);
  };

  const handleImageLoad = () => {
    const el = imgRef.current;
    if (!el) return;
    const w = el.naturalWidth;
    const h = el.naturalHeight;
    if (!w || !h) return;
    const landscape = w > h;
    const shortSide = Math.min(w, h);
    setNaturalSize({ w, h });
    setIsLandscape(landscape);
    setScale(shortSide / REF_SHORT_SIDE);
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    setStatusTime(`${hh}:${mm}`);
    setMeta(`${w} × ${h} px · ${landscape ? 'Landscape' : 'Portrait'} · exported at original resolution`);
  };

  const handleImageError = () => {
    if (!imageUrl) return;
    setMeta('Failed to load the image.');
  };

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

  const handleDownload = async () => {
    if (!imageUrl || !phoneRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(phoneRef.current, {
        pixelRatio: 1,
        backgroundColor: null,
      });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `${fileName}-dgdev-phone.png`;
      a.click();
    } catch (err) {
      console.error(err);
      setMeta('Something went wrong while generating the download.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleReset = () => {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = null;
    setImageUrl('');
    setNaturalSize({ w: 0, h: 0 });
    setIsLandscape(false);
    setScale(1);
    setMeta(IDLE_META);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const phoneClass = [
    'pf-phone',
    imageUrl ? 'is-visible' : '',
    isLandscape ? 'is-landscape' : '',
    isExporting ? 'is-exporting' : '',
  ].filter(Boolean).join(' ');

  const readout = isExporting
    ? { text: 'Exporting…', state: 'busy' }
    : imageUrl
      ? { text: 'Specimen loaded', state: 'on' }
      : { text: 'Awaiting specimen', state: 'off' };

  return (
    <LabShell id="EXP-01" name="PhoneFrame" icon={Smartphone} readout={readout}>
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-8">
        <p className="text-center text-sm text-ice-300">Drop a screenshot; it comes back wrapped in a phone.</p>

        <label
          htmlFor="pf-file-input"
          onDragEnter={handleDragOver}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`lab-tray lab-corners max-w-md px-6 py-8 ${isDragOver ? 'is-over' : ''}`}
        >
          <span className="lab-label mb-3 block">Specimen tray</span>
          <div className="text-base font-semibold text-ice-50">Drag an image here or click to choose</div>
          <div className="mt-1 font-mono text-[11px] tracking-wide text-ice-400">
            PNG · JPG · WebP · GIF — orientation auto-detected · paste works too
          </div>
          <input
            id="pf-file-input"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        <div className="flex w-full justify-center overflow-x-auto">
          <div
            ref={phoneRef}
            className={phoneClass}
            style={{ '--pf-scale': scale }}
          >
            <div className="pf-screen">
              {imageUrl && !isLandscape && (statusBarStyle !== 'off' || showStatusContent) && (
                <div className={`pf-statusbar pf-statusbar-${statusBarStyle}${statusBarStyle === 'off' ? ` pf-text-${overlayTextColor}` : ''}`}>
                  {showStatusContent && (
                    <>
                      <span className="pf-time">{statusTime}</span>
                      <span className="pf-status-icons">
                        <svg viewBox="0 0 17 11" fill="currentColor" aria-hidden="true">
                          <rect x="0" y="8" width="3" height="3" rx="0.5" />
                          <rect x="5" y="5" width="3" height="6" rx="0.5" />
                          <rect x="10" y="2" width="3" height="9" rx="0.5" />
                          <rect x="14" y="0" width="3" height="11" rx="0.5" />
                        </svg>
                        <svg viewBox="0 0 16 11" fill="currentColor" aria-hidden="true">
                          <path d="M8 11a1.2 1.2 0 100-2.4A1.2 1.2 0 008 11z" />
                          <path d="M3.6 6.6a6 6 0 018.8 0l-1.4 1.4a4 4 0 00-6 0L3.6 6.6z" />
                          <path d="M.8 3.8a10 10 0 0114.4 0l-1.4 1.4a8 8 0 00-11.6 0L.8 3.8z" />
                        </svg>
                        <svg viewBox="0 0 26 11" fill="none" aria-hidden="true">
                          <rect x="0.5" y="0.5" width="22" height="10" rx="2.5" stroke="currentColor" opacity="0.5" />
                          <rect x="2" y="2" width="19" height="7" rx="1.2" fill="currentColor" />
                          <rect x="23" y="3.5" width="1.8" height="4" rx="0.6" fill="currentColor" opacity="0.5" />
                        </svg>
                      </span>
                    </>
                  )}
                </div>
              )}
              {imageUrl && (
                <img
                  ref={imgRef}
                  src={imageUrl}
                  alt="Uploaded image preview"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  style={{
                    width: naturalSize.w ? `${naturalSize.w}px` : 'auto',
                    height: naturalSize.h ? `${naturalSize.h}px` : 'auto',
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {imageUrl && !isLandscape && (
          <div className="lab-panel flex w-full max-w-md flex-col gap-3 p-4">
            <span className="lab-label text-frost/80">Status bar</span>
            <Switch
              label="Tint"
              value={statusBarStyle}
              onChange={setStatusBarStyle}
              options={[['dark', 'Dark'], ['light', 'Light'], ['off', 'Off']]}
            />
            <Switch
              label="Time & icons"
              value={showStatusContent}
              onChange={setShowStatusContent}
              options={[[true, 'On'], [false, 'Off']]}
            />
            {statusBarStyle === 'off' && showStatusContent && (
              <Switch
                label="Text color"
                value={overlayTextColor}
                onChange={setOverlayTextColor}
                options={[['white', 'White'], ['black', 'Black']]}
              />
            )}
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
          {meta}
        </div>
      </div>
    </LabShell>
  );
};

export default PhoneFrame;
