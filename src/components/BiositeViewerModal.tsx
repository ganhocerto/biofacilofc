import React, { useState } from 'react';
import { BiositeTemplate } from '../types';
import { X, Smartphone, Monitor, Palette, ExternalLink } from 'lucide-react';

interface BiositeViewerModalProps {
  template: BiositeTemplate | null;
  onClose: () => void;
  onCustomize: (template: BiositeTemplate) => void;
}

export const BiositeViewerModal: React.FC<BiositeViewerModalProps> = ({
  template,
  onClose,
  onCustomize,
}) => {
  const [device, setDevice] = useState<'mobile' | 'desktop'>('mobile');

  if (!template) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#07070b] text-white animate-fade-in">
      
      {/* Top Bar for Viewport Control */}
      <header className="h-14 px-4 sm:px-6 bg-[#0c0b15] border-b border-purple-500/20 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white bg-[#151424] hover:bg-[#1f1d35] rounded-lg border border-white/5 transition-colors"
            title="Fechar Visualização"
          >
            <X size={18} />
          </button>
          
          <div className="hidden sm:block">
            <span className="text-xs font-semibold text-white truncate max-w-[200px] block">
              {template.name}
            </span>
            <span className="text-[10px] text-purple-400">
              Modo Visualização Pura (Sem Editor)
            </span>
          </div>
        </div>

        {/* Viewport switch: Mobile / Desktop */}
        <div className="flex items-center gap-1 bg-[#151424] p-1 rounded-xl border border-purple-500/20">
          <button
            onClick={() => setDevice('mobile')}
            className={`px-3 py-1 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-all ${
              device === 'mobile'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Smartphone size={14} />
            <span>Mobile</span>
          </button>
          <button
            onClick={() => setDevice('desktop')}
            className={`px-3 py-1 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-all ${
              device === 'desktop'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Monitor size={14} />
            <span>Desktop</span>
          </button>
        </div>

        {/* CTA to customize */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              onClose();
              onCustomize(template);
            }}
            className="px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-[0_2px_10px_rgba(147,51,234,0.35)] transition-all active:scale-95"
          >
            <Palette size={14} />
            <span>Personalizar Modelo</span>
          </button>
        </div>
      </header>

      {/* Frame Container */}
      <main className="flex-1 overflow-auto flex items-center justify-center p-2 sm:p-6 bg-[#060609]">
        <div
          className={`h-full transition-all duration-300 rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.85)] border border-purple-500/30 bg-black ${
            device === 'mobile'
              ? 'w-full max-w-[390px] max-h-[844px] ring-8 ring-[#181628]'
              : 'w-full max-w-5xl h-full'
          }`}
        >
          <iframe
            srcDoc={template.htmlContent}
            title={template.name}
            className="w-full h-full border-0 bg-black"
            sandbox="allow-scripts allow-same-origin allow-popups"
          />
        </div>
      </main>

    </div>
  );
};
