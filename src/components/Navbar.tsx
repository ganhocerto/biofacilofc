import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, LogOut, Layers, FolderHeart, Menu, X, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentTab: 'catalog' | 'my-projects' | 'admin';
  onSelectTab: (tab: 'catalog' | 'my-projects' | 'admin') => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenAuth,
}) => {
  const { currentUser, userProfile, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Extract first name safely without email display
  const rawName = userProfile?.displayName?.trim() || currentUser?.email?.split('@')[0] || 'Usuário';
  const userFirstName = rawName.split(' ')[0];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#07070b]/95 backdrop-blur-xl border-b border-purple-500/20 shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        
        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectTab('catalog')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            {/* 3D Icon Badge */}
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#4c1d95] via-[#7c3aed] to-[#a855f7] p-[1.5px] shadow-[0_4px_16px_rgba(147,51,234,0.45),inset_0_1px_1px_rgba(255,255,255,0.4)] flex items-center justify-center group-hover:scale-105 transition-all">
              <div className="w-full h-full rounded-[14px] bg-gradient-to-b from-[#1b0d33] to-[#0c0617] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 via-transparent to-white/10 pointer-events-none" />
                <span className="font-display font-black text-sm tracking-tighter bg-gradient-to-b from-white via-purple-100 to-purple-300 bg-clip-text text-transparent drop-shadow-[0_1px_4px_rgba(168,85,247,0.7)]">
                  BF
                </span>
              </div>
            </div>

            {/* Typography */}
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="font-display font-black text-lg sm:text-xl tracking-tight text-white">
                  BIO{' '}
                  <span className="bg-gradient-to-r from-[#d8b4fe] via-[#c084fc] to-[#a855f7] bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(168,85,247,0.4)]">
                    FÁCIL
                  </span>
                </span>
                <span className="hidden sm:inline-block text-[9px] font-semibold tracking-wider text-purple-300/70 uppercase">
                  · CRIE. PERSONALIZE. PUBLIQUE.
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 text-xs font-semibold">
          <button
            onClick={() => onSelectTab('catalog')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 ${
              currentTab === 'catalog'
                ? 'bg-[#181628] text-purple-300 border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.25)]'
                : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Layers size={15} className="text-purple-400" />
            <span>Nichos & Modelos</span>
          </button>

          {currentUser && (
            <button
              onClick={() => onSelectTab('my-projects')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 ${
                currentTab === 'my-projects'
                  ? 'bg-[#181628] text-purple-300 border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.25)]'
                : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <FolderHeart size={15} className="text-purple-400" />
              <span>Meus Biosites</span>
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => onSelectTab('admin')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 ${
                currentTab === 'admin'
                  ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.45)]'
                  : 'text-purple-300 hover:text-white bg-[#141224] hover:bg-[#1c1932] border border-purple-500/30'
              }`}
            >
              <Shield size={15} className="text-amber-300" />
              <span>PAINEL ADMINISTRATIVO</span>
            </button>
          )}
        </nav>

        {/* User Badge / Auth Button */}
        <div className="flex items-center gap-2.5">
          {currentUser ? (
            <div className="flex items-center gap-3">
              {isAdmin ? (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#141224] border border-purple-500/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse"></div>
                  <span className="text-xs font-bold text-white tracking-wide font-mono">
                    ADMINISTRADOR
                  </span>
                </div>
              ) : (
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-bold text-white">
                    {userFirstName}
                  </span>
                  <span className="text-[10px] text-purple-400 uppercase tracking-wider font-mono">
                    Conta Ativa
                  </span>
                </div>
              )}

              <button
                onClick={() => logout()}
                title="Sair da plataforma"
                className="p-2 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors border border-transparent hover:border-rose-500/20"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 rounded-xl shadow-[0_4px_15px_rgba(147,51,234,0.35)] transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Sparkles size={14} />
              <span>Entrar / Cadastrar</span>
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white rounded-lg bg-[#141224] border border-white/5"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0914] border-b border-purple-500/20 p-4 space-y-2 animate-fade-in">
          <button
            onClick={() => {
              onSelectTab('catalog');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg text-xs font-semibold text-gray-200 hover:bg-purple-950/40 flex items-center gap-2"
          >
            <Layers size={14} className="text-purple-400" />
            <span>Nichos & Modelos</span>
          </button>

          {currentUser && (
            <button
              onClick={() => {
                onSelectTab('my-projects');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg text-xs font-semibold text-gray-200 hover:bg-purple-950/40 flex items-center gap-2"
            >
              <FolderHeart size={14} className="text-purple-400" />
              <span>Meus Biosites</span>
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => {
                onSelectTab('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg text-xs font-semibold text-purple-300 bg-purple-950/40 border border-purple-500/30 flex items-center gap-2"
            >
              <Shield size={14} className="text-amber-300" />
              <span>PAINEL ADMINISTRATIVO</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
