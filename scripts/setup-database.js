const { execSync } = require('child_process');
const path = require('path');

console.log('🗄️ Setting up PostgreSQL database...\n');

try {
  // Generate Prisma client
  console.log('1. Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated\n');

  // Push schema to database
  console.log('2. Pushing schema to database...');
  execSync('npx prisma db push', { stdio: 'inherit' });
  console.log('✅ Schema pushed to database\n');

  // Optional: Seed with initial data
  console.log('3. Database setup complete!');
  console.log('📊 Your PostgreSQL database is ready to use.');
  console.log('🔗 Connection: Check your Railway dashboard for the connection string.');
  
} catch (error) {
  console.error('❌ Database setup failed:', error.message);
  console.log('\n🔧 Troubleshooting:');
  console.log('1. Make sure DATABASE_URL is set in Railway');
  console.log('2. Check that the PostgreSQL database is running');
  console.log('3. Verify the connection string format');
  process.exit(1);
} 