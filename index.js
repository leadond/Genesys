import { config, validateConfig } from './src/config.js';
import { authenticate, fetchUsersWithPagination, transformUserData } from './src/api.js';
import { generateMockUsers, simulatePagination } from './src/mockData.js';
import { saveToJsonFile, displayUserSample, reportProgress } from './src/utils.js';

/**
 * Main function to fetch users from Genesys Cloud
 */
async function fetchUsers() {
  try {
    // Validate configuration
    if (!validateConfig()) {
      process.exit(1);
    }
    
    let users = [];
    
    if (config.useMockData) {
      console.log('\n===== USING MOCK DATA =====');
      console.log('This script is running with mock data.');
      console.log('In a real environment, this would connect to the Genesys Cloud API.');
      console.log('===============================\n');
      
      // Simulate authentication delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Authentication successful! (simulated)');
      
      console.log('Fetching users... (simulated)');
      
      // Generate mock data
      const mockUsers = generateMockUsers(config.mockUserCount);
      
      // Simulate pagination
      await simulatePagination(mockUsers, reportProgress);
      
      console.log(`Total users fetched: ${mockUsers.length}`);
      users = mockUsers;
      
      // Save all users to a JSON file
      await saveToJsonFile(config.mockOutputFile, users);
      
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
        // Authenticate with Genesys Cloud
        const client = await authenticate();
        
        // Fetch users with pagination
        console.log('Fetching users from Genesys Cloud API...');
        const rawUsers = await fetchUsersWithPagination(client, reportProgress);
        
        // Transform user data to consistent format
        users = transformUserData(rawUsers);
        
        console.log(`Total users fetched: ${users.length}`);
        
        // Save all users to a JSON file
        await saveToJsonFile(config.outputFile, users);
        
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
  } else if (error.body && error.body.message) {
    console.error('API Error:', error.body.message);
    if (error.body.code) console.error('Error Code:', error.body.code);
  }
}

// Execute the main function
fetchUsers();
