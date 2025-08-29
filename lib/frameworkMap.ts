import fs from "node:fs"; 
import path from "node:path"; 
import { FrameworkMap, FrameworkRecord, FrameworkIndex, FrameworkByModule } from './types/framework';

// Handle cache function availability
let cache: any;
try {
  const react = require('react');
  cache = react.cache;
} catch {
  // Fallback for Node.js environments
  cache = (fn: any) => {
    let cached: any = null;
    return (...args: any[]) => {
      if (!cached) {
        cached = fn(...args);
      }
      return cached;
    };
  };
}

// Simple cache implementation for Node.js
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
  const p = path.join(process.cwd(), "data", "framework_map.json");
  if (!fs.existsSync(p)) throw new Error("data/framework_map.json not found");
  const parsed = JSON.parse(fs.readFileSync(p, "utf-8"));
  if (!parsed.frameworks?.length) throw new Error("framework_map.json: frameworks missing");
  if (!parsed.catalog?.modules?.length) throw new Error("framework_map.json: catalog.modules missing");
  return parsed;
});

export type ReverseIndex = {
  byModule: Record<string, { core: string[]; support: string[] }>;
  byPractice: Record<string, string[]>;
  byFramework: Record<string, FrameworkRecord>;
};

export const buildReverseIndex = simpleCache((): ReverseIndex => {
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
});

// Legacy functions for backward compatibility
let frameworkIndex: FrameworkIndex | null = null;

export function buildFrameworkIndex(): FrameworkIndex {
  if (!frameworkIndex) {
    const map = loadFrameworkMap();
    
    const byFramework: Record<string, FrameworkRecord> = {};
    const byModule: Record<string, FrameworkByModule> = {};
    const byPractice: Record<string, string[]> = {};

    // Build byFramework index
    map.frameworks.forEach((framework: FrameworkRecord) => {
      byFramework[framework.id] = framework;
    });

    // Build byModule index
    map.frameworks.forEach((framework: FrameworkRecord) => {
      // Add to core modules
      framework.coreModules.forEach((moduleId: string) => {
        if (!byModule[moduleId]) {
          byModule[moduleId] = { core: [], support: [] };
        }
        byModule[moduleId].core.push(framework);
      });

      // Add to support modules
      framework.supportModules.forEach((moduleId: string) => {
        if (!byModule[moduleId]) {
          byModule[moduleId] = { core: [], support: [] };
        }
        byModule[moduleId].support.push(framework);
      });
    });

    // Build byPractice index
    map.frameworks.forEach((framework: FrameworkRecord) => {
      framework.featuredPractices.forEach((practiceSlug: string) => {
        if (!byPractice[practiceSlug]) {
          byPractice[practiceSlug] = [];
        }
        byPractice[practiceSlug].push(framework.id);
      });
    });

    frameworkIndex = {
      byFramework,
      byModule,
      byPractice
    };
  }

  return frameworkIndex;
}

export function getFrameworkById(id: string): FrameworkRecord | null {
  const index = buildFrameworkIndex();
  return index.byFramework[id] || null;
}

export function getFrameworksByModule(moduleId: string): FrameworkByModule | null {
  const index = buildFrameworkIndex();
  return index.byModule[moduleId] || null;
}

export function getFrameworksByPractice(practiceSlug: string): string[] {
  const index = buildFrameworkIndex();
  return index.byPractice[practiceSlug] || [];
}

export function getAllFrameworks(): FrameworkRecord[] {
  const map = loadFrameworkMap();
  return map.frameworks;
}

export function getAllModules(): string[] {
  const map = loadFrameworkMap();
  return map.catalog.modules;
}

export function getAllPractices(): string[] {
  const map = loadFrameworkMap();
  return map.catalog.practices;
} 