import React, { useState, useEffect } from 'react';
import { Project, GitHubConfig } from '../types';
import {
  getStoredGitHubConfig,
  fetchGitHubRepo,
  parseGitHubRepo,
  updateGitHubRepoMetadata,
  syncProjectMetaFileToGitHub,
  createGitHubRepo,
} from '../services/githubService';
import { getStoredProjects } from '../services/projectStorage';
import { ProjectContributionsChart } from './ProjectContributionsChart';

interface ProjectManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectToEdit: Project | null;
  onSaveProject: (project: Project, syncMessage?: string) => void;
  existingProjectsCount: number;
  allProjects?: Project[];
}

const DEFAULT_IMAGES = [
  {
    label: 'AI / RAG Architecture',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBgzC4hX_XitbBAa2zyHVrcg_FEZ-2yJihUmW-DBehtxNZ2ont-Cq1QlvWWg2SxlZFuPdfzIE-mT9VnPUx4o-ookEIp2PoZ3-56DNNsyCMZd8igdud1WMK0qBN511KD8kUdQgclg-hkSlgPO5YEbWhuOJXntEHGpdrbw9HMFz2beHZJMNW3FiFfgyTQss30VDhQqtd9bFIxrskUNUB2NSWNSMTZPpltS3KGDFwHo4UWs0DhMU-Xoo7',
  },
  {
    label: 'Vision & Deep Learning',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALRbiTO4YFiuUqtiWf9k03jjc6AS4NbWntNumF70-NVLH00XtTntFxWr-KOPx4gOQbXcBW9DmqlxFEbDj5vgYIubhuG5gw5I1LgtCCra-z_OZy_fNaEQMP_P2i8BM6UrScla2nhnxFJMXuQu_qD9x4bhy_9ATeoapCmQfMpSrKjPnOQqZuG-Z8r9SN1sAp33KpiYauM5tFA4RDytmD6BgeUWHT3cO6BTDwAOzm5hL3K1yU59dETzR5',
  },
];

