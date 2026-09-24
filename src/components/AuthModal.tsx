import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GoogleIcon } from './Icons';
import { X, Lock, Mail, User, AlertCircle, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const { loginWithEmail, registerWithEmail, loginWithGoogle, resetPassword } = useAuth();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('jeanncarllostk00@gmail.com');
  const [password, setPassword] = useState('Deus@@@mkt');
  const [confirmPassword, setConfirmPassword] = useState('Deus@@@mkt');
  const [rememberMe, setRememberMe] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [registeredPending, setRegisteredPending] = useState(false);

  if (!isOpen) return null;

  const handleResetState = () => {
    setError(null);
    setSuccessMessage(null);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (mode === 'register') {
      if (!name.trim()) {
        setError('Por favor, informe seu nome completo.');
        return;
      }
      if (password.length < 6) {
        setError('A senha deve ter no mínimo 6 caracteres.');
        return;
      }
      if (password !== confirmPassword) {
        setError('As senhas não coincidem.');
        return;
      }

      setLoading(true);
      try {
        await registerWithEmail(name.trim(), email.trim(), password);
        setRegisteredPending(true);
      } catch (err: any) {
        console.error('Erro no cadastro:', err);
        if (err.code === 'auth/email-already-in-use') {
          setError('Este e-mail já está cadastrado. Faça login ou recupere sua senha.');
        } else if (err.code === 'auth/operation-not-allowed') {
          setError('O provedor de e-mail e senha requer ativação no Firebase Auth. Você também pode entrar via Google!');
        } else {
          setError(err.message || 'Erro ao realizar cadastro.');
        }
      } finally {
        setLoading(false);
      }
    } else if (mode === 'login') {
      setLoading(true);
      try {
        await loginWithEmail(email.trim(), password);
        onClose();
      } catch (err: any) {
        console.error('Erro no login:', err);
        if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
          setError('E-mail ou senha incorretos.');
        } else if (err.code === 'auth/operation-not-allowed') {
          setError('O provedor de e-mail requer ativação no Firebase Auth. Você também pode entrar com o Google!');
        } else {
          setError(err.message || 'Erro ao efetuar login.');
        }
      } finally {
        setLoading(false);
      }
    } else if (mode === 'forgot') {
      if (!email.trim()) {
        setError('Informe seu e-mail para receber as instruções.');
        return;
      }
      setLoading(true);
      try {
        await resetPassword(email.trim());
        setSuccessMessage('E-mail de recuperação enviado com sucesso! Verifique sua caixa de entrada.');
      } catch (err: any) {
        setError(err.message || 'Erro ao solicitar recuperação.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGoogleSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      onClose();
    } catch (err: any) {
      console.error('Erro Google Auth:', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Não foi possível autenticar com o Google.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      {/* Central 3D Card */}
      <div className="relative w-full max-w-md bg-[#0b0a14] border border-purple-500/25 rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_35px_rgba(147,51,234,0.18)] text-white overflow-hidden my-8">
        
        {/* Subtle Top Glow Line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[2px] bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-white rounded-xl bg-[#141224] hover:bg-[#1f1d35] border border-white/5 transition-colors"
          title="Fechar"
        >
          <X size={16} />
        </button>

        {registeredPending ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-xl font-display font-bold text-white">
              Cadastro Realizado!
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed bg-[#131122] p-4 rounded-2xl border border-purple-500/20 text-left">
              Sua conta foi criada com sucesso e está <strong className="text-amber-300">aguardando aprovação do administrador</strong>.
              Você receberá a liberação para começar a criar e personalizar seus biosites.
            </p>
            <button
              onClick={() => {
                setRegisteredPending(false);
                onClose();
              }}
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl text-xs transition-all shadow-[0_4px_15px_rgba(147,51,234,0.35)]"
            >
              Entendido
            </button>
          </div>
        ) : (
          <>
            {/* Header Identity */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center mb-2.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4c1d95] via-[#7c3aed] to-[#a855f7] p-[1.5px] shadow-[0_6px_20px_rgba(147,51,234,0.4),inset_0_1px_1px_rgba(255,255,255,0.4)]">
                  <div className="w-full h-full rounded-[14px] bg-gradient-to-b from-[#1b0d33] to-[#0c0617] flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 via-transparent to-white/10 pointer-events-none" />
                    <span className="font-display font-black text-xl tracking-tighter bg-gradient-to-b from-white via-purple-100 to-purple-300 bg-clip-text text-transparent drop-shadow-[0_1px_6px_rgba(168,85,247,0.7)]">
                      BF
                    </span>
                  </div>
                </div>
              </div>

              <h2 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-white">
                BIO{' '}
                <span className="bg-gradient-to-r from-[#d8b4fe] via-[#c084fc] to-[#a855f7] bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(168,85,247,0.4)]">
                  FÁCIL
                </span>
              </h2>

              <p className="text-xs text-gray-400 mt-1">
                "Crie biosites que impressionam."
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            {mode !== 'forgot' && (
              <div className="grid grid-cols-2 p-1 bg-[#131122] rounded-2xl border border-purple-500/20 mb-6">
                <button
                  type="button"
                  onClick={() => {
                    handleResetState();
                    setMode('login');
                  }}
                  className={`py-2 text-xs font-bold rounded-xl transition-all ${
                    mode === 'login'
                      ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.4)]'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  FAZER LOGIN
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleResetState();
                    setMode('register');
                  }}
                  className={`py-2 text-xs font-bold rounded-xl transition-all ${
                    mode === 'register'
                      ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.4)]'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  CRIAR CONTA
                </button>
              </div>
            )}

            {/* Error / Success Notifications */}
            {error && (
              <div className="mb-4 p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl flex items-center gap-2 text-xs text-rose-300">
                <AlertCircle size={15} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-xs text-emerald-300">
                <CheckCircle2 size={15} className="shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleEmailSubmit} className="space-y-3.5">
              {mode === 'register' && (
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Nome Completo
                  </label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-3 text-gray-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Carlos Silva"
                      className="w-full bg-[#121120] border border-purple-500/25 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  E-mail
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-3 text-gray-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    className="w-full bg-[#121120] border border-purple-500/25 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider">
                      Senha
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => {
                          handleResetState();
                          setMode('forgot');
                        }}
                        className="text-[11px] text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        Esqueci minha senha
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-3 text-gray-500" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#121120] border border-purple-500/25 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                </div>
              )}

              {mode === 'register' && (
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Confirmar Senha
                  </label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-3 text-gray-500" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#121120] border border-purple-500/25 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                </div>
              )}

              {mode === 'login' && (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="remember-me"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-purple-600 focus:ring-purple-500 bg-[#121120] border-purple-500/30"
                  />
                  <label htmlFor="remember-me" className="text-xs text-gray-400 cursor-pointer select-none">
                    Manter conectado
                  </label>
                </div>
              )}

              {/* Main CTA Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(147,51,234,0.4)] transition-all active:scale-95 disabled:opacity-50"
              >
                <span>
                  {loading
                    ? 'Processando...'
                    : mode === 'login'
                    ? 'ENTRAR NA PLATAFORMA →'
                    : mode === 'register'
                    ? 'CRIAR MINHA CONTA →'
                    : 'Enviar Instruções'}
                </span>
                {!loading && <ArrowRight size={14} />}
              </button>
            </form>

            {/* Back to login when on forgot mode */}
            {mode === 'forgot' && (
              <div className="text-center mt-3">
                <button
                  type="button"
                  onClick={() => {
                    handleResetState();
                    setMode('login');
                  }}
                  className="text-xs text-purple-400 hover:text-purple-300"
                >
                  Voltar para o Login
                </button>
              </div>
            )}

            {/* Google Divider */}
            {mode !== 'forgot' && (
              <>
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/5"></div>
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-wider">
                    <span className="bg-[#0b0a14] px-2 text-gray-500">ou continue com</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSubmit}
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-[#141224] hover:bg-[#1d1a33] border border-purple-500/25 rounded-xl text-xs font-semibold text-gray-200 flex items-center justify-center gap-2.5 transition-all shadow-sm"
                >
                  <GoogleIcon size={16} />
                  <span>Google</span>
                </button>
              </>
            )}

            {/* Discrete Security Footer */}
            <div className="mt-6 pt-4 border-t border-white/5 text-center flex items-center justify-center gap-1.5 text-[10px] text-gray-500 font-mono">
              <ShieldCheck size={12} className="text-emerald-400/80" />
              <span>Ambiente Seguro • Autenticação Protegida</span>
            </div>
          </>
        )}

      </div>
    </div>
  );
};
