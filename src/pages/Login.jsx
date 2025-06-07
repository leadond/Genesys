import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { FaLock, FaUser, FaExclamationTriangle } from 'react-icons/fa'
import styled from 'styled-components'
import mdaccLogo from '/assets/md-anderson-logo.png'

const Login = () => {
  const { login, error, detailedError, isLoading } = useAuth()
  const [clientId, setClientId] = useState(import.meta.env.VITE_GENESYS_CLIENT_ID || '')
  const [clientSecret, setClientSecret] = useState(import.meta.env.VITE_GENESYS_CLIENT_SECRET || '')
  const [showDetails, setShowDetails] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    await login(clientId, clientSecret)
  }

  return (
    <LoginContainer>
      <LoginForm onSubmit={handleSubmit}>
        <LogoContainer>
          <Logo src={mdaccLogo} alt="MD Anderson Cancer Center" />
        </LogoContainer>
        
        <Title>Genesys Cloud Reporting</Title>
        <Subtitle>MD Anderson Cancer Center</Subtitle>
        
        {error && (
          <ErrorContainer>
            <ErrorMessage>
              <ErrorIcon><FaExclamationTriangle /></ErrorIcon>
              {error}
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
          </ErrorContainer>
        )}
        
        <InputGroup>
          <InputIcon>
            <FaUser />
          </InputIcon>
          <Input
            type="text"
            placeholder="Client ID"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            required
          />
        </InputGroup>
        
        <InputGroup>
          <InputIcon>
            <FaLock />
          </InputIcon>
          <Input
            type="password"
            placeholder="Client Secret"
            value={clientSecret}
            onChange={(e) => setClientSecret(e.target.value)}
            required
          />
        </InputGroup>
        
        <LoginButton type="submit" disabled={isLoading}>
          {isLoading ? 'Authenticating...' : 'Login'}
        </LoginButton>
        
        <InfoText>
          Please enter your Genesys Cloud API credentials to access the reporting dashboard.
        </InfoText>
        
        <EnvironmentInfo>
          Environment: {import.meta.env.VITE_GENESYS_ENVIRONMENT || 'usw2.pure.cloud'}
        </EnvironmentInfo>
      </LoginForm>
    </LoginContainer>
  )
}

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
`

const LoginForm = styled.form`
  width: 100%;
  max-width: 450px;
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
  margin-bottom: 0.5rem;
`

const Subtitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 500;
  color: #333;
  text-align: center;
  margin-bottom: 2rem;
`

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`

const InputIcon = styled.div`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
`

const Input = styled.input`
  width: 100%;
  padding: 12px 12px 12px 45px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
  
  &:focus {
    border-color: #e32636;
    outline: none;
  }
`

const LoginButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #e32636;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #c41e2a;
  }
  
  &:disabled {
    background-color: #e57f87;
    cursor: not-allowed;
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
`

const ErrorIcon = styled.span`
  margin-right: 10px;
`

const ToggleDetailsButton = styled.button`
  background: none;
  border: none;
  color: #666;
  font-size: 0.8rem;
  text-decoration: underline;
  cursor: pointer;
  margin-top: 8px;
  padding: 0;
`

const ErrorDetails = styled.div`
  background-color: #f8f8f8;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  margin-top: 8px;
  overflow-x: auto;
  
  pre {
    margin: 0;
    font-size: 0.8rem;
    white-space: pre-wrap;
  }
`

const InfoText = styled.p`
  font-size: 0.9rem;
  color: #666;
  text-align: center;
  margin-top: 1.5rem;
`

const EnvironmentInfo = styled.div`
  font-size: 0.8rem;
  color: #888;
  text-align: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
`

export default Login
