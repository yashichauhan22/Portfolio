import React, { useState, useEffect } from 'react';
import { ActiveView, Project, GitHubConfig } from './types';
import { getStoredProjects, saveProjectsToStorage, resetProjectsToDefault } from './services/projectStorage';
import { getStoredGitHubConfig } from './services/githubService';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { FeaturedProjects } from './components/FeaturedProjects';
import { CaseStudyDetail } from './components/CaseStudyDetail';
import { AboutExperience } from './components/AboutExperience';
import { Footer } from './components/Footer';
import { InteractiveTerminal } from './components/InteractiveTerminal';
import { ContactModal } from './components/ContactModal';
import { ProjectManagerModal } from './components/ProjectManagerModal';
import { DeleteConfirmationModal } from './components/DeleteConfirmationModal';
import { GitHubSettingsModal } from './components/GitHubSettingsModal';

export default function App() {
  const [projects, setProjects] = useState<Project[]>(() => getStoredProjects());
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [selectedProject, setSelectedProject] = useState<Project>(() => {
    const list = getStoredProjects();
    return list[0];
  });

  // Modal and drawer visibility states
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isProjectManagerOpen, setIsProjectManagerOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isGitHubSettingsOpen, setIsGitHubSettingsOpen] = useState(false);
  const [ghConfig, setGhConfig] = useState<GitHubConfig>(() => getStoredGitHubConfig());

  // Toast notification feedback
  const [toastMessage, setToastMessage] = useState<{
    title: string;
    description: string;
    type: 'success' | 'info' | 'error';
  } | null>(null);

  const showToast = (title: string, description: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ title, description, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Keep selectedProject in sync when projects change
  useEffect(() => {
    if (selectedProject) {
      const found = projects.find((p) => p.id === selectedProject.id);
      if (found) {
        setSelectedProject(found);
      } else if (projects.length > 0) {
        setSelectedProject(projects[0]);
      }
    }
  }, [projects]);

  // Global keybindings (Ctrl+K / Cmd+K for Terminal)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsTerminalOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsTerminalOpen(false);
        setIsContactOpen(false);
        setIsProjectManagerOpen(false);
        setIsDeleteModalOpen(false);
        setIsGitHubSettingsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    setActiveView('case-study');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Trigger Add Project
  const handleOpenAddProject = () => {
    setProjectToEdit(null);
    setIsProjectManagerOpen(true);
  };

  // Trigger Edit Project
  const handleOpenEditProject = (project: Project) => {
    setProjectToEdit(project);
    setIsProjectManagerOpen(true);
  };

  // Trigger Delete Project Prompt
  const handleOpenDeleteProject = (project: Project) => {
    setProjectToDelete(project);
    setIsDeleteModalOpen(true);
  };

  // Confirm Delete Action (Ensuring only local portfolio deletion, keeping GitHub 100% untouched)
  const handleConfirmDelete = (projectId: string) => {
    const updated = projects.filter((p) => p.id !== projectId);
    setProjects(updated);
    saveProjectsToStorage(updated);
    setIsDeleteModalOpen(false);
    setProjectToDelete(null);

    // If currently looking at deleted project, switch view or project
    if (selectedProject?.id === projectId) {
      if (updated.length > 0) {
        setSelectedProject(updated[0]);
      } else {
        setActiveView('home');
      }
    }

    showToast(
      'Project Removed from Portfolio',
      'The case study has been removed from this portfolio. Your GitHub repository and account remain 100% intact and unaffected.',
      'info'
    );
  };

  // Save Project (Add or Update)
  const handleSaveProject = (savedProject: Project, syncMessage?: string) => {
    const exists = projects.some((p) => p.id === savedProject.id);
    let updated: Project[];
    if (exists) {
      updated = projects.map((p) => (p.id === savedProject.id ? savedProject : p));
    } else {
      updated = [savedProject, ...projects];
    }

    setProjects(updated);
    saveProjectsToStorage(updated);
    setSelectedProject(savedProject);

    if (syncMessage) {
      showToast(
        exists ? 'Project Updated & Synced' : 'Project Created & Synced',
        syncMessage,
        'success'
      );
    } else {
      showToast(
        exists ? 'Project Updated' : 'New Project Added',
        `"${savedProject.title}" has been saved to your portfolio.`,
        'success'
      );
    }
  };

  return (
    <div className="bg-[#f9f9f7] text-[#1a1c1b] antialiased flex flex-col min-h-screen font-['Inter'] selection:bg-[#0040e0] selection:text-white relative">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-[#121212] text-white p-4 border-l-4 border-[#0040e0] shadow-2xl animate-fadeIn flex items-start space-x-3 font-['Inter']">
          <span className="material-symbols-outlined text-[#0040e0] text-xl mt-0.5">
            {toastMessage.type === 'success' ? 'check_circle' : 'info'}
          </span>
          <div className="flex-1">
            <div className="font-bold text-xs uppercase tracking-wider font-mono text-[#b8c3ff]">
              {toastMessage.title}
            </div>
            <p className="text-xs text-[#c4c5d9] mt-0.5 leading-relaxed">
              {toastMessage.description}
            </p>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-[#747688] hover:text-white transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {/* Top Navigation Bar */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenTerminal={() => setIsTerminalOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenAddProject={handleOpenAddProject}
        onOpenGitHubSettings={() => setIsGitHubSettingsOpen(true)}
        gitHubConfig={ghConfig}
      />

      {/* Main Content Area */}
      <main className="flex-grow px-6 md:px-16 py-10 md:py-16 w-full max-w-[1440px] mx-auto">
        {/* Screen 1: Home / Overview View */}
        {activeView === 'home' && (
          <div className="space-y-20 md:space-y-32">
            <HeroSection
              onViewProjects={() => {
                const elem = document.getElementById('projects');
                if (elem) {
                  elem.scrollIntoView({ behavior: 'smooth' });
                } else {
                  setActiveView('case-study');
                }
              }}
              onGetInTouch={() => setIsContactOpen(true)}
            />

            {/* Subtle Divider */}
            <div className="w-full h-px bg-[#c4c5d9]/40 my-16 md:my-24"></div>

            <FeaturedProjects
              projects={projects}
              onSelectProject={handleSelectProject}
              onAddProject={handleOpenAddProject}
              onEditProject={handleOpenEditProject}
              onDeleteProject={handleOpenDeleteProject}
            />
          </div>
        )}

        {/* Screen 2: Case Study Detail View */}
        {activeView === 'case-study' && selectedProject && (
          <CaseStudyDetail
            currentProject={selectedProject}
            projects={projects}
            onSelectProject={(proj) => {
              setSelectedProject(proj);
            }}
            onBackToHome={() => {
              setActiveView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenContact={() => setIsContactOpen(true)}
            onEditProject={handleOpenEditProject}
            onDeleteProject={handleOpenDeleteProject}
            onAddProject={handleOpenAddProject}
          />
        )}

        {/* Screen 3: About & Experience View */}
        {activeView === 'about-experience' && (
          <AboutExperience onOpenContact={() => setIsContactOpen(true)} />
        )}
      </main>

      {/* Footer */}
      <Footer onOpenContact={() => setIsContactOpen(true)} />

      {/* Project Creator & Editor Modal with Live GitHub Synchronization */}
      <ProjectManagerModal
        isOpen={isProjectManagerOpen}
        onClose={() => setIsProjectManagerOpen(false)}
        projectToEdit={projectToEdit}
        onSaveProject={handleSaveProject}
        existingProjectsCount={projects.length}
        allProjects={projects}
      />

      {/* Safe Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        project={projectToDelete}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setProjectToDelete(null);
        }}
        onConfirmDelete={handleConfirmDelete}
      />

      {/* GitHub Real-Time Sync Configuration Modal */}
      <GitHubSettingsModal
        isOpen={isGitHubSettingsOpen}
        onClose={() => setIsGitHubSettingsOpen(false)}
        onConfigUpdated={(cfg) => {
          setGhConfig(cfg);
          showToast('GitHub Configuration Updated', 'Your settings and sync preferences have been saved.');
        }}
      />

      {/* Interactive System Terminal Console */}
      <InteractiveTerminal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        onSelectProject={handleSelectProject}
        onOpenContact={() => setIsContactOpen(true)}
        projects={projects}
        onAddProject={handleOpenAddProject}
        onOpenGitHubSettings={() => setIsGitHubSettingsOpen(true)}
      />

      {/* Contact Drawer / Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  );
}
