import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import styled from 'styled-components'
import GenesysLoginWindow from './GenesysLoginWindow'

const StyledButton = styled.button`
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background-color: var(--primary-dark);
  }

  &:disabled {
    background-color: var(--disabled);
    cursor: not-allowed;
  }
`

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  
  .user-name {
    font-weight: 600;
  }
  
  .user-email {
    font-size: 0.8rem;
    color: var(--text-secondary);
  }
`

const LoginButton = () => {
  const { isAuthenticated, isLoading, user, logout } = useAuth()
  const [isLoginWindowOpen, setIsLoginWindowOpen] = useState(false)
  
  const handleLoginClick = () => {
    setIsLoginWindowOpen(true)
  }
  
  const handleLogoutClick = () => {
    logout()
  }
  
  if (isAuthenticated && user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <UserInfo>
          <div>
            <div className="user-name">{user.name}</div>
            <div className="user-email">{user.email}</div>
          </div>
        </UserInfo>
        <StyledButton onClick={handleLogoutClick}>
          Logout
        </StyledButton>
      </div>
    )
  }
  
  return (
    <>
      <StyledButton 
        onClick={handleLoginClick}
        disabled={isLoading}
      >
        {isLoading ? 'Connecting...' : 'Login to Genesys Cloud'}
      </StyledButton>
      
      <GenesysLoginWindow 
        isOpen={isLoginWindowOpen} 
        onClose={() => setIsLoginWindowOpen(false)} 
      />
    </>
  )
}

export default LoginButton
