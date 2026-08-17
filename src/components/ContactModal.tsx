import React, { useState } from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('AI/ML Engineering & RAG Development');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      // simulate receipt
    }, 400);
  };

  const copyToClipboard = (text: string, type: 'email' | 'phone') => {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#f9f9f7] text-[#1a1c1b] w-full max-w-xl border border-[#121212] shadow-2xl p-6 sm:p-10 relative max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-[#747688] hover:text-[#1a1c1b] transition-colors p-1"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        <div className="mb-8">
          <span className="font-mono text-xs uppercase tracking-widest text-[#0040e0] font-semibold block mb-2">
            DIRECT TRANSMISSION
          </span>
          <h2 className="font-['Inter'] text-3xl sm:text-4xl font-bold text-[#1a1c1b] tracking-tight">
            Contact Yashi Chauhan
          </h2>
          <p className="font-['Inter'] text-sm sm:text-base text-[#434656] mt-2">
            Available for AI/ML engineering roles, RAG assistant development, Explainable AI research, and high-impact machine learning projects.
          </p>
        </div>

        {/* Quick Contact Chips */}
        <div className="space-y-3 mb-8">
          {/* Email */}
          <div className="p-3.5 bg-[#eeeeec] border border-[#c4c5d9] flex items-center justify-between">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#747688] block">
                Direct Email
              </span>
              <a
                href={`mailto:${PERSONAL_INFO.email}`}
                className="font-mono text-xs sm:text-sm font-semibold text-[#0040e0] hover:underline"
              >
                {PERSONAL_INFO.email}
              </a>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(PERSONAL_INFO.email, 'email')}
              className="bg-[#121212] hover:bg-[#0040e0] text-white font-mono text-xs uppercase tracking-widest px-3 py-1.5 transition-colors flex items-center space-x-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-xs">
                {copiedEmail ? 'check' : 'content_copy'}
              </span>
              <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Phone */}
          <div className="p-3.5 bg-[#eeeeec] border border-[#c4c5d9] flex items-center justify-between">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#747688] block">
                Direct Phone
              </span>
              <a
                href={`tel:${PERSONAL_INFO.phone}`}
                className="font-mono text-xs sm:text-sm font-semibold text-[#1a1c1b] hover:text-[#0040e0]"
              >
                {PERSONAL_INFO.phone}
              </a>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(PERSONAL_INFO.phone, 'phone')}
              className="bg-[#121212] hover:bg-[#0040e0] text-white font-mono text-xs uppercase tracking-widest px-3 py-1.5 transition-colors flex items-center space-x-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-xs">
                {copiedPhone ? 'check' : 'content_copy'}
              </span>
              <span>{copiedPhone ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {submitted ? (
          <div className="p-6 bg-[#e8e8e6] border-l-4 border-[#0040e0] space-y-3">
            <h3 className="font-['Inter'] font-bold text-lg text-[#1a1c1b]">
              Message Dispatched Successfully
            </h3>
            <p className="font-['Inter'] text-sm text-[#434656]">
              Thank you for reaching out! Yashi will review your message and reply promptly at your provided email.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="bg-[#121212] text-white font-mono text-xs uppercase tracking-widest px-5 py-2.5 mt-2"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="font-mono text-xs uppercase tracking-wider text-[#5e5e5e] block mb-1">
                Your Name / Organization
              </label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Hiring Manager / Research Lead"
                className="w-full bg-transparent border-b border-[#c4c5d9] focus:border-[#0040e0] py-2 text-sm text-[#1a1c1b] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="font-mono text-xs uppercase tracking-wider text-[#5e5e5e] block mb-1">
                Your Email Address
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-transparent border-b border-[#c4c5d9] focus:border-[#0040e0] py-2 text-sm text-[#1a1c1b] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="font-mono text-xs uppercase tracking-wider text-[#5e5e5e] block mb-1">
                Opportunity / Engagement Type
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-transparent border-b border-[#c4c5d9] focus:border-[#0040e0] py-2 text-sm text-[#1a1c1b] focus:outline-none cursor-pointer"
              >
                <option value="AI/ML Engineering & RAG Development">
                  AI/ML Engineering & RAG Development
                </option>
                <option value="Computer Vision / Deep Learning Opportunity">
                  Computer Vision / Deep Learning Opportunity
                </option>
                <option value="Full-Time SDE / AI Engineer Role">
                  Full-Time SDE / AI Engineer Role
                </option>
                <option value="Research & Explainable AI Collaboration">
                  Research & Explainable AI Collaboration
                </option>
                <option value="General Technical Inquiry">General Technical Inquiry</option>
              </select>
            </div>

            <div>
              <label className="font-mono text-xs uppercase tracking-wider text-[#5e5e5e] block mb-1">
                Project Details / Message
              </label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share role details, pipeline specifications, or meeting requests..."
                className="w-full bg-transparent border-b border-[#c4c5d9] focus:border-[#0040e0] py-2 text-sm text-[#1a1c1b] focus:outline-none transition-colors resize-none"
              />
            </div>

            <div className="pt-2 flex justify-between items-center">
              <button
                type="button"
                onClick={onClose}
                className="font-mono text-xs uppercase tracking-widest text-[#747688] hover:text-[#1a1c1b]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#121212] hover:bg-[#0040e0] text-white font-mono text-xs uppercase tracking-widest px-8 py-3.5 text-center transition-colors duration-300 rounded-none cursor-pointer"
              >
                Transmit Message →
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
