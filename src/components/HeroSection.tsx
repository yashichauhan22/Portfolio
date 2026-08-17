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
    <section className="max-w-full flex flex-col justify-center min-h-[540px] md:min-h-[640px] relative">
      {/* Decorative Blueprint Accent */}
      <div className="absolute right-0 top-0 w-32 h-32 md:w-48 md:h-48 opacity-10 pointer-events-none">
        <svg className="w-full h-full fill-current text-[#0040e0]" viewBox="0 0 100 100">
          <rect fill="currentColor" height="100" width="100"></rect>
        </svg>
      </div>

      {/* Main Headline */}
      <h1 className="font-['Inter'] text-[34px] sm:text-[54px] md:text-[76px] lg:text-[96px] xl:text-[104px] font-bold text-[#1a1c1b] leading-[1.08] sm:leading-[1.04] tracking-[-0.035em] hero-animation max-w-5xl text-left">
        AI/ML Engineer building intelligent RAG systems & deep learning architectures.
      </h1>

      {/* Subtitle with accent line */}
      <div className="mt-6 sm:mt-8 md:mt-10 hero-animation delay-100">
        <div className="w-12 sm:w-16 h-[2px] bg-[#747688] mb-4 sm:mb-6"></div>
        <p className="font-['Inter'] text-base sm:text-xl md:text-2xl text-[#434656] max-w-2xl text-left leading-relaxed">
          Focused on Enterprise RAG, Explainable AI, Computer Vision, and high-efficiency data pipelines.
        </p>
      </div>

      {/* CTA Buttons (Exact match to Screen 1) */}
      <div className="mt-8 sm:mt-10 md:mt-12 flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-6 hero-animation delay-200 w-full sm:w-auto">
        <button
          onClick={onViewProjects}
          className="bg-[#121212] hover:bg-[#0040e0] text-white font-mono text-xs uppercase tracking-widest px-8 py-3.5 sm:py-4 text-center transition-colors duration-300 rounded-none w-full sm:w-auto cursor-pointer focus:ring-2 focus:ring-[#0040e0] min-h-[44px] flex items-center justify-center"
        >
          View Projects
        </button>
        <button
          onClick={onGetInTouch}
          className="text-[#1a1c1b] font-mono text-xs uppercase tracking-widest px-8 py-3.5 sm:py-4 text-center border-b border-[#c4c5d9] hover:border-[#0040e0] hover:text-[#0040e0] transition-all w-full sm:w-auto flex items-center justify-center space-x-2 group cursor-pointer min-h-[44px]"
        >
          <span>Get in touch</span>
          <span className="material-symbols-outlined text-sm transform group-hover:translate-x-1.5 transition-transform">
            arrow_forward
          </span>
        </button>
      </div>

      {/* Engineering Systems Status Ticker */}
      <div className="mt-10 sm:mt-14 pt-5 sm:pt-6 border-t border-[#c4c5d9]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-4 font-mono text-[11px] sm:text-xs text-[#747688]">
        <div className="flex items-center space-x-2">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-[#1a1c1b] font-medium">MODELS DEPLOYED: ISL RESNET18 & RAG</span>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span>ISLRTC ACCURACY: 99.83%</span>
          <span className="hidden sm:inline text-[#c4c5d9]">|</span>
          <span className="hidden xs:inline">DSCI AI/ML INTERN • TECHSAGAR PIPELINES</span>
        </div>
      </div>
    </section>
  );
};
