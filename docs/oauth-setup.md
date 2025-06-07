# Genesys Cloud OAuth Setup Guide

## Setting Up OAuth for Implicit Grant Flow

For the MD Anderson Cancer Center Genesys Cloud Reporting Tool to work correctly, you need to set up an OAuth client in Genesys Cloud with the proper configuration:

### 1. Create an OAuth Client

1. Log in to your Genesys Cloud Admin account
2. Navigate to Admin > Integrations > OAuth
3. Click "Add Client"
4. Enter a name for your client (e.g., "MD Anderson Reporting Tool")
5. For Grant Type, select "Token Implicit Grant (Browser)" - this is critical for browser-based applications
6. Add the following redirect URI:
   - The exact URL where your application is running (e.g., `http://localhost:5173/`)
   - Make sure there are no trailing spaces
   - You may need multiple redirect URIs for different environments (development, staging, production)

### 2. Required OAuth Scopes

Add the following scopes to your OAuth client:

- `analytics:read` - For accessing analytics data
- `user:read` - For reading user information
- `organization:read` - For reading organization information
- `routing:read` - For reading queue information
- `conversation:read` - For reading conversation data

### 3. Important Configuration Notes

- **Client ID**: `08ecd21e-f558-425f-9a99-89decf6be851`
- **Authorization URL**: `https://apps.usw2.pure.cloud/directory/#/admin/integrations/authorized-apps/08ecd21e-f558-425f-9a99-89decf6be851`
- **No Client Secret**: Implicit grant does not use a client secret in the browser
- **Token Duration**: The default token expiration is typically 24 hours
- **State Parameter**: For security, the application uses a random state parameter to prevent CSRF attacks

### 4. Troubleshooting OAuth Issues

If you encounter authentication errors:

1. **Redirect URI Mismatch**: Ensure the exact URL of your application is listed in the allowed redirect URIs
2. **Missing Scopes**: Verify all required scopes are added to your OAuth client
3. **Client Status**: Make sure your OAuth client is active and not expired
4. **Environment**: Confirm you're using the correct Genesys Cloud environment (e.g., `usw2.pure.cloud`)
5. **Browser Issues**: Clear browser cache and cookies if you encounter persistent issues
6. **CORS**: If you see CORS errors, ensure your application is running on an allowed domain

### 5. Testing Your OAuth Configuration

Use the Test Connection page in the application to verify your OAuth setup is working correctly. This will:

1. Redirect you to Genesys Cloud for authentication
2. Request the necessary permissions
3. Redirect back to your application with an access token
4. Verify the token works by making a test API call

If successful, you'll see a confirmation message and can proceed to use the application.
