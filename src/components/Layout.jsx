import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { FaChartBar, FaCog, FaSignOutAlt, FaMoon, FaSun, FaUser } from 'react-icons/fa'
import GenesysLoginWindow from './GenesysLoginWindow'
import mdaccLogo from '../assets/mdacc-logo.png'

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  
  &.premium-app {
    /* Premium App specific styles */
    border: none;
    border-radius: 0;
  }
`

const Header = styled.header`
  background-color: var(--primary);
  color: white;
  padding: 0.5rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  .premium-app & {
    background-color: transparent;
    box-shadow: none;
    border-bottom: 1px solid var(--border-color);
    color: var(--text-primary);
  }
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
  }
  
  .premium-app & img {
    height: 40px;
  }
`

const HeaderControls = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`

const ThemeToggle = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
`

const LoginButton = styled.button`
  background-color: white;
  color: var(--primary);
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-weight: 600;
  
  &:hover {
    background-color: #f0f0f0;
  }
  
  .premium-app & {
    background-color: var(--primary);
    color: white;
  }
`

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  
  .user-avatar {
    background-color: rgba(255, 255, 255, 0.2);
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .premium-app & {
      background-color: var(--primary-light);
    }
  }
  
  .user-name {
    font-weight: 600;
  }
`

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px;
  
  &:hover {
    text-decoration: underline;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    
    &:hover {
      text-decoration: none;
    }
  }
`

const MainContent = styled.main`
  flex: 1;
  display: flex;
`

const Sidebar = styled.nav`
  width: 220px;
  background-color: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  padding: 1rem 0;
  
  .premium-app & {
    width: 180px;
  }
`

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0.8rem 1rem;
  color: var(--text-primary);
  text-decoration: none;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: var(--bg-hover);
  }
  
  &.active {
    background-color: var(--primary-light);
    color: var(--primary);
    font-weight: 600;
  }
  
  .icon {
    width: 20px;
    text-align: center;
  }
`

const Content = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
`

const PremiumAppBadge = styled.div`
  background-color: var(--primary);
  color: white;
  font-size: 0.7rem;
  padding: 3px 8px;
  border-radius: 12px;
  margin-left: 10px;
`

const Layout = ({ children, isPremiumApp }) => {
  const { isAuthenticated, user, logout, isPremiumApp: authIsPremiumApp } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const location = useLocation()
  
  const handleLogout = () => {
    logout()
  }
  
  return (
    <LayoutContainer className={isPremiumApp ? 'premium-app' : ''}>
      <Header>
        <Logo>
          <img src={mdaccLogo} alt="MD Anderson Cancer Center" />
          <h1>
            Genesys Cloud Reporting
            {(isPremiumApp || authIsPremiumApp) && <PremiumAppBadge>Premium App</PremiumAppBadge>}
          </h1>
        </Logo>
        
        <HeaderControls>
          <ThemeToggle onClick={toggleTheme} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
            {theme === 'dark' ? <FaSun /> : <FaMoon />}
          </ThemeToggle>
          
          {isAuthenticated ? (
            <>
              <UserInfo>
                <div className="user-avatar">
                  <FaUser />
                </div>
                <span className="user-name">{user?.name}</span>
              </UserInfo>
              
              <LogoutButton 
                onClick={handleLogout} 
                disabled={isPremiumApp || authIsPremiumApp}
                title={isPremiumApp || authIsPremiumApp ? "Cannot log out when running as Premium App" : "Log out"}
              >
                <FaSignOutAlt /> Logout
              </LogoutButton>
            </>
          ) : (
            <LoginButton onClick={() => setShowLoginModal(true)}>
              Login
            </LoginButton>
          )}
        </HeaderControls>
      </Header>
      
      <MainContent>
        {isAuthenticated && (
          <Sidebar>
            <NavItem to="/" className={location.pathname === '/' ? 'active' : ''}>
              <span className="icon"><FaChartBar /></span>
              Dashboard
            </NavItem>
            <NavItem to="/settings" className={location.pathname === '/settings' ? 'active' : ''}>
              <span className="icon"><FaCog /></span>
              Settings
            </NavItem>
          </Sidebar>
        )}
        
        <Content>
          {children}
        </Content>
      </MainContent>
      
      <GenesysLoginWindow 
        isOpen={showLoginModal && !isAuthenticated} 
        onClose={() => setShowLoginModal(false)} 
      />
    </LayoutContainer>
  )
}

export default Layout
