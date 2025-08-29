import fs from "node:fs";
import path from "node:path";
import { FrameworkMap, FrameworkRecord, FrameworkIndex, FrameworkByModule } from './types/framework';

// Simple cache implementation
const simpleCache = (fn: any) => {
  let cached: any = null;
  return (...args: any[]) => {
    if (!cached) {
      cached = fn(...args);
    }
    return cached;
  };
};

export const loadFrameworkMap = simpleCache((): FrameworkMap => {
  try {
    const p = path.join(process.cwd(), "data", "framework_map.json");
    if (!fs.existsSync(p)) {
      console.error("data/framework_map.json not found at:", p);
      console.log("Current working directory:", process.cwd());
      try {
        console.log("Available files in data directory:", fs.readdirSync(path.join(process.cwd(), "data")));
      } catch (e) {
        console.log("data directory not found");
      }
      throw new Error("data/framework_map.json not found");
    }
    
    const fileContent = fs.readFileSync(p, "utf-8");
    const parsed = JSON.parse(fileContent);
    
    if (!parsed.frameworks?.length) {
      console.error("framework_map.json: frameworks missing");
      throw new Error("framework_map.json: frameworks missing");
    }
    
    if (!parsed.catalog?.modules?.length) {
      console.error("framework_map.json: catalog.modules missing");
      throw new Error("framework_map.json: catalog.modules missing");
    }
    
    return parsed;
  } catch (error) {
    console.error("Error loading framework map:", error);
    // Return a minimal valid structure with some basic frameworks to prevent crashes
    return {
      version: "1.0.0",
      frameworks: [
        {
          id: "spartan",
          name: "Spartan Agōgē",
          nav: { tone: "gritty", badge: "Discipline", emoji: "🛡️" },
          coreModules: ["strength", "discipline", "courage"],
          supportModules: ["meditation", "fasting"],
          featuredPractices: ["cold_exposure", "adversity_training"]
        },
        {
          id: "stoic",
          name: "Stoicism",
          nav: { tone: "calm", badge: "Clarity", emoji: "🧱" },
          coreModules: ["wisdom", "temperance", "reflection"],
          supportModules: ["meditation", "philosophy"],
          featuredPractices: ["evening_reflection", "memento_mori"]
        }
      ],
      catalog: {
        modules: ["strength", "discipline", "courage", "wisdom", "temperance", "reflection", "meditation", "fasting", "philosophy"],
        practices: ["cold_exposure", "adversity_training", "evening_reflection", "memento_mori"]
      }
    };
  }
});

export type ReverseIndex = {
  byModule: Record<string, { core: string[]; support: string[] }>;
  byPractice: Record<string, string[]>;
  byFramework: Record<string, FrameworkRecord>;
};

export const buildReverseIndex = simpleCache((): ReverseIndex => {
  try {
    const fm = loadFrameworkMap();
    const byFramework: ReverseIndex["byFramework"] = {};
    const byModule: ReverseIndex["byModule"] = {};
    const byPractice: ReverseIndex["byPractice"] = {};

    for (const f of fm.frameworks) {
      byFramework[f.id] = f;
      for (const m of f.coreModules) (byModule[m] ??= { core: [], support: [] }).core.push(f.id);
      for (const m of f.supportModules) (byModule[m] ??= { core: [], support: [] }).support.push(f.id);
      for (const p of f.featuredPractices) (byPractice[p] ??= []).push(f.id);
    }
    return { byModule, byPractice, byFramework };
  } catch (error) {
    console.error("Error building reverse index:", error);
    return { byModule: {}, byPractice: {}, byFramework: {} };
  }
});

// Legacy functions for backward compatibility (updated to use FrameworkRecord)
let frameworkIndex: FrameworkIndex | null = null;

export function buildFrameworkIndex(): FrameworkIndex {
  try {
    if (frameworkIndex) return frameworkIndex;
    
    const fm = loadFrameworkMap();
    const byFramework: Record<string, FrameworkRecord> = {};
    const byModule: Record<string, FrameworkByModule> = {};
    const byPractice: Record<string, string[]> = {};

    for (const framework of fm.frameworks) {
      byFramework[framework.id] = framework;
      
      for (const moduleId of framework.coreModules) {
        if (!byModule[moduleId]) {
          byModule[moduleId] = { core: [], support: [] };
        }
        byModule[moduleId].core.push(framework);
      }
      
      for (const moduleId of framework.supportModules) {
        if (!byModule[moduleId]) {
          byModule[moduleId] = { core: [], support: [] };
        }
        byModule[moduleId].support.push(framework);
      }
      
      for (const practiceSlug of framework.featuredPractices) {
        if (!byPractice[practiceSlug]) {
          byPractice[practiceSlug] = [];
        }
        byPractice[practiceSlug].push(framework.id);
      }
    }

    frameworkIndex = { byFramework, byModule, byPractice };
    return frameworkIndex;
  } catch (error) {
    console.error("Error building framework index:", error);
    return { byFramework: {}, byModule: {}, byPractice: {} };
  }
}

export function getFrameworkById(id: string): FrameworkRecord | null {
  try {
    const index = buildFrameworkIndex();
    return index.byFramework[id] || null;
  } catch (error) {
    console.error("Error getting framework by ID:", error);
    return null;
  }
}

export function getFrameworksByModule(moduleId: string): FrameworkByModule | null {
  try {
    const index = buildFrameworkIndex();
    return index.byModule[moduleId] || null;
  } catch (error) {
    console.error("Error getting frameworks by module:", error);
    return null;
  }
}

export function getFrameworksByPractice(practiceSlug: string): string[] {
  try {
    const index = buildFrameworkIndex();
    return index.byPractice[practiceSlug] || [];
  } catch (error) {
    console.error("Error getting frameworks by practice:", error);
    return [];
  }
}

export function getAllFrameworks(): FrameworkRecord[] {
  try {
    const fm = loadFrameworkMap();
    return fm.frameworks;
  } catch (error) {
    console.error("Error getting all frameworks:", error);
    return [];
  }
}

export function getAllModules(): string[] {
  try {
    const fm = loadFrameworkMap();
    return fm.catalog.modules;
  } catch (error) {
    console.error("Error getting all modules:", error);
    return [];
  }
}

export function getAllPractices(): string[] {
  try {
    const fm = loadFrameworkMap();
    return fm.catalog.practices;
  } catch (error) {
    console.error("Error getting all practices:", error);
    return [];
  }
} 