import fetch from 'node-fetch';
import { config } from './config.js';

/**
 * Get an access token from Genesys Cloud
 * @returns {Promise<string>} Access token
 */
export async function getAccessToken() {
  console.log('Getting access token from Genesys Cloud...');
  console.log(`Region: ${config.region}`);
  console.log(`Organization: ${config.organization}`);
  console.log(`Client ID: ${config.clientId.substring(0, 8)}...`);
  
  // Determine the login URL based on region
  const loginUrl = getLoginUrl(config.region);
  
  try {
    const response = await fetch(`${loginUrl}/oauth/token`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Organization': config.organization
      },
      body: `grant_type=client_credentials&client_id=${config.clientId}&client_secret=${config.clientSecret}`
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get access token: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Successfully obtained access token');
    return data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error.message);
    throw error;
  }
}

/**
 * Get all users from Genesys Cloud with pagination
 * @param {string} token - Access token
 * @param {Function} progressCallback - Callback for reporting progress
 * @returns {Promise<Array>} Array of users
 */
export async function getAllUsers(token, progressCallback) {
  const apiUrl = getApiUrl(config.region);
  const users = [];
  let pageNumber = 1;
  let hasMore = true;
  let totalFetched = 0;
  
  console.log(`Fetching users from Genesys Cloud API (${apiUrl})...`);
  
  try {
    while (hasMore) {
      // Apply retry logic for API calls
      const pageData = await retryApiCall(async () => {
        const response = await fetch(
          `${apiUrl}/api/v2/users?pageSize=${config.pageSize}&pageNumber=${pageNumber}&expand=presence,routingStatus,conversationSummary,outOfOffice,geolocation,station,authorization`,
          {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'X-Organization': config.organization
            }
          }
        );
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch users: ${response.status} ${response.statusText} - ${errorText}`);
        }
        
        return await response.json();
      });
      
      if (pageData && pageData.entities && pageData.entities.length > 0) {
        users.push(...pageData.entities);
        totalFetched += pageData.entities.length;
        
        // Report progress
        if (progressCallback) {
          progressCallback(pageNumber, pageData.entities.length, totalFetched, pageData.total);
        }
        
        // Check if we've reached the maximum number of pages to fetch
        if (config.maxPages > 0 && pageNumber >= config.maxPages) {
          console.log(`Reached maximum number of pages (${config.maxPages})`);
          hasMore = false;
        } else if (pageData.pageCount && pageNumber >= pageData.pageCount) {
          // No more pages
          hasMore = false;
        } else {
          pageNumber++;
        }
      } else {
        // No more data
        hasMore = false;
      }
    }
    
    console.log(`Total users fetched: ${users.length}`);
    return users;
  } catch (error) {
    console.error('Error fetching users:', error.message);
    throw error;
  }
}

/**
 * Get all queues from Genesys Cloud
 * @param {string} token - Access token
 * @returns {Promise<Array>} Array of queues
 */
export async function getAllQueues(token) {
  const apiUrl = getApiUrl(config.region);
  const queues = [];
  let pageNumber = 1;
  let hasMore = true;
  
  console.log(`Fetching queues from Genesys Cloud API...`);
  
  try {
    while (hasMore) {
      // Apply retry logic for API calls
      const pageData = await retryApiCall(async () => {
        const response = await fetch(
          `${apiUrl}/api/v2/routing/queues?pageSize=${config.pageSize}&pageNumber=${pageNumber}`,
          {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'X-Organization': config.organization
            }
          }
        );
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch queues: ${response.status} ${response.statusText} - ${errorText}`);
        }
        
        return await response.json();
      });
      
      if (pageData && pageData.entities && pageData.entities.length > 0) {
        queues.push(...pageData.entities);
        
        // Check if we've reached the maximum number of pages to fetch
        if (config.maxPages > 0 && pageNumber >= config.maxPages) {
          console.log(`Reached maximum number of pages (${config.maxPages})`);
          hasMore = false;
        } else if (pageData.pageCount && pageNumber >= pageData.pageCount) {
          // No more pages
          hasMore = false;
        } else {
          pageNumber++;
        }
      } else {
        // No more data
        hasMore = false;
      }
    }
    
    console.log(`Total queues fetched: ${queues.length}`);
    return queues;
  } catch (error) {
    console.error('Error fetching queues:', error.message);
    throw error;
  }
}

