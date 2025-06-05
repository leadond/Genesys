import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './src/config.js';
import { loadFromJsonFile, isCacheValid, getCacheFilePath } from './src/utils.js';
import { generateMockUsers, generateMockQueues, generateMockQueueMembers } from './src/mockData.js';
import { getAccessToken, getAllUsers, getAllQueues, getQueueMembers, transformUserData, transformQueueData } from './src/genesysApi.js';

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = config.port;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to check and refresh cache if needed
async function checkAndRefreshCache(req, res, next) {
  try {
    // Skip cache refresh for non-API routes
    if (!req.path.startsWith('/api')) {
      return next();
    }
    
    // Check if cache is valid
    const usersValid = await isCacheValid(config.usersFile);
    const queuesValid = await isCacheValid(config.queuesFile);
    const membersValid = await isCacheValid(config.queueMembersFile);
    
    // If all caches are valid, proceed
    if (usersValid && queuesValid && membersValid) {
      return next();
    }
    
    console.log('Cache is invalid or expired, refreshing data...');
    
    if (config.useMockData) {
      // Generate mock data
      const users = generateMockUsers(config.mockUserCount);
      const queues = generateMockQueues(Math.ceil(config.mockUserCount / 10));
      const queueMembers = generateMockQueueMembers(queues, users);
      
      // Save to cache
      await fs.mkdir(path.join(__dirname, config.outputDir), { recursive: true });
      await fs.writeFile(getCacheFilePath(config.usersFile), JSON.stringify(users, null, 2));
      await fs.writeFile(getCacheFilePath(config.queuesFile), JSON.stringify(queues, null, 2));
      await fs.writeFile(getCacheFilePath(config.queueMembersFile), JSON.stringify(queueMembers, null, 2));
      
      console.log('Mock data cache refreshed');
    } else {
      try {
        // Get access token
        const token = await getAccessToken();
        
        // Fetch and save users
        if (!usersValid) {
          console.log('Refreshing users cache...');
          const rawUsers = await getAllUsers(token);
          const users = transformUserData(rawUsers);
          await fs.mkdir(path.join(__dirname, config.outputDir), { recursive: true });
          await fs.writeFile(getCacheFilePath(config.usersFile), JSON.stringify(users, null, 2));
        }
        
        // Fetch and save queues
        if (!queuesValid) {
          console.log('Refreshing queues cache...');
          const rawQueues = await getAllQueues(token);
          const queues = transformQueueData(rawQueues);
          await fs.mkdir(path.join(__dirname, config.outputDir), { recursive: true });
          await fs.writeFile(getCacheFilePath(config.queuesFile), JSON.stringify(queues, null, 2));
        }
        
        // Fetch and save queue members
        if (!membersValid) {
          console.log('Refreshing queue members cache...');
          const queues = await loadFromJsonFile(getCacheFilePath(config.queuesFile), []);
          const queueMembers = {};
          
          for (const queue of queues) {
            const members = await getQueueMembers(token, queue.id);
            queueMembers[queue.id] = members;
            await new Promise(resolve => setTimeout(resolve, 100)); // Small delay to avoid rate limiting
          }
          
          await fs.mkdir(path.join(__dirname, config.outputDir), { recursive: true });
          await fs.writeFile(getCacheFilePath(config.queueMembersFile), JSON.stringify(queueMembers, null, 2));
        }
        
        console.log('API data cache refreshed');
      } catch (error) {
        console.error('Error refreshing cache:', error.message);
        // Continue with potentially stale data rather than failing
      }
    }
    
    next();
  } catch (error) {
    console.error('Error in cache middleware:', error.message);
    next();
  }
}

// Apply middleware
app.use(checkAndRefreshCache);

