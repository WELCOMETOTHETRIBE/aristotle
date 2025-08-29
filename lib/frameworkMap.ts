import { readFileSync } from 'fs';
import { join } from 'path';
import type { FrameworkMap, FrameworkIndex, Framework, FrameworkByModule } from './types/framework';

let frameworkMap: FrameworkMap | null = null;
let frameworkIndex: FrameworkIndex | null = null;

export function loadFrameworkMap(): FrameworkMap {
  if (!frameworkMap) {
    const filePath = join(process.cwd(), 'data', 'framework_map.json');
    const fileContent = readFileSync(filePath, 'utf-8');
    frameworkMap = JSON.parse(fileContent) as FrameworkMap;
  }
  return frameworkMap;
}

export function buildFrameworkIndex(): FrameworkIndex {
  if (!frameworkIndex) {
    const map = loadFrameworkMap();
    
    const byFramework: Record<string, Framework> = {};
    const byModule: Record<string, FrameworkByModule> = {};
    const byPractice: Record<string, string[]> = {};

    // Build byFramework index
    map.frameworks.forEach(framework => {
      byFramework[framework.id] = framework;
    });

    // Build byModule index
    map.frameworks.forEach(framework => {
      // Add to core modules
      framework.coreModules.forEach(moduleId => {
        if (!byModule[moduleId]) {
          byModule[moduleId] = { core: [], support: [] };
        }
        byModule[moduleId].core.push(framework);
      });

      // Add to support modules
      framework.supportModules.forEach(moduleId => {
        if (!byModule[moduleId]) {
          byModule[moduleId] = { core: [], support: [] };
        }
        byModule[moduleId].support.push(framework);
      });
    });

    // Build byPractice index
    map.frameworks.forEach(framework => {
      framework.featuredPractices.forEach(practiceSlug => {
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

export function getFrameworkById(id: string): Framework | null {
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

export function getAllFrameworks(): Framework[] {
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