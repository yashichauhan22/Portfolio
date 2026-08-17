import { Project } from '../types';
import { PROJECTS as DEFAULT_PROJECTS } from '../data/portfolioData';

const PROJECTS_STORAGE_KEY = 'yashi_portfolio_projects_v2';

export const getStoredProjects = (): Project[] => {
  try {
    const saved = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error loading projects from storage:', err);
  }
  // Default to initial resume projects
  return DEFAULT_PROJECTS;
};

export const saveProjectsToStorage = (projects: Project[]) => {
  try {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  } catch (err) {
    console.error('Error saving projects to storage:', err);
  }
};

export const resetProjectsToDefault = (): Project[] => {
  try {
    localStorage.removeItem(PROJECTS_STORAGE_KEY);
  } catch (err) {
    console.error('Error resetting projects:', err);
  }
  return DEFAULT_PROJECTS;
};
