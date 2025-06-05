import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables from .env file
dotenv.config();

// Configuration object
export const config = {
  // API credentials
  clientId: process.env.CLIENT_ID || 'your_client_id',
  clientSecret: process.env.CLIENT_SECRET || 'your_client_secret',
  region: process.env.REGION || 'us-west-2',
  organization: process.env.ORGANIZATION || '',
  
  // Output file paths
  outputDir: process.env.OUTPUT_DIR || 'data',
  usersFile: process.env.USERS_FILE || 'users.json',
  queuesFile: process.env.QUEUES_FILE || 'queues.json',
  queueMembersFile: process.env.QUEUE_MEMBERS_FILE || 'queue-members.json',
  
  // Mock data settings
  useMockData: process.env.USE_MOCK_DATA === 'true',
  mockUserCount: parseInt(process.env.MOCK_USER_COUNT || '100', 10),
  
  // API settings
  pageSize: parseInt(process.env.PAGE_SIZE || '100', 10),
  maxPages: parseInt(process.env.MAX_PAGES || '0', 10), // 0 means no limit
  
  // Retry settings
  maxRetries: parseInt(process.env.MAX_RETRIES || '3', 10),
  retryDelay: parseInt(process.env.RETRY_DELAY || '1000', 10),
  
  // Cache settings
  cacheExpiration: parseInt(process.env.CACHE_EXPIRATION || '3600000', 10), // 1 hour in milliseconds
  
  // Server settings
  port: parseInt(process.env.PORT || '3000', 10),
  
  // Get full file path
  getFilePath(filename) {
    return path.join(__dirname, '..', this.outputDir, filename);
  }
};

/**
 * Validate the configuration
 * @returns {boolean} True if configuration is valid
 */
export function validateConfig() {
  let isValid = true;
  
  // If using real data, validate API credentials
  if (!config.useMockData) {
    if (!config.clientId || config.clientId === 'your_client_id') {
      console.error('Error: CLIENT_ID is required in .env file');
      isValid = false;
    }
    
    if (!config.clientSecret || config.clientSecret === 'your_client_secret') {
      console.error('Error: CLIENT_SECRET is required in .env file');
      isValid = false;
    }
    
    if (!config.region) {
      console.error('Error: REGION is required in .env file');
      isValid = false;
    }
    
    if (!config.organization) {
      console.error('Error: ORGANIZATION is required in .env file');
      isValid = false;
    }
  }
  
  return isValid;
}
