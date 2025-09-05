const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Aristotle application...');

// Set environment variables
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.PORT = process.env.PORT || '8080';
process.env.HOSTNAME = process.env.HOSTNAME || '0.0.0.0';

console.log(`📊 Environment: ${process.env.NODE_ENV}`);
console.log(`🌐 Port: ${process.env.PORT}`);
console.log(`🏠 Hostname: ${process.env.HOSTNAME}`);

// Start the Next.js application
const nextApp = spawn('npm', ['start'], {
  stdio: 'inherit',
  env: { ...process.env }
});

nextApp.on('error', (error) => {
  console.error('❌ Failed to start Next.js app:', error);
  process.exit(1);
});

nextApp.on('exit', (code) => {
  console.log(`📊 Next.js app exited with code ${code}`);
  process.exit(code);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('📊 Received SIGTERM, shutting down gracefully...');
  nextApp.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('📊 Received SIGINT, shutting down gracefully...');
  nextApp.kill('SIGINT');
});
