const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🗄️ Initializing database schema...');

// Ensure DATABASE_URL is properly set
if (!process.env.DATABASE_URL) {
  console.log('⚠️ DATABASE_URL not set, using default SQLite database');
  process.env.DATABASE_URL = 'file:./prisma/dev.db';
}

console.log(`📊 Using database: ${process.env.DATABASE_URL}`);

// Only create directories for SQLite databases
if (process.env.DATABASE_URL.startsWith('file:')) {
  const prismaDir = path.dirname(process.env.DATABASE_URL.replace('file:', ''));
  if (!fs.existsSync(prismaDir)) {
    console.log(`📁 Creating prisma directory: ${prismaDir}`);
    fs.mkdirSync(prismaDir, { recursive: true });
  }
} else {
  console.log('📊 Using PostgreSQL database - no local directory needed');
}

try {
  // Push schema to database with timeout
  console.log('Pushing schema to database...');
  execSync('npx prisma db push --accept-data-loss', { 
    stdio: 'inherit',
    env: { ...process.env, PRISMA_CLI_QUERY_ENGINE_TYPE: 'binary' },
    timeout: 30000 // 30 second timeout
  });
  console.log('✅ Database schema initialized successfully');
} catch (error) {
  console.error('❌ Database initialization failed:', error.message);
  console.log('⚠️ Continuing without database initialization...');
  // Don't exit with error code - let the app continue
}

console.log('✅ Database initialization script completed');
