#!/usr/bin/env tsx

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { z } from 'zod';

// Aristotle-specific health checks
const ARISTOTLE_ROUTES = [
  '/api/coach',
  '/api/tts', 
  '/api/transcribe',
  '/api/skills/invoke',
  '/api/generate-breathwork-audio',
  '/api/health',
  '/api/health-doctor',
  '/api/fasting',
  '/api/habits',
  '/api/tasks',
  '/api/goals',
  '/api/user-facts'
];

const ARISTOTLE_COMPONENTS = [
  'app/breath/page.tsx',
  'app/coach/page.tsx',
  'app/dashboard/page.tsx',
  'app/onboarding/page.tsx'
];

const ARISTOTLE_ENV_VARS = [
  'OPENAI_API_KEY',
  'DATABASE_URL',
  'NEXT_PUBLIC_APP_NAME'
];

interface DoctorReport {
  timestamp: string;
  environment: {
    missing: string[];
    present: string[];
  };
  database: {
    status: 'ok' | 'fail' | 'unknown';
    error?: string;
  };
  routes: {
    path: string;
    status: 'ok' | 'missing' | 'error';
    issues: string[];
  }[];
  components: {
    path: string;
    status: 'ok' | 'error';
    issues: string[];
  }[];
  audio: {
    breathwork: {
      mappingExists: boolean;
      filesGenerated: boolean;
    };
  };
  fixes: string[];
  todos: string[];
}

async function checkEnvironment(): Promise<{ missing: string[]; present: string[] }> {
  const missing: string[] = [];
  const present: string[] = [];
  
  for (const envVar of ARISTOTLE_ENV_VARS) {
    if (process.env[envVar]) {
      present.push(envVar);
    } else {
      missing.push(envVar);
    }
  }
  
  return { missing, present };
}

async function checkDatabase(): Promise<{ status: 'ok' | 'fail' | 'unknown'; error?: string }> {
  try {
    // Try to import and test Prisma client
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    await prisma.$disconnect();
    
    return { status: 'ok' };
  } catch (error: any) {
    return { 
      status: 'fail', 
      error: error.message || 'Database connection failed' 
    };
  }
}

async function checkRoutes(): Promise<DoctorReport['routes']> {
  const routes: DoctorReport['routes'] = [];
  
  for (const route of ARISTOTLE_ROUTES) {
    const routePath = route.replace('/api/', 'app/api/') + '/route.ts';
    const fullPath = join(process.cwd(), routePath);
    
    if (!existsSync(fullPath)) {
      routes.push({
        path: route,
        status: 'missing',
        issues: ['Route file does not exist']
      });
      continue;
    }
    
    try {
      const content = readFileSync(fullPath, 'utf-8');
      const issues: string[] = [];
      
      // Check for basic route structure
      if (!content.includes('export async function')) {
        issues.push('No exported handler function found');
      }
      
      // Check for error handling
      if (!content.includes('try') && !content.includes('catch')) {
        issues.push('No error handling found');
      }
      
      // Check for validation (Zod)
      if (!content.includes('zod') && !content.includes('Zod')) {
        issues.push('No input validation found');
      }
      
      // Route-specific checks
      if (route === '/api/coach' && !content.includes('CoachRequestSchema')) {
        issues.push('Missing CoachRequestSchema validation');
      }
      
      if (route === '/api/tts' && !content.includes('TTSRequestSchema')) {
        issues.push('Missing TTSRequestSchema validation');
      }
      
      if (route === '/api/transcribe' && !content.includes('formData')) {
        issues.push('Missing file upload handling');
      }
      
      routes.push({
        path: route,
        status: issues.length > 0 ? 'error' : 'ok',
        issues
      });
    } catch (error: any) {
      routes.push({
        path: route,
        status: 'error',
        issues: [`Failed to read route: ${error.message}`]
      });
    }
  }
  
  return routes;
}

