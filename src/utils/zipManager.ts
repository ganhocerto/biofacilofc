import JSZip from 'jszip';
import { EditableField, BiofacilManifest } from '../types';

export interface UnpackedZipResult {
  html: string;
  manifest?: BiofacilManifest;
  detectedFields?: EditableField[];
  assetCount: number;
  entryPath: string;
}

/**
 * Recursively inspects and extracts a biosite from a ZIP archive
 */
export async function unpackBiositeZip(file: File): Promise<UnpackedZipResult> {
  const zip = new JSZip();
  const loadedZip = await zip.loadAsync(file);

  // 1. Find index.html anywhere in the archive
  let htmlPath = '';
  const fileNames = Object.keys(loadedZip.files);

  for (const name of fileNames) {
    if (name.toLowerCase().endsWith('index.html') && !name.startsWith('__MACOSX/')) {
      htmlPath = name;
      break;
    }
  }

  // Fallback: search for any .html file
  if (!htmlPath) {
    for (const name of fileNames) {
      if (name.toLowerCase().endsWith('.html') && !name.startsWith('__MACOSX/')) {
        htmlPath = name;
        break;
      }
    }
  }

  if (!htmlPath) {
    throw new Error('Nenhum arquivo HTML (index.html) foi encontrado dentro do arquivo ZIP.');
  }

  const rawHtml = await loadedZip.file(htmlPath)!.async('string');
  const baseDir = htmlPath.includes('/') ? htmlPath.substring(0, htmlPath.lastIndexOf('/') + 1) : '';

  // 2. Check for biofacil.json
  let manifest: BiofacilManifest | undefined;
  for (const name of fileNames) {
    if (name.toLowerCase().endsWith('biofacil.json') && !name.startsWith('__MACOSX/')) {
      try {
        const jsonStr = await loadedZip.file(name)!.async('string');
        manifest = JSON.parse(jsonStr);
      } catch (err) {
        console.warn('Erro ao processar biofacil.json no ZIP:', err);
      }
      break;
    }
  }

  // 3. Process and inline relative CSS, JS, and Images for a 100% self-contained preview
  const parser = new DOMParser();
  const doc = parser.parseFromString(rawHtml, 'text/html');
  let assetCount = 0;

  // Inline CSS files
  const linkTags = Array.from(doc.querySelectorAll('link[rel="stylesheet"]'));
  for (const link of linkTags) {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('http://') && !href.startsWith('https://') && !href.startsWith('//')) {
      const targetPath = resolveRelativePath(baseDir, href);
      const zipFile = loadedZip.file(targetPath);
      if (zipFile) {
        const cssContent = await zipFile.async('string');
        const styleTag = doc.createElement('style');
        styleTag.textContent = cssContent;
        link.replaceWith(styleTag);
        assetCount++;
      }
    }
  }

  // Inline JS files
  const scriptTags = Array.from(doc.querySelectorAll('script[src]'));
  for (const script of scriptTags) {
    const src = script.getAttribute('src');
    if (src && !src.startsWith('http://') && !src.startsWith('https://') && !src.startsWith('//')) {
      const targetPath = resolveRelativePath(baseDir, src);
      const zipFile = loadedZip.file(targetPath);
      if (zipFile) {
        const jsContent = await zipFile.async('string');
        const inlineScript = doc.createElement('script');
        inlineScript.textContent = jsContent;
        script.replaceWith(inlineScript);
        assetCount++;
      }
    }
  }

  // Inline local images as base64 Data URLs
  const imgTags = Array.from(doc.querySelectorAll('img[src]'));
  for (const img of imgTags) {
    const src = img.getAttribute('src');
    if (src && !src.startsWith('http://') && !src.startsWith('https://') && !src.startsWith('data:')) {
      const targetPath = resolveRelativePath(baseDir, src);
      const zipFile = loadedZip.file(targetPath);
      if (zipFile) {
        const mime = getMimeType(src);
        const base64 = await zipFile.async('base64');
        img.setAttribute('src', `data:${mime};base64,${base64}`);
        assetCount++;
      }
    }
  }

  const finalHtml = '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;

  return {
    html: finalHtml,
    manifest,
    detectedFields: manifest?.fields,
    assetCount,
    entryPath: htmlPath,
  };
}

/**
 * Downloads a ready-to-deploy ZIP package for the user
 */
export async function downloadBiositeZip(
  fileName: string,
  htmlContent: string,
  manifest?: BiofacilManifest
) {
  const zip = new JSZip();

  // 1. index.html
  zip.file('index.html', htmlContent);

  // 2. biofacil.json
  if (manifest) {
    zip.file('biofacil.json', JSON.stringify(manifest, null, 2));
  }

  // 3. README instructions for Vercel / Netlify / Cloudflare
  const readmeText = `=====================================================
  BIO FÁCIL - SEU BIOSITE ESTÁ PRONTO!
=====================================================

Parabéns! Seu biosite profissional foi gerado e empacotado pelo BIO FÁCIL.

ARQUIVOS INCLUÍDOS:
- index.html: Código do seu biosite pronto, com design responsivo e links configurados.
- biofacil.json: Manifesto de personalização e campos do modelo.

-----------------------------------------------------
COMO PUBLICAR NA VERCEL (GRÁTIS E EM 1 MINUTO):
-----------------------------------------------------
1. Acesse: https://vercel.com
2. Faça login com sua conta (GitHub ou e-mail).
3. Arraste e solte esta pasta descompactada no painel da Vercel ou clique em "Add New Project".
4. Pronto! Seu link personalizado (ex: seunegocio.vercel.app) estará no ar instantaneamente!

-----------------------------------------------------
COMO PUBLICAR NA NETLIFY (ARRASTAR E SOLTAR):
-----------------------------------------------------
1. Acesse: https://app.netlify.com/drop
2. Arraste esta pasta descompactada para a tela.
3. Seu biosite estará publicado em poucos segundos!

-----------------------------------------------------
SUPORTE BIO FÁCIL
-----------------------------------------------------
Gerado com tecnologia BIO FÁCIL - Seu negócio. Sua presença. Seu biosite.
`;

  zip.file('README.txt', readmeText);

  // Generate blob and trigger download
  const blob = await zip.generateAsync({ type: 'blob' });
  const downloadUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = downloadUrl;
  anchor.download = `${fileName.replace(/\s+/g, '-').toLowerCase()}-biosite.zip`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(downloadUrl);
}

function resolveRelativePath(baseDir: string, relativePath: string): string {
  let cleanRel = relativePath.replace(/^(\.\/|\/)/, '');
  if (!baseDir) return cleanRel;
  return baseDir + cleanRel;
}

function getMimeType(filePath: string): string {
  const ext = filePath.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'png': return 'image/png';
    case 'jpg':
    case 'jpeg': return 'image/jpeg';
    case 'webp': return 'image/webp';
    case 'svg': return 'image/svg+xml';
    case 'gif': return 'image/gif';
    default: return 'image/png';
  }
}
