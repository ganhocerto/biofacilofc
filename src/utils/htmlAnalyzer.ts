import { EditableField, FieldType, IconStyleType, SocialItemConfig, LogoConfig } from '../types';

export interface DetectedElement {
  id: string;
  name: string;
  type: FieldType;
  tagName: string;
  attr: 'text' | 'html' | 'src' | 'href' | 'style';
  dataBioAttr: string;
  originalValue: string;
  selector: string;
  recommended: boolean;
  category: string;
}

export interface ColorPalette {
  id: string;
  name: string;
  colors: {
    bg: string;
    surface: string;
    primary: string;
    secondary: string;
    text: string;
    muted: string;
    glow: string;
  };
}

export const READY_PALETTES: ColorPalette[] = [
  {
    id: 'original',
    name: 'Original do Modelo',
    colors: {
      bg: '#08080c',
      surface: '#12111a',
      primary: '#d97706',
      secondary: '#9333ea',
      text: '#ffffff',
      muted: '#9ca3af',
      glow: 'rgba(217, 119, 6, 0.35)',
    }
  },
  {
    id: 'black_gold',
    name: 'Preto + Dourado',
    colors: {
      bg: '#070707',
      surface: '#141316',
      primary: '#d4af37',
      secondary: '#f59e0b',
      text: '#ffffff',
      muted: '#a3a3a3',
      glow: 'rgba(212, 175, 55, 0.4)',
    }
  },
  {
    id: 'black_electric_blue',
    name: 'Preto + Azul Elétrico',
    colors: {
      bg: '#060814',
      surface: '#0e1224',
      primary: '#00d2ff',
      secondary: '#3a86ff',
      text: '#ffffff',
      muted: '#94a3b8',
      glow: 'rgba(0, 210, 255, 0.4)',
    }
  },
  {
    id: 'black_red',
    name: 'Preto + Vermelho',
    colors: {
      bg: '#0a0505',
      surface: '#170b0b',
      primary: '#ef4444',
      secondary: '#dc2626',
      text: '#ffffff',
      muted: '#a8a29e',
      glow: 'rgba(239, 68, 68, 0.4)',
    }
  },
  {
    id: 'black_neon_purple',
    name: 'Preto + Roxo Neon',
    colors: {
      bg: '#07050e',
      surface: '#120e24',
      primary: '#a855f7',
      secondary: '#c084fc',
      text: '#ffffff',
      muted: '#cbd5e1',
      glow: 'rgba(168, 85, 247, 0.4)',
    }
  },
  {
    id: 'white_black',
    name: 'Branco + Preto',
    colors: {
      bg: '#f8fafc',
      surface: '#ffffff',
      primary: '#0f172a',
      secondary: '#334155',
      text: '#0f172a',
      muted: '#64748b',
      glow: 'rgba(15, 23, 42, 0.15)',
    }
  },
  {
    id: 'green_premium',
    name: 'Verde Premium',
    colors: {
      bg: '#050a06',
      surface: '#0c180f',
      primary: '#10b981',
      secondary: '#059669',
      text: '#ffffff',
      muted: '#a7f3d0',
      glow: 'rgba(16, 185, 129, 0.4)',
    }
  }
];

