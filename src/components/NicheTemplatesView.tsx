import React, { useState } from 'react';
import { Niche, BiositeTemplate } from '../types';
import { ArrowLeft, Eye, Palette, Layers, Clock, ImageOff, Loader2 } from 'lucide-react';
import { NicheIconMap } from './Icons';
import { useData } from '../context/DataContext';

interface NicheTemplatesViewProps {
  niche: Niche;
  templates: BiositeTemplate[];
  onBack: () => void;
  onPreviewTemplate: (template: BiositeTemplate) => void;
  onCustomizeTemplate: (template: BiositeTemplate) => void;
}

export const NicheTemplatesView: React.FC<NicheTemplatesViewProps> = ({
  niche,
  templates,
  onBack,
  onPreviewTemplate,
  onCustomizeTemplate,
}) => {
  const { loadTemplateFull } = useData();
  const IconComp = NicheIconMap[niche.icon] || Layers;
  const filteredTemplates = templates.filter(
    (t) => t.nicheId === niche.id && t.status === 'published'
  );

  const [loadingTemplateId, setLoadingTemplateId] = useState<string | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const handleAction = async (template: BiositeTemplate, action: 'preview' | 'customize') => {
    try {
      setLoadingTemplateId(template.id);
      const fullTemplate = await loadTemplateFull(template.id);
      if (action === 'preview') {
        onPreviewTemplate(fullTemplate);
      } else {
        onCustomizeTemplate(fullTemplate);
      }
    } catch (err) {
      console.error('Erro ao carregar modelo completo:', err);
      // Fallback with provided template
      if (action === 'preview') {
        onPreviewTemplate(template);
      } else {
        onCustomizeTemplate(template);
      }
    } finally {
      setLoadingTemplateId(null);
    }
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 pb-4 border-b border-purple-500/20">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 text-gray-400 hover:text-white bg-[#121122] hover:bg-[#1c1a32] border border-purple-500/20 rounded-xl transition-all"
            title="Voltar aos Nichos"
          >
            <ArrowLeft size={18} />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1d1b33] to-[#100f1e] border border-purple-500/30 flex items-center justify-center text-purple-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
              <IconComp size={20} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight uppercase">
                {niche.name}
              </h2>
              <p className="text-xs text-purple-300/80">
                Escolha um modelo para começar.
              </p>
            </div>
          </div>
        </div>

        <span className="text-xs font-semibold text-purple-300 bg-[#151326] border border-purple-500/30 px-3 py-1.5 rounded-xl self-start sm:self-auto font-mono">
          {filteredTemplates.length} {filteredTemplates.length === 1 ? 'modelo publicado' : 'modelos publicados'}
        </span>
      </div>

      {/* Templates Grid or Elegant "EM BREVE" State */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-16 bg-[#0e0d1a] border border-purple-500/25 rounded-3xl p-8 max-w-md mx-auto shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <Clock size={28} />
          </div>
          
          <div className="inline-block px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 text-[10px] font-mono text-amber-300 font-bold uppercase tracking-wider mb-2">
            EM BREVE
          </div>

          <h3 className="text-lg font-display font-bold text-white mb-2">
            Modelos em Produção
          </h3>

          <p className="text-xs text-gray-400 mb-6 leading-relaxed">
            Estamos finalizando o design profissional dos modelos exclusivos para o nicho de <strong className="text-white">{niche.name}</strong>. A produção começou pelo nicho de Barbearia e novos nichos serão liberados continuamente.
          </p>

          <button
            onClick={onBack}
            className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white text-xs font-semibold rounded-xl transition-all shadow-[0_4px_15px_rgba(147,51,234,0.35)]"
          >
            Explorar Outros Nichos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTemplates.map((template) => {
            const isImageFailed = failedImages[template.id];
            const isLoadingThis = loadingTemplateId === template.id;

            return (
              <div
                key={template.id}
                className="group bg-[#0e0d1a] border border-purple-500/20 hover:border-purple-400/40 rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_30px_-8px_rgba(147,51,234,0.35)] flex flex-col justify-between"
              >
                {/* Cover Preview (Square 1:1, object-fit: cover) */}
                <div>
                  <div className="relative aspect-square w-full bg-[#0c0b14] overflow-hidden">
                    {template.coverImage && !isImageFailed ? (
                      <img
                        src={template.coverImage}
                        alt={template.name}
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        onError={() => setFailedImages((prev) => ({ ...prev, [template.id]: true }))}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        style={{ aspectRatio: '1 / 1', objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#121024] to-[#080711]">
                        <div className="w-12 h-12 rounded-2xl bg-purple-900/30 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-2">
                          <ImageOff size={22} />
                        </div>
                        <span className="font-display font-bold text-xs text-white uppercase tracking-tight">
                          {template.name}
                        </span>
                        <span className="text-[10px] text-purple-300/60 font-mono mt-0.5">
                          {template.nicheName}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e0d1a] via-transparent to-black/20 pointer-events-none" />
                    
                    {/* Version tag */}
                    <span className="absolute top-2.5 right-2.5 text-[9px] font-mono font-bold text-purple-300 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10 pointer-events-none">
                      v{template.version || 1}.0
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-display font-bold text-sm sm:text-base text-white group-hover:text-purple-200 transition-colors line-clamp-1 mb-1">
                      {template.name}
                    </h3>

                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {template.description}
                    </p>
                  </div>
                </div>

                {/* Actions: VISUALIZAR | PERSONALIZAR */}
                <div className="p-4 pt-0">
                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/5">
                    <button
                      onClick={() => handleAction(template, 'preview')}
                      disabled={isLoadingThis}
                      className="py-2 px-3 bg-[#161427] hover:bg-[#201d38] border border-purple-500/25 text-gray-200 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                    >
                      {isLoadingThis ? (
                        <Loader2 size={13} className="text-purple-400 animate-spin" />
                      ) : (
                        <Eye size={13} className="text-purple-400" />
                      )}
                      <span>{isLoadingThis ? 'CARREGANDO...' : 'VISUALIZAR'}</span>
                    </button>

                    <button
                      onClick={() => handleAction(template, 'customize')}
                      disabled={isLoadingThis}
                      className="py-2 px-3 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-[0_2px_12px_rgba(147,51,234,0.4)] active:scale-95 transition-all disabled:opacity-50"
                    >
                      {isLoadingThis ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <Palette size={13} />
                      )}
                      <span>{isLoadingThis ? 'CARREGANDO...' : 'PERSONALIZAR'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </section>
  );
};
