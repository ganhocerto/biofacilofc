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
    accent: string;
    text: string;
    muted: string;
    border: string;
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
      accent: '#f59e0b',
      text: '#ffffff',
      muted: '#9ca3af',
      border: 'rgba(255, 255, 255, 0.08)',
      glow: 'rgba(217, 119, 6, 0.35)',
    },
  },
  {
    id: 'black_gold',
    name: 'Preto + Dourado',
    colors: {
      bg: '#070707',
      surface: '#141316',
      primary: '#d4af37',
      secondary: '#f59e0b',
      accent: '#ffd700',
      text: '#ffffff',
      muted: '#a3a3a3',
      border: 'rgba(212, 175, 55, 0.25)',
      glow: 'rgba(212, 175, 55, 0.4)',
    },
  },
  {
    id: 'black_electric_blue',
    name: 'Preto + Azul Elétrico',
    colors: {
      bg: '#060814',
      surface: '#0e1224',
      primary: '#00d2ff',
      secondary: '#3a86ff',
      accent: '#38bdf8',
      text: '#ffffff',
      muted: '#94a3b8',
      border: 'rgba(0, 210, 255, 0.25)',
      glow: 'rgba(0, 210, 255, 0.45)',
    },
  },
  {
    id: 'black_red',
    name: 'Preto + Vermelho',
    colors: {
      bg: '#0a0505',
      surface: '#170b0b',
      primary: '#ef4444',
      secondary: '#dc2626',
      accent: '#f87171',
      text: '#ffffff',
      muted: '#a8a29e',
      border: 'rgba(239, 68, 68, 0.25)',
      glow: 'rgba(239, 68, 68, 0.4)',
    },
  },
  {
    id: 'black_neon_purple',
    name: 'Preto + Roxo Neon',
    colors: {
      bg: '#07050e',
      surface: '#120e24',
      primary: '#a855f7',
      secondary: '#c084fc',
      accent: '#e879f9',
      text: '#ffffff',
      muted: '#cbd5e1',
      border: 'rgba(168, 85, 247, 0.25)',
      glow: 'rgba(168, 85, 247, 0.4)',
    },
  },
  {
    id: 'white_black',
    name: 'Branco + Preto',
    colors: {
      bg: '#f8fafc',
      surface: '#ffffff',
      primary: '#0f172a',
      secondary: '#334155',
      accent: '#1e293b',
      text: '#0f172a',
      muted: '#64748b',
      border: 'rgba(15, 23, 42, 0.12)',
      glow: 'rgba(15, 23, 42, 0.12)',
    },
  },
  {
    id: 'green_premium',
    name: 'Verde Premium',
    colors: {
      bg: '#050a06',
      surface: '#0c180f',
      primary: '#10b981',
      secondary: '#059669',
      accent: '#34d399',
      text: '#ffffff',
      muted: '#a7f3d0',
      border: 'rgba(16, 185, 129, 0.25)',
      glow: 'rgba(16, 185, 129, 0.4)',
    },
  },
];

export const SOCIAL_SVGS: Record<string, string> = {
  whatsapp: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.54 1.83.822 2.796.822 3.18 0 5.767-2.586 5.768-5.766 0-3.18-2.587-5.768-5.768-5.768zm7.42 5.766c-.001 4.093-3.328 7.42-7.42 7.42-.001 0-.001 0 0 0-1.282 0-2.457-.333-3.528-.941l-4.148 1.088 1.107-4.043c-.694-1.121-1.066-2.42-1.066-3.754 0-4.092 3.327-7.419 7.42-7.419 4.092 0 7.419 3.327 7.419 7.42 0 0 0 0 0 0z"/></svg>`,
  instagram: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>`,
  facebook: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
  tiktok: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>`,
  youtube: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`
};

/**
 * Helper to convert HEX to RGB string "R, G, B" for rgba() use
 */
export function hexToRgb(hex: string): string {
  if (!hex) return '168, 85, 247';
  let c = hex.replace('#', '').trim();
  if (c.length === 3) c = c.split('').map((x) => x + x).join('');
  if (c.length !== 6) return '168, 85, 247';
  const num = parseInt(c, 16);
  if (isNaN(num)) return '168, 85, 247';
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `${r}, ${g}, ${b}`;
}

/**
 * Normalize any color format into standard 7-character #rrggbb hex for HTML5 color input
 */
export function normalizeToHex7(colorStr: string, fallback: string): string {
  if (!colorStr) return fallback;
  const trimmed = colorStr.trim();
  if (trimmed.startsWith('#')) {
    let c = trimmed.slice(1);
    if (c.length === 3) {
      c = c.split('').map((x) => x + x).join('');
      return `#${c.toLowerCase()}`;
    }
    if (c.length === 6) {
      return `#${c.toLowerCase()}`;
    }
    if (c.length === 8) {
      return `#${c.slice(0, 6).toLowerCase()}`;
    }
    return fallback;
  }
  const rgbMatch = trimmed.match(/rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (rgbMatch) {
    const r = Math.min(255, Math.max(0, parseInt(rgbMatch[1], 10)));
    const g = Math.min(255, Math.max(0, parseInt(rgbMatch[2], 10)));
    const b = Math.min(255, Math.max(0, parseInt(rgbMatch[3], 10)));
    const toHex = (n: number) => n.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }
  return fallback;
}

