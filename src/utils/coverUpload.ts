/**
 * Utility for client-side cover image optimization (1080x1080, 1:1 preferred)
 * and direct upload to server storage without heavy payload in Firestore.
 */

export interface OptimizeCoverResult {
  dataUrl: string;
  width: number;
  height: number;
  sizeBytes: number;
}

/**
 * Optimizes an image File to a max 1080x1080 square format with high visual sharpness
 * and lightweight footprint (~100-200KB).
 */
export async function optimizeCoverImage(file: File): Promise<OptimizeCoverResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Erro ao ler arquivo de imagem'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Erro ao carregar prévia da imagem'));
      img.onload = () => {
        const origW = img.naturalWidth || img.width;
        const origH = img.naturalHeight || img.height;

        // Target size: 1080x1080 (1:1 ratio)
        const targetDim = 1080;
        const canvas = document.createElement('canvas');
        canvas.width = targetDim;
        canvas.height = targetDim;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve({
            dataUrl: reader.result as string,
            width: origW,
            height: origH,
            sizeBytes: file.size,
          });
          return;
        }

        // Enable high-quality smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw cover (object-fit: cover logic) into 1080x1080 canvas
        const srcRatio = origW / origH;
        let sWidth = origW;
        let sHeight = origH;
        let sx = 0;
        let sy = 0;

        if (srcRatio > 1) {
          // Wider than tall: crop sides
          sWidth = origH;
          sx = (origW - sWidth) / 2;
        } else if (srcRatio < 1) {
          // Taller than wide: crop top/bottom
          sHeight = origW;
          sy = (origH - sHeight) / 2;
        }

        ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, targetDim, targetDim);

        // Convert to webp with 0.88 quality (or jpeg fallback)
        let mime = 'image/webp';
        let dataUrl = canvas.toDataURL(mime, 0.88);
        if (!dataUrl.startsWith('data:image/webp')) {
          mime = 'image/jpeg';
          dataUrl = canvas.toDataURL(mime, 0.88);
        }

        // Calculate approximate size
        const base64Length = dataUrl.length - (dataUrl.indexOf(',') + 1);
        const sizeBytes = Math.round((base64Length * 3) / 4);

        resolve({
          dataUrl,
          width: targetDim,
          height: targetDim,
          sizeBytes,
        });
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads an optimized cover to the server storage endpoint.
 * Returns the final URL of the stored file (e.g. /uploads/covers/cover_xxx.webp).
 */
export async function uploadCoverToServer(
  imageBase64: string,
  modelId: string
): Promise<string> {
  try {
    const res = await fetch('/api/upload-cover', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageBase64,
        modelId,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.url) {
        return data.url;
      }
    }
  } catch (err) {
    console.warn('Upload endpoint error, using optimized data:', err);
  }

  // Graceful fallback to dataUrl if endpoint isn't available
  return imageBase64;
}
