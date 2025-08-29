#!/usr/bin/env node

const https = require('https');
const http = require('http');

const BASE_URL = process.env.APP_URL || 'http://localhost:3000';

async function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    client.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function exportDeveloperFeedback() {
  try {
    console.log('🔧 Exporting Developer Feedback...\n');
    
    // Check if server is running
    try {
      await makeRequest(`${BASE_URL}/api/health`);
    } catch (error) {
      console.error('❌ Server is not running. Please start the development server with: npm run dev');
      process.exit(1);
    }
    
    // Get feedback data
    const feedbackData = await makeRequest(`${BASE_URL}/api/debug/developer-feedback`);
    const feedback = JSON.parse(feedbackData);
    
    if (feedback.count === 0) {
      console.log('📝 No developer feedback found.');
      console.log('\n💡 To add feedback:');
      console.log('   1. Start the app in development mode');
      console.log('   2. Navigate to any framework page');
      console.log('   3. Hover over widgets/sections to see feedback buttons');
      console.log('   4. Click the feedback button to add comments');
      return;
    }
    
    console.log(`📊 Found ${feedback.count} feedback items:\n`);
    
    // Display summary
    console.log('📈 Summary:');
    console.log(`   Widget feedback: ${feedback.summary.byType.widget}`);
    console.log(`   Section feedback: ${feedback.summary.byType.section}`);
    console.log(`   General feedback: ${feedback.summary.byType.general}`);
    console.log(`   Critical priority: ${feedback.summary.byPriority.critical}`);
    console.log(`   High priority: ${feedback.summary.byPriority.high}`);
    console.log(`   Open status: ${feedback.summary.byStatus.open}`);
    
    console.log('\n📋 Detailed Feedback:\n');
    
    feedback.feedback.forEach((item, index) => {
      const icon = {
        bug: '🐛',
        feature: '✨',
        improvement: '🔧',
        design: '🎨',
        performance: '⚡',
        other: '📝'
      }[item.category] || '📝';
      
      const priorityColor = {
        critical: '\x1b[31m', // red
        high: '\x1b[33m',     // yellow
        medium: '\x1b[36m',   // cyan
        low: '\x1b[32m'       // green
      }[item.priority] || '\x1b[37m'; // white
      
      console.log(`${index + 1}. ${icon} ${priorityColor}${item.category.toUpperCase()} (${item.priority.toUpperCase()})\x1b[0m`);
      console.log(`   Type: ${item.type}`);
      console.log(`   Target: ${item.targetId}`);
      if (item.frameworkSlug) {
        console.log(`   Framework: ${item.frameworkSlug}`);
      }
      console.log(`   Location: ${item.location}`);
      console.log(`   Status: ${item.status}`);
      console.log(`   Time: ${new Date(item.timestamp).toLocaleString()}`);
      console.log(`   Comment: ${item.comment}`);
      console.log('');
    });
    
    // Save to file
    const fs = require('fs');
    const filename = `developer-feedback-${new Date().toISOString().split('T')[0]}.json`;
    fs.writeFileSync(filename, JSON.stringify(feedback, null, 2));
    console.log(`💾 Feedback saved to: ${filename}`);
    
    console.log('\n📤 To share with me, you can:');
    console.log(`   1. Copy the content of ${filename}`);
    console.log(`   2. Or run: cat ${filename}`);
    console.log(`   3. Or paste the JSON data directly in our conversation`);
    
  } catch (error) {
    console.error('❌ Error exporting developer feedback:', error.message);
    process.exit(1);
  }
}

exportDeveloperFeedback(); 