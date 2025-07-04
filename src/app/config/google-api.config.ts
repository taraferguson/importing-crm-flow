export const GOOGLE_API_CONFIG = {
  // 🔑 REPLACE THESE WITH YOUR ACTUAL CREDENTIALS 🔑
  // Get them from: https://console.developers.google.com/
  
  // API Key (looks like: AIzaSyC...)
  apiKey: 'YOUR_GOOGLE_API_KEY',
  
  // OAuth 2.0 Client ID (looks like: 123456789-abc...)
  clientId: 'YOUR_GOOGLE_CLIENT_ID',
  
  // These are the required scopes for reading contacts
  scope: 'https://www.googleapis.com/auth/contacts.readonly',
  
  // Discovery document for People API
  discoveryDocs: ['https://people.googleapis.com/$discovery/rest?version=v1']
};

// 🚀 QUICK SETUP:
// 1. Go to: https://console.developers.google.com/
// 2. Create project → Enable People API → Create credentials
// 3. Replace the values above with your actual credentials
// 4. Add http://localhost:4200 to authorized origins

// Instructions for setting up Google API:
// 1. Go to https://console.developers.google.com/
// 2. Create a new project or select an existing one
// 3. Enable the Google People API
// 4. Create credentials (API Key and OAuth 2.0 Client ID)
// 5. Replace the placeholder values above with your actual credentials
// 6. Add your domain to the authorized origins in OAuth consent screen 