/**
 * Get members of a queue
 * @param {string} token - Access token
 * @param {string} queueId - Queue ID
 * @returns {Promise<Array>} Array of queue members
 */
export async function getQueueMembers(token, queueId) {
  const apiUrl = getApiUrl(config.region);
  
  try {
    // Apply retry logic for API calls
    const data = await retryApiCall(async () => {
      const response = await fetch(
        `${apiUrl}/api/v2/routing/queues/${queueId}/members`,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'X-Organization': config.organization
          }
        }
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch queue members: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      return await response.json();
    });
    
    return data.entities || [];
  } catch (error) {
    console.error(`Error fetching members for queue ${queueId}:`, error.message);
    return [];
  }
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
    // Add additional fields
    presence: user.presence?.presenceDefinition?.systemPresence,
    routingStatus: user.routingStatus?.status,
    phoneNumber: user.primaryContactInfo?.find(contact => contact.type === 'PHONE')?.address,
    createdDate: user.dateCreated,
    lastModifiedDate: user.dateModified,
    manager: user.manager ? {
      id: user.manager.id,
      name: user.manager.name
    } : null
  }));
}

/**
 * Transform raw queue data to a consistent format
 * @param {Array} rawQueues - Raw queue data from API
 * @returns {Array} Transformed queue data
 */
export function transformQueueData(rawQueues) {
  return rawQueues.map(queue => ({
    id: queue.id,
    name: queue.name,
    description: queue.description,
    dateModified: queue.dateModified,
    memberCount: queue.memberCount || 0,
    mediaSettings: queue.mediaSettings || {}
  }));
}

/**
 * Get the login URL for the specified region
 * @param {string} region - Genesys Cloud region
 * @returns {string} Login URL
 */
function getLoginUrl(region) {
  const regionMap = {
    'us-east-1': 'https://login.mypurecloud.com',
    'us-west-2': 'https://login.usw2.pure.cloud',
    'us-west': 'https://login.usw2.pure.cloud', // Alias for us-west-2
    'eu-west-1': 'https://login.mypurecloud.ie',
    'ap-southeast-2': 'https://login.mypurecloud.com.au',
    'ap-northeast-1': 'https://login.mypurecloud.jp',
    'eu-central-1': 'https://login.mypurecloud.de',
    'ca-central-1': 'https://login.cac1.pure.cloud',
    'ap-northeast-2': 'https://login.apne2.pure.cloud',
    'eu-west-2': 'https://login.euw2.pure.cloud',
    'ap-south-1': 'https://login.aps1.pure.cloud',
    'us-east-2': 'https://login.use2.pure.cloud',
    'sa-east-1': 'https://login.sae1.pure.cloud'
  };
  
  return regionMap[region] || 'https://login.mypurecloud.com';
}

/**
 * Get the API URL for the specified region
 * @param {string} region - Genesys Cloud region
 * @returns {string} API URL
 */
function getApiUrl(region) {
  const regionMap = {
    'us-east-1': 'https://api.mypurecloud.com',
    'us-west-2': 'https://api.usw2.pure.cloud',
    'us-west': 'https://api.usw2.pure.cloud', // Alias for us-west-2
    'eu-west-1': 'https://api.mypurecloud.ie',
    'ap-southeast-2': 'https://api.mypurecloud.com.au',
    'ap-northeast-1': 'https://api.mypurecloud.jp',
    'eu-central-1': 'https://api.mypurecloud.de',
    'ca-central-1': 'https://api.cac1.pure.cloud',
    'ap-northeast-2': 'https://api.apne2.pure.cloud',
    'eu-west-2': 'https://api.euw2.pure.cloud',
    'ap-south-1': 'https://api.aps1.pure.cloud',
    'us-east-2': 'https://api.use2.pure.cloud',
    'sa-east-1': 'https://api.sae1.pure.cloud'
  };
  
  return regionMap[region] || 'https://api.mypurecloud.com';
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
      
      // Check if error is retryable (rate limit or server error)
      if (error.message.includes('429') || error.message.includes('5')) {
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