// API endpoint to get users
app.get('/api/users', async (req, res) => {
  try {
    // Load users from cache
    const users = await loadFromJsonFile(getCacheFilePath(config.usersFile), []);
    
    // Add pagination support
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    // Apply filters if provided
    let filteredUsers = users;
    
    if (req.query.department) {
      filteredUsers = filteredUsers.filter(user => 
        (user.department || 'Unassigned').toLowerCase() === req.query.department.toLowerCase()
      );
    }
    
    if (req.query.state) {
      filteredUsers = filteredUsers.filter(user => 
        (user.state || '').toLowerCase() === req.query.state.toLowerCase()
      );
    }
    
    if (req.query.search) {
      const search = req.query.search.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        (user.name || '').toLowerCase().includes(search) ||
        (user.email || '').toLowerCase().includes(search) ||
        (user.username || '').toLowerCase().includes(search) ||
        (user.department || '').toLowerCase().includes(search)
      );
    }
    
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    
    // Send response with pagination metadata
    res.json({
      total: filteredUsers.length,
      page,
      limit,
      totalPages: Math.ceil(filteredUsers.length / limit),
      data: paginatedUsers
    });
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// API endpoint to get user by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const users = await loadFromJsonFile(getCacheFilePath(config.usersFile), []);
    const user = users.find(u => u.id === req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// API endpoint to get queues
app.get('/api/queues', async (req, res) => {
  try {
    const queues = await loadFromJsonFile(getCacheFilePath(config.queuesFile), []);
    
    // Add pagination support
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    // Apply filters if provided
    let filteredQueues = queues;
    
    if (req.query.search) {
      const search = req.query.search.toLowerCase();
      filteredQueues = filteredQueues.filter(queue => 
        (queue.name || '').toLowerCase().includes(search) ||
        (queue.description || '').toLowerCase().includes(search)
      );
    }
    
    const paginatedQueues = filteredQueues.slice(startIndex, endIndex);
    
    // Send response with pagination metadata
    res.json({
      total: filteredQueues.length,
      page,
      limit,
      totalPages: Math.ceil(filteredQueues.length / limit),
      data: paginatedQueues
    });
  } catch (error) {
    console.error('Error fetching queues:', error.message);
    res.status(500).json({ error: 'Failed to fetch queues' });
  }
});

// API endpoint to get queue by ID
app.get('/api/queues/:id', async (req, res) => {
  try {
    const queues = await loadFromJsonFile(getCacheFilePath(config.queuesFile), []);
    const queue = queues.find(q => q.id === req.params.id);
    
    if (!queue) {
      return res.status(404).json({ error: 'Queue not found' });
    }
    
    // Get queue members
    const queueMembers = await loadFromJsonFile(getCacheFilePath(config.queueMembersFile), {});
    const members = queueMembers[req.params.id] || [];
    
    // Add members to queue object
    const queueWithMembers = {
      ...queue,
      members
    };
    
    res.json(queueWithMembers);
  } catch (error) {
    console.error('Error fetching queue:', error.message);
    res.status(500).json({ error: 'Failed to fetch queue' });
  }
});

// API endpoint to get queue members
app.get('/api/queues/:id/members', async (req, res) => {
  try {
    const queueMembers = await loadFromJsonFile(getCacheFilePath(config.queueMembersFile), {});
    const members = queueMembers[req.params.id] || [];
    
    res.json({
      queueId: req.params.id,
      total: members.length,
      data: members
    });
  } catch (error) {
    console.error('Error fetching queue members:', error.message);
    res.status(500).json({ error: 'Failed to fetch queue members' });
  }
});

// API endpoint to get user statistics
app.get('/api/stats', async (req, res) => {
  try {
    const users = await loadFromJsonFile(getCacheFilePath(config.usersFile), []);
    const queues = await loadFromJsonFile(getCacheFilePath(config.queuesFile), []);
    
    // Calculate department statistics
    const departmentStats = {};
    users.forEach(user => {
      const dept = user.department || 'Unassigned';
      if (!departmentStats[dept]) {
        departmentStats[dept] = 0;
      }
      departmentStats[dept]++;
    });
    
    // Calculate state statistics
    const stateStats = {};
    users.forEach(user => {
      const state = user.state || 'unknown';
      if (!stateStats[state]) {
        stateStats[state] = 0;
      }
      stateStats[state]++;
    });
    
    // Calculate presence statistics
    const presenceStats = {};
    users.forEach(user => {
      const presence = user.presence || 'unknown';
      if (!presenceStats[presence]) {
        presenceStats[presence] = 0;
      }
      presenceStats[presence]++;
    });
    
    // Calculate queue statistics
    const queueStats = {
      total: queues.length,
      byType: {}
    };
    
    queues.forEach(queue => {
      // Determine queue type based on media settings
      let queueType = 'unknown';
      if (queue.mediaSettings) {
        if (queue.mediaSettings.voice?.enabled) queueType = 'voice';
        else if (queue.mediaSettings.chat?.enabled) queueType = 'chat';
        else if (queue.mediaSettings.email?.enabled) queueType = 'email';
        else if (queue.mediaSettings.social?.enabled) queueType = 'social';
        else if (queue.mediaSettings.callback?.enabled) queueType = 'callback';
      }
      
      if (!queueStats.byType[queueType]) {
        queueStats.byType[queueType] = 0;
      }
      queueStats.byType[queueType]++;
    });
    
    res.json({
      totalUsers: users.length,
      departments: departmentStats,
      states: stateStats,
      presence: presenceStats,
      queues: queueStats,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching stats:', error.message);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// API endpoint to get system info
app.get('/api/system', async (req, res) => {
  try {
    res.json({
      useMockData: config.useMockData,
      region: config.region,
      cacheExpiration: config.cacheExpiration,
      serverTime: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching system info:', error.message);
    res.status(500).json({ error: 'Failed to fetch system information' });
  }
});

// Catch-all route to serve the main index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API endpoints:`);
  console.log(`- GET /api/users - Get all users (paginated)`);
  console.log(`- GET /api/users/:id - Get user by ID`);
  console.log(`- GET /api/queues - Get all queues (paginated)`);
  console.log(`- GET /api/queues/:id - Get queue by ID with members`);
  console.log(`- GET /api/queues/:id/members - Get queue members`);
  console.log(`- GET /api/stats - Get user and queue statistics`);
  console.log(`- GET /api/system - Get system information`);
  console.log(`\nNote: Using ${config.useMockData ? 'MOCK' : 'REAL'} data`);
  
  if (!config.useMockData) {
    console.log(`\nConnecting to Genesys Cloud region: ${config.region}`);
    console.log(`Client ID: ${config.clientId.substring(0, 8)}...`);
  }
});
