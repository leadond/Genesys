import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import styled from 'styled-components'
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaExternalLinkAlt } from 'react-icons/fa'

const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
  border-radius: 4px;
  background-color: ${props => 
    props.$status === 'connected' ? 'var(--success-bg)' : 
    props.$status === 'disconnected' ? 'var(--error-bg)' : 
    'var(--bg-tertiary)'
  };
  color: ${props => 
    props.$status === 'connected' ? 'var(--success-text)' : 
    props.$status === 'disconnected' ? 'var(--error-text)' : 
    'var(--text-primary)'
  };
  margin-bottom: 20px;
`

const StatusIcon = styled.div`
  font-size: 1.2rem;
  
  .spinner {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`

const StatusText = styled.div`
  flex: 1;
  
  .status-title {
    font-weight: 600;
    margin-bottom: 2px;
  }
  
  .status-details {
    font-size: 0.9rem;
  }
`

const PremiumAppBadge = styled.span`
  background-color: var(--primary);
  color: white;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: 8px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
`

const ConnectionStatus = () => {
  const { isAuthenticated, isLoading, user, error, isPremiumApp } = useAuth()
  const [status, setStatus] = useState('checking')
  
  useEffect(() => {
    if (isLoading) {
      setStatus('checking')
    } else if (isAuthenticated && user) {
      setStatus('connected')
    } else {
      setStatus('disconnected')
    }
  }, [isAuthenticated, isLoading, user])
  
  return (
    <StatusContainer $status={status}>
      <StatusIcon>
        {status === 'checking' && <FaSpinner className="spinner" />}
        {status === 'connected' && <FaCheckCircle />}
        {status === 'disconnected' && <FaTimesCircle />}
      </StatusIcon>
      
      <StatusText>
        <div className="status-title">
          {status === 'checking' && 'Checking Genesys Cloud Connection...'}
          {status === 'connected' && (
            <>
              Connected to Genesys Cloud
              {isPremiumApp && (
                <PremiumAppBadge>
                  Premium App <FaExternalLinkAlt size={8} />
                </PremiumAppBadge>
              )}
            </>
          )}
          {status === 'disconnected' && 'Not Connected to Genesys Cloud'}
        </div>
        
        <div className="status-details">
          {status === 'connected' && (
            <>
              Logged in as {user.name} ({user.email})
              <br />
              Organization: {user.organization || 'MDACC'}
              <br />
              Region: {import.meta.env.VITE_GENESYS_ENVIRONMENT || 'usw2.pure.cloud'}
              {isPremiumApp && (
                <>
                  <br />
                  <strong>Running as Genesys Cloud Premium App</strong>
                </>
              )}
            </>
          )}
          {status === 'disconnected' && (
            <>
              {error || 'Please log in to connect to Genesys Cloud'}
            </>
          )}
        </div>
      </StatusText>
    </StatusContainer>
  )
}

export default ConnectionStatus