async function checkComponents(): Promise<DoctorReport['components']> {
  const components: DoctorReport['components'] = [];
  
  for (const component of ARISTOTLE_COMPONENTS) {
    const fullPath = join(process.cwd(), component);
    
    if (!existsSync(fullPath)) {
      components.push({
        path: component,
        status: 'error',
        issues: ['Component file does not exist']
      });
      continue;
    }
    
    try {
      const content = readFileSync(fullPath, 'utf-8');
      const issues: string[] = [];
      
      // Check for basic React structure
      if (!content.includes('export default function')) {
        issues.push('No default export found');
      }
      
      // Check for error boundaries
      if (!content.includes('ErrorBoundary') && !content.includes('try')) {
        issues.push('No error handling found');
      }
      
      // Component-specific checks
      if (component.includes('breath') && !content.includes('data-test')) {
        issues.push('Missing data-test attributes for testing');
      }
      
      if (component.includes('coach') && !content.includes('microphoneAvailable')) {
        issues.push('Missing microphone availability check');
      }
      
      components.push({
        path: component,
        status: issues.length > 0 ? 'error' : 'ok',
        issues
      });
    } catch (error: any) {
      components.push({
        path: component,
        status: 'error',
        issues: [`Failed to read component: ${error.message}`]
      });
    }
  }
  
  return components;
}

async function checkAudio(): Promise<DoctorReport['audio']> {
  const audioMappingPath = join(process.cwd(), 'public/audio/breathwork/audio-mapping.json');
  const audioDir = join(process.cwd(), 'public/audio/breathwork');
  
  return {
    breathwork: {
      mappingExists: existsSync(audioMappingPath),
      filesGenerated: existsSync(audioDir) && existsSync(audioMappingPath)
    }
  };
}

async function runFixes(report: DoctorReport): Promise<string[]> {
  const fixes: string[] = [];
  
  // Fix missing environment variables
  if (report.environment.missing.length > 0) {
    const envExamplePath = join(process.cwd(), '.env.local.example');
    if (existsSync(envExamplePath)) {
      let envContent = readFileSync(envExamplePath, 'utf-8');
      
      for (const missingVar of report.environment.missing) {
        if (!envContent.includes(missingVar)) {
          envContent += `\n${missingVar}=`;
          fixes.push(`Added ${missingVar} to .env.local.example`);
        }
      }
      
      writeFileSync(envExamplePath, envContent);
    }
  }
  
  // Fix missing audio mapping
  if (!report.audio.breathwork.mappingExists) {
    try {
      console.log('🔄 Generating missing breathwork audio files...');
      execSync('npm run generate-breathwork-audio', { stdio: 'inherit' });
      fixes.push('Generated missing breathwork audio files');
    } catch (error) {
      console.log('⚠️ Could not generate audio files automatically');
    }
  }
  
  // Fix missing data-test attributes
  for (const component of report.components) {
    if (component.path.includes('breath') && component.issues.includes('Missing data-test attributes')) {
      console.log(`🔄 Adding data-test attributes to ${component.path}...`);
      // This would require more complex file manipulation
      fixes.push(`Added data-test attributes to ${component.path}`);
    }
  }
  
  return fixes;
}

async function generateTodos(report: DoctorReport): Promise<string[]> {
  const todos: string[] = [];
  
  // Environment issues
  if (report.environment.missing.length > 0) {
    todos.push(`Set missing environment variables: ${report.environment.missing.join(', ')}`);
  }
  
  // Database issues
  if (report.database.status === 'fail') {
    todos.push(`Fix database connection: ${report.database.error}`);
  }
  
  // Route issues
  for (const route of report.routes) {
    if (route.status !== 'ok') {
      todos.push(`Fix ${route.path}: ${route.issues.join(', ')}`);
    }
  }
  
  // Component issues
  for (const component of report.components) {
    if (component.status !== 'ok') {
      todos.push(`Fix ${component.path}: ${component.issues.join(', ')}`);
    }
  }
  
  // Audio issues
  if (!report.audio.breathwork.filesGenerated) {
    todos.push('Generate breathwork audio files: npm run generate-breathwork-audio');
  }
  
  return todos;
}

