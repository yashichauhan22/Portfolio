import React from 'react';

interface HeroSectionProps {
  onViewProjects: () => void;
  onGetInTouch: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onViewProjects,
  onGetInTouch,
}) => {
  return (
    <section className="max-w-full flex flex-col justify-center min-h-[500px] md:min-h-[600px] relative">
      {/* Eyebrow / Role Indicator */}
      <div className="flex items-center space-x-2.5 mb-5 sm:mb-6 hero-animation">
        <span className="inline-block w-2 h-2 rounded-full bg-[#0040e0]"></span>
        <span className="font-mono text-xs uppercase tracking-widest text-[#0040e0] font-bold">
          YASHI CHAUHAN // AI/ML & SYSTEMS ENGINEER
        </span>
        <span className="hidden sm:inline-block text-[#c4c5d9]">/</span>
        <span className="hidden sm:inline-block font-mono text-[11px] text-[#747688] uppercase tracking-wider">
          GRAPHIC ERA • B.TECH CSE (AI/ML)
        </span>
      </div>

      {/* Main Headline */}
      <h1 className="font-['Inter'] text-[36px] sm:text-[56px] md:text-[76px] lg:text-[92px] xl:text-[98px] font-bold text-[#1a1c1b] leading-[1.05] tracking-[-0.035em] hero-animation max-w-5xl text-left">
        Engineering intelligent RAG systems & deep learning architectures.
      </h1>

      {/* Subtitle with accent line */}
      <div className="mt-6 sm:mt-8 hero-animation delay-100">
        <div className="w-12 sm:w-16 h-[2px] bg-[#0040e0] mb-4 sm:mb-6"></div>
        <p className="font-['Inter'] text-base sm:text-xl md:text-2xl text-[#434656] max-w-2xl text-left leading-relaxed font-normal">
          Specializing in Enterprise RAG pipelines, Explainable AI (Grad-CAM & SHAP), Computer Vision, and high-efficiency data governance at DSCI.
        </p>
      </div>

      {/* CTA Buttons */}
      <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-5 hero-animation delay-200 w-full sm:w-auto">
        <button
          onClick={onViewProjects}
          className="bg-[#121212] hover:bg-[#0040e0] text-white font-mono text-xs uppercase tracking-widest px-8 py-3.5 sm:py-4 text-center transition-colors duration-300 rounded-none w-full sm:w-auto cursor-pointer focus:ring-2 focus:ring-[#0040e0] min-h-[44px] flex items-center justify-center space-x-2 font-bold shadow-xs"
        >
          <span>Explore Case Studies</span>
          <span className="material-symbols-outlined text-sm">arrow_downward</span>
        </button>
        <button
          onClick={onGetInTouch}
          className="text-[#1a1c1b] font-mono text-xs uppercase tracking-widest px-8 py-3.5 sm:py-4 text-center border border-[#c4c5d9] bg-[#f4f4f2] hover:border-[#0040e0] hover:text-[#0040e0] hover:bg-white transition-all w-full sm:w-auto flex items-center justify-center space-x-2 group cursor-pointer min-h-[44px] font-semibold"
        >
          <span>Get in touch</span>
          <span className="material-symbols-outlined text-sm transform group-hover:translate-x-1.5 transition-transform">
            arrow_forward
          </span>
        </button>
      </div>

      {/* Engineering Systems Status Ticker */}
      <div className="mt-10 sm:mt-14 pt-5 sm:pt-6 border-t border-[#c4c5d9]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-[11px] sm:text-xs text-[#747688]">
        <div className="flex items-center space-x-2.5">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-[#1a1c1b] font-bold">LIVE STATUS: AVAILABLE FOR 2026 AI/ML ROLES</span>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="bg-[#e8e8e6] px-2 py-0.5 text-[#1a1c1b] font-medium">ISLRTC ACCURACY: 99.83%</span>
          <span className="hidden sm:inline text-[#c4c5d9]">•</span>
          <span className="bg-[#e8e8e6] px-2 py-0.5 text-[#1a1c1b] font-medium">DSCI AI/ML INTERN</span>
          <span className="hidden sm:inline text-[#c4c5d9]">•</span>
          <span className="text-[#0040e0] font-bold">8.61 CGPA</span>
        </div>
      </div>
    </section>
  );
};
