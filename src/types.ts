export interface Project {
  id: string;
  number: string;
  title: string;
  tagline: string;
  role: string;
  timeline: string;
  image: string;
  imageAlt: string;
  description: string;
  techStack: string[];
  techStackDetailed: { number: string; name: string; detail: string }[];
  challenge: string;
  outcome: string;
  metrics: {
    label: string;
    value: string;
    change: string;
  }[];
  githubUrl?: string;
  githubRepo?: string; // format: 'owner/repo' or 'repo-name'
  githubSyncEnabled?: boolean;
  githubMetadata?: {
    stars: number;
    forks: number;
    lastUpdated?: string;
    openIssues?: number;
    language?: string;
    topics?: string[];
  };
  demoUrl?: string;
  codeSnippet?: {
    filename: string;
    language: string;
    code: string;
  };
  architectureNodes?: {
    id: string;
    label: string;
    type: 'gateway' | 'service' | 'db' | 'cache' | 'queue';
    status: 'healthy' | 'optimal' | 'syncing';
    tps: string;
    latency: string;
  }[];
}

export interface GitHubConfig {
  token: string;
  username: string;
  isConnected: boolean;
  autoSyncOnSave: boolean;
}

export interface ExperienceItem {
  period: string;
  role: string;
  company: string;
  location?: string;
  whatIBuilt: string;
  engineeringImpact: string;
  skills: string[];
  isActive?: boolean;
}

export interface EducationItem {
  institution: string;
  degree: string;
  period: string;
  location: string;
  grade: string;
  highlights?: string[];
}

export interface ArsenalCategory {
  title: string;
  items: string[];
}

export type ActiveView = 'home' | 'case-study' | 'about-experience' | 'all-projects';
