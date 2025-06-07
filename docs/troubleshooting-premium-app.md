# Troubleshooting Genesys Cloud Premium App Authentication

If you're encountering the error "Sorry, Genesys Cloud cannot authenticate you at this time" when using your application as a Premium App, follow this troubleshooting guide to resolve the issue.

## Common Causes and Solutions

### 1. Incorrect OAuth Permissions

**Problem**: The Premium App doesn't have the necessary permissions to access Genesys Cloud APIs.

**Solution**:
1. Go to Admin > Integrations > Premium Apps
2. Edit your Premium App configuration
3. Under "Permissions", ensure you have added ALL required scopes:
   - `analytics:read`
   - `user:read`
   - `organization:read`
   - `routing:read`
   - `conversation:read`
4. Save the changes and try again

### 2. Content Security Policy (CSP) Issues

**Problem**: Genesys Cloud's Content Security Policy is blocking your application's scripts or API calls.

**Solution**:
1. Ensure your application doesn't use inline scripts (use external .js files)
2. Check browser console for CSP violation errors
3. Update your hosting server to include proper CSP headers that allow Genesys Cloud domains
4. If using a CDN for scripts, ensure it's allowed in Genesys Cloud's CSP

### 3. Cross-Origin Resource Sharing (CORS) Issues

**Problem**: Your application's server doesn't allow requests from Genesys Cloud domains.

**Solution**:
1. Configure your web server to include proper CORS headers:
   ```
   Access-Control-Allow-Origin: *.pure.cloud
   Access-Control-Allow-Methods: GET, POST, OPTIONS
   Access-Control-Allow-Headers: Content-Type, Authorization
   ```
2. If using a cloud hosting service, check their documentation for CORS configuration

### 4. Authentication Token Handling

**Problem**: The application isn't properly accessing or using the authentication token from Genesys Cloud.

**Solution**:
1. Update the `getPremiumAppAuthToken` function to use the correct method for accessing the token
2. Ensure you're using the latest version of the Genesys Cloud Client SDK
3. Add more detailed logging to trace the authentication flow

### 5. Iframe Sandbox Restrictions

**Problem**: The iframe sandbox settings in the Premium App configuration are too restrictive.

**Solution**:
1. Edit your Premium App configuration
2. Under "Advanced", check the iframe sandbox options
3. Ensure these options are enabled:
   - `allow-same-origin`
   - `allow-scripts`
   - `allow-forms`
   - `allow-popups`

### 6. Group Access Permissions

**Problem**: The user doesn't belong to a group that has access to the Premium App.

**Solution**:
1. Edit your Premium App configuration
2. Under "Groups", ensure the appropriate groups are selected
3. Add the user to a group that has access to the Premium App

## Debugging Steps

1. **Enable Verbose Logging**:
   - Add detailed console logging throughout the authentication process
   - Check browser console for errors and warnings

2. **Test with Different Browsers**:
   - Try Chrome, Firefox, and Edge to rule out browser-specific issues

3. **Check Network Requests**:
   - Use browser developer tools to monitor network requests
   - Look for failed API calls or 401/403 errors

4. **Verify Environment Settings**:
   - Ensure you're using the correct Genesys Cloud environment (e.g., usw2.pure.cloud)
   - Check that environment variables are properly set

5. **Test in Standalone Mode**:
   - Test your application outside of Genesys Cloud to verify basic functionality

## Advanced Troubleshooting

### Using the Client App SDK

If you're still having issues, try using the official Genesys Cloud Client App SDK method:

```javascript
// In premiumAppIntegration.js
export const getPremiumAppAuthToken = async () => {
  if (!isRunningInGenesysCloud()) {
    return null;
  }
  
  try {
    const client = platformClient.ApiClient.instance;
    
    // Use the official Genesys Cloud Client App SDK method
    await client.setPersistSettings(true, 'your_app_name');
    
    // Try to authenticate using the client app SDK
    try {
      await client.authorizeByPersistentAuth();
      console.log('Successfully authenticated via persistent auth');
      
      if (client.authData?.accessToken) {
        return client.authData.accessToken;
      }
    } catch (authErr) {
      console.error('Error with persistent auth:', authErr);
    }
    
    return null;
  } catch (err) {
    console.error('Error getting Premium App auth token:', err);
    return null;
  }
};
```

### Contact Genesys Support

If you've tried all the above solutions and are still experiencing issues:

1. Gather detailed logs from your application
2. Take screenshots of any error messages
3. Document the steps you've taken to troubleshoot
4. Contact Genesys Cloud support with this information

## Premium App Requirements Checklist

Ensure your application meets these requirements:

- [ ] Hosted on HTTPS-enabled server
- [ ] Proper CORS configuration
- [ ] No inline scripts or styles
- [ ] Responsive design that works in iframe
- [ ] Proper error handling and user feedback
- [ ] Detailed logging for troubleshooting
- [ ] All required API permissions configured
