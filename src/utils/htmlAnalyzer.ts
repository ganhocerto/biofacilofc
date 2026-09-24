import { EditableField, FieldType } from '../types';

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
 * Compiles a customized biosite by injecting client-customized values into the template HTML
 */
export function compileBiositeHtml(
  templateHtml: string,
  fields: EditableField[],
  customValues: Record<string, string>
): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(templateHtml, 'text/html');

  fields.forEach(field => {
    const val = customValues[field.id];
    if (val === undefined || val === null || val === '') return;

    // Try finding by data-bio attribute first
    let element: Element | null = null;
    if (field.attr === 'src') {
      element = doc.querySelector(`[data-bio-image="${field.id}"]`) || (field.selector ? doc.querySelector(field.selector) : null);
      if (element) {
        element.setAttribute('src', val);
      }
    } else if (field.attr === 'href') {
      element = doc.querySelector(`[data-bio-link="${field.id}"]`) || (field.selector ? doc.querySelector(field.selector) : null);
      if (element) {
        element.setAttribute('href', val);
      }
    } else {
      element = doc.querySelector(`[data-bio-text="${field.id}"]`) || (field.selector ? doc.querySelector(field.selector) : null);
      if (element) {
        element.textContent = val;
      }
    }
  });

  return '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
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
  if (niche.includes('restaurante') || niche.includes('gastronomia') || niche.includes('hamburgueria')) {
    return `Olá! Vim pelo site da ${name} e gostaria de fazer um pedido / saber mais.`;
  }
  if (niche.includes('personal') || niche.includes('fitness') || niche.includes('treino')) {
    return `Olá! Vim pelo site da ${name} e gostaria de saber mais sobre os treinos.`;
  }
  if (niche.includes('imoveis') || niche.includes('corretor')) {
    return `Olá! Vim pelo site da ${name} e gostaria de mais informações.`;
  }
  if (niche.includes('mecanica') || niche.includes('automotivo') || niche.includes('oficina')) {
    return `Olá! Vim pelo site da ${name} e gostaria de solicitar um atendimento.`;
  }
  if (niche.includes('estetica') || niche.includes('beleza') || niche.includes('salao')) {
    return `Olá! Vim pelo site da ${name} e gostaria de agendar um atendimento.`;
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