/**
 * Detect whether a background color is light or dark
 */
export function isLightColor(colorStr: string): boolean {
  const hex = normalizeToHex7(colorStr, '#000000');
  const c = hex.replace('#', '');
  if (c.length !== 6) return false;
  const r = parseInt(c.substr(0, 2), 16);
  const g = parseInt(c.substr(2, 2), 16);
  const b = parseInt(c.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6;
}

export interface ExtractedThemeInfo {
  originalColors: {
    bg: string;
    surface: string;
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    muted: string;
    border: string;
    glow: string;
  };
  cssVariables: string[];
}

/**
 * Inspect an HTML template to extract its declared CSS variables and original color scheme
 */
export function extractThemeInfoFromHtml(html: string): ExtractedThemeInfo {
  const cssVariables: string[] = [];
  const varMap: Record<string, string> = {};

  // Standard high-fidelity defaults
  let bg = '#08080c';
  let surface = '#12111a';
  let primary = '#d97706';
  let secondary = '#9333ea';
  let accent = '#f59e0b';
  let text = '#ffffff';
  let muted = '#9ca3af';
  let border = 'rgba(255, 255, 255, 0.08)';
  let glow = 'rgba(217, 119, 6, 0.35)';

  if (!html) {
    return {
      originalColors: { bg, surface, primary, secondary, accent, text, muted, border, glow },
      cssVariables: [],
    };
  }

  // 1. Scan for CSS variables in all style blocks and :root declarations
  const varRegex = /(--[a-zA-Z0-9_-]+)\s*:\s*([^;}\n]+)/g;
  let match;
  while ((match = varRegex.exec(html)) !== null) {
    const varName = match[1].trim();
    const varVal = match[2].trim();
    if (!cssVariables.includes(varName)) {
      cssVariables.push(varName);
    }
    varMap[varName.toLowerCase()] = varVal;
  }

  // Check CSS variables for known color roles
  for (const [name, val] of Object.entries(varMap)) {
    const isColor = val.startsWith('#') || val.startsWith('rgb') || val.startsWith('hsl');
    if (!isColor) continue;

    if (
      name.includes('primary') ||
      name.includes('gold') ||
      name.includes('brand') ||
      name.includes('destaque') ||
      name === '--cor-1' ||
      name === '--main-color'
    ) {
      primary = normalizeToHex7(val, primary);
    } else if (name.includes('secondary') || name.includes('secundaria') || name === '--cor-2') {
      secondary = normalizeToHex7(val, secondary);
    } else if (name.includes('accent')) {
      accent = normalizeToHex7(val, accent);
    } else if (name.includes('bg') || name.includes('background') || name.includes('fundo')) {
      bg = normalizeToHex7(val, bg);
    } else if (name.includes('surface') || name.includes('card') || name.includes('box') || name.includes('panel')) {
      surface = normalizeToHex7(val, surface);
    } else if (name.includes('text') || name.includes('texto') || name.includes('foreground')) {
      text = normalizeToHex7(val, text);
    } else if (name.includes('muted') || name.includes('sub') || name.includes('gray')) {
      muted = normalizeToHex7(val, muted);
    } else if (name.includes('border') || name.includes('borda')) {
      border = val;
    } else if (name.includes('glow') || name.includes('shadow')) {
      glow = val;
    }
  }

  // 2. Scan style tags for direct CSS rules if variables were not defined
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const styles = Array.from(doc.querySelectorAll('style'))
      .map((s) => s.textContent || '')
      .join('\n');

    // Check body background
    const bodyBgMatch = styles.match(/body\s*\{[^}]*?background(?:-color)?\s*:\s*([^;}\n]+)/i);
    if (bodyBgMatch && (bodyBgMatch[1].startsWith('#') || bodyBgMatch[1].startsWith('rgb'))) {
      bg = normalizeToHex7(bodyBgMatch[1], bg);
    }

    // Check body text color
    const bodyColorMatch = styles.match(/body\s*\{[^}]*?color\s*:\s*([^;}\n]+)/i);
    if (bodyColorMatch && (bodyColorMatch[1].startsWith('#') || bodyColorMatch[1].startsWith('rgb'))) {
      text = normalizeToHex7(bodyColorMatch[1], text);
    }

    // Check primary button background
    const btnMatch = styles.match(
      /(?:\.btn|button|\.cta|\.btn-primary)\s*\{[^}]*?background(?:-color)?\s*:\s*([^;}\n]+)/i
    );
    if (btnMatch && (btnMatch[1].startsWith('#') || btnMatch[1].startsWith('rgb'))) {
      primary = normalizeToHex7(btnMatch[1], primary);
    }

    // Check card background
    const cardMatch = styles.match(
      /(?:\.card|\.box|\.item|\.specialty-card)\s*\{[^}]*?background(?:-color)?\s*:\s*([^;}\n]+)/i
    );
    if (cardMatch && (cardMatch[1].startsWith('#') || cardMatch[1].startsWith('rgb'))) {
      surface = normalizeToHex7(cardMatch[1], surface);
    }
  } catch {
    // Ignore DOM parsing errors
  }

  // Derive glow and accent if needed
  const primaryRgb = hexToRgb(primary);
  if (!glow || glow.includes('217, 119, 6')) {
    glow = `rgba(${primaryRgb}, 0.35)`;
  }
  if (!accent) {
    accent = primary;
  }

  return {
    originalColors: {
      bg,
      surface,
      primary,
      secondary,
      accent,
      text,
      muted,
      border,
      glow,
    },
    cssVariables,
  };
}

