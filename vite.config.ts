import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, type Plugin } from 'vite';

function coverUploadPlugin(): Plugin {
  return {
    name: 'cover-upload-api',
    configureServer(server) {
      server.middlewares.use('/api/upload-cover', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        req.on('data', (chunk: Buffer) => {
          body += chunk.toString();
        });

        req.on('end', () => {
          try {
            const data = JSON.parse(body);
            const { imageBase64, modelId } = data;
            if (!imageBase64) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'No image provided' }));
              return;
            }

            const matches = imageBase64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
            const buffer = matches ? Buffer.from(matches[2], 'base64') : Buffer.from(imageBase64, 'base64');
            const ext = matches && matches[1].includes('png') ? 'png' : matches && matches[1].includes('webp') ? 'webp' : 'jpg';

            const safeId = (modelId || 'cover').replace(/[^a-zA-Z0-9_-]/g, '_');
            const filename = `cover_${safeId}_${Date.now()}.${ext}`;
            const targetDir = path.resolve(__dirname, 'public/uploads/covers');
            if (!fs.existsSync(targetDir)) {
              fs.mkdirSync(targetDir, { recursive: true });
            }
            const filePath = path.join(targetDir, filename);
            fs.writeFileSync(filePath, buffer);

            const fileUrl = `/uploads/covers/${filename}`;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, url: fileUrl }));
          } catch (err: any) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message || 'Upload failed' }));
          }
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), coverUploadPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
