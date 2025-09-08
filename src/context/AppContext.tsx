import React, { createContext, useContext, useEffect, useState } from 'react';
import { Project, AppSettings, DashboardStats } from '../types';

interface AppContextType {
  projects: Project[];
  settings: AppSettings;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getProject: (id: string) => Project | undefined;
  updateSettings: (settings: Partial<AppSettings>) => void;
  getDashboardStats: () => DashboardStats;
  exportData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    defaultGstPercentage: 13.8,
    defaultBasePricePerKw: 50000,
  });

  useEffect(() => {
    const savedProjects = localStorage.getItem('solar_projects');
    const savedSettings = localStorage.getItem('solar_settings');
    
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
    
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const addProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): string => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    localStorage.setItem('solar_projects', JSON.stringify(updatedProjects));
    
    return newProject.id;
  };

  const updateProject = (id: string, projectData: Partial<Project>) => {
    const updatedProjects = projects.map(project =>
      project.id === id ? { ...project, ...projectData, updatedAt: new Date().toISOString() } : project
    );
    setProjects(updatedProjects);
    localStorage.setItem('solar_projects', JSON.stringify(updatedProjects));
  };

  const deleteProject = (id: string) => {
    const updatedProjects = projects.filter(project => project.id !== id);
    setProjects(updatedProjects);
    localStorage.setItem('solar_projects', JSON.stringify(updatedProjects));
  };

  const getProject = (id: string): Project | undefined => {
    return projects.find(project => project.id === id);
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('solar_settings', JSON.stringify(updatedSettings));
  };

  const getDashboardStats = (): DashboardStats => {
    const completedProjects = projects.filter(p => p.status === 'completed');
    
    const totalIncome = completedProjects.reduce((sum, project) => 
      sum + project.calculations.totalPayableAmount, 0
    );
    
    const totalKwInstalled = completedProjects.reduce((sum, project) => 
      sum + project.calculations.systemSize, 0
    );

    // Generate monthly data for the last 6 months
    const monthlyData = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toISOString().slice(0, 7);
      
      const monthProjects = completedProjects.filter(p => 
        p.createdAt.slice(0, 7) === monthKey
      );
      
      return {
        month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        income: monthProjects.reduce((sum, p) => sum + p.calculations.totalPayableAmount, 0),
        projects: monthProjects.length,
      };
    }).reverse();

    return {
      totalIncome,
      totalKwInstalled,
      totalProjects: projects.length,
      monthlyData,
    };
  };

  const exportData = () => {
    const dataStr = JSON.stringify(projects, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `solar_projects_${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <AppContext.Provider value={{
      projects,
      settings,
      addProject,
      updateProject,
      deleteProject,
      getProject,
      updateSettings,
      getDashboardStats,
      exportData,
    }}>
      {children}
    </AppContext.Provider>
  );
};