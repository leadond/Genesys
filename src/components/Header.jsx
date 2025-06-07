import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { FaSun, FaMoon, FaSignOutAlt, FaUser } from 'react-icons/fa'
import mdaccLogo from '../assets/mdacc-logo.png'

const HeaderContainer = styled.header`
  background-color: var(--bg-secondary);
  padding: 0.5rem 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  
  img {
    height: 50px;
    max-width: 100%;
  }
  
  h1 {
    font-size: 1.2rem;
    margin: 0;
    color: var(--primary);
  }
`

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`

const ThemeToggle = styled.button`
  background: none;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  border-radius: 50%;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: var(--bg-hover);
  }
`

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 0.8rem;
  
  .name {
    font-weight: 600;
  }
  
  .org {
    color: var(--text-secondary);
  }
`

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.9rem;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: var(--bg-hover);
  }
`

const Header = () => {
  const { theme, toggleTheme } = useTheme()
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  
  const handleLogout = () => {
    const logoutSuccess = logout()
    if (logoutSuccess) {
      navigate('/')
    }
  }
  
  return (
    <HeaderContainer>
      <Logo>
        <img src={mdaccLogo} alt="MD Anderson Cancer Center" />
        <h1>Genesys Cloud Reporting</h1>
      </Logo>
      
      <Controls>
        <ThemeToggle onClick={toggleTheme} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
          {theme === 'light' ? <FaMoon /> : <FaSun />}
        </ThemeToggle>
        
        {isAuthenticated && user && (
          <UserSection>
            <FaUser />
            <UserInfo>
              <span className="name">{user.name}</span>
              <span className="org">{user.organization || 'MDACC'}</span>
            </UserInfo>
            <LogoutButton onClick={handleLogout}>
              <FaSignOutAlt />
              Logout
            </LogoutButton>
          </UserSection>
        )}
      </Controls>
    </HeaderContainer>
  )
}

export default Header
