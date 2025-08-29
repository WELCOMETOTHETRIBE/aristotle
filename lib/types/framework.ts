export type FrameworkNav = {
  tone: "gritty" | "honor" | "calm" | "order" | "embodied" | "stewardship" | "disciplined" | "devotional" | "communal" | "crisp";
  badge: string; 
  emoji: string;
};

export type FrameworkRecord = {
  id: string; 
  name: string; 
  nav: FrameworkNav;
  coreModules: string[]; 
  supportModules: string[];
  featuredPractices: string[];
};

export type FrameworkCatalog = { 
  modules: string[]; 
  practices: string[] 
};

export type FrameworkMap = { 
  version: string; 
  frameworks: FrameworkRecord[]; 
  catalog: FrameworkCatalog 
};

// Legacy interfaces for backward compatibility
export interface FrameworkByModule {
  core: FrameworkRecord[];
  support: FrameworkRecord[];
}

export interface FrameworkByPractice {
  frameworks: string[];
}

export interface FrameworkIndex {
  byFramework: Record<string, FrameworkRecord>;
  byModule: Record<string, FrameworkByModule>;
  byPractice: Record<string, string[]>;
} 