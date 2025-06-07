import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { testConnection } from '../utils/genesysApi'
import { FaCheckCircle, FaTimesCircle, FaCog, FaInfoCircle } from 'react-icons/fa'

const TestConnection = () => {
  const [clientId, setClientId] = useState(import.meta.env.VITE_GENESYS_CLIENT_ID || '')
  const [environment, setEnvironment] = useState(import.meta.env.VITE_GENESYS_ENVIRONMENT || 'usw2.pure.cloud')
  const [testing, setTesting] = useState(false)
  const [result, setResult] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  
  // Get the current URL for the redirect
  const redirectUri = `${window.location.origin}${window.location.pathname}`

  // Check for token in URL on initial load
  useEffect(() => {
    if (window.location.hash.includes('access_token')) {
      // Extract all parameters from the hash
      const params = new URLSearchParams(window.location.hash.substring(1))
      const token = params.get('access_token')
      const error = params.get('error')
      const errorDescription = params.get('error_description')
      
      if (error) {
        setResult({
          success: false,
          message: `Authentication error: ${error}`,
          details: { error, error_description: errorDescription }
        })
      } else if (token) {
        setResult({
          success: true,
          message: 'Successfully connected to Genesys Cloud',
          token: token
        })
      }
      
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  const handleTest = async (e) => {
    e.preventDefault()
    setTesting(true)
    setResult(null)
    
    try {
      // Log the values being used for debugging
      console.log('Testing connection with:', {
        clientId,
        redirectUri,
        environment
      })
      
      // For browser environments, we use implicit grant which will redirect
      await testConnection(clientId, redirectUri, environment)
      
      // This code might not execute due to the redirect
      setResult({
        success: true,
        message: 'Redirecting to Genesys Cloud for authentication...'
      })
    } catch (err) {
      console.error('Test connection error:', err)
      setResult({
        success: false,
        message: 'An unexpected error occurred',
        details: err
      })
    } finally {
      setTesting(false)
    }
  }

  return (
    <Container>
      <Title>Genesys Cloud Connection Test</Title>
      <Description>
        Use this tool to test your Genesys Cloud API credentials and connection.
      </Description>
      
      <InfoBox>
        <FaInfoCircle /> This application uses the OAuth Implicit Grant flow, which is suitable for browser-based applications.
        You will be redirected to Genesys Cloud to authenticate, then returned to this page.
      </InfoBox>
      
      <Form onSubmit={handleTest}>
        <FormGroup>
          <Label>Environment</Label>
          <Input
            type="text"
            value={environment}
            onChange={(e) => setEnvironment(e.target.value)}
            placeholder="e.g., usw2.pure.cloud"
            required
          />
          <HelpText>The Genesys Cloud environment domain (e.g., usw2.pure.cloud)</HelpText>
        </FormGroup>
        
        <FormGroup>
          <Label>Client ID</Label>
          <Input
            type="text"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            placeholder="Enter your Client ID"
            required
          />
          <HelpText>The OAuth Client ID from Genesys Cloud</HelpText>
        </FormGroup>
        
        <FormGroup>
          <Label>Redirect URI</Label>
          <Input
            type="text"
            value={redirectUri}
            readOnly
            disabled
          />
          <HelpText>This URL must be added to the allowed redirect URIs in your Genesys Cloud OAuth settings</HelpText>
        </FormGroup>
        
        <TestButton type="submit" disabled={testing}>
          {testing ? (
            <>
              <FaCog className="spinning" /> Initiating Authentication...
            </>
          ) : (
            'Test Connection'
          )}
        </TestButton>
      </Form>
      
      {result && (
        <ResultContainer success={result.success}>
          <ResultHeader>
            {result.success ? (
              <SuccessIcon><FaCheckCircle /></SuccessIcon>
            ) : (
              <ErrorIcon><FaTimesCircle /></ErrorIcon>
            )}
            <ResultMessage>{result.message}</ResultMessage>
          </ResultHeader>
          
          {!result.success && (
            <>
              <ToggleDetailsButton 
                type="button" 
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? 'Hide Details' : 'Show Details'}
              </ToggleDetailsButton>
              
              {showDetails && (
                <ErrorDetails>
                  <pre>{JSON.stringify(result.details, null, 2)}</pre>
                </ErrorDetails>
              )}
              
              <TroubleshootingTips>
                <h4>Troubleshooting Tips:</h4>
                <ul>
                  <li>Verify that your Client ID is correct</li>
                  <li>Ensure your OAuth client has the necessary scopes (analytics:read, user:read, etc.)</li>
                  <li>Check that you're using the correct environment (e.g., usw2.pure.cloud)</li>
                  <li>Verify that your OAuth client is active and not expired</li>
                  <li>Make sure the redirect URI ({redirectUri}) is added to the allowed redirect URIs in your Genesys Cloud OAuth settings</li>
                  <li>Ensure your OAuth client is configured for Implicit Grant</li>
                </ul>
              </TroubleshootingTips>
            </>
          )}
          
          {result.success && (
            <SuccessDetails>
              <p>Successfully authenticated with Genesys Cloud!</p>
              <p>Your OAuth token has been generated and can be used for API requests.</p>
              {result.token && (
                <TokenPreview>
                  <strong>Token Preview:</strong> {result.token.substring(0, 20)}...
                </TokenPreview>
              )}
            </SuccessDetails>
          )}
        </ResultContainer>
      )}
    </Container>
  )
}

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`

const Title = styled.h1`
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 1rem;
`

const Description = styled.p`
  color: #666;
  margin-bottom: 1rem;
`

const InfoBox = styled.div`
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: flex-start;
  
  svg {
    color: #1890ff;
    margin-right: 0.75rem;
    margin-top: 0.2rem;
    flex-shrink: 0;
  }
`

const Form = styled.form`
  background-color: #f8f8f8;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
`

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    border-color: #e32636;
    outline: none;
  }
  
  &:disabled {
    background-color: #f5f5f5;
    color: #666;
  }
`

const HelpText = styled.div`
  font-size: 0.8rem;
  color: #777;
  margin-top: 0.5rem;
`

const TestButton = styled.button`
  background-color: #e32636;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: #c41e2a;
  }
  
  &:disabled {
    background-color: #e57f87;
    cursor: not-allowed;
  }
  
  .spinning {
    animation: spin 1s linear infinite;
    margin-right: 0.5rem;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`

const ResultContainer = styled.div`
  background-color: ${props => props.success ? '#f0fff4' : '#fff0f0'};
  border: 1px solid ${props => props.success ? '#c6f6d5' : '#fed7d7'};
  border-radius: 8px;
  padding: 1.5rem;
`

const ResultHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`

const ResultMessage = styled.span`
  font-weight: 600;
  font-size: 1.1rem;
`

const SuccessIcon = styled.span`
  color: #38a169;
  font-size: 1.5rem;
  margin-right: 0.75rem;
`

const ErrorIcon = styled.span`
  color: #e53e3e;
  font-size: 1.5rem;
  margin-right: 0.75rem;
`

const ToggleDetailsButton = styled.button`
  background: none;
  border: none;
  color: #666;
  font-size: 0.9rem;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
  margin-bottom: 1rem;
`

const ErrorDetails = styled.div`
  background-color: #f8f8f8;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  overflow-x: auto;
  
  pre {
    margin: 0;
    font-size: 0.85rem;
    white-space: pre-wrap;
  }
`

const TroubleshootingTips = styled.div`
  background-color: #f8f8f8;
  border-radius: 4px;
  padding: 1rem;
  
  h4 {
    margin-top: 0;
    margin-bottom: 0.75rem;
    color: #333;
  }
  
  ul {
    margin: 0;
    padding-left: 1.5rem;
  }
  
  li {
    margin-bottom: 0.5rem;
    color: #555;
  }
`

const SuccessDetails = styled.div`
  color: #2f855a;
  
  p {
    margin-bottom: 0.5rem;
  }
`

const TokenPreview = styled.div`
  background-color: #f0fff4;
  border: 1px solid #c6f6d5;
  border-radius: 4px;
  padding: 0.75rem;
  margin-top: 1rem;
  font-family: monospace;
`

export default TestConnection
