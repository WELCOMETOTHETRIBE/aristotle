#!/usr/bin/env tsx

import { readdir, readFile, stat } from 'fs/promises';
import { join } from 'path';

const PLACEHOLDER_PATTERNS = [
  /coming soon/i,
  /demo user/i,
  /demo@/i,
  /fallback.*resources/i,
  /fallback.*practice/i,
  /stub.*implementation/i,
  /TODO.*implement/i,
  /FIXME.*implement/i,
  /for demo purposes/i,
  /for now, return/i,
  /placeholder user/i,
  /your-secret-key/i,
  /your-openai-api-key/i,
  /your-railway-token/i
];

const EXCLUDE_PATTERNS = [
  /node_modules/,
  /\.git/,
  /\.next/,
  /dist/,
  /build/,
  /coverage/,
  /\.log$/,
  /\.lock$/,
  /package-lock\.json$/,
  /yarn\.lock$/,
  /pnpm-lock\.yaml$/,
  /\.min\./,
  /\.map$/,
  /\.d\.ts$/,
  /scripts\/strip-placeholders\.ts$/, // Don't check this file itself
  /doctor-report\.json$/,
  /README\.md$/,
  /\.md$/,
  /\.json$/,
  /\.yml$/,
  /\.yaml$/,
  /\.toml$/,
  /\.env/,
  /\.example$/,
  /\.config\./,
  /\.test\./,
  /\.spec\./,
  /\.e2e\./,
  /\.smoke\./,
  /prisma\/seed\//, // Don't check seed files
  /env\.local\.example$/ // Don't check example env files
];

const INCLUDE_EXTENSIONS = [
  '.ts', '.tsx', '.js', '.jsx', '.vue', '.svelte', '.astro'
];

interface PlaceholderMatch {
  file: string;
  line: number;
  pattern: string;
  context: string;
}

async function shouldCheckFile(filePath: string): Promise<boolean> {
  // Check if file should be excluded
  for (const pattern of EXCLUDE_PATTERNS) {
    if (pattern.test(filePath)) {
      return false;
    }
  }

  // Check if file has an extension we want to include
  const ext = filePath.split('.').pop()?.toLowerCase();
  return ext ? INCLUDE_EXTENSIONS.includes(`.${ext}`) : false;
}

async function scanFile(filePath: string): Promise<PlaceholderMatch[]> {
  const matches: PlaceholderMatch[] = [];
  
  try {
    const content = await readFile(filePath, 'utf-8');
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNumber = i + 1;
      
      for (const pattern of PLACEHOLDER_PATTERNS) {
        if (pattern.test(line)) {
          matches.push({
            file: filePath,
            line: lineNumber,
            pattern: pattern.source,
            context: line.trim()
          });
        }
      }
    }
  } catch (error) {
    console.warn(`Warning: Could not read file ${filePath}:`, error);
  }
  
  return matches;
}

async function scanDirectory(dirPath: string): Promise<PlaceholderMatch[]> {
  const matches: PlaceholderMatch[] = [];
  
  try {
    const entries = await readdir(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        const subMatches = await scanDirectory(fullPath);
        matches.push(...subMatches);
      } else if (entry.isFile()) {
        if (await shouldCheckFile(fullPath)) {
          const fileMatches = await scanFile(fullPath);
          matches.push(...fileMatches);
        }
      }
    }
  } catch (error) {
    console.warn(`Warning: Could not scan directory ${dirPath}:`, error);
  }
  
  return matches;
}

async function main() {
  console.log('🔍 Scanning for placeholder content...');
  
  const startTime = Date.now();
  const matches = await scanDirectory('.');
  const endTime = Date.now();
  
  console.log(`\n📊 Scan completed in ${endTime - startTime}ms`);
  console.log(`Found ${matches.length} placeholder matches\n`);
  
  if (matches.length > 0) {
    console.log('❌ PLACEHOLDER CONTENT DETECTED:');
    console.log('The following files contain placeholder content that must be removed before shipping:\n');
    
    // Group by file for better readability
    const matchesByFile = matches.reduce((acc, match) => {
      if (!acc[match.file]) {
        acc[match.file] = [];
      }
      acc[match.file].push(match);
      return acc;
    }, {} as Record<string, PlaceholderMatch[]>);
    
    for (const [file, fileMatches] of Object.entries(matchesByFile)) {
      console.log(`📁 ${file}:`);
      for (const match of fileMatches) {
        console.log(`   Line ${match.line}: ${match.context}`);
      }
      console.log('');
    }
    
    console.log('🚫 Build failed: Placeholder content detected');
    console.log('Please remove all placeholder content before shipping.');
    process.exit(1);
  } else {
    console.log('✅ No placeholder content detected');
    console.log('✅ Build can proceed');
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error('Error during scan:', error);
    process.exit(1);
  });
} 