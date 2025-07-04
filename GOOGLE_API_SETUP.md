# Google API Setup for Contacts Import

This guide will help you set up Google API credentials to enable the "Import from Google Contacts" feature.

## Prerequisites

- A Google account
- Access to Google Cloud Console

## Step-by-Step Setup

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Click "Select a project" → "New Project"
3. Enter a project name (e.g., "CRM Onboarding Flow")
4. Click "Create"

### 2. Enable the Google People API

1. In your project, go to "APIs & Services" → "Library"
2. Search for "Google People API"
3. Click on it and press "Enable"

### 3. Create API Credentials

#### Create an API Key:
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key"
3. Copy the generated API key
4. (Optional) Click "Restrict Key" to limit its usage to your domain

#### Create OAuth 2.0 Client ID:
1. Click "Create Credentials" → "OAuth 2.0 Client IDs"
2. If prompted, configure the OAuth consent screen:
   - User Type: External
   - App name: Your app name
   - User support email: Your email
   - Developer contact information: Your email
3. Back to creating OAuth client ID:
   - Application type: Web application
   - Name: "CRM Onboarding Flow Web Client"
   - Authorized JavaScript origins: Add your domain (e.g., `http://localhost:4200` for development)
   - Authorized redirect URIs: Add your domain (e.g., `http://localhost:4200`)
4. Click "Create" and copy the Client ID

### 4. Configure the Application

1. Open `src/app/config/google-api.config.ts`
2. Replace the placeholder values:
   ```typescript
   export const GOOGLE_API_CONFIG = {
     apiKey: 'YOUR_ACTUAL_API_KEY_HERE',
     clientId: 'YOUR_ACTUAL_CLIENT_ID_HERE',
     scope: 'https://www.googleapis.com/auth/contacts.readonly',
     discoveryDocs: ['https://people.googleapis.com/$discovery/rest?version=v1']
   };
   ```

### 5. Test the Integration

1. Start your Angular application: `npm start`
2. Navigate to the onboarding flow
3. Complete the flow to reach step 6 (Success)
4. Click "Import from Google Contacts"
5. You should see a Google sign-in popup
6. After signing in, your contacts will be imported and transformed into speakers

## Security Notes

- **Never commit API keys to version control**
- Consider using environment variables for production
- Restrict API keys to specific domains/IPs
- Regularly rotate your credentials

## Troubleshooting

### "Google API not initialized" Error
- Check that the Google API script is loading properly
- Verify your API key and client ID are correct
- Ensure the Google People API is enabled

### "User not signed in" Error
- The OAuth consent screen might need configuration
- Check that your domain is in the authorized origins
- Try clearing browser cache and cookies

### "No contacts found" Message
- Ensure you have contacts in your Google account
- Check that the contacts have names and at least email or phone
- Verify the API has the correct permissions

### CORS Issues
- Make sure your domain is in the authorized origins
- For development, use `http://localhost:4200`
- For production, use your actual domain

## Production Deployment

For production deployment:

1. Update the OAuth consent screen with your production domain
2. Add your production domain to authorized origins
3. Consider using environment variables for credentials
4. Set up proper CORS headers on your server
5. Test the integration thoroughly in production environment

## API Quotas and Limits

- Google People API has quotas for requests per day
- Monitor usage in Google Cloud Console
- Consider implementing rate limiting for heavy usage
- Free tier includes 10,000 requests per day

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify all setup steps were completed correctly
3. Test with a simple Google API example first
4. Check Google Cloud Console for API usage and errors 