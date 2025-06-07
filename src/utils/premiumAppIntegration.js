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
    console.log('Initializing Premium App integration');
    
    // Get the Premium App environment
    const pcEnv = await platformClient.PureCloudRegionHosts.getCurrentRegion();
    console.log('Premium App region:', pcEnv);
    
    // Set the environment explicitly
    const client = platformClient.ApiClient.instance;
    client.setEnvironment(pcEnv);
    
    // Get the language from Genesys Cloud
    const language = client.config?.language;
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
    console.log('Not running in Genesys Cloud, cannot get Premium App token');
    return null;
  }
  
  try {
    console.log('Attempting to get Premium App auth token');
    
    // This will get the token from the parent Genesys Cloud application
    const client = platformClient.ApiClient.instance;
    
    // Check if we already have a token
    if (client.authData?.accessToken) {
      console.log('Found existing token in client.authData');
      return client.authData.accessToken;
    }
    
    // Try to get the token from the parent window
    console.log('Attempting to get token from parent window');
    
    // Use the official Genesys Cloud Client App SDK method
    await platformClient.ApiClient.instance.setPersistSettings(true, 'mdacc_reporting_app');
    
    // Try to authenticate using the client app SDK
    try {
      await client.authorizeByPersistentAuth();
      console.log('Successfully authenticated via persistent auth');
      
      if (client.authData?.accessToken) {
        console.log('Token obtained via persistent auth');
        return client.authData.accessToken;
      }
    } catch (authErr) {
      console.error('Error with persistent auth:', authErr);
    }
    
    console.error('No token available from Premium App context');
    return null;
  } catch (err) {
    console.error('Error getting Premium App auth token:', err);
    return null;
  }
};

// Get Genesys Cloud environment when running as Premium App
export const getPremiumAppEnvironment = () => {
  try {
    if (!isRunningInGenesysCloud()) {
      return null;
    }
    
    return platformClient.ApiClient.instance.environment;
  } catch (err) {
    console.error('Error getting Premium App environment:', err);
    return null;
  }
};

// Get user language from Genesys Cloud
export const getPremiumAppLanguage = () => {
  try {
    if (!isRunningInGenesysCloud()) {
      return null;
    }
    
    return platformClient.ApiClient.instance.config?.language || 'en-us';
  } catch (err) {
    console.error('Error getting Premium App language:', err);
    return 'en-us';
  }
};
