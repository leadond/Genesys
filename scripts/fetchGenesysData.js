import { config, validateConfig } from '../src/config.js';
import { getAccessToken, getAllUsers, getAllQueues, getQueueMembers, transformUserData, transformQueueData } from '../src/genesysApi.js';
import { generateMockUsers, generateMockQueues, generateMockQueueMembers, simulatePagination } from '../src/mockData.js';
import { saveToJsonFile, displayUserSample, reportProgress, getCacheFilePath } from '../src/utils.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Main function to fetch data from Genesys Cloud
 */
async function fetchGenesysData() {
  try {
    // Validate configuration
    if (!validateConfig()) {
      process.exit(1);
    }
    
    // Create data directory if it doesn't exist
    const dataDir = path.join(__dirname, '..', config.outputDir);
    try {
      await fs.access(dataDir);
    } catch (error) {
      console.log('Creating data directory...');
      await fs.mkdir(dataDir, { recursive: true });
    }
    
    let users = [];
    let queues = [];
    let queueMembers = {};
    
    if (config.useMockData) {
      console.log('\n===== USING MOCK DATA =====');
      console.log('This script is running with mock data.');
      console.log('In a real environment, this would connect to the Genesys Cloud API.');
      console.log('===============================\n');
      
      // Simulate authentication delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Authentication successful! (simulated)');
      
      // Generate mock data
      users = generateMockUsers(config.mockUserCount);
      queues = generateMockQueues(Math.ceil(config.mockUserCount / 10));
      queueMembers = generateMockQueueMembers(queues, users);
      
      // Simulate pagination
      console.log('Fetching users... (simulated)');
      await simulatePagination(users, reportProgress);
      
      console.log('Fetching queues... (simulated)');
      await simulatePagination(queues, reportProgress);
      
      console.log(`Total users fetched: ${users.length}`);
      console.log(`Total queues fetched: ${queues.length}`);
      
      // Save data to JSON files
      await saveToJsonFile(getCacheFilePath(config.usersFile), users);
      await saveToJsonFile(getCacheFilePath(config.queuesFile), queues);
      await saveToJsonFile(getCacheFilePath(config.queueMembersFile), queueMembers);
      
      console.log('\n===== IMPORTANT NOTE =====');
      console.log('This is mock data for demonstration purposes only.');
      console.log('To fetch real data from Genesys Cloud:');
      console.log('1. Run this script in a local Node.js environment (not WebContainer)');
      console.log('2. Set USE_MOCK_DATA to false in the .env file or environment');
      console.log('3. Ensure your Genesys Cloud credentials are correct');
      console.log('===============================\n');
      
    } else {
      // Real API implementation
      try {
        // Get access token
        const token = await getAccessToken();
        
        // Fetch users
        console.log('Fetching users from Genesys Cloud API...');
        const rawUsers = await getAllUsers(token, reportProgress);
        users = transformUserData(rawUsers);
        console.log(`Total users fetched: ${users.length}`);
        
        // Fetch queues
        console.log('Fetching queues from Genesys Cloud API...');
        const rawQueues = await getAllQueues(token);
        queues = transformQueueData(rawQueues);
        console.log(`Total queues fetched: ${queues.length}`);
        
        // Fetch queue members
        console.log('Fetching queue members...');
        queueMembers = {};
        for (const queue of queues) {
          console.log(`Fetching members for queue: ${queue.name} (${queue.id})`);
          const members = await getQueueMembers(token, queue.id);
          queueMembers[queue.id] = members;
          
          // Add a small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        // Save data to JSON files
        await saveToJsonFile(getCacheFilePath(config.usersFile), users);
        await saveToJsonFile(getCacheFilePath(config.queuesFile), queues);
        await saveToJsonFile(getCacheFilePath(config.queueMembersFile), queueMembers);
        
      } catch (apiError) {
        handleApiError(apiError);
        return;
      }
    }
    
    // Display sample of users
    displayUserSample(users);
    
  } catch (error) {
    console.error('Unexpected error:', error.message);
    if (error.stack) console.error(error.stack);
    process.exit(1);
  }
}

/**
 * Handle API-specific errors
 * @param {Error} error - The error object
 */
function handleApiError(error) {
  console.error('Error:', error.message);
  
  if (error.message.includes('socket hang up') || error.message.includes('timeout')) {
    console.error('\n===== NETWORK CONNECTION ISSUE =====');
    console.error('This script is attempting to connect to the Genesys Cloud API, but is encountering network issues.');
    console.error('Possible causes:');
    console.error('1. WebContainer limitations: WebContainer has restrictions on certain external API calls');
    console.error('2. Network connectivity: Check your internet connection');
    console.error('3. API endpoint availability: Verify the Genesys Cloud API is accessible');
    console.error('\nRecommendations:');
    console.error('- Run this script in a local Node.js environment outside of WebContainer');
    console.error('- Verify your Genesys Cloud credentials and region settings');
    console.error('- Check if your organization has IP restrictions for API access');
    console.error('===============================\n');
  } else if (error.message.includes('401')) {
    console.error('\n===== AUTHENTICATION ERROR =====');
    console.error('Failed to authenticate with Genesys Cloud. Please check your credentials.');
    console.error('1. Verify your CLIENT_ID and CLIENT_SECRET in the .env file');
    console.error('2. Ensure your OAuth client is properly configured in Genesys Cloud');
    console.error('3. Check that your client has the necessary permissions');
    console.error('===============================\n');
  } else if (error.message.includes('403')) {
    console.error('\n===== PERMISSION ERROR =====');
    console.error('Your OAuth client does not have permission to access the requested resources.');
    console.error('Please ensure your client has the following permissions:');
    console.error('- users:read');
    console.error('- routing:read');
    console.error('===============================\n');
  }
}

// Execute the main function
fetchGenesysData();
