const { execSync } = require('child_process');
const path = require('path');

console.log('🗄️ Initializing database schema...');

// Ensure DATABASE_URL is properly set
if (!process.env.DATABASE_URL) {
  console.log('⚠️ DATABASE_URL not set, using default SQLite database');
  process.env.DATABASE_URL = 'file:./prisma/dev.db';
} else if (!process.env.DATABASE_URL.startsWith('file:')) {
  console.log('⚠️ DATABASE_URL does not start with file:, adding file: prefix');
  process.env.DATABASE_URL = `file:${process.env.DATABASE_URL}`;
}

console.log(`📊 Using database: ${process.env.DATABASE_URL}`);

try {
  // Push schema to database
  console.log('Pushing schema to database...');
  execSync('npx prisma db push --accept-data-loss', { 
    stdio: 'inherit',
    env: { ...process.env, PRISMA_CLI_QUERY_ENGINE_TYPE: 'binary' }
  });
  console.log('✅ Database schema initialized successfully');
} catch (error) {
  console.error('❌ Database initialization failed:', error.message);
  console.log('⚠️ Continuing without database initialization...');
  // Don't exit with error code - let the app continue
} 