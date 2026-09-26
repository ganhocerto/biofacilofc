import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Clock, ShieldAlert, LogOut, RefreshCw } from 'lucide-react';

export const AccessStatusNotice: React.FC = () => {
  const { userProfile, logout, refreshProfile } = useAuth();

  if (!userProfile) return null;

  const isPending = userProfile.status === 'pending';
  const isBlocked = userProfile.status === 'blocked';
  const isRejected = userProfile.status === 'rejected';

  if (!isPending && !isBlocked && !isRejected) return null;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-[#07070b]">
      <div className="w-full max-w-md bg-[#0e0d18] border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(147,51,234,0.25)] text-center space-y-5">
        
        {/* Status Icon */}
        <div
          className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center shadow-lg ${
            isPending
              ? 'bg-amber-500/10 border border-amber-500/40 text-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.25)]'
              : 'bg-rose-500/10 border border-rose-500/40 text-rose-400 shadow-[0_0_25px_rgba(244,63,94,0.25)]'
          }`}
        >
          {isPending ? <Clock size={32} /> : <ShieldAlert size={32} />}
        </div>

        {/* Title */}
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-white mb-2">
            {isPending && 'Acesso Aguardando Aprovação'}
            {isBlocked && 'Conta Temporariamente Bloqueada'}
            {isRejected && 'Acesso Não Aprovado'}
          </h2>

          <div className="text-xs sm:text-sm text-gray-300 leading-relaxed bg-[#151325] p-4 rounded-2xl border border-purple-500/20 text-left space-y-2">
            {isPending && (
              <>
                <p className="font-semibold text-amber-300">
                  Cadastro realizado com sucesso!
                </p>
                <p className="text-gray-400">
                  Seu cadastro foi recebido com sucesso. Para manter a qualidade e segurança da plataforma BIO FÁCIL, o seu acesso requer a aprovação de um Administrador.
                </p>
                <p className="text-gray-400 text-xs">
                  Assim que for aprovado, você terá acesso irrestrito ao catálogo de nichos, modelos profissionais e personalização em tempo real.
                </p>
              </>
            )}

            {isBlocked && (
              <p className="text-gray-400">
                O acesso desta conta foi suspenso temporariamente pela administração da plataforma. Entre em contato com o suporte para mais informações.
              </p>
            )}

            {isRejected && (
              <p className="text-gray-400">
                Sua solicitação de acesso não foi aprovada pela administração no momento.
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => refreshProfile()}
            className="flex-1 py-2.5 px-4 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(147,51,234,0.35)] transition-all"
          >
            <RefreshCw size={14} />
            <span>Verificar Status</span>
          </button>

          <button
            onClick={() => logout()}
            className="py-2.5 px-4 bg-[#181628] hover:bg-[#23203b] border border-white/10 text-gray-300 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <LogOut size={14} />
            <span>Sair</span>
          </button>
        </div>

      </div>
    </div>
  );
};
