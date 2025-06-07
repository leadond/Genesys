import { useEffect, useState } from 'react'
import { useAuth } from './context/AuthContext'
import styled from 'styled-components'
import mdaccLogo from '/assets/md-anderson-logo.png'
import { FaExclamationTriangle } from 'react-icons/fa'

function App() {
  const { isAuthenticated, isLoading, user, error, detailedError, login, logout } = useAuth()
  const [showDetails, setShowDetails] = useState(false)
  const [loginAttempted, setLoginAttempted] = useState(false)

  // Attempt background login on component mount
  useEffect(() => {
    const attemptBackgroundLogin = async () => {
      const clientId = import.meta.env.VITE_GENESYS_CLIENT_ID
      const clientSecret = import.meta.env.VITE_GENESYS_CLIENT_SECRET
      
      if (clientId && clientSecret) {
        console.log('Attempting background login with stored credentials...')
        await login(clientId, clientSecret)
      } else {
        console.error('Missing client credentials in environment variables')
      }
      setLoginAttempted(true)
    }

    if (!isAuthenticated && !loginAttempted) {
      attemptBackgroundLogin()
    }
  }, [isAuthenticated, login, loginAttempted])

  if (isLoading) {
    return <LoadingScreen>Connecting to Genesys Cloud...</LoadingScreen>
  }

  return (
    <Container>
      <ResultsContainer>
        <LogoContainer>
          <Logo src={mdaccLogo} alt="MD Anderson Cancer Center" />
        </LogoContainer>
        
        <Title>Genesys Cloud Authentication Results</Title>
        
        {isAuthenticated ? (
          <SuccessContainer>
            <SuccessMessage>
              ✅ Successfully authenticated with Genesys Cloud
            </SuccessMessage>
            
            {user && (
              <UserInfo>
                <UserInfoItem><Label>User:</Label> {user.name}</UserInfoItem>
                <UserInfoItem><Label>Email:</Label> {user.email}</UserInfoItem>
                <UserInfoItem><Label>User ID:</Label> {user.id}</UserInfoItem>
                <UserInfoItem>
                  <Label>Roles:</Label> 
                  <RolesList>
                    {user.roles.map(role => (
                      <RoleItem key={role.id}>{role.name}</RoleItem>
                    ))}
                  </RolesList>
                </UserInfoItem>
              </UserInfo>
            )}
            
            <LogoutButton onClick={logout}>
              Logout
            </LogoutButton>
          </SuccessContainer>
        ) : (
          <ErrorContainer>
            <ErrorMessage>
              <ErrorIcon><FaExclamationTriangle /></ErrorIcon>
              {error || 'Failed to authenticate with Genesys Cloud'}
            </ErrorMessage>
            
            {detailedError && (
              <>
                <ToggleDetailsButton 
                  type="button" 
                  onClick={() => setShowDetails(!showDetails)}
                >
                  {showDetails ? 'Hide Details' : 'Show Details'}
                </ToggleDetailsButton>
                
                {showDetails && (
                  <ErrorDetails>
                    <pre>{detailedError}</pre>
                  </ErrorDetails>
                )}
              </>
            )}
            
            <CredentialsInfo>
              <CredentialsTitle>Current Credentials:</CredentialsTitle>
              <CredentialsItem>
                <Label>Client ID:</Label> 
                {import.meta.env.VITE_GENESYS_CLIENT_ID || 'Not set'}
              </CredentialsItem>
              <CredentialsItem>
                <Label>Client Secret:</Label> 
                {import.meta.env.VITE_GENESYS_CLIENT_SECRET 
                  ? '********' 
                  : 'Not set'}
              </CredentialsItem>
              <CredentialsItem>
                <Label>Environment:</Label> 
                {import.meta.env.VITE_GENESYS_ENVIRONMENT || 'usw2.pure.cloud'}
              </CredentialsItem>
            </CredentialsInfo>
          </ErrorContainer>
        )}
        
        <EnvironmentInfo>
          Environment: {import.meta.env.VITE_GENESYS_ENVIRONMENT || 'usw2.pure.cloud'}
        </EnvironmentInfo>
      </ResultsContainer>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
`

const LoadingScreen = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  font-size: 1.2rem;
  color: #333;
`

const ResultsContainer = styled.div`
  width: 100%;
  max-width: 600px;
  padding: 2.5rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
`

const Logo = styled.img`
  height: 60px;
`

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 600;
  color: #e32636;
  text-align: center;
  margin-bottom: 2rem;
`

const SuccessContainer = styled.div`
  margin-bottom: 1.5rem;
`

const SuccessMessage = styled.div`
  background-color: #f0fff0;
  color: #2e8b57;
  padding: 12px;
  border-radius: 4px;
  border-left: 4px solid #2e8b57;
  font-weight: 500;
  margin-bottom: 1.5rem;
`

const UserInfo = styled.div`
  background-color: #f8f8f8;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 1.5rem;
`

const UserInfoItem = styled.div`
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
`

const Label = styled.span`
  font-weight: 600;
  color: #555;
`

const RolesList = styled.ul`
  margin: 8px 0 0 0;
  padding-left: 20px;
`

const RoleItem = styled.li`
  margin-bottom: 4px;
`

const LogoutButton = styled.button`
  padding: 10px 16px;
  background-color: #e32636;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #c41e2a;
  }
`

const ErrorContainer = styled.div`
  margin-bottom: 1.5rem;
`

const ErrorMessage = styled.div`
  background-color: #fff0f0;
  color: #e32636;
  padding: 12px;
  border-radius: 4px;
  border-left: 4px solid #e32636;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`

const ErrorIcon = styled.span`
  margin-right: 10px;
`

const ToggleDetailsButton = styled.button`
  background: none;
  border: none;
  color: #666;
  font-size: 0.9rem;
  text-decoration: underline;
  cursor: pointer;
  margin-bottom: 8px;
  padding: 0;
`

const ErrorDetails = styled.div`
  background-color: #f8f8f8;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 1rem;
  overflow-x: auto;
  
  pre {
    margin: 0;
    font-size: 0.8rem;
    white-space: pre-wrap;
  }
`

const CredentialsInfo = styled.div`
  background-color: #f8f8f8;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 16px;
  margin-top: 1rem;
`

const CredentialsTitle = styled.div`
  font-weight: 600;
  margin-bottom: 8px;
  color: #555;
`

const CredentialsItem = styled.div`
  margin-bottom: 6px;
  font-size: 0.9rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`

const EnvironmentInfo = styled.div`
  font-size: 0.8rem;
  color: #888;
  text-align: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
`

export default App
