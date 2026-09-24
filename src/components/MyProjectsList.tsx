import React, { useState } from 'react';
import { UserProject, BiositeTemplate } from '../types';
import { useData } from '../context/DataContext';
import { downloadBiositeZip } from '../utils/zipManager';
import {
  FolderHeart,
  Edit3,
  Download,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  Plus,
  Sparkles
} from 'lucide-react';

interface MyProjectsListProps {
  onEditProject: (project: UserProject, template: BiositeTemplate) => void;
  onNewProject: () => void;
  onPreviewProject: (html: string, title: string) => void;
}

export const MyProjectsList: React.FC<MyProjectsListProps> = ({
  onEditProject,
  onNewProject,
  onPreviewProject,
}) => {
  const { userProjects, templates, deleteProject } = useData();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyHtml = async (project: UserProject) => {
    await navigator.clipboard.writeText(project.htmlCompiled);
    setCopiedId(project.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDownload = async (project: UserProject) => {
    const template = templates.find((t) => t.id === project.templateId);
    const manifest = {
      templateId: project.templateId,
      name: project.name,
      category: template?.nicheName || 'Biosite',
      version: template?.version || 1,
      fields: template?.fields || [],
    };
    await downloadBiositeZip(project.name, project.htmlCompiled, manifest);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja excluir o projeto "${name}"? Esta ação não pode ser desfeita.`)) {
      await deleteProject(id);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-purple-500/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FolderHeart size={20} className="text-purple-400" />
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
              Meus Biosites Salvos
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-400">
            Gerencie suas páginas, continue personalizando e baixe os arquivos prontos para publicar.
          </p>
        </div>

        <button
          onClick={onNewProject}
          className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(147,51,234,0.35)] transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Criar Novo Biosite</span>
        </button>
      </div>

      {/* Projects List */}
      {userProjects.length === 0 ? (
        <div className="text-center py-16 bg-[#100f1c] border border-purple-500/20 rounded-2xl p-8 max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-950/50 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
            <Sparkles size={28} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            Nenhum biosite criado ainda
          </h3>
          <p className="text-xs text-gray-400 mb-6 leading-relaxed">
            Você ainda não personalizou nenhum modelo. Escolha um dos nossos nichos profissionais e crie seu biosite em menos de 2 minutos!
          </p>
          <button
            onClick={onNewProject}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl transition-all shadow-[0_0_15px_rgba(147,51,234,0.4)]"
          >
            Explorar Nichos & Modelos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {userProjects.map((project) => {
            const template = templates.find((t) => t.id === project.templateId);

            return (
              <div
                key={project.id}
                className="bg-[#100f1c] border border-purple-500/20 hover:border-purple-500/40 rounded-2xl overflow-hidden flex flex-col justify-between p-5 transition-all hover:shadow-[0_10px_25px_-5px_rgba(147,51,234,0.25)]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/20 uppercase">
                      {template?.nicheName || 'Biosite'}
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">
                      {new Date(project.updatedAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-base text-white tracking-tight line-clamp-1 mb-1">
                    {project.name}
                  </h3>

                  <p className="text-xs text-gray-400 line-clamp-1 mb-4">
                    Baseado no modelo: {template?.name || 'Modelo Personalizado'}
                  </p>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-4 border-t border-white/5">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => template && onEditProject(project, template)}
                      className="py-2 px-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95"
                    >
                      <Edit3 size={13} />
                      <span>Editar</span>
                    </button>

                    <button
                      onClick={() => onPreviewProject(project.htmlCompiled, project.name)}
                      className="py-2 px-3 bg-[#171526] hover:bg-[#221f36] border border-purple-500/25 text-purple-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                    >
                      <ExternalLink size={13} />
                      <span>Visualizar</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopyHtml(project)}
                      className="flex-1 py-1.5 px-2 bg-[#12111d] hover:bg-[#1a192a] border border-white/5 text-gray-300 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors"
                      title="Copiar HTML"
                    >
                      {copiedId === project.id ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      <span>{copiedId === project.id ? 'Copiado' : 'Copiar HTML'}</span>
                    </button>

                    <button
                      onClick={() => handleDownload(project)}
                      className="flex-1 py-1.5 px-2 bg-[#12111d] hover:bg-[#1a192a] border border-white/5 text-purple-300 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors"
                      title="Baixar ZIP"
                    >
                      <Download size={12} />
                      <span>Baixar ZIP</span>
                    </button>

                    <button
                      onClick={() => handleDelete(project.id, project.name)}
                      className="p-1.5 text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Excluir biosite"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
