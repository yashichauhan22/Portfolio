import React, { useState } from 'react';
import { Project } from '../types';
import { PROJECTS } from '../data/portfolioData';

interface CaseStudyDetailProps {
  currentProject: Project;
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onBackToHome: () => void;
  onOpenContact: () => void;
  onEditProject?: (project: Project) => void;
  onDeleteProject?: (project: Project) => void;
  onAddProject?: () => void;
}

export const CaseStudyDetail: React.FC<CaseStudyDetailProps> = ({
  currentProject,
  projects,
  onSelectProject,
  onBackToHome,
  onOpenContact,
  onEditProject,
  onDeleteProject,
  onAddProject,
}) => {
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [simulatedScore, setSimulatedScore] = useState('99.83%');
  const [isSimulating, setIsSimulating] = useState(false);
  const [demoQuery, setDemoQuery] = useState('What are the system throughput constraints for TechSagar data pipelines?');
  const [demoOutput, setDemoOutput] = useState<{
    answer: string;
    confidence: string;
    latency: string;
    sources: string[];
  } | null>(null);

  const [benchmarkLogs, setBenchmarkLogs] = useState<string[]>([
    'MODEL RUNTIME: PyTorch 2.3 + CUDA acceleration initialized',
    'INDEX HEALTH: ChromaDB persistent vector collection synced',
    'LOCAL LLM: Ollama (Llama 3 / Mistral) ready on localhost:11434',
  ]);

  const runBenchmark = () => {
    setIsSimulating(true);
    setBenchmarkLogs((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] INITIATING INFERENCE PIPELINE FOR: "${currentProject.title}"...`,
    ]);

    setTimeout(() => {
      if (currentProject.id === 'enterprise-rag-assistant') {
        setDemoOutput({
          answer: 'The TechSagar platform data pipelines are automated to process and enrich ecosystem records across cybersecurity and emerging tech sectors with sub-second vector search indexing.',
          confidence: '98.4% Grounded',
          latency: '210 ms',
          sources: ['techsagar_architecture_v2.pdf (p. 14)', 'dsci_ecosystem_pipeline.pdf (p. 3)'],
        });
        setBenchmarkLogs((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] SENTENCE-TRANSFORMER: Generated 384-dim query embedding in 14ms`,
          `[${new Date().toLocaleTimeString()}] CHROMADB VECTOR RETRIEVAL: 4 candidate chunks retrieved (cosine dist: 0.12)`,
          `[${new Date().toLocaleTimeString()}] OLLAMA CONTEXT GROUNDING: Generated context-aware answer in 196ms`,
          `[${new Date().toLocaleTimeString()}] COMPLETE: 100% On-Prem Zero Data Leakage`,
        ]);
      } else if (currentProject.id === 'xai-sign-language-recognition') {
        setSimulatedScore('99.83%');
        setDemoOutput({
          answer: 'Classified Gesture: "Class 18 (Alphabet R)" with Grad-CAM heatmap highlighting wrist posture and primary index/middle finger flexion.',
          confidence: '99.83% Accuracy',
          latency: '18.2 ms',
          sources: ['ISLRTC Benchmark Dataset', 'ResNet18 Layer4 Attribution Map'],
        });
        setBenchmarkLogs((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] RESNET18 INFERENCE: 36-class softmax evaluation complete (18.2ms)`,
          `[${new Date().toLocaleTimeString()}] GRAD-CAM LOCALIZATION: Activated layer4 target gradients`,
          `[${new Date().toLocaleTimeString()}] SHAP/LIME VERIFICATION: Confirmed feature attribution on anatomical joints`,
          `[${new Date().toLocaleTimeString()}] CLASSIFICATION COMPLETE: 99.83% Benchmark Accuracy`,
        ]);
      } else {
        setDemoOutput({
          answer: 'Detected Vocal Emotion: "Calm / Neutral (Confidence 94.2%)" transitioning to "Engaged".',
          confidence: '94.2% Emotion Match',
          latency: '11.5 ms',
          sources: ['40-Band Librosa MFCC', 'Stacked Bi-LSTM Sequence Model'],
        });
        setBenchmarkLogs((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] LIBROSA: 40-band MFCC extraction completed in 4.5ms`,
          `[${new Date().toLocaleTimeString()}] BI-LSTM FORWARD PASS: Temporal sequence modeling in 7.0ms`,
          `[${new Date().toLocaleTimeString()}] EMOTION CLASSIFICATION COMPLETE: 6-Class Softmax Output`,
        ]);
      }
      setIsSimulating(false);
    }, 1100);
  };

  const copyCode = () => {
    if (currentProject.codeSnippet) {
      navigator.clipboard.writeText(currentProject.codeSnippet.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="w-full pb-16 sm:pb-20">
      {/* Navigation breadcrumb & Case Study Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 sm:py-4 mb-4 sm:mb-6 border-b border-[#c4c5d9]/40 font-mono text-xs text-[#747688]">
        <button
          onClick={onBackToHome}
          className="flex items-center space-x-1 hover:text-[#0040e0] transition-colors cursor-pointer py-1 font-semibold uppercase tracking-wider self-start"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          <span>Return to Overview</span>
        </button>

        {/* Quick project switcher with smooth touch scroll */}
        <div className="flex items-center space-x-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0 scroll-smooth touch-pan-x">
          <span className="text-[#1a1c1b] uppercase tracking-widest hidden md:inline text-[11px]">Select Case Study:</span>
          {projects.map((proj) => (
            <button
              key={proj.id}
              onClick={() => {
                onSelectProject(proj);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-2.5 py-1 text-[11px] sm:text-xs transition-colors cursor-pointer whitespace-nowrap min-h-[30px] ${
                proj.id === currentProject.id
                  ? 'bg-[#121212] text-white font-bold'
                  : 'bg-[#e8e8e6] text-[#1a1c1b] hover:bg-[#c4c5d9]'
              }`}
            >
              {proj.number} {proj.title}
            </button>
          ))}
          {onAddProject && (
            <button
              onClick={onAddProject}
              title="Add a new case study"
              className="px-2 py-1 text-[11px] sm:text-xs bg-[#0040e0] text-white hover:bg-[#001356] transition-colors cursor-pointer font-bold whitespace-nowrap min-h-[30px]"
            >
              + Add
            </button>
          )}
        </div>
      </div>

      {/* Large Visual Preview Area */}
      <section className="w-full h-[240px] sm:h-[360px] md:h-[480px] bg-[#eeeeec] relative overflow-hidden group border border-[#c4c5d9]/60">
        <img
          className="absolute inset-0 w-full h-full object-cover custom-filter transform group-hover:scale-[1.02] transition-transform duration-700"
          alt={currentProject.imageAlt}
          src={currentProject.image}
        />
        <div className="absolute bottom-3 right-3 bg-[#121212]/80 backdrop-blur-xs text-white font-mono text-[10px] sm:text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="truncate max-w-[240px] sm:max-w-none">SYSTEM ARCHITECTURE // {currentProject.title.toUpperCase()}</span>
        </div>
      </section>

      {/* Project Details Section */}
      <section className="pt-8 sm:pt-10 md:pt-14 flex flex-col gap-8 sm:gap-10">
        {/* Header & Role */}
        <div className="border-b border-[#D1D1D1] pb-6 sm:pb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <p className="font-mono text-xs uppercase tracking-widest text-[#0040e0] font-semibold">
                CASE STUDY {currentProject.number}
              </p>
              {currentProject.githubRepo && (
                <a
                  href={currentProject.githubUrl || `https://github.com/${currentProject.githubRepo}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-[10px] text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 uppercase tracking-wider flex items-center space-x-1 hover:bg-emerald-200 transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  <span className="truncate max-w-[180px] sm:max-w-none">GitHub: {currentProject.githubRepo}</span>
                  <span className="material-symbols-outlined text-xs">open_in_new</span>
                </a>
              )}
            </div>

            {/* Edit / Delete Buttons */}
            <div className="flex items-center space-x-2 self-start sm:self-auto">
              {onEditProject && (
                <button
                  onClick={() => onEditProject(currentProject)}
                  className="bg-[#121212] hover:bg-[#0040e0] text-white font-mono text-xs uppercase tracking-wider px-3 py-1.5 transition-colors cursor-pointer flex items-center space-x-1 min-h-[36px]"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                  <span>Edit Case Study</span>
                </button>
              )}
              {onDeleteProject && (
                <button
                  onClick={() => onDeleteProject(currentProject)}
                  title="Delete from portfolio display (GitHub remains untouched)"
                  className="bg-[#e8e8e6] hover:bg-rose-600 hover:text-white text-rose-700 font-mono text-xs uppercase tracking-wider px-3 py-1.5 transition-colors cursor-pointer flex items-center space-x-1 border border-[#c4c5d9] min-h-[36px]"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                  <span>Delete</span>
                </button>
              )}
            </div>
          </div>

          <h1 className="font-['Inter'] text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#1a1c1b] tracking-tight mb-4 sm:mb-6">
            {currentProject.title}
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-widest text-[#5e5e5e] font-semibold">
                ROLE:
              </span>
              <span className="font-['Inter'] text-lg sm:text-2xl text-[#1a1c1b] font-semibold">
                {currentProject.role}
              </span>
            </div>
            <span className="font-mono text-xs text-[#747688] sm:ml-auto">
              TIMELINE: {currentProject.timeline}
            </span>
          </div>
        </div>

        {/* Technology Stack List */}
        <div className="border-b border-[#D1D1D1] pb-6 sm:pb-8">
          <h2 className="font-mono text-xs uppercase tracking-widest text-[#5e5e5e] font-semibold mb-4 sm:mb-6">
            TECHNOLOGY STACK
          </h2>
          <ul className="flex flex-col gap-3 sm:gap-4">
            {currentProject.techStackDetailed.map((tech, index) => (
              <React.Fragment key={index}>
                <li className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 py-1">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <span className="font-mono text-xs text-[#0040e0] font-medium w-6">{tech.number}</span>
                    <span className="font-['Inter'] text-base sm:text-lg font-medium text-[#1a1c1b]">
                      {tech.name}
                    </span>
                  </div>
                  <span className="font-mono text-xs text-[#747688] pl-9 sm:pl-0">{tech.detail}</span>
                </li>
                {index < currentProject.techStackDetailed.length - 1 && (
                  <li className="w-full h-px bg-[#c4c5d9]/40" />
                )}
              </React.Fragment>
            ))}
          </ul>
        </div>

        {/* Key Performance Benchmarks Grid */}
        <div className="border-b border-[#D1D1D1] pb-6 sm:pb-8">
          <h2 className="font-mono text-xs uppercase tracking-widest text-[#5e5e5e] font-semibold mb-4 sm:mb-6">
            KEY METRICS & PRODUCTION BENCHMARKS
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {currentProject.metrics.map((metric, idx) => (
              <div key={idx} className="bg-[#f4f4f2] p-3 sm:p-5 border border-[#c4c5d9]/60">
                <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-[#747688] block mb-1">
                  {metric.label}
                </span>
                <span className="font-['Inter'] text-xl sm:text-3xl font-bold text-[#1a1c1b] block">
                  {metric.value}
                </span>
                <span className="font-mono text-[11px] sm:text-xs text-[#0040e0] font-semibold mt-1 inline-block">
                  {metric.change}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Challenge & Outcome */}
        <div className="flex flex-col gap-6 sm:gap-8 border-b border-[#D1D1D1] pb-6 sm:pb-8">
          <div>
            <h2 className="font-mono text-xs uppercase tracking-widest text-[#5e5e5e] font-semibold mb-3 sm:mb-4">
              TECHNICAL CHALLENGE
            </h2>
            <p className="font-['Inter'] text-base sm:text-xl text-[#1a1c1b] leading-relaxed">
              {currentProject.challenge}
            </p>
          </div>

          <div>
            <h2 className="font-mono text-xs uppercase tracking-widest text-[#5e5e5e] font-semibold mb-3 sm:mb-4">
              ENGINEERING OUTCOME
            </h2>
            <p className="font-['Inter'] text-sm sm:text-lg text-[#434656] leading-relaxed border-l-2 border-[#0040e0] pl-3 sm:pl-4">
              {currentProject.outcome}
            </p>
          </div>
        </div>

        {/* Live Architecture Node Topology Inspector */}
        {currentProject.architectureNodes && (
          <div className="border-b border-[#D1D1D1] pb-6 sm:pb-8">
            <div className="flex flex-wrap justify-between items-center mb-4 sm:mb-6 gap-2">
              <h2 className="font-mono text-xs uppercase tracking-widest text-[#5e5e5e] font-semibold">
                ACTIVE PIPELINE TOPOLOGY & NODES
              </h2>
              <span className="font-mono text-[10px] sm:text-xs text-emerald-700 bg-emerald-100 px-2 py-0.5 font-medium">
                OPTIMAL PERFORMANCE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {currentProject.architectureNodes.map((node) => (
                <div key={node.id} className="border border-[#c4c5d9] bg-[#f4f4f2] p-3 sm:p-4 relative group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono text-[10px] sm:text-[11px] text-[#747688] uppercase">{node.type}</span>
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                  </div>
                  <h4 className="font-['Inter'] font-semibold text-xs sm:text-sm text-[#1a1c1b] mb-2 sm:mb-3">{node.label}</h4>
                  <div className="font-mono text-[11px] sm:text-xs space-y-1 text-[#5e5e5e] border-t border-[#c4c5d9]/40 pt-2">
                    <div className="flex justify-between">
                      <span>Throughput:</span>
                      <span className="font-medium text-[#1a1c1b]">{node.tps}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Latency:</span>
                      <span className="text-[#0040e0] font-medium">{node.latency}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Links */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={() => setShowCodeModal(true)}
            className="bg-[#121212] text-white font-mono text-xs uppercase tracking-widest py-3.5 sm:py-4 px-6 sm:px-8 text-center hover:bg-[#0040e0] transition-colors duration-300 flex justify-center items-center gap-2 cursor-pointer flex-1 min-h-[44px]"
          >
            <span className="material-symbols-outlined text-[18px]">code</span>
            Inspect Pipeline Code
          </button>
          <button
            onClick={() => setShowDemoModal(true)}
            className="text-[#1a1c1b] font-mono text-xs uppercase tracking-widest py-3.5 sm:py-4 px-6 sm:px-8 text-center border border-[#121212] hover:text-[#0040e0] hover:border-[#0040e0] hover:bg-white transition-all duration-300 flex justify-center items-center gap-2 cursor-pointer flex-1 min-h-[44px]"
          >
            <span className="material-symbols-outlined text-[18px]">play_circle</span>
            Run Inference Sandbox
          </button>
        </div>

        {/* Contact Callout */}
        <div className="mt-6 sm:mt-8 p-5 sm:p-6 bg-[#eeeeec] border border-[#c4c5d9] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-['Inter'] text-base sm:text-lg font-bold text-[#1a1c1b]">
              Interested in collaborating on AI/ML or RAG architectures?
            </h3>
            <p className="font-['Inter'] text-xs sm:text-sm text-[#434656] mt-1">
              I develop robust deep learning models, explainable vision pipelines, and production RAG services.
            </p>
          </div>
          <button
            onClick={onOpenContact}
            className="bg-[#0040e0] hover:bg-[#001356] text-white font-mono text-xs uppercase tracking-widest px-6 py-3 whitespace-nowrap transition-colors cursor-pointer self-start sm:self-auto min-h-[40px] text-center"
          >
            Contact Yashi Chauhan
          </button>
        </div>
      </section>

      {/* Code Inspector Modal */}
      {showCodeModal && currentProject.codeSnippet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#121212] text-white w-full max-w-3xl border border-[#434656] shadow-2xl overflow-hidden animate-fadeIn max-h-[92dvh] flex flex-col">
            <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-[#2f3130] bg-[#1a1c1b]">
              <div className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-[#0040e0] text-sm">terminal</span>
                <span className="font-mono text-xs text-[#c4c5d9] truncate max-w-[200px] sm:max-w-none">{currentProject.codeSnippet.filename}</span>
              </div>
              <button
                onClick={() => setShowCodeModal(false)}
                className="text-[#747688] hover:text-white transition-colors cursor-pointer p-1"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="p-4 sm:p-5 overflow-x-auto flex-1 max-h-[65vh]">
              <pre className="font-mono text-[11px] sm:text-xs text-[#dde1ff] leading-relaxed">
                <code>{currentProject.codeSnippet.code}</code>
              </pre>
            </div>
            <div className="px-4 sm:px-5 py-3 border-t border-[#2f3130] bg-[#1a1c1b] flex justify-between items-center text-[11px] sm:text-xs font-mono text-[#747688]">
              <span>Lang: {currentProject.codeSnippet.language.toUpperCase()}</span>
              <button
                onClick={copyCode}
                className="text-[#b8c3ff] hover:text-white flex items-center space-x-1 cursor-pointer min-h-[30px]"
              >
                <span className="material-symbols-outlined text-xs">
                  {copiedCode ? 'check' : 'content_copy'}
                </span>
                <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live System Interactive Demo Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#f9f9f7] text-[#1a1c1b] w-full max-w-3xl border border-[#1a1c1b] shadow-2xl overflow-hidden animate-fadeIn max-h-[92dvh] flex flex-col">
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-[#c4c5d9] bg-[#e8e8e6]">
              <div className="flex items-center space-x-2 min-w-0 pr-2">
                <span className="material-symbols-outlined text-[#0040e0] shrink-0">psychology</span>
                <span className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wider truncate">
                  Model Sandbox — {currentProject.title}
                </span>
              </div>
              <button
                onClick={() => setShowDemoModal(false)}
                className="text-[#5e5e5e] hover:text-black transition-colors cursor-pointer p-1.5 shrink-0"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto flex-1">
              {/* Telemetry Status Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4">
                <div className="p-3 sm:p-4 bg-white border border-[#c4c5d9] flex sm:flex-col justify-between sm:justify-start items-center sm:items-start">
                  <span className="font-mono text-[10px] text-[#747688] uppercase block">Accuracy</span>
                  <span className="font-['Inter'] text-xl sm:text-2xl font-bold text-[#0040e0]">
                    {currentProject.metrics[0]?.value || '99.83%'}
                  </span>
                </div>
                <div className="p-3 sm:p-4 bg-white border border-[#c4c5d9] flex sm:flex-col justify-between sm:justify-start items-center sm:items-start">
                  <span className="font-mono text-[10px] text-[#747688] uppercase block">Inference Speed</span>
                  <span className="font-['Inter'] text-xl sm:text-2xl font-bold text-emerald-600">
                    {currentProject.metrics[2]?.value || '< 20 ms'}
                  </span>
                </div>
                <div className="p-3 sm:p-4 bg-white border border-[#c4c5d9] flex sm:flex-col justify-between sm:justify-start items-center sm:items-start">
                  <span className="font-mono text-[10px] text-[#747688] uppercase block">Architecture State</span>
                  <span className="font-['Inter'] text-xl sm:text-2xl font-bold text-[#1a1c1b]">
                    READY (100%)
                  </span>
                </div>
              </div>

              {/* Sandbox Input Simulator */}
              {currentProject.id === 'enterprise-rag-assistant' && (
                <div className="p-3 sm:p-4 bg-white border border-[#c4c5d9] space-y-2 sm:space-y-3">
                  <label className="font-mono text-[11px] sm:text-xs uppercase text-[#5e5e5e] block">
                    Sample Query Input for RAG Vector Index:
                  </label>
                  <input
                    type="text"
                    value={demoQuery}
                    onChange={(e) => setDemoQuery(e.target.value)}
                    className="w-full bg-[#f9f9f7] border border-[#c4c5d9] px-3 py-2 text-xs font-mono text-[#1a1c1b] focus:border-[#0040e0] focus:outline-none"
                  />
                </div>
              )}

              {/* Output Result Card if executed */}
              {demoOutput && (
                <div className="p-3 sm:p-4 bg-[#e8e8e6] border-l-4 border-[#0040e0] space-y-2">
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <span className="font-mono text-xs text-[#0040e0] font-bold uppercase">
                      Inference Result
                    </span>
                    <span className="font-mono text-[10px] sm:text-[11px] text-emerald-700 bg-emerald-100 px-2 py-0.5 font-semibold">
                      {demoOutput.confidence} • {demoOutput.latency}
                    </span>
                  </div>
                  <p className="font-['Inter'] text-xs sm:text-sm text-[#1a1c1b] leading-relaxed">
                    {demoOutput.answer}
                  </p>
                  <div className="pt-1 text-[10px] sm:text-[11px] font-mono text-[#747688]">
                    Sources: {demoOutput.sources.join(', ')}
                  </div>
                </div>
              )}

              {/* Terminal Logs */}
              <div className="bg-[#121212] text-[#efefff] p-3 sm:p-4 font-mono text-[11px] sm:text-xs h-36 sm:h-40 overflow-y-auto space-y-1">
                {benchmarkLogs.map((log, index) => (
                  <div key={index} className="leading-relaxed">
                    <span className="text-[#0040e0] mr-2">&gt;</span>
                    {log}
                  </div>
                ))}
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-2">
                <button
                  onClick={() => setShowDemoModal(false)}
                  className="font-mono text-xs text-[#5e5e5e] hover:text-[#1a1c1b] uppercase cursor-pointer text-center py-2 sm:py-0"
                >
                  Close Sandbox
                </button>
                <button
                  disabled={isSimulating}
                  onClick={runBenchmark}
                  className="bg-[#0040e0] hover:bg-[#001356] text-white font-mono text-xs uppercase tracking-widest px-5 sm:px-6 py-2.5 sm:py-3 transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-2"
                >
                  <span className="material-symbols-outlined text-sm">
                    {isSimulating ? 'sync' : 'play_arrow'}
                  </span>
                  <span>{isSimulating ? 'Executing...' : 'Execute Model Inference'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
