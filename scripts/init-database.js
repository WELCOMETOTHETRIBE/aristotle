const { execSync } = require('child_process');

console.log('🗄️ Initializing database schema...');

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