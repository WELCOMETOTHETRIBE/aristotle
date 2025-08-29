#!/usr/bin/env tsx

import { readdir, readFile, stat } from 'fs/promises';
import { join } from 'path';

const PLACEHOLDER_PATTERNS = [
  /coming soon/i,
  /TODO:\s*placeholder/i,
  /FIXME:\s*placeholder/i,
  /placeholder text/i,
  /mock data/i,
  /dummy data/i,
  /sample data/i,
  /test data/i
];

const IGNORE_PATTERNS = [
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
  /\.min\.js$/,
  /\.min\.css$/,
  /README.*\.md$/,
  /IMPLEMENTATION_PROGRESS\.md$/,
  /scripts\/strip-placeholders\.ts$/,
  /scripts\/doctor\.ts$/,
  /app\/api\/health-doctor/
];

const TEXT_EXTENSIONS = [
  '.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.txt', '.css', '.scss', '.html'
];

async function scanDirectory(dir: string): Promise<string[]> {
  const issues: string[] = [];
  
  try {
    const entries = await readdir(dir);
    
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stats = await stat(fullPath);
      
      // Skip ignored patterns
      if (IGNORE_PATTERNS.some(pattern => pattern.test(fullPath))) {
        continue;
      }
      
      if (stats.isDirectory()) {
        const subIssues = await scanDirectory(fullPath);
        issues.push(...subIssues);
      } else if (stats.isFile()) {
        const ext = fullPath.split('.').pop()?.toLowerCase();
        if (ext && TEXT_EXTENSIONS.includes(`.${ext}`)) {
          try {
            const content = await readFile(fullPath, 'utf-8');
            const lines = content.split('\n');
            
            for (let i = 0; i < lines.length; i++) {
              const line = lines[i];
              for (const pattern of PLACEHOLDER_PATTERNS) {
                if (pattern.test(line)) {
                  issues.push(`${fullPath}:${i + 1} - Found placeholder: "${line.trim()}"`);
                }
              }
            }
          } catch (error) {
            // Skip files that can't be read as text
            continue;
          }
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dir}:`, error);
  }
  
  return issues;
}

async function main() {
  console.log('🔍 Scanning for placeholder text...');
  
  const issues = await scanDirectory('.');
  
  if (issues.length > 0) {
    console.error('❌ Found placeholder text in the following files:');
    issues.forEach(issue => console.error(`  ${issue}`));
    console.error(`\nTotal issues found: ${issues.length}`);
    console.error('Please remove all placeholder text before building for production.');
    process.exit(1);
  } else {
    console.log('✅ No placeholder text found. Ready for production!');
    process.exit(0);
  }
}

main().catch(error => {
  console.error('Error running placeholder scan:', error);
  process.exit(1);
}); 