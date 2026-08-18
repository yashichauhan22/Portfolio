import React, { useState, useMemo } from 'react';
import { Project } from '../types';

interface FeaturedProjectsProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onAddProject: () => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (project: Project) => void;
}

export const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({
  projects,
  onSelectProject,
  onAddProject,
  onEditProject,
  onDeleteProject,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Architectures' },
    { id: 'rag', label: 'RAG & LLM Systems' },
    { id: 'cv', label: 'Computer Vision & XAI' },
    { id: 'audio', label: 'Audio & NLP' },
  ];

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'all') return projects;
    if (activeCategory === 'rag') {
      return projects.filter(
        (p) =>
          p.techStack.some((t) => /RAG|LangChain|Ollama|Chroma|FastAPI|Transformer/i.test(t)) ||
          p.title.toLowerCase().includes('rag')
      );
    }
    if (activeCategory === 'cv') {
      return projects.filter(
        (p) =>
          p.techStack.some((t) => /ResNet|Grad-CAM|LIME|SHAP|Vision|OpenCV|PyTorch/i.test(t)) ||
          p.title.toLowerCase().includes('sign')
      );
    }
    if (activeCategory === 'audio') {
      return projects.filter(
        (p) =>
          p.techStack.some((t) => /Librosa|LSTM|Audio|Speech|NLP/i.test(t)) ||
          p.title.toLowerCase().includes('emotion')
      );
    }
    return projects;
  }, [projects, activeCategory]);

  const featured = projects[0] || null;
  const otherProjects = filteredProjects.filter((p) => p.id !== featured?.id || activeCategory !== 'all');

  if (!featured) {
    return (
      <section className="w-full mb-24 md:mb-36 text-center py-16 bg-[#eeeeec] border border-[#c4c5d9]" id="projects">
        <h3 className="font-['Inter'] text-2xl font-bold text-[#1a1c1b] mb-3">No Projects in Portfolio</h3>
        <p className="text-sm text-[#5e5e5e] mb-6">Add a project to showcase your AI/ML work and sync with your GitHub repositories.</p>
        <button
          onClick={onAddProject}
          className="bg-[#0040e0] text-white font-mono text-xs uppercase tracking-widest px-6 py-3 hover:bg-[#001356] transition-colors cursor-pointer"
        >
          + Add First Project
        </button>
      </section>
    );
  }

  return (
    <section className="w-full mb-16 sm:mb-24 md:mb-36" id="projects">
      {/* Category Filter Pills & Record Counter */}
      <div className="mb-10 sm:mb-14 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#c4c5d9]/60 pb-5">
        <div className="flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto pb-2 md:pb-0 touch-pan-x">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`font-mono text-xs uppercase tracking-wider px-3 sm:px-3.5 py-1.5 transition-all cursor-pointer whitespace-nowrap min-h-[36px] ${
                activeCategory === cat.id
                  ? 'bg-[#121212] text-white font-bold shadow-xs'
                  : 'bg-[#e8e8e6] text-[#5e5e5e] hover:text-[#1a1c1b] hover:bg-[#c4c5d9]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono text-[#747688] self-start md:self-auto">
          <span className="bg-[#e8e8e6] px-2.5 py-1 text-[#1a1c1b] font-medium">
            {filteredProjects.length.toString().padStart(2, '0')} MATCHED CASE STUDIES
          </span>
          <button
            onClick={onAddProject}
            className="text-[#0040e0] hover:text-[#001356] font-bold uppercase tracking-wider flex items-center space-x-1 cursor-pointer py-1"
          >
            <span>+ Add Project</span>
          </button>
        </div>
      </div>

      {/* Primary Featured Project (Shown when 'all' is selected) */}
      {activeCategory === 'all' && (
        <div className="mb-14 sm:mb-20">
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <span className="font-mono text-xs uppercase tracking-widest text-[#0040e0] font-bold block">
                  Featured Architecture // CASE {featured.number}
                </span>
                {featured.githubRepo && (
                  <span className="font-mono text-[10px] text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 uppercase tracking-wider flex items-center space-x-1 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                    <span>GitHub Synced</span>
                  </span>
                )}
              </div>
              <h2 className="font-['Inter'] text-2xl sm:text-4xl md:text-5xl font-bold text-[#1a1c1b] tracking-tight">
                {featured.title}
              </h2>
            </div>

            <div className="flex items-center space-x-2 self-start sm:self-auto">
              {/* Quick Edit & Delete Actions */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditProject(featured);
                }}
                title="Edit Project & Sync to GitHub"
                className="bg-[#eeeeec] hover:bg-[#121212] hover:text-white text-[#1a1c1b] px-3 py-1.5 border border-[#c4c5d9] transition-colors cursor-pointer flex items-center space-x-1.5 font-mono text-xs min-h-[36px]"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
                <span>Edit</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteProject(featured);
                }}
                title="Delete from Portfolio (GitHub Account remains 100% safe)"
                className="bg-[#eeeeec] hover:bg-rose-600 hover:text-white text-rose-700 px-3 py-1.5 border border-[#c4c5d9] transition-colors cursor-pointer flex items-center space-x-1.5 font-mono text-xs min-h-[36px]"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
                <span>Delete</span>
              </button>
              <span className="font-mono text-sm md:text-base text-[#747688] font-bold ml-2">{featured.number}</span>
            </div>
          </div>

          {/* Project Image Container with Grayscale to Color Hover */}
          <div
            onClick={() => onSelectProject(featured)}
            className="block w-full project-img-container group cursor-pointer relative overflow-hidden bg-[#e2e3e1] border border-[#c4c5d9]/60 shadow-xs"
          >
            <img
              alt={featured.imageAlt}
              className="w-full h-60 sm:h-80 md:h-[440px] object-cover project-img-filter group-hover:scale-[1.02] transition-transform duration-700 ease-in-out"
              src={featured.image}
            />
            {/* Hover Overlay Icon */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[#121212]/30 backdrop-blur-xs">
              <div className="bg-[#0040e0] text-white px-5 py-3 shadow-xl transform group-hover:scale-105 transition-transform font-mono text-xs uppercase tracking-widest flex items-center space-x-2">
                <span>Inspect System Architecture</span>
                <span className="material-symbols-outlined text-sm">north_east</span>
              </div>
            </div>
          </div>

          {/* Project Description & Specs */}
          <div className="mt-6 sm:mt-8 flex flex-col space-y-5 sm:space-y-6">
            <p className="font-['Inter'] text-base sm:text-xl text-[#434656] border-l-[3px] border-[#0040e0] pl-4 sm:pl-5 leading-relaxed">
              {featured.description}
            </p>

            {/* Quick Metrics Bar on Featured Card */}
            {featured.metrics && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#eeeeec] p-4 border border-[#c4c5d9]/60">
                {featured.metrics.map((m, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <span className="font-mono text-[10px] text-[#747688] uppercase block tracking-wider">
                      {m.label}
                    </span>
                    <span className="font-mono text-sm sm:text-base font-bold text-[#1a1c1b] block">
                      {m.value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-5 sm:pt-6 border-t border-[#c4c5d9]/40">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                {featured.techStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="font-mono text-[11px] sm:text-xs text-[#1a1c1b] bg-[#e8e8e6] border border-[#c4c5d9]/40 px-2.5 py-1 uppercase tracking-wider font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex items-center space-x-3 self-start sm:self-auto">
                {featured.githubUrl && (
                  <a
                    href={featured.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="font-mono text-xs uppercase tracking-widest text-[#1a1c1b] hover:text-[#0040e0] flex items-center space-x-1.5 border border-[#c4c5d9] px-3 py-1.5 bg-[#f4f4f2] min-h-[36px]"
                  >
                    <span className="material-symbols-outlined text-sm">code</span>
                    <span>GitHub</span>
                  </a>
                )}
                <button
                  onClick={() => onSelectProject(featured)}
                  className="font-mono text-xs uppercase tracking-widest text-[#0040e0] hover:text-[#001356] font-bold transition-colors flex items-center space-x-1.5 group cursor-pointer py-1.5 min-h-[36px]"
                >
                  <span>View Case Study</span>
                  <span className="material-symbols-outlined text-base transform group-hover:translate-x-1 transition-transform">
                    arrow_right_alt
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Additional System Case Studies Grid */}
      <div className={activeCategory === 'all' ? 'pt-10 sm:pt-12 border-t border-[#c4c5d9]/50' : ''}>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 sm:mb-10 gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#747688] block mb-1 font-semibold">
              INDEX // {activeCategory.toUpperCase()} ARCHITECTURES
            </span>
            <h3 className="font-['Inter'] text-2xl sm:text-3xl font-bold text-[#1a1c1b]">
              {activeCategory === 'all' ? 'Selected System Case Studies' : 'Matching Technical Projects'}
            </h3>
          </div>
          <div className="flex items-center space-x-3 self-start sm:self-auto">
            <button
              onClick={onAddProject}
              className="bg-[#121212] hover:bg-[#0040e0] text-white font-mono text-xs uppercase tracking-wider px-3.5 py-2 transition-colors cursor-pointer flex items-center space-x-1.5 min-h-[38px]"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              <span>Add Project</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {otherProjects.map((project) => (
            <article
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="border border-[#c4c5d9] p-6 sm:p-8 bg-[#f9f9f7] hover:border-[#0040e0] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between h-full relative"
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs text-[#0040e0] font-bold tracking-wider">
                      CASE STUDY {project.number}
                    </span>
                    {project.githubRepo && (
                      <span className="font-mono text-[9px] text-emerald-800 bg-emerald-100 border border-emerald-300 px-1.5 py-0.2 uppercase font-bold">
                        GitHub Synced
                      </span>
                    )}
                  </div>

                  {/* Card Controls */}
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditProject(project);
                      }}
                      title="Edit project"
                      className="text-[#747688] hover:text-[#0040e0] p-1 cursor-pointer transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">edit</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteProject(project);
                      }}
                      title="Delete from Portfolio (GitHub safe)"
                      className="text-[#747688] hover:text-rose-600 p-1 cursor-pointer transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                    <span className="font-mono text-xs text-[#747688] font-medium ml-1">{project.timeline}</span>
                  </div>
                </div>

                <div className="relative overflow-hidden mb-6 bg-[#eeeeec] h-52 sm:h-60 border border-[#c4c5d9]/40">
                  <img
                    src={project.image}
                    alt={project.imageAlt}
                    className="w-full h-full object-cover custom-filter group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-[#121212] text-white p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-sm">arrow_outward</span>
                  </div>
                  {project.metrics && project.metrics[0] && (
                    <div className="absolute bottom-2 left-2 bg-[#121212]/90 backdrop-blur-xs text-white px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider">
                      {project.metrics[0].label}: {project.metrics[0].value}
                    </div>
                  )}
                </div>

                <h4 className="font-['Inter'] text-2xl font-bold text-[#1a1c1b] group-hover:text-[#0040e0] transition-colors mb-2">
                  {project.title}
                </h4>
                <p className="font-['Inter'] text-sm sm:text-base text-[#434656] line-clamp-3 mb-6 leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.techStack.map((tech, i) => (
                    <span key={i} className="font-mono text-[11px] text-[#1a1c1b] bg-[#e8e8e6] px-2 py-0.5 font-medium">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#c4c5d9]/40 font-mono text-xs text-[#1a1c1b]">
                  <span className="text-[#747688] font-medium">ROLE: {project.role}</span>
                  <span className="text-[#0040e0] font-bold group-hover:translate-x-1 transition-transform inline-flex items-center space-x-1">
                    <span>Inspect Study</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </span>
                </div>
              </div>
            </article>
          ))}

          {/* Add Project Card Slot */}
          <div
            onClick={onAddProject}
            className="border-2 border-dashed border-[#c4c5d9] p-8 bg-[#f4f4f2]/60 hover:bg-[#eeeeec] hover:border-[#0040e0] transition-all cursor-pointer flex flex-col items-center justify-center text-center min-h-[340px] group"
          >
            <div className="w-12 h-12 rounded-full bg-white border border-[#c4c5d9] flex items-center justify-center mb-3 group-hover:bg-[#0040e0] group-hover:text-white transition-colors shadow-xs">
              <span className="material-symbols-outlined text-2xl">add</span>
            </div>
            <h4 className="font-['Inter'] font-bold text-lg text-[#1a1c1b] mb-1">
              Add New Case Study
            </h4>
            <p className="font-['Inter'] text-xs text-[#747688] max-w-xs mb-4">
              Add a deep learning, RAG, or systems project with live GitHub repository synchronization.
            </p>
            <span className="font-mono text-xs uppercase tracking-wider text-[#0040e0] font-bold">
              + Launch Project Creator
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
