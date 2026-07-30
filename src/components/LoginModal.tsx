import React, { useState } from 'react';
import { UserSession } from '../types/engineering';
import { ShieldCheck, FileText, Lock, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface LoginModalProps {
  onLoginSuccess: (session: UserSession) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onLoginSuccess }) => {
  const [name, setName] = useState('Engenheiro Projetista');
  const [email, setEmail] = useState('engenharia@equipe.edu.br');
  const [organization, setOrganization] = useState('Equipe VORTEX Rocketry & Baja SAE');
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(true);
  const [showDocModal, setShowDocModal] = useState<'terms' | 'privacy' | null>(null);

  const handleDirectAccess = () => {
    onLoginSuccess({
      name,
      email,
      organization,
      acceptedTerms: true,
      acceptedPrivacy: true,
      isLoggedIn: true
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms || !acceptedPrivacy) {
      alert('Por favor, aceite os Termos de Uso e a Política de Privacidade para prosseguir.');
      return;
    }

    onLoginSuccess({
      name,
      email,
      organization,
      acceptedTerms,
      acceptedPrivacy,
      isLoggedIn: true
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-lg p-4 font-sans text-zinc-100 select-none">
      <div className="w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col relative animate-fade-in">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-sky-950/80 via-zinc-900 to-teal-950/80 p-6 border-b border-zinc-800 relative">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-500/10 rounded-2xl border border-sky-500/30 text-sky-400">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                CADMNAnimat Studio
                <span className="text-[10px] bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full border border-sky-500/30 font-mono">
                  v3.5 Enterprise
                </span>
              </h1>
              <p className="text-xs text-zinc-400">
                Plataforma de Modelagem CAD 3D & Estúdio de Simulação de Engenharia
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">
                Nome do Engenheiro / Usuário:
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Ana Clara Souza"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  E-mail Corporativo / Acadêmico:
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="engenharia@equipe.br"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Equipe / Instituição de Ensino:
                </label>
                <input
                  type="text"
                  required
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="Ex: Equipe Rocketry UFSC"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Agreements Section */}
          <div className="bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800/80 space-y-3">
            <h3 className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              Conformidade Legal & Aceite de Termos
            </h3>

            {/* Terms of Use */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded accent-sky-500 cursor-pointer"
              />
              <label htmlFor="terms" className="text-xs text-zinc-300 cursor-pointer select-none">
                Li e aceito integralmente os{' '}
                <button
                  type="button"
                  onClick={() => setShowDocModal('terms')}
                  className="text-sky-400 underline hover:text-sky-300 font-semibold cursor-pointer"
                >
                  Termos de Uso do CADMNAnimat
                </button>{' '}
                para simulações e projetos de engenharia.
              </label>
            </div>

            {/* Privacy Policy */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="privacy"
                checked={acceptedPrivacy}
                onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded accent-teal-500 cursor-pointer"
              />
              <label htmlFor="privacy" className="text-xs text-zinc-300 cursor-pointer select-none">
                Concordo com a{' '}
                <button
                  type="button"
                  onClick={() => setShowDocModal('privacy')}
                  className="text-teal-400 underline hover:text-teal-300 font-semibold cursor-pointer"
                >
                  Política de Privacidade
                </button>{' '}
                e proteção de dados de telemetria e projeto.
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              type="submit"
              disabled={!acceptedTerms || !acceptedPrivacy}
              className={`w-full py-3 px-5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer ${
                acceptedTerms && acceptedPrivacy
                  ? 'bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-zinc-950 shadow-sky-500/20 active:scale-98'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-60'
              }`}
            >
              <span>Autenticar & Escolher Modo de Trabalho</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleDirectAccess}
              className="w-full py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-sky-300 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Acessar Diretamente a Tela de Visualização 3D</span>
            </button>
          </div>
        </form>

        {/* Modal for Terms or Privacy text */}
        {showDocModal && (
          <div className="absolute inset-0 z-50 bg-zinc-950/95 backdrop-blur-md p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
                <h2 className="text-sm font-bold text-sky-400 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  {showDocModal === 'terms' ? 'Termos de Uso - CADMNAnimat Studio' : 'Política de Privacidade & Dados'}
                </h2>
                <button
                  onClick={() => setShowDocModal(null)}
                  className="text-zinc-400 hover:text-white text-xs px-2.5 py-1 bg-zinc-800 rounded-lg cursor-pointer"
                >
                  Fechar
                </button>
              </div>

              <div className="text-xs text-zinc-300 space-y-3 font-sans leading-relaxed">
                {showDocModal === 'terms' ? (
                  <>
                    <p><strong>1. Uso Autorizado:</strong> O software CADMNAnimat foi desenvolvido para modelagem CAD 3D, projetos aeroespaciais, automotivos, navais e simulações de engenharia avançada.</p>
                    <p><strong>2. Isenção e Responsabilidade Técnica:</strong> Projetos de foguetes, motores de propulsão híbrida/líquida e veículos de alta performance devem seguir regulamentações locais de segurança (ANAC, COBRA, SAE, FIA) e contar com engenheiro responsável habilitado (CREA/ART).</p>
                    <p><strong>3. Propriedade Intelectual:</strong> As geometrias exportadas em STL, OBJ e DXF pertencem integralmente ao usuário e à sua respectiva equipe/instituição.</p>
                  </>
                ) : (
                  <>
                    <p><strong>1. Proteção de Arquivos de Projeto:</strong> Seus modelos CAD 3D, cálculos propulsivos e dados financeiros de equipe são armazenados localmente e criptografados em sessão segura.</p>
                    <p><strong>2. Telemetria e Diagnóstico:</strong> O sistema não compartilha projetos com terceiros sem consentimento explícito.</p>
                    <p><strong>3. Conformidade LGPD:</strong> Você pode exportar ou apagar seus dados a qualquer momento através do painel de controle do projeto.</p>
                  </>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  if (showDocModal === 'terms') setAcceptedTerms(true);
                  if (showDocModal === 'privacy') setAcceptedPrivacy(true);
                  setShowDocModal(null);
                }}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Li e Aceito este Documento</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
