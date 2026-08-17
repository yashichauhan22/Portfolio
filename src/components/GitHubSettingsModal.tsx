import React, { useState, useEffect } from 'react';
import { GitHubConfig } from '../types';
import {
  getStoredGitHubConfig,
  saveGitHubConfig,
  verifyGitHubToken,
  GitHubUser,
} from '../services/githubService';

interface GitHubSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigUpdated?: (config: GitHubConfig) => void;
}

export const GitHubSettingsModal: React.FC<GitHubSettingsModalProps> = ({
  isOpen,
  onClose,
  onConfigUpdated,
}) => {
  const [config, setConfig] = useState<GitHubConfig>(getStoredGitHubConfig());
  const [tokenInput, setTokenInput] = useState('');
  const [usernameInput, setUsernameInput] = useState('yashichauhan22');
  const [autoSync, setAutoSync] = useState(true);
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    user?: GitHubUser;
    error?: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      const current = getStoredGitHubConfig();
      setConfig(current);
      setTokenInput(current.token || '');
      setUsernameInput(current.username || 'yashichauhan22');
      setAutoSync(current.autoSyncOnSave ?? true);
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setLoading(true);
    setTestResult(null);
    try {
      if (!tokenInput.trim()) {
        throw new Error('Please enter a GitHub Personal Access Token to test authentication.');
      }
      const user = await verifyGitHubToken(tokenInput.trim());
      setTestResult({ success: true, user });
      setUsernameInput(user.login);
    } catch (err: any) {
      setTestResult({ success: false, error: err.message || 'Connection failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    const updated: GitHubConfig = {
      token: tokenInput.trim(),
      username: usernameInput.trim() || 'yashichauhan22',
      isConnected: Boolean(tokenInput.trim() && (testResult?.success || config.isConnected)),
      autoSyncOnSave: autoSync,
    };
    saveGitHubConfig(updated);
    setConfig(updated);
    if (onConfigUpdated) onConfigUpdated(updated);
    onClose();
  };

  const handleClearToken = () => {
    setTokenInput('');
    setTestResult(null);
    const cleared: GitHubConfig = {
      token: '',
      username: 'yashichauhan22',
      isConnected: false,
      autoSyncOnSave: false,
    };
    saveGitHubConfig(cleared);
    setConfig(cleared);
    if (onConfigUpdated) onConfigUpdated(cleared);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn font-['Inter']">
      <div className="bg-[#f9f9f7] text-[#1a1c1b] w-full max-w-xl border border-[#1a1c1b] shadow-2xl p-6 sm:p-8 relative max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-[#747688] hover:text-[#1a1c1b] transition-colors p-1 cursor-pointer"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <span className="font-mono text-xs uppercase tracking-widest text-[#0040e0] font-bold">
              INTEGRATION MODULE
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#0040e0]"></span>
            <span className="font-mono text-[10px] text-[#747688] uppercase">
              REST API V3
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1c1b] tracking-tight">
            GitHub Real-Time Sync
          </h2>
          <p className="text-xs sm:text-sm text-[#5e5e5e] mt-1">
            Connect your GitHub account to automatically synchronize project descriptions, topics, and architecture meta files to your real GitHub repositories when you add or update projects.
          </p>
        </div>

        {/* Connection Safety Note */}
        <div className="p-3.5 bg-blue-50 border-l-4 border-[#0040e0] mb-6 text-xs text-blue-950 space-y-1">
          <span className="font-bold font-mono uppercase tracking-wider block text-[#0040e0]">
            Sync & Deletion Rules:
          </span>
          <p>
            • <strong>Adding / Updating Projects:</strong> Pushes metadata and updates to your live GitHub repository.
          </p>
          <p>
            • <strong>Deleting Projects:</strong> Only removes items from this portfolio website. Deleting a project will <strong>NEVER delete or affect</strong> your GitHub account or remote repositories.
          </p>
        </div>

        <div className="space-y-5">
          {/* GitHub Username */}
          <div>
            <label className="font-mono text-xs uppercase tracking-wider text-[#5e5e5e] block mb-1 font-semibold">
              GitHub Username / Organization
            </label>
            <input
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="e.g. yashichauhan"
              className="w-full bg-[#eeeeec] border border-[#c4c5d9] focus:border-[#0040e0] px-3.5 py-2.5 text-sm text-[#1a1c1b] focus:outline-none font-mono"
            />
          </div>

          {/* Personal Access Token */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-mono text-xs uppercase tracking-wider text-[#5e5e5e] font-semibold">
                GitHub Personal Access Token (PAT)
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
              className="w-full bg-[#eeeeec] border border-[#c4c5d9] focus:border-[#0040e0] px-3.5 py-2.5 text-sm text-[#1a1c1b] focus:outline-none font-mono"
            />
            <p className="text-[11px] text-[#747688] mt-1 font-mono">
              Requires <code>repo</code> scope for updating repository descriptions and topics.
            </p>
          </div>

          {/* Auto-Sync Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-[#eeeeec] border border-[#c4c5d9]">
            <div>
              <span className="font-mono text-xs font-bold text-[#1a1c1b] block">
                Auto-Sync to GitHub on Save
              </span>
              <span className="text-[11px] text-[#5e5e5e]">
                Automatically update GitHub repository description & topics when editing projects.
              </span>
            </div>
            <input
              type="checkbox"
              checked={autoSync}
              onChange={(e) => setAutoSync(e.target.checked)}
              className="w-4 h-4 text-[#0040e0] rounded cursor-pointer"
            />
          </div>

          {/* Test connection result badge */}
          {testResult && (
            <div
              className={`p-4 border text-xs font-mono ${
                testResult.success
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-rose-50 border-rose-300 text-rose-900'
              }`}
            >
              {testResult.success && testResult.user ? (
                <div className="flex items-center space-x-3">
                  <img
                    src={testResult.user.avatar_url}
                    alt={testResult.user.login}
                    className="w-10 h-10 rounded-full border border-emerald-400"
                  />
                  <div>
                    <div className="font-bold flex items-center space-x-1.5">
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      <span>Connected as @{testResult.user.login}</span>
                    </div>
                    <div className="text-[11px] text-emerald-800 mt-0.5">
                      {testResult.user.public_repos} Public Repositories • Authentication Verified
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-start space-x-2">
                  <span className="material-symbols-outlined text-sm text-rose-600 mt-0.5">error</span>
                  <div>
                    <span className="font-bold">Authentication Failed:</span>
                    <p className="mt-0.5">{testResult.error}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#c4c5d9]/60">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                disabled={loading || !tokenInput.trim()}
                onClick={handleTestConnection}
                className="font-mono text-xs uppercase tracking-widest px-4 py-2.5 bg-white border border-[#1a1c1b] hover:bg-[#e8e8e6] transition-colors disabled:opacity-50 cursor-pointer flex items-center space-x-1"
              >
                <span className="material-symbols-outlined text-xs">
                  {loading ? 'sync' : 'network_check'}
                </span>
                <span>{loading ? 'Testing...' : 'Test Connection'}</span>
              </button>
              {tokenInput && (
                <button
                  type="button"
                  onClick={handleClearToken}
                  className="font-mono text-xs uppercase tracking-widest text-[#747688] hover:text-rose-600 px-2 py-2 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="font-mono text-xs uppercase tracking-widest text-[#5e5e5e] hover:text-[#1a1c1b]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="bg-[#121212] hover:bg-[#0040e0] text-white font-mono text-xs uppercase tracking-widest px-6 py-2.5 transition-colors cursor-pointer"
              >
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
