import React from 'react';
import { Project } from '../types';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  project: Project | null;
  onClose: () => void;
  onConfirmDelete: (projectId: string) => void;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  project,
  onClose,
  onConfirmDelete,
}) => {
  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#f9f9f7] text-[#1a1c1b] w-full max-w-lg border border-[#1a1c1b] shadow-2xl p-6 sm:p-8 relative font-['Inter']">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-rose-100 border border-rose-300 text-rose-700 flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">delete_forever</span>
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-rose-600 font-bold block">
              PORTFOLIO REMOVAL
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[#1a1c1b]">
              Delete Case Study?
            </h3>
          </div>
        </div>

        {/* Target Project Card Summary */}
        <div className="p-4 bg-[#eeeeec] border border-[#c4c5d9] mb-5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-[#0040e0] font-bold">
              CASE {project.number}
            </span>
            <span className="font-mono text-[11px] text-[#747688]">
              {project.timeline}
            </span>
          </div>
          <h4 className="font-bold text-base text-[#1a1c1b] mt-1">{project.title}</h4>
          <p className="text-xs text-[#5e5e5e] line-clamp-2 mt-1">{project.description}</p>
        </div>

        {/* Critical Safety Notice as requested */}
        <div className="p-4 bg-emerald-50 border-l-4 border-emerald-600 mb-6 space-y-1">
          <div className="flex items-center space-x-1.5 text-emerald-800 font-bold text-xs font-mono uppercase tracking-wider">
            <span className="material-symbols-outlined text-base">verified_user</span>
            <span>Zero Impact on Real GitHub Account</span>
          </div>
          <p className="text-xs text-emerald-900 leading-relaxed">
            Deleting this project will <strong className="font-semibold">only remove it from this portfolio display</strong>. Your real GitHub repository, commit history, stars, and account files will remain <strong className="font-semibold">completely unaffected and safe</strong>.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="font-mono text-xs uppercase tracking-widest px-4 py-3 text-[#5e5e5e] hover:text-[#1a1c1b] cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirmDelete(project.id)}
            className="bg-rose-600 hover:bg-rose-700 text-white font-mono text-xs uppercase tracking-widest px-6 py-3 transition-colors cursor-pointer flex items-center space-x-2"
          >
            <span className="material-symbols-outlined text-sm">delete</span>
            <span>Confirm Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
