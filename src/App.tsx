import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { Navbar } from './components/Navbar';
import { AuthScreen } from './components/AuthScreen';
import { NichesGrid } from './components/NichesGrid';
import { NicheTemplatesView } from './components/NicheTemplatesView';
import { BiositeViewerModal } from './components/BiositeViewerModal';
import { BiositeEditor } from './components/BiositeEditor';
import { MyProjectsList } from './components/MyProjectsList';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { AccessStatusNotice } from './components/AccessStatusNotice';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Niche, BiositeTemplate, UserProject } from './types';

const MainAppContent: React.FC = () => {
  const { currentUser, userProfile, isAdmin, isApproved, loading } = useAuth();
  const { niches, templates, loadTemplateFull } = useData();

  // Navigation State
  const [currentTab, setCurrentTab] = useState<'catalog' | 'my-projects' | 'admin'>('catalog');
  const [selectedNiche, setSelectedNiche] = useState<Niche | null>(null);

  // Editor State
  const [customizingTemplate, setCustomizingTemplate] = useState<BiositeTemplate | null>(null);
  const [editingProject, setEditingProject] = useState<{
    project: UserProject;
    template: BiositeTemplate;
  } | null>(null);

  // Preview Modal State
  const [previewTemplate, setPreviewTemplate] = useState<BiositeTemplate | null>(null);

  // Auth Modal State (if opened from within the app)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Auto-route Admin to Admin Dashboard upon login
  useEffect(() => {
    if (isAdmin) {
      setCurrentTab('admin');
    }
  }, [isAdmin]);

  // Handle Customize trigger (checks auth and status)
  const handleStartCustomizing = async (template: BiositeTemplate) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    if (!isApproved) {
      return; // AccessStatusNotice handles pending status
    }
    let target = template;
    if (!template.htmlContent) {
      try {
        target = await loadTemplateFull(template.id);
      } catch (err) {
        console.warn('Erro ao carregar template completo:', err);
      }
    }
    setEditingProject(null);
    setCustomizingTemplate(target);
  };

  // Handle Edit saved project
  const handleEditSavedProject = async (project: UserProject, template: BiositeTemplate) => {
    let target = template;
    if (!template.htmlContent) {
      try {
        target = await loadTemplateFull(template.id);
      } catch (err) {
        console.warn('Erro ao carregar template completo:', err);
      }
    }
    setEditingProject({ project, template: target });
    setCustomizingTemplate(target);
  };

  // Handle Preview saved project
  const handlePreviewCustomProject = (html: string, title: string) => {
    const tempTemplate: BiositeTemplate = {
      id: 'preview-temp',
      name: title,
      nicheId: 'preview',
      nicheName: 'Biosite',
      description: '',
      coverImage: '',
      version: 1,
      status: 'published',
      htmlContent: html,
      fields: [],
      authorId: '',
      createdAt: '',
      updatedAt: '',
    };
    setPreviewTemplate(tempTemplate);
  };

  // 1. Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/40 p-2 flex items-center justify-center animate-pulse">
            <span className="font-display font-extrabold text-purple-400 text-lg">BF</span>
          </div>
          <p className="text-xs font-mono text-purple-300">Carregando BIO FÁCIL...</p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated User: MUST see Login / Signup screen as the first screen!
  // Removed public home page before login.
  if (!currentUser) {
    return <AuthScreen />;
  }

  // 3. User is logged in, but not approved (pending / blocked / rejected) and not admin:
  if (!isApproved && !isAdmin) {
    return (
      <div className="min-h-screen bg-[#050508] text-white flex flex-col">
        <Navbar
          currentTab={currentTab}
          onSelectTab={() => {}}
          onOpenAuth={() => {}}
        />
        <AccessStatusNotice />
      </div>
    );
  }

  // 4. Active Editor Mode
  if (customizingTemplate) {
    return (
      <div className="h-screen w-screen bg-[#050508] text-white flex flex-col overflow-hidden">
        <BiositeEditor
          template={customizingTemplate}
          existingProject={editingProject?.project}
          onBack={() => {
            setCustomizingTemplate(null);
            setEditingProject(null);
          }}
          onSavedSuccess={() => {}}
        />
      </div>
    );
  }

  // 5. Authenticated & Approved User (or Admin) Interface
  return (
    <div className="min-h-screen bg-[#050508] text-white flex flex-col selection:bg-purple-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setSelectedNiche(null);
          setCurrentTab(tab);
        }}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Main Content Areas */}
      <main className="flex-1">
        
        {/* TAB 1: CATALOG & NICHES */}
        {currentTab === 'catalog' && (
          <>
            {selectedNiche ? (
              <NicheTemplatesView
                niche={selectedNiche}
                templates={templates}
                onBack={() => setSelectedNiche(null)}
                onPreviewTemplate={(t) => setPreviewTemplate(t)}
                onCustomizeTemplate={handleStartCustomizing}
              />
            ) : (
              <NichesGrid
                niches={niches}
                templates={templates}
                onSelectNiche={(niche) => setSelectedNiche(niche)}
                onOpenMyProjects={() => setCurrentTab('my-projects')}
              />
            )}
          </>
        )}

        {/* TAB 2: MY PROJECTS */}
        {currentTab === 'my-projects' && (
          <MyProjectsList
            onEditProject={handleEditSavedProject}
            onNewProject={() => {
              setCurrentTab('catalog');
              setSelectedNiche(null);
            }}
            onPreviewProject={handlePreviewCustomProject}
          />
        )}

        {/* TAB 3: ADMIN STUDIO */}
        {currentTab === 'admin' && isAdmin && (
          <AdminDashboard />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-purple-500/15 bg-[#090812] py-5 px-4 text-center text-xs text-gray-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#4c1d95] to-[#a855f7] p-[1px] flex items-center justify-center">
              <div className="w-full h-full rounded-[7px] bg-[#120824] flex items-center justify-center">
                <span className="font-display font-black text-[10px] text-purple-200">BF</span>
              </div>
            </div>
            <span className="font-display font-black text-white text-sm tracking-tight">
              BIO{' '}
              <span className="bg-gradient-to-r from-[#d8b4fe] via-[#c084fc] to-[#a855f7] bg-clip-text text-transparent drop-shadow-[0_1px_6px_rgba(168,85,247,0.4)]">
                FÁCIL
              </span>
            </span>
            <span className="text-[11px] text-purple-300/80">· CRIE. PERSONALIZE. PUBLIQUE.</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span>Preservação de Design Original</span>
            <span>·</span>
            <span>Exportação ZIP Standalone</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <BiositeViewerModal
        template={previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        onCustomize={handleStartCustomizing}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary fallbackTitle="Falha na inicialização do BIO FÁCIL">
      <AuthProvider>
        <DataProvider>
          <ErrorBoundary fallbackTitle="Instabilidade na interface do BIO FÁCIL">
            <MainAppContent />
          </ErrorBoundary>
        </DataProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
