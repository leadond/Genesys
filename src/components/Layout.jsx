import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { FaHome, FaChartBar, FaCog, FaMoon, FaSun, FaSignOutAlt, FaBell } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import mdaccLogo from '/assets/md-anderson-logo.png'

const Layout = ({ children, toggleTheme, theme }) => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New report available: Queue Performance', read: false },
    { id: 2, message: 'System maintenance scheduled for Sunday', read: false }
  ])
  const [showNotifications, setShowNotifications] = useState(false)
  
  const handleLogout = () => {
    logout()
    navigate('/login')
  }
  
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications)
  }
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }
  
  const unreadCount = notifications.filter(n => !n.read).length
  
  return (
    <LayoutContainer>
      <Sidebar>
        <LogoContainer>
          <Logo src={mdaccLogo} alt="MD Anderson Cancer Center" />
        </LogoContainer>
        
        <NavLinks>
          <NavItem isActive={location.pathname === '/'}>
            <NavLink to="/">
              <FaHome />
              <span>Dashboard</span>
            </NavLink>
          </NavItem>
          
          <NavItem isActive={location.pathname === '/reports'}>
            <NavLink to="/reports">
              <FaChartBar />
              <span>Reports</span>
            </NavLink>
          </NavItem>
          
          <NavItem isActive={location.pathname === '/settings'}>
            <NavLink to="/settings">
              <FaCog />
              <span>Settings</span>
            </NavLink>
          </NavItem>
        </NavLinks>
        
        <SidebarFooter>
          <ThemeToggle onClick={toggleTheme}>
            {theme === 'light' ? <FaMoon /> : <FaSun />}
            <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </ThemeToggle>
          
          <LogoutButton onClick={handleLogout}>
            <FaSignOutAlt />
            <span>Logout</span>
          </LogoutButton>
        </SidebarFooter>
      </Sidebar>
      
      <MainContent>
        <Header>
          <PageTitle>
            {location.pathname === '/' && 'Dashboard'}
            {location.pathname === '/reports' && 'Reports'}
            {location.pathname === '/settings' && 'Settings'}
          </PageTitle>
          
          <HeaderControls>
            <NotificationWrapper>
              <NotificationButton onClick={toggleNotifications}>
                <FaBell />
                {unreadCount > 0 && <NotificationBadge>{unreadCount}</NotificationBadge>}
              </NotificationButton>
              
              {showNotifications && (
                <NotificationsPanel>
                  <NotificationsHeader>
                    <h3>Notifications</h3>
                    {unreadCount > 0 && (
                      <MarkReadButton onClick={markAllAsRead}>
                        Mark all as read
                      </MarkReadButton>
                    )}
                  </NotificationsHeader>
                  
                  <NotificationsList>
                    {notifications.length > 0 ? (
                      notifications.map(notification => (
                        <NotificationItem key={notification.id} isUnread={!notification.read}>
                          <NotificationContent>{notification.message}</NotificationContent>
                        </NotificationItem>
                      ))
                    ) : (
                      <EmptyNotifications>No notifications</EmptyNotifications>
                    )}
                  </NotificationsList>
                </NotificationsPanel>
              )}
            </NotificationWrapper>
            
            <UserInfo>
              <UserAvatar>
                {user?.name?.charAt(0) || 'U'}
              </UserAvatar>
              <UserName>{user?.name || 'User'}</UserName>
            </UserInfo>
          </HeaderControls>
        </Header>
        
        <ContentArea>
          {children}
        </ContentArea>
      </MainContent>
    </LayoutContainer>
  )
}

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: var(--bg-secondary);
`

const Sidebar = styled.aside`
  width: 250px;
  background-color: var(--bg-primary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  z-index: 10;
`

const LogoContainer = styled.div`
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: center;
  align-items: center;
`

const Logo = styled.img`
  height: 40px;
`

const NavLinks = styled.ul`
  list-style: none;
  padding: var(--spacing-md) 0;
  margin: 0;
  flex-grow: 1;
`

const NavItem = styled.li`
  margin-bottom: var(--spacing-sm);
  
  a {
    background-color: ${props => props.isActive ? 'var(--md-light-red)' : 'transparent'};
    color: ${props => props.isActive ? 'var(--md-red)' : 'var(--text-primary)'};
    font-weight: ${props => props.isActive ? '600' : '400'};
    border-left: ${props => props.isActive ? '4px solid var(--md-red)' : '4px solid transparent'};
  }
`

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  text-decoration: none;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--bg-hover);
  }
  
  svg {
    margin-right: var(--spacing-md);
    font-size: 18px;
  }
`

const SidebarFooter = styled.div`
  padding: var(--spacing-md);
  border-top: 1px solid var(--border-color);
`

const ThemeToggle = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: var(--text-primary);
  padding: var(--spacing-sm) 0;
  cursor: pointer;
  width: 100%;
  text-align: left;
  margin-bottom: var(--spacing-sm);
  
  svg {
    margin-right: var(--spacing-md);
  }
  
  &:hover {
    color: var(--md-red);
  }
`

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: var(--text-primary);
  padding: var(--spacing-sm) 0;
  cursor: pointer;
  width: 100%;
  text-align: left;
  
  svg {
    margin-right: var(--spacing-md);
  }
  
  &:hover {
    color: var(--md-red);
  }
`

const MainContent = styled.main`
  flex-grow: 1;
  margin-left: 250px;
  display: flex;
  flex-direction: column;
`

const Header = styled.header`
  height: 70px;
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--spacing-lg);
  position: sticky;
  top: 0;
  z-index: 5;
`

const PageTitle = styled.h1`
  font-size: var(--font-size-lg);
  color: var(--text-primary);
  margin: 0;
`

const HeaderControls = styled.div`
  display: flex;
  align-items: center;
`

const NotificationWrapper = styled.div`
  position: relative;
  margin-right: var(--spacing-lg);
`

const NotificationButton = styled.button`
  background: none;
  border: none;
  color: var(--text-primary);
  font-size: 20px;
  cursor: pointer;
  position: relative;
  
  &:hover {
    color: var(--md-red);
  }
`

const NotificationBadge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: var(--md-red);
  color: white;
  font-size: 10px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const NotificationsPanel = styled.div`
  position: absolute;
  top: 100%;
  right: -10px;
  width: 300px;
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  z-index: 100;
  margin-top: var(--spacing-sm);
`

const NotificationsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
  
  h3 {
    margin: 0;
    font-size: var(--font-size-md);
    color: var(--text-primary);
  }
`

const MarkReadButton = styled.button`
  background: none;
  border: none;
  color: var(--md-red);
  font-size: var(--font-size-sm);
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`

const NotificationsList = styled.div`
  max-height: 300px;
  overflow-y: auto;
`

const NotificationItem = styled.div`
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
  background-color: ${props => props.isUnread ? 'var(--bg-highlight)' : 'transparent'};
  
  &:last-child {
    border-bottom: none;
  }
`

const NotificationContent = styled.p`
  margin: 0;
  color: var(--text-primary);
  font-size: var(--font-size-sm);
`

const EmptyNotifications = styled.div`
  padding: var(--spacing-md);
  text-align: center;
  color: var(--text-tertiary);
  font-size: var(--font-size-sm);
`

const UserInfo = styled.div`
  display: flex;
  align-items: center;
`

const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--md-red);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-right: var(--spacing-sm);
`

const UserName = styled.span`
  color: var(--text-primary);
  font-weight: 500;
`

const ContentArea = styled.div`
  flex-grow: 1;
  padding: var(--spacing-md);
`

export default Layout
