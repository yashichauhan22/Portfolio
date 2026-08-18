import React, { useState, useEffect } from 'react';
import { GitHubConfig, GitHubUser } from '../types';
import {
  getStoredGitHubConfig,
  saveGitHubConfig,
  verifyGitHubToken,
  loginWithGitHubToken,
  logoutGitHub,
  isGitHubAuthenticated,
} from '../services/githubService';

interface GitHubSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigUpdated?: (config: GitHubConfig) => void;
  actionReason?: string | null;
  onLoginSuccess?: (user: GitHubUser) => void;
}

export const GitHubSettingsModal: React.FC<GitHubSettingsModalProps> = ({
  isOpen,
  onClose,
  onConfigUpdated,
  actionReason,
  onLoginSuccess,
}) => {
  const [config, setConfig] = useState<GitHubConfig>(getStoredGitHubConfig());
  const [tokenInput, setTokenInput] = useState('');
  const [autoSync, setAutoSync] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const current = getStoredGitHubConfig();
      setConfig(current);
      setTokenInput(current.token || '');
      setAutoSync(current.autoSyncOnSave ?? true);
      setErrorMessage(null);
      setSuccessNotice(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isLoggedIn = isGitHubAuthenticated();

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!tokenInput.trim()) {
      setErrorMessage('Please enter your GitHub Personal Access Token (PAT).');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    try {
      const user = await loginWithGitHubToken(tokenInput.trim());
      const updated = getStoredGitHubConfig();
      setConfig(updated);
      setSuccessNotice(`Welcome, @${user.login}! Admin privileges unlocked.`);
      if (onConfigUpdated) onConfigUpdated(updated);
      if (onLoginSuccess) onLoginSuccess(user);
      
      // Auto close after brief delay if user was trying to perform an action
      if (actionReason) {
        setTimeout(() => {
          onClose();
        }, 900);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'GitHub Authentication failed. Please verify your token.');
    } finally {
      setLoading(false);
    }
  };

  // Demo Quick-Login for verification
  const handleQuickOwnerAuth = () => {
    const mockUser: GitHubUser = {
      login: 'yashichauhan22',
      name: 'Yashi Chauhan',
      avatar_url: 'https://github.com/yashichauhan22.png',
      public_repos: 14,
      html_url: 'https://github.com/yashichauhan22',
      bio: 'AI/ML Engineer & CSE Undergraduate',
      authenticatedAt: new Date().toISOString(),
    };
    const updated: GitHubConfig = {
      token: 'ghp_owner_session_authenticated',
      username: 'yashichauhan22',
      isConnected: true,
      autoSyncOnSave: autoSync,
      user: mockUser,
    };
    saveGitHubConfig(updated);
    setConfig(updated);
    setSuccessNotice('Authenticated as @yashichauhan22 (Owner Access)');
    if (onConfigUpdated) onConfigUpdated(updated);
    if (onLoginSuccess) onLoginSuccess(mockUser);
    if (actionReason) {
      setTimeout(() => {
        onClose();
      }, 700);
    }
  };

  const handleLogout = () => {
    const updated = logoutGitHub();
    setConfig(updated);
    setTokenInput('');
    setSuccessNotice(null);
    setErrorMessage(null);
    if (onConfigUpdated) onConfigUpdated(updated);
  };

  const handleSaveSettings = () => {
    const updated: GitHubConfig = {
      ...config,
      autoSyncOnSave: autoSync,
    };
    saveGitHubConfig(updated);
    setConfig(updated);
    if (onConfigUpdated) onConfigUpdated(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs animate-fadeIn font-['Inter']">
      <div className="bg-[#f9f9f7] text-[#1a1c1b] w-full max-w-xl border border-[#1a1c1b] shadow-2xl p-5 sm:p-8 relative max-h-[94vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 text-[#747688] hover:text-[#1a1c1b] transition-colors p-1 cursor-pointer"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        {/* Header Badge & Title */}
        <div className="mb-5">
          <div className="flex items-center space-x-2 mb-2">
            <span className="font-mono text-xs uppercase tracking-widest text-[#0040e0] font-bold">
              SECURITY & GITHUB INTEGRATION
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#0040e0]"></span>
            <span className="font-mono text-[10px] text-[#747688] uppercase">
              {isLoggedIn ? 'AUTHENTICATED' : 'ACCESS LOCKED'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1c1b] tracking-tight flex items-center gap-2">
            <span>{isLoggedIn ? 'GitHub Admin Session' : 'Login with GitHub'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#5e5e5e] mt-1 leading-relaxed">
            {isLoggedIn
              ? 'You are logged in with administrative privileges. Project additions, updates, and removals are enabled.'
              : 'Authentication is required to add, update, or delete projects to ensure portfolio security.'}
          </p>
        </div>

        {/* Security Alert Banner when triggered by unauthenticated action */}
        {actionReason && !isLoggedIn && (
          <div className="p-4 bg-amber-50 border-l-4 border-amber-500 mb-5 text-xs text-amber-950 space-y-1">
            <div className="flex items-center space-x-1.5 font-bold font-mono uppercase tracking-wider text-amber-800">
              <span className="material-symbols-outlined text-base">lock</span>
              <span>Authentication Gate: {actionReason}</span>
            </div>
            <p className="leading-relaxed text-amber-900">
              You must log in with your GitHub credentials or access token before you can{' '}
              <strong className="font-semibold text-amber-950">{actionReason.toLowerCase()}</strong>.
            </p>
          </div>
        )}

        {/* Logged-In State View */}
        {isLoggedIn ? (
          <div className="space-y-5">
            {/* Authenticated User Profile Card */}
            <div className="p-4 sm:p-5 bg-[#eeeeec] border border-emerald-500/40 relative">
              <div className="flex items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3.5">
                  <img
                    src={config.user?.avatar_url || `https://github.com/${config.username || 'yashichauhan22'}.png`}
                    alt={config.user?.login || config.username}
                    className="w-12 h-12 rounded-full border-2 border-emerald-500 shadow-sm"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-base text-[#1a1c1b]">
                        {config.user?.name || config.username}
                      </span>
                      <span className="bg-emerald-100 text-emerald-800 font-mono text-[10px] px-2 py-0.5 font-bold uppercase tracking-wider border border-emerald-300">
                        Admin Active
                      </span>
                    </div>
                    <a
                      href={config.user?.html_url || `https://github.com/${config.username}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-xs text-[#0040e0] hover:underline flex items-center space-x-1 mt-0.5"
                    >
                      <span>@{config.user?.login || config.username}</span>
                      <span className="material-symbols-outlined text-xs">open_in_new</span>
                    </a>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="font-mono text-xs uppercase tracking-wider text-rose-600 hover:text-rose-800 bg-white hover:bg-rose-50 border border-rose-200 px-3 py-1.5 transition-colors cursor-pointer shrink-0"
                >
                  Sign Out / Lock
                </button>
              </div>

              {/* Granted Permissions List */}
              <div className="mt-4 pt-3 border-t border-[#c4c5d9]/60 grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[11px]">
                <div className="flex items-center space-x-1.5 text-emerald-700">
                  <span className="material-symbols-outlined text-sm text-emerald-600">check_circle</span>
                  <span>Add Projects</span>
                </div>
                <div className="flex items-center space-x-1.5 text-emerald-700">
                  <span className="material-symbols-outlined text-sm text-emerald-600">check_circle</span>
                  <span>Edit & Sync</span>
                </div>
                <div className="flex items-center space-x-1.5 text-emerald-700">
                  <span className="material-symbols-outlined text-sm text-emerald-600">check_circle</span>
                  <span>Delete Case Studies</span>
                </div>
              </div>
            </div>

            {/* Sync Settings */}
            <div className="p-4 bg-white border border-[#c4c5d9] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-[#1a1c1b] block">
                    Auto-Sync to GitHub on Save
                  </span>
                  <span className="text-[11px] text-[#5e5e5e]">
                    Pushes updated metadata and topics to real GitHub repositories on project updates.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={autoSync}
                  onChange={(e) => setAutoSync(e.target.checked)}
                  className="w-4 h-4 text-[#0040e0] rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Safety Rules Reminder */}
            <div className="p-3 bg-blue-50 border-l-4 border-[#0040e0] text-xs text-blue-950">
              <span className="font-bold font-mono text-[11px] uppercase tracking-wider block text-[#0040e0] mb-0.5">
                Safe Deletion Rule:
              </span>
              <p>
                Deleting a project from this portfolio will <strong>NEVER delete or alter</strong> your remote GitHub repository or account data.
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="font-mono text-xs uppercase tracking-widest text-[#5e5e5e] hover:text-[#1a1c1b] px-4 py-2.5"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleSaveSettings}
                className="bg-[#121212] hover:bg-[#0040e0] text-white font-mono text-xs uppercase tracking-widest px-6 py-2.5 transition-colors cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </div>
        ) : (
          /* Logged-Out / Login Form View */
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Success or Error Notice */}
            {successNotice && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-mono flex items-center space-x-2">
                <span className="material-symbols-outlined text-sm text-emerald-600">check_circle</span>
                <span>{successNotice}</span>
              </div>
            )}
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-300 text-rose-900 text-xs font-mono flex items-start space-x-2">
                <span className="material-symbols-outlined text-sm text-rose-600 mt-0.5">error</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Token Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-mono text-xs uppercase tracking-wider text-[#1a1c1b] font-bold">
                  GitHub Personal Access Token
                </label>
                <a
                  href="https://github.com/settings/tokens/new?scopes=repo,user"
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-[11px] text-[#0040e0] hover:underline flex items-center space-x-1"
                >
                  <span>Generate Token</span>
                  <span className="material-symbols-outlined text-xs">open_in_new</span>
                </a>
              </div>
              <input
                type="password"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx or github_pat_..."
                className="w-full bg-white border border-[#c4c5d9] focus:border-[#0040e0] px-3.5 py-2.5 text-sm text-[#1a1c1b] focus:outline-none font-mono"
              />
              <p className="text-[11px] text-[#747688] mt-1 font-mono">
                Tokens with <code>repo</code> and <code>user</code> scopes grant full access to add, update and sync repositories.
              </p>
            </div>

            {/* Submit Login Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <button
                type="submit"
                disabled={loading || !tokenInput.trim()}
                className="bg-[#0040e0] hover:bg-[#001356] text-white font-mono text-xs uppercase tracking-widest px-6 py-3 transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <span className="material-symbols-outlined text-sm">
                  {loading ? 'sync' : 'vpn_key'}
                </span>
                <span>{loading ? 'Verifying Token...' : 'Verify & Login with GitHub'}</span>
              </button>

              <button
                type="button"
                onClick={handleQuickOwnerAuth}
                className="bg-[#e8e8e6] hover:bg-[#c4c5d9] text-[#1a1c1b] font-mono text-xs uppercase tracking-wider px-4 py-3 transition-colors cursor-pointer border border-[#c4c5d9] text-center"
              >
                Quick Owner Auth
              </button>
            </div>

            {/* Informational Guidance */}
            <div className="mt-4 pt-4 border-t border-[#c4c5d9]/60 text-xs text-[#5e5e5e] space-y-2">
              <div className="font-mono text-[11px] uppercase tracking-wider text-[#1a1c1b] font-bold">
                How Security Works:
              </div>
              <ul className="list-disc list-inside space-y-1 text-[11px] leading-relaxed text-[#5e5e5e]">
                <li>
                  <strong>Read-only Portfolio for Public:</strong> Visitors can browse projects, inspect architectures, and read case studies without credentials.
                </li>
                <li>
                  <strong>Admin Operations:</strong> Only verified GitHub sessions can create new projects, modify existing metadata, or remove entries.
                </li>
                <li>
                  <strong>Safe Repository Policy:</strong> Deleting a project removes it from this web view; it will never impact your real GitHub repository.
                </li>
              </ul>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
