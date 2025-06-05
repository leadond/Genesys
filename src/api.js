import platformClient from 'purecloud-platform-client-v2';
import { config } from './config.js';

/**
 * Authenticate with Genesys Cloud
 * @returns {Object} Authenticated client
 */
export async function authenticate() {
  console.log('Authenticating with Genesys Cloud...');
  console.log(`Region: ${config.region}`);
  console.log(`Client ID: ${config.clientId.substring(0, 8)}...`);
  
  const client = platformClient.ApiClient.instance;
  client.setEnvironment(platformClient.PureCloudRegionHosts[config.region]);
  
  try {
    await client.loginClientCredentialsGrant(config.clientId, config.clientSecret);
    console.log('Authentication successful!');
    return client;
  } catch (error) {
    console.error('Authentication failed:', error.message);
    throw error;
  }
}

/**
 * Fetch users from Genesys Cloud with pagination
 * @param {Object} client - Authenticated client
 * @param {Function} progressCallback - Callback for reporting progress
 * @returns {Array} Array of users
 */
export async function fetchUsersWithPagination(client, progressCallback) {
  const usersApi = new platformClient.UsersApi();
  const users = [];
  
  let pageCount = 1;
  let pageSize = config.pageSize;
  let pageNumber = 1;
  let totalPages = 1;
  let totalFetched = 0;
  
  console.log(`Fetching users with page size: ${pageSize}`);
  
  try {
    do {
      // Apply retry logic for API calls
      const pageData = await retryApiCall(() => 
        usersApi.getUsers({
          pageSize: pageSize,
          pageNumber: pageNumber,
          expand: ['presence', 'conversationSummary', 'outOfOffice', 'geolocation', 'station', 'authorization']
        })
      );
      
      if (pageData && pageData.entities) {
        users.push(...pageData.entities);
        totalFetched += pageData.entities.length;
        
        // Update pagination info
        pageSize = pageData.pageSize;
        pageNumber = pageData.pageNumber;
        totalPages = pageData.pageCount;
        
        // Report progress
        if (progressCallback) {
          progressCallback(pageNumber, pageData.entities.length, totalFetched, pageData.total);
        }
        
        // Check if we've reached the maximum number of pages to fetch
        if (config.maxPages > 0 && pageNumber >= config.maxPages) {
          console.log(`Reached maximum number of pages (${config.maxPages})`);
          break;
        }
        
        pageNumber++;
      } else {
        break;
      }
    } while (pageNumber <= totalPages);
    
    return users;
  } catch (error) {
    console.error('Error fetching users:', error.message);
    throw error;
  }
}

/**
 * Retry an API call with exponential backoff
 * @param {Function} apiCall - Function that makes the API call
 * @returns {Promise} Promise that resolves with the API response
 */
async function retryApiCall(apiCall) {
  let retries = 0;
  let lastError = null;
  
  while (retries < config.maxRetries) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;
      
      // Check if error is retryable
      if (error.status === 429 || error.status >= 500) {
        retries++;
        const delay = config.retryDelay * Math.pow(2, retries - 1);
        console.log(`API call failed, retrying in ${delay}ms (${retries}/${config.maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        // Non-retryable error
        throw error;
      }
    }
  }
  
  // If we've exhausted all retries
  console.error(`Failed after ${config.maxRetries} retries`);
  throw lastError;
}

/**
 * Transform raw user data to a consistent format
 * @param {Array} rawUsers - Raw user data from API
 * @returns {Array} Transformed user data
 */
export function transformUserData(rawUsers) {
  return rawUsers.map(user => ({
    id: user.id,
    name: `${user.name?.firstName || ''} ${user.name?.lastName || ''}`.trim(),
    email: user.email,
    username: user.username,
    department: user.department,
    title: user.title,
    state: user.state,
    // Add additional fields as needed
    presence: user.presence?.presenceDefinition?.systemPresence,
    createdDate: user.dateCreated,
    lastModifiedDate: user.dateModified,
    manager: user.manager ? {
      id: user.manager.id,
      name: user.manager.name
    } : null
  }));
}
