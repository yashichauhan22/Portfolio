import React from 'react';
import { EXPERIENCES, EDUCATION, TECHNICAL_ARSENAL, PERSONAL_INFO } from '../data/portfolioData';

interface AboutExperienceProps {
  onOpenContact: () => void;
}

export const AboutExperience: React.FC<AboutExperienceProps> = ({ onOpenContact }) => {
  return (
    <div className="w-full pb-20">
      {/* Hero Section (Exact Match to Screen 3 Style) */}
      <section className="mb-16 md:mb-24 pt-6 md:pt-10">
        <span className="font-mono text-xs uppercase tracking-widest text-[#0040e0] font-semibold block mb-3">
          PROFILE & BACKGROUND
        </span>
        <h1 className="font-['Inter'] text-4xl sm:text-6xl md:text-7xl font-bold text-[#1a1c1b] leading-[1.05] tracking-tight mb-8">
          Architecting intelligence. <br /> Engineering impact.
        </h1>
        <p className="font-['Inter'] text-lg sm:text-xl md:text-2xl text-[#434656] max-w-3xl leading-relaxed">
          I am an AI/ML Engineer and Computer Science undergraduate specializing in Retrieval-Augmented Generation (RAG), Explainable Deep Learning, and Computer Vision. I build modular systems that transform unstructured data into explainable, production-ready AI solutions.
        </p>

        <div className="mt-8 flex flex-wrap gap-4 font-mono text-xs text-[#747688]">
          <span className="bg-[#e8e8e6] px-3 py-1.5 text-[#1a1c1b] font-medium">
            LOCATION: {PERSONAL_INFO.location.toUpperCase()}
          </span>
          <span className="bg-[#e8e8e6] px-3 py-1.5 text-[#1a1c1b] font-medium">
            STATUS: FINAL YEAR B.TECH CSE (2022 — 2026)
          </span>
          <span className="bg-[#e8e8e6] px-3 py-1.5 text-[#0040e0] font-medium">
            CGPA: 8.61 / 10
          </span>
        </div>
      </section>

      {/* Education Section */}
      <section className="mb-20 md:mb-28">
        <h2 className="font-mono text-xs uppercase tracking-widest text-[#747688] mb-8 border-b border-[#c4c5d9]/60 pb-4 font-semibold flex justify-between items-center">
          <span>01 / Education</span>
          <span>ACADEMIC BACKGROUND</span>
        </h2>

        <div className="space-y-8">
          {EDUCATION.map((edu, idx) => (
            <div
              key={idx}
              className="border border-[#c4c5d9] p-6 sm:p-8 bg-[#f9f9f7] hover:border-[#0040e0] transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-3">
                <h3 className="font-['Inter'] text-2xl sm:text-3xl font-bold text-[#1a1c1b]">
                  {edu.institution}
                </h3>
                <span className="font-mono text-xs text-[#747688]">{edu.period}</span>
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className="font-['Inter'] text-lg font-semibold text-[#0040e0]">
                  {edu.degree}
                </span>
                <span className="font-mono text-xs bg-[#e8e8e6] text-[#1a1c1b] px-3 py-1 font-bold">
                  {edu.grade}
                </span>
                <span className="font-mono text-xs text-[#747688]">{edu.location}</span>
              </div>

              {edu.highlights && (
                <ul className="space-y-2 mt-4 pt-4 border-t border-[#c4c5d9]/40 font-['Inter'] text-sm sm:text-base text-[#434656]">
                  {edu.highlights.map((h, hIdx) => (
                    <li key={hIdx} className="flex items-start space-x-2">
                      <span className="font-mono text-[#0040e0] mr-1">▸</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Experience Timeline Section (Exact Match to Screen 3 Style) */}
      <section className="mb-24 md:mb-32">
        <h2 className="font-mono text-xs uppercase tracking-widest text-[#747688] mb-12 border-b border-[#c4c5d9]/60 pb-4 font-semibold flex justify-between items-center">
          <span>02 / Experience</span>
          <span>INDUSTRY INTERNSHIP</span>
        </h2>

        <div className="space-y-16 sm:space-y-20">
          {EXPERIENCES.map((exp, idx) => (
            <article key={idx} className="relative pl-6 sm:pl-8 border-l border-[#c4c5d9] group">
              {/* Dot on timeline */}
              <div
                className={`absolute w-3 h-3 rounded-full -left-[6.5px] top-1.5 transition-all duration-300 ${
                  exp.isActive
                    ? 'bg-[#0040e0] group-hover:scale-150 group-hover:bg-[#001356]'
                    : 'bg-[#e2e3e1] border border-[#747688] group-hover:bg-[#0040e0] group-hover:border-[#0040e0]'
                }`}
              />

              <div className="mb-6">
                <span className="font-mono text-xs text-[#5e5e5e] mb-2 block font-medium">
                  {exp.period}
                </span>
                <h3 className="font-['Inter'] text-2xl sm:text-3xl font-bold text-[#1a1c1b]">
                  {exp.role}
                </h3>
                <p
                  className={`font-['Inter'] text-lg sm:text-xl mt-1 font-semibold ${
                    exp.isActive ? 'text-[#0040e0]' : 'text-[#434656]'
                  }`}
                >
                  {exp.company}
                </p>
                {exp.location && (
                  <span className="font-mono text-xs text-[#747688] block mt-1">{exp.location}</span>
                )}
              </div>

              <div className="space-y-6 max-w-3xl">
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-widest text-[#434656] mb-2 font-semibold">
                    What I Built & Automated
                  </h4>
                  <p className="font-['Inter'] text-base sm:text-lg text-[#434656] leading-relaxed">
                    {exp.whatIBuilt}
                  </p>
                </div>

                <div>
                  <h4 className="font-mono text-xs uppercase tracking-widest text-[#434656] mb-2 font-semibold">
                    Engineering Impact & Data Governance
                  </h4>
                  <p className="font-['Inter'] text-base sm:text-lg text-[#434656] leading-relaxed">
                    {exp.engineeringImpact}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {exp.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="font-mono text-[11px] bg-[#e8e8e6] text-[#1a1c1b] px-2.5 py-1 font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Technical Arsenal Grid (Exact Match to Screen 3) */}
      <section className="mb-16">
        <h2 className="font-mono text-xs uppercase tracking-widest text-[#747688] mb-12 border-b border-[#c4c5d9]/60 pb-4 font-semibold flex justify-between items-center">
          <span>03 / Technical Arsenal</span>
          <span>CORE SKILLS & TECHNOLOGIES</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TECHNICAL_ARSENAL.map((category, idx) => (
            <div
              key={idx}
              className="border border-[#c4c5d9] p-6 sm:p-7 bg-[#f9f9f7] hover:border-[#0040e0] transition-colors flex flex-col justify-between"
            >
              <div>
                <h3 className="font-['Inter'] text-2xl font-bold text-[#1a1c1b] mb-6 border-b border-[#c4c5d9] pb-2 inline-block">
                  {category.title}
                </h3>
                <ul className="font-['Inter'] text-base sm:text-lg text-[#434656] space-y-3.5">
                  {category.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="leading-snug flex items-start">
                      <span className="text-[#0040e0] font-mono mr-2 text-sm">/</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-[#c4c5d9]/30 font-mono text-[11px] text-[#747688]">
                <span>CATEGORY 0{idx + 1}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture Principles / Philosophy */}
      <section className="p-8 bg-[#f4f4f2] border border-[#c4c5d9] mb-12">
        <span className="font-mono text-xs uppercase tracking-widest text-[#0040e0] font-semibold block mb-2">
          ENGINEERING ETHOS
        </span>
        <h3 className="font-['Inter'] text-2xl sm:text-3xl font-bold text-[#1a1c1b] mb-4">
          Transparent models. Verifiable predictions. High-throughput pipelines.
        </h3>
        <p className="font-['Inter'] text-base text-[#434656] max-w-3xl leading-relaxed mb-6">
          Whether constructing low-latency RAG vector indexes with Sentence Transformers or deploying 36-class gesture recognition models with Grad-CAM and SHAP interpretability, I focus on building verifiable AI pipelines that deliver deterministic, reliable performance in production.
        </p>
        <button
          onClick={onOpenContact}
          className="bg-[#121212] hover:bg-[#0040e0] text-white font-mono text-xs uppercase tracking-widest px-6 py-3 transition-colors cursor-pointer inline-flex items-center space-x-2"
        >
          <span>Connect with Yashi Chauhan</span>
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </section>
    </div>
  );
};
