import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GoogleIcon } from './Icons';
import { Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle2, ShieldCheck, KeyRound, Sparkles } from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { loginWithEmail, registerWithEmail, loginWithGoogle, resetPassword } = useAuth();
  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>('login');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [registeredPending, setRegisteredPending] = useState(false);

  const handleResetState = () => {
    setError(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (tab === 'login') {
      if (!email.trim() || !password) {
        setError('Por favor, informe seu e-mail e senha.');
        return;
      }

      setLoading(true);
      try {
        await loginWithEmail(email.trim(), password);
      } catch (err: any) {
        console.error('Erro no login:', err);
        if (
          err.code === 'auth/invalid-credential' ||
          err.code === 'auth/wrong-password' ||
          err.code === 'auth/user-not-found'
        ) {
          setError('E-mail ou senha incorretos.');
        } else if (err.code === 'auth/operation-not-allowed') {
          setError('O provedor de e-mail requer ativação no Firebase Auth. Você também pode entrar via Google!');
        } else if (err.code === 'auth/too-many-requests') {
          setError('Muitas tentativas sem sucesso. Tente novamente em alguns minutos.');
        } else {
          setError(err.message || 'Erro ao efetuar login.');
        }
      } finally {
        setLoading(false);
      }
    } else if (tab === 'register') {
      if (!name.trim()) {
        setError('Por favor, informe seu nome completo.');
        return;
      }
      if (!email.trim()) {
        setError('Por favor, informe um endereço de e-mail válido.');
        return;
      }
      if (password.length < 6) {
        setError('A senha deve ter no mínimo 6 caracteres.');
        return;
      }
      if (password !== confirmPassword) {
        setError('As senhas digitadas não coincidem.');
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
          setError('O provedor de e-mail requer ativação no Firebase Auth. Você também pode entrar via Google!');
        } else {
          setError(err.message || 'Erro ao realizar cadastro.');
        }
      } finally {
        setLoading(false);
      }
    } else if (tab === 'forgot') {
      if (!email.trim()) {
        setError('Informe seu e-mail para receber o link de recuperação.');
        return;
      }

      setLoading(true);
      try {
        await resetPassword(email.trim());
        setSuccessMessage('E-mail de recuperação enviado com sucesso! Verifique sua caixa de entrada.');
      } catch (err: any) {
        console.error('Erro ao redefinir senha:', err);
        setError(err.message || 'Erro ao solicitar recuperação de senha.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.error('Erro login Google:', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Não foi possível entrar com Google no momento.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] relative flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Background Glow Illumination */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-purple-600/12 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[360px] h-[360px] bg-violet-700/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container Card */}
      <div className="w-full max-w-[440px] relative z-10">
        
        {/* Top Header Badge & Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center mb-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4c1d95] via-[#7c3aed] to-[#a855f7] p-[2px] shadow-[0_10px_25px_rgba(147,51,234,0.45),inset_0_1px_1px_rgba(255,255,255,0.4)]">
              <div className="w-full h-full rounded-[14px] bg-gradient-to-b from-[#1b0d33] to-[#0c0617] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 via-transparent to-white/10 pointer-events-none" />
                <span className="font-display font-black text-2xl tracking-tighter bg-gradient-to-b from-white via-purple-100 to-purple-300 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(168,85,247,0.7)]">
                  BF
                </span>
              </div>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-white">
            BIO{' '}
            <span className="bg-gradient-to-r from-[#d8b4fe] via-[#c084fc] to-[#a855f7] bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(168,85,247,0.5)]">
              FÁCIL
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-gray-400 mt-1.5 font-medium">
            Crie biosites que impressionam.
          </p>
        </div>

        {/* Card Box */}
        <div className="bg-[#0e0d18]/90 backdrop-blur-2xl border border-purple-500/25 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_30px_rgba(147,51,234,0.12)]">
          
          {registeredPending ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.25)]">
                <CheckCircle2 size={32} />
              </div>

              <h2 className="text-lg font-display font-bold text-white">
                Cadastro Realizado!
              </h2>

              <p className="text-xs text-gray-300 leading-relaxed max-w-sm mx-auto">
                Seu cadastro foi realizado com sucesso. Aguardando aprovação do administrador para liberar seu acesso à plataforma.
              </p>

              <button
                onClick={() => {
                  setRegisteredPending(false);
                  setTab('login');
                }}
                className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl text-xs transition-all shadow-[0_4px_15px_rgba(147,51,234,0.35)]"
              >
                Voltar para o Login
              </button>
            </div>
          ) : (
            <>
              {/* Tab Selector */}
              {tab !== 'forgot' && (
                <div className="flex bg-[#090812] p-1 rounded-2xl border border-purple-500/20 mb-6">
                  <button
                    type="button"
                    onClick={() => {
                      setTab('login');
                      handleResetState();
                    }}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                      tab === 'login'
                        ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.4)]'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    FAZER LOGIN
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTab('register');
                      handleResetState();
                    }}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                      tab === 'register'
                        ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.4)]'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    CRIAR CONTA
                  </button>
                </div>
              )}

              {/* Forgot password mode header */}
              {tab === 'forgot' && (
                <div className="mb-6 flex items-center justify-between pb-3 border-b border-white/5">
                  <div className="flex items-center gap-2 text-white">
                    <KeyRound size={16} className="text-purple-400" />
                    <span className="text-sm font-bold">Recuperar Senha</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setTab('login');
                      handleResetState();
                    }}
                    className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
                  >
                    Voltar ao Login
                  </button>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-rose-950/60 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-start gap-2.5">
                  <AlertCircle size={15} className="shrink-0 mt-0.5" />
                  <span className="leading-snug">{error}</span>
                </div>
              )}

              {/* Success Message */}
              {successMessage && (
                <div className="mb-4 p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-start gap-2.5">
                  <CheckCircle2 size={15} className="shrink-0 mt-0.5" />
                  <span className="leading-snug">{successMessage}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Field (register only) */}
                {tab === 'register' && (
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      Seu Nome Completo
                    </label>
                    <div className="relative">
                      <User size={15} className="absolute left-3.5 top-3.5 text-gray-500" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Carlos Silva"
                        className="w-full bg-[#121020] border border-purple-500/25 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>
                  </div>
                )}

                {/* Email Field */}
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    Seu E-mail
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-3.5 text-gray-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seuemail@exemplo.com"
                      className="w-full bg-[#121020] border border-purple-500/25 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Password Field (login & register) */}
                {tab !== 'forgot' && (
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      Sua Senha
                    </label>
                    <div className="relative">
                      <Lock size={15} className="absolute left-3.5 top-3.5 text-gray-500" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#121020] border border-purple-500/25 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>
                  </div>
                )}

                {/* Confirm Password Field (register only) */}
                {tab === 'register' && (
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      Confirmar Senha
                    </label>
                    <div className="relative">
                      <Lock size={15} className="absolute left-3.5 top-3.5 text-gray-500" />
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#121020] border border-purple-500/25 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>
                  </div>
                )}

                {/* Login Options: Remember Me & Forgot Password */}
                {tab === 'login' && (
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-purple-500/30 text-purple-600 focus:ring-0 bg-[#121020]"
                      />
                      <span className="text-[11px] text-gray-400">Manter conectado</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        setTab('forgot');
                        handleResetState();
                      }}
                      className="text-[11px] text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      Esqueci minha senha
                    </button>
                  </div>
                )}

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(147,51,234,0.4)] disabled:opacity-50 transition-all active:scale-[0.98]"
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>
                        {tab === 'login'
                          ? 'ENTRAR NA PLATAFORMA →'
                          : tab === 'register'
                          ? 'CRIAR MINHA CONTA →'
                          : 'ENVIAR INSTRUÇÕES →'}
                      </span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </form>

              {/* Social Login Separator (only for login or register) */}
              {tab !== 'forgot' && (
                <>
                  <div className="relative my-5">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-purple-500/20" />
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase font-mono">
                      <span className="bg-[#0e0d18] px-3 text-gray-500">ou continue com</span>
                    </div>
                  </div>

                  {/* Google Login Button */}
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full py-2.5 bg-[#121020] hover:bg-[#1a172e] border border-purple-500/30 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2.5 shadow-sm transition-all"
                  >
                    <GoogleIcon size={16} />
                    <span>Entrar com o Google</span>
                  </button>
                </>
              )}
            </>
          )}

        </div>

        {/* Bottom Security Footer */}
        <div className="mt-5 text-center flex items-center justify-center gap-1.5 text-gray-500 text-[11px]">
          <ShieldCheck size={13} className="text-purple-400" />
          <span>Ambiente Seguro • Autenticação Protegida</span>
        </div>

      </div>
    </div>
  );
};
