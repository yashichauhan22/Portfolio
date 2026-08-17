import React from 'react';
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
  const featured = projects[0] || null;
  const otherProjects = projects.slice(1);

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
      {/* Primary Featured Project */}
      <div className="mb-12 sm:mb-16">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="font-mono text-xs uppercase tracking-widest text-[#0040e0] font-semibold block">
                Featured Work // CASE {featured.number}
              </span>
              {featured.githubRepo && (
                <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 uppercase tracking-wider flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
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
              className="bg-[#eeeeec] hover:bg-[#121212] hover:text-white text-[#1a1c1b] px-2.5 py-1.5 border border-[#c4c5d9] transition-colors cursor-pointer flex items-center space-x-1 font-mono text-xs min-h-[36px]"
            >
              <span className="material-symbols-outlined text-sm">edit</span>
              <span className="inline">Edit</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteProject(featured);
              }}
              title="Delete from Portfolio (GitHub Account remains 100% safe)"
              className="bg-[#eeeeec] hover:bg-rose-600 hover:text-white text-rose-700 px-2.5 py-1.5 border border-[#c4c5d9] transition-colors cursor-pointer flex items-center space-x-1 font-mono text-xs min-h-[36px]"
            >
              <span className="material-symbols-outlined text-sm">delete</span>
              <span className="inline">Delete</span>
            </button>
            <span className="font-mono text-sm md:text-base text-[#747688] font-medium ml-2">{featured.number}</span>
          </div>
        </div>

        {/* Project Image Container with Grayscale to Color Hover */}
        <div
          onClick={() => onSelectProject(featured)}
          className="block w-full project-img-container group cursor-pointer relative overflow-hidden bg-[#e2e3e1] border border-[#c4c5d9]/40"
        >
          <img
            alt={featured.imageAlt}
            className="w-full h-56 sm:h-80 md:h-[420px] object-cover project-img-filter group-hover:scale-[1.02] transition-transform duration-700 ease-in-out"
            src={featured.image}
          />
          {/* Hover Overlay Icon */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[#f9f9f7]/20 backdrop-blur-xs">
            <div className="bg-[#0040e0] text-white w-12 sm:w-14 h-12 sm:h-14 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl">north_east</span>
            </div>
          </div>
        </div>

        {/* Project Description & Specs */}
        <div className="mt-6 sm:mt-8 flex flex-col space-y-5 sm:space-y-6">
          <p className="font-['Inter'] text-base sm:text-xl text-[#434656] border-l-[3px] border-[#0040e0] pl-4 sm:pl-5 leading-relaxed">
            {featured.description}
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-5 sm:pt-6 border-t border-[#c4c5d9]/40">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5">
              {featured.techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="font-mono text-[11px] sm:text-xs text-[#747688] bg-[#e8e8e6] px-2.5 py-1 uppercase tracking-wider font-medium"
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
                  className="font-mono text-xs uppercase tracking-widest text-[#1a1c1b] hover:text-[#0040e0] flex items-center space-x-1 border border-[#c4c5d9] px-2.5 py-1.5 bg-[#f4f4f2] min-h-[36px]"
                >
                  <span className="material-symbols-outlined text-sm">code</span>
                  <span>GitHub</span>
                </a>
              )}
              <button
                onClick={() => onSelectProject(featured)}
                className="font-mono text-xs uppercase tracking-widest text-[#0040e0] hover:text-[#001356] font-semibold transition-colors flex items-center space-x-1.5 group cursor-pointer py-1.5 min-h-[36px]"
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

      {/* Additional System Case Studies Grid */}
      <div className="pt-10 sm:pt-12 border-t border-[#c4c5d9]/50">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 sm:mb-10 gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#747688] block mb-1">
              ARCHIVE INDEX
            </span>
            <h3 className="font-['Inter'] text-2xl sm:text-3xl font-bold text-[#1a1c1b]">
              Selected System Case Studies
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
            <span className="font-mono text-xs text-[#747688] bg-[#e8e8e6] px-2.5 py-1.5 font-medium">
              {projects.length.toString().padStart(2, '0')} RECORDS
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {otherProjects.map((project) => (
            <article
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="border border-[#c4c5d9]/60 p-6 sm:p-8 bg-[#f9f9f7] hover:border-[#0040e0] transition-all cursor-pointer group flex flex-col justify-between h-full relative"
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs text-[#0040e0] font-semibold tracking-wider">
                      CASE STUDY {project.number}
                    </span>
                    {project.githubRepo && (
                      <span className="font-mono text-[9px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 uppercase">
                        GitHub
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
                    <span className="font-mono text-xs text-[#747688] ml-1">{project.timeline}</span>
                  </div>
                </div>

                <div className="relative overflow-hidden mb-6 bg-[#eeeeec] h-48 sm:h-56">
                  <img
                    src={project.image}
                    alt={project.imageAlt}
                    className="w-full h-full object-cover custom-filter group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-[#121212] text-white p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-sm">arrow_outward</span>
                  </div>
                </div>

                <h4 className="font-['Inter'] text-2xl font-bold text-[#1a1c1b] group-hover:text-[#0040e0] transition-colors mb-2">
                  {project.title}
                </h4>
                <p className="font-['Inter'] text-sm sm:text-base text-[#434656] line-clamp-3 mb-6">
                  {project.description}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.techStack.map((tech, i) => (
                    <span key={i} className="font-mono text-[11px] text-[#5e5e5e] bg-[#e8e8e6] px-2 py-0.5">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#c4c5d9]/30 font-mono text-xs text-[#1a1c1b]">
                  <span className="text-[#747688]">ROLE: {project.role}</span>
                  <span className="text-[#0040e0] group-hover:translate-x-1 transition-transform inline-flex items-center">
                    Read Study →
                  </span>
                </div>
              </div>
            </article>
          ))}

          {/* Add Project Card Slot */}
          <div
            onClick={onAddProject}
            className="border-2 border-dashed border-[#c4c5d9] p-8 bg-[#f4f4f2]/60 hover:bg-[#eeeeec] hover:border-[#0040e0] transition-all cursor-pointer flex flex-col items-center justify-center text-center min-h-[320px] group"
          >
            <div className="w-12 h-12 rounded-full bg-white border border-[#c4c5d9] flex items-center justify-center mb-3 group-hover:bg-[#0040e0] group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-2xl">add</span>
            </div>
            <h4 className="font-['Inter'] font-bold text-lg text-[#1a1c1b] mb-1">
              Add New Case Study
            </h4>
            <p className="font-['Inter'] text-xs text-[#747688] max-w-xs mb-4">
              Add a new deep learning, RAG, or systems project with live GitHub repository synchronization.
            </p>
            <span className="font-mono text-xs uppercase tracking-wider text-[#0040e0] font-semibold">
              + Launch Project Creator
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
