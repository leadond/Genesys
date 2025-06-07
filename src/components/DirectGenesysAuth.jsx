import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import styled from 'styled-components'
import { FaSpinner, FaExclamationTriangle, FaMicrosoft, FaExternalLinkAlt } from 'react-icons/fa'
import mdaccLogo from '../assets/mdacc-logo.png'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
`

const Logo = styled.div`
  margin-bottom: 20px;
  
  img {
    height: 60px;
  }
`

const Title = styled.h2`
  color: var(--primary);
  margin-bottom: 10px;
`

const Subtitle = styled.div`
  color: var(--text-secondary);
  margin-bottom: 20px;
  font-size: 0.9rem;
`

const Button = styled.button`
  background-color: #0078d4;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 20px 0;

  &:hover {
    background-color: #106ebe;
  }

  &:disabled {
    background-color: var(--disabled);
    cursor: not-allowed;
  }
`

const Spinner = styled(FaSpinner)`
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`

const ErrorMessage = styled.div`
  background-color: var(--error-bg);
  color: var(--error-text);
  padding: 15px;
  border-radius: 4px;
  margin: 20px 0;
  max-width: 500px;
  text-align: left;
  display: flex;
  gap: 10px;
  align-items: flex-start;
  
  .icon {
    color: var(--error-icon);
    font-size: 1.2rem;
    margin-top: 2px;
  }
  
  .content {
    flex: 1;
  }
`

const InfoBox = styled.div`
  background-color: var(--info-bg);
  color: var(--info-text);
  padding: 15px;
  border-radius: 4px;
  margin: 20px 0;
  max-width: 500px;
  text-align: left;
  font-size: 0.9rem;
`

const PremiumAppMessage = styled.div`
  background-color: var(--primary-light);
  color: var(--primary-dark);
  padding: 15px;
  border-radius: 4px;
  margin: 20px 0;
  max-width: 500px;
  display: flex;
  gap: 10px;
  align-items: center;
  
  .icon {
    font-size: 1.2rem;
  }
`

const DirectGenesysAuth = () => {
  const { login, isAuthenticated, isLoading, error, isPremiumApp } = useAuth()
  const [isInitiating, setIsInitiating] = useState(false)
  const [manualLoginAttempted, setManualLoginAttempted] = useState(false)
  const clientId = import.meta.env.VITE_GENESYS_CLIENT_ID
  
  // Auto-initiate login if not authenticated
  useEffect(() => {
    const initiateLogin = async () => {
      if (!isAuthenticated && !isLoading && !isInitiating && !error && !manualLoginAttempted) {
        setIsInitiating(true)
        try {
          await login(clientId)
        } finally {
          setIsInitiating(false)
          setManualLoginAttempted(true)
        }
      }
    }
    
    // Wait a moment to allow any existing auth to be detected
    const timer = setTimeout(() => {
      initiateLogin()
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [isAuthenticated, isLoading, isInitiating, error, login, clientId, manualLoginAttempted])
  
  // If already authenticated, don't show anything
  if (isAuthenticated) {
    return null
  }
  
  const handleManualLogin = async () => {
    setIsInitiating(true)
    try {
      await login(clientId)
    } finally {
      setIsInitiating(false)
      setManualLoginAttempted(true)
    }
  }
  
  return (
    <Container>
      <Logo>
        <img src={mdaccLogo} alt="MD Anderson Cancer Center" />
      </Logo>
      
      <Title>Genesys Cloud Reporting</Title>
      <Subtitle>MDACC Organization • West Region</Subtitle>
      
      {isPremiumApp && (
        <PremiumAppMessage>
          <div className="icon">
            <FaExternalLinkAlt />
          </div>
          <div>
            <p><strong>Running as Genesys Cloud Premium App</strong></p>
            <p>Authentication should happen automatically through Genesys Cloud.</p>
          </div>
        </PremiumAppMessage>
      )}
      
      {(isLoading || isInitiating) ? (
        <div>
          <p>Connecting to Genesys Cloud...</p>
          <Spinner size={24} />
        </div>
      ) : (
        <>
          <p>
            You need to authenticate with Genesys Cloud to access the reporting application.
            Click the button below to log in with your Microsoft credentials.
          </p>
          
          <Button 
            onClick={handleManualLogin}
            disabled={isLoading || isInitiating}
          >
            {isLoading || isInitiating ? (
              <>
                <Spinner />
                Connecting...
              </>
            ) : (
              <>
                <FaMicrosoft />
                Login with Microsoft SSO
              </>
            )}
          </Button>
          
          {error && (
            <ErrorMessage>
              <div className="icon">
                <FaExclamationTriangle />
              </div>
              <div className="content">
                <p><strong>Authentication Error:</strong></p>
                <p>{error}</p>
                <p>Please check your client ID and try again.</p>
              </div>
            </ErrorMessage>
          )}
          
          <InfoBox>
            <p><strong>Note:</strong> This application connects to the Genesys Cloud West Region (usw2.pure.cloud) for the MDACC organization. If you're having trouble logging in, please contact your system administrator.</p>
          </InfoBox>
        </>
      )}
    </Container>
  )
}

export default DirectGenesysAuth
