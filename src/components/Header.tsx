import React, { useState } from 'react';
import { ActiveView, GitHubConfig } from '../types';

interface HeaderProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  onOpenTerminal: () => void;
  onOpenContact: () => void;
  onOpenAddProject: () => void;
  onOpenGitHubSettings: () => void;
  gitHubConfig?: GitHubConfig;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  onOpenTerminal,
  onOpenContact,
  onOpenAddProject,
  onOpenGitHubSettings,
  gitHubConfig,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view: ActiveView) => {
    setActiveView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="bg-[#f9f9f7] sticky top-0 w-full z-50 transition-colors duration-300 border-b border-[#c4c5d9]/40 backdrop-blur-md bg-[#f9f9f7]/95">
      <div className="flex justify-between items-center px-4 sm:px-8 md:px-12 lg:px-16 py-3 sm:py-4 w-full max-w-[1440px] mx-auto">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center space-x-2 text-left group cursor-pointer focus:outline-none py-1"
        >
          <span className="material-symbols-outlined text-[#0040e0] text-xl group-hover:rotate-12 transition-transform">
            psychology
          </span>
          <span className="font-['Inter'] font-bold text-lg sm:text-xl tracking-tight text-[#1a1c1b] group-hover:text-[#0040e0] transition-colors">
            YASHI CHAUHAN
          </span>
          <span className="hidden lg:inline-block font-mono text-[10px] uppercase tracking-widest text-[#747688] bg-[#e8e8e6] px-2 py-0.5 ml-2 font-medium">
            AI/ML.ENG
          </span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-7 font-mono text-xs uppercase tracking-widest text-[#5e5e5e]">
          <button
            onClick={() => handleNavClick('home')}
            className={`transition-colors hover:text-[#0040e0] cursor-pointer py-1 ${
              activeView === 'home' ? 'text-[#0040e0] font-semibold border-b-2 border-[#0040e0]' : ''
            }`}
          >
            01 Overview
          </button>
          <button
            onClick={() => handleNavClick('case-study')}
            className={`transition-colors hover:text-[#0040e0] cursor-pointer py-1 ${
              activeView === 'case-study' ? 'text-[#0040e0] font-semibold border-b-2 border-[#0040e0]' : ''
            }`}
          >
            02 Case Studies
          </button>
          <button
            onClick={() => handleNavClick('about-experience')}
            className={`transition-colors hover:text-[#0040e0] cursor-pointer py-1 ${
              activeView === 'about-experience' ? 'text-[#0040e0] font-semibold border-b-2 border-[#0040e0]' : ''
            }`}
          >
            03 Experience
          </button>
          <button
            onClick={() => {
              onOpenContact();
              setMobileMenuOpen(false);
            }}
            className="transition-colors hover:text-[#0040e0] cursor-pointer py-1"
          >
            04 Contact
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center space-x-1.5 sm:space-x-2.5">
          {/* GitHub Auth & Sync Status Button */}
          <button
            onClick={onOpenGitHubSettings}
            title={
              gitHubConfig?.isConnected
                ? `Logged in as @${gitHubConfig.user?.login || gitHubConfig.username} (Admin Privileges Active)`
                : 'Login with GitHub to unlock Add, Edit & Delete capabilities'
            }
            className={`flex items-center space-x-1.5 font-mono text-xs px-2.5 sm:px-3 py-1.5 transition-colors cursor-pointer border min-h-[38px] ${
              gitHubConfig?.isConnected
                ? 'bg-[#e8e8e6] hover:bg-[#c4c5d9] border-emerald-500/50 text-[#1a1c1b]'
                : 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-900'
            }`}
          >
            {gitHubConfig?.isConnected ? (
              <>
                <img
                  src={gitHubConfig.user?.avatar_url || `https://github.com/${gitHubConfig.username}.png`}
                  alt={gitHubConfig.username}
                  className="w-4 h-4 rounded-full border border-emerald-600"
                />
                <span className="hidden sm:inline font-bold">
                  @{gitHubConfig.user?.login || gitHubConfig.username}
                </span>
                <span className="hidden lg:inline bg-emerald-100 text-emerald-800 text-[9px] px-1.5 py-0.2 font-bold uppercase tracking-wider">
                  Admin
                </span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[15px] text-amber-700">lock</span>
                <span className="font-bold">Login with GitHub</span>
              </>
            )}
          </button>

          {/* Add Project Action Button */}
          <button
            onClick={onOpenAddProject}
            title={
              gitHubConfig?.isConnected
                ? 'Add a new project to portfolio & sync to GitHub'
                : 'GitHub Login required to add projects'
            }
            className={`flex items-center space-x-1.5 font-mono text-xs uppercase tracking-wider text-white px-2.5 sm:px-3 py-1.5 transition-colors cursor-pointer min-h-[38px] ${
              gitHubConfig?.isConnected
                ? 'bg-[#0040e0] hover:bg-[#001356]'
                : 'bg-[#121212] hover:bg-[#0040e0]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {gitHubConfig?.isConnected ? 'add' : 'add'}
            </span>
            <span className="hidden sm:inline">Add Project</span>
            {!gitHubConfig?.isConnected && (
              <span className="material-symbols-outlined text-[13px] text-amber-300 opacity-90">
                lock
              </span>
            )}
          </button>

          {/* Quick CLI Trigger */}
          <button
            onClick={onOpenTerminal}
            title="Open Interactive System Terminal (Ctrl + K)"
            className="hidden lg:flex items-center space-x-1.5 font-mono text-xs text-[#1a1c1b] bg-[#e8e8e6] hover:bg-[#121212] hover:text-white px-2.5 py-1.5 transition-colors cursor-pointer border border-[#c4c5d9]/60 min-h-[38px]"
          >
            <span className="material-symbols-outlined text-[15px]">terminal</span>
            <span>CLI</span>
            <kbd className="text-[9px] opacity-60 bg-black/10 px-1 rounded-xs">⌘K</kbd>
          </button>

          {/* Contact Direct Button */}
          <button
            onClick={onOpenContact}
            className="hidden xl:inline-flex bg-[#121212] hover:bg-[#0040e0] text-white font-mono text-xs uppercase tracking-widest px-3.5 py-1.5 text-center transition-colors duration-300 min-h-[38px] items-center"
          >
            Get In Touch
          </button>

          {/* Mobile Menu Trigger with touch target */}
          <button
            aria-label="Open Menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#1a1c1b] p-2 hover:text-[#0040e0] transition-colors focus:outline-none cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#f9f9f7] border-b border-[#c4c5d9] px-6 py-6 transition-all animate-fadeIn">
          <div className="flex flex-col space-y-4 font-mono text-sm uppercase tracking-wider text-[#1a1c1b]">
            <button
              onClick={() => handleNavClick('home')}
              className={`text-left py-2 border-b border-[#c4c5d9]/30 flex justify-between items-center ${
                activeView === 'home' ? 'text-[#0040e0] font-bold' : ''
              }`}
            >
              <span>01 / Overview</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
            <button
              onClick={() => handleNavClick('case-study')}
              className={`text-left py-2 border-b border-[#c4c5d9]/30 flex justify-between items-center ${
                activeView === 'case-study' ? 'text-[#0040e0] font-bold' : ''
              }`}
            >
              <span>02 / Case Studies</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
            <button
              onClick={() => handleNavClick('about-experience')}
              className={`text-left py-2 border-b border-[#c4c5d9]/30 flex justify-between items-center ${
                activeView === 'about-experience' ? 'text-[#0040e0] font-bold' : ''
              }`}
            >
              <span>03 / Experience & Arsenal</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
            <button
              onClick={() => {
                onOpenContact();
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 border-b border-[#c4c5d9]/30 flex justify-between items-center text-[#0040e0] font-bold"
            >
              <span>04 / Contact & Availability</span>
              <span className="material-symbols-outlined text-sm">mail</span>
            </button>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  onOpenAddProject();
                  setMobileMenuOpen(false);
                }}
                className={`text-white py-3 px-4 flex items-center justify-center space-x-2 text-xs uppercase tracking-widest ${
                  gitHubConfig?.isConnected ? 'bg-[#0040e0]' : 'bg-[#121212]'
                }`}
              >
                <span className="material-symbols-outlined text-sm">
                  {gitHubConfig?.isConnected ? 'add' : 'lock'}
                </span>
                <span>
                  {gitHubConfig?.isConnected ? '+ Add New Project' : '+ Add New Project (Requires Login)'}
                </span>
              </button>
              <button
                onClick={() => {
                  onOpenGitHubSettings();
                  setMobileMenuOpen(false);
                }}
                className={`py-2.5 px-4 flex items-center justify-center space-x-2 text-xs uppercase tracking-widest border ${
                  gitHubConfig?.isConnected
                    ? 'bg-[#e8e8e6] text-[#1a1c1b] border-emerald-500/40'
                    : 'bg-amber-50 text-amber-900 border-amber-300'
                }`}
              >
                <span className="material-symbols-outlined text-sm">
                  {gitHubConfig?.isConnected ? 'account_circle' : 'lock'}
                </span>
                <span>
                  {gitHubConfig?.isConnected
                    ? `@${gitHubConfig.user?.login || gitHubConfig.username} (Admin Settings)`
                    : 'Login with GitHub'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

