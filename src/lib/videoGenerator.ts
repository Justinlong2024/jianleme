/**
 * Client-side slideshow video generator using Canvas + MediaRecorder.
 * Takes an array of image URLs and produces a playable/downloadable Blob.
 */

export interface VideoGeneratorOptions {
  imageUrls: string[];
  template: string;
  width?: number;
  height?: number;
  fps?: number;
  /** Duration per photo in seconds */
  photoSeconds?: number;
  /** Transition duration in seconds */
  transitionSeconds?: number;
  onProgress?: (pct: number) => void;
}

interface TemplateStyle {
  bgColor: string;
  textColor: string;
  fontFamily: string;
  titleText: string;
  subtitlePrefix: string;
}

const TEMPLATE_STYLES: Record<string, TemplateStyle> = {
  simple: {
    bgColor: '#ffffff',
    textColor: '#333333',
    fontFamily: '"PingFang SC", "Hiragino Sans GB", sans-serif',
    titleText: '我的蜕变之旅',
    subtitlePrefix: '坚持的力量',
  },
  nature: {
    bgColor: '#f5f0e8',
    textColor: '#5a4a3a',
    fontFamily: '"PingFang SC", serif',
    titleText: '自然的力量',
    subtitlePrefix: '回归本真',
  },
  motivation: {
    bgColor: '#1a1a2e',
    textColor: '#e0e0e0',
    fontFamily: '"PingFang SC", sans-serif',
    titleText: '不断突破',
    subtitlePrefix: '每一天都是新的开始',
  },
  wabisabi: {
    bgColor: '#f7f3ee',
    textColor: '#6b6358',
    fontFamily: '"PingFang SC", "Noto Serif SC", serif',
    titleText: '侘寂之美',
    subtitlePrefix: '简素中的力量',
  },
};

/**
 * Load an image URL into an HTMLImageElement, handling CORS.
 */
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
}

/**
 * Draw an image to fill the canvas while maintaining aspect ratio (cover mode).
 */
function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number, y: number, w: number, h: number,
  opacity = 1,
  scale = 1,
) {
  const imgRatio = img.width / img.height;
  const canvasRatio = w / h;
  let sx = 0, sy = 0, sw = img.width, sh = img.height;

  if (imgRatio > canvasRatio) {
    sw = img.height * canvasRatio;
    sx = (img.width - sw) / 2;
  } else {
    sh = img.width / canvasRatio;
    sy = (img.height - sh) / 2;
  }

  ctx.save();
  ctx.globalAlpha = opacity;
  if (scale !== 1) {
    const cx = x + w / 2;
    const cy = y + h / 2;
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);
    ctx.translate(-cx, -cy);
  }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  ctx.restore();
}

/**
 * Draw text centered on canvas.
 */
