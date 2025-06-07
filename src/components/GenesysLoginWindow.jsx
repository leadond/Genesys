import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import styled from 'styled-components'
import { FaTimes, FaMicrosoft } from 'react-icons/fa'
import mdaccLogo from '../assets/mdacc-logo.png'

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`

const ModalContent = styled.div`
  background-color: var(--bg-primary);
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
`

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: var(--primary);
  color: white;
`

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ModalBody = styled.div`
  padding: 20px;
`

const LoginForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`

const Label = styled.label`
  font-weight: 600;
  color: var(--text-primary);
`

const Input = styled.input`
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  width: 100%;
`

const Button = styled.button`
  background-color: ${props => props.$microsoft ? '#0078d4' : 'var(--primary)'};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px 15px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  &:hover {
    background-color: ${props => props.$microsoft ? '#106ebe' : 'var(--primary-dark)'};
  }

  &:disabled {
    background-color: var(--disabled);
    cursor: not-allowed;
  }
`

const StatusMessage = styled.div`
  margin-top: 15px;
  padding: 10px;
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

const OrganizationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  
  img {
    height: 40px;
  }
  
  .org-details {
    display: flex;
    flex-direction: column;
    
    .org-name {
      font-weight: bold;
      font-size: 1.1rem;
    }
    
    .org-region {
      font-size: 0.9rem;
      color: var(--text-secondary);
    }
  }
`

const GenesysLoginWindow = ({ isOpen, onClose }) => {
  const { login, isAuthenticated, isLoading, error } = useAuth()
  const [status, setStatus] = useState(null)
  const [clientId, setClientId] = useState(import.meta.env.VITE_GENESYS_CLIENT_ID || '')
  
  // Handle Microsoft SSO login (redirects to Microsoft login page via Genesys)
  const handleMicrosoftLogin = async () => {
    setStatus('loading')
    await login(clientId)
  }
  
  // Close modal if authentication is successful
  if (isAuthenticated && isOpen) {
    onClose()
  }
  
  // Modified to always show the login window when isOpen is true
  if (!isOpen) return null
  
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <h3>Genesys Cloud Login</h3>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>
        
        <ModalBody>
          <LoginForm>
            <OrganizationInfo>
              <img src={mdaccLogo} alt="MD Anderson Cancer Center" />
              <div className="org-details">
                <span className="org-name">MDACC</span>
                <span className="org-region">West Region (usw2.pure.cloud)</span>
              </div>
            </OrganizationInfo>
            
            <p>
              You'll be redirected to Microsoft to authenticate with your credentials.
              After successful authentication, you'll be redirected back to this application.
            </p>
            
            <FormGroup>
              <Label htmlFor="clientId">Client ID:</Label>
              <Input 
                type="text" 
                id="clientId" 
                value={clientId} 
                onChange={(e) => setClientId(e.target.value)}
                placeholder="Enter your Genesys Cloud OAuth Client ID"
              />
            </FormGroup>
            
            <Button 
              $microsoft
              onClick={handleMicrosoftLogin} 
              disabled={isLoading || !clientId}
            >
              <FaMicrosoft />
              {isLoading ? 'Connecting...' : 'Login with Microsoft SSO'}
            </Button>
            
            {error && (
              <StatusMessage $status="error">
                <p>❌ {error}</p>
              </StatusMessage>
            )}
          </LoginForm>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  )
}

export default GenesysLoginWindow
