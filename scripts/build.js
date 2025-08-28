const { execSync } = require('child_process');

console.log('🔨 Starting build process...');

try {
  // Generate Prisma client (will skip if DATABASE_URL is missing)
  console.log('Generating Prisma client...');
  try {
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Prisma client generated');
  } catch (error) {
    console.log('⚠️ Prisma client generation skipped (no DATABASE_URL)');
  }

  // Build Next.js app
  console.log('Building Next.js application...');
  execSync('next build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} 