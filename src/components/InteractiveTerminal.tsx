import React, { useState, useEffect, useRef } from 'react';
import { PROJECTS, EXPERIENCES, EDUCATION, PERSONAL_INFO } from '../data/portfolioData';
import { Project } from '../types';

interface InteractiveTerminalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject: (project: Project) => void;
  onOpenContact: () => void;
  projects?: Project[];
  onAddProject?: () => void;
  onOpenGitHubSettings?: () => void;
}

interface CommandHistory {
  command: string;
  output: React.ReactNode;
}

export const InteractiveTerminal: React.FC<InteractiveTerminalProps> = ({
  isOpen,
  onClose,
  onSelectProject,
  onOpenContact,
  projects = PROJECTS,
  onAddProject,
  onOpenGitHubSettings,
}) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CommandHistory[]>([
    {
      command: 'sys.init --verbose',
      output: (
        <div className="space-y-1 text-emerald-400">
          <div>[KERNEL LOADED] Yashi Chauhan (AI/ML Portfolio Terminal v2.6)</div>
          <div>B.Tech CSE @ Graphic Era University | DSCI AI/ML Intern</div>
          <div>Type <span className="text-[#b8c3ff] font-bold">help</span> to list commands or <span className="text-[#b8c3ff] font-bold">projects</span> to inspect models & case studies.</div>
        </div>
      ),
    },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  if (!isOpen) return null;

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    let response: React.ReactNode = null;

    switch (cmd) {
      case 'help':
        response = (
          <div className="space-y-1 text-[#dde1ff]">
            <div>AVAILABLE COMMANDS:</div>
            <div>  <span className="text-white font-bold">projects</span>    - List all AI/ML projects and GitHub sync status</div>
            <div>  <span className="text-white font-bold">add</span>         - Open project creator modal to add a new project</div>
            <div>  <span className="text-white font-bold">github</span>      - Configure GitHub token & real-time sync</div>
            <div>  <span className="text-white font-bold">case &lt;n&gt;</span>     - Inspect specific case study by number (e.g. case 1)</div>
            <div>  <span className="text-white font-bold">exp</span>         - Display DSCI internship & work experience</div>
            <div>  <span className="text-white font-bold">edu</span>         - Show university degree & CGPA</div>
            <div>  <span className="text-white font-bold">skills</span>      - Show languages, frameworks & ML concepts</div>
            <div>  <span className="text-white font-bold">contact</span>     - Open transmission & direct message dialog</div>
            <div>  <span className="text-white font-bold">clear</span>       - Clear terminal buffer</div>
            <div>  <span className="text-white font-bold">exit</span>        - Close terminal shell</div>
          </div>
        );
        break;

      case 'add':
      case 'new':
      case 'create':
        if (onAddProject) {
          onAddProject();
          response = <div className="text-emerald-400">Opening Project Creator with GitHub synchronization...</div>;
          setTimeout(onClose, 300);
        }
        break;

      case 'github':
      case 'sync':
        if (onOpenGitHubSettings) {
          onOpenGitHubSettings();
          response = <div className="text-emerald-400">Opening GitHub Integration Settings...</div>;
          setTimeout(onClose, 300);
        }
        break;

      case 'projects':
        response = (
          <div className="space-y-2 text-[#dde1ff]">
            <div className="flex justify-between items-center text-xs border-b border-[#434656] pb-1">
              <span>PORTFOLIO CASE STUDIES ({projects.length} RECORDS):</span>
              {onAddProject && (
                <button
                  onClick={() => {
                    onAddProject();
                    onClose();
                  }}
                  className="text-emerald-400 hover:underline cursor-pointer"
                >
                  [+ ADD PROJECT]
                </button>
              )}
            </div>
            {projects.map((p) => (
              <div key={p.id} className="flex justify-between items-center text-xs">
                <span>
                  [{p.number}] {p.title} {p.githubRepo ? '• [GH: ' + p.githubRepo + ']' : ''}
                </span>
                <button
                  onClick={() => {
                    onSelectProject(p);
                    onClose();
                  }}
                  className="text-emerald-400 hover:underline cursor-pointer"
                >
                  [INSPECT]
                </button>
              </div>
            ))}
          </div>
        );
        break;

      case 'case 1':
      case 'case 01':
      case 'rag':
        onSelectProject(PROJECTS[0]);
        response = <div className="text-emerald-400">Loading Case Study 01: Enterprise RAG Assistant...</div>;
        setTimeout(onClose, 400);
        break;

      case 'case 2':
      case 'case 02':
      case 'xai':
      case 'isl':
        onSelectProject(PROJECTS[1]);
        response = <div className="text-emerald-400">Loading Case Study 02: XAI Indian Sign Language Recognition (99.83% Acc)...</div>;
        setTimeout(onClose, 400);
        break;

      case 'case 3':
      case 'case 03':
      case 'ser':
      case 'audio':
        onSelectProject(PROJECTS[2]);
        response = <div className="text-emerald-400">Loading Case Study 03: Speech Emotion Recognition...</div>;
        setTimeout(onClose, 400);
        break;

      case 'exp':
      case 'experience':
        response = (
          <div className="space-y-2 text-[#dde1ff]">
            <div>EXPERIENCE TIMELINE:</div>
            {EXPERIENCES.map((exp, i) => (
              <div key={i} className="text-xs">
                <span className="text-emerald-400">[{exp.period}]</span> {exp.role} @ {exp.company} ({exp.location})
                <div className="text-[#a0a4c0] mt-0.5">{exp.whatIBuilt}</div>
              </div>
            ))}
          </div>
        );
        break;

      case 'edu':
      case 'education':
        response = (
          <div className="space-y-1 text-xs text-[#dde1ff]">
            {EDUCATION.map((edu, i) => (
              <div key={i} className="space-y-0.5">
                <div className="text-emerald-400 font-bold">{edu.institution} ({edu.period})</div>
                <div>{edu.degree} — <span className="text-[#b8c3ff] font-bold">{edu.grade}</span></div>
                <div className="text-[#888ba0]">{edu.location}</div>
              </div>
            ))}
          </div>
        );
        break;

      case 'skills':
        response = (
          <div className="space-y-1 text-xs text-[#dde1ff]">
            <div><span className="text-emerald-400 font-bold">LANGUAGES:</span> Python, C, C++, SQL, JavaScript, HTML, CSS</div>
            <div><span className="text-emerald-400 font-bold">TECHNOLOGIES:</span> FastAPI, PyTorch, Keras, scikit-learn, LangChain, Hugging Face, ChromaDB, Ollama, n8n</div>
            <div><span className="text-emerald-400 font-bold">CONCEPTS:</span> RAG, Vector DBs, CNN, RNN, LSTM, NLP, MFCC, Explainable AI (Grad-CAM, SHAP, LIME), Prompt Engineering</div>
            <div><span className="text-emerald-400 font-bold">DEV TOOLS & OS:</span> VS Code, Git, GitHub, Jupyter Notebook, Google Colab, Linux, Windows</div>
          </div>
        );
        break;

      case 'contact':
        response = <div className="text-emerald-400">Launching contact interface for {PERSONAL_INFO.email}...</div>;
        onOpenContact();
        onClose();
        break;

      case 'clear':
        setHistory([]);
        setInput('');
        return;

      case 'exit':
      case 'quit':
        onClose();
        return;

      default:
        response = (
          <div className="text-rose-400">
            command not found: {cmd}. Type &apos;help&apos; for list of commands.
          </div>
        );
        break;
    }

    setHistory((prev) => [...prev, { command: input, output: response }]);
    setInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-[#121212] text-white w-full max-w-2xl border border-[#434656] shadow-2xl overflow-hidden font-mono">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#2f3130] bg-[#1a1c1b]">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs text-[#747688] ml-2">YASHI_CHAUHAN // AI/ML Shell (v2.6)</span>
          </div>
          <button onClick={onClose} className="text-[#747688] hover:text-white transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        {/* Console logs */}
        <div className="p-4 max-h-[50vh] overflow-y-auto space-y-3 text-xs">
          {history.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center space-x-2 text-[#747688]">
                <span className="text-[#0040e0] font-bold">yashi@aiml-node:~$</span>
                <span className="text-white">{item.command}</span>
              </div>
              <div className="pl-4">{item.output}</div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>

        {/* Input prompt */}
        <form onSubmit={handleCommand} className="flex items-center px-4 py-3 border-t border-[#2f3130] bg-[#181919]">
          <span className="text-[#0040e0] font-bold mr-2 text-xs">yashi@aiml-node:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type 'help', 'projects', 'exp', or 'skills'..."
            className="flex-1 bg-transparent border-none text-xs text-white focus:outline-none placeholder-[#545555]"
          />
          <button type="submit" className="text-xs text-[#b8c3ff] hover:text-white uppercase font-bold cursor-pointer">
            Exec
          </button>
        </form>
      </div>
    </div>
  );
};
