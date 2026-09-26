import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReload = () => {
    if (this.props.onReset) {
      this.setState({ hasError: false, error: null });
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#07070b] flex items-center justify-center p-4 sm:p-6 text-white selection:bg-purple-500">
          <div className="max-w-md w-full bg-[#0e0d1a] border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(147,51,234,0.15)] text-center space-y-5">
            
            <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.25)]">
              <AlertTriangle size={30} />
            </div>

            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-rose-950/60 border border-rose-500/30 text-[10px] font-mono text-rose-300 font-bold uppercase tracking-wider mb-2">
                RECUPERAÇÃO DE ESTABILIDADE
              </div>
              <h2 className="text-xl font-display font-black text-white tracking-tight">
                {this.props.fallbackTitle || 'Ocorreu uma instabilidade pontual'}
              </h2>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                A aplicação identificou uma falha de inicialização ou renderização e ativou a proteção automática para não deixar a tela preta.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="bg-[#141224] p-3 rounded-xl border border-white/5 text-left overflow-x-auto max-h-24">
                <span className="text-[10px] font-mono text-gray-400 block mb-1">DETALHES DO ERRO:</span>
                <code className="text-[11px] font-mono text-rose-300 break-words">
                  {this.state.error.message}
                </code>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(147,51,234,0.35)] transition-all"
              >
                <RefreshCw size={14} />
                <span>RECARREGAR APLICAÇÃO</span>
              </button>

              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.href = '/';
                }}
                className="w-full sm:w-auto px-4 py-2.5 bg-[#17152b] hover:bg-[#201d3a] border border-purple-500/30 text-purple-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <Home size={14} />
                <span>INÍCIO</span>
              </button>
            </div>

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
