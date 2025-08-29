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

async function runIntegrityTest() {
  console.log('🧪 Running Widget Integrity Test...\n');
  
  try {
    // Test if server is running
    console.log('📡 Checking server availability...');
    await makeRequest(`${BASE_URL}/api/health`);
    console.log('✅ Server is running\n');
    
    // Run full integrity test
    console.log('🔍 Running full widget integrity test...');
    const fullTest = await makeRequest(`${BASE_URL}/api/debug/widget-integrity?format=pretty`);
    console.log(fullTest);
    
    // Get JSON data for analysis
    console.log('\n📊 Getting detailed analysis...');
    const jsonData = await makeRequest(`${BASE_URL}/api/debug/widget-integrity`);
    const data = JSON.parse(jsonData);
    
    // Analyze results
    const summary = data.summary;
    console.log('\n📈 INTEGRITY SUMMARY:');
    console.log('='.repeat(50));
    console.log(`• Total Frameworks: ${summary.totalFrameworks}`);
    console.log(`• Passed Frameworks: ${summary.passedFrameworks}`);
    console.log(`• Failed Frameworks: ${summary.failedFrameworks}`);
    console.log(`• Total Widgets: ${summary.totalWidgets}`);
    console.log(`• Passed Widgets: ${summary.passedWidgets}`);
    console.log(`• Failed Widgets: ${summary.failedWidgets}`);
    console.log(`• Total Auto-Fixes: ${summary.totalFixes}`);
    
    // Calculate health score
    const frameworkHealth = (summary.passedFrameworks / summary.totalFrameworks) * 100;
    const widgetHealth = (summary.passedWidgets / summary.totalWidgets) * 100;
    const overallHealth = (frameworkHealth + widgetHealth) / 2;
    
    console.log('\n🏥 HEALTH SCORES:');
    console.log('='.repeat(50));
    console.log(`• Framework Health: ${frameworkHealth.toFixed(1)}%`);
    console.log(`• Widget Health: ${widgetHealth.toFixed(1)}%`);
    console.log(`• Overall Health: ${overallHealth.toFixed(1)}%`);
    
    // Show framework breakdown
    console.log('\n📋 FRAMEWORK BREAKDOWN:');
    console.log('='.repeat(50));
    data.results.forEach(result => {
      const status = result.ok ? '✅' : '❌';
      const fixes = result.summary.totalFixes > 0 ? ` (${result.summary.totalFixes} fixes)` : '';
      console.log(`${status} ${result.frameworkName}: ${result.summary.passedWidgets}/${result.summary.totalWidgets} widgets${fixes}`);
    });
    
    // Recommendations
    console.log('\n💡 RECOMMENDATIONS:');
    console.log('='.repeat(50));
    
    if (summary.failedFrameworks > 0) {
      console.log('❌ CRITICAL: Some frameworks have validation failures');
      console.log('   → Review failed frameworks and fix configuration issues');
    }
    
    if (summary.totalFixes > 0) {
      console.log('⚠️  WARNING: Auto-fixes were applied');
      console.log('   → Review applied fixes and consider manual configuration');
    }
    
    if (overallHealth >= 95) {
      console.log('✅ EXCELLENT: Widget integrity is in excellent condition');
    } else if (overallHealth >= 80) {
      console.log('🟡 GOOD: Widget integrity is good with minor issues');
    } else {
      console.log('🔴 POOR: Widget integrity needs attention');
    }
    
    // Exit with appropriate code
    if (summary.failedFrameworks > 0) {
      console.log('\n❌ Test failed: Some frameworks have validation errors');
      process.exit(1);
    } else {
      console.log('\n✅ Test passed: All frameworks are valid');
      process.exit(0);
    }
    
  } catch (error) {
    console.error('\n❌ Error running integrity test:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   → Ensure the development server is running (npm run dev)');
    console.log('   → Check that the API endpoint is accessible');
    console.log('   → Verify the BASE_URL environment variable if using a different server');
    process.exit(1);
  }
}

// Run the test
runIntegrityTest(); 