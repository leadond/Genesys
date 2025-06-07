import { useState } from 'react'
import styled from 'styled-components'
import { testConnection } from '../utils/genesysApi'
import { FaCheckCircle, FaTimesCircle, FaCog } from 'react-icons/fa'

const TestConnection = () => {
  const [clientId, setClientId] = useState(import.meta.env.VITE_GENESYS_CLIENT_ID || '')
  const [clientSecret, setClientSecret] = useState(import.meta.env.VITE_GENESYS_CLIENT_SECRET || '')
  const [environment, setEnvironment] = useState(import.meta.env.VITE_GENESYS_ENVIRONMENT || 'usw2.pure.cloud')
  const [testing, setTesting] = useState(false)
  const [result, setResult] = useState(null)
  const [showDetails, setShowDetails] = useState(false)

  const handleTest = async (e) => {
    e.preventDefault()
    setTesting(true)
    setResult(null)
    
    try {
      const connectionResult = await testConnection(clientId, clientSecret, environment)
      setResult(connectionResult)
    } catch (err) {
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
          <Label>Client Secret</Label>
          <Input
            type="password"
            value={clientSecret}
            onChange={(e) => setClientSecret(e.target.value)}
            placeholder="Enter your Client Secret"
            required
          />
          <HelpText>The OAuth Client Secret from Genesys Cloud</HelpText>
        </FormGroup>
        
        <TestButton type="submit" disabled={testing}>
          {testing ? (
            <>
              <FaCog className="spinning" /> Testing Connection...
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
                  <li>Verify that your Client ID and Client Secret are correct</li>
                  <li>Ensure your OAuth client has the necessary scopes (analytics:read, user:read, etc.)</li>
                  <li>Check that you're using the correct environment (e.g., usw2.pure.cloud)</li>
                  <li>Verify that your OAuth client is active and not expired</li>
                  <li>Check if your organization has IP restrictions that might be blocking access</li>
                </ul>
              </TroubleshootingTips>
            </>
          )}
          
          {result.success && (
            <SuccessDetails>
              <p>Successfully authenticated with Genesys Cloud!</p>
              <p>Your OAuth token has been generated and can be used for API requests.</p>
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
  margin-bottom: 2rem;
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

export default TestConnection
