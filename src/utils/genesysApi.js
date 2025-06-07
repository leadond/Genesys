import platformClient from 'purecloud-platform-client-v2'

// Initialize the API client
const initializeClient = (environment) => {
  const client = platformClient.ApiClient.instance
  client.setEnvironment(environment)
  return client
}

// Start authentication with Genesys Cloud using implicit grant
// This will redirect to Microsoft SSO when configured properly in Genesys
const startAuthentication = async (clientId, redirectUri, environment) => {
  try {
    console.log('Starting authentication with:', { clientId, redirectUri, environment })
    
    // Initialize client with environment
    const client = platformClient.ApiClient.instance
    client.setEnvironment(environment)
    
    // Clear any existing auth data
    client.authData = null
    
    // Generate a random state parameter for security
    const state = Math.random().toString(36).substring(2, 15)
    sessionStorage.setItem('genesysAuthState', state)
    
    // Start the implicit grant flow - this will redirect to Microsoft SSO
    await client.loginImplicitGrant(clientId, redirectUri, { state })
    
    // This code won't execute due to the redirect
    return {
      success: true,
      message: 'Redirecting to authentication...'
    }
  } catch (err) {
    console.error('Authentication error:', err)
    return {
      success: false,
      message: err.message || 'Authentication failed',
      details: err
    }
  }
}

// Handle the OAuth callback and extract the token
const handleImplicitCallback = () => {
  if (window.location.hash && window.location.hash.includes('access_token')) {
    try {
      const params = new URLSearchParams(window.location.hash.substring(1))
      const token = params.get('access_token')
      const state = params.get('state')
      const error = params.get('error')
      const expiresIn = params.get('expires_in')
      
      // Check for error in callback
      if (error) {
        console.error('Error in OAuth callback:', error, params.get('error_description'))
        return null
      }
      
      // Validate state if it exists
      const savedState = sessionStorage.getItem('genesysAuthState')
      if (state && savedState && state !== savedState) {
        console.error('State mismatch in OAuth callback')
        return null
      }
      
      // Clear saved state
      sessionStorage.removeItem('genesysAuthState')
      
      if (token) {
        const client = platformClient.ApiClient.instance
        
        // Set the token directly
        client.setAccessToken(token)
        
        // Create a minimal authData object
        client.authData = {
          accessToken: token,
          refreshToken: '',  // Empty string to prevent null reference errors
          state: state || '',
          tokenExpiryTime: expiresIn ? Date.now() + (parseInt(expiresIn) * 1000) : null
        }
        
        // Store token expiry in sessionStorage for persistence
        if (expiresIn) {
          sessionStorage.setItem('genesysTokenExpiry', (Date.now() + (parseInt(expiresIn) * 1000)).toString())
        }
        
        return token
      }
    } catch (err) {
      console.error('Error processing OAuth callback:', err)
    }
  }
  return null
}

// Check if token is expired
const isTokenExpired = () => {
  const expiryTime = sessionStorage.getItem('genesysTokenExpiry')
  if (!expiryTime) return true
  
  return Date.now() > parseInt(expiryTime)
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

// Logout from Genesys Cloud
const logout = () => {
  try {
    const client = platformClient.ApiClient.instance
    
    // Clear auth data
    if (client) {
      client.authData = null
    }
    
    // Clear any session storage
    sessionStorage.removeItem('genesysAuthState')
    sessionStorage.removeItem('genesysTokenExpiry')
    
    return true
  } catch (err) {
    console.error('Logout error:', err)
    return false
  }
}

// Test connection to Genesys Cloud
const testConnection = async (clientId, redirectUri, environment) => {
  try {
    // Initialize client with environment
    const client = platformClient.ApiClient.instance
    client.setEnvironment(environment)
    
    // Start the implicit grant flow
    await client.loginImplicitGrant(clientId, redirectUri)
    
    // This code won't execute due to the redirect
    return {
      success: true,
      message: 'Redirecting to authentication...'
    }
  } catch (err) {
    console.error('Test connection error:', err)
    return {
      success: false,
      message: err.message || 'Connection test failed',
      details: err
    }
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

export {
  initializeClient,
  startAuthentication,
  getUserDetails,
  getQueues,
  getQueueObservations,
  handleImplicitCallback,
  isTokenExpired,
  logout,
  testConnection
}
