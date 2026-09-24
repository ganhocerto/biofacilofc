import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { BiositeTemplate, EditableField, UserProject } from '../types';
import {
  compileBiositeHtml,
  injectVisualInspectorScript,
  cleanTextContent,
  normalizeWhatsAppNumber,
  formatPhoneDisplay,
  parseWhatsAppUrl,
  getSuggestedWhatsAppMessage,
  buildWhatsAppUrl,
  normalizeInstagram,
} from '../utils/htmlAnalyzer';
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
  ArrowUp,
  ArrowDown,
  Link,
  MapPin,
  Clock,
  Star,
  Type,
  Phone,
  Layers,
  AlertCircle,
  X,
  FileCode,
  Sliders,
  Store,
} from 'lucide-react';

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

  // Status of changes
  const [isSaved, setIsSaved] = useState(true);
  const [saving, setSaving] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);

  // Inspector Mode & Viewport
  const [inspectorActive, setInspectorActive] = useState(true);
  const [deviceView, setDeviceView] = useState<'mobile' | 'desktop'>('mobile');
  const [mobileTab, setMobileTab] = useState<'preview' | 'editor'>('preview');

  // Accordion open states
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    identidade: true,
    textos: true,
    especialidades: true,
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

  // Active focused field
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);

  // Logo URL input temporary state & error
  const [logoUrlInput, setLogoUrlInput] = useState('');
  const [logoUrlError, setLogoUrlError] = useState('');
  const [logoUrlSuccess, setLogoUrlSuccess] = useState(false);

  // Ref for Preview iframe
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Map of all fields (from template.fields or extracted)
  const fields = useMemo(() => template.fields, [template.fields]);

  // Master state of custom values: fieldId -> customized value
  const [customValues, setCustomValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    template.fields.forEach((f) => {
      initial[f.id] = existingProject?.customValues?.[f.id] ?? f.originalValue ?? '';
    });
    return initial;
  });

  // Company Name helper
  const companyName = customValues['nome_empresa'] || template.fields.find(f => f.id === 'nome_empresa')?.originalValue || 'Minha Empresa';

  // WhatsApp state helpers
  const initialWhatsAppRaw = customValues['whatsapp'] || template.fields.find(f => f.id === 'whatsapp')?.originalValue || '';
  const parsedWhatsApp = useMemo(() => parseWhatsAppUrl(initialWhatsAppRaw), [initialWhatsAppRaw]);

  const [whatsAppPhone, setWhatsAppPhone] = useState(() => parsedWhatsApp.phone || '31999999999');
  const [whatsAppMessage, setWhatsAppMessage] = useState(() => {
    if (parsedWhatsApp.message) return parsedWhatsApp.message;
    return getSuggestedWhatsAppMessage(template.nicheId || template.nicheName, companyName);
  });

  // Instagram state helper
  const initialInstagramRaw = customValues['instagram'] || template.fields.find(f => f.id === 'instagram')?.originalValue || '';
  const [instagramInput, setInstagramInput] = useState(() => {
    const norm = normalizeInstagram(initialInstagramRaw);
    return norm.handle || '@blackcrownbarber';
  });

  // Gallery items helper
  const galleryFieldIds = useMemo(() => {
    return fields.filter(f => f.id.startsWith('galeria_') || f.group === 'Galeria').map(f => f.id);
  }, [fields]);

  // Repeatable specialties/services helper
  const specialtyIndexes = useMemo(() => {
    const idxs = new Set<number>();
    fields.forEach(f => {
      const match = f.id.match(/^esp_(\d+)_/);
      if (match) idxs.add(parseInt(match[1], 10));
    });
    return Array.from(idxs).sort((a, b) => a - b);
  }, [fields]);

  // Auto carousel settings state
  const [carouselActive, setCarouselActive] = useState(true);
  const [carouselInterval, setCarouselInterval] = useState(4);

  // Mark modified
  const markModified = () => {
    setIsSaved(false);
  };

  /**
   * Directly update DOM elements in the preview iframe WITHOUT full reload
   */
  const updateIframeDom = useCallback((fieldId: string, value: string) => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;

    // 1. Text elements
    const textEls = doc.querySelectorAll(`[data-bio-text="${fieldId}"]`);
    if (textEls.length > 0) {
      textEls.forEach(el => {
        el.textContent = value;
      });
      return;
    }

    // 2. Image elements
    const imgEls = doc.querySelectorAll(`[data-bio-image="${fieldId}"]`);
    if (imgEls.length > 0) {
      imgEls.forEach(el => {
        (el as HTMLImageElement).src = value;
      });
      return;
    }

    // 3. Link elements
    const linkEls = doc.querySelectorAll(`[data-bio-link="${fieldId}"]`);
    if (linkEls.length > 0) {
      linkEls.forEach(el => {
        (el as HTMLAnchorElement).href = value;
      });
      return;
    }

    // 4. Fallback search by ID or Selector
    const field = fields.find(f => f.id === fieldId);
    if (field?.selector) {
      const el = doc.querySelector(field.selector);
      if (el) {
        if (field.attr === 'src') (el as HTMLImageElement).src = value;
        else if (field.attr === 'href') (el as HTMLAnchorElement).href = value;
        else el.textContent = value;
      }
    }
  }, [fields]);

  // Change single field value
  const handleFieldChange = (fieldId: string, value: string) => {
    markModified();
    setCustomValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
    updateIframeDom(fieldId, value);
  };

  // WhatsApp Handler
  const handleWhatsAppChange = (newPhone: string, newMsg: string) => {
    markModified();
    setWhatsAppPhone(newPhone);
    setWhatsAppMessage(newMsg);
    const generatedUrl = buildWhatsAppUrl(newPhone, newMsg);
    setCustomValues((prev) => ({
      ...prev,
      whatsapp: generatedUrl,
    }));
    updateIframeDom('whatsapp', generatedUrl);
  };

  // Instagram Handler
  const handleInstagramChange = (input: string) => {
    markModified();
    setInstagramInput(input);
    const norm = normalizeInstagram(input);
    const finalUrl = norm.url || input;
    setCustomValues((prev) => ({
      ...prev,
      instagram: finalUrl,
    }));
    updateIframeDom('instagram', finalUrl);
  };

  // Image Upload handler (Base64 transparent safe)
  const handleImageFileUpload = (fieldId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        handleFieldChange(fieldId, reader.result);
        if (fieldId === 'logo') {
          setLogoUrlSuccess(true);
          setTimeout(() => setLogoUrlSuccess(false), 2500);
        }
      }
    };
    reader.readAsDataURL(file);
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

  // Listen for messages from the Preview iframe ("✦ EDITAR PELO PREVIEW")
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (!e.data || e.data.type !== 'BIO_FACIL_ELEMENT_CLICKED') return;
      const { fieldId } = e.data;
      if (!fieldId) return;

      setActiveFieldId(fieldId);

      // Open appropriate accordion
      if (fieldId === 'logo' || fieldId === 'nome_empresa') {
        setOpenAccordions(p => ({ ...p, identidade: true }));
      } else if (fieldId === 'headline' || fieldId === 'subtitulo') {
        setOpenAccordions(p => ({ ...p, textos: true }));
      } else if (fieldId.startsWith('esp_')) {
        setOpenAccordions(p => ({ ...p, especialidades: true }));
      } else if (fieldId.startsWith('galeria_')) {
        setOpenAccordions(p => ({ ...p, galeria: true }));
      } else if (fieldId === 'whatsapp') {
        setOpenAccordions(p => ({ ...p, whatsapp: true }));
      } else if (fieldId === 'instagram') {
        setOpenAccordions(p => ({ ...p, redes: true }));
      } else if (fieldId === 'endereco' || fieldId === 'maps') {
        setOpenAccordions(p => ({ ...p, localizacao: true }));
      } else if (fieldId === 'google_review') {
        setOpenAccordions(p => ({ ...p, google_review: true }));
      } else if (fieldId === 'horario') {
        setOpenAccordions(p => ({ ...p, horarios: true }));
      }

      // Switch to editor tab on mobile
      setMobileTab('editor');

      // Scroll to that element card in editor
      setTimeout(() => {
        const el = document.getElementById(`field-input-${fieldId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.focus();
        }
      }, 150);
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
    const compiled = compileBiositeHtml(template.htmlContent, template.fields, customValues);
    return injectVisualInspectorScript(compiled, inspectorActive);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template.id]);

  // Save to Firestore
  const handleSaveProject = async () => {
    if (!currentUser) return;
    setSaving(true);
    try {
      const projectId = existingProject?.id || `proj_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      const cleanCompiled = compileBiositeHtml(template.htmlContent, template.fields, customValues);

      const projectData: UserProject = {
        id: projectId,
        userId: currentUser.uid,
        userEmail: currentUser.email || '',
        templateId: template.id,
        nicheId: template.nicheId,
        name: projectName.trim() || 'Meu Biosite',
        slug: projectName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        customValues,
        htmlCompiled: cleanCompiled,
        createdAt: existingProject?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await saveProject(projectData);
      setIsSaved(true);
      if (onSavedSuccess) onSavedSuccess(projectData);
    } catch (err) {
      console.error('Erro ao salvar projeto no Firestore:', err);
    } finally {
      setSaving(false);
    }
  };

  // Debounced auto-save (after 3 seconds of inactivity)
  useEffect(() => {
    if (isSaved) return;
    const timer = setTimeout(() => {
      handleSaveProject();
    }, 3000);
    return () => clearTimeout(timer);
  }, [customValues, isSaved]);

  // Download ZIP
  const handleDownloadZip = async () => {
    setDownloadingZip(true);
    try {
      const cleanCompiled = compileBiositeHtml(template.htmlContent, template.fields, customValues);
      const manifest = {
        templateId: template.id,
        name: projectName,
        category: template.nicheName,
        version: template.version,
        fields: template.fields,
      };
      await downloadBiositeZip(projectName, cleanCompiled, manifest);
      setDownloadModalOpen(false);
    } finally {
      setDownloadingZip(false);
    }
  };

  // Download Single HTML file
  const handleDownloadHtmlFile = () => {
    const cleanCompiled = compileBiositeHtml(template.htmlContent, template.fields, customValues);
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
    const cleanCompiled = compileBiositeHtml(template.htmlContent, template.fields, customValues);
    await navigator.clipboard.writeText(cleanCompiled);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
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
          
          {/* Saved Status Indicator */}
          <div className="flex items-center">
            {isSaved ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-950/50 text-emerald-300 border border-emerald-500/30">
                <Check size={12} className="text-emerald-400" />
                <span className="hidden xs:inline">SALVO</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-950/60 text-amber-300 border border-amber-500/40 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                <span className="hidden xs:inline">ALTERAÇÕES NÃO SALVAS</span>
              </span>
            )}
          </div>

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

        {/* Right: Actions (Salvar & Baixar) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={handleSaveProject}
            disabled={saving || isSaved}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              isSaved
                ? 'bg-[#151424] text-gray-400 border border-white/5 cursor-default'
                : 'bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white shadow-[0_0_15px_rgba(147,51,234,0.4)] active:scale-95'
            }`}
          >
            <Save size={14} />
            <span className="hidden sm:inline">{saving ? 'Salvando...' : 'Salvar'}</span>
          </button>

          <button
            onClick={() => setDownloadModalOpen(true)}
            className="px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-[0_2px_12px_rgba(147,51,234,0.35)] transition-all active:scale-95"
            title="Baixar Biosite"
          >
            <Download size={14} />
            <span>Baixar Biosite</span>
          </button>
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

          <div className="p-4 space-y-3.5">
            
            {/* 1. SEÇÃO: IDENTIDADE (NOME & LOGOMARCA) */}
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
                {openAccordions.identidade ? <ChevronDown size={16} className="text-purple-400" /> : <ChevronRight size={16} className="text-gray-500" />}
              </button>

              {openAccordions.identidade && (
                <div className="p-4 pt-1 space-y-4 border-t border-purple-500/10">
                  
                  {/* Nome da Empresa */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-200 block uppercase tracking-tight">
                      Nome da Empresa
                    </label>
                    <div className="text-[11px] text-gray-400 bg-[#07060f] px-2.5 py-1 rounded-md border border-white/5">
                      Atual: <span className="text-purple-300 font-semibold">{template.fields.find(f => f.id === 'nome_empresa')?.originalValue || companyName}</span>
                    </div>
                    <input
                      id="field-input-nome_empresa"
                      type="text"
                      value={customValues['nome_empresa'] ?? ''}
                      onChange={(e) => handleFieldChange('nome_empresa', e.target.value)}
                      onFocus={() => notifyIframeToFocus('nome_empresa')}
                      placeholder="Ex: BLACK CROWN BARBER CLUB"
                      className="w-full bg-[#07060f] border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                  </div>

                  {/* Logomarca */}
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-gray-200 uppercase tracking-tight">
                        Logomarca
                      </label>
                      {customValues['logo'] && customValues['logo'] !== template.fields.find(f => f.id === 'logo')?.originalValue && (
                        <button
                          onClick={() => {
                            const orig = template.fields.find(f => f.id === 'logo')?.originalValue || '';
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
                      <div className="w-16 h-16 rounded-xl bg-[#12111d] border border-purple-500/30 p-1 flex items-center justify-center overflow-hidden shrink-0">
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
                          <Check size={11} /> 1 Logo ativa
                        </span>
                        <p className="text-[10px] text-gray-400 leading-tight">
                          Aceita PNG transparente, JPG, WEBP e SVG. Sem cortes ou fundos brancos forçados.
                        </p>
                      </div>
                    </div>

                    {/* Upload button */}
                    <label className="flex items-center justify-center gap-2 w-full py-2 px-3 bg-[#131122] hover:bg-[#1a1730] border border-dashed border-purple-500/40 rounded-xl text-xs text-purple-300 font-semibold cursor-pointer transition-colors">
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
                      <span className="text-[10px] text-gray-400 uppercase font-mono block">Ou link direto da imagem:</span>
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

            {/* 2. SEÇÃO: TEXTOS (HEADLINE, SUBTÍTULO, SLOGANS) */}
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
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Textos Principais</h3>
                    <p className="text-[11px] text-gray-400">Headline e chamada de apresentação</p>
                  </div>
                </div>
                {openAccordions.textos ? <ChevronDown size={16} className="text-purple-400" /> : <ChevronRight size={16} className="text-gray-500" />}
              </button>

              {openAccordions.textos && (
                <div className="p-4 pt-1 space-y-4 border-t border-purple-500/10">
                  
                  {/* Headline */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-200 block uppercase tracking-tight">
                      Título Principal / Headline
                    </label>
                    <div className="text-[11px] text-gray-400 bg-[#07060f] px-2.5 py-1 rounded-md border border-white/5">
                      Atual: <span className="text-purple-300 font-semibold">{template.fields.find(f => f.id === 'headline')?.originalValue || 'SEU ESTILO COMEÇA AQUI.'}</span>
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
                    <p className="text-[10px] text-gray-500">Texto de destaque no topo do biosite.</p>
                  </div>

                  {/* Subtítulo */}
                  <div className="space-y-1.5 pt-2 border-t border-white/5">
                    <label className="text-xs font-bold text-gray-200 block uppercase tracking-tight">
                      Subtítulo / Descrição
                    </label>
                    <div className="text-[11px] text-gray-400 bg-[#07060f] px-2.5 py-1 rounded-md border border-white/5">
                      Atual: <span className="text-purple-300 font-semibold">{template.fields.find(f => f.id === 'subtitulo')?.originalValue || 'Precisão, personalidade e cuidado em cada detalhe.'}</span>
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

            {/* 3. SEÇÃO: ESPECIALIDADES / SERVIÇOS (6 ITENS REPETÍVEIS) */}
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
                  {openAccordions.especialidades ? <ChevronDown size={16} className="text-purple-400" /> : <ChevronRight size={16} className="text-gray-500" />}
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
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-purple-300 uppercase">
                              #{idx} · {nameVal || `Item ${idx}`}
                            </span>
                          </div>

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

            {/* 4. SEÇÃO: GALERIA DE FOTOS / CARROSSEL (5 FOTOS) */}
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
                  {openAccordions.galeria ? <ChevronDown size={16} className="text-purple-400" /> : <ChevronRight size={16} className="text-gray-500" />}
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

            {/* 5. SEÇÃO: WHATSAPP (NÚMERO, MENSAGEM & BOTÃO DE TESTE) */}
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
                    <p className="text-[11px] text-gray-400">Número direto, mensagem e link automático</p>
                  </div>
                </div>
                {openAccordions.whatsapp ? <ChevronDown size={16} className="text-purple-400" /> : <ChevronRight size={16} className="text-gray-500" />}
              </button>

              {openAccordions.whatsapp && (
                <div className="p-4 pt-1 space-y-4 border-t border-purple-500/10">
                  
                  {/* Número WhatsApp */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-200 block uppercase tracking-tight">
                      Número do WhatsApp
                    </label>
                    <div className="relative">
                      <input
                        id="field-input-whatsapp_phone"
                        type="text"
                        value={formatPhoneDisplay(whatsAppPhone)}
                        onChange={(e) => handleWhatsAppChange(e.target.value, whatsAppMessage)}
                        onFocus={() => notifyIframeToFocus('whatsapp')}
                        placeholder="(31) 99999-9999"
                        className="w-full bg-[#07060f] border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
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

            {/* 6. SEÇÃO: INSTAGRAM */}
            <div className="bg-[#0e0d1a] border border-purple-500/20 rounded-2xl overflow-hidden transition-all">
              <button
                onClick={() => toggleAccordion('redes')}
                className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#141224] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-pink-950 flex items-center justify-center text-pink-400">
                    <InstagramIcon size={14} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Instagram Oficial</h3>
                    <p className="text-[11px] text-gray-400">@usuario ou link do perfil</p>
                  </div>
                </div>
                {openAccordions.redes ? <ChevronDown size={16} className="text-purple-400" /> : <ChevronRight size={16} className="text-gray-500" />}
              </button>

              {openAccordions.redes && (
                <div className="p-4 pt-1 space-y-3.5 border-t border-purple-500/10">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-200 block uppercase tracking-tight">
                      Perfil do Instagram
                    </label>
                    <input
                      id="field-input-instagram"
                      type="text"
                      value={instagramInput}
                      onChange={(e) => handleInstagramChange(e.target.value)}
                      onFocus={() => notifyIframeToFocus('instagram')}
                      placeholder="@blackcrownbarber"
                      className="w-full bg-[#07060f] border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    />
                    <p className="text-[10px] text-gray-400">
                      Aceita @usuario, usuario ou URL completa. O ícone original no biosite permanece intacto.
                    </p>
                  </div>

                  {instagramInput && (
                    <div className="flex items-center justify-between p-2.5 bg-[#07060f] rounded-xl border border-purple-500/20">
                      <span className="text-xs text-purple-300 font-mono">
                        {normalizeInstagram(instagramInput).url}
                      </span>
                      <a
                        href={normalizeInstagram(instagramInput).url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#1a172c] hover:bg-purple-600 text-purple-200 hover:text-white rounded-lg text-xs font-bold border border-purple-500/30 transition-all"
                      >
                        <span>TESTAR INSTAGRAM</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 7. SEÇÃO: LOCALIZAÇÃO & GOOGLE MAPS */}
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
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Localização & Endereço</h3>
                    <p className="text-[11px] text-gray-400">Endereço textual e link do Google Maps</p>
                  </div>
                </div>
                {openAccordions.localizacao ? <ChevronDown size={16} className="text-purple-400" /> : <ChevronRight size={16} className="text-gray-500" />}
              </button>

              {openAccordions.localizacao && (
                <div className="p-4 pt-1 space-y-4 border-t border-purple-500/10">
                  
                  {/* Endereço Texto */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-200 block uppercase tracking-tight">
                      Endereço Exibido no Site
                    </label>
                    <div className="text-[11px] text-gray-400 bg-[#07060f] px-2.5 py-1 rounded-md border border-white/5">
                      Atual: <span className="text-purple-300 font-semibold">{template.fields.find(f => f.id === 'endereco')?.originalValue || 'Av. Imperial, 725 — Centro — Belo Horizonte/MG'}</span>
                    </div>
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

                  {/* Link Maps */}
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

            {/* 8. SEÇÃO: GOOGLE REVIEW (AVALIAÇÃO) */}
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
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Avaliação Google</h3>
                    <p className="text-[11px] text-gray-400">Link para coletar avaliações 5 estrelas</p>
                  </div>
                </div>
                {openAccordions.google_review ? <ChevronDown size={16} className="text-purple-400" /> : <ChevronRight size={16} className="text-gray-500" />}
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
                    <p className="text-[10px] text-gray-400">
                      Preserva as estrelas, cores oficiais e visual 3D do botão no biosite.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 9. SEÇÃO: HORÁRIOS */}
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
                {openAccordions.horarios ? <ChevronDown size={16} className="text-purple-400" /> : <ChevronRight size={16} className="text-gray-500" />}
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
          className={`flex-1 bg-[#040407] flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden ${
            mobileTab === 'preview' ? 'flex' : 'hidden md:flex'
          }`}
        >
          {/* Device Mockup Shell */}
          <div
            className={`transition-all duration-300 flex flex-col overflow-hidden ${
              deviceView === 'mobile'
                ? 'w-full max-w-[420px] h-full max-h-[860px] rounded-3xl border-2 sm:border-4 border-[#1e1c32] shadow-[0_25px_60px_rgba(0,0,0,0.9)] bg-black'
                : 'w-full h-full rounded-2xl border border-purple-500/20 bg-black shadow-2xl'
            }`}
          >
            {/* Top Phone Notch / Speaker bar (Only on Mobile View) */}
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
        </main>
      </div>

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
