import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  BiositeTemplate,
  EditableField,
  UserProject,
  IconStyleType,
  SocialItemConfig,
  LogoConfig,
} from '../types';
import {
  compileBiositeHtml,
  injectVisualInspectorScript,
  formatPhoneDisplay,
  parseWhatsAppUrl,
  getSuggestedWhatsAppMessage,
  buildWhatsAppUrl,
  normalizeInstagram,
  normalizeFacebook,
  normalizeTikTok,
  normalizeYouTube,
  READY_PALETTES,
  generateThemeCss,
  extractThemeInfoFromHtml,
  normalizeToHex7,
  SOCIAL_SVGS,
} from '../utils/htmlAnalyzer';
import { processImageBackground } from '../utils/imageProcess';
import { downloadBiositeZip } from '../utils/zipManager';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { WhatsAppIcon, InstagramIcon } from './Icons';
import {
  ArrowLeft,
  Save,
  Download,
  Copy,
  Check,
  Sparkles,
  Smartphone,
  Monitor,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  MousePointerClick,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  Palette,
  Eye,
  Sliders,
  Store,
  Type,
  Layers,
  MapPin,
  Clock,
  Star,
  AlertCircle,
  X,
  FileCode,
  Share2,
  MessageCircle,
  Link as LinkIcon,
} from 'lucide-react';

export interface SelectedInspectorElement {
  elementId: string;
  fieldId?: string;
  bioEid?: string;
  semanticType: 'whatsapp' | 'logo' | 'image' | 'text' | 'title' | 'instagram' | 'facebook' | 'tiktok' | 'youtube' | 'maps' | 'button' | 'phone' | 'email';
  tagName: string;
  attr: string;
  value: string;
  text: string;
  src?: string;
  href?: string;
  phone?: string;
  message?: string;
}

interface BiositeEditorProps {
  template: BiositeTemplate;
  existingProject?: UserProject | null;
  onBack: () => void;
  onSavedSuccess?: (project: UserProject) => void;
}

