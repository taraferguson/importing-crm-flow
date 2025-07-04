# 🚀 Quick Google API Setup

## ⚡ Fast Setup (5 minutes)

### Step 1: Create Google Cloud Project
1. **Click here**: [Google Cloud Console](https://console.developers.google.com/)
2. Click "Select a project" → "New Project"
3. Name: `CRM Onboarding Flow`
4. Click "Create"

### Step 2: Enable People API
1. **Click here**: [Google People API](https://console.developers.google.com/apis/library/people.googleapis.com)
2. Click "Enable"

### Step 3: Create API Key
1. **Click here**: [Create API Key](https://console.developers.google.com/apis/credentials)
2. Click "Create Credentials" → "API Key"
3. Copy the key (looks like: `AIzaSyC...`)

### Step 4: Create OAuth Client ID
1. **Click here**: [Create OAuth Client](https://console.developers.google.com/apis/credentials/oauthclient)
2. Application type: "Web application"
3. Name: "CRM Onboarding Flow"
4. Authorized origins: `http://localhost:4200`
5. Authorized redirect URIs: `http://localhost:4200`
6. Copy the Client ID (looks like: `123456789-abc...`)

### Step 5: Update Config
Replace the values in `src/app/config/google-api.config.ts`:

```typescript
export const GOOGLE_API_CONFIG = {
  apiKey: 'YOUR_API_KEY_HERE',        // From Step 3
  clientId: 'YOUR_CLIENT_ID_HERE',    // From Step 4
  scope: 'https://www.googleapis.com/auth/contacts.readonly',
  discoveryDocs: ['https://people.googleapis.com/$discovery/rest?version=v1']
};
```

### Step 6: Test
```bash
npm start
```
Then go to the onboarding flow and test the Google import!

## 🔧 Alternative: Run Setup Script
```bash
node setup-google-api.js
```

## 🆘 Need Help?
- Check the browser console for errors
- Ensure you have contacts in your Google account
- Verify the API key and client ID are correct
- Make sure your domain is in authorized origins 