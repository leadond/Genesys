import { useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { FaBars, FaMoon, FaSun, FaUser, FaSignOutAlt, FaCog } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const Header = ({ toggleSidebar, sidebarOpen }) => {
  const { logout, user } = useAuth()
  const { logo, organizationName, darkMode, toggleDarkMode } = useTheme()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  
  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen)
  }
  
  return (
    <HeaderContainer>
      <HeaderLeft>
        <MenuButton onClick={toggleSidebar} aria-label="Toggle sidebar">
          <FaBars />
        </MenuButton>
        
        <LogoContainer to="/">
          <LogoImage src={logo} alt={`${organizationName} Logo`} />
          <LogoText>
            <strong>{organizationName}</strong>
            <span>Reporting Portal</span>
          </LogoText>
        </LogoContainer>
      </HeaderLeft>
      
      <HeaderRight>
        <ThemeToggle onClick={toggleDarkMode} aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </ThemeToggle>
        
        <UserContainer>
          <UserButton onClick={toggleUserMenu}>
            <UserAvatar>
              <FaUser />
            </UserAvatar>
            <UserName>{user?.name || 'User'}</UserName>
          </UserButton>
          
          {userMenuOpen && (
            <UserMenu>
              <UserMenuItem to="/settings">
                <FaCog />
                <span>Settings</span>
              </UserMenuItem>
              <UserMenuDivider />
              <UserMenuItem as="button" onClick={logout}>
                <FaSignOutAlt />
                <span>Logout</span>
              </UserMenuItem>
            </UserMenu>
          )}
        </UserContainer>
      </HeaderRight>
    </HeaderContainer>
  )
}

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 0 var(--spacing-md);
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  z-index: 100;
`

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
`

const MenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  border-radius: 50%;
  color: var(--text-primary);
  cursor: pointer;
  margin-right: var(--spacing-md);
  
  &:hover {
    background-color: var(--bg-tertiary);
  }
`

const LogoContainer = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: var(--text-primary);
`

const LogoImage = styled.img`
  height: 36px;
  margin-right: var(--spacing-sm);
`

const LogoText = styled.div`
  display: flex;
  flex-direction: column;
  
  strong {
    font-size: var(--font-size-md);
    line-height: 1.2;
  }
  
  span {
    font-size: var(--font-size-xs);
    color: var(--text-secondary);
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
`

const ThemeToggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  border-radius: 50%;
  color: var(--text-primary);
  cursor: pointer;
  margin-right: var(--spacing-md);
  
  &:hover {
    background-color: var(--bg-tertiary);
  }
`

const UserContainer = styled.div`
  position: relative;
`

const UserButton = styled.button`
  display: flex;
  align-items: center;
  background: transparent;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-md);
  
  &:hover {
    background-color: var(--bg-tertiary);
  }
`

const UserAvatar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: var(--md-light-gray);
  color: var(--md-dark-gray);
  border-radius: 50%;
  margin-right: var(--spacing-sm);
`

const UserName = styled.span`
  @media (max-width: 576px) {
    display: none;
  }
`

const UserMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  width: 200px;
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  margin-top: var(--spacing-xs);
  z-index: 10;
`

const UserMenuItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  color: var(--text-primary);
  text-decoration: none;
  cursor: pointer;
  
  &:hover {
    background-color: var(--bg-tertiary);
    text-decoration: none;
  }
  
  svg {
    margin-right: var(--spacing-sm);
    color: var(--text-secondary);
  }
  
  &:first-child {
    border-top-left-radius: var(--border-radius-md);
    border-top-right-radius: var(--border-radius-md);
  }
  
  &:last-child {
    border-bottom-left-radius: var(--border-radius-md);
    border-bottom-right-radius: var(--border-radius-md);
  }
  
  &[as="button"] {
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    font-family: inherit;
    font-size: inherit;
  }
`

const UserMenuDivider = styled.div`
  height: 1px;
  background-color: var(--border-color);
  margin: var(--spacing-xs) 0;
`

export default Header
