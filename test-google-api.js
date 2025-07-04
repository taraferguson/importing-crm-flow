#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧪 Google API Credentials Test');
console.log('==============================\n');

// Read the config file
const configPath = path.join(__dirname, 'src', 'app', 'config', 'google-api.config.ts');
const configContent = fs.readFileSync(configPath, 'utf8');

// Extract API key and client ID
const apiKeyMatch = configContent.match(/apiKey:\s*['"`]([^'"`]+)['"`]/);
const clientIdMatch = configContent.match(/clientId:\s*['"`]([^'"`]+)['"`]/);

const apiKey = apiKeyMatch ? apiKeyMatch[1] : null;
const clientId = clientIdMatch ? clientIdMatch[1] : null;

console.log('📋 Current Configuration:');
console.log('========================');

if (apiKey && apiKey !== 'YOUR_GOOGLE_API_KEY') {
  console.log('✅ API Key: Configured');
  console.log(`   Format: ${apiKey.substring(0, 10)}...`);
} else {
  console.log('❌ API Key: Not configured');
  console.log('   Expected format: AIzaSyC...');
}

if (clientId && clientId !== 'YOUR_GOOGLE_CLIENT_ID') {
  console.log('✅ Client ID: Configured');
  console.log(`   Format: ${clientId.substring(0, 15)}...`);
} else {
  console.log('❌ Client ID: Not configured');
  console.log('   Expected format: 123456789-abc...');
}

console.log('\n🔧 Next Steps:');
console.log('==============');

if (!apiKey || apiKey === 'YOUR_GOOGLE_API_KEY' || !clientId || clientId === 'YOUR_GOOGLE_CLIENT_ID') {
  console.log('1. Follow the setup guide in QUICK_SETUP.md');
  console.log('2. Or run: node setup-google-api.js');
  console.log('3. Update the credentials in src/app/config/google-api.config.ts');
} else {
  console.log('✅ Credentials appear to be configured!');
  console.log('1. Start the app: npm start');
  console.log('2. Test the Google import feature');
  console.log('3. Check browser console for any errors');
}

console.log('\n📚 Documentation:');
console.log('=================');
console.log('- Quick Setup: QUICK_SETUP.md');
console.log('- Detailed Guide: GOOGLE_API_SETUP.md');
console.log('- Google Cloud Console: https://console.developers.google.com/'); 