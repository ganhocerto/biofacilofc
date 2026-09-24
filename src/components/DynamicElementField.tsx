import React, { useState } from 'react';
import { EditableElement, LogoConfig } from '../types';
import {
  formatPhoneDisplay,
  buildWhatsAppUrl,
  normalizeInstagram,
  normalizeFacebook,
  normalizeTikTok,
  normalizeYouTube,
} from '../utils/htmlAnalyzer';
import {
  Upload,
  Image as ImageIcon,
  RotateCcw,
  ExternalLink,
  MessageCircle,
  Link as LinkIcon,
  Check,
  Type,
  Mail,
  Phone,
  MapPin,
  Award,
  Layers,
} from 'lucide-react';
import { InstagramIcon } from './Icons';

interface DynamicElementFieldProps {
  element: EditableElement;
  customValues: Record<string, string>;
  onValueChange: (
    key: string,
    value: string,
    attr?: 'text' | 'src' | 'href',
    semanticType?: string,
    extra?: {
      cardTitle?: string;
      buttonText?: string;
      href?: string;
      iconSrc?: string;
    }
  ) => void;
  onFocusIframe?: (id: string) => void;
  onImageUpload?: (id: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  logoConfig?: LogoConfig;
  onLogoConfigChange?: (config: Partial<LogoConfig>) => void;
  isInspectorDrawer?: boolean;
}

export const DynamicElementField: React.FC<DynamicElementFieldProps> = ({
  element,
  customValues,
  onValueChange,
  onFocusIframe,
  onImageUpload,
  logoConfig,
  onLogoConfigChange,
  isInspectorDrawer = false,
}) => {
  const elId = element.id;

  // Local state for direct image URL input if user chooses URL over upload
  const [directUrlInput, setDirectUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  // -------------------------------------------------------------
  // 1. CARDS (e.g. Outlook, Gmail, Servicos)
  // -------------------------------------------------------------
  if (element.editorType === 'card') {
    const cardTitle =
      customValues[`${elId}_title`] ??
      element.details?.cardTitle ??
      element.originalText ??
      '';
    const buttonText =
      customValues[`${elId}_btnText`] ??
      element.details?.buttonText ??
      'Acessar';
    const cardHref =
      customValues[`${elId}_href`] ??
      element.details?.href ??
      '';
    const cardIconSrc =
      customValues[`${elId}_src`] ??
      element.details?.iconSrc ??
      '';

    const handleCardChange = (updates: {
      title?: string;
      btnText?: string;
      href?: string;
      iconSrc?: string;
    }) => {
      const newTitle = updates.title !== undefined ? updates.title : cardTitle;
      const newBtnText = updates.btnText !== undefined ? updates.btnText : buttonText;
      const newHref = updates.href !== undefined ? updates.href : cardHref;
      const newIcon = updates.iconSrc !== undefined ? updates.iconSrc : cardIconSrc;

      if (updates.title !== undefined) onValueChange(`${elId}_title`, updates.title);
      if (updates.btnText !== undefined) onValueChange(`${elId}_btnText`, updates.btnText);
      if (updates.href !== undefined) onValueChange(`${elId}_href`, updates.href);
      if (updates.iconSrc !== undefined) onValueChange(`${elId}_src`, updates.iconSrc);

      onValueChange(elId, newTitle, 'text', 'card', {
        cardTitle: newTitle,
        buttonText: newBtnText,
        href: newHref,
        iconSrc: newIcon,
      });
    };

    return (
      <div
        id={`field-input-${elId}`}
        className={`p-3.5 rounded-xl border transition-all ${
          isInspectorDrawer
            ? 'bg-[#090814] border-purple-500/30'
            : 'bg-[#07060f] border-purple-500/20 hover:border-purple-500/40'
        } space-y-3`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Layers size={13} className="text-purple-400" />
            <span className="text-xs font-bold text-white uppercase tracking-tight">
              {element.label || cardTitle || 'Card'}
            </span>
          </div>
          {cardHref && (
            <a
              href={cardHref}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
            >
              <span>Testar Link</span>
              <ExternalLink size={10} />
            </a>
          )}
        </div>

        {/* Card Title */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-gray-300 block">
            Nome / Título do Card:
          </label>
          <input
            type="text"
            value={cardTitle}
            onChange={(e) => handleCardChange({ title: e.target.value })}
            onFocus={() => onFocusIframe?.(elId)}
            placeholder="Ex: Outlook"
            className="w-full bg-[#12111d] border border-purple-500/25 rounded-xl px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
          />
        </div>

        {/* Button Text & Link URL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-300 block">
              Texto do Botão:
            </label>
            <input
              type="text"
              value={buttonText}
              onChange={(e) => handleCardChange({ btnText: e.target.value })}
              onFocus={() => onFocusIframe?.(elId)}
              placeholder="Ex: ACESSAR"
              className="w-full bg-[#12111d] border border-purple-500/25 rounded-xl px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-300 block">
              Endereço / Link de Acesso:
            </label>
            <input
              type="text"
              value={cardHref}
              onChange={(e) => handleCardChange({ href: e.target.value })}
              onFocus={() => onFocusIframe?.(elId)}
              placeholder="https://... ou mailto:..."
              className="w-full bg-[#12111d] border border-purple-500/25 rounded-xl px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 font-mono"
            />
          </div>
        </div>

        {/* Icon / Image if exists */}
        {(cardIconSrc || element.originalSrc) && (
          <div className="pt-2 border-t border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-400 font-mono uppercase">
                Ícone / Imagem do Card:
              </span>
              {cardIconSrc && cardIconSrc !== element.originalSrc && (
                <button
                  type="button"
                  onClick={() => handleCardChange({ iconSrc: element.originalSrc || '' })}
                  className="text-[10px] text-purple-400 hover:text-purple-300 flex items-center gap-1"
                >
                  <RotateCcw size={10} /> Restaurar Original
                </button>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-lg bg-[#141224] border border-purple-500/30 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                {cardIconSrc ? (
                  <img src={cardIconSrc} alt="Ícone" className="w-full h-full object-contain" />
                ) : (
                  <ImageIcon size={16} className="text-gray-500" />
                )}
              </div>

              <div className="flex-1 space-y-1">
                <input
                  type="url"
                  value={cardIconSrc}
                  onChange={(e) => handleCardChange({ iconSrc: e.target.value })}
                  placeholder="URL do ícone ou imagem..."
                  className="w-full bg-[#12111d] border border-purple-500/25 rounded-xl px-2.5 py-1 text-[11px] text-white placeholder-gray-500 font-mono focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. WHATSAPP BUTTONS (e.g. Solicitar Atendimento, Agendar)
  // -------------------------------------------------------------
  if (element.editorType === 'whatsapp') {
    const btnText =
      customValues[`${elId}_text`] ??
      element.details?.buttonText ??
      element.originalText ??
      'Solicitar Atendimento';
    const phone =
      customValues[`${elId}_phone`] ??
      element.details?.phone ??
      customValues['whatsapp_phone'] ??
      '';
    const msg =
      customValues[`${elId}_msg`] ??
      element.details?.message ??
      customValues['whatsapp_msg'] ??
      'Olá! Vim pelo site...';

    const generatedUrl = buildWhatsAppUrl(phone, msg);

    const handleWhatsAppChange = (newPhone: string, newMsg: string, newText?: string) => {
      const targetText = newText !== undefined ? newText : btnText;
      onValueChange(`${elId}_phone`, newPhone);
      onValueChange(`${elId}_msg`, newMsg);
      if (newText !== undefined) {
        onValueChange(`${elId}_text`, newText);
      }
      const newUrl = buildWhatsAppUrl(newPhone, newMsg);
      onValueChange(elId, newUrl, 'href', 'whatsapp', {
        buttonText: targetText,
      });
      // Also update universal 'whatsapp' key
      onValueChange('whatsapp', newUrl, 'href', 'whatsapp');
    };

    return (
      <div
        id={`field-input-${elId}`}
        className={`p-3.5 rounded-xl border transition-all ${
          isInspectorDrawer
            ? 'bg-[#090814] border-purple-500/30'
            : 'bg-[#07060f] border-emerald-500/20 hover:border-emerald-500/40'
        } space-y-3`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <MessageCircle size={14} className="text-emerald-400" />
            <span className="text-xs font-bold text-white uppercase tracking-tight">
              {element.label || 'Botão WhatsApp'}
            </span>
          </div>
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            WHATSAPP
          </span>
        </div>

        {/* Button Text */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-gray-300 block">
            Texto do Botão:
          </label>
          <input
            type="text"
            value={btnText}
            onChange={(e) => handleWhatsAppChange(phone, msg, e.target.value)}
            onFocus={() => onFocusIframe?.(elId)}
            placeholder="Ex: SOLICITAR ATENDIMENTO"
            className="w-full bg-[#12111d] border border-purple-500/25 rounded-xl px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 font-semibold"
          />
        </div>

        {/* WhatsApp Phone */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-gray-300 block">
            Número do WhatsApp (com DDD):
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => handleWhatsAppChange(e.target.value, msg)}
            onFocus={() => onFocusIframe?.(elId)}
            placeholder="(34) 99999-9999"
            className="w-full bg-[#12111d] border border-purple-500/25 rounded-xl px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 font-mono"
          />
        </div>

        {/* WhatsApp Initial Message */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-gray-300 block">
            Mensagem Automática:
          </label>
          <textarea
            rows={2}
            value={msg}
            onChange={(e) => handleWhatsAppChange(phone, e.target.value)}
            onFocus={() => onFocusIframe?.(elId)}
            placeholder="Olá! Gostaria de mais informações..."
            className="w-full bg-[#12111d] border border-purple-500/25 rounded-xl px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 resize-none"
          />
        </div>

        {/* Test Button */}
        <div className="flex items-center justify-between pt-1">
          <a
            href={generatedUrl || '#'}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
          >
            <MessageCircle size={13} />
            <span>TESTAR WHATSAPP</span>
            <ExternalLink size={11} />
          </a>
          <span className="text-[10px] text-emerald-400 font-medium">✓ Atualização imediata</span>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 3. LOGO
  // -------------------------------------------------------------
  if (element.editorType === 'logo') {
    const currentSrc =
      customValues[elId] ||
      customValues['logo'] ||
      customValues['logo_principal'] ||
      element.originalSrc ||
      '';

    const handleRestoreLogo = () => {
      const orig = element.originalSrc || '';
      onValueChange(elId, orig, 'src', 'logo');
      onValueChange('logo', orig, 'src', 'logo');
    };

    return (
      <div
        id={`field-input-${elId}`}
        className={`p-3.5 rounded-xl border transition-all ${
          isInspectorDrawer
            ? 'bg-[#090814] border-purple-500/30'
            : 'bg-[#07060f] border-purple-500/20 hover:border-purple-500/40'
        } space-y-3`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ImageIcon size={14} className="text-purple-400" />
            <span className="text-xs font-bold text-white uppercase tracking-tight">
              {element.label || 'Logomarca Principal'}
            </span>
          </div>
          {currentSrc && currentSrc !== element.originalSrc && (
            <button
              type="button"
              onClick={handleRestoreLogo}
              className="text-[10px] text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              <RotateCcw size={10} /> Restaurar Original
            </button>
          )}
        </div>

        {/* Current Active Preview */}
        <div className="flex items-center gap-3 bg-[#12111d] p-2.5 rounded-xl border border-purple-500/20">
          <div className="w-16 h-16 rounded-xl bg-[#090814] border border-purple-500/30 p-1 flex items-center justify-center overflow-hidden shrink-0 relative bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:8px_8px]">
            {currentSrc ? (
              <img src={currentSrc} alt="Logomarca" className="w-full h-full object-contain" />
            ) : (
              <ImageIcon size={20} className="text-gray-500" />
            )}
          </div>
          <div className="text-[11px] text-gray-400 space-y-1">
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <Check size={11} /> Substitui a logo oficial existente
            </span>
            <p className="text-[10px] text-gray-400 leading-tight">
              Preserva proporção, alinhamento e efeitos visuais originais.
            </p>
          </div>
        </div>

        {/* Size pills if onLogoConfigChange available */}
        {logoConfig && onLogoConfigChange && (
          <div className="space-y-1.5">
            <span className="text-[10px] text-gray-400 uppercase font-mono block">
              Tamanho da Logo:
            </span>
            <div className="grid grid-cols-3 gap-2">
              {(['sm', 'md', 'lg'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => onLogoConfigChange({ size: s })}
                  className={`py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                    logoConfig.size === s
                      ? 'bg-purple-600 text-white border-purple-400 shadow-sm'
                      : 'bg-[#12111d] text-gray-400 hover:text-white border-white/5'
                  }`}
                >
                  {s === 'sm' ? 'Pequeno' : s === 'md' ? 'Médio' : 'Grande'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons: Upload & Direct URL */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <label className="flex items-center justify-center gap-1.5 py-2 px-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-all active:scale-95 shadow-sm">
            <Upload size={13} />
            <span>Fazer Upload</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              onChange={(e) => onImageUpload?.(elId, e)}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-[#16142a] hover:bg-[#1f1c3a] border border-purple-500/30 text-purple-300 rounded-xl text-xs font-semibold transition-colors"
          >
            <LinkIcon size={13} />
            <span>{showUrlInput ? 'Ocultar Link' : 'Usar Link'}</span>
          </button>
        </div>

        {showUrlInput && (
          <div className="space-y-1 pt-1">
            <input
              type="url"
              value={directUrlInput}
              onChange={(e) => setDirectUrlInput(e.target.value)}
              placeholder="https://exemplo.com/minha-logo.png"
              className="w-full bg-[#12111d] border border-purple-500/30 rounded-xl px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 font-mono"
            />
            <button
              type="button"
              onClick={() => {
                if (directUrlInput.trim()) {
                  onValueChange(elId, directUrlInput.trim(), 'src', 'logo');
                  onValueChange('logo', directUrlInput.trim(), 'src', 'logo');
                  setShowUrlInput(false);
                }
              }}
              className="w-full py-1.5 bg-purple-700 hover:bg-purple-600 text-white rounded-xl text-xs font-semibold"
            >
              Aplicar Link da Logo
            </button>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // 4. IMAGES (e.g. Fotos, banners, portfolio)
  // -------------------------------------------------------------
  if (element.editorType === 'image') {
    const currentSrc = customValues[elId] || element.originalSrc || '';

    const handleRestoreImage = () => {
      const orig = element.originalSrc || '';
      onValueChange(elId, orig, 'src', 'image');
    };

    return (
      <div
        id={`field-input-${elId}`}
        className={`p-3.5 rounded-xl border transition-all ${
          isInspectorDrawer
            ? 'bg-[#090814] border-purple-500/30'
            : 'bg-[#07060f] border-purple-500/20 hover:border-purple-500/40'
        } space-y-3`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ImageIcon size={14} className="text-blue-400" />
            <span className="text-xs font-bold text-white uppercase tracking-tight">
              {element.label || 'Imagem'}
            </span>
          </div>
          {currentSrc && currentSrc !== element.originalSrc && (
            <button
              type="button"
              onClick={handleRestoreImage}
              className="text-[10px] text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              <RotateCcw size={10} /> Restaurar Original
            </button>
          )}
        </div>

        {/* Thumbnail Preview */}
        <div className="flex items-center gap-3 bg-[#12111d] p-2.5 rounded-xl border border-purple-500/20">
          <div className="w-16 h-16 rounded-xl bg-[#090814] border border-purple-500/30 p-0.5 flex items-center justify-center overflow-hidden shrink-0">
            {currentSrc ? (
              <img src={currentSrc} alt="Imagem" className="w-full h-full object-cover rounded-lg" />
            ) : (
              <ImageIcon size={20} className="text-gray-500" />
            )}
          </div>
          <div className="text-[11px] text-gray-400 space-y-1">
            <span className="text-blue-400 font-semibold flex items-center gap-1">
              <Check size={11} /> Substitui a imagem selecionada
            </span>
            <p className="text-[10px] text-gray-400 leading-tight">
              Troca a fonte da foto mantendo o tamanho e proporção do modelo.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <label className="flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-all active:scale-95 shadow-sm">
            <Upload size={13} />
            <span>Fazer Upload</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              onChange={(e) => onImageUpload?.(elId, e)}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-[#16142a] hover:bg-[#1f1c3a] border border-purple-500/30 text-purple-300 rounded-xl text-xs font-semibold transition-colors"
          >
            <LinkIcon size={13} />
            <span>{showUrlInput ? 'Ocultar Link' : 'Usar Link'}</span>
          </button>
        </div>

        {showUrlInput && (
          <div className="space-y-1 pt-1">
            <input
              type="url"
              value={directUrlInput}
              onChange={(e) => setDirectUrlInput(e.target.value)}
              placeholder="https://exemplo.com/foto.jpg"
              className="w-full bg-[#12111d] border border-purple-500/30 rounded-xl px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 font-mono"
            />
            <button
              type="button"
              onClick={() => {
                if (directUrlInput.trim()) {
                  onValueChange(elId, directUrlInput.trim(), 'src', 'image');
                  setShowUrlInput(false);
                }
              }}
              className="w-full py-1.5 bg-blue-700 hover:bg-blue-600 text-white rounded-xl text-xs font-semibold"
            >
              Aplicar Link da Imagem
            </button>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // 5. BUTTONS / CTAs (e.g. Conhecer Servicos, Agendar Consulta)
  // -------------------------------------------------------------
  if (element.editorType === 'button') {
    const btnText =
      customValues[`${elId}_text`] ??
      element.details?.buttonText ??
      element.originalText ??
      '';
    const btnHref =
      customValues[`${elId}_href`] ??
      element.details?.href ??
      element.originalHref ??
      '';

    const handleButtonChange = (newText: string, newHref: string) => {
      onValueChange(`${elId}_text`, newText);
      onValueChange(`${elId}_href`, newHref);
      onValueChange(elId, newHref, 'href', 'button', {
        buttonText: newText,
      });
    };

    return (
      <div
        id={`field-input-${elId}`}
        className={`p-3.5 rounded-xl border transition-all ${
          isInspectorDrawer
            ? 'bg-[#090814] border-purple-500/30'
            : 'bg-[#07060f] border-purple-500/20 hover:border-purple-500/40'
        } space-y-3`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <LinkIcon size={14} className="text-blue-400" />
            <span className="text-xs font-bold text-white uppercase tracking-tight">
              {element.label || btnText || 'Botão / Link'}
            </span>
          </div>
          {btnHref && (
            <a
              href={btnHref}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
            >
              <span>Testar Link</span>
              <ExternalLink size={10} />
            </a>
          )}
        </div>

        {/* Button Text */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-gray-300 block">
            Texto do Botão:
          </label>
          <input
            type="text"
            value={btnText}
            onChange={(e) => handleButtonChange(e.target.value, btnHref)}
            onFocus={() => onFocusIframe?.(elId)}
            placeholder="Ex: CONHECER SERVIÇOS"
            className="w-full bg-[#12111d] border border-purple-500/25 rounded-xl px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 font-semibold"
          />
        </div>

        {/* Button Href */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-gray-300 block">
            Endereço do Link (URL):
          </label>
          <input
            type="text"
            value={btnHref}
            onChange={(e) => handleButtonChange(btnText, e.target.value)}
            onFocus={() => onFocusIframe?.(elId)}
            placeholder="https://... ou #servicos"
            className="w-full bg-[#12111d] border border-purple-500/25 rounded-xl px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 font-mono"
          />
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 6. EMAIL (mailto:)
  // -------------------------------------------------------------
  if (element.editorType === 'email') {
    const rawVal = customValues[elId] || element.originalHref || element.originalText || '';
    const cleanEmail = rawVal.replace(/^mailto:/i, '');

    const handleEmailChange = (newEmail: string) => {
      const finalVal = `mailto:${newEmail.trim()}`;
      onValueChange(elId, finalVal, 'href', 'email');
    };

    return (
      <div
        id={`field-input-${elId}`}
        className={`p-3.5 rounded-xl border transition-all ${
          isInspectorDrawer
            ? 'bg-[#090814] border-purple-500/30'
            : 'bg-[#07060f] border-purple-500/20 hover:border-purple-500/40'
        } space-y-2`}
      >
        <div className="flex items-center gap-1.5">
          <Mail size={14} className="text-amber-400" />
          <span className="text-xs font-bold text-white uppercase tracking-tight">
            {element.label || 'E-mail de Contato'}
          </span>
        </div>

        <input
          type="email"
          value={cleanEmail}
          onChange={(e) => handleEmailChange(e.target.value)}
          onFocus={() => onFocusIframe?.(elId)}
          placeholder="contato@empresa.com.br"
          className="w-full bg-[#12111d] border border-purple-500/25 rounded-xl px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 font-mono"
        />
      </div>
    );
  }

  // -------------------------------------------------------------
  // 7. PHONE (tel:)
  // -------------------------------------------------------------
  if (element.editorType === 'phone') {
    const rawVal = customValues[elId] || element.originalHref || element.originalText || '';
    const cleanPhone = rawVal.replace(/^tel:/i, '');

    const handlePhoneChange = (newPhone: string) => {
      const finalVal = `tel:${newPhone.trim()}`;
      onValueChange(elId, finalVal, 'href', 'phone');
    };

    return (
      <div
        id={`field-input-${elId}`}
        className={`p-3.5 rounded-xl border transition-all ${
          isInspectorDrawer
            ? 'bg-[#090814] border-purple-500/30'
            : 'bg-[#07060f] border-purple-500/20 hover:border-purple-500/40'
        } space-y-2`}
      >
        <div className="flex items-center gap-1.5">
          <Phone size={14} className="text-emerald-400" />
          <span className="text-xs font-bold text-white uppercase tracking-tight">
            {element.label || 'Telefone de Ligação Direta'}
          </span>
        </div>

        <input
          type="tel"
          value={cleanPhone}
          onChange={(e) => handlePhoneChange(e.target.value)}
          onFocus={() => onFocusIframe?.(elId)}
          placeholder="(34) 3222-0000"
          className="w-full bg-[#12111d] border border-purple-500/25 rounded-xl px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 font-mono"
        />
      </div>
    );
  }

  // -------------------------------------------------------------
  // 8. PROFESSIONAL CREDENTIALS (e.g. CREA, CRM, OAB)
  // -------------------------------------------------------------
  if (element.editorType === 'credential') {
    const textVal = customValues[elId] ?? element.originalText ?? '';

    return (
      <div
        id={`field-input-${elId}`}
        className={`p-3.5 rounded-xl border transition-all ${
          isInspectorDrawer
            ? 'bg-[#090814] border-purple-500/30'
            : 'bg-[#07060f] border-purple-500/20 hover:border-purple-500/40'
        } space-y-2`}
      >
        <div className="flex items-center gap-1.5">
          <Award size={14} className="text-indigo-400" />
          <span className="text-xs font-bold text-white uppercase tracking-tight">
            {element.label || 'Registro Profissional / Credencial'}
          </span>
        </div>

        <input
          type="text"
          value={textVal}
          onChange={(e) => onValueChange(elId, e.target.value, 'text', 'credential')}
          onFocus={() => onFocusIframe?.(elId)}
          placeholder="Ex: CREA 12345/D — Engenheiro Civil"
          className="w-full bg-[#12111d] border border-purple-500/25 rounded-xl px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 font-medium"
        />
      </div>
    );
  }

  // -------------------------------------------------------------
  // 9. LOCATION & MAPS
  // -------------------------------------------------------------
  if (element.editorType === 'location' || element.editorType === 'maps') {
    const val = customValues[elId] ?? element.originalValue ?? '';
    const isUrl = val.startsWith('http');

    return (
      <div
        id={`field-input-${elId}`}
        className={`p-3.5 rounded-xl border transition-all ${
          isInspectorDrawer
            ? 'bg-[#090814] border-purple-500/30'
            : 'bg-[#07060f] border-purple-500/20 hover:border-purple-500/40'
        } space-y-2`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <MapPin size={14} className="text-rose-400" />
            <span className="text-xs font-bold text-white uppercase tracking-tight">
              {element.label || (isUrl ? 'Link do Google Maps' : 'Endereço')}
            </span>
          </div>
          {isUrl && val && (
            <a
              href={val}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1"
            >
              <span>Testar Localização</span>
              <ExternalLink size={10} />
            </a>
          )}
        </div>

        <input
          type={isUrl ? 'url' : 'text'}
          value={val}
          onChange={(e) => onValueChange(elId, e.target.value, isUrl ? 'href' : 'text', 'location')}
          onFocus={() => onFocusIframe?.(elId)}
          placeholder={isUrl ? 'https://maps.app.goo.gl/...' : 'Ex: Av. Principal, 500 — Centro'}
          className="w-full bg-[#12111d] border border-purple-500/25 rounded-xl px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 font-medium"
        />
      </div>
    );
  }

  // -------------------------------------------------------------
  // 10. INSTAGRAM
  // -------------------------------------------------------------
  if (element.editorType === 'instagram') {
    const val = customValues[elId] || element.originalHref || '';
    const norm = normalizeInstagram(val);

    return (
      <div
        id={`field-input-${elId}`}
        className={`p-3.5 rounded-xl border transition-all ${
          isInspectorDrawer
            ? 'bg-[#090814] border-purple-500/30'
            : 'bg-[#07060f] border-purple-500/20 hover:border-purple-500/40'
        } space-y-2`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
            <span className="text-xs font-bold text-white uppercase tracking-tight">
              {element.label || 'Instagram'}
            </span>
          </div>
          {norm.url && (
            <a
              href={norm.url}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-pink-400 hover:text-pink-300 font-semibold flex items-center gap-1"
            >
              <span>Testar Link</span>
              <ExternalLink size={10} />
            </a>
          )}
        </div>

        <input
          type="text"
          value={val}
          onChange={(e) => {
            const n = normalizeInstagram(e.target.value);
            onValueChange(elId, n.url || e.target.value, 'href', 'instagram');
            onValueChange('instagram', n.url || e.target.value, 'href', 'instagram');
          }}
          onFocus={() => onFocusIframe?.(elId)}
          placeholder="@meuperfil ou https://instagram.com/meuperfil"
          className="w-full bg-[#12111d] border border-purple-500/25 rounded-xl px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-pink-400 font-mono"
        />
      </div>
    );
  }

  // -------------------------------------------------------------
  // 11. TITLES & HEADINGS (H1, H2, H3)
  // -------------------------------------------------------------
  if (element.editorType === 'title') {
    const textVal = customValues[elId] ?? element.originalText ?? '';

    return (
      <div
        id={`field-input-${elId}`}
        className={`p-3.5 rounded-xl border transition-all ${
          isInspectorDrawer
            ? 'bg-[#090814] border-purple-500/30'
            : 'bg-[#07060f] border-purple-500/20 hover:border-purple-500/40'
        } space-y-2`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Type size={13} className="text-purple-300" />
            <span className="text-xs font-bold text-white uppercase tracking-tight">
              {element.label || 'Título'}
            </span>
          </div>
          {textVal && textVal !== element.originalText && (
            <button
              type="button"
              onClick={() => onValueChange(elId, element.originalText || '', 'text', 'title')}
              className="text-[10px] text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              <RotateCcw size={10} /> Restaurar Original
            </button>
          )}
        </div>

        <input
          type="text"
          value={textVal}
          onChange={(e) => onValueChange(elId, e.target.value, 'text', 'title')}
          onFocus={() => onFocusIframe?.(elId)}
          placeholder={element.originalText || 'Título...'}
          className="w-full bg-[#12111d] border border-purple-500/25 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 font-semibold"
        />
      </div>
    );
  }

  // -------------------------------------------------------------
  // 12. GENERAL TEXT (Paragraphs, descriptions, subtitles)
  // -------------------------------------------------------------
  const textVal = customValues[elId] ?? element.originalText ?? '';

  return (
    <div
      id={`field-input-${elId}`}
      className={`p-3.5 rounded-xl border transition-all ${
        isInspectorDrawer
          ? 'bg-[#090814] border-purple-500/30'
          : 'bg-[#07060f] border-purple-500/20 hover:border-purple-500/40'
      } space-y-2`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Type size={13} className="text-gray-400" />
          <span className="text-xs font-bold text-white uppercase tracking-tight">
            {element.label || 'Texto'}
          </span>
        </div>
        {textVal && textVal !== element.originalText && (
          <button
            type="button"
            onClick={() => onValueChange(elId, element.originalText || '', 'text', 'text')}
            className="text-[10px] text-purple-400 hover:text-purple-300 flex items-center gap-1"
          >
            <RotateCcw size={10} /> Restaurar Original
          </button>
        )}
      </div>

      <textarea
        rows={textVal.length > 80 ? 3 : 2}
        value={textVal}
        onChange={(e) => onValueChange(elId, e.target.value, 'text', 'text')}
        onFocus={() => onFocusIframe?.(elId)}
        placeholder={element.originalText || 'Texto...'}
        className="w-full bg-[#12111d] border border-purple-500/25 rounded-xl p-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 resize-none leading-relaxed"
      />
    </div>
  );
};
