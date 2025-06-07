# Implementing as a Genesys Cloud Premium App

This guide explains how to implement the MD Anderson Cancer Center Reporting Tool as a Premium App within Genesys Cloud.

## What is a Genesys Cloud Premium App?

A Premium App is a custom application that can be embedded directly within the Genesys Cloud interface. This provides a seamless experience for users, as they can access your reporting tool without leaving Genesys Cloud.

## Implementation Steps

### 1. Prepare Your Application

1. **Build for Production**:
   ```bash
   npm run build
   ```
   This creates optimized files in the `dist` folder.

2. **Host Your Application**:
   - Deploy the contents of the `dist` folder to a web server
   - The hosting service must support HTTPS and CORS
   - Options include: Azure Web Apps, AWS S3 with CloudFront, Netlify, Vercel, etc.

### 2. Create a Premium App Integration in Genesys Cloud

1. **Log in to Genesys Cloud** as an administrator
2. Navigate to **Admin > Integrations > Premium Apps**
3. Click **+ New Premium App**
4. Fill in the required information:
   - **Name**: MD Anderson Reporting Tool
   - **Description**: Custom reporting application for MD Anderson Cancer Center
   - **Notes**: Internal reporting tool for contact center analytics
   - **Vendor**: MD Anderson Cancer Center
   - **Vendor Website**: https://www.mdanderson.org/

5. **Configure Application URL**:
   - Enter the URL where your application is hosted
   - Example: `https://your-hosting-service.com/mdacc-reporting/`

6. **Configure Application Type**:
   - Select "Custom" application type

7. **Configure Groups**:
   - Select which groups should have access to the application
   - Typically, you would select supervisor and administrator groups

8. **Configure Permissions**:
   - Add the same OAuth scopes used in your application:
     - `analytics:read`
     - `user:read`
     - `organization:read`
     - `routing:read`
     - `conversation:read`

9. **Advanced Configuration**:
   - **Iframe Sandbox Options**: Allow-same-origin, allow-scripts, allow-forms, allow-popups
   - **Group Filtering**: Enable if you want to restrict access by group

10. **Save** the Premium App configuration

### 3. Update Your Application for Premium App Context

Create a new utility file to handle Premium App integration:

```javascript
// src/utils/premiumAppIntegration.js
import platformClient from 'purecloud-platform-client-v2';

// Check if running inside Genesys Cloud iframe
export const isRunningInGenesysCloud = () => {
  return window.location !== window.parent.location;
};

// Initialize Premium App
export const initializePremiumApp = async () => {
  if (!isRunningInGenesysCloud()) {
    console.log('Not running inside Genesys Cloud');
    return false;
  }

  try {
    // Get the Premium App environment
    const pcEnv = await platformClient.PureCloudRegionHosts.getCurrentRegion();
    
    // Get the language from Genesys Cloud
    const language = await platformClient.ApiClient.instance.config.language;
    
    console.log('Running as Premium App in region:', pcEnv);
    console.log('User language:', language);
    
    return true;
  } catch (err) {
    console.error('Error initializing Premium App:', err);
    return false;
  }
};

// Get authentication token from Genesys Cloud
export const getPremiumAppAuthToken = async () => {
  if (!isRunningInGenesysCloud()) {
    return null;
  }
  
  try {
    // This will get the token from the parent Genesys Cloud application
    const client = platformClient.ApiClient.instance;
    return client.authData.accessToken;
  } catch (err) {
    console.error('Error getting Premium App auth token:', err);
    return null;
  }
};
```

### 4. Update Your Authentication Context

Modify your AuthContext to check if running as a Premium App:

```javascript
// In src/context/AuthContext.jsx
import { 
  isRunningInGenesysCloud, 
  initializePremiumApp, 
  getPremiumAppAuthToken 
} from '../utils/premiumAppIntegration';

// Inside the AuthProvider component
useEffect(() => {
  const checkAuth = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check if running as Premium App
      if (isRunningInGenesysCloud()) {
        // Initialize Premium App
        const initialized = await initializePremiumApp();
        
        if (initialized) {
          // Get token from Genesys Cloud
          const token = await getPremiumAppAuthToken();
          
          if (token) {
            // We have a token from Genesys Cloud
            const userDetails = await getUserDetails();
            setUser({
              id: userDetails.id,
              name: userDetails.name,
              email: userDetails.email,
              organization: userDetails.organization?.name || 'MDACC'
            });
            setIsAuthenticated(true);
            console.log('Successfully authenticated as Premium App');
          }
        }
      } else {
        // Regular authentication flow
        // ... existing code for handling OAuth callback
      }
    } catch (err) {
      // ... error handling
    } finally {
      setIsLoading(false);
    }
  };
  
  checkAuth();
}, []);
```

### 5. Test Your Premium App

1. After configuring the Premium App in Genesys Cloud, it will appear in the Apps menu
2. Click on your app in the Apps menu to launch it within Genesys Cloud
3. Verify that authentication works automatically (no login required)
4. Test all functionality to ensure it works within the Genesys Cloud iframe

## Troubleshooting Premium App Issues

### Common Issues:

1. **X-Frame-Options**: If your hosting service sets restrictive X-Frame-Options headers, Genesys Cloud won't be able to embed your app. Ensure your server allows embedding with appropriate headers.

2. **CORS Issues**: Your hosting service must allow requests from Genesys Cloud domains. Configure CORS to allow `*.pure.cloud` origins.

3. **Authentication Errors**: When running as a Premium App, authentication should be automatic. If you see login prompts, check that you're properly detecting the Premium App context.

4. **Content Security Policy**: Genesys Cloud has a strict CSP. Ensure your app doesn't use inline scripts or styles that might be blocked.

5. **Performance**: Premium Apps should load quickly. Optimize your bundle size and consider code splitting to improve load times.

### Testing Locally:

To test Premium App integration locally:

1. Run your app in development mode
2. Use browser developer tools to simulate running in an iframe
3. Mock the Genesys Cloud environment and authentication

## Best Practices for Premium Apps

1. **Responsive Design**: Ensure your app works well at different sizes as users can resize the Premium App panel.

2. **Error Handling**: Provide clear error messages specific to Premium App context.

3. **Logging**: Implement detailed logging to help troubleshoot issues in the Premium App environment.

4. **Version Information**: Display your app version to help with support and troubleshooting.

5. **Graceful Degradation**: If Premium App-specific features aren't available, fall back gracefully.
