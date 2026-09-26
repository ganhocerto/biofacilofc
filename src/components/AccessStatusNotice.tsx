import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Clock, ShieldAlert, LogOut, RefreshCw, CheckCircle2 } from 'lucide-react';

export const AccessStatusNotice: React.FC = () => {
  const { userProfile, logout, refreshProfile } = useAuth();
  const [checking, setChecking] = useState(false);

  if (!userProfile) return null;

  const isPending = userProfile.status === 'pending';
  const isBlocked = userProfile.status === 'blocked';
  const isRejected = userProfile.status === 'rejected';

  if (!isPending && !isBlocked && !isRejected) return null;

  const handleCheckStatus = async () => {
    setChecking(true);
    try {
      await refreshProfile();
    } finally {
      setTimeout(() => setChecking(false), 600);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[#050508] relative overflow-hidden">
      {/* Background illumination */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="w-full max-w-md bg-[#0e0d18] border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_35px_rgba(147,51,234,0.18)] text-center space-y-6 relative z-10">
        
        {/* Top Logo / BF Badge */}
        <div className="inline-flex items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4c1d95] via-[#7c3aed] to-[#a855f7] p-[2px] shadow-[0_10px_25px_rgba(147,51,234,0.45),inset_0_1px_1px_rgba(255,255,255,0.4)]">
            <div className="w-full h-full rounded-[14px] bg-gradient-to-b from-[#1b0d33] to-[#0c0617] flex items-center justify-center relative overflow-hidden">
              <span className="font-display font-black text-2xl tracking-tighter bg-gradient-to-b from-white via-purple-100 to-purple-300 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(168,85,247,0.7)]">
                BF
              </span>
            </div>
          </div>
        </div>

        {/* Status Icon */}
        <div
          className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center shadow-lg ${
            isPending
              ? 'bg-amber-500/15 border border-amber-500/40 text-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.25)]'
              : 'bg-rose-500/15 border border-rose-500/40 text-rose-400 shadow-[0_0_25px_rgba(244,63,94,0.25)]'
          }`}
        >
          {isPending ? <Clock size={32} /> : <ShieldAlert size={32} />}
        </div>

        {/* Title and Message */}
        <div className="space-y-3">
          <h2 className="text-2xl font-display font-black text-white tracking-tight">
            {isPending && 'CONTA EM ANÁLISE'}
            {isBlocked && 'CONTA BLOQUEADA'}
            {isRejected && 'ACESSO NÃO APROVADO'}
          </h2>

          <div className="text-xs sm:text-sm text-gray-300 leading-relaxed bg-[#151325] p-5 rounded-2xl border border-purple-500/20 text-center space-y-2">
            {isPending && (
              <>
                <p className="font-semibold text-amber-300 text-sm">
                  Seu cadastro foi realizado com sucesso.
                </p>
                <p className="text-gray-300 text-xs">
                  Aguarde a aprovação do administrador para acessar o BIO FÁCIL.
                </p>
                <p className="text-[11px] text-gray-400 pt-1">
                  Assim que sua conta for liberada, seu acesso ao catálogo de nichos e modelos estará disponível imediatamente.
                </p>
              </>
            )}

            {isBlocked && (
              <p className="text-gray-300 text-xs">
                O acesso desta conta foi suspenso temporariamente pela administração da plataforma.
              </p>
            )}

            {isRejected && (
              <p className="text-gray-300 text-xs">
                Sua solicitação de cadastro não foi aprovada pela administração no momento.
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          {/* Sair / Desconectar */}
          <button
            onClick={() => logout()}
            className="w-full sm:flex-1 py-3 px-4 bg-[#181628] hover:bg-[#25223e] border border-white/10 hover:border-purple-500/40 text-gray-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <LogOut size={14} className="text-gray-400" />
            <span>SAIR / DESCONECTAR</span>
          </button>

          {/* Verificar Status */}
          {isPending && (
            <button
              onClick={handleCheckStatus}
              disabled={checking}
              className="w-full sm:flex-1 py-3 px-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(147,51,234,0.35)] transition-all"
            >
              <RefreshCw size={14} className={checking ? 'animate-spin' : ''} />
              <span>{checking ? 'VERIFICANDO...' : 'VERIFICAR STATUS'}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
