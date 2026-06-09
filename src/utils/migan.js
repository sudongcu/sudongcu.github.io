const MODEL_URL = `${import.meta.env.BASE_URL || '/'}models/migan_pipeline_v2.onnx`;
const ROI_SIZE = 512;

let sessionPromise = null;
let ortPromise = null;

const loadOrt = () => {
  if (!ortPromise) ortPromise = import('onnxruntime-web/wasm');
  return ortPromise;
};

const ORT_VERSION = '1.26.0';

export const preloadMigan = () => {
  if (sessionPromise) return sessionPromise;
  sessionPromise = (async () => {
    const ort = await loadOrt();
    ort.env.wasm.wasmPaths = `https://cdn.jsdelivr.net/npm/onnxruntime-web@${ORT_VERSION}/dist/`;
    ort.env.wasm.numThreads = 1;
    ort.env.wasm.proxy = true;
    try {
      return await ort.InferenceSession.create(MODEL_URL, {
        executionProviders: ['wasm'],
        graphOptimizationLevel: 'all',
      });
    } catch (err) {
      sessionPromise = null;
      throw err;
    }
  })();
  return sessionPromise;
};

export const inpaintWithMigan = async (canvas, bx, by, bw, bh) => {
  const ort = await loadOrt();
  const session = await preloadMigan();
  const W = canvas.width;
  const H = canvas.height;

  if (W < ROI_SIZE || H < ROI_SIZE) {
    throw new Error(`Image must be at least ${ROI_SIZE}px on each side.`);
  }

  const cx = bx + bw / 2;
  const cy = by + bh / 2;
  let rx = Math.round(cx - ROI_SIZE / 2);
  let ry = Math.round(cy - ROI_SIZE / 2);
  rx = Math.max(0, Math.min(W - ROI_SIZE, rx));
  ry = Math.max(0, Math.min(H - ROI_SIZE, ry));

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const roiPixels = ctx.getImageData(rx, ry, ROI_SIZE, ROI_SIZE).data;

  const plane = ROI_SIZE * ROI_SIZE;
  const imgArr = new Uint8Array(3 * plane);
  for (let i = 0; i < plane; i++) {
    imgArr[i]             = roiPixels[i * 4];
    imgArr[plane + i]     = roiPixels[i * 4 + 1];
    imgArr[2 * plane + i] = roiPixels[i * 4 + 2];
  }

  const maskArr = new Uint8Array(plane).fill(255);
  const localBx = Math.max(0, bx - rx);
  const localBy = Math.max(0, by - ry);
  const localX1 = Math.min(ROI_SIZE, bx + bw - rx);
  const localY1 = Math.min(ROI_SIZE, by + bh - ry);
  for (let y = localBy; y < localY1; y++) {
    const row = y * ROI_SIZE;
    for (let x = localBx; x < localX1; x++) {
      maskArr[row + x] = 0;
    }
  }

  const imageTensor = new ort.Tensor('uint8', imgArr, [1, 3, ROI_SIZE, ROI_SIZE]);
  const maskTensor = new ort.Tensor('uint8', maskArr, [1, 1, ROI_SIZE, ROI_SIZE]);

  const feeds = {};
  feeds[session.inputNames[0]] = imageTensor;
  feeds[session.inputNames[1]] = maskTensor;

  const results = await session.run(feeds);
  const output = results[session.outputNames[0]];
  const outData = output.data;
  const isFloat = outData instanceof Float32Array;

  const outImage = ctx.createImageData(ROI_SIZE, ROI_SIZE);
  const outPixels = outImage.data;
  const norm = isFloat ? 255 : 1;
  for (let i = 0; i < plane; i++) {
    const r = outData[i] * norm;
    const g = outData[plane + i] * norm;
    const b = outData[2 * plane + i] * norm;
    const j = i * 4;
    outPixels[j]     = r < 0 ? 0 : r > 255 ? 255 : r;
    outPixels[j + 1] = g < 0 ? 0 : g > 255 ? 255 : g;
    outPixels[j + 2] = b < 0 ? 0 : b > 255 ? 255 : b;
    outPixels[j + 3] = 255;
  }

  const roiCanvas = document.createElement('canvas');
  roiCanvas.width = ROI_SIZE;
  roiCanvas.height = ROI_SIZE;
  roiCanvas.getContext('2d').putImageData(outImage, 0, 0);

  const boxLocalX = bx - rx;
  const boxLocalY = by - ry;
  ctx.drawImage(roiCanvas, boxLocalX, boxLocalY, bw, bh, bx, by, bw, bh);
};
