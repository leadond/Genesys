import { createContext, useContext, useState, useEffect } from 'react'
import platformClient from 'purecloud-platform-client-v2'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)
  const [detailedError, setDetailedError] = useState(null)
  
  // Initialize the SDK on component mount
  useEffect(() => {
    const client = platformClient.ApiClient.instance
    
    // Get environment from env variable
    const environment = import.meta.env.VITE_GENESYS_ENVIRONMENT || 'usw2.pure.cloud'
    console.log('Using Genesys environment:', environment)
    
    // Set environment directly instead of using PureCloudRegionHosts enum
    client.setEnvironment(environment)
    
    // Check if we have an existing token in session storage
    const token = sessionStorage.getItem('genesys_token')
    
    if (token) {
      client.setAccessToken(token)
      fetchUserDetails()
    } else {
      setIsLoading(false)
    }
  }, [])
  
  const fetchUserDetails = async () => {
    try {
      const usersApi = new platformClient.UsersApi()
      const userDetails = await usersApi.getUsersMe({ expand: ['authorization'] })
      
      setUser({
        id: userDetails.id,
        name: `${userDetails.name}`,
        email: userDetails.email,
        roles: userDetails.authorization?.roles || []
      })
      
      setIsAuthenticated(true)
      setError(null)
      setDetailedError(null)
    } catch (err) {
      console.error('Error fetching user details:', err)
      sessionStorage.removeItem('genesys_token')
      setError('Session expired. Please login again.')
      setDetailedError(JSON.stringify(err, Object.getOwnPropertyNames(err), 2))
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }
  
  const login = async (clientId, clientSecret) => {
    setIsLoading(true)
    setError(null)
    setDetailedError(null)
    
    try {
      console.log('Attempting to authenticate with Genesys Cloud...')
      console.log('Client ID:', clientId)
      console.log('Client Secret:', clientSecret.substring(0, 3) + '...' + clientSecret.substring(clientSecret.length - 3))
      
      const client = platformClient.ApiClient.instance
      
      // Clear any existing auth data
      client.authData = null
      
      await client.loginClientCredentialsGrant(clientId, clientSecret)
      
      console.log('Authentication successful')
      
      // Store token in session storage
      const token = client.authData.accessToken
      sessionStorage.setItem('genesys_token', token)
      
      await fetchUserDetails()
    } catch (err) {
      console.error('Login error:', err)
      
      // Extract more detailed error information
      let errorMessage = 'Invalid credentials. Please try again.'
      let detailedErrorInfo = null
      
      if (err.body && err.body.message) {
        errorMessage = err.body.message
      } else if (err.message) {
        errorMessage = err.message
      }
      
      // Capture the full error object for debugging
      detailedErrorInfo = JSON.stringify(err, Object.getOwnPropertyNames(err), 2)
      
      setError(errorMessage)
      setDetailedError(detailedErrorInfo)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }
  
  const logout = () => {
    sessionStorage.removeItem('genesys_token')
    setIsAuthenticated(false)
    setUser(null)
    setError(null)
    setDetailedError(null)
    
    // Redirect to login page will happen via protected route
  }
  
  const value = {
    isAuthenticated,
    isLoading,
    user,
    error,
    detailedError,
    login,
    logout
  }
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