export const SOCIAL_SVGS: Record<string, string> = {
  whatsapp: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.54 1.83.822 2.796.822 3.18 0 5.767-2.586 5.768-5.766 0-3.18-2.587-5.768-5.768-5.768zm7.42 5.766c-.001 4.093-3.328 7.42-7.42 7.42-.001 0-.001 0 0 0-1.282 0-2.457-.333-3.528-.941l-4.148 1.088 1.107-4.043c-.694-1.121-1.066-2.42-1.066-3.754 0-4.092 3.327-7.419 7.42-7.419 4.092 0 7.419 3.327 7.419 7.42 0 0 0 0 0 0z"/></svg>`,
  instagram: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>`,
  facebook: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
  tiktok: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>`,
  youtube: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`
};

export function generateThemeCss(
  colors?: Record<string, string>,
  iconStyle: IconStyleType = 'original',
  logoConfig?: LogoConfig
): string {
  const bg = colors?.['bg'] || '#08080c';
  const surface = colors?.['surface'] || '#12111a';
  const primary = colors?.['primary'] || '#d97706';
  const secondary = colors?.['secondary'] || '#9333ea';
  const text = colors?.['text'] || '#ffffff';
  const muted = colors?.['muted'] || '#9ca3af';
  const glow = colors?.['glow'] || 'rgba(217, 119, 6, 0.35)';

  let iconCss = '';
  switch (iconStyle) {
    case 'minimal':
      iconCss = `
        .social-btn {
          background: rgba(255, 255, 255, 0.05) !important;
          border: 1px solid rgba(255, 255, 255, 0.15) !important;
          box-shadow: none !important;
          border-radius: 12px !important;
          transition: all 0.2s ease !important;
        }
        .social-btn:hover {
          background: rgba(255, 255, 255, 0.1) !important;
          transform: translateY(-1px) !important;
        }
      `;
      break;
    case 'glass':
      iconCss = `
        .social-btn {
          background: rgba(255, 255, 255, 0.08) !important;
          backdrop-filter: blur(14px) !important;
          -webkit-backdrop-filter: blur(14px) !important;
          border: 1px solid rgba(255, 255, 255, 0.22) !important;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.25) !important;
          border-radius: 14px !important;
          transition: all 0.2s ease !important;
        }
        .social-btn:hover {
          background: rgba(255, 255, 255, 0.15) !important;
          border-color: rgba(255, 255, 255, 0.4) !important;
          transform: translateY(-2px) !important;
        }
      `;
      break;
    case '3d':
      iconCss = `
        .social-btn {
          background: linear-gradient(145deg, #1f1d2e, #11101a) !important;
          border: 1px solid rgba(255, 255, 255, 0.12) !important;
          box-shadow: 0 5px 0 #0c0b13, 0 10px 18px rgba(0, 0, 0, 0.6) !important;
          border-radius: 14px !important;
          transform: translateY(-2px) !important;
          transition: all 0.15s ease !important;
        }
        .social-btn:hover {
          transform: translateY(-3px) !important;
          box-shadow: 0 6px 0 #0c0b13, 0 14px 22px rgba(0, 0, 0, 0.7) !important;
        }
      `;
      break;
    case 'brilliant':
      iconCss = `
        .social-btn {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.02)) !important;
          border: 1px solid rgba(255, 255, 255, 0.35) !important;
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.5) !important;
          border-radius: 14px !important;
          transition: all 0.2s ease !important;
        }
        .social-btn:hover {
          border-color: #ffffff !important;
          box-shadow: 0 0 22px rgba(255, 255, 255, 0.4), inset 0 1px 3px rgba(255, 255, 255, 0.7) !important;
          transform: scale(1.05) !important;
        }
      `;
      break;
    case 'neon':
      iconCss = `
        .social-btn {
          background: rgba(10, 8, 20, 0.85) !important;
          border: 1px solid var(--bio-primary, #a855f7) !important;
          box-shadow: 0 0 16px var(--bio-glow, rgba(168, 85, 247, 0.55)), inset 0 0 8px var(--bio-glow, rgba(168, 85, 247, 0.25)) !important;
          color: var(--bio-primary, #c084fc) !important;
          border-radius: 14px !important;
          transition: all 0.2s ease !important;
        }
        .social-btn:hover {
          box-shadow: 0 0 24px var(--bio-glow, rgba(168, 85, 247, 0.8)), inset 0 0 12px var(--bio-glow, rgba(168, 85, 247, 0.4)) !important;
          transform: translateY(-2px) !important;
        }
      `;
      break;
    default:
      iconCss = '';
  }

  let logoSizeCss = '';
  if (logoConfig?.size === 'sm') {
    logoSizeCss = `
      .logo-wrapper { width: 80px !important; height: 80px !important; }
      .logo-img { max-height: 80px !important; }
    `;
  } else if (logoConfig?.size === 'lg') {
    logoSizeCss = `
      .logo-wrapper { width: 130px !important; height: 130px !important; }
      .logo-img { max-height: 130px !important; }
    `;
  }

  return `
    :root {
      --bio-bg: ${bg};
      --bio-surface: ${surface};
      --bio-primary: ${primary};
      --bio-secondary: ${secondary};
      --bio-text: ${text};
      --bio-muted: ${muted};
      --bio-glow: ${glow};
    }
    body {
      background: var(--bio-bg) !important;
      color: var(--bio-text) !important;
    }
    .headline, .section-header, .specialty-price, .company-name-accent {
      color: var(--bio-primary) !important;
    }
    .section-header span {
      background: var(--bio-glow) !important;
      color: var(--bio-primary) !important;
    }
    .specialty-card, .info-card {
      background: var(--bio-surface) !important;
      border-color: rgba(255, 255, 255, 0.08) !important;
    }
    .logo-wrapper {
      background: linear-gradient(135deg, var(--bio-primary), var(--bio-secondary), var(--bio-primary)) !important;
      box-shadow: 0 8px 30px var(--bio-glow) !important;
    }
    .cta-main {
      background: linear-gradient(135deg, var(--bio-primary), var(--bio-secondary)) !important;
      box-shadow: 0 8px 25px -4px var(--bio-glow) !important;
    }
    ${iconCss}
    ${logoSizeCss}
  `;
}

/**
 * Clean text extracting pure text content without HTML tags
 */
export function cleanTextContent(htmlOrText: string): string {
  const doc = new DOMParser().parseFromString(htmlOrText, 'text/html');
  return (doc.body.textContent || '').trim();
}

/**
 * Intelligent HTML Analyzer that inspects HTML and detects elements for Bio Fácil
 */
export function analyzeHtmlForBiosite(rawHtml: string): {
  detected: DetectedElement[];
  hasExistingBioAttrs: boolean;
} {
  const parser = new DOMParser();
  const doc = parser.parseFromString(rawHtml, 'text/html');

  const detected: DetectedElement[] = [];
  let existingCount = 0;

  // 1. Check existing data-bio-* attributes
  const existingBioNodes = doc.querySelectorAll('[data-bio-text], [data-bio-image], [data-bio-link], [data-bio-services], [data-bio-gallery]');
  if (existingBioNodes.length > 0) {
    existingCount = existingBioNodes.length;
    existingBioNodes.forEach((node, idx) => {
      let fieldType: FieldType = 'text';
      let attr: 'text' | 'html' | 'src' | 'href' | 'style' = 'text';
      let dataBioAttr = '';
      let originalVal = '';
      let name = '';

      if (node.hasAttribute('data-bio-text')) {
        const val = node.getAttribute('data-bio-text') || `texto_${idx + 1}`;
        dataBioAttr = `data-bio-text="${val}"`;
        originalVal = node.textContent?.trim() || '';
        name = formatFieldLabel(val);
        fieldType = (node.tagName === 'H1' || node.tagName === 'H2') ? 'title' : 'text';
        attr = 'text';
      } else if (node.hasAttribute('data-bio-image')) {
        const val = node.getAttribute('data-bio-image') || `img_${idx + 1}`;
        dataBioAttr = `data-bio-image="${val}"`;
        originalVal = (node as HTMLImageElement).src || node.getAttribute('src') || '';
        name = formatFieldLabel(val);
        fieldType = val.toLowerCase().includes('logo') || val.toLowerCase().includes('avatar') ? 'logo' : 'image';
        attr = 'src';
      } else if (node.hasAttribute('data-bio-link')) {
        const val = node.getAttribute('data-bio-link') || `link_${idx + 1}`;
        dataBioAttr = `data-bio-link="${val}"`;
        originalVal = (node as HTMLAnchorElement).href || node.getAttribute('href') || '';
        name = formatFieldLabel(val);
        fieldType = detectLinkType(originalVal, val);
        attr = 'href';
      }

      detected.push({
        id: `existing_${idx + 1}`,
        name: name || `Campo ${idx + 1}`,
        type: fieldType,
        tagName: node.tagName.toLowerCase(),
        attr,
        dataBioAttr,
        originalValue: originalVal,
        selector: `[${dataBioAttr}]`,
        recommended: true,
        category: 'Configurado Anteriormente'
      });
    });
  }

  // 2. Scan and auto-detect Titles and Slogans
  const headings = doc.querySelectorAll('h1, h2, h3, .title, .nome, [class*="title"], [class*="name"]');
  headings.forEach((heading, idx) => {
    const text = heading.textContent?.trim() || '';
    if (text.length > 2 && text.length < 120 && !heading.hasAttribute('data-bio-text')) {
      const isMain = heading.tagName === 'H1' || idx === 0;
      const key = isMain ? 'nome_empresa' : `titulo_${idx + 1}`;
      detected.push({
        id: `head_${idx + 1}`,
        name: isMain ? 'Nome Principal / Empresa' : `Título (${text.slice(0, 24)}...)`,
        type: isMain ? 'title' : 'text',
        tagName: heading.tagName.toLowerCase(),
        attr: 'text',
        dataBioAttr: `data-bio-text="${key}"`,
        originalValue: text,
        selector: generateUniqueSelector(heading),
        recommended: isMain || idx < 3,
        category: 'Textos & Títulos'
      });
    }
  });

  // 3. Scan Paragraphs & Bios
  const paragraphs = doc.querySelectorAll('p, .bio, .desc, .description, [class*="bio"], [class*="desc"]');
  paragraphs.forEach((p, idx) => {
    const text = p.textContent?.trim() || '';
    if (text.length > 10 && text.length < 350 && !p.hasAttribute('data-bio-text')) {
      const isBio = idx === 0 || p.className.includes('bio');
      const key = isBio ? 'bio_descricao' : `descricao_${idx + 1}`;
      detected.push({
        id: `para_${idx + 1}`,
        name: isBio ? 'Bio / Slogan de Apresentação' : `Parágrafo (${text.slice(0, 24)}...)`,
        type: 'text',
        tagName: p.tagName.toLowerCase(),
        attr: 'text',
        dataBioAttr: `data-bio-text="${key}"`,
        originalValue: text,
        selector: generateUniqueSelector(p),
        recommended: isBio,
        category: 'Textos & Títulos'
      });
    }
  });

  // 4. Scan Images & Logos
  const images = doc.querySelectorAll('img');
  images.forEach((img, idx) => {
    const src = img.getAttribute('src') || '';
    if (src && !img.hasAttribute('data-bio-image')) {
      const isLogo = idx === 0 || 
        img.className.toLowerCase().includes('logo') || 
        img.className.toLowerCase().includes('avatar') ||
        (img.alt && (img.alt.toLowerCase().includes('logo') || img.alt.toLowerCase().includes('foto')));
      
      const key = isLogo ? 'logo_principal' : `imagem_${idx + 1}`;
      detected.push({
        id: `img_${idx + 1}`,
        name: isLogo ? 'Logomarca / Avatar Principal' : `Imagem de Destaque ${idx + 1}`,
        type: isLogo ? 'logo' : 'image',
        tagName: 'img',
        attr: 'src',
        dataBioAttr: `data-bio-image="${key}"`,
        originalValue: src,
        selector: generateUniqueSelector(img),
        recommended: true,
        category: 'Imagens & Logos'
      });
    }
  });

  // 5. Scan Links & Buttons (WhatsApp, Instagram, Maps, Phone, etc.)
  const links = doc.querySelectorAll('a[href], button');
  links.forEach((link, idx) => {
    const href = link.getAttribute('href') || '';
    const text = link.textContent?.trim() || '';
    const linkType = detectLinkType(href, text);

    if (linkType === 'whatsapp' || linkType === 'instagram' || linkType === 'phone' || linkType === 'email' || href.length > 3) {
      let key = `${linkType}_${idx + 1}`;
      let fieldName = 'Botão / Link';

      if (linkType === 'whatsapp') {
        key = 'whatsapp';
        fieldName = 'Botão WhatsApp';
      } else if (linkType === 'instagram') {
        key = 'instagram';
        fieldName = 'Link do Instagram';
      } else if (linkType === 'phone') {
        key = 'telefone';
        fieldName = 'Telefone para Ligação';
      } else if (linkType === 'email') {
        key = 'email_contato';
        fieldName = 'E-mail de Contato';
      } else if (href.includes('maps.google') || href.includes('goo.gl/maps')) {
        key = 'google_maps';
        fieldName = 'Localização no Google Maps';
      } else {
        fieldName = text ? `Botão: ${text.slice(0, 20)}` : `Link ${idx + 1}`;
      }

      detected.push({
        id: `link_${idx + 1}`,
        name: fieldName,
        type: linkType,
        tagName: link.tagName.toLowerCase(),
        attr: 'href',
        dataBioAttr: `data-bio-link="${key}"`,
        originalValue: href,
        selector: generateUniqueSelector(link),
        recommended: linkType === 'whatsapp' || linkType === 'instagram' || idx < 4,
        category: 'Links, Botões & Redes'
      });
    }
  });

  return {
    detected: deduplicateDetected(detected),
    hasExistingBioAttrs: existingCount > 0
  };
}

function detectLinkType(href: string, context = ''): FieldType {
  const combined = (href + ' ' + context).toLowerCase();
  if (combined.includes('wa.me') || combined.includes('whatsapp') || combined.includes('api.whatsapp')) {
    return 'whatsapp';
  }
  if (combined.includes('instagram.com') || combined.includes('instagr.am')) {
    return 'instagram';
  }
  if (href.startsWith('tel:') || combined.includes('ligar') || combined.includes('telefone')) {
    return 'phone';
  }
  if (href.startsWith('mailto:') || combined.includes('@') && combined.includes('.com')) {
    return 'email';
  }
  return 'link';
}

function formatFieldLabel(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

function generateUniqueSelector(element: Element): string {
  if (element.id) return `#${element.id}`;
  if (element.hasAttribute('data-bio-text')) return `[data-bio-text="${element.getAttribute('data-bio-text')}"]`;
  if (element.hasAttribute('data-bio-image')) return `[data-bio-image="${element.getAttribute('data-bio-image')}"]`;
  if (element.hasAttribute('data-bio-link')) return `[data-bio-link="${element.getAttribute('data-bio-link')}"]`;

  const tag = element.tagName.toLowerCase();
  const classes = Array.from(element.classList).filter(c => !c.startsWith('bio-'));
  if (classes.length > 0) {
    return `${tag}.${classes[0]}`;
  }
  return tag;
}

function deduplicateDetected(list: DetectedElement[]): DetectedElement[] {
  const seen = new Set<string>();
  return list.filter(item => {
    const key = `${item.attr}:${item.originalValue.slice(0, 60)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Transforms raw HTML by stamping data-bio-* attributes without changing design or layout
 */
export function stampDataBioAttributes(
  rawHtml: string,
  fields: EditableField[]
): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(rawHtml, 'text/html');

  fields.forEach(field => {
    let targetEl: Element | null = null;

    if (field.selector) {
      try {
        targetEl = doc.querySelector(field.selector);
      } catch {
        // Fallback search
      }
    }

    if (!targetEl && field.originalValue) {
      if (field.attr === 'text') {
        const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_ELEMENT);
        let currNode = walker.nextNode();
        while (currNode) {
          if (currNode.textContent?.trim() === field.originalValue.trim()) {
            targetEl = currNode as Element;
            break;
          }
          currNode = walker.nextNode();
        }
      } else if (field.attr === 'src') {
        targetEl = doc.querySelector(`img[src="${field.originalValue}"]`);
      } else if (field.attr === 'href') {
        targetEl = doc.querySelector(`a[href="${field.originalValue}"]`);
      }
    }

    if (targetEl) {
      if (field.attr === 'src') {
        targetEl.setAttribute('data-bio-image', field.id);
      } else if (field.attr === 'href') {
        targetEl.setAttribute('data-bio-link', field.id);
      } else {
        targetEl.setAttribute('data-bio-text', field.id);
      }
    }
  });

  return '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
}

/**
 * Compiles a customized biosite by injecting client-customized values, theme styles, icon styles, and socials
 */
export function compileBiositeHtml(
  templateHtml: string,
  fields: EditableField[],
  customValues: Record<string, string>,
  options?: {
    customColors?: Record<string, string>;
    iconStyle?: IconStyleType;
    socialsConfig?: Record<string, SocialItemConfig>;
    logoConfig?: LogoConfig;
  }
): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(templateHtml, 'text/html');

  // 1. Inject custom values for fields
  fields.forEach(field => {
    const val = customValues[field.id];
    if (val === undefined || val === null || val === '') return;

    if (field.attr === 'src') {
      const element = doc.querySelector(`[data-bio-image="${field.id}"]`) || (field.selector ? doc.querySelector(field.selector) : null);
      if (element) {
        element.setAttribute('src', val);
      }
    } else if (field.attr === 'href') {
      const element = doc.querySelector(`[data-bio-link="${field.id}"]`) || (field.selector ? doc.querySelector(field.selector) : null);
      if (element) {
        element.setAttribute('href', val);
      }
    } else {
      const element = doc.querySelector(`[data-bio-text="${field.id}"]`) || (field.selector ? doc.querySelector(field.selector) : null);
      if (element) {
        element.textContent = val;
      }
    }
  });

  // 2. Configure Social Networks (visibility, URLs, and dynamically adding Facebook/TikTok/YouTube)
  if (options?.socialsConfig) {
    const socialBar = doc.querySelector('.social-bar') || doc.querySelector('[data-bio-social-bar]');

    Object.entries(options.socialsConfig).forEach(([key, config]) => {
      let socialLink = doc.querySelector(`[data-bio-link="${key}"]`);

      if (!config.enabled) {
        // If disabled, hide it
        if (socialLink) {
          socialLink.remove();
        }
      } else {
        // If enabled and link exists, update URL
        if (socialLink) {
          if (config.url) {
            socialLink.setAttribute('href', config.url);
          }
        } else if (socialBar && config.url && SOCIAL_SVGS[key]) {
          // If enabled, not in DOM, and dynamic social bar exists, append it safely
          const newA = doc.createElement('a');
          newA.setAttribute('href', config.url);
          newA.setAttribute('target', '_blank');
          newA.setAttribute('class', 'social-btn');
          newA.setAttribute('data-bio-link', key);
          newA.setAttribute('title', key.charAt(0).toUpperCase() + key.slice(1));
          newA.innerHTML = SOCIAL_SVGS[key];
          socialBar.appendChild(newA);
        }
      }
    });
  }

  // 3. Inject Theme CSS (Colors, Palettes, Icon Styles, Logo Dimensions)
  const themeCss = generateThemeCss(
    options?.customColors,
    options?.iconStyle || 'original',
    options?.logoConfig
  );

  let styleTag = doc.getElementById('bio-custom-theme');
  if (!styleTag) {
    styleTag = doc.createElement('style');
    styleTag.setAttribute('id', 'bio-custom-theme');
    if (doc.head) {
      doc.head.appendChild(styleTag);
    } else if (doc.body) {
      doc.body.insertBefore(styleTag, doc.body.firstChild);
    }
  }
  styleTag.textContent = themeCss;

  return '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
}

/**
 * Normalizers for additional social networks
 */
export function normalizeFacebook(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  return `https://facebook.com/${trimmed.replace(/^@/, '')}`;
}

export function normalizeTikTok(input: string): { handle: string; url: string } {
  if (!input) return { handle: '', url: '' };
  const trimmed = input.trim();
  let handle = trimmed;
  if (handle.includes('tiktok.com/')) {
    handle = handle.split('tiktok.com/')[1].split('/')[0].split('?')[0];
  }
  handle = handle.replace(/^@/, '');
  return {
    handle: handle ? `@${handle}` : '',
    url: handle ? `https://www.tiktok.com/@${handle}` : '',
  };
}

export function normalizeYouTube(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  if (trimmed.startsWith('@')) return `https://youtube.com/${trimmed}`;
  return `https://youtube.com/@${trimmed}`;
}

/**
 * WhatsApp phone number normalizer for Brazil and international
 */
export function normalizeWhatsAppNumber(raw: string): string {
  if (!raw) return '';
  let digits = raw.replace(/\D/g, '');
  if (!digits) return '';

  // If user typed only DDD + 8 or 9 digits (e.g. 31999999999 or 11988887777)
  if (digits.length === 10 || digits.length === 11) {
    return '55' + digits;
  }
  // If user typed 0 + DDD + 8 or 9 digits
  if (digits.startsWith('0') && (digits.length === 11 || digits.length === 12)) {
    return '55' + digits.slice(1);
  }
  return digits;
}

/**
 * Format phone number nicely for display in input e.g. (31) 99999-9999
 */
export function formatPhoneDisplay(digitsOrRaw: string): string {
  const digits = digitsOrRaw.replace(/\D/g, '');
  if (!digits) return digitsOrRaw;
  let local = digits;
  if (digits.startsWith('55') && (digits.length === 12 || digits.length === 13)) {
    local = digits.slice(2);
  }
  if (local.length === 11) {
    return `(${local.slice(0, 2)}) ${local.slice(2, 7)}-${local.slice(7)}`;
  }
  if (local.length === 10) {
    return `(${local.slice(0, 2)}) ${local.slice(2, 6)}-${local.slice(6)}`;
  }
  return digitsOrRaw;
}

/**
 * Extract phone number and message from a wa.me or api.whatsapp.com URL
 */
export function parseWhatsAppUrl(url: string): { phone: string; message: string } {
  if (!url) return { phone: '', message: '' };
  try {
    const cleanUrl = url.trim();
    if (cleanUrl.includes('wa.me/')) {
      const parts = cleanUrl.split('wa.me/')[1];
      const [numPart, queryPart] = parts.split('?');
      let msg = '';
      if (queryPart) {
        const params = new URLSearchParams(queryPart);
        msg = params.get('text') || '';
      }
      return { phone: numPart || '', message: msg };
    }
    if (cleanUrl.includes('whatsapp.com/send')) {
      const urlObj = new URL(cleanUrl);
      const phone = urlObj.searchParams.get('phone') || '';
      const text = urlObj.searchParams.get('text') || '';
      return { phone, message: text };
    }
  } catch {
    // Return fallback
  }
  return { phone: url, message: '' };
}

/**
 * Suggests default opening message based on niche and company name
 */
export function getSuggestedWhatsAppMessage(nicheSlugOrName: string, companyName: string): string {
  const name = companyName.trim() || 'sua empresa';
  const niche = (nicheSlugOrName || '').toLowerCase();

  if (niche.includes('barbearia') || niche.includes('barber')) {
    return `Olá! Vim pelo site da ${name} e gostaria de agendar meu horário.`;
  }
  if (niche.includes('beleza') || niche.includes('estetica') || niche.includes('salao')) {
    return `Olá! Vim pelo site da ${name} e gostaria de agendar um atendimento.`;
  }
  if (niche.includes('gastronomia') || niche.includes('delivery') || niche.includes('restaurante')) {
    return `Olá! Vim pelo site da ${name} e gostaria de fazer um pedido / saber mais.`;
  }
  if (niche.includes('loja') || niche.includes('comercio')) {
    return `Olá! Vim pelo site da ${name} e gostaria de ver os produtos disponíveis.`;
  }
  if (niche.includes('academica') || niche.includes('formacao') || niche.includes('curso')) {
    return `Olá! Vim pelo site da ${name} e gostaria de informações sobre os cursos/formações.`;
  }
  if (niche.includes('servicos') || niche.includes('profissional')) {
    return `Olá! Vim pelo site da ${name} e gostaria de solicitar um orçamento.`;
  }
  if (niche.includes('premium')) {
    return `Olá! Vim pelo site da ${name} e gostaria de conhecer as soluções exclusivas.`;
  }
  if (niche.includes('chatbot') || niche.includes('bot')) {
    return `Olá! Vim pelo site da ${name} e gostaria de saber como funciona o atendimento automático.`;
  }
  if (niche.includes('saude') || niche.includes('bem-estar') || niche.includes('personal') || niche.includes('fitness')) {
    return `Olá! Vim pelo site da ${name} e gostaria de agendar uma consulta / saber mais.`;
  }
  if (niche.includes('portfolio') || niche.includes('criador') || niche.includes('artista')) {
    return `Olá! Vim pelo site da ${name} e adorei seu portfólio, gostaria de conversar sobre um projeto.`;
  }
  return `Olá! Vim pelo site da ${name} e gostaria de mais informações.`;
}

/**
 * Constructs clean https://wa.me/NUMERO?text=URL_ENCODED
 */
export function buildWhatsAppUrl(phone: string, message: string): string {
  const normalizedNum = normalizeWhatsAppNumber(phone);
  if (!normalizedNum) return '';
  if (!message.trim()) {
    return `https://wa.me/${normalizedNum}`;
  }
  return `https://wa.me/${normalizedNum}?text=${encodeURIComponent(message.trim())}`;
}

/**
 * Instagram normalizer: accepts @handle, handle, or full URL
 */
export function normalizeInstagram(input: string): { handle: string; url: string } {
  if (!input) return { handle: '', url: '' };
  const trimmed = input.trim();
  let cleanHandle = trimmed;
  if (cleanHandle.includes('instagram.com/')) {
    cleanHandle = cleanHandle.split('instagram.com/')[1].split('/')[0].split('?')[0];
  }
  cleanHandle = cleanHandle.replace(/^@/, '');
  return {
    handle: cleanHandle ? `@${cleanHandle}` : '',
    url: cleanHandle ? `https://instagram.com/${cleanHandle}` : '',
  };
}

/**
 * Injects visual click inspector script for the interactive "✦ EDITAR PELO PREVIEW" mode
 */
export function injectVisualInspectorScript(
  html: string,
  enableInspector: boolean
): string {
  const inspectorScript = `
  <script>
    (function() {
      // Bio Fácil Visual Inspector Bridge
      var isInspectorActive = ${enableInspector ? 'true' : 'false'};

      // Listen to commands from parent editor
      window.addEventListener('message', function(e) {
        if (!e.data) return;
        if (e.data.type === 'BIO_FACIL_SET_INSPECTOR') {
          isInspectorActive = !!e.data.enabled;
        } else if (e.data.type === 'BIO_FACIL_FOCUS_ELEMENT') {
          var fieldId = e.data.fieldId;
          if (!fieldId) return;
          var el = document.querySelector('[data-bio-text="' + fieldId + '"]') ||
                   document.querySelector('[data-bio-image="' + fieldId + '"]') ||
                   document.querySelector('[data-bio-link="' + fieldId + '"]') ||
                   document.getElementById(fieldId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            var prevOutline = el.style.outline;
            var prevBoxShadow = el.style.boxShadow;
            var prevTransition = el.style.transition;
            el.style.transition = 'all 0.3s ease';
            el.style.outline = '3px solid #a855f7';
            el.style.outlineOffset = '4px';
            el.style.boxShadow = '0 0 25px rgba(168, 85, 247, 0.6)';
            setTimeout(function() {
              el.style.outline = prevOutline;
              el.style.boxShadow = prevBoxShadow;
              el.style.transition = prevTransition;
            }, 1800);
          }
        }
      });

      // Hover glow when inspector is active
      var currentHoverEl = null;
      document.addEventListener('mouseover', function(e) {
        if (!isInspectorActive) return;
        var target = e.target.closest('[data-bio-text], [data-bio-image], [data-bio-link], a, button, img, h1, h2, h3, p');
        if (!target) return;
        if (currentHoverEl && currentHoverEl !== target) {
          currentHoverEl.style.outline = '';
        }
        currentHoverEl = target;
        target.style.outline = '2px dashed rgba(168, 85, 247, 0.6)';
        target.style.outlineOffset = '2px';
        target.style.cursor = 'pointer';
      }, true);

      document.addEventListener('mouseout', function(e) {
        if (currentHoverEl) {
          currentHoverEl.style.outline = '';
          currentHoverEl.style.cursor = '';
          currentHoverEl = null;
        }
      }, true);

      // Click to edit
      document.addEventListener('click', function(e) {
        if (!isInspectorActive) return;
        var target = e.target.closest('[data-bio-text], [data-bio-image], [data-bio-link], a, button, img, h1, h2, h3, p');
        if (!target) return;
        
        e.preventDefault();
        e.stopPropagation();

        var bioText = target.getAttribute('data-bio-text');
        var bioImage = target.getAttribute('data-bio-image');
        var bioLink = target.getAttribute('data-bio-link');

        var fieldId = bioText || bioImage || bioLink || '';
        var attr = (target.tagName.toLowerCase() === 'img') ? 'src' : (target.tagName.toLowerCase() === 'a' ? 'href' : 'text');
        var value = (attr === 'src') ? target.getAttribute('src') : (attr === 'href' ? target.getAttribute('href') : (target.textContent || '').trim());

        window.parent.postMessage({
          type: 'BIO_FACIL_ELEMENT_CLICKED',
          fieldId: fieldId,
          tagName: target.tagName.toLowerCase(),
          attr: attr,
          value: value
        }, '*');

        // Flash purple neon outline
        var prevOutline = target.style.outline;
        var prevShadow = target.style.boxShadow;
        target.style.outline = '3px solid #a855f7';
        target.style.outlineOffset = '3px';
        target.style.boxShadow = '0 0 20px rgba(168, 85, 247, 0.7)';
        setTimeout(function() {
          target.style.outline = prevOutline;
          target.style.boxShadow = prevShadow;
        }, 1200);
      }, true);
    })();
  </script>
  `;

  if (html.includes('</body>')) {
    return html.replace('</body>', `${inspectorScript}</body>`);
  }
  return html + inspectorScript;
}
