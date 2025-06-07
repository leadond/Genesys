import platformClient from 'purecloud-platform-client-v2'

// Initialize the API client
const initializeClient = (environment) => {
  const client = platformClient.ApiClient.instance
  client.setEnvironment(environment)
  return client
}

// Authenticate with client credentials
const authenticateClient = async (clientId, clientSecret) => {
  const client = platformClient.ApiClient.instance
  
  // Clear any existing auth data
  client.authData = null
  
  try {
    await client.loginClientCredentialsGrant(clientId, clientSecret)
    return client.authData.accessToken
  } catch (err) {
    console.error('Authentication failed:', err)
    throw err
  }
}

// Test connection to Genesys Cloud
const testConnection = async (clientId, clientSecret, environment) => {
  try {
    // Initialize client with environment
    const client = platformClient.ApiClient.instance
    client.setEnvironment(environment)
    
    // Clear any existing auth data
    client.authData = null
    
    // Attempt to authenticate
    await client.loginClientCredentialsGrant(clientId, clientSecret)
    
    // If successful, return success message
    return {
      success: true,
      message: 'Successfully connected to Genesys Cloud',
      token: client.authData.accessToken
    }
  } catch (err) {
    // Return detailed error information
    return {
      success: false,
      message: err.message || 'Authentication failed',
      details: err.body || err,
      status: err.status || 'unknown'
    }
  }
}

// Get user details
const getUserDetails = async () => {
  try {
    const usersApi = new platformClient.UsersApi()
    return await usersApi.getUsersMe({ expand: ['organization'] })
  } catch (err) {
    console.error('Failed to get user details:', err)
    throw err
  }
}

// Get queues
const getQueues = async () => {
  try {
    const routingApi = new platformClient.RoutingApi()
    const result = await routingApi.getRoutingQueues({ pageSize: 100 })
    return result.entities
  } catch (err) {
    console.error('Failed to get queues:', err)
    throw err
  }
}

// Get queue observations (real-time metrics)
const getQueueObservations = async (queueIds) => {
  try {
    const analyticsApi = new platformClient.AnalyticsApi()
    
    const body = {
      filter: {
        type: 'or',
        predicates: queueIds.map(id => ({
          type: 'dimension',
          dimension: 'queueId',
          operator: 'equal',
          value: id
        }))
      },
      metrics: [
        'oServiceLevel',
        'oWaiting',
        'oInteracting',
        'oOnHold'
      ]
    }
    
    const result = await analyticsApi.postAnalyticsQueuesObservationsQuery(body)
    return result.data
  } catch (err) {
    console.error('Failed to get queue observations:', err)
    throw err
  }
}

// Get conversation details
const getConversationDetails = async (startDate, endDate, pageSize = 100, pageNumber = 1) => {
  try {
    const analyticsApi = new platformClient.AnalyticsApi()
    
    const body = {
      interval: `${startDate.toISOString()}/${endDate.toISOString()}`,
      order: 'desc',
      orderBy: 'conversationStart',
      paging: {
        pageSize,
        pageNumber
      }
    }
    
    const result = await analyticsApi.postAnalyticsConversationsDetailsQuery(body)
    return result
  } catch (err) {
    console.error('Failed to get conversation details:', err)
    throw err
  }
}

// Get agent details
const getAgentDetails = async (startDate, endDate, userIds) => {
  try {
    const analyticsApi = new platformClient.AnalyticsApi()
    
    const body = {
      interval: `${startDate.toISOString()}/${endDate.toISOString()}`,
      userIds,
      metrics: [
        'nOffered',
        'nHandled',
        'tHandle',
        'tTalk',
        'tHold',
        'tAcw',
        'oServiceLevel',
        'oUserRoutingStatus'
      ]
    }
    
    const result = await analyticsApi.postAnalyticsUsersDetailsQuery(body)
    return result
  } catch (err) {
    console.error('Failed to get agent details:', err)
    throw err
  }
}

// Get queue performance metrics
const getQueuePerformance = async (startDate, endDate, queueIds) => {
  try {
    const analyticsApi = new platformClient.AnalyticsApi()
    
    const body = {
      interval: `${startDate.toISOString()}/${endDate.toISOString()}`,
      groupBy: ['queueId'],
      filter: {
        type: 'or',
        predicates: queueIds.map(id => ({
          type: 'dimension',
          dimension: 'queueId',
          operator: 'equal',
          value: id
        }))
      },
      metrics: [
        'nOffered',
        'nAnswered',
        'nAbandoned',
        'tAnswered',
        'tAbandon',
        'tHandle',
        'tTalk',
        'tHold',
        'tAcw',
        'oServiceLevel'
      ]
    }
    
    const result = await analyticsApi.postAnalyticsQueuesAggregatesQuery(body)
    return result
  } catch (err) {
    console.error('Failed to get queue performance:', err)
    throw err
  }
}

export {
  initializeClient,
  authenticateClient,
  testConnection,
  getUserDetails,
  getQueues,
  getQueueObservations,
  getConversationDetails,
  getAgentDetails,
  getQueuePerformance
}
