import { useEffect, useRef, useState } from 'react';
import { Download, RotateCcw, Smartphone } from 'lucide-react';
import { toPng } from 'html-to-image';
import LabLinkButton from '../../components/LabLinkButton';
import './phoneframe.css';

const REF_SHORT_SIDE = 390;

const PhoneFrame = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [fileName, setFileName] = useState('phone-mockup');
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });
  const [isLandscape, setIsLandscape] = useState(false);
  const [scale, setScale] = useState(1);
  const [meta, setMeta] = useState('Upload an image to see details here.');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [statusTime, setStatusTime] = useState('');
  const [statusBarStyle, setStatusBarStyle] = useState('dark');

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
    setMeta(`Original ${w} × ${h}px · ${landscape ? 'Landscape' : 'Portrait'} · Exported at original resolution`);
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
      a.download = `${fileName}-phone.png`;
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
    setMeta('Upload an image to see details here.');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const phoneClass = [
    'pf-phone',
    imageUrl ? 'is-visible' : '',
    isLandscape ? 'is-landscape' : '',
    isExporting ? 'is-exporting' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <header className="border-b border-dark-700 bg-dark-800/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 grid grid-cols-3 items-center">
          <div className="justify-self-start">
            <LabLinkButton to="/lab" direction="back" />
          </div>
          <div className="justify-self-center inline-flex items-center gap-2">
            <Smartphone className="w-6 h-6 text-primary-400" />
            <span className="text-2xl font-bold text-gradient tracking-wide">PhoneFrame</span>
          </div>
          <div className="justify-self-end" aria-hidden="true" />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center gap-8">
        <p className="text-gray-400 text-center">Drop an image and see it as a phone mockup</p>

        <label
          htmlFor="pf-file-input"
          onDragEnter={handleDragOver}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`w-full max-w-md border-2 border-dashed rounded-2xl px-5 py-7 text-center cursor-pointer transition-all ${
            isDragOver
              ? 'border-primary-400 bg-primary-500/5'
              : 'border-dark-600 hover:border-primary-500/50 hover:bg-dark-800/50'
          }`}
        >
          <div className="text-base font-semibold mb-1">Drag an image or click to choose</div>
          <div className="text-gray-400 text-sm">PNG · JPG · WebP · GIF — orientation auto-detected</div>
          <input
            id="pf-file-input"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        <div className="w-full overflow-x-auto flex justify-center">
          <div
            ref={phoneRef}
            className={phoneClass}
            style={{ '--pf-scale': scale }}
          >
            <div className="pf-screen">
              {imageUrl && !isLandscape && (
                <div className={`pf-statusbar pf-statusbar-${statusBarStyle}`}>
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
          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-400">Status bar</span>
            <div className="inline-flex rounded-md border border-dark-600 overflow-hidden">
              <button
                type="button"
                onClick={() => setStatusBarStyle('dark')}
                className={`px-3 py-1.5 transition-colors ${
                  statusBarStyle === 'dark'
                    ? 'bg-dark-600 text-white'
                    : 'text-gray-400 hover:bg-dark-700 hover:text-white'
                }`}
              >
                Dark
              </button>
              <button
                type="button"
                onClick={() => setStatusBarStyle('light')}
                className={`px-3 py-1.5 transition-colors border-l border-dark-600 ${
                  statusBarStyle === 'light'
                    ? 'bg-dark-600 text-white'
                    : 'text-gray-400 hover:bg-dark-700 hover:text-white'
                }`}
              >
                Light
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3 justify-center">
          <button
            type="button"
            onClick={handleDownload}
            disabled={!imageUrl || isExporting}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-dark-600 disabled:cursor-not-allowed disabled:text-gray-500 text-white rounded-lg font-medium transition-all"
          >
            <Download className="w-4 h-4" />
            {isExporting ? 'Generating...' : 'Download PNG'}
          </button>
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

        <div className="text-gray-400 text-sm text-center min-h-[1.2em]">{meta}</div>
      </main>
    </div>
  );
};

export default PhoneFrame;
