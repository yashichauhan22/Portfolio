import { GitHubConfig, Project } from '../types';

const GITHUB_CONFIG_STORAGE_KEY = 'portfolio_github_config';

export const getStoredGitHubConfig = (): GitHubConfig => {
  try {
    const saved = localStorage.getItem(GITHUB_CONFIG_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error('Error loading GitHub config:', err);
  }
  return {
    token: '',
    username: 'yashichauhan22',
    isConnected: false,
    autoSyncOnSave: true,
  };
};

export const saveGitHubConfig = (config: GitHubConfig) => {
  try {
    localStorage.setItem(GITHUB_CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Error saving GitHub config:', err);
  }
};

export interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  public_repos: number;
  html_url: string;
  bio?: string;
}

export interface GitHubRepoData {
  name: string;
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string;
  topics: string[];
  html_url: string;
  default_branch: string;
  updated_at: string;
  pushed_at: string;
}

/**
 * Verify token and fetch user profile
 */
export const verifyGitHubToken = async (token: string): Promise<GitHubUser> => {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
  };
  if (token.trim()) {
    headers.Authorization = `Bearer ${token.trim()}`;
  }

  const res = await fetch('https://api.github.com/user', { headers });
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('Invalid GitHub Personal Access Token (401 Unauthorized)');
    }
    throw new Error(`GitHub API error: ${res.statusText} (${res.status})`);
  }

  const data = await res.json();
  return {
    login: data.login,
    name: data.name || data.login,
    avatar_url: data.avatar_url,
    public_repos: data.public_repos,
    html_url: data.html_url,
    bio: data.bio,
  };
};

/**
 * Parse owner and repo from URL or string
 */
export const parseGitHubRepo = (urlOrName: string, defaultOwner = 'yashichauhan'): { owner: string; repo: string } => {
  const cleaned = urlOrName.trim().replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '');
  const parts = cleaned.split('/');
  if (parts.length >= 2) {
    return { owner: parts[0], repo: parts[1] };
  }
  return { owner: defaultOwner, repo: parts[0] || '' };
};

/**
 * Fetch repository info from GitHub API
 */
export const fetchGitHubRepo = async (
  owner: string,
  repo: string,
  token?: string
): Promise<GitHubRepoData> => {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
  };
  if (token && token.trim()) {
    headers.Authorization = `Bearer ${token.trim()}`;
  }

  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(`Repository "${owner}/${repo}" not found on GitHub.`);
    }
    throw new Error(`Failed to fetch repo ${owner}/${repo}: ${res.statusText}`);
  }

  const data = await res.json();
  return {
    name: data.name,
    full_name: data.full_name,
    description: data.description || '',
    stargazers_count: data.stargazers_count || 0,
    forks_count: data.forks_count || 0,
    open_issues_count: data.open_issues_count || 0,
    language: data.language || '',
    topics: data.topics || [],
    html_url: data.html_url,
    default_branch: data.default_branch || 'main',
    updated_at: data.updated_at,
    pushed_at: data.pushed_at,
  };
};

/**
 * Update repository description & homepage on GitHub
 */
export const updateGitHubRepoMetadata = async (
  owner: string,
  repo: string,
  token: string,
  updates: {
    description?: string;
    homepage?: string;
    topics?: string[];
  }
): Promise<{ success: boolean; message: string }> => {
  if (!token.trim()) {
    return {
      success: false,
      message: 'GitHub Personal Access Token is required to update repository on GitHub.',
    };
  }

  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
    Authorization: `Bearer ${token.trim()}`,
    'Content-Type': 'application/json',
  };

  try {
    // 1. Update basic repository metadata (description, homepage)
    const patchBody: Record<string, unknown> = {};
    if (updates.description !== undefined) patchBody.description = updates.description;
    if (updates.homepage !== undefined) patchBody.homepage = updates.homepage;

    if (Object.keys(patchBody).length > 0) {
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(patchBody),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update repo (${res.status})`);
      }
    }

    // 2. Update topics/tags if provided
    if (updates.topics && updates.topics.length > 0) {
      // GitHub topics must be lowercase alphanumeric with hyphens, <= 35 chars
      const sanitizedTopics = updates.topics
        .map((t) => t.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/^-+|-+$/g, ''))
        .filter((t) => t.length > 0 && t.length <= 35)
        .slice(0, 20);

      await fetch(`https://api.github.com/repos/${owner}/${repo}/topics`, {
        method: 'PUT',
        headers: {
          ...headers,
          Accept: 'application/vnd.github.mercy-preview+json',
        },
        body: JSON.stringify({ names: sanitizedTopics }),
      });
    }

    return {
      success: true,
      message: `Successfully synchronized updates to GitHub repo ${owner}/${repo}`,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Error communicating with GitHub API',
    };
  }
};

/**
 * Sync project meta file to GitHub repository
 */
export const syncProjectMetaFileToGitHub = async (
  owner: string,
  repo: string,
  token: string,
  project: Project
): Promise<{ success: boolean; message: string }> => {
  if (!token.trim()) {
    return { success: false, message: 'No GitHub token provided.' };
  }

  const filePath = '.portfolio-meta.json';
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
    Authorization: `Bearer ${token.trim()}`,
    'Content-Type': 'application/json',
  };

  try {
    // Check if file already exists to get its SHA
    let existingSha: string | undefined;
    const checkRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
      headers,
    });
    if (checkRes.ok) {
      const fileData = await checkRes.json();
      existingSha = fileData.sha;
    }

    const contentPayload = {
      project_id: project.id,
      title: project.title,
      tagline: project.tagline,
      role: project.role,
      timeline: project.timeline,
      techStack: project.techStack,
      metrics: project.metrics,
      lastSynchronized: new Date().toISOString(),
      synchronizedFrom: 'Yashi Chauhan Portfolio',
    };

    const encodedContent = btoa(unescape(encodeURIComponent(JSON.stringify(contentPayload, null, 2))));

    const commitBody = {
      message: `chore: sync portfolio metadata for "${project.title}"`,
      content: encodedContent,
      sha: existingSha,
    };

    const putRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(commitBody),
    });

    if (!putRes.ok) {
      const err = await putRes.json().catch(() => ({}));
      return { success: false, message: err.message || 'Failed to commit metadata file' };
    }

    return {
      success: true,
      message: `Successfully committed ${filePath} to ${owner}/${repo}`,
    };
  } catch (err: any) {
    return { success: false, message: err.message || 'Error updating metadata file' };
  }
};

/**
 * Create a new repository on GitHub
 */
export const createGitHubRepo = async (
  token: string,
  repoName: string,
  description: string,
  isPrivate = false
): Promise<{ success: boolean; repoUrl?: string; message: string }> => {
  if (!token.trim()) {
    return { success: false, message: 'GitHub Token is required to create a repository.' };
  }

  try {
    const res = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `Bearer ${token.trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: repoName.toLowerCase().replace(/[^a-z0-9-_]/g, '-'),
        description,
        private: isPrivate,
        auto_init: true,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Failed to create repo (${res.status})`);
    }

    return {
      success: true,
      repoUrl: data.html_url,
      message: `Repository "${data.full_name}" created successfully on GitHub!`,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Failed to create repository on GitHub.',
    };
  }
};
