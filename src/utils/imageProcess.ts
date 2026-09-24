/**
 * Utility for image processing and automatic background detection / removal
 */

export interface BgRemovalResult {
  dataUrl: string;
  hasTransparency: boolean;
}

export async function processImageBackground(
  imageSource: string,
  tolerance = 38
): Promise<BgRemovalResult> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const w = img.naturalWidth || img.width || 300;
      const h = img.naturalHeight || img.height || 300;
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        resolve({ dataUrl: imageSource, hasTransparency: false });
        return;
      }

      ctx.drawImage(img, 0, 0, w, h);
      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;

      // Check if image already has transparent pixels
      let hasTrans = false;
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] < 240) {
          hasTrans = true;
          break;
        }
      }

      // Sample perimeter corners to determine target background color
      const corners = [
        [0, 0],
        [w - 1, 0],
        [0, h - 1],
        [w - 1, h - 1],
        [Math.floor(w / 2), 0],
        [0, Math.floor(h / 2)],
        [w - 1, Math.floor(h / 2)],
        [Math.floor(w / 2), h - 1],
      ];

      let bgR = 0, bgG = 0, bgB = 0, count = 0;
      corners.forEach(([cx, cy]) => {
        const idx = (cy * w + cx) * 4;
        bgR += data[idx];
        bgG += data[idx + 1];
        bgB += data[idx + 2];
        count++;
      });
      bgR = Math.round(bgR / count);
      bgG = Math.round(bgG / count);
      bgB = Math.round(bgB / count);

      // BFS edge-based flood fill to remove contiguous background only
      const visited = new Uint8Array(w * h);
      const queue: number[] = [];

      const isBgMatch = (x: number, y: number) => {
        const idx = (y * w + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const dist = Math.sqrt((r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2);
        return dist <= tolerance;
      };

      for (let x = 0; x < w; x++) {
        if (isBgMatch(x, 0)) { queue.push(x, 0); visited[x] = 1; }
        if (isBgMatch(x, h - 1)) { queue.push(x, h - 1); visited[(h - 1) * w + x] = 1; }
      }
      for (let y = 0; y < h; y++) {
        if (isBgMatch(0, y)) { queue.push(0, y); visited[y * w] = 1; }
        if (isBgMatch(w - 1, y)) { queue.push(w - 1, y); visited[y * w + (w - 1)] = 1; }
      }

      let head = 0;
      while (head < queue.length) {
        const qx = queue[head++];
        const qy = queue[head++];
        const pIdx = (qy * w + qx) * 4;
        data[pIdx + 3] = 0; // alpha to 0

        const neighbors = [
          [qx + 1, qy],
          [qx - 1, qy],
          [qx, qy + 1],
          [qx, qy - 1],
        ];

        for (let i = 0; i < neighbors.length; i++) {
          const [nx, ny] = neighbors[i];
          if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
            const vIdx = ny * w + nx;
            if (!visited[vIdx] && isBgMatch(nx, ny)) {
              visited[vIdx] = 1;
              queue.push(nx, ny);
            }
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
      resolve({
        dataUrl: canvas.toDataURL('image/png'),
        hasTransparency: hasTrans,
      });
    };
    img.onerror = () => {
      resolve({ dataUrl: imageSource, hasTransparency: false });
    };
    img.src = imageSource;
  });
}
