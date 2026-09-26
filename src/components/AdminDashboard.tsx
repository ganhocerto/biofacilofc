import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Niche, BiositeTemplate, UserProfile, EditableField, FieldType, UserProject } from '../types';
import { analyzeHtmlForBiosite, stampDataBioAttributes, injectVisualInspectorScript } from '../utils/htmlAnalyzer';
import { unpackBiositeZip, downloadBiositeZip } from '../utils/zipManager';
import { NicheIconMap } from './Icons';
import {
  Shield,
  Users,
  Layers,
  CheckCircle2,
  XCircle,
  Clock,
  Ban,
  Search,
  Plus,
  Edit2,
  Trash2,
  Upload,
  Code,
  FileCode,
  Archive,
  MousePointerClick,
  Sparkles,
  Eye,
  Save,
  Check,
  Smartphone,
  Monitor,
  Tag,
  FolderKanban,
  Settings,
  HelpCircle,
  ArrowRight,
  ExternalLink,
  Download,
  Copy,
  X
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    niches,
    templates,
    allUsers,
    userProjects,
    addNiche,
    updateNiche,
    deleteNiche,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    updateUserStatus,
    seedInitialDataIfEmpty,
  } = useData();
  const { currentUser } = useAuth();

  // Menu Section State: 'overview' | 'users' | 'models' | 'niches' | 'import-site' | 'projects' | 'settings'
  const [adminSection, setAdminSection] = useState<
    'overview' | 'users' | 'models' | 'niches' | 'import-site' | 'projects' | 'settings'
  >('overview');

  // ==========================================
  // STATS CALCULATIONS
  // ==========================================
  const totalUsers = allUsers.length;
  const pendingUsers = allUsers.filter((u) => u.status === 'pending').length;
  const approvedUsers = allUsers.filter((u) => u.status === 'approved').length;
  const totalModels = templates.length;
  const publishedModels = templates.filter((t) => t.status === 'published').length;
  const totalProjects = userProjects.length;

  // ==========================================
  // USERS MANAGEMENT STATE
  // ==========================================
  const [userTab, setUserTab] = useState<'pending' | 'approved' | 'blocked' | 'rejected' | 'all'>('pending');
  const [userSearch, setUserSearch] = useState('');

  const filteredUsers = useMemo(() => {
    return allUsers.filter((u) => {
      const matchStatus = userTab === 'all' ? true : u.status === userTab;
      const matchSearch =
        u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.displayName.toLowerCase().includes(userSearch.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [allUsers, userTab, userSearch]);

  // ==========================================
  // NICHES MANAGEMENT STATE
  // ==========================================
  const [editingNiche, setEditingNiche] = useState<Niche | null>(null);
  const [isNicheModalOpen, setIsNicheModalOpen] = useState(false);
  const [nicheForm, setNicheForm] = useState({
    name: '',
    description: '',
    icon: 'Scissors',
    order: 1,
    active: true,
  });

  const handleOpenNewNiche = () => {
    setEditingNiche(null);
    setNicheForm({
      name: '',
      description: '',
      icon: 'Scissors',
      order: niches.length + 1,
      active: true,
    });
    setIsNicheModalOpen(true);
  };

  const handleOpenEditNiche = (n: Niche) => {
    setEditingNiche(n);
    setNicheForm({
      name: n.name,
      description: n.description,
      icon: n.icon,
      order: n.order,
      active: n.active,
    });
    setIsNicheModalOpen(true);
  };

  const handleSaveNiche = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nicheForm.name.trim()) return;

    if (editingNiche) {
      await updateNiche(editingNiche.id, {
        name: nicheForm.name.trim(),
        description: nicheForm.description.trim(),
        icon: nicheForm.icon,
        order: Number(nicheForm.order),
        active: nicheForm.active,
      });
    } else {
      const id = nicheForm.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      await addNiche({
        id: `${id}-${Date.now().toString(36)}`,
        name: nicheForm.name.trim(),
        description: nicheForm.description.trim(),
        icon: nicheForm.icon,
        order: Number(nicheForm.order),
        active: nicheForm.active,
      });
    }
    setIsNicheModalOpen(false);
  };

  // ==========================================
  // MODEL ACTIONS: TEST, EDIT, DUPLICATE
  // ==========================================
  const [testingModel, setTestingModel] = useState<BiositeTemplate | null>(null);
  const [editingModel, setEditingModel] = useState<BiositeTemplate | null>(null);
  const [editingModelForm, setEditingModelForm] = useState({
    name: '',
    description: '',
    nicheId: '',
    coverImage: '',
    status: 'published' as 'draft' | 'published',
  });

  const handleOpenEditModel = (tmpl: BiositeTemplate) => {
    setEditingModel(tmpl);
    setEditingModelForm({
      name: tmpl.name,
      description: tmpl.description,
      nicheId: tmpl.nicheId,
      coverImage: tmpl.coverImage,
      status: tmpl.status,
    });
  };

  const handleSaveEditedModel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModel || !editingModelForm.name.trim()) return;

    const targetNiche = niches.find((n) => n.id === editingModelForm.nicheId) || niches[0];
    await updateTemplate(editingModel.id, {
      name: editingModelForm.name.trim(),
      description: editingModelForm.description.trim(),
      nicheId: targetNiche?.id || editingModel.nicheId,
      nicheName: targetNiche?.name || editingModel.nicheName,
      coverImage: editingModelForm.coverImage,
      status: editingModelForm.status,
      updatedAt: new Date().toISOString(),
    });
    setEditingModel(null);
  };

  const handleDuplicateModel = async (tmpl: BiositeTemplate) => {
    const cloneId = `template_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const cloned: BiositeTemplate = {
      ...tmpl,
      id: cloneId,
      name: `${tmpl.name} (Cópia)`,
      version: 1,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await addTemplate(cloned);
  };

  // ==========================================
  // IMPORT SITE / NEW MODEL WORKFLOW
  // ==========================================
  const [importMethod, setImportMethod] = useState<'paste' | 'html-file' | 'zip' | 'biofacil-pkg'>('paste');
  const [rawHtmlInput, setRawHtmlInput] = useState('');
  const [modelName, setModelName] = useState('');
  const [modelNicheId, setModelNicheId] = useState(niches[0]?.id || 'barbearia');
  const [modelDescription, setModelDescription] = useState('');
  const [modelCoverImage, setModelCoverImage] = useState('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80');
  const [modelStatus, setModelStatus] = useState<'draft' | 'published'>('published');
  
  const [analyzedFields, setAnalyzedFields] = useState<EditableField[]>([]);
  const [workingHtml, setWorkingHtml] = useState('');
  const [isAnalyzed, setIsAnalyzed] = useState(false);

  // Field config modal from preview click
  const [activeConfigureModal, setActiveConfigureModal] = useState<null | {
    fieldId: string;
    tagName: string;
    attr: 'text' | 'html' | 'src' | 'href' | 'style';
    value: string;
  }>(null);

  const [configureFieldName, setConfigureFieldName] = useState('');
  const [configureFieldType, setConfigureFieldType] = useState<FieldType>('text');
  const [configureFieldGroup, setConfigureFieldGroup] = useState('Identidade');

  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Analyze HTML
  const handleAnalyzeHtml = (htmlContent: string) => {
    if (!htmlContent.trim()) return;
    const { detected } = analyzeHtmlForBiosite(htmlContent);
    const convertedFields: EditableField[] = detected.map((d) => ({
      id: d.id,
      name: d.name,
      type: d.type,
      selector: d.selector,
      attr: d.attr,
      dataBioAttr: d.dataBioAttr,
      originalValue: d.originalValue,
      group: d.category,
    }));

    setWorkingHtml(htmlContent);
    setAnalyzedFields(convertedFields);
    setIsAnalyzed(true);
  };

  // Upload HTML File
  const handleHtmlFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result as string;
      setRawHtmlInput(content);
      handleAnalyzeHtml(content);
    };
    reader.readAsText(file);
  };

  // Upload ZIP File
  const handleZipFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await unpackBiositeZip(file);
      setRawHtmlInput(result.html);
      setWorkingHtml(result.html);

      if (result.manifest) {
        setModelName(result.manifest.name || file.name.replace('.zip', ''));
        if (result.manifest.fields && result.manifest.fields.length > 0) {
          setAnalyzedFields(result.manifest.fields);
          setIsAnalyzed(true);
          return;
        }
      }

      handleAnalyzeHtml(result.html);
    } catch (err: any) {
      alert(`Erro ao processar arquivo ZIP: ${err.message}`);
    }
  };

  // Save Configured Field
  const handleSaveConfiguredField = () => {
    if (!activeConfigureModal || !configureFieldName.trim()) return;

    const newField: EditableField = {
      id: activeConfigureModal.fieldId || `field_${Date.now().toString(36)}`,
      name: configureFieldName.trim(),
      type: configureFieldType,
      attr: activeConfigureModal.attr,
      originalValue: activeConfigureModal.value,
      group: configureFieldGroup,
    };

    setAnalyzedFields((prev) => {
      const filtered = prev.filter((f) => f.id !== newField.id);
      return [...filtered, newField];
    });

    setActiveConfigureModal(null);
  };

  // Publish Template
  const handlePublishTemplate = async () => {
    if (!modelName.trim()) {
      alert('Informe o nome do modelo.');
      return;
    }
    if (!workingHtml.trim()) {
      alert('Nenhum HTML foi analisado.');
      return;
    }

    setIsPublishing(true);
    try {
      const targetNiche = niches.find((n) => n.id === modelNicheId) || niches[0];
      const stampedHtml = stampDataBioAttributes(workingHtml, analyzedFields);
      const templateId = `template_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

      const newTemplate: BiositeTemplate = {
        id: templateId,
        name: modelName.trim(),
        nicheId: targetNiche?.id || 'barbearia',
        nicheName: targetNiche?.name || 'Barbearia',
        description: modelDescription.trim() || 'Modelo profissional BIO FÁCIL.',
        coverImage: modelCoverImage,
        version: 1,
        status: modelStatus,
        htmlContent: stampedHtml,
        fields: analyzedFields,
        authorId: currentUser?.uid || 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await addTemplate(newTemplate);
      setPublishSuccess(true);
      setTimeout(() => {
        setPublishSuccess(false);
        setAdminSection('models');
        setModelName('');
        setWorkingHtml('');
        setAnalyzedFields([]);
        setIsAnalyzed(false);
      }, 1500);
    } catch (err) {
      console.error('Erro ao cadastrar modelo:', err);
      alert('Erro ao salvar modelo no Firestore.');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-purple-500/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-widest uppercase text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30 font-bold">
              ADMINISTRADOR
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
              BIO{' '}
              <span className="bg-gradient-to-r from-[#fbbf24] via-[#f472b6] to-[#a855f7] bg-clip-text text-transparent">
                FÁCIL
              </span>
            </span>
            <span className="text-gray-400 font-display font-bold text-lg sm:text-xl">
              · PAINEL ADMINISTRATIVO
            </span>
          </div>
        </div>

        {/* Compact Navigation Menu */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#0e0d1a] p-1.5 rounded-2xl border border-purple-500/20 overflow-x-auto">
          <button
            onClick={() => setAdminSection('overview')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
              adminSection === 'overview'
                ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(147,51,234,0.35)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            VISÃO GERAL
          </button>

          <button
            onClick={() => setAdminSection('users')}
            className={`relative px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
              adminSection === 'users'
                ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(147,51,234,0.35)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span>USUÁRIOS</span>
            {pendingUsers > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 bg-amber-500 text-black text-[9px] font-bold rounded-full">
                {pendingUsers}
              </span>
            )}
          </button>

          <button
            onClick={() => setAdminSection('models')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
              adminSection === 'models'
                ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(147,51,234,0.35)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            MODELOS
          </button>

          <button
            onClick={() => setAdminSection('niches')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
              adminSection === 'niches'
                ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(147,51,234,0.35)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            NICHOS
          </button>

          <button
            onClick={() => setAdminSection('import-site')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap flex items-center gap-1.5 transition-all ${
              adminSection === 'import-site'
                ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-[0_0_18px_rgba(168,85,247,0.5)]'
                : 'bg-purple-950/40 text-purple-300 hover:text-white border border-purple-500/30'
            }`}
          >
            <Sparkles size={13} className="text-amber-300" />
            <span>IMPORTAR BIOSITE</span>
          </button>

          <button
            onClick={() => setAdminSection('projects')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
              adminSection === 'projects'
                ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(147,51,234,0.35)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            PROJETOS
          </button>

          <button
            onClick={() => setAdminSection('settings')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
              adminSection === 'settings'
                ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(147,51,234,0.35)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            CONFIGURAÇÕES
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. VISÃO GERAL (OVERVIEW) & STATS */}
      {/* ========================================================================= */}
      {adminSection === 'overview' && (
        <div className="space-y-8">
          
          {/* 6 Key Metrics 3D Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            <div className="bg-[#0e0d1a] border border-purple-500/20 rounded-2xl p-4 shadow-[0_10px_25px_rgba(0,0,0,0.6)]">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">USUÁRIOS</span>
              <span className="text-2xl font-display font-black text-white mt-1 block">{totalUsers}</span>
            </div>

            <div className="bg-[#161224] border border-amber-500/30 rounded-2xl p-4 shadow-[0_10px_25px_rgba(0,0,0,0.6)]">
              <span className="text-[10px] font-mono text-amber-300 uppercase tracking-wider block">PENDENTES</span>
              <span className="text-2xl font-display font-black text-amber-400 mt-1 block">{pendingUsers}</span>
            </div>

            <div className="bg-[#0e0d1a] border border-emerald-500/20 rounded-2xl p-4 shadow-[0_10px_25px_rgba(0,0,0,0.6)]">
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">APROVADOS</span>
              <span className="text-2xl font-display font-black text-white mt-1 block">{approvedUsers}</span>
            </div>

            <div className="bg-[#140e1b] border border-rose-500/30 rounded-2xl p-4 shadow-[0_10px_25px_rgba(0,0,0,0.6)]">
              <span className="text-[10px] font-mono text-rose-400 uppercase tracking-wider block">BLOQUEADOS</span>
              <span className="text-2xl font-display font-black text-rose-300 mt-1 block">{allUsers.filter((u) => u.status === 'blocked').length}</span>
            </div>

            <div className="bg-[#0e0d1a] border border-purple-500/20 rounded-2xl p-4 shadow-[0_10px_25px_rgba(0,0,0,0.6)]">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">MODELOS</span>
              <span className="text-2xl font-display font-black text-white mt-1 block">{totalModels}</span>
            </div>

            <div className="bg-[#0e0d1a] border border-purple-500/20 rounded-2xl p-4 shadow-[0_10px_25px_rgba(0,0,0,0.6)]">
              <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider block">PUBLICADOS</span>
              <span className="text-2xl font-display font-black text-white mt-1 block">{publishedModels}</span>
            </div>
          </div>

          {/* Prominent Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setAdminSection('import-site')}
              className="p-5 bg-[#0e0d1a] hover:bg-[#151326] border border-purple-500/30 rounded-2xl text-left transition-all group shadow-[0_10px_30px_rgba(0,0,0,0.7)]"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-950/60 border border-purple-500/40 flex items-center justify-center text-amber-300 mb-3 group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                <Code size={22} />
              </div>
              <h3 className="font-bold text-white text-base mb-1">IMPORTAR NOVO BIOSITE</h3>
              <p className="text-xs text-gray-400">
                Cole código HTML ou envie ZIP para transformar em modelo dinâmico com campos editáveis.
              </p>
            </button>

            <button
              onClick={() => {
                setUserTab('pending');
                setAdminSection('users');
              }}
              className="p-5 bg-[#0e0d1a] hover:bg-[#151326] border border-purple-500/30 rounded-2xl text-left transition-all group shadow-[0_10px_30px_rgba(0,0,0,0.7)]"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-950/60 border border-purple-500/40 flex items-center justify-center text-purple-300 mb-3 group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                <Users size={22} />
              </div>
              <h3 className="font-bold text-white text-base mb-1">GERENCIAR USUÁRIOS</h3>
              <p className="text-xs text-gray-400">
                Aprove ou bloqueie solicitações de acesso e visualize histórico de cadastros.
              </p>
            </button>

            <button
              onClick={() => setAdminSection('niches')}
              className="p-5 bg-[#0e0d1a] hover:bg-[#151326] border border-purple-500/30 rounded-2xl text-left transition-all group shadow-[0_10px_30px_rgba(0,0,0,0.7)]"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-950/60 border border-purple-500/40 flex items-center justify-center text-purple-300 mb-3 group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                <Layers size={22} />
              </div>
              <h3 className="font-bold text-white text-base mb-1">GERENCIAR NICHOS</h3>
              <p className="text-xs text-gray-400">
                Exiba, ative, ordene e configure ícones para os 10 nichos oficiais.
              </p>
            </button>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. GERENCIAMENTO DE USUÁRIOS */}
      {/* ========================================================================= */}
      {adminSection === 'users' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-display font-bold text-white">
                Gerenciamento de Usuários
              </h2>
              <p className="text-xs text-gray-400">
                Somente administradores podem visualizar, aprovar, bloquear ou rejeitar usuários.
              </p>
            </div>

            {/* User status tabs */}
            <div className="flex items-center gap-1 bg-[#0e0d1a] p-1 rounded-xl border border-purple-500/20">
              <button
                onClick={() => setUserTab('pending')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  userTab === 'pending' ? 'bg-amber-500 text-black font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                AGUARDANDO APROVAÇÃO ({pendingUsers})
              </button>
              <button
                onClick={() => setUserTab('approved')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  userTab === 'approved' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                APROVADOS ({approvedUsers})
              </button>
              <button
                onClick={() => setUserTab('blocked')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  userTab === 'blocked' ? 'bg-rose-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                BLOQUEADOS ({allUsers.filter((u) => u.status === 'blocked').length})
              </button>
              <button
                onClick={() => setUserTab('rejected')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  userTab === 'rejected' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                REJEITADOS ({allUsers.filter((u) => u.status === 'rejected').length})
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-3 text-gray-500" />
            <input
              type="text"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="Pesquisar por nome ou e-mail..."
              className="w-full bg-[#0e0d1a] border border-purple-500/25 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Users List */}
          <div className="bg-[#0e0d1a] border border-purple-500/20 rounded-2xl overflow-hidden divide-y divide-white/5">
            {filteredUsers.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-500">
                Nenhum usuário encontrado nesta categoria.
              </div>
            ) : (
              filteredUsers.map((u) => (
                <div key={u.uid} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-sm">{u.displayName || 'Sem nome'}</span>
                      {u.role === 'admin' && (
                        <span className="text-[9px] font-mono font-bold text-amber-300 bg-amber-950 px-1.5 py-0.2 rounded border border-amber-500/40">
                          ADMIN
                        </span>
                      )}
                      <span
                        className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
                          u.status === 'approved'
                            ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                            : u.status === 'pending'
                            ? 'bg-amber-950/60 border-amber-500/40 text-amber-300 font-bold'
                            : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                        }`}
                      >
                        {u.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 font-mono mt-0.5">
                      {u.email} · Cadastrado em {new Date(u.createdAt).toLocaleDateString('pt-BR')}
                    </div>
                  </div>

                  {/* Actions: APROVAR | REJEITAR | BLOQUEAR | DESBLOQUEAR */}
                  <div className="flex items-center gap-2">
                    {u.status !== 'approved' && (
                      <button
                        onClick={() => updateUserStatus(u.uid, 'approved')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs flex items-center gap-1 shadow-sm"
                      >
                        <CheckCircle2 size={13} />
                        <span>APROVAR</span>
                      </button>
                    )}

                    {u.status === 'pending' && (
                      <button
                        onClick={() => updateUserStatus(u.uid, 'rejected')}
                        className="px-3 py-1.5 bg-[#1f1724] hover:bg-rose-950 text-rose-300 border border-rose-500/30 rounded-lg text-xs"
                      >
                        REJEITAR
                      </button>
                    )}

                    {u.status === 'approved' && (
                      <button
                        onClick={() => updateUserStatus(u.uid, 'blocked')}
                        className="px-3 py-1.5 bg-[#171526] hover:bg-rose-950 text-gray-300 hover:text-rose-300 border border-white/10 rounded-lg text-xs flex items-center gap-1"
                      >
                        <Ban size={12} />
                        <span>BLOQUEAR</span>
                      </button>
                    )}

                    {u.status === 'blocked' && (
                      <button
                        onClick={() => updateUserStatus(u.uid, 'approved')}
                        className="px-3 py-1.5 bg-emerald-950 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs flex items-center gap-1"
                      >
                        <CheckCircle2 size={12} />
                        <span>DESBLOQUEAR</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. IMPORTAR SITE (DESTAQUE NO ADMIN) */}
      {/* ========================================================================= */}
      {adminSection === 'import-site' && (
        <div className="space-y-6">
          
          {/* Big Highlight Header */}
          <div className="bg-gradient-to-r from-[#17132a] via-[#121022] to-[#0c0b17] border border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(147,51,234,0.15)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30 font-bold">
                  DESTAQUE ESPECIAL
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-black text-white mt-1">
                  IMPORTAR NOVO BIOSITE
                </h2>
                <p className="text-xs sm:text-sm text-gray-300 max-w-xl mt-1">
                  Cole código HTML ou importe arquivos para transformar qualquer site existente em um modelo dinâmico preservando 100% do design original.
                </p>
              </div>

              {isAnalyzed && (
                <button
                  onClick={() => setIsAnalyzed(false)}
                  className="px-3 py-1.5 bg-[#171528] hover:bg-[#201d38] border border-purple-500/30 text-purple-300 rounded-xl text-xs"
                >
                  Reiniciar Análise
                </button>
              )}
            </div>

            {/* 4 Options: COLAR CÓDIGO HTML receives special highlight */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                onClick={() => setImportMethod('paste')}
                className={`py-3 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  importMethod === 'paste'
                    ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)] ring-2 ring-purple-400'
                    : 'bg-[#151326] text-gray-300 hover:text-white border border-purple-500/30'
                }`}
              >
                <Code size={15} className="text-amber-300" />
                <span>&lt;&gt; COLAR CÓDIGO HTML</span>
              </button>

              <button
                onClick={() => setImportMethod('html-file')}
                className={`py-3 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  importMethod === 'html-file'
                    ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.4)]'
                    : 'bg-[#151326] text-gray-300 hover:text-white border border-white/5'
                }`}
              >
                <FileCode size={15} />
                <span>↑ IMPORTAR HTML</span>
              </button>

              <button
                onClick={() => setImportMethod('zip')}
                className={`py-3 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  importMethod === 'zip'
                    ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.4)]'
                    : 'bg-[#151326] text-gray-300 hover:text-white border border-white/5'
                }`}
              >
                <Archive size={15} />
                <span>▣ IMPORTAR ZIP</span>
              </button>

              <button
                onClick={() => setImportMethod('biofacil-pkg')}
                className={`py-3 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  importMethod === 'biofacil-pkg'
                    ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.4)]'
                    : 'bg-[#151326] text-gray-300 hover:text-white border border-white/5'
                }`}
              >
                <Sparkles size={15} />
                <span>◆ PACOTE BIO FÁCIL</span>
              </button>
            </div>
          </div>

          {/* Input Method Content */}
          <div className="bg-[#0e0d1a] border border-purple-500/25 rounded-3xl p-5 sm:p-6 space-y-4">
            {importMethod === 'paste' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white uppercase tracking-wider">
                    Código HTML Completo do Biosite:
                  </label>
                  <button
                    onClick={() => handleAnalyzeHtml(rawHtmlInput)}
                    disabled={!rawHtmlInput.trim()}
                    className="px-5 py-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-[0_4px_18px_rgba(147,51,234,0.4)] disabled:opacity-40 transition-all"
                  >
                    <Sparkles size={14} className="text-amber-300" />
                    <span>ANALISAR BIOSITE</span>
                  </button>
                </div>
                <textarea
                  rows={9}
                  value={rawHtmlInput}
                  onChange={(e) => setRawHtmlInput(e.target.value)}
                  placeholder="<!DOCTYPE html><html><head>...</head><body>...</body></html>"
                  className="w-full bg-[#08080f] border border-purple-500/25 rounded-2xl p-3.5 font-mono text-xs text-purple-200 placeholder-gray-600 focus:outline-none focus:border-purple-500"
                />
              </div>
            )}

            {importMethod === 'html-file' && (
              <div className="p-8 border-2 border-dashed border-purple-500/30 rounded-2xl text-center space-y-3">
                <FileCode size={36} className="mx-auto text-purple-400" />
                <h4 className="text-sm font-semibold text-white">Importar Arquivo HTML</h4>
                <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md">
                  <Upload size={14} />
                  <span>Selecionar Arquivo .html</span>
                  <input type="file" accept=".html,.htm" onChange={handleHtmlFileUpload} className="hidden" />
                </label>
              </div>
            )}

            {(importMethod === 'zip' || importMethod === 'biofacil-pkg') && (
              <div className="p-8 border-2 border-dashed border-purple-500/30 rounded-2xl text-center space-y-3">
                <Archive size={36} className="mx-auto text-purple-400" />
                <h4 className="text-sm font-semibold text-white">Importar Arquivo ZIP do Biosite</h4>
                <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md">
                  <Upload size={14} />
                  <span>Selecionar Arquivo .zip</span>
                  <input type="file" accept=".zip" onChange={handleZipFileUpload} className="hidden" />
                </label>
              </div>
            )}
          </div>

          {/* Visual Configurator: Split Preview REAL & CONFIGURAR CAMPOS EDITÁVEIS */}
          {isAnalyzed && (
            <div className="space-y-6">
              
              {/* Template Metadata */}
              <div className="bg-[#0e0d1a] border border-purple-500/25 rounded-2xl p-5 space-y-3">
                <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                  <Tag size={15} className="text-purple-400" />
                  <span>Dados do Modelo no Catálogo</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">Nome do Modelo</label>
                    <input
                      type="text"
                      value={modelName}
                      onChange={(e) => setModelName(e.target.value)}
                      placeholder="Ex: Barbearia Elegance Dark"
                      className="w-full bg-[#141224] border border-purple-500/25 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">Nicho Pertencente</label>
                    <select
                      value={modelNicheId}
                      onChange={(e) => setModelNicheId(e.target.value)}
                      className="w-full bg-[#141224] border border-purple-500/25 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    >
                      {niches.map((n) => (
                        <option key={n.id} value={n.id}>
                          {n.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">Status</label>
                    <select
                      value={modelStatus}
                      onChange={(e) => setModelStatus(e.target.value as any)}
                      className="w-full bg-[#141224] border border-purple-500/25 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="published">Publicado no Catálogo</option>
                      <option value="draft">Rascunho (Admin)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Split Preview REAL & Fields List */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left: Preview REAL */}
                <div className="lg:col-span-7 bg-[#0a0914] border border-purple-500/25 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MousePointerClick size={16} className="text-purple-400" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        PREVIEW REAL INTERATIVO
                      </span>
                    </div>

                    <div className="flex items-center gap-1 bg-[#151426] p-0.5 rounded-lg border border-purple-500/20">
                      <button
                        onClick={() => setPreviewDevice('mobile')}
                        className={`p-1 rounded text-xs ${previewDevice === 'mobile' ? 'bg-purple-600 text-white' : 'text-gray-400'}`}
                      >
                        <Smartphone size={13} />
                      </button>
                      <button
                        onClick={() => setPreviewDevice('desktop')}
                        className={`p-1 rounded text-xs ${previewDevice === 'desktop' ? 'bg-purple-600 text-white' : 'text-gray-400'}`}
                      >
                        <Monitor size={13} />
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-purple-300 bg-purple-950/40 p-2.5 rounded-xl border border-purple-500/20">
                    ✦ Clique diretamente em qualquer elemento (Logo, Textos, Fotos, Botões, WhatsApp, Instagram, Maps) para torná-lo personalizável para o cliente.
                  </p>

                  <div className="w-full h-[520px] flex items-center justify-center bg-black rounded-xl overflow-hidden p-2">
                    <div className={`h-full transition-all rounded-xl overflow-hidden border border-purple-500/20 bg-black ${previewDevice === 'mobile' ? 'w-[360px] ring-4 ring-[#161426]' : 'w-full'}`}>
                      <iframe
                        srcDoc={injectVisualInspectorScript(workingHtml, true)}
                        title="Model Preview"
                        className="w-full h-full border-0"
                        sandbox="allow-scripts allow-same-origin allow-popups"
                      />
                    </div>
                  </div>
                </div>

                {/* Right: Configured Fields */}
                <div className="lg:col-span-5 bg-[#0e0d1a] border border-purple-500/25 rounded-2xl p-4 space-y-4 max-h-[600px] flex flex-col">
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                      CAMPOS CONFIGURADOS ({analyzedFields.length})
                    </h4>
                    <span className="text-[10px] text-purple-400 font-mono">biofacil.json</span>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                    {analyzedFields.map((field) => (
                      <div
                        key={field.id}
                        className="bg-[#141224] border border-purple-500/20 rounded-xl p-3 flex items-start justify-between gap-2"
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-white">{field.name}</span>
                            <span className="text-[9px] font-mono text-purple-300 bg-purple-950 px-1.5 py-0.2 rounded border border-purple-500/30 uppercase">
                              {field.type}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-400 truncate max-w-[200px] mt-0.5 font-mono">
                            {field.originalValue}
                          </p>
                        </div>
                        <button
                          onClick={() => setAnalyzedFields((prev) => prev.filter((f) => f.id !== field.id))}
                          className="text-gray-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handlePublishTemplate}
                    disabled={isPublishing}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(147,51,234,0.4)] disabled:opacity-50"
                  >
                    {publishSuccess ? <Check size={16} /> : <Save size={16} />}
                    <span>{isPublishing ? 'Publicando...' : publishSuccess ? 'Modelo Publicado!' : 'PUBLICAR MODELO NO CATÁLOGO'}</span>
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* Modal to configure element as editable */}
          {activeConfigureModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="w-full max-w-sm bg-[#0e0d18] border border-purple-500/40 rounded-2xl p-5 shadow-2xl text-white">
                <h3 className="text-base font-display font-bold mb-2">
                  Configurar Elemento como Editável
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Nome do Campo</label>
                    <input
                      type="text"
                      value={configureFieldName}
                      onChange={(e) => setConfigureFieldName(e.target.value)}
                      placeholder="Ex: Título Principal, Logo, WhatsApp"
                      className="w-full bg-[#141224] border border-purple-500/25 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Tipo de Campo</label>
                    <select
                      value={configureFieldType}
                      onChange={(e) => setConfigureFieldType(e.target.value as any)}
                      className="w-full bg-[#141224] border border-purple-500/25 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="text">Texto Simples</option>
                      <option value="title">Título Principal</option>
                      <option value="logo">Logomarca (PNG transparente)</option>
                      <option value="image">Imagem</option>
                      <option value="whatsapp">Link do WhatsApp</option>
                      <option value="instagram">Link do Instagram</option>
                      <option value="facebook">Link do Facebook</option>
                      <option value="tiktok">Link do TikTok</option>
                      <option value="youtube">Link do YouTube</option>
                      <option value="link">Google Maps / Avaliação Google</option>
                      <option value="phone">Telefone</option>
                      <option value="email">E-mail</option>
                      <option value="hours">Horário de Atendimento</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => setActiveConfigureModal(null)}
                      className="px-3 py-1.5 text-xs text-gray-400 hover:text-white"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveConfiguredField}
                      className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl text-xs"
                    >
                      Confirmar Campo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODELOS (CATALOG MANAGEMENT) */}
      {/* ========================================================================= */}
      {adminSection === 'models' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-display font-bold text-white">Modelos ({templates.length})</h2>
              <p className="text-xs text-gray-400">Modelos cadastrados disponíveis para personalização.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAdminSection('import-site')}
                className="px-3.5 py-2 bg-[#17152b] hover:bg-[#201d3a] border border-purple-500/30 text-purple-200 hover:text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Sparkles size={13} className="text-amber-300" />
                <span>IMPORTAR BIOSITE</span>
              </button>
              <button
                onClick={() => setAdminSection('import-site')}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Plus size={14} />
                <span>+ NOVO MODELO</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {templates.map((tmpl) => (
              <div key={tmpl.id} className="bg-[#0e0d1a] border border-purple-500/20 hover:border-purple-400/40 rounded-2xl overflow-hidden flex flex-col justify-between transition-all shadow-[0_8px_25px_rgba(0,0,0,0.6)]">
                <div className="relative aspect-video bg-[#0c0b14] overflow-hidden">
                  <img src={tmpl.coverImage} alt={tmpl.name} className="w-full h-full object-cover" />
                  <span className={`absolute top-2.5 right-2.5 text-[9px] font-mono font-bold px-2 py-0.5 rounded-md ${tmpl.status === 'published' ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/50' : 'bg-amber-950/90 text-amber-300 border border-amber-500/50'}`}>
                    {tmpl.status === 'published' ? 'PUBLICADO' : 'RASCUNHO'}
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-purple-400 uppercase">
                      <span>{tmpl.nicheName} · v{tmpl.version}.0</span>
                      <span className="text-gray-500">{new Date(tmpl.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <h3 className="font-bold text-white text-base mt-1 mb-1 line-clamp-1">{tmpl.name}</h3>
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-2">{tmpl.description}</p>
                    <div className="text-[11px] text-gray-400 font-mono">{tmpl.fields?.length || 0} campos editáveis</div>
                  </div>

                  {/* Actions: TESTAR | EDITAR | PUBLICAR/DESPUBLICAR | DUPLICAR | EXCLUIR */}
                  <div className="pt-3 mt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-1.5 text-xs">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setTestingModel(tmpl)}
                        className="px-2 py-1 bg-[#141224] hover:bg-purple-900/40 text-purple-300 border border-purple-500/25 rounded-lg text-[11px] flex items-center gap-1 transition-colors"
                        title="Testar Modelo"
                      >
                        <Eye size={12} />
                        <span>TESTAR</span>
                      </button>
                      <button
                        onClick={() => handleOpenEditModel(tmpl)}
                        className="px-2 py-1 bg-[#141224] hover:bg-purple-900/40 text-purple-300 border border-purple-500/25 rounded-lg text-[11px] flex items-center gap-1 transition-colors"
                        title="Editar Informações"
                      >
                        <Edit2 size={12} />
                        <span>EDITAR</span>
                      </button>
                      <button
                        onClick={() => handleDuplicateModel(tmpl)}
                        className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        title="Duplicar Modelo"
                      >
                        <Copy size={13} />
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateTemplate(tmpl.id, { status: tmpl.status === 'published' ? 'draft' : 'published' })}
                        className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold border transition-colors ${
                          tmpl.status === 'published'
                            ? 'bg-amber-950/40 border-amber-500/30 text-amber-300 hover:bg-amber-900/40'
                            : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/40'
                        }`}
                      >
                        {tmpl.status === 'published' ? 'DESPUBLICAR' : 'PUBLICAR'}
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Excluir modelo "${tmpl.name}"?`)) deleteTemplate(tmpl.id);
                        }}
                        className="p-1.5 text-gray-500 hover:text-rose-400 rounded-lg transition-colors"
                        title="Excluir Modelo"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Modal Testar Modelo */}
          {testingModel && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
              <div className="w-full max-w-4xl h-[90vh] bg-[#0c0b16] border border-purple-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
                <div className="p-4 border-b border-purple-500/20 flex items-center justify-between bg-[#121022]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase bg-purple-950 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">
                      MODO DE TESTE
                    </span>
                    <h3 className="font-bold text-white text-sm">{testingModel.name}</h3>
                  </div>
                  <button
                    onClick={() => setTestingModel(null)}
                    className="p-1.5 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="flex-1 bg-[#06060a] p-4 flex items-center justify-center overflow-auto">
                  <div className="w-full max-w-[430px] h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
                    <iframe
                      srcDoc={testingModel.htmlContent}
                      title="Preview Modelo"
                      className="w-full h-full border-0"
                      sandbox="allow-scripts allow-same-origin"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal Editar Modelo */}
          {editingModel && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
              <div className="w-full max-w-lg bg-[#0e0d18] border border-purple-500/30 rounded-3xl p-6 shadow-2xl text-white">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                  <h3 className="text-lg font-display font-bold">Editar Informações do Modelo</h3>
                  <button onClick={() => setEditingModel(null)} className="text-gray-400 hover:text-white">
                    <X size={18} />
                  </button>
                </div>
                <form onSubmit={handleSaveEditedModel} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Nome do Modelo</label>
                    <input
                      type="text"
                      required
                      value={editingModelForm.name}
                      onChange={(e) => setEditingModelForm({ ...editingModelForm, name: e.target.value })}
                      className="w-full bg-[#141224] border border-purple-500/25 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Nicho Correspondente</label>
                    <select
                      value={editingModelForm.nicheId}
                      onChange={(e) => setEditingModelForm({ ...editingModelForm, nicheId: e.target.value })}
                      className="w-full bg-[#141224] border border-purple-500/25 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    >
                      {niches.map((n) => (
                        <option key={n.id} value={n.id}>{n.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Descrição</label>
                    <textarea
                      rows={2}
                      value={editingModelForm.description}
                      onChange={(e) => setEditingModelForm({ ...editingModelForm, description: e.target.value })}
                      className="w-full bg-[#141224] border border-purple-500/25 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">URL da Imagem de Capa</label>
                    <input
                      type="url"
                      value={editingModelForm.coverImage}
                      onChange={(e) => setEditingModelForm({ ...editingModelForm, coverImage: e.target.value })}
                      className="w-full bg-[#141224] border border-purple-500/25 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Status de Publicação</label>
                    <select
                      value={editingModelForm.status}
                      onChange={(e) => setEditingModelForm({ ...editingModelForm, status: e.target.value as any })}
                      className="w-full bg-[#141224] border border-purple-500/25 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="published">Publicado (Visível aos clientes)</option>
                      <option value="draft">Rascunho (Visível apenas ao admin)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => setEditingModel(null)}
                      className="px-4 py-2 text-xs text-gray-400 hover:text-white"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-bold rounded-xl text-xs"
                    >
                      Salvar Alterações
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. NICHOS (10 NICHOS OFICIAIS) */}
      {/* ========================================================================= */}
      {adminSection === 'niches' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-display font-bold text-white">Nichos Cadastrados ({niches.length})</h2>
              <p className="text-xs text-gray-400">Gerencie a lista dos 10 nichos oficiais no Firestore.</p>
            </div>
            <button
              onClick={handleOpenNewNiche}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
            >
              <Plus size={14} />
              <span>+ Criar Nicho</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {niches.map((niche) => {
              const IconComp = NicheIconMap[niche.icon] || Layers;
              const count = templates.filter((t) => t.nicheId === niche.id && t.status === 'published').length;

              return (
                <div key={niche.id} className="bg-[#0e0d1a] border border-purple-500/20 rounded-2xl p-4 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-300">
                        <IconComp size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm uppercase">{niche.name}</h3>
                        <span className="text-[10px] text-purple-400 font-mono">
                          {count > 0 ? `${count} modelos` : 'EM BREVE'}
                        </span>
                      </div>
                    </div>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full ${niche.active ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' : 'bg-gray-800 text-gray-400'}`}>
                      {niche.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-3">{niche.description}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                    <span className="text-gray-500 font-mono text-[10px]">Ordem: #{niche.order}</span>
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleOpenEditNiche(niche)} className="p-1.5 text-gray-400 hover:text-white rounded-lg">
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Excluir nicho "${niche.name}"?`)) deleteNiche(niche.id);
                        }}
                        className="p-1.5 text-gray-400 hover:text-rose-400 rounded-lg"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Modal Niche */}
          {isNicheModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="w-full max-w-md bg-[#0e0d18] border border-purple-500/30 rounded-2xl p-6 shadow-2xl text-white">
                <h3 className="text-lg font-display font-bold mb-4">{editingNiche ? 'Editar Nicho' : 'Novo Nicho'}</h3>
                <form onSubmit={handleSaveNiche} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Nome do Nicho</label>
                    <input
                      type="text"
                      required
                      value={nicheForm.name}
                      onChange={(e) => setNicheForm({ ...nicheForm, name: e.target.value })}
                      placeholder="Ex: Barbearia, Dentistas"
                      className="w-full bg-[#141224] border border-purple-500/25 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Descrição</label>
                    <textarea
                      rows={2}
                      value={nicheForm.description}
                      onChange={(e) => setNicheForm({ ...nicheForm, description: e.target.value })}
                      className="w-full bg-[#141224] border border-purple-500/25 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Ícone</label>
                      <select
                        value={nicheForm.icon}
                        onChange={(e) => setNicheForm({ ...nicheForm, icon: e.target.value })}
                        className="w-full bg-[#141224] border border-purple-500/25 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                      >
                        {Object.keys(NicheIconMap).map((iconName) => (
                          <option key={iconName} value={iconName}>{iconName}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Ordem</label>
                      <input
                        type="number"
                        value={nicheForm.order}
                        onChange={(e) => setNicheForm({ ...nicheForm, order: Number(e.target.value) })}
                        className="w-full bg-[#141224] border border-purple-500/25 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="niche-active"
                      checked={nicheForm.active}
                      onChange={(e) => setNicheForm({ ...nicheForm, active: e.target.checked })}
                      className="rounded text-purple-600"
                    />
                    <label htmlFor="niche-active" className="text-xs text-gray-300 cursor-pointer">
                      Nicho ativo na tela inicial
                    </label>
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/5">
                    <button type="button" onClick={() => setIsNicheModalOpen(false)} className="px-3 py-2 text-xs text-gray-400">
                      Cancelar
                    </button>
                    <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl text-xs">
                      Salvar Nicho
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. PROJETOS (USER SITES OVERVIEW) */}
      {/* ========================================================================= */}
      {adminSection === 'projects' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-display font-bold text-white">Todos os Projetos Criados ({userProjects.length})</h2>
            <p className="text-xs text-gray-400">Biosites personalizados criados pelos clientes na plataforma.</p>
          </div>

          <div className="bg-[#0e0d1a] border border-purple-500/20 rounded-2xl overflow-hidden divide-y divide-white/5">
            {userProjects.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-500">Nenhum projeto salvo na plataforma ainda.</div>
            ) : (
              userProjects.map((p) => (
                <div key={p.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-white text-sm">{p.name}</h4>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">
                      Criador: {p.userEmail} · Atualizado: {new Date(p.updatedAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const template = templates.find((t) => t.id === p.templateId);
                      downloadBiositeZip(p.name, p.htmlCompiled, {
                        templateId: p.templateId,
                        name: p.name,
                        category: template?.nicheName || 'Biosite',
                        version: template?.version || 1,
                        fields: template?.fields || [],
                      });
                    }}
                    className="px-3 py-1.5 bg-[#151326] hover:bg-[#1f1d35] border border-purple-500/30 text-purple-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <Download size={13} />
                    <span>Baixar ZIP</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. CONFIGURAÇÕES */}
      {/* ========================================================================= */}
      {adminSection === 'settings' && (
        <div className="space-y-6 max-w-2xl">
          <div>
            <h2 className="text-xl font-display font-bold text-white">Configurações da Plataforma</h2>
            <p className="text-xs text-gray-400">Verificações de integridade do Firestore e dados iniciais.</p>
          </div>

          <div className="bg-[#0e0d1a] border border-purple-500/20 rounded-2xl p-5 space-y-4">
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Sincronização dos 10 Nichos Oficiais</h4>
              <p className="text-xs text-gray-400 leading-relaxed mb-3">
                Verifica se todos os 10 nichos oficiais estão presentes na coleção Firestore e adiciona os que faltarem sem sobrescrever alterações existentes.
              </p>
              <button
                onClick={async () => {
                  await seedInitialDataIfEmpty();
                  alert('Sincronização dos 10 nichos concluída com sucesso!');
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5"
              >
                <Check size={14} />
                <span>Verificar e Sincronizar Nichos</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
