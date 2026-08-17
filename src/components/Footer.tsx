import React from 'react';
import { SOCIAL_LINKS } from '../data/portfolioData';

interface FooterProps {
  onOpenContact: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenContact }) => {
  return (
    <footer className="bg-[#f9f9f7] w-full mt-24 md:mt-36 border-t border-[#c4c5d9]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-6 md:px-16 py-12 w-full max-w-[1440px] mx-auto gap-8">
        <div>
          <span className="font-['Inter'] text-2xl font-bold text-[#1a1c1b] block mb-2">
            YASHI CHAUHAN
          </span>
          <p className="font-mono text-xs text-[#5e5e5e] max-w-sm uppercase tracking-wider">
            © 2026 YASHI CHAUHAN. B.TECH COMPUTER SCIENCE • GRAPHIC ERA UNIVERSITY.
          </p>
        </div>

        {/* Social Links List (Exact match to screenshots) */}
        <nav className="flex flex-wrap items-center gap-6 sm:gap-10 w-full md:w-auto">
          {SOCIAL_LINKS.map((link, idx) => (
            <a
              key={idx}
              href={link.url}
              onClick={(e) => {
                if (link.label === 'Email') {
                  e.preventDefault();
                  onOpenContact();
                }
              }}
              target={link.label === 'Email' ? undefined : '_blank'}
              rel="noreferrer"
              className="font-mono text-xs text-[#5e5e5e] hover:text-[#0040e0] transition-colors duration-200 underline-offset-4 hover:underline flex items-center space-x-1 group py-1"
            >
              <span>{link.label}</span>
              <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                north_east
              </span>
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
};