export const ProjectManagerModal: React.FC<ProjectManagerModalProps> = ({
  isOpen,
  onClose,
  projectToEdit,
  onSaveProject,
  existingProjectsCount,
  allProjects,
}) => {
  const [activeTab, setActiveTab] = useState<'basics' | 'stack' | 'challenge' | 'github' | 'code' | 'activity'>('basics');
  const [ghConfig] = useState<GitHubConfig>(getStoredGitHubConfig());
  const projectsList = allProjects && allProjects.length > 0 ? allProjects : getStoredProjects();

  // Form states
  const [title, setTitle] = useState('');
  const [number, setNumber] = useState('01');
  const [tagline, setTagline] = useState('');
  const [role, setRole] = useState('AI / ML Engineer');
  const [timeline, setTimeline] = useState('2024 — 2025');
  const [imageUrl, setImageUrl] = useState(DEFAULT_IMAGES[0].url);
  const [imageAlt, setImageAlt] = useState('');
  const [description, setDescription] = useState('');
  
  // Tech stack & tags
  const [techStackInput, setTechStackInput] = useState('');
  const [techStack, setTechStack] = useState<string[]>([]);
  const [detailedStack, setDetailedStack] = useState<{ number: string; name: string; detail: string }[]>([
    { number: '01', name: 'Core ML Architecture', detail: 'Model training and inference pipeline' },
    { number: '02', name: 'FastAPI Backend', detail: 'Service APIs and structured schema validation' },
    { number: '03', name: 'Vector / Data Store', detail: 'Embeddings storage and dense vector indexing' },
    { number: '04', name: 'Deployment & Monitoring', detail: 'Production scaling and telemetry metrics' },
  ]);

  // Metrics
  const [metrics, setMetrics] = useState<{ label: string; value: string; change: string }[]>([
    { label: 'Latency / Speed', value: '< 200 ms', change: 'Optimized pipeline' },
    { label: 'Accuracy / Score', value: '98.5%', change: 'Cross-validated' },
    { label: 'Throughput', value: '1.2k req/s', change: 'Sub-second inference' },
    { label: 'Data Efficiency', value: '100% On-Prem', change: 'Zero data leakage' },
  ]);

  // Deep dive
  const [challenge, setChallenge] = useState('');
  const [outcome, setOutcome] = useState('');

  // GitHub integration states
  const [githubRepo, setGithubRepo] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [syncToGithub, setSyncToGithub] = useState(true);
  const [githubToken, setGithubToken] = useState(ghConfig.token || '');
  const [isFetchingGithub, setIsFetchingGithub] = useState(false);
  const [githubSyncStatus, setGithubSyncStatus] = useState<string | null>(null);
  const [createRepoName, setCreateRepoName] = useState('');
  const [isCreatingRepo, setIsCreatingRepo] = useState(false);

  // Code snippet & Architecture
  const [codeFilename, setCodeFilename] = useState('main.py');
  const [codeLanguage, setCodeLanguage] = useState('python');
  const [codeContent, setCodeContent] = useState(`import torch
import fastapi

app = fastapi.FastAPI(title="Production AI Engine")

@app.post("/predict")
async def predict(data: dict):
    # Process inputs through fine-tuned pipeline
    return {"status": "success", "confidence": 0.99}`);

  useEffect(() => {
    if (projectToEdit) {
      setTitle(projectToEdit.title);
      setNumber(projectToEdit.number);
      setTagline(projectToEdit.tagline);
      setRole(projectToEdit.role);
      setTimeline(projectToEdit.timeline);
      setImageUrl(projectToEdit.image);
      setImageAlt(projectToEdit.imageAlt || projectToEdit.title);
      setDescription(projectToEdit.description);
      setTechStack(projectToEdit.techStack || []);
      setTechStackInput(projectToEdit.techStack.join(', '));
      setDetailedStack(
        projectToEdit.techStackDetailed?.length
          ? projectToEdit.techStackDetailed
          : [
              { number: '01', name: 'Core Engine', detail: 'Architecture' },
              { number: '02', name: 'Backend API', detail: 'REST endpoint' },
              { number: '03', name: 'Storage', detail: 'Data store' },
              { number: '04', name: 'Telemetry', detail: 'Monitoring' },
            ]
      );
      setMetrics(
        projectToEdit.metrics?.length
          ? projectToEdit.metrics
          : [
              { label: 'Latency', value: '< 200 ms', change: 'Optimal' },
              { label: 'Accuracy', value: '98.5%', change: 'Verified' },
              { label: 'Scale', value: '10k+', change: 'High throughput' },
              { label: 'Status', value: '100% Prod', change: 'Operational' },
            ]
      );
      setChallenge(projectToEdit.challenge);
      setOutcome(projectToEdit.outcome);
      setGithubRepo(projectToEdit.githubRepo || projectToEdit.githubUrl?.replace('https://github.com/', '') || '');
      setGithubUrl(projectToEdit.githubUrl || '');
      setSyncToGithub(projectToEdit.githubSyncEnabled ?? true);
      if (projectToEdit.codeSnippet) {
        setCodeFilename(projectToEdit.codeSnippet.filename);
        setCodeLanguage(projectToEdit.codeSnippet.language);
        setCodeContent(projectToEdit.codeSnippet.code);
      }
    } else {
      // New project defaults
      const nextNum = (existingProjectsCount + 1).toString().padStart(2, '0');
      setNumber(nextNum);
      setTitle('');
      setTagline('');
      setRole('AI / ML Engineer');
      setTimeline('2025');
      setImageUrl(DEFAULT_IMAGES[0].url);
      setImageAlt('');
      setDescription('');
      setTechStack(['Python', 'PyTorch', 'FastAPI']);
      setTechStackInput('Python, PyTorch, FastAPI');
      setChallenge('');
      setOutcome('');
      setGithubRepo('');
      setGithubUrl('');
      setSyncToGithub(true);
    }
    setGithubSyncStatus(null);
  }, [projectToEdit, existingProjectsCount, isOpen]);

  if (!isOpen) return null;

  const handleTechStackChange = (val: string) => {
    setTechStackInput(val);
    const parsed = val
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    setTechStack(parsed);
  };

  // Live Auto-fetch from GitHub
  const handleFetchFromGithub = async () => {
    if (!githubRepo.trim()) {
      setGithubSyncStatus('Please specify a GitHub repository name (e.g. yashichauhan/my-repo)');
      return;
    }
    setIsFetchingGithub(true);
    setGithubSyncStatus('Connecting to GitHub API...');
    try {
      const { owner, repo } = parseGitHubRepo(githubRepo, ghConfig.username || 'yashichauhan');
      const repoData = await fetchGitHubRepo(owner, repo, githubToken || ghConfig.token);
      
      // Auto-fill fields from GitHub
      if (!title) setTitle(repoData.name.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()));
      if (repoData.description) {
        setDescription(repoData.description);
        if (!tagline) setTagline(repoData.description);
      }
      setGithubUrl(repoData.html_url);
      setGithubRepo(`${owner}/${repo}`);

      if (repoData.topics && repoData.topics.length > 0) {
        const combined = Array.from(new Set([...techStack, ...repoData.topics]));
        setTechStack(combined);
        setTechStackInput(combined.join(', '));
      } else if (repoData.language && !techStack.includes(repoData.language)) {
        const combined = [...techStack, repoData.language];
        setTechStack(combined);
        setTechStackInput(combined.join(', '));
      }

      setGithubSyncStatus(
        `✓ Synced from GitHub (${repoData.stargazers_count} ★, ${repoData.forks_count} forks, ${repoData.language || 'Code'})`
      );
    } catch (err: any) {
      setGithubSyncStatus(`✕ GitHub error: ${err.message}`);
    } finally {
      setIsFetchingGithub(false);
    }
  };

  // Helper to create a new repo on GitHub
  const handleCreateGitHubRepo = async () => {
    if (!createRepoName.trim()) return;
    if (!githubToken && !ghConfig.token) {
      setGithubSyncStatus('Please enter a GitHub Personal Access Token to create repositories.');
      return;
    }
    setIsCreatingRepo(true);
    setGithubSyncStatus('Creating repository on GitHub...');
    try {
      const token = githubToken || ghConfig.token;
      const res = await createGitHubRepo(token, createRepoName, tagline || title || 'AI/ML Project');
      if (res.success && res.repoUrl) {
        setGithubUrl(res.repoUrl);
        setGithubRepo(res.repoUrl.replace('https://github.com/', ''));
        setGithubSyncStatus(`✓ Created GitHub repo: ${res.repoUrl}`);
        setCreateRepoName('');
      } else {
        setGithubSyncStatus(`✕ Error creating repo: ${res.message}`);
      }
    } catch (err: any) {
      setGithubSyncStatus(`✕ Error: ${err.message}`);
    } finally {
      setIsCreatingRepo(false);
    }
  };

  // Submit and save
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const projectId = projectToEdit ? projectToEdit.id : title.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `project-${Date.now()}`;
    const generatedGithubUrl = githubUrl.trim() || (githubRepo ? `https://github.com/${githubRepo.replace(/^https?:\/\/github\.com\//, '')}` : '');

    const projectData: Project = {
      id: projectId,
      number: number.trim() || '01',
      title: title.trim(),
      tagline: tagline.trim() || description.slice(0, 80),
      role: role.trim() || 'AI / ML Engineer',
      timeline: timeline.trim() || '2025',
      image: imageUrl.trim(),
      imageAlt: imageAlt.trim() || title.trim(),
      description: description.trim(),
      techStack: techStack.length > 0 ? techStack : ['Python', 'AI/ML'],
      techStackDetailed: detailedStack,
      challenge: challenge.trim() || 'Complex technical problem statement requiring high-throughput architecture.',
      outcome: outcome.trim() || 'Engineered production-grade solution with measurable performance and low latency.',
      metrics: metrics,
      githubUrl: generatedGithubUrl,
      githubRepo: githubRepo.trim(),
      githubSyncEnabled: syncToGithub,
      demoUrl: '#',
      codeSnippet: {
        filename: codeFilename.trim(),
        language: codeLanguage.trim(),
        code: codeContent.trim(),
      },
      architectureNodes: projectToEdit?.architectureNodes || [
        { id: 'gateway', label: 'FastAPI Ingress Gateway', type: 'gateway', status: 'optimal', tps: '1,200 req/min', latency: '2.1 ms' },
        { id: 'inference', label: 'PyTorch / LLM Engine', type: 'service', status: 'healthy', tps: '180 inf/s', latency: '18.4 ms' },
        { id: 'store', label: 'Vector & Persistent DB', type: 'db', status: 'optimal', tps: '10,000 queries/s', latency: '4.8 ms' },
        { id: 'telemetry', label: 'Metrics & Logging Pipeline', type: 'cache', status: 'healthy', tps: 'Live', latency: '1.2 ms' },
      ],
    };

    let syncMessage = '';

    // If GitHub sync is enabled and token is present, update real GitHub repo
    const token = githubToken.trim() || ghConfig.token;
    if (syncToGithub && githubRepo.trim() && token) {
      try {
        const { owner, repo } = parseGitHubRepo(githubRepo, ghConfig.username || 'yashichauhan');
        
        // 1. Update repo metadata
        const updateRes = await updateGitHubRepoMetadata(owner, repo, token, {
          description: tagline || description.slice(0, 200),
          homepage: window.location.origin,
          topics: techStack,
        });

        // 2. Commit portfolio metadata file to repo
        const metaRes = await syncProjectMetaFileToGitHub(owner, repo, token, projectData);

        if (updateRes.success || metaRes.success) {
          syncMessage = `Synchronized changes directly to GitHub repository ${owner}/${repo}`;
        }
      } catch (err: any) {
        console.warn('GitHub synchronization warning:', err);
      }
    }

    onSaveProject(projectData, syncMessage);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/70 backdrop-blur-xs animate-fadeIn font-['Inter']">
      <div className="bg-[#f9f9f7] text-[#1a1c1b] w-full max-w-4xl border border-[#1a1c1b] shadow-2xl relative max-h-[96dvh] sm:max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-[#c4c5d9] bg-[#e8e8e6]">
          <div className="flex items-center space-x-2 min-w-0 pr-2">
            <span className="material-symbols-outlined text-[#0040e0] text-lg sm:text-xl shrink-0">
              {projectToEdit ? 'edit_document' : 'add_circle'}
            </span>
            <span className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wider truncate">
              {projectToEdit ? `Edit: ${projectToEdit.title}` : 'Add Portfolio Project & GitHub Sync'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-[#5e5e5e] hover:text-black transition-colors cursor-pointer p-1.5 shrink-0"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Tab Navigation with horizontal smooth scrolling and indicators */}
        <div className="flex border-b border-[#c4c5d9] bg-[#f0f0ee] overflow-x-auto text-[11px] sm:text-xs font-mono scroll-smooth touch-pan-x">
          <button
            type="button"
            onClick={() => setActiveTab('basics')}
            className={`px-3 sm:px-4 py-2.5 sm:py-3 border-r border-[#c4c5d9] transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'basics' ? 'bg-[#f9f9f7] text-[#0040e0] font-bold border-b-2 border-b-[#0040e0]' : 'text-[#5e5e5e] hover:text-black'
            }`}
          >
            01 / Basics
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('stack')}
            className={`px-3 sm:px-4 py-2.5 sm:py-3 border-r border-[#c4c5d9] transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'stack' ? 'bg-[#f9f9f7] text-[#0040e0] font-bold border-b-2 border-b-[#0040e0]' : 'text-[#5e5e5e] hover:text-black'
            }`}
          >
            02 / Stack & Metrics
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('challenge')}
            className={`px-3 sm:px-4 py-2.5 sm:py-3 border-r border-[#c4c5d9] transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'challenge' ? 'bg-[#f9f9f7] text-[#0040e0] font-bold border-b-2 border-b-[#0040e0]' : 'text-[#5e5e5e] hover:text-black'
            }`}
          >
            03 / Challenge & Outcome
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('github')}
            className={`px-3 sm:px-4 py-2.5 sm:py-3 border-r border-[#c4c5d9] transition-colors cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'github' ? 'bg-[#f9f9f7] text-[#0040e0] font-bold border-b-2 border-b-[#0040e0]' : 'text-[#5e5e5e] hover:text-black'
            }`}
          >
            <span>04 / GitHub Sync</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('code')}
            className={`px-3 sm:px-4 py-2.5 sm:py-3 border-r border-[#c4c5d9] transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'code' ? 'bg-[#f9f9f7] text-[#0040e0] font-bold border-b-2 border-b-[#0040e0]' : 'text-[#5e5e5e] hover:text-black'
            }`}
          >
            05 / Code & Topology
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('activity')}
            className={`px-3 sm:px-4 py-2.5 sm:py-3 transition-colors cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'activity' ? 'bg-[#f9f9f7] text-[#0040e0] font-bold border-b-2 border-b-[#0040e0]' : 'text-[#5e5e5e] hover:text-black'
            }`}
          >
            <span className="material-symbols-outlined text-sm text-[#0040e0]">bar_chart</span>
            <span>06 / Activity & Chart</span>
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
          {/* TAB 1: Basics */}
          {activeTab === 'basics' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-mono text-xs uppercase text-[#5e5e5e] block mb-1 font-semibold">
                    Case Number
                  </label>
                  <input
                    required
                    type="text"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="01"
                    className="w-full bg-[#eeeeec] border border-[#c4c5d9] px-3 py-2 text-sm font-mono focus:border-[#0040e0] focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-mono text-xs uppercase text-[#5e5e5e] block mb-1 font-semibold">
                    Project Title *
                  </label>
                  <input
                    required
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Real-Time Distributed Graph Inference Engine"
                    className="w-full bg-[#eeeeec] border border-[#c4c5d9] px-3 py-2 text-sm font-bold text-[#1a1c1b] focus:border-[#0040e0] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-xs uppercase text-[#5e5e5e] block mb-1 font-semibold">
                    Engineering Role
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="AI / ML Backend Architect"
                    className="w-full bg-[#eeeeec] border border-[#c4c5d9] px-3 py-2 text-sm focus:border-[#0040e0] focus:outline-none"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-mono text-xs uppercase text-[#5e5e5e] font-semibold">
                      Timeline / Year
                    </label>
                    <button
                      type="button"
                      onClick={() => setActiveTab('activity')}
                      className="font-mono text-[10px] text-[#0040e0] hover:underline flex items-center space-x-0.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-xs">bar_chart</span>
                      <span>View Chart</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    placeholder="2024 — 2025"
                    className="w-full bg-[#eeeeec] border border-[#c4c5d9] px-3 py-2 text-sm font-mono focus:border-[#0040e0] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-mono text-xs uppercase text-[#5e5e5e] block mb-1 font-semibold">
                  Tagline / Subheading *
                </label>
                <input
                  required
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Semantic Q&A Engine over Enterprise Documents with Local LLM Inference"
                  className="w-full bg-[#eeeeec] border border-[#c4c5d9] px-3 py-2 text-sm focus:border-[#0040e0] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-mono text-xs uppercase text-[#5e5e5e] block mb-1 font-semibold">
                  Comprehensive Overview Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the system architecture, business purpose, and core engineering delivery..."
                  className="w-full bg-[#eeeeec] border border-[#c4c5d9] px-3 py-2 text-sm focus:border-[#0040e0] focus:outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Image selection */}
              <div>
                <label className="font-mono text-xs uppercase text-[#5e5e5e] block mb-2 font-semibold">
                  Architecture Visual Image URL
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-[#eeeeec] border border-[#c4c5d9] px-3 py-2 text-xs font-mono focus:border-[#0040e0] focus:outline-none mb-2"
                />
                <div className="flex items-center space-x-2 text-xs font-mono text-[#747688]">
                  <span>Image Presets:</span>
                  {DEFAULT_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setImageUrl(preset.url)}
                      className="underline hover:text-[#0040e0] cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Stack & Metrics */}
          {activeTab === 'stack' && (
            <div className="space-y-6">
              <div>
                <label className="font-mono text-xs uppercase text-[#5e5e5e] block mb-1 font-semibold">
                  Tech Stack Tags (Comma Separated)
                </label>
                <input
                  type="text"
                  value={techStackInput}
                  onChange={(e) => handleTechStackChange(e.target.value)}
                  placeholder="Python, FastAPI, Ollama, ChromaDB, Sentence Transformers"
                  className="w-full bg-[#eeeeec] border border-[#c4c5d9] px-3 py-2 text-sm font-mono focus:border-[#0040e0] focus:outline-none"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {techStack.map((tech, idx) => (
                    <span key={idx} className="bg-[#e0e0de] text-[#1a1c1b] px-2 py-0.5 text-xs font-mono font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Detailed Tech Stack breakdown */}
              <div>
                <label className="font-mono text-xs uppercase text-[#5e5e5e] block mb-2 font-semibold">
                  Detailed Architecture Breakdown (4 Highlights)
                </label>
                <div className="space-y-2">
                  {detailedStack.map((st, idx) => (
                    <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center bg-[#f0f0ee] p-2 border border-[#c4c5d9]">
                      <span className="sm:col-span-1 font-mono text-xs text-[#0040e0] font-bold">{st.number}</span>
                      <input
                        type="text"
                        value={st.name}
                        onChange={(e) => {
                          const updated = [...detailedStack];
                          updated[idx].name = e.target.value;
                          setDetailedStack(updated);
                        }}
                        placeholder="Component / Tech"
                        className="sm:col-span-4 bg-white border border-[#c4c5d9] px-2 py-1 text-xs font-semibold"
                      />
                      <input
                        type="text"
                        value={st.detail}
                        onChange={(e) => {
                          const updated = [...detailedStack];
                          updated[idx].detail = e.target.value;
                          setDetailedStack(updated);
                        }}
                        placeholder="Technical implementation details..."
                        className="sm:col-span-7 bg-white border border-[#c4c5d9] px-2 py-1 text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Metrics */}
              <div>
                <label className="font-mono text-xs uppercase text-[#5e5e5e] block mb-2 font-semibold">
                  Production Performance Benchmarks (4 Key Stats)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {metrics.map((m, idx) => (
                    <div key={idx} className="p-3 bg-[#f0f0ee] border border-[#c4c5d9] space-y-2">
                      <input
                        type="text"
                        value={m.label}
                        onChange={(e) => {
                          const updated = [...metrics];
                          updated[idx].label = e.target.value;
                          setMetrics(updated);
                        }}
                        placeholder="Metric Label (e.g. Latency)"
                        className="w-full bg-white border border-[#c4c5d9] px-2 py-1 text-xs font-mono uppercase"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={m.value}
                          onChange={(e) => {
                            const updated = [...metrics];
                            updated[idx].value = e.target.value;
                            setMetrics(updated);
                          }}
                          placeholder="Value (e.g. 99.8%)"
                          className="bg-white border border-[#c4c5d9] px-2 py-1 text-sm font-bold text-[#0040e0]"
                        />
                        <input
                          type="text"
                          value={m.change}
                          onChange={(e) => {
                            const updated = [...metrics];
                            updated[idx].change = e.target.value;
                            setMetrics(updated);
                          }}
                          placeholder="Context / Benchmark"
                          className="bg-white border border-[#c4c5d9] px-2 py-1 text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Challenge & Outcome */}
          {activeTab === 'challenge' && (
            <div className="space-y-6">
              <div>
                <label className="font-mono text-xs uppercase text-[#5e5e5e] block mb-1 font-semibold">
                  Technical Challenge & System Bottlenecks *
                </label>
                <textarea
                  rows={4}
                  required
                  value={challenge}
                  onChange={(e) => setChallenge(e.target.value)}
                  placeholder="Explain the engineering constraints, concurrency limits, data volume, or latency challenges..."
                  className="w-full bg-[#eeeeec] border border-[#c4c5d9] px-3 py-2 text-sm focus:border-[#0040e0] focus:outline-none resize-none leading-relaxed"
                />
              </div>

              <div>
                <label className="font-mono text-xs uppercase text-[#5e5e5e] block mb-1 font-semibold">
                  Engineering Outcome & Mathematical Results *
                </label>
                <textarea
                  rows={4}
                  required
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value)}
                  placeholder="Describe the architectural design, algorithmic optimizations, and production SLA outcomes..."
                  className="w-full bg-[#eeeeec] border border-[#c4c5d9] px-3 py-2 text-sm focus:border-[#0040e0] focus:outline-none resize-none leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* TAB 4: GitHub Live Integration */}
          {activeTab === 'github' && (
            <div className="space-y-6">
              {/* Safety notice banner */}
              <div className="p-4 bg-emerald-50 border-l-4 border-emerald-600 text-xs text-emerald-950 space-y-1">
                <div className="flex items-center space-x-2 font-bold font-mono uppercase text-emerald-800">
                  <span className="material-symbols-outlined text-sm">shield</span>
                  <span>GitHub Safety Guarantee</span>
                </div>
                <p>
                  • <strong>Update / Add:</strong> Synchronizes repository description, topics, and portfolio meta files directly to GitHub.
                </p>
                <p>
                  • <strong>Delete:</strong> Projects deleted here are <strong>ONLY removed from this portfolio</strong>. Your real GitHub account and repositories remain 100% untouched.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="font-mono text-xs uppercase text-[#5e5e5e] block mb-1 font-semibold">
                    Target GitHub Repository (owner/repo or Full URL)
                  </label>
                  <input
                    type="text"
                    value={githubRepo}
                    onChange={(e) => setGithubRepo(e.target.value)}
                    placeholder="yashichauhan/enterprise-rag-assistant"
                    className="w-full bg-[#eeeeec] border border-[#c4c5d9] px-3 py-2 text-sm font-mono focus:border-[#0040e0] focus:outline-none"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    disabled={isFetchingGithub || !githubRepo.trim()}
                    onClick={handleFetchFromGithub}
                    className="w-full bg-white border border-[#1a1c1b] hover:bg-[#e0e0de] text-[#1a1c1b] font-mono text-xs uppercase tracking-wider py-2.5 px-3 transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-1"
                  >
                    <span className="material-symbols-outlined text-sm">
                      {isFetchingGithub ? 'sync' : 'cloud_download'}
                    </span>
                    <span>{isFetchingGithub ? 'Fetching...' : 'Fetch Repo Stats'}</span>
                  </button>
                </div>
              </div>

              {/* GitHub PAT input override */}
              <div>
                <label className="font-mono text-xs uppercase text-[#5e5e5e] block mb-1 font-semibold">
                  GitHub Personal Access Token (for repo updates)
                </label>
                <input
                  type="password"
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                  placeholder={ghConfig.token ? '•••••••••••••••••••• (Configured in Settings)' : 'ghp_xxxxxxxxxxxxxxx (Optional for public reads)'}
                  className="w-full bg-[#eeeeec] border border-[#c4c5d9] px-3 py-2 text-xs font-mono focus:border-[#0040e0] focus:outline-none"
                />
              </div>

              {/* Sync Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-[#f0f0ee] border border-[#c4c5d9]">
                <div>
                  <span className="font-mono text-xs font-bold text-[#1a1c1b] block">
                    Push metadata to real GitHub repository on save
                  </span>
                  <span className="text-[11px] text-[#5e5e5e]">
                    Updates repo description, topics, and commits a .portfolio-meta.json file to your repo.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={syncToGithub}
                  onChange={(e) => setSyncToGithub(e.target.checked)}
                  className="w-4 h-4 text-[#0040e0] rounded cursor-pointer"
                />
              </div>

              {/* Status Message */}
              {githubSyncStatus && (
                <div className="p-3 bg-[#e8e8e6] border border-[#c4c5d9] font-mono text-xs text-[#1a1c1b]">
                  {githubSyncStatus}
                </div>
              )}

              {/* Create New Repo helper */}
              <div className="p-4 bg-white border border-[#c4c5d9] space-y-3">
                <span className="font-mono text-xs font-bold text-[#1a1c1b] uppercase block">
                  Quick Create New GitHub Repository:
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={createRepoName}
                    onChange={(e) => setCreateRepoName(e.target.value)}
                    placeholder="new-deep-learning-repo"
                    className="flex-1 bg-[#eeeeec] border border-[#c4c5d9] px-3 py-2 text-xs font-mono"
                  />
                  <button
                    type="button"
                    disabled={isCreatingRepo || !createRepoName.trim()}
                    onClick={handleCreateGitHubRepo}
                    className="bg-[#121212] hover:bg-[#0040e0] text-white font-mono text-xs uppercase px-4 py-2 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isCreatingRepo ? 'Creating...' : '+ Create on GitHub'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Code & Topology */}
          {activeTab === 'code' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-xs uppercase text-[#5e5e5e] block mb-1 font-semibold">
                    Code Snippet Filename
                  </label>
                  <input
                    type="text"
                    value={codeFilename}
                    onChange={(e) => setCodeFilename(e.target.value)}
                    placeholder="models/rag_pipeline.py"
                    className="w-full bg-[#eeeeec] border border-[#c4c5d9] px-3 py-2 text-xs font-mono focus:border-[#0040e0] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-mono text-xs uppercase text-[#5e5e5e] block mb-1 font-semibold">
                    Language
                  </label>
                  <input
                    type="text"
                    value={codeLanguage}
                    onChange={(e) => setCodeLanguage(e.target.value)}
                    placeholder="python"
                    className="w-full bg-[#eeeeec] border border-[#c4c5d9] px-3 py-2 text-xs font-mono focus:border-[#0040e0] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-mono text-xs uppercase text-[#5e5e5e] block mb-1 font-semibold">
                  Source Code Implementation
                </label>
                <textarea
                  rows={8}
                  value={codeContent}
                  onChange={(e) => setCodeContent(e.target.value)}
                  className="w-full bg-[#121212] text-[#dde1ff] border border-[#434656] p-3 text-xs font-mono focus:outline-none resize-none leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* TAB 6: Project Activity & Frequency Recharts Visualizer */}
          {activeTab === 'activity' && (
            <div className="space-y-4">
              <ProjectContributionsChart
                projects={projectsList}
                currentEditingTimeline={timeline}
                onSelectYearFilter={(selectedYear) => {
                  setTimeline(selectedYear);
                }}
              />
              <div className="bg-[#f0f0ee] p-4 border border-[#c4c5d9] text-xs font-['Inter'] flex items-start space-x-3">
                <span className="material-symbols-outlined text-[#0040e0] text-lg mt-0.5">insights</span>
                <div className="space-y-1">
                  <div className="font-bold text-[#1a1c1b] uppercase font-mono text-[11px]">
                    Cadence & Frequency Tracking Guide
                  </div>
                  <p className="text-[#5e5e5e] leading-relaxed">
                    This interactive Recharts visualization aggregates all active and delivered case studies in your portfolio by timeline year and tech stack breadth. Click any period tag to assign that delivery timeline to this case study.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Sticky Modal Actions Footer */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-5 sm:pt-6 border-t border-[#c4c5d9] bg-[#f9f9f7]">
            <div className="font-mono text-xs text-[#747688] flex items-center justify-between sm:justify-start">
              <span>Section: {activeTab.toUpperCase()}</span>
              <span className="sm:hidden text-[10px] text-[#0040e0]">Yashi Chauhan Portfolio</span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="font-mono text-xs uppercase tracking-widest text-[#5e5e5e] hover:text-[#1a1c1b] px-3 sm:px-4 py-2.5 cursor-pointer flex-1 sm:flex-initial text-center border border-[#c4c5d9] sm:border-transparent"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#121212] hover:bg-[#0040e0] text-white font-mono text-xs uppercase tracking-widest px-5 sm:px-7 py-2.5 sm:py-3 transition-colors cursor-pointer flex items-center justify-center space-x-2 flex-1 sm:flex-initial"
              >
                <span className="material-symbols-outlined text-sm">save</span>
                <span>{projectToEdit ? 'Save & Sync' : 'Add & Sync'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