/**
 * Universal Theme CSS Generator
 * Generates both CSS variable overrides and smart universal element selectors
 * so ready palettes and custom colors work flawlessly on ANY biosite HTML (including pasted/imported HTML)
 */
export function generateThemeCss(
  colors?: Record<string, string>,
  iconStyle: IconStyleType = 'original',
  logoConfig?: LogoConfig,
  isOriginal: boolean = false,
  extraCssProps: string[] = []
): string {
  // 1. Icon Styles
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

  // 2. Logo Size Config
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

  // When "Original do Modelo" is active, DO NOT override colors!
  // This allows the imported HTML's native design and colors to render 100% authentically.
  if (isOriginal) {
    return `${iconCss}\n${logoSizeCss}`;
  }

  const bg = colors?.['bg'] || '#08080c';
  const surface = colors?.['surface'] || '#12111a';
  const primary = colors?.['primary'] || '#d97706';
  const secondary = colors?.['secondary'] || '#9333ea';
  const accent = colors?.['accent'] || primary;
  const text = colors?.['text'] || '#ffffff';
  const muted = colors?.['muted'] || '#9ca3af';
  const border = colors?.['border'] || (isLightColor(bg) ? 'rgba(15, 23, 42, 0.12)' : 'rgba(255, 255, 255, 0.1)');
  const glow = colors?.['glow'] || `rgba(${hexToRgb(primary)}, 0.4)`;

  const primaryRgb = hexToRgb(primary);
  const secondaryRgb = hexToRgb(secondary);
  const surfaceRgb = hexToRgb(surface);
  const bgRgb = hexToRgb(bg);
  const isLight = isLightColor(bg);

  // Map extra detected variable names from the imported HTML
  const customVariablesMapping = (extraCssProps || [])
    .map((prop) => {
      const p = prop.toLowerCase();
      let val = primary;
      if (p.includes('bg') || p.includes('fundo') || p.includes('background')) val = bg;
      else if (p.includes('surface') || p.includes('card') || p.includes('box') || p.includes('panel')) val = surface;
      else if (p.includes('text') || p.includes('texto') || p.includes('foreground')) val = text;
      else if (p.includes('muted') || p.includes('secondary-text')) val = muted;
      else if (p.includes('secondary') || p.includes('secundaria')) val = secondary;
      else if (p.includes('border') || p.includes('borda')) val = border;
      else if (p.includes('glow') || p.includes('shadow')) val = glow;
      return `${prop}: ${val} !important;`;
    })
    .join('\n    ');

  return `
    :root {
      /* Bio Fácil Core Tokens */
      --bio-bg: ${bg};
      --bio-surface: ${surface};
      --bio-primary: ${primary};
      --bio-secondary: ${secondary};
      --bio-accent: ${accent};
      --bio-text: ${text};
      --bio-muted: ${muted};
      --bio-border: ${border};
      --bio-glow: ${glow};
      --bio-primary-rgb: ${primaryRgb};
      --bio-secondary-rgb: ${secondaryRgb};
      --bio-surface-rgb: ${surfaceRgb};
      --bio-bg-rgb: ${bgRgb};

      /* Universal Template CSS Variables */
      --primary: ${primary};
      --primary-color: ${primary};
      --color-primary: ${primary};
      --theme-primary: ${primary};
      --brand-primary: ${primary};
      --main-color: ${primary};
      --brand: ${primary};
      --accent: ${accent};
      --accent-color: ${accent};
      --color-accent: ${accent};
      --gold: ${primary};
      --highlight: ${primary};
      --cor-primaria: ${primary};
      --cor-destaque: ${primary};

      --secondary: ${secondary};
      --secondary-color: ${secondary};
      --color-secondary: ${secondary};
      --theme-secondary: ${secondary};
      --cor-secundaria: ${secondary};

      --bg: ${bg};
      --bg-color: ${bg};
      --background: ${bg};
      --background-color: ${bg};
      --color-bg: ${bg};
      --color-background: ${bg};
      --body-bg: ${bg};
      --main-bg: ${bg};
      --cor-fundo: ${bg};

      --surface: ${surface};
      --surface-color: ${surface};
      --card: ${surface};
      --card-bg: ${surface};
      --card-background: ${surface};
      --box-bg: ${surface};
      --panel-bg: ${surface};
      --cor-card: ${surface};

      --text: ${text};
      --text-color: ${text};
      --color-text: ${text};
      --foreground: ${text};
      --color-foreground: ${text};
      --cor-texto: ${text};

      --muted: ${muted};
      --muted-color: ${muted};
      --text-muted: ${muted};
      --color-muted: ${muted};
      --secondary-text: ${muted};

      --border: ${border};
      --border-color: ${border};
      --card-border: ${border};

      --glow: ${glow};
      --shadow-color: ${glow};

      ${customVariablesMapping}
    }

    /* 1. Universal Background */
    html, body {
      background-color: var(--bio-bg) !important;
      color: var(--bio-text) !important;
    }
    .page-wrapper, .site-wrapper, .wrapper, .main, #main, #root, #app, .app, 
    .container-main, .bio-container, .biosite-container, .content-wrapper,
    [class*="page-container"], [class*="site-container"], [class*="container-fluid"] {
      background-color: var(--bio-bg) !important;
    }

    /* 2. Text & Headings */
    .muted, .text-muted, [class*="muted"], .subtitle, .subtitulo, .description, .bio, p.bio {
      color: var(--bio-muted) !important;
    }
    .headline, .section-header, .company-name-accent, [class*="highlight"], [class*="accent"],
    .featured-text, .destaque, .specialty-price, .price, [class*="price"], .rating-stars, [class*="star"] svg {
      color: var(--bio-primary) !important;
    }
    .section-header span, .headline span, .badge, [class*="badge"], .tag, [class*="tag"] {
      background: rgba(var(--bio-primary-rgb), 0.15) !important;
      color: var(--bio-primary) !important;
      border-color: rgba(var(--bio-primary-rgb), 0.3) !important;
    }
    [class*="gradient-text"], [class*="text-gradient"] {
      background: linear-gradient(135deg, var(--bio-primary), var(--bio-secondary)) !important;
      -webkit-background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
    }

    /* 3. Surface, Cards & Lists */
    .card, [class*="card"], [class*="card-"], [class*="-card"],
    .specialty-card, .info-card, .service-item, .price-card, .product-card,
    .item-card, .box, [class*="box-"], .panel, [class*="panel-"],
    .link-card, .links a:not([class*="btn"]):not([class*="button"]), .menu-item, .testimonial-card,
    [class*="review-card"], [class*="service-card"] {
      background-color: var(--bio-surface) !important;
      border-color: var(--bio-border) !important;
    }

    /* 4. Action Buttons & CTAs */
    .btn-primary, .cta-main, .cta, [class*="cta-btn"], [class*="btn-primary"], [class*="btn_primary"],
    button.primary, a.cta, .primary-button, .action-btn, [class*="action-button"],
    .link-button, .custom-button, .botao-principal, .btn-main, .cta-btn,
    button:not([class*="close"]):not([class*="tab"]):not([class*="toggle"]):not([class*="secondary"]):not(.social-btn),
    .btn:not([class*="secondary"]):not([class*="outline"]):not([class*="ghost"]) {
      background: linear-gradient(135deg, var(--bio-primary), var(--bio-secondary)) !important;
      color: ${isLight ? '#0f172a' : '#ffffff'} !important;
      border-color: var(--bio-primary) !important;
      box-shadow: 0 8px 25px -4px var(--bio-glow) !important;
    }

    /* 5. Outlined Buttons & Secondary Links */
    .btn-secondary, [class*="btn-secondary"], [class*="outline"], [class*="btn-outline"] {
      border-color: var(--bio-primary) !important;
      color: var(--bio-primary) !important;
      background: transparent !important;
    }

    /* 6. Glowing borders & effects */
    [class*="glow"], .glow-effect {
      box-shadow: 0 0 25px var(--bio-glow) !important;
    }
    hr, .divider, [class*="divider"] {
      border-color: var(--bio-border) !important;
    }

    /* 7. Built-in template logo & accents */
    .logo-wrapper {
      background: linear-gradient(135deg, var(--bio-primary), var(--bio-secondary), var(--bio-primary)) !important;
      box-shadow: 0 8px 30px var(--bio-glow) !important;
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
 * Compiles a customized biosite by injecting client-customized values, theme styles, icon styles, and socials.
 * Single source of truth: ensures all changes (WhatsApp on all buttons, Logo on all logo elements,
 * texts, images, social networks, and theme overrides) are thoroughly and reliably persisted.
 */
export function compileBiositeHtml(
  templateHtml: string,
  fields: EditableField[],
  customValues: Record<string, string>,
  options?: {
    customColors?: Record<string, string>;
    selectedPalette?: string;
    iconStyle?: IconStyleType;
    socialsConfig?: Record<string, SocialItemConfig>;
    logoConfig?: LogoConfig;
    detectedProps?: string[];
  }
): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(templateHtml, 'text/html');

  // 1. Comprehensive WhatsApp update across ALL matching links in the entire document
  const whatsappUrl = customValues['whatsapp'] || options?.socialsConfig?.['whatsapp']?.url;
  if (whatsappUrl) {
    const waLinks = doc.querySelectorAll(
      'a[href*="wa.me"], a[href*="whatsapp"], a[href*="api.whatsapp.com"], [data-bio-link="whatsapp"]'
    );
    waLinks.forEach((link) => {
      link.setAttribute('href', whatsappUrl);
    });
  }

  // 2. Comprehensive Logo update across ALL matching logo images in the document
  const logoSrc = customValues['logo'] || customValues['logo_principal'];
  if (logoSrc) {
    const logoImgs = doc.querySelectorAll(
      'img[data-bio-image="logo"], img[data-bio-image="logo_principal"], .logo img, [class*="logo"] img, img[alt*="logo" i]'
    );
    logoImgs.forEach((img) => {
      img.setAttribute('src', logoSrc);
      if (img.hasAttribute('srcset')) img.removeAttribute('srcset');
    });
  }

  // 3. Comprehensive Instagram update across all matching links
  const instaUrl = customValues['instagram'] || options?.socialsConfig?.['instagram']?.url;
  if (instaUrl) {
    const instaLinks = doc.querySelectorAll('a[href*="instagram.com"], [data-bio-link="instagram"]');
    instaLinks.forEach((link) => {
      link.setAttribute('href', instaUrl);
    });
  }

  // 4. Comprehensive Facebook update
  const fbUrl = customValues['facebook'] || options?.socialsConfig?.['facebook']?.url;
  if (fbUrl) {
    const fbLinks = doc.querySelectorAll('a[href*="facebook.com"], a[href*="fb.com"], [data-bio-link="facebook"]');
    fbLinks.forEach((link) => {
      link.setAttribute('href', fbUrl);
    });
  }

  // 5. Comprehensive TikTok update
  const tiktokUrl = customValues['tiktok'] || options?.socialsConfig?.['tiktok']?.url;
  if (tiktokUrl) {
    const tiktokLinks = doc.querySelectorAll('a[href*="tiktok.com"], [data-bio-link="tiktok"]');
    tiktokLinks.forEach((link) => {
      link.setAttribute('href', tiktokUrl);
    });
  }

  // 6. Comprehensive YouTube update
  const ytUrl = customValues['youtube'] || options?.socialsConfig?.['youtube']?.url;
  if (ytUrl) {
    const ytLinks = doc.querySelectorAll('a[href*="youtube.com"], a[href*="youtu.be"], [data-bio-link="youtube"]');
    ytLinks.forEach((link) => {
      link.setAttribute('href', ytUrl);
    });
  }

  // 7. Comprehensive Google Maps update
  const mapsUrl = customValues['maps'] || customValues['google_maps'];
  if (mapsUrl) {
    const mapsLinks = doc.querySelectorAll(
      'a[href*="maps.google"], a[href*="goo.gl/maps"], a[href*="google.com/maps"], [data-bio-link="maps"], [data-bio-link="google_maps"]'
    );
    mapsLinks.forEach((link) => {
      link.setAttribute('href', mapsUrl);
    });
  }

  // 8. Update specific custom values by ID, data-bio-eid, data-bio-*, selector or id
  Object.entries(customValues).forEach(([key, val]) => {
    if (val === undefined || val === null || val === '') return;
    // Skip general network keys already comprehensively processed
    if (['whatsapp', 'logo', 'instagram', 'facebook', 'tiktok', 'youtube', 'maps'].includes(key)) return;

    // Search by data-bio-eid
    const eidEls = doc.querySelectorAll(`[data-bio-eid="${key}"]`);
    if (eidEls.length > 0) {
      eidEls.forEach((el) => {
        if (el.tagName === 'IMG') {
          el.setAttribute('src', val);
          if (el.hasAttribute('srcset')) el.removeAttribute('srcset');
        } else if (el.tagName === 'A') {
          el.setAttribute('href', val);
        } else {
          el.textContent = val;
        }
      });
      return;
    }

    // Search by data-bio-text
    const textEls = doc.querySelectorAll(`[data-bio-text="${key}"]`);
    if (textEls.length > 0) {
      textEls.forEach((el) => {
        el.textContent = val;
      });
      return;
    }

    // Search by data-bio-image
    const imgEls = doc.querySelectorAll(`[data-bio-image="${key}"]`);
    if (imgEls.length > 0) {
      imgEls.forEach((el) => {
        el.setAttribute('src', val);
        if (el.hasAttribute('srcset')) el.removeAttribute('srcset');
      });
      return;
    }

    // Search by data-bio-link
    const linkEls = doc.querySelectorAll(`[data-bio-link="${key}"]`);
    if (linkEls.length > 0) {
      linkEls.forEach((el) => {
        el.setAttribute('href', val);
      });
      return;
    }

    // Search by element id
    const byId = doc.getElementById(key);
    if (byId) {
      if (byId.tagName === 'IMG') {
        byId.setAttribute('src', val);
        if (byId.hasAttribute('srcset')) byId.removeAttribute('srcset');
      } else if (byId.tagName === 'A') {
        byId.setAttribute('href', val);
      } else {
        byId.textContent = val;
      }
      return;
    }

    // Search by field definition selector
    const field = fields.find((f) => f.id === key);
    if (field?.selector) {
      const matchEls = doc.querySelectorAll(field.selector);
      matchEls.forEach((el) => {
        if (field.attr === 'src' || el.tagName === 'IMG') {
          el.setAttribute('src', val);
          if (el.hasAttribute('srcset')) el.removeAttribute('srcset');
        } else if (field.attr === 'href' || el.tagName === 'A') {
          el.setAttribute('href', val);
        } else {
          el.textContent = val;
        }
      });
    }
  });

  // 9. Configure Social Networks (visibility, URLs, and dynamically adding Facebook/TikTok/YouTube)
  if (options?.socialsConfig) {
    const socialBar = doc.querySelector('.social-bar') || doc.querySelector('[data-bio-social-bar]');

    Object.entries(options.socialsConfig).forEach(([key, config]) => {
      let socialLink = doc.querySelector(`[data-bio-link="${key}"]`);

      if (!config.enabled) {
        if (socialLink) {
          socialLink.remove();
        }
      } else {
        if (socialLink) {
          if (config.url) {
            socialLink.setAttribute('href', config.url);
          }
        } else if (socialBar && config.url && SOCIAL_SVGS[key]) {
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

  // 10. Inject Theme CSS (Colors, Palettes, Icon Styles, Logo Dimensions)
  const isOriginal = options?.selectedPalette === 'original';
  const detectedTheme = extractThemeInfoFromHtml(templateHtml);
  const extraProps = options?.detectedProps || detectedTheme.cssVariables;

  const themeCss = generateThemeCss(
    options?.customColors,
    options?.iconStyle || 'original',
    options?.logoConfig,
    isOriginal,
    extraProps
  );

  let styleTag =
    (doc.getElementById('biofacil-theme-override') as HTMLStyleElement) ||
    (doc.getElementById('bio-custom-theme') as HTMLStyleElement);

  if (!styleTag) {
    styleTag = doc.createElement('style');
    styleTag.setAttribute('id', 'biofacil-theme-override');
    if (doc.head) {
      doc.head.appendChild(styleTag);
    } else if (doc.body) {
      doc.body.insertBefore(styleTag, doc.body.firstChild);
    }
  } else {
    styleTag.setAttribute('id', 'biofacil-theme-override');
  }
  styleTag.textContent = themeCss;

  if (options?.customColors?.['bg'] && !isOriginal && doc.body) {
    doc.body.style.setProperty('background-color', options.customColors['bg'], 'important');
    doc.body.style.setProperty('color', options.customColors['text'] || '#ffffff', 'important');
  }

  // 11. Clean up any temporary visual inspector artifacts from exported HTML
  const inspectorScript = doc.getElementById('biofacil-inspector-script');
  if (inspectorScript) inspectorScript.remove();

  const allElements = doc.querySelectorAll('*');
  allElements.forEach((el) => {
    // Remove editor-only outline/box-shadow style if present
    const inlineStyle = el.getAttribute('style') || '';
    if (inlineStyle.includes('outline') || inlineStyle.includes('box-shadow')) {
      const cleaned = inlineStyle
        .replace(/outline:[^;]+;?/gi, '')
        .replace(/box-shadow:[^;]+;?/gi, '')
        .trim();
      if (cleaned) {
        el.setAttribute('style', cleaned);
      } else {
        el.removeAttribute('style');
      }
    }
  });

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
  <script id="biofacil-inspector-script">
    (function() {
      // Bio Fácil Visual Inspector & Two-Way Interactive DOM Bridge
      var isInspectorActive = ${enableInspector ? 'true' : 'false'};
      var currentSelectedEl = null;
      var currentHoverEl = null;

      // Assign stable IDs on load to content elements that lack data-bio-*
      function stampStableIds() {
        var elements = document.querySelectorAll('img, a, button, h1, h2, h3, h4, h5, h6, p, span, li');
        var counter = 0;
        elements.forEach(function(el) {
          if (!el.getAttribute('data-bio-text') && 
              !el.getAttribute('data-bio-image') && 
              !el.getAttribute('data-bio-link') && 
              !el.getAttribute('data-bio-eid')) {
            counter++;
            el.setAttribute('data-bio-eid', 'bio_el_' + counter);
          }
        });
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', stampStableIds);
      } else {
        stampStableIds();
      }

      // Helper to determine semantic type
      function detectSemantic(el) {
        var anchor = el.closest('a');
        if (anchor) {
          var href = (anchor.getAttribute('href') || '').toLowerCase();
          if (href.includes('wa.me') || href.includes('whatsapp') || href.includes('api.whatsapp.com')) return { type: 'whatsapp', node: anchor };
          if (href.includes('instagram.com')) return { type: 'instagram', node: anchor };
          if (href.includes('facebook.com') || href.includes('fb.com')) return { type: 'facebook', node: anchor };
          if (href.includes('tiktok.com')) return { type: 'tiktok', node: anchor };
          if (href.includes('youtube.com') || href.includes('youtu.be')) return { type: 'youtube', node: anchor };
          if (href.includes('maps.google') || href.includes('goo.gl/maps') || href.includes('google.com/maps')) return { type: 'maps', node: anchor };
          if (href.startsWith('tel:')) return { type: 'phone', node: anchor };
          if (href.startsWith('mailto:')) return { type: 'email', node: anchor };
          return { type: 'button', node: anchor };
        }

        var tag = el.tagName.toLowerCase();
        if (tag === 'img') {
          var cls = (el.className || '').toLowerCase();
          var alt = (el.alt || '').toLowerCase();
          var id = (el.id || '').toLowerCase();
          var bioImg = (el.getAttribute('data-bio-image') || '').toLowerCase();
          var isLogo = bioImg.includes('logo') || cls.includes('logo') || alt.includes('logo') || id.includes('logo') || !!el.closest('.logo, header, [class*="logo"]');
          return { type: isLogo ? 'logo' : 'image', node: el };
        }

        if (tag === 'button') return { type: 'button', node: el };
        if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) return { type: 'title', node: el };
        return { type: 'text', node: el };
      }

      // Helper to parse WhatsApp info from URL
      function extractWaInfo(url) {
        var phone = '';
        var message = '';
        if (!url) return { phone: phone, message: message };
        try {
          var clean = url.trim();
          if (clean.includes('wa.me/')) {
            var parts = clean.split('wa.me/')[1] || '';
            var splitQ = parts.split('?');
            phone = splitQ[0] ? splitQ[0].replace(/\\D/g, '') : '';
            if (splitQ[1]) {
              var params = new URLSearchParams(splitQ[1]);
              message = params.get('text') || '';
            }
          } else if (clean.includes('whatsapp.com/send')) {
            var q = clean.split('?')[1] || '';
            var p = new URLSearchParams(q);
            phone = (p.get('phone') || '').replace(/\\D/g, '');
            message = p.get('text') || '';
          }
        } catch(e) {}
        return { phone: phone, message: message };
      }

      // Listen to commands from parent editor
      window.addEventListener('message', function(e) {
        if (!e.data) return;
        var data = e.data;

        if (data.type === 'BIO_FACIL_SET_INSPECTOR') {
          isInspectorActive = !!data.enabled;
          if (!isInspectorActive && currentSelectedEl) {
            currentSelectedEl.style.outline = '';
            currentSelectedEl.style.outlineOffset = '';
            currentSelectedEl = null;
          }
        } else if (data.type === 'BIO_FACIL_DESELECT') {
          if (currentSelectedEl) {
            currentSelectedEl.style.outline = '';
            currentSelectedEl.style.outlineOffset = '';
            currentSelectedEl = null;
          }
        } else if (data.type === 'BIO_FACIL_UPDATE_DOM_ELEMENT') {
          var semType = data.semanticType;
          var eid = data.elementId;
          var val = data.value;
          var attr = data.attr;

          // Immediate universal update for WhatsApp links
          if (semType === 'whatsapp' || eid === 'whatsapp') {
            var waEls = document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"], a[href*="api.whatsapp.com"], [data-bio-link="whatsapp"]');
            waEls.forEach(function(l) { l.setAttribute('href', val); });
          } else if (semType === 'instagram' || eid === 'instagram') {
            var inEls = document.querySelectorAll('a[href*="instagram.com"], [data-bio-link="instagram"]');
            inEls.forEach(function(l) { l.setAttribute('href', val); });
          } else if (semType === 'logo' || eid === 'logo') {
            var logoImgs = document.querySelectorAll('img[data-bio-image="logo"], img[data-bio-image="logo_principal"], .logo img, [class*="logo"] img, img[alt*="logo" i]');
            if (logoImgs.length > 0) {
              logoImgs.forEach(function(img) {
                img.setAttribute('src', val);
                if (img.hasAttribute('srcset')) img.removeAttribute('srcset');
              });
            } else if (eid) {
              var specificLogo = document.querySelector('[data-bio-eid="' + eid + '"]') || document.getElementById(eid);
              if (specificLogo) specificLogo.setAttribute('src', val);
            }
          } else if (eid) {
            var matchEl = document.querySelector('[data-bio-eid="' + eid + '"]') ||
                          document.querySelector('[data-bio-text="' + eid + '"]') ||
                          document.querySelector('[data-bio-image="' + eid + '"]') ||
                          document.querySelector('[data-bio-link="' + eid + '"]') ||
                          document.getElementById(eid);
            if (matchEl) {
              if (attr === 'src' || matchEl.tagName.toLowerCase() === 'img') {
                matchEl.setAttribute('src', val);
                if (matchEl.hasAttribute('srcset')) matchEl.removeAttribute('srcset');
              } else if (attr === 'href' || matchEl.tagName.toLowerCase() === 'a') {
                matchEl.setAttribute('href', val);
              } else {
                matchEl.textContent = val;
              }
            }
          }
        } else if (data.type === 'BIO_FACIL_FOCUS_ELEMENT') {
          var targetId = data.fieldId || data.elementId;
          if (!targetId) return;
          var el = document.querySelector('[data-bio-eid="' + targetId + '"]') ||
                   document.querySelector('[data-bio-text="' + targetId + '"]') ||
                   document.querySelector('[data-bio-image="' + targetId + '"]') ||
                   document.querySelector('[data-bio-link="' + targetId + '"]') ||
                   document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            if (currentSelectedEl && currentSelectedEl !== el) {
              currentSelectedEl.style.outline = '';
              currentSelectedEl.style.outlineOffset = '';
            }
            currentSelectedEl = el;
            el.style.outline = '2px solid #a855f7';
            el.style.outlineOffset = '3px';
          }
        }
      });

      // Hover outline when inspector is active
      document.addEventListener('mouseover', function(e) {
        if (!isInspectorActive) return;
        var target = e.target.closest('[data-bio-text], [data-bio-image], [data-bio-link], [data-bio-eid], a, button, img, h1, h2, h3, h4, h5, h6, p, span');
        if (!target || target === currentSelectedEl) return;
        if (currentHoverEl && currentHoverEl !== target && currentHoverEl !== currentSelectedEl) {
          currentHoverEl.style.outline = '';
          currentHoverEl.style.outlineOffset = '';
        }
        currentHoverEl = target;
        target.style.outline = '2px dashed rgba(168, 85, 247, 0.6)';
        target.style.outlineOffset = '2px';
        target.style.cursor = 'pointer';
      }, true);

      document.addEventListener('mouseout', function(e) {
        if (currentHoverEl && currentHoverEl !== currentSelectedEl) {
          currentHoverEl.style.outline = '';
          currentHoverEl.style.outlineOffset = '';
          currentHoverEl.style.cursor = '';
          currentHoverEl = null;
        }
      }, true);

      // Click to select and edit
      document.addEventListener('click', function(e) {
        if (!isInspectorActive) return;
        var clickedNode = e.target.closest('[data-bio-text], [data-bio-image], [data-bio-link], [data-bio-eid], a, button, img, h1, h2, h3, h4, h5, h6, p, span');
        if (!clickedNode) return;
        
        e.preventDefault();
        e.stopPropagation();

        var sem = detectSemantic(clickedNode);
        var target = sem.node;

        if (currentSelectedEl && currentSelectedEl !== target) {
          currentSelectedEl.style.outline = '';
          currentSelectedEl.style.outlineOffset = '';
        }
        currentSelectedEl = target;
        target.style.outline = '2px solid #a855f7';
        target.style.outlineOffset = '3px';

        var bioText = target.getAttribute('data-bio-text');
        var bioImage = target.getAttribute('data-bio-image');
        var bioLink = target.getAttribute('data-bio-link');
        var bioEid = target.getAttribute('data-bio-eid');
        if (!bioEid) {
          bioEid = 'bio_el_' + Math.random().toString(36).substr(2, 6);
          target.setAttribute('data-bio-eid', bioEid);
        }

        var fieldId = bioText || bioImage || bioLink || '';
        var elementId = fieldId || bioEid;
        var tag = target.tagName.toLowerCase();
        var attr = (tag === 'img') ? 'src' : (tag === 'a' ? 'href' : 'text');
        var value = (attr === 'src') ? target.getAttribute('src') : (attr === 'href' ? target.getAttribute('href') : (target.textContent || '').trim());
        var href = target.getAttribute('href') || '';
        var waInfo = sem.type === 'whatsapp' ? extractWaInfo(href) : { phone: '', message: '' };

        window.parent.postMessage({
          type: 'BIO_FACIL_ELEMENT_CLICKED',
          fieldId: fieldId,
          elementId: elementId,
          bioEid: bioEid,
          semanticType: sem.type,
          tagName: tag,
          attr: attr,
          value: value,
          text: (target.textContent || '').trim(),
          src: target.getAttribute('src') || '',
          href: href,
          phone: waInfo.phone,
          message: waInfo.message
        }, '*');
      }, true);
    })();
  </script>
  `;

  if (html.includes('</body>')) {
    return html.replace('</body>', `${inspectorScript}</body>`);
  }
  return html + inspectorScript;
}
