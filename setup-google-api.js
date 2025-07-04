#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Google API Setup Assistant');
console.log('=============================\n');

console.log('This script will help you set up Google API credentials for the CRM onboarding flow.\n');

console.log('📋 Prerequisites:');
console.log('1. A Google account');
console.log('2. Access to Google Cloud Console (https://console.developers.google.com/)');
console.log('3. Basic knowledge of web development\n');

console.log('🔧 Setup Steps:');
console.log('1. Create a Google Cloud Project');
console.log('2. Enable the Google People API');
console.log('3. Create API credentials (API Key and OAuth 2.0 Client ID)');
console.log('4. Configure the application\n');

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setupGoogleAPI() {
  try {
    console.log('\n📝 Step 1: Google Cloud Project Setup');
    console.log('=====================================');
    console.log('1. Go to https://console.developers.google.com/');
    console.log('2. Click "Select a project" → "New Project"');
    console.log('3. Enter a project name (e.g., "CRM Onboarding Flow")');
    console.log('4. Click "Create"\n');
    
    await question('Press Enter when you have created the project...');
    
    console.log('\n📝 Step 2: Enable Google People API');
    console.log('===================================');
    console.log('1. In your project, go to "APIs & Services" → "Library"');
    console.log('2. Search for "Google People API"');
    console.log('3. Click on it and press "Enable"\n');
    
    await question('Press Enter when you have enabled the Google People API...');
    
    console.log('\n📝 Step 3: Create API Credentials');
    console.log('=================================');
    console.log('You need to create two types of credentials:\n');
    
    console.log('🔑 API Key:');
    console.log('1. Go to "APIs & Services" → "Credentials"');
    console.log('2. Click "Create Credentials" → "API Key"');
    console.log('3. Copy the generated API key');
    console.log('4. (Optional) Click "Restrict Key" to limit usage\n');
    
    const apiKey = await question('Enter your API Key: ');
    
    console.log('\n🔐 OAuth 2.0 Client ID:');
    console.log('1. Click "Create Credentials" → "OAuth 2.0 Client IDs"');
    console.log('2. If prompted, configure the OAuth consent screen:');
    console.log('   - User Type: External');
    console.log('   - App name: Your app name');
    console.log('   - User support email: Your email');
    console.log('   - Developer contact information: Your email');
    console.log('3. Back to creating OAuth client ID:');
    console.log('   - Application type: Web application');
    console.log('   - Name: "CRM Onboarding Flow Web Client"');
    console.log('   - Authorized JavaScript origins: Add http://localhost:4200');
    console.log('   - Authorized redirect URIs: Add http://localhost:4200');
    console.log('4. Click "Create" and copy the Client ID\n');
    
    const clientId = await question('Enter your OAuth 2.0 Client ID: ');
    
    console.log('\n📝 Step 4: Update Configuration');
    console.log('==============================');
    
    // Update the config file
    const configPath = path.join(__dirname, 'src', 'app', 'config', 'google-api.config.ts');
    const configContent = `export const GOOGLE_API_CONFIG = {
  // Google API credentials for contacts import
  apiKey: '${apiKey}',
  clientId: '${clientId}',
  
  // These are the required scopes for reading contacts
  scope: 'https://www.googleapis.com/auth/contacts.readonly',
  
  // Discovery document for People API
  discoveryDocs: ['https://people.googleapis.com/$discovery/rest?version=v1']
};

// Instructions for setting up Google API:
// 1. Go to https://console.developers.google.com/
// 2. Create a new project or select an existing one
// 3. Enable the Google People API
// 4. Create credentials (API Key and OAuth 2.0 Client ID)
// 5. Replace the placeholder values above with your actual credentials
// 6. Add your domain to the authorized origins in OAuth consent screen
`;

    fs.writeFileSync(configPath, configContent);
    
    console.log('✅ Configuration file updated successfully!');
    console.log(`📁 File: ${configPath}\n`);
    
    console.log('📝 Step 5: Test the Integration');
    console.log('===============================');
    console.log('1. Start your Angular application: npm start');
    console.log('2. Navigate to the onboarding flow');
    console.log('3. Complete the flow to reach step 6 (Success)');
    console.log('4. Click "Import from Google Contacts"');
    console.log('5. You should see a Google sign-in popup');
    console.log('6. After signing in, your contacts will be imported\n');
    
    console.log('🔒 Security Notes:');
    console.log('- Never commit API keys to version control');
    console.log('- Consider using environment variables for production');
    console.log('- Restrict API keys to specific domains/IPs');
    console.log('- Regularly rotate your credentials\n');
    
    console.log('🎉 Setup Complete!');
    console.log('Your Google API integration is now ready to use.');
    
  } catch (error) {
    console.error('❌ Error during setup:', error);
  } finally {
    rl.close();
  }
}

setupGoogleAPI(); 