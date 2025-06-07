import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import styled from 'styled-components'

const TestConnectionContainer = styled.div`
  padding: 20px;
  background-color: var(--bg-secondary);
  border-radius: 8px;
  margin-bottom: 20px;
`

const StatusContainer = styled.div`
  margin-top: 15px;
  padding: 15px;
  border-radius: 4px;
  background-color: ${props => 
    props.$status === 'success' ? 'var(--success-bg)' : 
    props.$status === 'error' ? 'var(--error-bg)' : 
    'var(--bg-tertiary)'
  };
  color: ${props => 
    props.$status === 'success' ? 'var(--success-text)' : 
    props.$status === 'error' ? 'var(--error-text)' : 
    'var(--text-primary)'
  };
`

const Button = styled.button`
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--primary-dark);
  }

  &:disabled {
    background-color: var(--disabled);
    cursor: not-allowed;
  }
`

const ErrorDetails = styled.pre`
  background-color: var(--bg-tertiary);
  padding: 15px;
  border-radius: 4px;
  overflow: auto;
  max-height: 300px;
  font-size: 12px;
  margin-top: 15px;
`

const TestConnection = () => {
  const { login, isAuthenticated, isLoading, error, detailedError, user } = useAuth()
  const [status, setStatus] = useState(null)
  const [clientId, setClientId] = useState(import.meta.env.VITE_GENESYS_CLIENT_ID || '')

  useEffect(() => {
    if (isAuthenticated) {
      setStatus('success')
    } else if (error) {
      setStatus('error')
    }
  }, [isAuthenticated, error])

  const handleTestConnection = async () => {
    setStatus('testing')
    await login(clientId)
  }

  return (
    <TestConnectionContainer>
      <h2>Test Genesys Cloud Connection</h2>
      
      <div>
        <label htmlFor="clientId">Client ID:</label>
        <input 
          type="text" 
          id="clientId" 
          value={clientId} 
          onChange={(e) => setClientId(e.target.value)}
          style={{ width: '100%', padding: '8px', marginTop: '5px', marginBottom: '15px' }}
        />
      </div>
      
      <Button 
        onClick={handleTestConnection} 
        disabled={isLoading || !clientId}
      >
        {isLoading ? 'Testing...' : 'Test Connection'}
      </Button>
      
      {status && (
        <StatusContainer $status={status}>
          {status === 'testing' && 'Testing connection to Genesys Cloud...'}
          {status === 'success' && (
            <>
              <p>✅ Successfully connected to Genesys Cloud!</p>
              {user && (
                <div>
                  <p><strong>User:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                </div>
              )}
            </>
          )}
          {status === 'error' && (
            <>
              <p>❌ Failed to connect to Genesys Cloud</p>
              <p>{error}</p>
              {detailedError && (
                <ErrorDetails>
                  {detailedError}
                </ErrorDetails>
              )}
            </>
          )}
        </StatusContainer>
      )}
    </TestConnectionContainer>
  )
}

export default TestConnection