export const BiositeEditor: React.FC<BiositeEditorProps> = ({
  template,
  existingProject,
  onBack,
  onSavedSuccess,
}) => {
  const { saveProject } = useData();
  const { currentUser } = useAuth();

  // Project Title
  const [projectName, setProjectName] = useState(
    existingProject?.name || `Meu Biosite - ${template.name}`
  );

  // Status of changes & save state machine
  const [isSaved, setIsSaved] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Download & Copy modals
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);

  // Inspector Mode & Viewport
  const [inspectorActive, setInspectorActive] = useState(true);
  const [deviceView, setDeviceView] = useState<'mobile' | 'desktop'>('mobile');
  const [mobileTab, setMobileTab] = useState<'preview' | 'editor'>('preview');

  // Accordion states
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    identidade: true,
    cores: false,
    icones: false,
    textos: true,
    especialidades: false,
    galeria: false,
    whatsapp: true,
    redes: false,
    localizacao: false,
    google_review: false,
    horarios: false,
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Active focused field from inspector
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);

  // Direct Interactive Visual Preview Inspector State
  const [selectedElement, setSelectedElement] = useState<SelectedInspectorElement | null>(null);
  const [showAppearanceInInspector, setShowAppearanceInInspector] = useState(false);

  // Logo URL temporary input & error
  const [logoUrlInput, setLogoUrlInput] = useState('');
  const [logoUrlError, setLogoUrlError] = useState('');
  const [logoUrlSuccess, setLogoUrlSuccess] = useState(false);

  // Logo upload preview / background removal modal
  const [logoModalOpen, setLogoModalOpen] = useState(false);
  const [originalLogoSrc, setOriginalLogoSrc] = useState<string>('');
  const [removedBgLogoSrc, setRemovedBgLogoSrc] = useState<string | null>(null);
  const [hasDetectedTransparency, setHasDetectedTransparency] = useState(false);
  const [isProcessingRemoval, setIsProcessingRemoval] = useState(false);
  const [selectedBgChoice, setSelectedBgChoice] = useState<'original' | 'removed'>('original');

  // Ref for Preview iframe
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Map of all fields from template
  const fields = useMemo(() => template.fields, [template.fields]);

  // Master state of custom values: fieldId -> customized value
  const [customValues, setCustomValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    template.fields.forEach((f) => {
      initial[f.id] = existingProject?.customValues?.[f.id] ?? f.originalValue ?? '';
    });
    if (existingProject?.customValues) {
      Object.assign(initial, existingProject.customValues);
    }
    return initial;
  });

  // Extracted original theme from HTML template
  const originalThemeInfo = useMemo(() => {
    return extractThemeInfoFromHtml(template.htmlContent);
  }, [template.htmlContent]);

  // Colors & Appearance State
  const defaultColors = useMemo(() => {
    return originalThemeInfo.originalColors;
  }, [originalThemeInfo]);

  const [customColors, setCustomColors] = useState<Record<string, string>>(() => {
    return existingProject?.customColors || originalThemeInfo.originalColors;
  });

  const [selectedPalette, setSelectedPalette] = useState<string>(
    existingProject?.selectedPalette || 'original'
  );

  // Icon Style State
  const [iconStyle, setIconStyle] = useState<IconStyleType>(
    existingProject?.iconStyle || 'original'
  );

  // Social Networks Config State
  const [socialsConfig, setSocialsConfig] = useState<Record<string, SocialItemConfig>>(() => {
    if (existingProject?.socialsConfig) return existingProject.socialsConfig;
    return {
      whatsapp: { enabled: true, url: customValues['whatsapp'] || '' },
      instagram: { enabled: true, url: customValues['instagram'] || '' },
      facebook: { enabled: false, url: '' },
      tiktok: { enabled: false, url: '' },
      youtube: { enabled: false, url: '' },
    };
  });

  // Logo Config State
  const [logoConfig, setLogoConfig] = useState<LogoConfig>(() => {
    return existingProject?.logoConfig || { size: 'md', align: 'center', transparent: false };
  });

  // Helper values
  const companyName =
    customValues['nome_empresa'] ||
    template.fields.find((f) => f.id === 'nome_empresa')?.originalValue ||
    'Minha Empresa';

  const initialWhatsAppRaw =
    customValues['whatsapp'] || template.fields.find((f) => f.id === 'whatsapp')?.originalValue || '';
  const parsedWhatsApp = useMemo(() => parseWhatsAppUrl(initialWhatsAppRaw), [initialWhatsAppRaw]);

  const [whatsAppPhone, setWhatsAppPhone] = useState(() => parsedWhatsApp.phone || '31999999999');
  const [whatsAppMessage, setWhatsAppMessage] = useState(() => {
    if (parsedWhatsApp.message) return parsedWhatsApp.message;
    return getSuggestedWhatsAppMessage(template.nicheId || template.nicheName, companyName);
  });

  const initialInstagramRaw =
    customValues['instagram'] || template.fields.find((f) => f.id === 'instagram')?.originalValue || '';
  const [instagramInput, setInstagramInput] = useState(() => {
    const norm = normalizeInstagram(initialInstagramRaw);
    return norm.handle || '@blackcrownbarber';
  });

  // Gallery items helper
  const galleryFieldIds = useMemo(() => {
    return fields
      .filter((f) => f.id.startsWith('galeria_') || f.group === 'Galeria')
      .map((f) => f.id);
  }, [fields]);

  // Specialties indexes helper
  const specialtyIndexes = useMemo(() => {
    const idxs = new Set<number>();
    fields.forEach((f) => {
      const match = f.id.match(/^esp_(\d+)_/);
      if (match) idxs.add(parseInt(match[1], 10));
    });
    return Array.from(idxs).sort((a, b) => a - b);
  }, [fields]);

  // Mark modified helper
  const markModified = () => {
    setIsSaved(false);
    setSaveError(null);
  };

  /**
   * Directly update DOM elements in the preview iframe WITHOUT full reload.
   * Single source of truth: ensures WhatsApp updates all WhatsApp links,
   * Logo updates all logo images, and all semantic/id/selector queries succeed instantly.
   */
  const updateIframeDom = useCallback(
    (targetKey: string, value: string, attr?: 'text' | 'src' | 'href', semanticType?: string) => {
      // 1. Post message to iframe inspector bridge
      iframeRef.current?.contentWindow?.postMessage(
        {
          type: 'BIO_FACIL_UPDATE_DOM_ELEMENT',
          elementId: targetKey,
          semanticType: semanticType,
          value: value,
          attr: attr,
        },
        '*'
      );

      // 2. Direct DOM mutation on contentDocument for instantaneous preview response
      const doc = iframeRef.current?.contentDocument;
      if (!doc) return;

      // Universal WhatsApp update across all WhatsApp buttons/anchors in the biosite
      if (targetKey === 'whatsapp' || semanticType === 'whatsapp') {
        const waEls = doc.querySelectorAll(
          'a[href*="wa.me"], a[href*="whatsapp"], a[href*="api.whatsapp.com"], [data-bio-link="whatsapp"]'
        );
        waEls.forEach((el) => {
          (el as HTMLAnchorElement).href = value;
        });
        return;
      }

      // Universal Instagram update across all Instagram links
      if (targetKey === 'instagram' || semanticType === 'instagram') {
        const inEls = doc.querySelectorAll('a[href*="instagram.com"], [data-bio-link="instagram"]');
        inEls.forEach((el) => {
          (el as HTMLAnchorElement).href = value;
        });
        return;
      }

      // Universal Facebook update
      if (targetKey === 'facebook' || semanticType === 'facebook') {
        const fbEls = doc.querySelectorAll('a[href*="facebook.com"], a[href*="fb.com"], [data-bio-link="facebook"]');
        fbEls.forEach((el) => {
          (el as HTMLAnchorElement).href = value;
        });
        return;
      }

      // Universal TikTok update
      if (targetKey === 'tiktok' || semanticType === 'tiktok') {
        const ttEls = doc.querySelectorAll('a[href*="tiktok.com"], [data-bio-link="tiktok"]');
        ttEls.forEach((el) => {
          (el as HTMLAnchorElement).href = value;
        });
        return;
      }

      // Universal YouTube update
      if (targetKey === 'youtube' || semanticType === 'youtube') {
        const ytEls = doc.querySelectorAll('a[href*="youtube.com"], a[href*="youtu.be"], [data-bio-link="youtube"]');
        ytEls.forEach((el) => {
          (el as HTMLAnchorElement).href = value;
        });
        return;
      }

      // Universal Maps update
      if (targetKey === 'maps' || targetKey === 'google_maps' || semanticType === 'maps') {
        const mapEls = doc.querySelectorAll(
          'a[href*="maps.google"], a[href*="goo.gl/maps"], a[href*="google.com/maps"], [data-bio-link="maps"], [data-bio-link="google_maps"]'
        );
        mapEls.forEach((el) => {
          (el as HTMLAnchorElement).href = value;
        });
        return;
      }

      // Universal Logo update across all logo images
      if (targetKey === 'logo' || targetKey === 'logo_principal' || semanticType === 'logo') {
        const logoImgs = doc.querySelectorAll(
          'img[data-bio-image="logo"], img[data-bio-image="logo_principal"], .logo img, [class*="logo"] img, img[alt*="logo" i]'
        );
        if (logoImgs.length > 0) {
          logoImgs.forEach((el) => {
            (el as HTMLImageElement).src = value;
            if (el.hasAttribute('srcset')) el.removeAttribute('srcset');
          });
          return;
        }
      }

      // Match by data-bio-eid
      const eidEls = doc.querySelectorAll(`[data-bio-eid="${targetKey}"]`);
      if (eidEls.length > 0) {
        eidEls.forEach((el) => {
          if (attr === 'src' || el.tagName.toLowerCase() === 'img') {
            (el as HTMLImageElement).src = value;
            if (el.hasAttribute('srcset')) el.removeAttribute('srcset');
          } else if (attr === 'href' || el.tagName.toLowerCase() === 'a') {
            (el as HTMLAnchorElement).href = value;
          } else {
            el.textContent = value;
          }
        });
        return;
      }

      // Match by data-bio-text
      const textEls = doc.querySelectorAll(`[data-bio-text="${targetKey}"]`);
      if (textEls.length > 0) {
        textEls.forEach((el) => {
          el.textContent = value;
        });
        return;
      }

      // Match by data-bio-image
      const imgEls = doc.querySelectorAll(`[data-bio-image="${targetKey}"]`);
      if (imgEls.length > 0) {
        imgEls.forEach((el) => {
          (el as HTMLImageElement).src = value;
          if (el.hasAttribute('srcset')) el.removeAttribute('srcset');
        });
        return;
      }

      // Match by data-bio-link
      const linkEls = doc.querySelectorAll(`[data-bio-link="${targetKey}"]`);
      if (linkEls.length > 0) {
        linkEls.forEach((el) => {
          (el as HTMLAnchorElement).href = value;
        });
        return;
      }

      // Match by Element ID
      const byId = doc.getElementById(targetKey);
      if (byId) {
        if (attr === 'src' || byId.tagName.toLowerCase() === 'img') {
          (byId as HTMLImageElement).src = value;
        } else if (attr === 'href' || byId.tagName.toLowerCase() === 'a') {
          (byId as HTMLAnchorElement).href = value;
        } else {
          byId.textContent = value;
        }
        return;
      }

      // Match by template field selector
      const field = fields.find((f) => f.id === targetKey);
      if (field?.selector) {
        const matchEls = doc.querySelectorAll(field.selector);
        matchEls.forEach((el) => {
          if (field.attr === 'src' || el.tagName.toLowerCase() === 'img') {
            (el as HTMLImageElement).src = value;
          } else if (field.attr === 'href' || el.tagName.toLowerCase() === 'a') {
            (el as HTMLAnchorElement).href = value;
          } else {
            el.textContent = value;
          }
        });
      }
    },
    [fields]
  );

  /**
   * Update theme CSS variables & styles dynamically in the preview iframe
   */
  const updateIframeTheme = useCallback(
    (
      colors: Record<string, string>,
      currentIconStyle: IconStyleType,
      currentLogoConfig?: LogoConfig,
      isOriginal: boolean = false
    ) => {
      const doc = iframeRef.current?.contentDocument;
      if (!doc) return;
      let styleEl =
        (doc.getElementById('biofacil-theme-override') as HTMLStyleElement) ||
        (doc.getElementById('bio-custom-theme') as HTMLStyleElement);

      if (!styleEl) {
        styleEl = doc.createElement('style');
        styleEl.setAttribute('id', 'biofacil-theme-override');
        if (doc.head) doc.head.appendChild(styleEl);
        else if (doc.body) doc.body.insertBefore(styleEl, doc.body.firstChild);
      } else {
        styleEl.setAttribute('id', 'biofacil-theme-override');
      }

      styleEl.textContent = generateThemeCss(
        colors,
        currentIconStyle,
        currentLogoConfig,
        isOriginal,
        originalThemeInfo.cssVariables
      );

      // Directly apply body background & text inline for immediate preview responsiveness
      if (doc.body) {
        if (!isOriginal && colors?.bg) {
          doc.body.style.setProperty('background-color', colors.bg, 'important');
          doc.body.style.setProperty('color', colors.text || '#ffffff', 'important');
        } else if (isOriginal) {
          doc.body.style.removeProperty('background-color');
          doc.body.style.removeProperty('color');
        }
      }
    },
    [originalThemeInfo]
  );

  /**
   * Update social links & visibility dynamically in the preview iframe
   */
  const updateIframeSocials = useCallback((socials: Record<string, SocialItemConfig>) => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    const socialBar = doc.querySelector('.social-bar') || doc.querySelector('[data-bio-social-bar]');

    Object.entries(socials).forEach(([key, config]) => {
      const el = doc.querySelector(`[data-bio-link="${key}"]`);
      if (!config.enabled) {
        if (el) (el as HTMLElement).style.display = 'none';
      } else {
        if (el) {
          (el as HTMLElement).style.display = 'inline-flex';
          if (config.url) (el as HTMLAnchorElement).href = config.url;
        } else if (socialBar && config.url && SOCIAL_SVGS[key]) {
          const newA = doc.createElement('a');
          newA.setAttribute('href', config.url);
          newA.setAttribute('target', '_blank');
          newA.setAttribute('class', 'social-btn');
          newA.setAttribute('data-bio-link', key);
          newA.setAttribute('title', key);
          newA.innerHTML = SOCIAL_SVGS[key];
          socialBar.appendChild(newA);
        }
      }
    });
  }, []);

  // Handle single field change
  const handleFieldChange = (fieldId: string, value: string) => {
    markModified();
    setCustomValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
    updateIframeDom(fieldId, value);
  };

  // Handle Color Variable Change
  const handleColorChange = (key: string, value: string) => {
    markModified();
    setSelectedPalette('custom');
    const newColors = { ...customColors, [key]: value };
    setCustomColors(newColors);
    updateIframeTheme(newColors, iconStyle, logoConfig, false);
  };

  // Handle Ready Palette Selection
  const handleSelectPalette = (paletteId: string) => {
    markModified();
    setSelectedPalette(paletteId);
    if (paletteId === 'original') {
      setCustomColors(defaultColors);
      updateIframeTheme(defaultColors, iconStyle, logoConfig, true);
      return;
    }
    const pal = READY_PALETTES.find((p) => p.id === paletteId);
    if (pal) {
      setCustomColors(pal.colors);
      updateIframeTheme(pal.colors, iconStyle, logoConfig, false);
    }
  };

  // Handle Restore Original Colors
  const handleRestoreOriginalColors = () => {
    markModified();
    setSelectedPalette('original');
    setCustomColors(defaultColors);
    updateIframeTheme(defaultColors, iconStyle, logoConfig, true);
  };

  // Handle Icon Style Change
  const handleIconStyleChange = (style: IconStyleType) => {
    markModified();
    setIconStyle(style);
    updateIframeTheme(customColors, style, logoConfig, selectedPalette === 'original');
  };

  // Handle Logo Config Change (size, align)
  const handleLogoConfigChange = (newConfig: Partial<LogoConfig>) => {
    markModified();
    const updated = { ...logoConfig, ...newConfig };
    setLogoConfig(updated);
    updateIframeTheme(customColors, iconStyle, updated, selectedPalette === 'original');
  };

  // Handle WhatsApp change
  const handleWhatsAppChange = (newPhone: string, newMsg: string) => {
    markModified();
    setWhatsAppPhone(newPhone);
    setWhatsAppMessage(newMsg);
    const generatedUrl = buildWhatsAppUrl(newPhone, newMsg);
    setCustomValues((prev) => ({
      ...prev,
      whatsapp: generatedUrl,
    }));
    setSocialsConfig((prev) => ({
      ...prev,
      whatsapp: { ...prev.whatsapp, url: generatedUrl },
    }));
    updateIframeDom('whatsapp', generatedUrl);
  };

  // Handle Instagram change
  const handleInstagramChange = (input: string) => {
    markModified();
    setInstagramInput(input);
    const norm = normalizeInstagram(input);
    const finalUrl = norm.url || input;
    setCustomValues((prev) => ({
      ...prev,
      instagram: finalUrl,
    }));
    setSocialsConfig((prev) => ({
      ...prev,
      instagram: { ...prev.instagram, url: finalUrl },
    }));
    updateIframeDom('instagram', finalUrl);
  };

  // Handle Social Item Update
  const handleSocialItemUpdate = (key: string, updates: Partial<SocialItemConfig>) => {
    markModified();
    const updatedSocials = {
      ...socialsConfig,
      [key]: { ...socialsConfig[key], ...updates },
    };
    setSocialsConfig(updatedSocials);
    updateIframeSocials(updatedSocials);
  };

  // Handle Add Social Network
  const handleAddSocialNetwork = (key: string) => {
    markModified();
    const defaultUrls: Record<string, string> = {
      facebook: 'https://facebook.com/minhapagina',
      tiktok: 'https://tiktok.com/@meuperfil',
      youtube: 'https://youtube.com/@meucanal',
    };
    const updated = {
      ...socialsConfig,
      [key]: { enabled: true, url: defaultUrls[key] || '' },
    };
    setSocialsConfig(updated);
    updateIframeSocials(updated);
  };

  // Handle Remove Social Network
  const handleRemoveSocialNetwork = (key: string) => {
    markModified();
    const updated = {
      ...socialsConfig,
      [key]: { ...socialsConfig[key], enabled: false },
    };
    setSocialsConfig(updated);
    updateIframeSocials(updated);
  };

  // Image Upload handler (general fields)
  const handleImageFileUpload = (fieldId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result === 'string') {
        if (fieldId === 'logo') {
          // Open Logo Preview & Background Removal Modal
          const dataUrl = reader.result;
          setOriginalLogoSrc(dataUrl);
          setIsProcessingRemoval(true);
          setLogoModalOpen(true);
          setSelectedBgChoice('original');

          const processed = await processImageBackground(dataUrl);
          setRemovedBgLogoSrc(processed.dataUrl);
          setHasDetectedTransparency(processed.hasTransparency);
          if (processed.hasTransparency) {
            setSelectedBgChoice('original');
          }
          setIsProcessingRemoval(false);
        } else {
          handleFieldChange(fieldId, reader.result);
        }
      }
    };
    reader.readAsDataURL(file);
    // Reset file input
    e.target.value = '';
  };

  // Confirm Logo Modal
  const handleConfirmLogoModal = () => {
    const chosenSrc =
      selectedBgChoice === 'removed' && removedBgLogoSrc
        ? removedBgLogoSrc
        : originalLogoSrc;
    if (chosenSrc) {
      handleFieldChange('logo', chosenSrc);
      setLogoUrlSuccess(true);
      setTimeout(() => setLogoUrlSuccess(false), 2500);
    }
    setLogoModalOpen(false);
  };

  // Logo URL Apply handler
  const handleApplyLogoUrl = () => {
    if (!logoUrlInput.trim()) return;
    try {
      new URL(logoUrlInput.trim());
      handleFieldChange('logo', logoUrlInput.trim());
      setLogoUrlError('');
      setLogoUrlSuccess(true);
      setTimeout(() => setLogoUrlSuccess(false), 3000);
    } catch {
      setLogoUrlError('Link inválido. Insira uma URL completa com https://');
    }
  };

  // Tell iframe to focus/glow on an element
  const notifyIframeToFocus = (fieldId: string) => {
    setActiveFieldId(fieldId);
    iframeRef.current?.contentWindow?.postMessage(
      { type: 'BIO_FACIL_FOCUS_ELEMENT', fieldId },
      '*'
    );
  };

  // Deselect currently clicked element in preview
  const handleDeselectElement = () => {
    setSelectedElement(null);
    setShowAppearanceInInspector(false);
    iframeRef.current?.contentWindow?.postMessage({ type: 'BIO_FACIL_DESELECT' }, '*');
  };

  // Live text change from visual inspector
  const handleInspectorTextChange = (text: string) => {
    if (!selectedElement) return;
    markModified();
    setCustomValues((prev) => ({
      ...prev,
      [selectedElement.elementId]: text,
    }));
    updateIframeDom(selectedElement.elementId, text, 'text', selectedElement.semanticType);
  };

  // Live logo change from visual inspector
  const handleInspectorLogoChange = (src: string) => {
    markModified();
    setCustomValues((prev) => ({
      ...prev,
      logo: src,
      ...(selectedElement ? { [selectedElement.elementId]: src } : {}),
    }));
    updateIframeDom('logo', src, 'src', 'logo');
    if (selectedElement && selectedElement.elementId !== 'logo') {
      updateIframeDom(selectedElement.elementId, src, 'src', 'logo');
    }
  };

  // Live image change from visual inspector
  const handleInspectorImageChange = (src: string) => {
    if (!selectedElement) return;
    markModified();
    const isLogo = selectedElement.semanticType === 'logo' || selectedElement.elementId === 'logo';
    setCustomValues((prev) => ({
      ...prev,
      [selectedElement.elementId]: src,
      ...(isLogo ? { logo: src } : {}),
    }));
    updateIframeDom(selectedElement.elementId, src, 'src', selectedElement.semanticType);
  };

  // Live WhatsApp change from visual inspector
  const handleInspectorWhatsAppChange = (newPhone: string, newMsg: string) => {
    markModified();
    setWhatsAppPhone(newPhone);
    setWhatsAppMessage(newMsg);
    const genUrl = buildWhatsAppUrl(newPhone, newMsg);
    setCustomValues((prev) => ({
      ...prev,
      whatsapp: genUrl,
    }));
    setSocialsConfig((prev) => ({
      ...prev,
      whatsapp: { ...prev.whatsapp, url: genUrl, enabled: true },
    }));
    updateIframeDom('whatsapp', genUrl, 'href', 'whatsapp');
  };

  // Live Button change from visual inspector
  const handleInspectorButtonChange = (newText?: string, newHref?: string) => {
    if (!selectedElement) return;
    markModified();
    if (newText !== undefined) {
      setCustomValues((prev) => ({
        ...prev,
        [selectedElement.elementId]: newText,
      }));
      updateIframeDom(selectedElement.elementId, newText, 'text', 'button');
    }
    if (newHref !== undefined) {
      setCustomValues((prev) => ({
        ...prev,
        [`${selectedElement.elementId}_href`]: newHref,
      }));
      updateIframeDom(selectedElement.elementId, newHref, 'href', 'button');
    }
  };

  // Live Social URL change from visual inspector
  const handleInspectorSocialChange = (key: string, rawVal: string) => {
    markModified();
    let finalUrl = rawVal;
    if (key === 'instagram') {
      finalUrl = normalizeInstagram(rawVal).url || rawVal;
    } else if (key === 'facebook') {
      finalUrl = normalizeFacebook(rawVal);
    } else if (key === 'tiktok') {
      finalUrl = normalizeTikTok(rawVal).url || rawVal;
    } else if (key === 'youtube') {
      finalUrl = normalizeYouTube(rawVal);
    }
    setCustomValues((prev) => ({
      ...prev,
      [key]: finalUrl,
    }));
    setSocialsConfig((prev) => ({
      ...prev,
      [key]: { ...(prev[key] || { enabled: true }), url: finalUrl, enabled: true },
    }));
    updateIframeDom(key, finalUrl, 'href', key);
  };

  // Live Google Maps change from visual inspector
  const handleInspectorMapsChange = (url: string) => {
    markModified();
    setCustomValues((prev) => ({
      ...prev,
      maps: url,
      [selectedElement?.elementId || 'maps']: url,
    }));
    updateIframeDom('maps', url, 'href', 'maps');
  };

  // Listen for messages from the Preview iframe ("✦ EDITAR PELO PREVIEW")
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (!e.data || e.data.type !== 'BIO_FACIL_ELEMENT_CLICKED') return;
      const data = e.data;
      const elementId = data.elementId || data.fieldId || data.bioEid || '';
      if (!elementId) return;

      const semanticType = (data.semanticType || (data.tagName === 'img' ? 'image' : 'text')) as SelectedInspectorElement['semanticType'];

      const selected: SelectedInspectorElement = {
        elementId: elementId,
        fieldId: data.fieldId,
        bioEid: data.bioEid,
        semanticType: semanticType,
        tagName: data.tagName || '',
        attr: data.attr || '',
        value: data.value || '',
        text: data.text || '',
        src: data.src || '',
        href: data.href || '',
        phone: data.phone || '',
        message: data.message || '',
      };

      setSelectedElement(selected);

      // If WhatsApp clicked and phone was in URL, update inputs
      if (semanticType === 'whatsapp') {
        if (data.phone) {
          setWhatsAppPhone(formatPhoneDisplay(data.phone));
        }
        if (data.message) {
          setWhatsAppMessage(data.message);
        }
        setOpenAccordions((p) => ({ ...p, whatsapp: true }));
      } else if (semanticType === 'logo') {
        setOpenAccordions((p) => ({ ...p, identidade: true }));
      } else if (['instagram', 'facebook', 'tiktok', 'youtube'].includes(semanticType)) {
        setOpenAccordions((p) => ({ ...p, redes: true }));
      } else if (semanticType === 'maps') {
        setOpenAccordions((p) => ({ ...p, localizacao: true }));
      } else if (data.fieldId) {
        setActiveFieldId(data.fieldId);
        if (data.fieldId === 'nome_empresa') {
          setOpenAccordions((p) => ({ ...p, identidade: true }));
        } else if (data.fieldId === 'headline' || data.fieldId === 'subtitulo') {
          setOpenAccordions((p) => ({ ...p, textos: true }));
        } else if (data.fieldId.startsWith('esp_')) {
          setOpenAccordions((p) => ({ ...p, especialidades: true }));
        } else if (data.fieldId.startsWith('galeria_')) {
          setOpenAccordions((p) => ({ ...p, galeria: true }));
        } else if (data.fieldId === 'endereco') {
          setOpenAccordions((p) => ({ ...p, localizacao: true }));
        } else if (data.fieldId === 'google_review') {
          setOpenAccordions((p) => ({ ...p, google_review: true }));
        } else if (data.fieldId === 'horario') {
          setOpenAccordions((p) => ({ ...p, horarios: true }));
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Update inspector active state in iframe
  useEffect(() => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: 'BIO_FACIL_SET_INSPECTOR', enabled: inspectorActive },
      '*'
    );
  }, [inspectorActive]);

  // Initial compiled HTML for iframe initialization
  const initialHtml = useMemo(() => {
    const compiled = compileBiositeHtml(template.htmlContent, template.fields, customValues, {
      customColors,
      selectedPalette,
      iconStyle,
      socialsConfig,
      logoConfig,
      detectedProps: originalThemeInfo.cssVariables,
    });
    return injectVisualInspectorScript(compiled, inspectorActive);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template.id]);

  // Save to Firestore (Strict Rule: any change enables save, exact state transitions)
  const handleSaveProject = async () => {
    if (!currentUser) return;
    setSaving(true);
    setSaveError(null);
    try {
      const projectId =
        existingProject?.id || `proj_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

      const cleanCompiled = compileBiositeHtml(
        template.htmlContent,
        template.fields,
        customValues,
        {
          customColors,
          selectedPalette,
          iconStyle,
          socialsConfig,
          logoConfig,
          detectedProps: originalThemeInfo.cssVariables,
        }
      );

      const projectData: UserProject = {
        id: projectId,
        userId: currentUser.uid,
        userEmail: currentUser.email || '',
        templateId: template.id,
        nicheId: template.nicheId,
        name: projectName.trim() || 'Meu Biosite',
        slug: projectName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        customValues,
        customColors,
        selectedPalette,
        iconStyle,
        socialsConfig,
        logoConfig,
        htmlCompiled: cleanCompiled,
        createdAt: existingProject?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await saveProject(projectData);
      setIsSaved(true);
      setSaveError(null);
      if (onSavedSuccess) onSavedSuccess(projectData);
    } catch (err: any) {
      console.error('Erro ao salvar projeto no Firestore:', err);
      setSaveError(err?.message || 'Falha na conexão ao salvar.');
      setIsSaved(false);
    } finally {
      setSaving(false);
    }
  };

  // Download ZIP
  const handleDownloadZip = async () => {
    setDownloadingZip(true);
    try {
      const cleanCompiled = compileBiositeHtml(
        template.htmlContent,
        template.fields,
        customValues,
        {
          customColors,
          selectedPalette,
          iconStyle,
          socialsConfig,
          logoConfig,
          detectedProps: originalThemeInfo.cssVariables,
        }
      );
      const manifest = {
        templateId: template.id,
        name: projectName,
        category: template.nicheName,
        version: template.version,
        fields: template.fields,
        customColors,
        iconStyle,
      };
      await downloadBiositeZip(projectName, cleanCompiled, manifest);
      setDownloadModalOpen(false);
    } finally {
      setDownloadingZip(false);
    }
  };

  // Download Single HTML file
  const handleDownloadHtmlFile = () => {
    const cleanCompiled = compileBiositeHtml(
      template.htmlContent,
      template.fields,
      customValues,
      {
        customColors,
        selectedPalette,
        iconStyle,
        socialsConfig,
        logoConfig,
        detectedProps: originalThemeInfo.cssVariables,
      }
    );
    const blob = new Blob([cleanCompiled], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'index.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setDownloadModalOpen(false);
  };

  // Copy compiled HTML
  const handleCopyHtml = async () => {
    const cleanCompiled = compileBiositeHtml(
      template.htmlContent,
      template.fields,
      customValues,
      {
        customColors,
        selectedPalette,
        iconStyle,
        socialsConfig,
        logoConfig,
        detectedProps: originalThemeInfo.cssVariables,
      }
    );
    await navigator.clipboard.writeText(cleanCompiled);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  /**
   * Render contextual inspector content for the clicked element in the preview
   */
  const renderInspectorContent = () => {
    if (!selectedElement) return null;

    const isWhatsApp = selectedElement.semanticType === 'whatsapp';
    const isLogo = selectedElement.semanticType === 'logo' || selectedElement.elementId === 'logo';
    const isImage = selectedElement.semanticType === 'image' && !isLogo;
    const isText = selectedElement.semanticType === 'text' || selectedElement.semanticType === 'title';
    const isInstagram = selectedElement.semanticType === 'instagram';
    const isButton = selectedElement.semanticType === 'button';
    const isMaps = selectedElement.semanticType === 'maps';
    const isOtherSocial = ['facebook', 'tiktok', 'youtube'].includes(selectedElement.semanticType);

    return (
      <div className="space-y-3.5">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-purple-500/20">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-900/50 border border-purple-500/30 flex items-center justify-center">
              {isWhatsApp && <MessageCircle size={15} className="text-emerald-400" />}
              {isLogo && <ImageIcon size={15} className="text-purple-400" />}
              {isImage && <ImageIcon size={15} className="text-blue-400" />}
              {isText && <Type size={15} className="text-amber-400" />}
              {isInstagram && <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />}
              {isButton && <LinkIcon size={15} className="text-blue-400" />}
              {isMaps && <MapPin size={15} className="text-rose-400" />}
              {isOtherSocial && <Share2 size={15} className="text-indigo-400" />}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  {isWhatsApp && 'Editar WhatsApp'}
                  {isLogo && 'Editar Logomarca'}
                  {isImage && 'Editar Imagem'}
                  {isText && (selectedElement.semanticType === 'title' ? 'Editar Título' : 'Editar Texto')}
                  {isInstagram && 'Editar Instagram'}
                  {isButton && 'Editar Botão / Link'}
                  {isMaps && 'Editar Localização'}
                  {isOtherSocial && `Editar ${selectedElement.semanticType.toUpperCase()}`}
                </h4>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  ✦ PREVIEW
                </span>
              </div>
              <p className="text-[10px] text-gray-400">Alterações são aplicadas imediatamente</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDeselectElement}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            title="Fechar / Desmarcar"
          >
            <X size={16} />
          </button>
        </div>

        {/* 1. WHATSAPP */}
        {isWhatsApp && (
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-300 block">Número do WhatsApp (com DDD):</label>
              <input
                type="tel"
                value={whatsAppPhone}
                onChange={(e) => handleInspectorWhatsAppChange(e.target.value, whatsAppMessage)}
                placeholder="(34) 99999-9999"
                className="w-full bg-[#090814] border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-300 block">Mensagem Inicial Pré-definida:</label>
              <textarea
                rows={2}
                value={whatsAppMessage}
                onChange={(e) => handleInspectorWhatsAppChange(whatsAppPhone, e.target.value)}
                placeholder="Olá! Vim pelo site..."
                className="w-full bg-[#090814] border border-purple-500/30 rounded-xl p-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <a
                href={buildWhatsAppUrl(whatsAppPhone, whatsAppMessage) || '#'}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
              >
                <MessageCircle size={13} />
                <span>TESTAR WHATSAPP</span>
                <ExternalLink size={11} />
              </a>
              <span className="text-[10px] text-emerald-400 font-medium">✓ Todos os botões atualizados</span>
            </div>
          </div>
        )}

        {/* 2. LOGO */}
        {isLogo && (
          <div className="space-y-3">
            <div className="flex items-center gap-3 bg-[#090814] p-2.5 rounded-xl border border-purple-500/20">
              <img
                src={customValues['logo'] || selectedElement.src || ''}
                alt="Logo Atual"
                className="w-16 h-16 object-contain rounded-lg bg-black/50 p-1 border border-white/10"
              />
              <div className="flex-1 space-y-1.5">
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer shadow-md transition-all active:scale-95">
                  <Upload size={13} />
                  <span>FAZER UPLOAD</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          if (typeof reader.result === 'string') {
                            handleInspectorLogoChange(reader.result);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                      e.target.value = '';
                    }}
                    className="hidden"
                  />
                </label>
                {selectedElement.src && (
                  <button
                    type="button"
                    onClick={() => handleInspectorLogoChange(selectedElement.src || '')}
                    className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1"
                  >
                    <RotateCcw size={10} /> Restaurar Original
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-300 block">Ou Cole o Link Direto da Imagem:</label>
              <input
                type="url"
                value={customValues['logo'] || ''}
                onChange={(e) => handleInspectorLogoChange(e.target.value)}
                placeholder="https://.../logo.png"
                className="w-full bg-[#090814] border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                const currentLogo = customValues['logo'] || selectedElement.src;
                if (currentLogo) {
                  setOriginalLogoSrc(currentLogo);
                  setIsProcessingRemoval(true);
                  setLogoModalOpen(true);
                  setSelectedBgChoice('original');
                  processImageBackground(currentLogo).then((res) => {
                    setRemovedBgLogoSrc(res.dataUrl);
                    setHasDetectedTransparency(res.hasTransparency);
                    if (res.hasTransparency) setSelectedBgChoice('original');
                    setIsProcessingRemoval(false);
                  });
                }
              }}
              className="w-full py-2 px-3 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <Sparkles size={13} />
              <span>Remover Fundo Automático</span>
            </button>
          </div>
        )}

        {/* 3. IMAGEM / FOTO */}
        {isImage && (
          <div className="space-y-3">
            <div className="flex items-center gap-3 bg-[#090814] p-2.5 rounded-xl border border-purple-500/20">
              <img
                src={customValues[selectedElement.elementId] || selectedElement.src || ''}
                alt="Imagem"
                className="w-16 h-16 object-cover rounded-lg bg-black/50 p-0.5 border border-white/10"
              />
              <div className="flex-1 space-y-1.5">
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer shadow-md transition-all active:scale-95">
                  <Upload size={13} />
                  <span>FAZER UPLOAD</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          if (typeof reader.result === 'string') {
                            handleInspectorImageChange(reader.result);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                      e.target.value = '';
                    }}
                    className="hidden"
                  />
                </label>
                {selectedElement.src && (
                  <button
                    type="button"
                    onClick={() => handleInspectorImageChange(selectedElement.src || '')}
                    className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1"
                  >
                    <RotateCcw size={10} /> Restaurar Original
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-300 block">Ou Cole o Link da Imagem:</label>
              <input
                type="url"
                value={customValues[selectedElement.elementId] || ''}
                onChange={(e) => handleInspectorImageChange(e.target.value)}
                placeholder="https://.../imagem.jpg"
                className="w-full bg-[#090814] border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>
        )}

        {/* 4. TEXTO / TÍTULO */}
        {isText && (
          <div className="space-y-2.5">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-300 block">Conteúdo do Texto:</label>
              <textarea
                rows={3}
                value={customValues[selectedElement.elementId] ?? selectedElement.text}
                onChange={(e) => handleInspectorTextChange(e.target.value)}
                placeholder="Digite o texto aqui..."
                className="w-full bg-[#090814] border border-purple-500/30 rounded-xl p-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
              />
            </div>

            {selectedElement.text && (
              <button
                type="button"
                onClick={() => handleInspectorTextChange(selectedElement.text)}
                className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1"
              >
                <RotateCcw size={10} /> Restaurar Texto Original
              </button>
            )}
          </div>
        )}

        {/* 5. INSTAGRAM */}
        {isInstagram && (
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-300 block">Perfil ou Link do Instagram:</label>
              <input
                type="text"
                value={socialsConfig.instagram.url || selectedElement.href || ''}
                onChange={(e) => handleInspectorSocialChange('instagram', e.target.value)}
                placeholder="@meuperfil ou https://instagram.com/meuperfil"
                className="w-full bg-[#090814] border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
              />
            </div>

            {socialsConfig.instagram.url && (
              <a
                href={socialsConfig.instagram.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
                <span>TESTAR INSTAGRAM</span>
                <ExternalLink size={11} />
              </a>
            )}
          </div>
        )}

        {/* 6. BOTÃO / LINK GERAL */}
        {isButton && (
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-300 block">Texto do Botão:</label>
              <input
                type="text"
                value={customValues[selectedElement.elementId] ?? selectedElement.text}
                onChange={(e) => handleInspectorButtonChange(e.target.value, undefined)}
                placeholder="Texto do botão..."
                className="w-full bg-[#090814] border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-300 block">Link de Destino (URL):</label>
              <input
                type="text"
                value={customValues[`${selectedElement.elementId}_href`] ?? selectedElement.href}
                onChange={(e) => handleInspectorButtonChange(undefined, e.target.value)}
                placeholder="https://... ou wa.me/..."
                className="w-full bg-[#090814] border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                const waUrl = buildWhatsAppUrl(whatsAppPhone, whatsAppMessage);
                if (waUrl) {
                  handleInspectorButtonChange(undefined, waUrl);
                }
              }}
              className="w-full py-1.5 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <MessageCircle size={13} />
              <span>Apontar este botão para o WhatsApp</span>
            </button>
          </div>
        )}

        {/* 7. LOCALIZAÇÃO / GOOGLE MAPS */}
        {isMaps && (
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-300 block">Link do Google Maps:</label>
              <input
                type="text"
                value={customValues['maps'] || selectedElement.href || ''}
                onChange={(e) => handleInspectorMapsChange(e.target.value)}
                placeholder="https://maps.google.com/..."
                className="w-full bg-[#090814] border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
              />
            </div>

            {customValues['maps'] && (
              <a
                href={customValues['maps']}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
              >
                <MapPin size={13} />
                <span>TESTAR MAPS</span>
                <ExternalLink size={11} />
              </a>
            )}
          </div>
        )}

        {/* 8. OUTRAS REDES SOCIAIS */}
        {isOtherSocial && (
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-300 block">
                Link de {selectedElement.semanticType.toUpperCase()}:
              </label>
              <input
                type="text"
                value={customValues[selectedElement.semanticType] || selectedElement.href || ''}
                onChange={(e) => handleInspectorSocialChange(selectedElement.semanticType, e.target.value)}
                placeholder={`https://${selectedElement.semanticType}.com/...`}
                className="w-full bg-[#090814] border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>
        )}

        {/* 9. CORES & PALETAS PRONTAS (DROPDOWN / ACCORDION) */}
        <div className="pt-2 border-t border-purple-500/20">
          <button
            type="button"
            onClick={() => setShowAppearanceInInspector((p) => !p)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-[#121022] hover:bg-[#18162e] border border-purple-500/20 text-xs text-purple-200 font-semibold transition-all"
          >
            <span className="flex items-center gap-1.5">
              <Palette size={13} className="text-purple-400" />
              <span>✦ Cores & Paletas do Modelo</span>
            </span>
            <ChevronDown size={14} className={`transition-transform duration-200 ${showAppearanceInInspector ? 'rotate-180' : ''}`} />
          </button>

          {showAppearanceInInspector && (
            <div className="mt-2 p-2.5 rounded-xl bg-[#090814] border border-purple-500/20 space-y-2.5 animate-in fade-in">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Paletas Prontas:
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {READY_PALETTES.map((pal) => (
                  <button
                    key={pal.id}
                    type="button"
                    onClick={() => handleSelectPalette(pal.id)}
                    className={`px-2 py-1.5 rounded-lg text-left text-[11px] font-medium transition-all border ${
                      selectedPalette === pal.id
                        ? 'border-purple-400 bg-purple-900/40 text-white'
                        : 'border-white/5 bg-[#141224] text-gray-300 hover:border-purple-500/30'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <div className="flex -space-x-1 shrink-0">
                        <div className="w-2.5 h-2.5 rounded-full border border-black/50" style={{ backgroundColor: pal.colors.primary }} />
                        <div className="w-2.5 h-2.5 rounded-full border border-black/50" style={{ backgroundColor: pal.colors.bg }} />
                      </div>
                      <span className="truncate">{pal.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="text-[10px] text-gray-500 flex items-center justify-between pt-1 border-t border-white/5">
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            ● Atualização em tempo real
          </span>
          <button
            type="button"
            onClick={handleDeselectElement}
            className="text-gray-400 hover:text-white underline text-[10px]"
          >
            Concluir Edição
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#050508] text-white overflow-hidden font-sans">
      {/* ─────────────────────────────────────────────────────────
          TOP BAR: BIO FÁCIL | PERSONALIZANDO | STATUS | ACTIONS
         ───────────────────────────────────────────────────────── */}
      <header className="h-14 px-3 sm:px-6 bg-[#0a0914] border-b border-purple-500/20 flex items-center justify-between gap-3 shrink-0 z-20">
        {/* Left: Back & Project Info */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={onBack}
            className="p-1.5 text-gray-400 hover:text-white bg-[#141324] hover:bg-[#1f1d35] rounded-xl border border-white/5 transition-colors shrink-0"
            title="Voltar ao Catálogo"
          >
            <ArrowLeft size={16} />
          </button>

          <div className="flex items-center gap-2 min-w-0">
            <span className="hidden sm:inline-block font-display font-black text-xs text-purple-400 uppercase tracking-widest bg-purple-950/40 px-2 py-0.5 rounded border border-purple-500/20">
              BIO FÁCIL
            </span>
            <span className="text-gray-500 hidden sm:inline text-xs">/</span>
            <div className="min-w-0">
              <div className="text-[11px] text-gray-400 truncate">
                Personalizando: <strong className="text-white">{template.name}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Status & Device Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Inspector Button ("✦ EDITAR PELO PREVIEW") */}
          <button
            onClick={() => setInspectorActive(!inspectorActive)}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
              inspectorActive
                ? 'bg-purple-600 text-white border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                : 'bg-[#141324] text-gray-400 hover:text-white border-purple-500/20'
            }`}
            title="Ao ativar, toque em qualquer elemento no preview para editar"
          >
            <MousePointerClick size={14} />
            <span>✦ Editar pelo Preview</span>
          </button>

          {/* Device Switcher (Mobile / Desktop) */}
          <div className="hidden lg:flex items-center bg-[#141324] p-0.5 rounded-xl border border-purple-500/20">
            <button
              onClick={() => setDeviceView('mobile')}
              className={`p-1.5 rounded-lg text-xs transition-all ${
                deviceView === 'mobile' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
              title="Preview Mobile"
            >
              <Smartphone size={14} />
            </button>
            <button
              onClick={() => setDeviceView('desktop')}
              className={`p-1.5 rounded-lg text-xs transition-all ${
                deviceView === 'desktop' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
              title="Preview Desktop"
            >
              <Monitor size={14} />
            </button>
          </div>
        </div>

        {/* Right: State Machine Actions (Salvar & Baixar) */}
        <div className="flex items-center gap-2">
          {/* Error State */}
          {saveError ? (
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                <AlertCircle size={13} className="text-rose-400" />
                <span className="hidden sm:inline">NÃO FOI POSSÍVEL SALVAR</span>
              </span>
              <button
                onClick={handleSaveProject}
                disabled={saving}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-all"
              >
                TENTAR NOVAMENTE
              </button>
            </div>
          ) : isSaved ? (
            /* Saved State -> Show "✓ ALTERAÇÕES SALVAS" and prominent "BAIXAR BIOSITE ↓" */
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <Check size={13} className="stroke-[3]" />
                <span className="hidden sm:inline">ALTERAÇÕES SALVAS</span>
              </span>
              <button
                onClick={() => setDownloadModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all active:scale-95"
              >
                <Download size={14} />
                <span>BAIXAR BIOSITE ↓</span>
              </button>
            </div>
          ) : (
            /* Unsaved State -> Show "ALTERAÇÕES NÃO SALVAS" and "SALVAR ALTERAÇÕES" */
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span className="hidden sm:inline">ALTERAÇÕES NÃO SALVAS</span>
              </span>
              <button
                onClick={handleSaveProject}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white text-xs font-bold shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all active:scale-95 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>SALVANDO...</span>
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    <span>SALVAR ALTERAÇÕES</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Sub-Navigation Bar: [PREVIEW DO BIOSITE] | [EDITAR CONTEÚDO] */}
      <div className="md:hidden flex bg-[#0a0914] border-b border-purple-500/20 p-1">
        <button
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
            mobileTab === 'preview'
              ? 'bg-purple-600 text-white shadow'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Preview do Biosite
        </button>
        <button
          onClick={() => setMobileTab('editor')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
            mobileTab === 'editor'
              ? 'bg-purple-600 text-white shadow'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Editar Conteúdo
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────
          SPLIT LAYOUT: LEFT CONTROLS | RIGHT LIVE PREVIEW
         ───────────────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* ════════════════════════════════════════════════════════
            LEFT COLUMN: DYNAMIC ACCORDION EDITOR
           ════════════════════════════════════════════════════════ */}
        <aside
          className={`w-full md:w-[440px] lg:w-[480px] bg-[#090812] border-r border-purple-500/20 flex flex-col shrink-0 overflow-y-auto no-scrollbar ${
            mobileTab === 'editor' ? 'flex' : 'hidden md:flex'
          }`}
        >
          {/* Quick Info Header */}
          <div className="p-3.5 bg-gradient-to-r from-purple-950/30 to-violet-950/20 border-b border-purple-500/15 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-purple-200">
              <Sparkles size={14} className="text-purple-400" />
              <span>Personalização Dinâmica Instantânea</span>
            </div>
            <button
              onClick={handleCopyHtml}
              className="text-[11px] text-gray-400 hover:text-white flex items-center gap-1 bg-[#131122] px-2 py-1 rounded-md border border-purple-500/20"
              title="Copiar HTML compilado"
            >
              {copiedHtml ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              <span>{copiedHtml ? 'Copiado!' : 'Copiar HTML'}</span>
            </button>
          </div>

          <div className="p-4 space-y-3.5 pb-20">
            {/* 1. SEÇÃO: IDENTIDADE (NOME, LOGOMARCA & TAMANHO) */}
            <div className="bg-[#0e0d1a] border border-purple-500/20 rounded-2xl overflow-hidden transition-all">
              <button
                onClick={() => toggleAccordion('identidade')}
                className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#141224] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-purple-900/50 flex items-center justify-center text-purple-300">
                    <Store size={14} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Identidade</h3>
                    <p className="text-[11px] text-gray-400">Nome da empresa e logomarca principal</p>
                  </div>
                </div>
                {openAccordions.identidade ? (
                  <ChevronDown size={16} className="text-purple-400" />
                ) : (
                  <ChevronRight size={16} className="text-gray-500" />
                )}
              </button>

              {openAccordions.identidade && (
                <div className="p-4 pt-1 space-y-4 border-t border-purple-500/10">
                  {/* Nome da Empresa */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-200 block uppercase tracking-tight">
                      Nome da Empresa
                    </label>
                    <div className="text-[11px] text-gray-400 bg-[#07060f] px-2.5 py-1 rounded-md border border-white/5">
                      Atual:{' '}
                      <span className="text-purple-300 font-semibold">
                        {template.fields.find((f) => f.id === 'nome_empresa')?.originalValue ||
                          companyName}
                      </span>
                    </div>
                    <input
                      id="field-input-nome_empresa"
                      type="text"
                      value={customValues['nome_empresa'] ?? ''}
                      onChange={(e) => {
                        handleFieldChange('nome_empresa', e.target.value);
                      }}
                      onFocus={() => notifyIframeToFocus('nome_empresa')}
                      placeholder="Ex: BLACK CROWN BARBER CLUB"
                      className="w-full bg-[#07060f] border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                  </div>

                  {/* Logomarca */}
                  <div className="space-y-3 pt-2 border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-gray-200 uppercase tracking-tight">
                        Logomarca
                      </label>
                      {customValues['logo'] &&
                        customValues['logo'] !==
                          template.fields.find((f) => f.id === 'logo')?.originalValue && (
                          <button
                            onClick={() => {
                              const orig =
                                template.fields.find((f) => f.id === 'logo')?.originalValue || '';
                              handleFieldChange('logo', orig);
                            }}
                            className="text-[10px] text-purple-400 hover:text-purple-300 flex items-center gap-1"
                          >
                            <RotateCcw size={10} />
                            <span>Restaurar Original</span>
                          </button>
                        )}
                    </div>

                    {/* Logo Active Preview */}
                    <div className="flex items-center gap-3 bg-[#07060f] p-2.5 rounded-xl border border-purple-500/20">
                      <div className="w-16 h-16 rounded-xl bg-[#12111d] border border-purple-500/30 p-1 flex items-center justify-center overflow-hidden shrink-0 relative bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:8px_8px]">
                        {customValues['logo'] ? (
                          <img
                            src={customValues['logo']}
                            alt="Logo ativa"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <ImageIcon size={20} className="text-gray-500" />
                        )}
                      </div>
                      <div className="text-[11px] text-gray-400 space-y-1">
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <Check size={11} /> 1 Logo ativa no biosite
                        </span>
                        <p className="text-[10px] text-gray-400 leading-tight">
                          Upload ou link direto. O biosite sempre exibe apenas uma logo oficial.
                        </p>
                      </div>
                    </div>

                    {/* Tamanho da Logo */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-gray-400 uppercase font-mono block">
                        Tamanho da Logo:
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        {(['sm', 'md', 'lg'] as const).map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => handleLogoConfigChange({ size: s })}
                            className={`py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                              logoConfig.size === s
                                ? 'bg-purple-600 text-white border-purple-400 shadow-sm'
                                : 'bg-[#12111d] text-gray-400 hover:text-white border-white/5'
                            }`}
                          >
                            {s === 'sm' ? 'Pequeno' : s === 'md' ? 'Médio (Padrão)' : 'Grande'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Upload button with background detection modal */}
                    <label className="flex items-center justify-center gap-2 w-full py-2.5 px-3 bg-[#131122] hover:bg-[#1a1730] border border-dashed border-purple-500/40 rounded-xl text-xs text-purple-300 font-semibold cursor-pointer transition-colors">
                      <Upload size={14} />
                      <span>Fazer Upload da Logo</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/svg+xml"
                        onChange={(e) => handleImageFileUpload('logo', e)}
                        className="hidden"
                      />
                    </label>

                    {/* URL Option */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] text-gray-400 uppercase font-mono block">
                        Ou link direto da imagem:
                      </span>
                      <div className="flex gap-1.5">
                        <input
                          type="url"
                          value={logoUrlInput}
                          onChange={(e) => {
                            setLogoUrlInput(e.target.value);
                            setLogoUrlError('');
                          }}
                          placeholder="https://exemplo.com/minha-logo.png"
                          className="flex-1 bg-[#07060f] border border-purple-500/25 rounded-xl px-3 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-purple-500"
                        />
                        <button
                          onClick={handleApplyLogoUrl}
                          className="px-3 py-1.5 bg-[#17152a] hover:bg-purple-600 text-purple-200 hover:text-white rounded-xl text-xs font-semibold border border-purple-500/30 transition-all shrink-0"
                        >
                          Usar esta logo
                        </button>
                      </div>
                      {logoUrlError && (
                        <p className="text-[11px] text-red-400 flex items-center gap-1 mt-1">
                          <AlertCircle size={12} /> {logoUrlError}
                        </p>
                      )}
                      {logoUrlSuccess && (
                        <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
                          <Check size={12} /> Logo atualizada com sucesso!
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. SEÇÃO: CORES & APARÊNCIA */}
            <div className="bg-[#0e0d1a] border border-purple-500/20 rounded-2xl overflow-hidden transition-all">
              <button
                onClick={() => toggleAccordion('cores')}
                className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#141224] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-indigo-900/50 flex items-center justify-center text-indigo-300">
                    <Palette size={14} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Cores & Aparência
                    </h3>
                    <p className="text-[11px] text-gray-400">Paletas prontas e variáveis CSS do tema</p>
                  </div>
                </div>
                {openAccordions.cores ? (
                  <ChevronDown size={16} className="text-purple-400" />
                ) : (
                  <ChevronRight size={16} className="text-gray-500" />
                )}
              </button>

              {openAccordions.cores && (
                <div className="p-4 pt-1 space-y-4 border-t border-purple-500/10">
                  {/* Paletas Prontas */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-gray-200 uppercase tracking-tight">
                        Paletas Prontas
                      </label>
                      <button
                        onClick={handleRestoreOriginalColors}
                        className="text-[10px] text-purple-400 hover:text-purple-300 flex items-center gap-1"
                      >
                        <RotateCcw size={10} />
                        <span>Restaurar Cores Originais</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {READY_PALETTES.map((pal) => {
                        const isSelected = selectedPalette === pal.id;
                        const colorsToShow = pal.id === 'original' ? defaultColors : pal.colors;
                        return (
                          <button
                            key={pal.id}
                            type="button"
                            onClick={() => handleSelectPalette(pal.id)}
                            className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                              isSelected
                                ? 'bg-purple-950/40 border-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                                : 'bg-[#07060f] border-white/5 hover:border-purple-500/30'
                            }`}
                          >
                            <span className="text-xs font-semibold text-gray-200 truncate pr-2">
                              {pal.name}
                            </span>
                            <div className="flex items-center -space-x-1 shrink-0">
                              <span
                                className="w-4 h-4 rounded-full border border-black/50 shadow-sm"
                                style={{ backgroundColor: colorsToShow.primary }}
                              />
                              <span
                                className="w-4 h-4 rounded-full border border-black/50 shadow-sm"
                                style={{ backgroundColor: colorsToShow.secondary }}
                              />
                              <span
                                className="w-4 h-4 rounded-full border border-black/50 shadow-sm"
                                style={{ backgroundColor: colorsToShow.bg }}
                              />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Personalizar Cores Individuais */}
                  <div className="space-y-2.5 pt-3 border-t border-white/5">
                    <label className="text-xs font-bold text-gray-200 uppercase tracking-tight block">
                      Personalizar Cores
                    </label>

                    <div className="grid grid-cols-2 gap-2.5">
                      {/* Cor Principal */}
                      <div className="bg-[#07060f] p-2.5 rounded-xl border border-purple-500/20 space-y-1.5">
                        <span className="text-[10px] text-gray-400 font-mono block">COR PRINCIPAL</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={normalizeToHex7(customColors.primary, defaultColors.primary || '#d97706')}
                            onChange={(e) => handleColorChange('primary', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                          />
                          <span className="text-xs font-mono text-gray-300">
                            {customColors.primary || defaultColors.primary}
                          </span>
                        </div>
                      </div>

                      {/* Cor Secundária */}
                      <div className="bg-[#07060f] p-2.5 rounded-xl border border-purple-500/20 space-y-1.5">
                        <span className="text-[10px] text-gray-400 font-mono block">COR SECUNDÁRIA</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={normalizeToHex7(customColors.secondary, defaultColors.secondary || '#9333ea')}
                            onChange={(e) => handleColorChange('secondary', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                          />
                          <span className="text-xs font-mono text-gray-300">
                            {customColors.secondary || defaultColors.secondary}
                          </span>
                        </div>
                      </div>

                      {/* Fundo */}
                      <div className="bg-[#07060f] p-2.5 rounded-xl border border-purple-500/20 space-y-1.5">
                        <span className="text-[10px] text-gray-400 font-mono block">FUNDO (BG)</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={normalizeToHex7(customColors.bg, defaultColors.bg || '#08080c')}
                            onChange={(e) => handleColorChange('bg', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                          />
                          <span className="text-xs font-mono text-gray-300">
                            {customColors.bg || defaultColors.bg}
                          </span>
                        </div>
                      </div>

                      {/* Textos */}
                      <div className="bg-[#07060f] p-2.5 rounded-xl border border-purple-500/20 space-y-1.5">
                        <span className="text-[10px] text-gray-400 font-mono block">TEXTOS</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={normalizeToHex7(customColors.text, defaultColors.text || '#ffffff')}
                            onChange={(e) => handleColorChange('text', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                          />
                          <span className="text-xs font-mono text-gray-300">
                            {customColors.text || defaultColors.text}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. SEÇÃO: ESTILO DOS ÍCONES */}
            <div className="bg-[#0e0d1a] border border-purple-500/20 rounded-2xl overflow-hidden transition-all">
              <button
                onClick={() => toggleAccordion('icones')}
                className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#141224] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-pink-900/50 flex items-center justify-center text-pink-300">
                    <Sparkles size={14} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Estilo dos Ícones
                    </h3>
                    <p className="text-[11px] text-gray-400">Minimal, Glass, 3D, Brilhante ou Neon</p>
                  </div>
                </div>
                {openAccordions.icones ? (
                  <ChevronDown size={16} className="text-purple-400" />
                ) : (
                  <ChevronRight size={16} className="text-gray-500" />
                )}
              </button>

              {openAccordions.icones && (
                <div className="p-4 pt-1 space-y-3.5 border-t border-purple-500/10">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {[
                      { id: 'original', label: 'Original', desc: 'Padrão do Modelo' },
                      { id: 'minimal', label: 'Minimal', desc: 'Flat sem relevo' },
                      { id: 'glass', label: 'Glass', desc: 'Vidro translúcido' },
                      { id: '3d', label: '3D Alto-Relevo', desc: 'Bisel e profundidade' },
                      { id: 'brilliant', label: 'Brilhante', desc: 'Reflexo e brilho' },
                      { id: 'neon', label: 'Neon Glow', desc: 'Iluminação neon' },
                    ].map((st) => {
                      const isSelected = iconStyle === st.id;
                      return (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => handleIconStyleChange(st.id as IconStyleType)}
                          className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center gap-1.5 transition-all ${
                            isSelected
                              ? 'bg-purple-900/40 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.35)]'
                              : 'bg-[#07060f] border-white/5 hover:border-purple-500/30'
                          }`}
                        >
                          {/* Visual sample button */}
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${
                              st.id === 'minimal'
                                ? 'bg-white/5 border border-white/10'
                                : st.id === 'glass'
                                ? 'bg-white/10 backdrop-blur border border-white/30 shadow-lg'
                                : st.id === '3d'
                                ? 'bg-gradient-to-b from-[#252338] to-[#12111d] border border-white/10 shadow-[0_4px_0_#0a0912]'
                                : st.id === 'brilliant'
                                ? 'bg-gradient-to-tr from-white/20 to-white/5 border border-white/40 shadow-[0_0_10px_rgba(255,255,255,0.3)]'
                                : st.id === 'neon'
                                ? 'bg-[#0e0c1a] border border-purple-400 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.6)]'
                                : 'bg-[#181628] border border-purple-500/30'
                            }`}
                          >
                            <InstagramIcon size={18} />
                          </div>
                          <span className="text-xs font-bold text-gray-200">{st.label}</span>
                          <span className="text-[10px] text-gray-500">{st.desc}</span>
                        </button>
                      );
                    })}
                  </div>

                  <p className="text-[10px] text-gray-400 text-center">
                    ✓ Aplicado a todos os botões de redes sociais e contatos do biosite.
                  </p>
                </div>
              )}
            </div>

            {/* 4. SEÇÃO: TEXTOS PRINCIPAIS */}
            <div className="bg-[#0e0d1a] border border-purple-500/20 rounded-2xl overflow-hidden transition-all">
              <button
                onClick={() => toggleAccordion('textos')}
                className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#141224] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-purple-900/50 flex items-center justify-center text-purple-300">
                    <Type size={14} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Textos Principais
                    </h3>
                    <p className="text-[11px] text-gray-400">Headline e chamada de apresentação</p>
                  </div>
                </div>
                {openAccordions.textos ? (
                  <ChevronDown size={16} className="text-purple-400" />
                ) : (
                  <ChevronRight size={16} className="text-gray-500" />
                )}
              </button>

              {openAccordions.textos && (
                <div className="p-4 pt-1 space-y-4 border-t border-purple-500/10">
                  {/* Headline */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-200 block uppercase tracking-tight">
                      Título Principal / Headline
                    </label>
                    <div className="text-[11px] text-gray-400 bg-[#07060f] px-2.5 py-1 rounded-md border border-white/5">
                      Atual:{' '}
                      <span className="text-purple-300 font-semibold">
                        {template.fields.find((f) => f.id === 'headline')?.originalValue ||
                          'SEU ESTILO COMEÇA AQUI.'}
                      </span>
                    </div>
                    <input
                      id="field-input-headline"
                      type="text"
                      value={customValues['headline'] ?? ''}
                      onChange={(e) => handleFieldChange('headline', e.target.value)}
                      onFocus={() => notifyIframeToFocus('headline')}
                      placeholder="Ex: SEU ESTILO COMEÇA AQUI."
                      className="w-full bg-[#07060f] border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                  </div>

                  {/* Subtítulo */}
                  <div className="space-y-1.5 pt-2 border-t border-white/5">
                    <label className="text-xs font-bold text-gray-200 block uppercase tracking-tight">
                      Subtítulo / Descrição
                    </label>
                    <div className="text-[11px] text-gray-400 bg-[#07060f] px-2.5 py-1 rounded-md border border-white/5">
                      Atual:{' '}
                      <span className="text-purple-300 font-semibold">
                        {template.fields.find((f) => f.id === 'subtitulo')?.originalValue ||
                          'Precisão, personalidade e cuidado em cada detalhe.'}
                      </span>
                    </div>
                    <textarea
                      id="field-input-subtitulo"
                      rows={2}
                      value={customValues['subtitulo'] ?? ''}
                      onChange={(e) => handleFieldChange('subtitulo', e.target.value)}
                      onFocus={() => notifyIframeToFocus('subtitulo')}
                      placeholder="Ex: Precisão, personalidade e cuidado em cada detalhe."
                      className="w-full bg-[#07060f] border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 5. SEÇÃO: ESPECIALIDADES / SERVIÇOS */}
            {specialtyIndexes.length > 0 && (
              <div className="bg-[#0e0d1a] border border-purple-500/20 rounded-2xl overflow-hidden transition-all">
                <button
                  onClick={() => toggleAccordion('especialidades')}
                  className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#141224] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-purple-900/50 flex items-center justify-center text-purple-300">
                      <Layers size={14} />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                        Especialidades ({specialtyIndexes.length})
                      </h3>
                      <p className="text-[11px] text-gray-400">Serviços com foto, nome, descrição e preço</p>
                    </div>
                  </div>
                  {openAccordions.especialidades ? (
                    <ChevronDown size={16} className="text-purple-400" />
                  ) : (
                    <ChevronRight size={16} className="text-gray-500" />
                  )}
                </button>

                {openAccordions.especialidades && (
                  <div className="p-4 pt-1 space-y-4 border-t border-purple-500/10">
                    {specialtyIndexes.map((idx) => {
                      const nameKey = `esp_${idx}_nome`;
                      const priceKey = `esp_${idx}_preco`;
                      const descKey = `esp_${idx}_desc`;
                      const fotoKey = `esp_${idx}_foto`;

                      const nameVal = customValues[nameKey] ?? '';
                      const priceVal = customValues[priceKey] ?? '';
                      const descVal = customValues[descKey] ?? '';
                      const fotoVal = customValues[fotoKey] ?? '';

                      return (
                        <div
                          key={idx}
                          id={`field-input-esp_${idx}_card`}
                          className="bg-[#07060f] p-3 rounded-xl border border-purple-500/20 space-y-2.5"
                        >
                          <span className="text-xs font-bold text-purple-300 uppercase block">
                            #{idx} · {nameVal || `Item ${idx}`}
                          </span>

                          <div className="grid grid-cols-3 gap-2">
                            <div className="col-span-2 space-y-1">
                              <span className="text-[10px] text-gray-400 block font-mono">Nome:</span>
                              <input
                                id={`field-input-${nameKey}`}
                                type="text"
                                value={nameVal}
                                onChange={(e) => handleFieldChange(nameKey, e.target.value)}
                                onFocus={() => notifyIframeToFocus(nameKey)}
                                className="w-full bg-[#12111d] border border-purple-500/25 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
                              />
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] text-gray-400 block font-mono">Preço:</span>
                              <input
                                id={`field-input-${priceKey}`}
                                type="text"
                                value={priceVal}
                                onChange={(e) => handleFieldChange(priceKey, e.target.value)}
                                onFocus={() => notifyIframeToFocus(priceKey)}
                                className="w-full bg-[#12111d] border border-purple-500/25 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] text-gray-400 block font-mono">Descrição:</span>
                            <input
                              id={`field-input-${descKey}`}
                              type="text"
                              value={descVal}
                              onChange={(e) => handleFieldChange(descKey, e.target.value)}
                              onFocus={() => notifyIframeToFocus(descKey)}
                              className="w-full bg-[#12111d] border border-purple-500/25 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
                            />
                          </div>

                          {/* Foto da Especialidade */}
                          <div className="flex items-center gap-2 pt-1 border-t border-white/5">
                            {fotoVal && (
                              <img
                                src={fotoVal}
                                alt={`Foto ${idx}`}
                                className="w-10 h-10 rounded-lg object-cover border border-purple-500/30"
                              />
                            )}
                            <label className="flex-1 py-1.5 px-2 bg-[#141224] hover:bg-[#1d1a33] border border-purple-500/30 rounded-lg text-[11px] text-purple-300 font-semibold cursor-pointer text-center transition-colors">
                              Trocar Foto #{idx}
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageFileUpload(fotoKey, e)}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 6. SEÇÃO: GALERIA DE FOTOS */}
            {galleryFieldIds.length > 0 && (
              <div className="bg-[#0e0d1a] border border-purple-500/20 rounded-2xl overflow-hidden transition-all">
                <button
                  onClick={() => toggleAccordion('galeria')}
                  className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#141224] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-purple-900/50 flex items-center justify-center text-purple-300">
                      <ImageIcon size={14} />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                        Galeria ({galleryFieldIds.length} fotos)
                      </h3>
                      <p className="text-[11px] text-gray-400">Miniaturas e troca de imagens</p>
                    </div>
                  </div>
                  {openAccordions.galeria ? (
                    <ChevronDown size={16} className="text-purple-400" />
                  ) : (
                    <ChevronRight size={16} className="text-gray-500" />
                  )}
                </button>

                {openAccordions.galeria && (
                  <div className="p-4 pt-1 space-y-3 border-t border-purple-500/10">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {galleryFieldIds.map((key, i) => {
                        const val = customValues[key] || '';
                        return (
                          <div
                            key={key}
                            id={`field-input-${key}`}
                            className="bg-[#07060f] p-2 rounded-xl border border-purple-500/20 space-y-1.5 flex flex-col justify-between"
                          >
                            <div className="relative aspect-square rounded-lg overflow-hidden border border-purple-500/30 bg-[#12111d]">
                              {val ? (
                                <img
                                  src={val}
                                  alt={`Galeria ${i + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-600">
                                  <ImageIcon size={18} />
                                </div>
                              )}
                              <span className="absolute top-1 left-1 bg-black/70 text-[9px] font-mono font-bold text-white px-1.5 py-0.5 rounded">
                                #{i + 1}
                              </span>
                            </div>

                            <label className="block text-center py-1 px-1 bg-[#141224] hover:bg-[#1d1a33] text-[10px] font-semibold text-purple-300 rounded-lg cursor-pointer border border-purple-500/20 transition-colors">
                              Trocar
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageFileUpload(key, e)}
                                className="hidden"
                              />
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 7. SEÇÃO: WHATSAPP */}
            <div className="bg-[#0e0d1a] border border-purple-500/20 rounded-2xl overflow-hidden transition-all">
              <button
                onClick={() => toggleAccordion('whatsapp')}
                className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#141224] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-950 flex items-center justify-center text-emerald-400">
                    <WhatsAppIcon size={14} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">WhatsApp</h3>
                    <p className="text-[11px] text-gray-400">Número direto, mensagem e visibilidade</p>
                  </div>
                </div>
                {openAccordions.whatsapp ? (
                  <ChevronDown size={16} className="text-purple-400" />
                ) : (
                  <ChevronRight size={16} className="text-gray-500" />
                )}
              </button>

              {openAccordions.whatsapp && (
                <div className="p-4 pt-1 space-y-4 border-t border-purple-500/10">
                  {/* Toggle Mostrar no Biosite */}
                  <div className="flex items-center justify-between p-2.5 bg-[#07060f] rounded-xl border border-white/5">
                    <span className="text-xs font-semibold text-gray-200">Mostrar no Biosite:</span>
                    <button
                      type="button"
                      onClick={() =>
                        handleSocialItemUpdate('whatsapp', {
                          enabled: !socialsConfig.whatsapp?.enabled,
                        })
                      }
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                        socialsConfig.whatsapp?.enabled
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-800 text-gray-400'
                      }`}
                    >
                      {socialsConfig.whatsapp?.enabled ? 'ATIVADO' : 'DESATIVADO'}
                    </button>
                  </div>

                  {/* Número WhatsApp */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-200 block uppercase tracking-tight">
                      Número do WhatsApp
                    </label>
                    <input
                      id="field-input-whatsapp_phone"
                      type="text"
                      value={formatPhoneDisplay(whatsAppPhone)}
                      onChange={(e) => handleWhatsAppChange(e.target.value, whatsAppMessage)}
                      onFocus={() => notifyIframeToFocus('whatsapp')}
                      placeholder="(31) 99999-9999"
                      className="w-full bg-[#07060f] border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                    <p className="text-[10px] text-gray-400">
                      Normalizado automaticamente para formato internacional (ex: 55{whatsAppPhone.replace(/\D/g, '')}).
                    </p>
                  </div>

                  {/* Mensagem de Abertura */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-gray-200 block uppercase tracking-tight">
                        Mensagem de Abertura
                      </label>
                      <button
                        onClick={() => {
                          const suggested = getSuggestedWhatsAppMessage(template.nicheId, companyName);
                          handleWhatsAppChange(whatsAppPhone, suggested);
                        }}
                        className="text-[10px] text-purple-400 hover:text-purple-300"
                      >
                        Sugerir pelo nicho
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      value={whatsAppMessage}
                      onChange={(e) => handleWhatsAppChange(whatsAppPhone, e.target.value)}
                      onFocus={() => notifyIframeToFocus('whatsapp')}
                      placeholder="Olá! Vim pelo site..."
                      className="w-full bg-[#07060f] border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
                    />
                  </div>

                  {/* Test button & Link preview */}
                  <div className="p-3 bg-[#07060f] rounded-xl border border-emerald-500/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-emerald-400 font-semibold uppercase flex items-center gap-1">
                        <Check size={11} /> Link Gerado
                      </span>
                      <a
                        href={buildWhatsAppUrl(whatsAppPhone, whatsAppMessage)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-[0_2px_8px_rgba(16,185,129,0.3)]"
                      >
                        <span>TESTAR WHATSAPP</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                    <div className="text-[10px] text-gray-400 font-mono truncate">
                      {buildWhatsAppUrl(whatsAppPhone, whatsAppMessage)}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 8. SEÇÃO: REDES SOCIAIS (INSTAGRAM, FACEBOOK, TIKTOK, YOUTUBE) */}
            <div className="bg-[#0e0d1a] border border-purple-500/20 rounded-2xl overflow-hidden transition-all">
              <button
                onClick={() => toggleAccordion('redes')}
                className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#141224] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-pink-950 flex items-center justify-center text-pink-400">
                    <Share2 size={14} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Redes Sociais
                    </h3>
                    <p className="text-[11px] text-gray-400">
                      Instagram, Facebook, TikTok e YouTube
                    </p>
                  </div>
                </div>
                {openAccordions.redes ? (
                  <ChevronDown size={16} className="text-purple-400" />
                ) : (
                  <ChevronRight size={16} className="text-gray-500" />
                )}
              </button>

              {openAccordions.redes && (
                <div className="p-4 pt-1 space-y-4 border-t border-purple-500/10">
                  {/* Instagram */}
                  <div className="p-3 bg-[#07060f] rounded-xl border border-pink-500/20 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <InstagramIcon size={14} className="text-pink-400" />
                        <span className="text-xs font-bold text-white uppercase">Instagram</span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleSocialItemUpdate('instagram', {
                            enabled: !socialsConfig.instagram?.enabled,
                          })
                        }
                        className={`px-2.5 py-0.5 text-[11px] font-bold rounded-lg transition-all ${
                          socialsConfig.instagram?.enabled
                            ? 'bg-pink-600 text-white'
                            : 'bg-gray-800 text-gray-400'
                        }`}
                      >
                        {socialsConfig.instagram?.enabled ? 'ATIVADO' : 'DESATIVADO'}
                      </button>
                    </div>

                    <input
                      id="field-input-instagram"
                      type="text"
                      value={instagramInput}
                      onChange={(e) => handleInstagramChange(e.target.value)}
                      onFocus={() => notifyIframeToFocus('instagram')}
                      placeholder="@blackcrownbarber"
                      className="w-full bg-[#12111d] border border-purple-500/25 rounded-xl px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    />

                    {instagramInput && (
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-purple-300 font-mono truncate max-w-[200px]">
                          {normalizeInstagram(instagramInput).url}
                        </span>
                        <a
                          href={normalizeInstagram(instagramInput).url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-pink-400 hover:text-pink-300 font-semibold"
                        >
                          <span>TESTAR LINK</span>
                          <ExternalLink size={11} />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Facebook (se ativado ou adicionado) */}
                  {socialsConfig.facebook?.enabled && (
                    <div className="p-3 bg-[#07060f] rounded-xl border border-blue-500/20 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-400 uppercase">Facebook</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSocialNetwork('facebook')}
                          className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1"
                        >
                          <Trash2 size={11} /> Remover
                        </button>
                      </div>

                      <input
                        type="text"
                        value={socialsConfig.facebook.url}
                        onChange={(e) => {
                          const norm = normalizeFacebook(e.target.value);
                          handleSocialItemUpdate('facebook', { url: norm });
                        }}
                        placeholder="https://facebook.com/minhapagina"
                        className="w-full bg-[#12111d] border border-purple-500/25 rounded-xl px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                      />

                      {socialsConfig.facebook.url && (
                        <div className="flex justify-end pt-1">
                          <a
                            href={socialsConfig.facebook.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 font-semibold"
                          >
                            <span>TESTAR LINK</span>
                            <ExternalLink size={11} />
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TikTok (se ativado ou adicionado) */}
                  {socialsConfig.tiktok?.enabled && (
                    <div className="p-3 bg-[#07060f] rounded-xl border border-teal-500/20 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-teal-400 uppercase">TikTok</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSocialNetwork('tiktok')}
                          className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1"
                        >
                          <Trash2 size={11} /> Remover
                        </button>
                      </div>

                      <input
                        type="text"
                        value={socialsConfig.tiktok.url}
                        onChange={(e) => {
                          const norm = normalizeTikTok(e.target.value);
                          handleSocialItemUpdate('tiktok', { url: norm.url });
                        }}
                        placeholder="@meutiktok ou https://tiktok.com/@meutiktok"
                        className="w-full bg-[#12111d] border border-purple-500/25 rounded-xl px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                      />

                      {socialsConfig.tiktok.url && (
                        <div className="flex justify-end pt-1">
                          <a
                            href={socialsConfig.tiktok.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-teal-400 hover:text-teal-300 font-semibold"
                          >
                            <span>TESTAR LINK</span>
                            <ExternalLink size={11} />
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {/* YouTube (se ativado ou adicionado) */}
                  {socialsConfig.youtube?.enabled && (
                    <div className="p-3 bg-[#07060f] rounded-xl border border-red-500/20 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-red-400 uppercase">YouTube</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSocialNetwork('youtube')}
                          className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1"
                        >
                          <Trash2 size={11} /> Remover
                        </button>
                      </div>

                      <input
                        type="text"
                        value={socialsConfig.youtube.url}
                        onChange={(e) => {
                          const norm = normalizeYouTube(e.target.value);
                          handleSocialItemUpdate('youtube', { url: norm });
                        }}
                        placeholder="https://youtube.com/@meucanal"
                        className="w-full bg-[#12111d] border border-purple-500/25 rounded-xl px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                      />

                      {socialsConfig.youtube.url && (
                        <div className="flex justify-end pt-1">
                          <a
                            href={socialsConfig.youtube.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 font-semibold"
                          >
                            <span>TESTAR LINK</span>
                            <ExternalLink size={11} />
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Botão + ADICIONAR REDE SOCIAL */}
                  {(!socialsConfig.facebook?.enabled ||
                    !socialsConfig.tiktok?.enabled ||
                    !socialsConfig.youtube?.enabled) && (
                    <div className="pt-2">
                      <span className="text-[10px] text-gray-400 font-mono block mb-1.5 uppercase">
                        + Adicionar Rede Social:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {!socialsConfig.facebook?.enabled && (
                          <button
                            type="button"
                            onClick={() => handleAddSocialNetwork('facebook')}
                            className="px-2.5 py-1.5 bg-[#141224] hover:bg-[#1d1a33] text-blue-300 text-xs font-semibold rounded-xl border border-blue-500/30 flex items-center gap-1 transition-all"
                          >
                            <Plus size={12} /> Facebook
                          </button>
                        )}
                        {!socialsConfig.tiktok?.enabled && (
                          <button
                            type="button"
                            onClick={() => handleAddSocialNetwork('tiktok')}
                            className="px-2.5 py-1.5 bg-[#141224] hover:bg-[#1d1a33] text-teal-300 text-xs font-semibold rounded-xl border border-teal-500/30 flex items-center gap-1 transition-all"
                          >
                            <Plus size={12} /> TikTok
                          </button>
                        )}
                        {!socialsConfig.youtube?.enabled && (
                          <button
                            type="button"
                            onClick={() => handleAddSocialNetwork('youtube')}
                            className="px-2.5 py-1.5 bg-[#141224] hover:bg-[#1d1a33] text-red-300 text-xs font-semibold rounded-xl border border-red-500/30 flex items-center gap-1 transition-all"
                          >
                            <Plus size={12} /> YouTube
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 9. SEÇÃO: LOCALIZAÇÃO & ENDEREÇO */}
            <div className="bg-[#0e0d1a] border border-purple-500/20 rounded-2xl overflow-hidden transition-all">
              <button
                onClick={() => toggleAccordion('localizacao')}
                className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#141224] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-amber-950 flex items-center justify-center text-amber-400">
                    <MapPin size={14} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Localização & Endereço
                    </h3>
                    <p className="text-[11px] text-gray-400">Endereço textual e link do Google Maps</p>
                  </div>
                </div>
                {openAccordions.localizacao ? (
                  <ChevronDown size={16} className="text-purple-400" />
                ) : (
                  <ChevronRight size={16} className="text-gray-500" />
                )}
              </button>

              {openAccordions.localizacao && (
                <div className="p-4 pt-1 space-y-4 border-t border-purple-500/10">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-200 block uppercase tracking-tight">
                      Endereço Exibido no Site
                    </label>
                    <input
                      id="field-input-endereco"
                      type="text"
                      value={customValues['endereco'] ?? ''}
                      onChange={(e) => handleFieldChange('endereco', e.target.value)}
                      onFocus={() => notifyIframeToFocus('endereco')}
                      placeholder="Ex: Av. Imperial, 725 — Centro — Belo Horizonte/MG"
                      className="w-full bg-[#07060f] border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-gray-200 block uppercase tracking-tight">
                        Link do Google Maps
                      </label>
                      {customValues['maps'] && (
                        <a
                          href={customValues['maps']}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold"
                        >
                          <span>TESTAR LOCALIZAÇÃO</span>
                          <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                    <input
                      id="field-input-maps"
                      type="url"
                      value={customValues['maps'] ?? ''}
                      onChange={(e) => handleFieldChange('maps', e.target.value)}
                      onFocus={() => notifyIframeToFocus('maps')}
                      placeholder="https://maps.app.goo.gl/..."
                      className="w-full bg-[#07060f] border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 10. SEÇÃO: GOOGLE REVIEW */}
            <div className="bg-[#0e0d1a] border border-purple-500/20 rounded-2xl overflow-hidden transition-all">
              <button
                onClick={() => toggleAccordion('google_review')}
                className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#141224] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-yellow-950 flex items-center justify-center text-yellow-400">
                    <Star size={14} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Avaliação Google
                    </h3>
                    <p className="text-[11px] text-gray-400">Link para coletar avaliações 5 estrelas</p>
                  </div>
                </div>
                {openAccordions.google_review ? (
                  <ChevronDown size={16} className="text-purple-400" />
                ) : (
                  <ChevronRight size={16} className="text-gray-500" />
                )}
              </button>

              {openAccordions.google_review && (
                <div className="p-4 pt-1 space-y-3.5 border-t border-purple-500/10">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-gray-200 block uppercase tracking-tight">
                        Link de Avaliação Google
                      </label>
                      {customValues['google_review'] && (
                        <a
                          href={customValues['google_review']}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-yellow-400 hover:text-yellow-300 flex items-center gap-1 font-semibold"
                        >
                          <span>TESTAR AVALIAÇÃO</span>
                          <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                    <input
                      id="field-input-google_review"
                      type="url"
                      value={customValues['google_review'] ?? ''}
                      onChange={(e) => handleFieldChange('google_review', e.target.value)}
                      onFocus={() => notifyIframeToFocus('google_review')}
                      placeholder="https://g.page/r/.../review"
                      className="w-full bg-[#07060f] border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 11. SEÇÃO: HORÁRIOS */}
            <div className="bg-[#0e0d1a] border border-purple-500/20 rounded-2xl overflow-hidden transition-all">
              <button
                onClick={() => toggleAccordion('horarios')}
                className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#141224] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-blue-950 flex items-center justify-center text-blue-400">
                    <Clock size={14} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Horários</h3>
                    <p className="text-[11px] text-gray-400">Dias e horários de funcionamento</p>
                  </div>
                </div>
                {openAccordions.horarios ? (
                  <ChevronDown size={16} className="text-purple-400" />
                ) : (
                  <ChevronRight size={16} className="text-gray-500" />
                )}
              </button>

              {openAccordions.horarios && (
                <div className="p-4 pt-1 space-y-3.5 border-t border-purple-500/10">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-200 block uppercase tracking-tight">
                      Horário de Funcionamento
                    </label>
                    <input
                      id="field-input-horario"
                      type="text"
                      value={customValues['horario'] ?? ''}
                      onChange={(e) => handleFieldChange('horario', e.target.value)}
                      onFocus={() => notifyIframeToFocus('horario')}
                      placeholder="Terça a Sábado: 09h às 20h"
                      className="w-full bg-[#07060f] border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* ════════════════════════════════════════════════════════
            RIGHT COLUMN: REAL LIVE PREVIEW (NO RELOAD ON KEYSTROKE)
           ════════════════════════════════════════════════════════ */}
        <main
          className={`flex-1 bg-[#040407] flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden relative ${
            mobileTab === 'preview' ? 'flex' : 'hidden md:flex'
          }`}
        >
          {/* Top Interactive Inspector Bar */}
          <div className="w-full max-w-[420px] mb-2 flex items-center justify-between px-1 shrink-0 z-10">
            <button
              type="button"
              onClick={() => {
                const next = !inspectorActive;
                setInspectorActive(next);
                if (!next) {
                  handleDeselectElement();
                }
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 ${
                inspectorActive
                  ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)] ring-2 ring-purple-400/40'
                  : 'bg-[#121020] text-gray-400 hover:text-white border border-purple-500/20'
              }`}
            >
              <MousePointerClick size={14} className={inspectorActive ? 'animate-pulse text-purple-200' : ''} />
              <span>✦ Editar pelo Preview: {inspectorActive ? 'ATIVADO' : 'DESATIVADO'}</span>
            </button>

            {inspectorActive && (
              <span className="text-[11px] text-purple-300 font-medium hidden sm:inline animate-pulse">
                Toque em um item para editar
              </span>
            )}
          </div>

          {/* Device Mockup Shell */}
          <div
            className={`transition-all duration-300 flex flex-col overflow-hidden ${
              deviceView === 'mobile'
                ? 'w-full max-w-[420px] h-full max-h-[860px] rounded-3xl border-2 sm:border-4 border-[#1e1c32] shadow-[0_25px_60px_rgba(0,0,0,0.9)] bg-black'
                : 'w-full h-full rounded-2xl border border-purple-500/20 bg-black shadow-2xl'
            }`}
          >
            {/* Top Phone Notch (Only on Mobile View) */}
            {deviceView === 'mobile' && (
              <div className="h-5 bg-[#0a0a0f] flex items-center justify-center shrink-0 border-b border-white/5">
                <div className="w-16 h-1 rounded-full bg-white/20" />
              </div>
            )}

            {/* Real-time Preview iframe with initial compiled HTML */}
            <iframe
              ref={iframeRef}
              srcDoc={initialHtml}
              title="Preview Real do Biosite"
              className="w-full h-full border-none bg-black"
              sandbox="allow-scripts allow-same-origin allow-popups"
            />
          </div>

          {/* ─────────────────────────────────────────────────────────
              VISUAL INSPECTOR: DESKTOP FLOATING CARD
             ───────────────────────────────────────────────────────── */}
          {inspectorActive && selectedElement && (
            <div className="hidden md:flex absolute top-4 right-4 z-40 w-84 md:w-96 max-h-[85vh] bg-[#0c0a1a]/95 backdrop-blur-xl border border-purple-500/40 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] p-4 flex-col overflow-y-auto animate-in fade-in zoom-in-95">
              {renderInspectorContent()}
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────
              VISUAL INSPECTOR: MOBILE BOTTOM SHEET
             ───────────────────────────────────────────────────────── */}
          {inspectorActive && selectedElement && (
            <div className="md:hidden fixed inset-x-0 bottom-0 z-50 max-h-[58vh] bg-[#0e0c1f]/98 backdrop-blur-2xl border-t-2 border-purple-500/40 rounded-t-3xl shadow-[0_-15px_40px_rgba(0,0,0,0.9)] p-4 pb-8 flex flex-col overflow-y-auto animate-in slide-in-from-bottom-5">
              <div className="w-12 h-1 bg-white/20 rounded-full mx-auto shrink-0 mb-2" />
              {renderInspectorContent()}
            </div>
          )}
        </main>
      </div>

      {/* ─────────────────────────────────────────────────────────
          LOGO PREVIEW & BACKGROUND REMOVAL MODAL
         ───────────────────────────────────────────────────────── */}
      {logoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0e0d1c] border border-purple-500/30 rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.95)] space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-purple-600/30 flex items-center justify-center text-purple-300">
                  <ImageIcon size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Preview da Logomarca</h3>
                  <p className="text-[11px] text-gray-400">Verifique a transparência e fundo da imagem</p>
                </div>
              </div>
              <button
                onClick={() => setLogoModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"
              >
                <X size={16} />
              </button>
            </div>

            {/* Transparência detectada alert */}
            {hasDetectedTransparency && (
              <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-emerald-300 text-xs">
                <Check size={14} className="shrink-0" />
                <span>✓ Fundo transparente detectado nativamente no arquivo PNG!</span>
              </div>
            )}

            {/* Side-by-side or Choice Preview */}
            <div className="grid grid-cols-2 gap-3">
              {/* Option 1: Original */}
              <div
                onClick={() => setSelectedBgChoice('original')}
                className={`p-3 rounded-2xl border cursor-pointer flex flex-col items-center gap-2 transition-all ${
                  selectedBgChoice === 'original'
                    ? 'bg-purple-950/40 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                    : 'bg-[#07060f] border-white/5 hover:border-purple-500/30'
                }`}
              >
                <div className="w-24 h-24 rounded-xl bg-[#141224] border border-white/10 flex items-center justify-center p-2 overflow-hidden">
                  <img
                    src={originalLogoSrc}
                    alt="Original"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="text-center">
                  <span className="text-xs font-bold text-white block">Original</span>
                  <span className="text-[10px] text-gray-400">Manter como está</span>
                </div>
              </div>

              {/* Option 2: Sem Fundo (Automático) */}
              <div
                onClick={() => {
                  if (removedBgLogoSrc) setSelectedBgChoice('removed');
                }}
                className={`p-3 rounded-2xl border cursor-pointer flex flex-col items-center gap-2 transition-all ${
                  selectedBgChoice === 'removed'
                    ? 'bg-purple-950/40 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                    : 'bg-[#07060f] border-white/5 hover:border-purple-500/30'
                }`}
              >
                <div className="w-24 h-24 rounded-xl border border-white/10 flex items-center justify-center p-2 overflow-hidden bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:8px_8px] bg-[#12111d]">
                  {isProcessingRemoval ? (
                    <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                  ) : removedBgLogoSrc ? (
                    <img
                      src={removedBgLogoSrc}
                      alt="Sem fundo"
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <span className="text-[10px] text-gray-500">Erro</span>
                  )}
                </div>
                <div className="text-center">
                  <span className="text-xs font-bold text-white block">Sem Fundo</span>
                  <span className="text-[10px] text-gray-400">Fundo removido</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
              <button
                type="button"
                onClick={() => setLogoModalOpen(false)}
                className="px-4 py-2 bg-[#141224] hover:bg-[#1d1a35] text-gray-300 text-xs font-bold rounded-xl transition-all"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmLogoModal}
                className="px-5 py-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white text-xs font-bold rounded-xl shadow-[0_0_15px_rgba(147,51,234,0.4)] transition-all"
              >
                {selectedBgChoice === 'removed' ? 'Usar Sem Fundo' : 'Usar Original'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────
          DOWNLOAD / EXPORT MODAL: BAIXAR BIOSITE
         ───────────────────────────────────────────────────────── */}
      {downloadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0e0d1c] border border-purple-500/30 rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.9)] space-y-5 animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
                  <Check size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Seu Biosite Está Pronto!</h3>
                  <p className="text-xs text-gray-400">Escolha como deseja exportar seu site</p>
                </div>
              </div>
              <button
                onClick={() => setDownloadModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"
              >
                <X size={18} />
              </button>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {/* Option 1: ZIP Completo */}
              <button
                onClick={handleDownloadZip}
                disabled={downloadingZip}
                className="w-full p-4 bg-[#141226] hover:bg-[#1d1a38] border border-purple-500/30 hover:border-purple-400 rounded-2xl flex items-center justify-between text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-600/30 flex items-center justify-center text-purple-300 group-hover:scale-105 transition-transform">
                    <Download size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-purple-200">
                      {downloadingZip ? 'Gerando Pacote ZIP...' : 'Baixar ZIP para Hospedagem'}
                    </h4>
                    <p className="text-xs text-gray-400">
                      Inclui index.html, imagens e biofacil.json. Pronto para Netlify, Vercel ou Hostinger.
                    </p>
                  </div>
                </div>
              </button>

              {/* Option 2: Single HTML */}
              <button
                onClick={handleDownloadHtmlFile}
                className="w-full p-4 bg-[#141226] hover:bg-[#1d1a38] border border-purple-500/30 hover:border-purple-400 rounded-2xl flex items-center justify-between text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-600/30 flex items-center justify-center text-violet-300 group-hover:scale-105 transition-transform">
                    <FileCode size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-purple-200">
                      Baixar index.html Standalone
                    </h4>
                    <p className="text-xs text-gray-400">
                      Arquivo único auto-contido com todas as suas personalizações prontas.
                    </p>
                  </div>
                </div>
              </button>
            </div>

            {/* Footer Notice */}
            <p className="text-[11px] text-gray-500 text-center leading-relaxed">
              O site gerado é 100% estático, ultra-rápido e não depende de mensalidades ou servidores complexos.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
