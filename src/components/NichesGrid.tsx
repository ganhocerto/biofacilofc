import React from 'react';
import { Niche, BiositeTemplate } from '../types';
import { NicheIconMap } from './Icons';
import { useAuth } from '../context/AuthContext';
import { Layers, FolderHeart, Sparkles } from 'lucide-react';

interface NichesGridProps {
  niches: Niche[];
  templates: BiositeTemplate[];
  onSelectNiche: (niche: Niche) => void;
  onOpenMyProjects?: () => void;
}

export const NichesGrid: React.FC<NichesGridProps> = ({
  niches,
  templates,
  onSelectNiche,
  onOpenMyProjects,
}) => {
  const { userProfile, currentUser } = useAuth();

  // Extract first name safely without "Criador"
  const rawName = userProfile?.displayName?.trim() || currentUser?.email?.split('@')[0] || 'Usuário';
  const firstName = rawName.split(' ')[0];

  // Active niches sorted by order
  const sortedNiches = [...niches]
    .filter((n) => n.active)
    .sort((a, b) => (a.order || 99) - (b.order || 99));

  const getModelCount = (nicheId: string) => {
    return templates.filter((t) => t.nicheId === nicheId && t.status === 'published').length;
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
      
      {/* Topo Compacto */}
      <div className="bg-gradient-to-r from-[#121024] via-[#0f0e1c] to-[#0c0b16] border border-purple-500/25 rounded-3xl p-5 sm:p-7 shadow-[0_15px_40px_rgba(0,0,0,0.7)] flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4c1d95] via-[#7c3aed] to-[#a855f7] p-[1.5px] shadow-[0_6px_20px_rgba(147,51,234,0.4),inset_0_1px_1px_rgba(255,255,255,0.4)] shrink-0">
            <div className="w-full h-full rounded-[14px] bg-gradient-to-b from-[#1b0d33] to-[#0c0617] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 via-transparent to-white/10 pointer-events-none" />
              <span className="font-display font-black text-xl tracking-tighter bg-gradient-to-b from-white via-purple-100 to-purple-300 bg-clip-text text-transparent drop-shadow-[0_1px_6px_rgba(168,85,247,0.7)]">
                BF
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
                BIO{' '}
                <span className="bg-gradient-to-r from-[#d8b4fe] via-[#c084fc] to-[#a855f7] bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(168,85,247,0.4)]">
                  FÁCIL
                </span>
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-display font-bold text-white mt-0.5">
              Olá, {firstName}.
            </h2>

            <p className="text-xs sm:text-sm text-purple-200/80 mt-0.5">
              Escolha seu nicho e encontre o biosite ideal.
            </p>
          </div>
        </div>

        {/* Secondary Action: Meus Projetos */}
        {onOpenMyProjects && (
          <div className="shrink-0 self-start sm:self-center">
            <button
              onClick={onOpenMyProjects}
              className="px-4 py-2.5 bg-[#17152b] hover:bg-[#201d3a] border border-purple-500/35 hover:border-purple-400 text-purple-200 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-[0_4px_15px_rgba(0,0,0,0.5)] active:scale-95"
            >
              <FolderHeart size={15} className="text-purple-400" />
              <span>MEUS PROJETOS</span>
            </button>
          </div>
        )}
      </div>

      {/* Section Header: ESCOLHA SEU NICHO */}
      <div className="flex items-center justify-between pt-2 pb-1 border-b border-purple-500/15">
        <div className="flex items-center gap-2.5">
          <h3 className="font-display font-black text-base sm:text-lg text-white tracking-tight uppercase">
            ESCOLHA SEU NICHO
          </h3>
          <span className="text-[10px] font-mono font-bold text-purple-300 bg-purple-950/80 px-2.5 py-0.5 rounded-full border border-purple-500/30">
            {sortedNiches.length} NICHOS
          </span>
        </div>
      </div>

      {/* Niches 3D Grid: 2 cards per line on mobile, 3-5 on tablet/desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {sortedNiches.map((niche) => {
          const IconComp = NicheIconMap[niche.icon] || Layers;
          const count = getModelCount(niche.id);
          const hasModels = count > 0;

          return (
            <button
              key={niche.id}
              onClick={() => onSelectNiche(niche)}
              className="group relative text-left bg-[#0e0d18] hover:bg-[#151326] border border-purple-500/20 hover:border-purple-400/50 rounded-2xl p-4 sm:p-4.5 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_28px_-6px_rgba(147,51,234,0.35)] flex flex-col justify-between overflow-hidden focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              {/* Subtle top edge reflex highlight */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              {/* 3D Icon Container */}
              <div>
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-[#1d1b33] to-[#100f1e] border border-purple-500/30 p-2.5 flex items-center justify-center text-purple-300 group-hover:text-purple-200 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_6px_14px_rgba(0,0,0,0.6)] mb-3 transition-transform group-hover:scale-105">
                  <IconComp size={22} className="shrink-0" />
                </div>

                {/* Niche Name */}
                <h4 className="font-display font-bold text-xs sm:text-sm text-white group-hover:text-purple-200 transition-colors uppercase tracking-tight line-clamp-1">
                  {niche.name}
                </h4>
              </div>

              {/* Status / Model Count */}
              <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] font-mono">
                {hasModels ? (
                  <span className="text-purple-300 font-semibold">
                    {count} {count === 1 ? 'modelo' : 'modelos'}
                  </span>
                ) : (
                  <span className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">
                    EM BREVE
                  </span>
                )}

                <span className="text-purple-400/50 group-hover:text-purple-300 group-hover:translate-x-0.5 transition-all">
                  →
                </span>
              </div>
            </button>
          );
        })}
      </div>

    </section>
  );
};
