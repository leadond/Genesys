import { createContext, useContext, useState, useEffect } from 'react'
import { 
  startAuthentication, 
  getUserDetails, 
  handleImplicitCallback, 
  isTokenExpired,
  logout as apiLogout,
  initializeClient
} from '../utils/genesysApi'
import {
  isRunningInGenesysCloud,
  initializePremiumApp,
  getPremiumAppAuthToken,
  getPremiumAppEnvironment
} from '../utils/premiumAppIntegration'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)
  const [detailedError, setDetailedError] = useState(null)
  const [isPremiumApp, setIsPremiumApp] = useState(false)
  
  // Check for authentication on initial load and handle OAuth callback
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true)
        setError(null)
        setDetailedError(null)
        
        // Check if running as Premium App
        if (isRunningInGenesysCloud()) {
          console.log('Running inside Genesys Cloud - initializing as Premium App')
          setIsPremiumApp(true)
          
          // Initialize Premium App
          const initialized = await initializePremiumApp()
          
          if (initialized) {
            // Get environment from Premium App context
            const environment = getPremiumAppEnvironment() || import.meta.env.VITE_GENESYS_ENVIRONMENT || 'usw2.pure.cloud'
            console.log('Using environment:', environment)
            
            // Initialize client with the correct environment
            initializeClient(environment)
            
            // Get token from Genesys Cloud
            const token = await getPremiumAppAuthToken()
            
            if (token) {
              console.log('Token obtained from Genesys Cloud Premium App context')
              
              try {
                // We have a token from Genesys Cloud
                const userDetails = await getUserDetails()
                setUser({
                  id: userDetails.id,
                  name: userDetails.name,
                  email: userDetails.email,
                  organization: userDetails.organization?.name || 'MDACC'
                })
                setIsAuthenticated(true)
                console.log('Successfully authenticated as Premium App')
              } catch (userErr) {
                console.error('Error getting user details:', userErr)
                setError('Failed to get user details. The token may be invalid or expired.')
                setDetailedError(JSON.stringify(userErr, Object.getOwnPropertyNames(userErr), 2))
                setIsAuthenticated(false)
              }
            } else {
              console.error('No token available from Premium App context')
              setError('Failed to get authentication token from Genesys Cloud. Please ensure you have the correct permissions.')
              setIsAuthenticated(false)
            }
          } else {
            console.error('Failed to initialize as Premium App')
            setError('Failed to initialize as Genesys Cloud Premium App. Please check your configuration.')
            setIsAuthenticated(false)
          }
        } else {
          // Regular authentication flow - check if we're returning from an OAuth redirect
          const token = handleImplicitCallback()
          
          if (token) {
            console.log('Token found in URL, fetching user details')
            // We have a token, get user details
            const userDetails = await getUserDetails()
            setUser({
              id: userDetails.id,
              name: userDetails.name,
              email: userDetails.email,
              organization: userDetails.organization?.name || 'MDACC'
            })
            setIsAuthenticated(true)
            console.log('Successfully authenticated with Genesys Cloud')
          } else if (!isTokenExpired()) {
            console.log('Existing token found, fetching user details')
            // We have a valid token in storage
            const userDetails = await getUserDetails()
            setUser({
              id: userDetails.id,
              name: userDetails.name,
              email: userDetails.email,
              organization: userDetails.organization?.name || 'MDACC'
            })
            setIsAuthenticated(true)
            console.log('Successfully authenticated with existing token')
          } else {
            console.log('No valid token found, user needs to authenticate')
            setIsAuthenticated(false)
          }
        }
      } catch (err) {
        console.error('Authentication check failed:', err)
        setError('Failed to authenticate with Genesys Cloud: ' + (err.message || 'Unknown error'))
        setDetailedError(JSON.stringify(err, Object.getOwnPropertyNames(err), 2))
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }
    
    checkAuth()
  }, [])
  
  // Login function
  const login = async (clientId) => {
    try {
      setIsLoading(true)
      setError(null)
      setDetailedError(null)
      
      // If running as Premium App, we shouldn't need to login manually
      if (isPremiumApp) {
        console.log('Running as Premium App - attempting to get token from Genesys Cloud')
        const token = await getPremiumAppAuthToken()
        
        if (token) {
          const userDetails = await getUserDetails()
          setUser({
            id: userDetails.id,
            name: userDetails.name,
            email: userDetails.email,
            organization: userDetails.organization?.name || 'MDACC'
          })
          setIsAuthenticated(true)
          return true
        } else {
          throw new Error('Failed to get authentication token from Genesys Cloud')
        }
      }
      
      // Regular login flow for standalone app
      // Get the current URL for the redirect
      const redirectUri = `${window.location.origin}${window.location.pathname}`
      
      // Start the authentication process
      console.log('Starting authentication with client ID:', clientId)
      const result = await startAuthentication(
        clientId, 
        redirectUri,
        import.meta.env.VITE_GENESYS_ENVIRONMENT || 'usw2.pure.cloud'
      )
      
      if (!result.success) {
        throw new Error(result.message || 'Authentication failed')
      }
      
      // The page will redirect to Microsoft SSO, so we won't reach here
      return true
    } catch (err) {
      console.error('Login error:', err)
      setError(err.message || 'Failed to authenticate with Genesys Cloud')
      setDetailedError(JSON.stringify(err, Object.getOwnPropertyNames(err), 2))
      return false
    } finally {
      setIsLoading(false)
    }
  }
  
  // Logout function
  const logout = () => {
    try {
      // If running as Premium App, we can't fully log out
      if (isPremiumApp) {
        console.log('Running as Premium App - cannot fully log out')
        setError('When running as a Premium App, you cannot log out separately from Genesys Cloud')
        return false
      }
      
      apiLogout()
      setIsAuthenticated(false)
      setUser(null)
      return true
    } catch (err) {
      console.error('Logout error:', err)
      return false
    }
  }
  
  const value = {
    isAuthenticated,
    isLoading,
    user,
    error,
    detailedError,
    isPremiumApp,
    login,
    logout
  }
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
