#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Setting up production database...\n');

try {
  // Generate Prisma client
  console.log('📦 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated\n');

  // Run migrations
  console.log('🔄 Running database migrations...');
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  console.log('✅ Migrations completed\n');

  // Seed the database
  console.log('🌱 Seeding database...');
  execSync('npm run db:seed', { stdio: 'inherit' });
  console.log('✅ Database seeded\n');

  console.log('🎉 Production database setup completed successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Verify your app is running correctly');
  console.log('2. Test user registration and login');
  console.log('3. Check that all features work as expected');

} catch (error) {
  console.error('❌ Database setup failed:', error.message);
  process.exit(1);
} 