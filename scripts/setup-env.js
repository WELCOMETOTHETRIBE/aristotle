#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const envExamplePath = path.join(process.cwd(), 'env.local.example');
const envLocalPath = path.join(process.cwd(), '.env.local');

console.log('🔧 Setting up environment variables...\n');

// Check if .env.local exists
if (fs.existsSync(envLocalPath)) {
  console.log('✅ .env.local already exists');
  
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  const lines = envContent.split('\n');
  
  const missingVars = [];
  const requiredVars = [
    'OPENAI_API_KEY',
    'DATABASE_URL',
    'NEXT_PUBLIC_APP_NAME'
  ];
  
  for (const requiredVar of requiredVars) {
    if (!lines.some(line => line.startsWith(requiredVar + '='))) {
      missingVars.push(requiredVar);
    }
  }
  
  if (missingVars.length > 0) {
    console.log('⚠️  Missing environment variables:');
    missingVars.forEach(varName => {
      console.log(`   - ${varName}`);
    });
    console.log('\nPlease add these variables to your .env.local file.');
  } else {
    console.log('✅ All required environment variables are present');
  }
} else {
  console.log('📝 Creating .env.local from template...');
  
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envLocalPath);
    console.log('✅ .env.local created from template');
    console.log('\n⚠️  Please update the following variables in .env.local:');
    console.log('   - OPENAI_API_KEY (get from https://platform.openai.com/api-keys)');
    console.log('   - DATABASE_URL (your PostgreSQL connection string)');
    console.log('   - NEXT_PUBLIC_APP_NAME (your app name)');
  } else {
    console.log('❌ env.local.example not found');
    console.log('Creating basic .env.local template...');
    
    const basicEnvContent = `# Environment Variables
# Copy this file to .env.local and fill in your values

# OpenAI API Key (get from https://platform.openai.com/api-keys)
OPENAI_API_KEY=your_openai_api_key_here

# Database URL (PostgreSQL connection string)
DATABASE_URL=postgresql://username:password@localhost:5432/aristotle

# App Name
NEXT_PUBLIC_APP_NAME=Aristotle

# Optional: JWT Secret for authentication
JWT_SECRET=your_jwt_secret_here

# Optional: NextAuth configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
`;
    
    fs.writeFileSync(envLocalPath, basicEnvContent);
    console.log('✅ Basic .env.local template created');
    console.log('\n⚠️  Please update the variables in .env.local with your actual values');
  }
}

console.log('\n📋 Environment Setup Complete!');
console.log('\nNext steps:');
console.log('1. Update .env.local with your actual values');
console.log('2. Run: npm run dev');
console.log('3. Run: npm run doctor (to verify everything is working)'); 