function drawCenteredText(
  ctx: CanvasRenderingContext2D,
  text: string,
  y: number,
  fontSize: number,
  color: string,
  fontFamily: string,
  opacity = 1,
) {
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.fillStyle = color;
  ctx.font = `bold ${fontSize}px ${fontFamily}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, ctx.canvas.width / 2, y);
  ctx.restore();
}

/**
 * Ease function (ease-in-out cubic).
 */
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Generate a slideshow video from images.
 * Returns a Blob URL to the generated video.
 */
export async function generateVideo(options: VideoGeneratorOptions): Promise<string> {
  const {
    imageUrls,
    template,
    width = 720,
    height = 1280,
    fps = 30,
    photoSeconds = 2.5,
    transitionSeconds = 0.8,
    onProgress,
  } = options;

  if (imageUrls.length === 0) {
    throw new Error('No images provided');
  }

  const style = TEMPLATE_STYLES[template] || TEMPLATE_STYLES.wabisabi;

  // Load all images
  onProgress?.(5);
  const images: HTMLImageElement[] = [];
  for (let i = 0; i < imageUrls.length; i++) {
    try {
      const img = await loadImage(imageUrls[i]);
      images.push(img);
    } catch {
      console.warn(`Skipping failed image: ${imageUrls[i]}`);
    }
    onProgress?.(5 + (i / imageUrls.length) * 15);
  }

  if (images.length === 0) {
    throw new Error('No images could be loaded');
  }

  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Setup MediaRecorder
  const stream = canvas.captureStream(fps);
  
  // Try different codecs
  let mimeType = 'video/webm;codecs=vp9';
  if (!MediaRecorder.isTypeSupported(mimeType)) {
    mimeType = 'video/webm;codecs=vp8';
  }
  if (!MediaRecorder.isTypeSupported(mimeType)) {
    mimeType = 'video/webm';
  }

  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: 4_000_000,
  });

  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  const recordingDone = new Promise<Blob>((resolve) => {
    recorder.onstop = () => {
      resolve(new Blob(chunks, { type: 'video/webm' }));
    };
  });

  recorder.start();

  // Calculate timing
  const photoFrames = Math.round(photoSeconds * fps);
  const transFrames = Math.round(transitionSeconds * fps);
  // Intro: 2s, photos with transitions, outro: 2s
  const introFrames = 2 * fps;
  const outroFrames = 2 * fps;
  const photoSectionFrames = images.length * photoFrames + Math.max(0, images.length - 1) * transFrames;
  const totalFrames = introFrames + photoSectionFrames + outroFrames;

  onProgress?.(20);

  // Render frame by frame
  for (let frame = 0; frame < totalFrames; frame++) {
    // Background
    ctx.fillStyle = style.bgColor;
    ctx.fillRect(0, 0, width, height);

    if (frame < introFrames) {
      // === INTRO ===
      const t = frame / introFrames;
      const ease = easeInOutCubic(t);

      // Title
      drawCenteredText(ctx, style.titleText, height * 0.4, 48, style.textColor, style.fontFamily, ease);
      drawCenteredText(ctx, `${images.length} 张记录`, height * 0.48, 24, style.textColor, style.fontFamily, ease * 0.7);
      drawCenteredText(ctx, style.subtitlePrefix, height * 0.55, 20, style.textColor, style.fontFamily, ease * 0.5);

    } else if (frame < introFrames + photoSectionFrames) {
      // === PHOTO SECTION ===
      const photoFrame = frame - introFrames;

      // Determine current photo index and transition state
      const cycleLength = photoFrames + transFrames;
      const cycleIndex = Math.floor(photoFrame / cycleLength);
      const frameInCycle = photoFrame % cycleLength;

      const currentIdx = Math.min(cycleIndex, images.length - 1);
      const nextIdx = Math.min(cycleIndex + 1, images.length - 1);

      if (frameInCycle < photoFrames) {
        // Static photo display with subtle Ken Burns
        const kenBurnsT = frameInCycle / photoFrames;
        const scale = 1.0 + kenBurnsT * 0.05;
        drawImageCover(ctx, images[currentIdx], 0, 0, width, height, 1, scale);

        // Day counter overlay
        const dayText = `第 ${currentIdx + 1} 天`;
        ctx.save();
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        const metrics = ctx.measureText(dayText);
        const padding = 16;
        const tagW = metrics.width + padding * 2 + 40;
        const tagH = 36;
        const tagX = width - tagW - 16;
        const tagY = 16;
        ctx.beginPath();
        ctx.roundRect(tagX, tagY, tagW, tagH, 18);
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold 16px ${style.fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(dayText, tagX + tagW / 2, tagY + tagH / 2);
        ctx.restore();

      } else if (currentIdx < images.length - 1) {
        // Transition between photos
        const transProgress = (frameInCycle - photoFrames) / transFrames;
        const ease = easeInOutCubic(transProgress);

        // Crossfade transition
        drawImageCover(ctx, images[currentIdx], 0, 0, width, height, 1 - ease);
        drawImageCover(ctx, images[nextIdx], 0, 0, width, height, ease);
      } else {
        // Last photo, no transition
        drawImageCover(ctx, images[currentIdx], 0, 0, width, height);
      }

    } else {
      // === OUTRO ===
      const outroFrame = frame - introFrames - photoSectionFrames;
      const t = outroFrame / outroFrames;
      const ease = easeInOutCubic(Math.min(t * 2, 1));
      const fadeOut = t > 0.7 ? 1 - (t - 0.7) / 0.3 : 1;

      drawCenteredText(ctx, '蜕变，从不止步', height * 0.45, 36, style.textColor, style.fontFamily, ease * fadeOut);
      drawCenteredText(ctx, `共 ${images.length} 天记录`, height * 0.52, 20, style.textColor, style.fontFamily, ease * 0.7 * fadeOut);
    }

    // Wait for next frame timing
    await new Promise((r) => setTimeout(r, 1000 / fps));

    // Update progress (20% to 95%)
    const pct = 20 + (frame / totalFrames) * 75;
    onProgress?.(Math.round(pct));
  }

  // Stop recording
  recorder.stop();
  onProgress?.(98);

  const blob = await recordingDone;
  const url = URL.createObjectURL(blob);
  onProgress?.(100);

  return url;
}

/**
 * Download a blob URL as a file.
 */
export function downloadVideo(blobUrl: string, filename = 'transformation.webm') {
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
