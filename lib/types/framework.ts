export interface FrameworkNav {
  tone: string;
  badge: string;
  emoji: string;
}

export interface Framework {
  id: string;
  name: string;
  nav: FrameworkNav;
  coreModules: string[];
  supportModules: string[];
  featuredPractices: string[];
}

export interface FrameworkMap {
  $schema: string;
  version: string;
  frameworks: Framework[];
  catalog: {
    modules: string[];
    practices: string[];
  };
}

export interface FrameworkByModule {
  core: Framework[];
  support: Framework[];
}

export interface FrameworkByPractice {
  frameworks: string[];
}

export interface FrameworkIndex {
  byFramework: Record<string, Framework>;
  byModule: Record<string, FrameworkByModule>;
  byPractice: Record<string, string[]>;
} 