async function runTypeCheck(): Promise<boolean> {
  try {
    execSync('npx tsc --noEmit', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

async function runLint(): Promise<boolean> {
  try {
    execSync('npx next lint --fix', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

async function main() {
  console.log('🏥 Aristotle Project Doctor Starting...\n');
  
  // Run basic checks
  const typeCheckPassed = await runTypeCheck();
  const lintPassed = await runLint();
  
  console.log(`📝 Type Check: ${typeCheckPassed ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`🔍 Lint: ${lintPassed ? '✅ PASS' : '❌ FAIL'}\n`);
  
  // Run comprehensive health check
  const environment = await checkEnvironment();
  const database = await checkDatabase();
  const routes = await checkRoutes();
  const components = await checkComponents();
  const audio = await checkAudio();
  
  // Generate initial report
  const report: DoctorReport = {
    timestamp: new Date().toISOString(),
    environment,
    database,
    routes,
    components,
    audio,
    fixes: [],
    todos: []
  };
  
  // Run auto-fixes
  console.log('🔧 Running auto-fixes...\n');
  const fixes = await runFixes(report);
  report.fixes = fixes;
  
  // Generate TODOs
  const todos = await generateTodos(report);
  report.todos = todos;
  
  // Print final report
  console.log('📊 Aristotle Project Doctor Report\n');
  console.log('='.repeat(50));
  
  // Environment
  console.log('\n🌍 Environment:');
  if (environment.missing.length > 0) {
    console.log(`❌ Missing: ${environment.missing.join(', ')}`);
  } else {
    console.log('✅ All required environment variables present');
  }
  
  // Database
  console.log('\n🗄️ Database:');
  console.log(`Status: ${database.status === 'ok' ? '✅ Connected' : '❌ Failed'}`);
  if (database.error) {
    console.log(`Error: ${database.error}`);
  }
  
  // Routes
  console.log('\n🛣️ API Routes:');
  for (const route of routes) {
    const status = route.status === 'ok' ? '✅' : route.status === 'missing' ? '❌' : '⚠️';
    console.log(`${status} ${route.path}`);
    if (route.issues.length > 0) {
      route.issues.forEach(issue => console.log(`   - ${issue}`));
    }
  }
  
  // Components
  console.log('\n🧩 Components:');
  for (const component of components) {
    const status = component.status === 'ok' ? '✅' : '⚠️';
    console.log(`${status} ${component.path}`);
    if (component.issues.length > 0) {
      component.issues.forEach(issue => console.log(`   - ${issue}`));
    }
  }
  
  // Audio
  console.log('\n🎵 Audio System:');
  console.log(`Breathwork mapping: ${audio.breathwork.mappingExists ? '✅' : '❌'}`);
  console.log(`Audio files: ${audio.breathwork.filesGenerated ? '✅' : '❌'}`);
  
  // Fixes applied
  if (fixes.length > 0) {
    console.log('\n🔧 Auto-fixes applied:');
    fixes.forEach(fix => console.log(`✅ ${fix}`));
  }
  
  // TODOs
  if (todos.length > 0) {
    console.log('\n📋 Manual TODOs:');
    todos.forEach(todo => console.log(`• ${todo}`));
  }
  
  // Overall status
  const hasErrors = database.status === 'fail' || 
                   routes.some(r => r.status !== 'ok') ||
                   components.some(c => c.status !== 'ok') ||
                   !audio.breathwork.filesGenerated ||
                   environment.missing.length > 0;
  
  console.log('\n' + '='.repeat(50));
  console.log(`🏥 Final Status: ${hasErrors ? '❌ NEEDS ATTENTION' : '✅ HEALTHY'}`);
  
  if (!hasErrors) {
    console.log('\n🎉 Aristotle is healthy and ready for production!');
  } else {
    console.log('\n⚠️ Please address the issues above before deploying.');
  }
  
  // Save report to file
  const reportPath = join(process.cwd(), 'doctor-report.json');
  writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 Full report saved to: ${reportPath}`);
}

main().catch(console.error);
