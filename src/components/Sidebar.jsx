import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { 
  FaChartBar, 
  FaUserFriends, 
  FaPhoneAlt, 
  FaListAlt, 
  FaCog,
  FaTachometerAlt
} from 'react-icons/fa'

const Sidebar = ({ isOpen }) => {
  return (
    <SidebarContainer $isOpen={isOpen}>
      <SidebarHeader>
        <SidebarTitle>Navigation</SidebarTitle>
      </SidebarHeader>
      
      <SidebarNav>
        <SidebarNavItem to="/" end>
          <FaTachometerAlt />
          <span>Dashboard</span>
        </SidebarNavItem>
        
        <SidebarSection>Reports</SidebarSection>
        
        <SidebarNavItem to="/reports/agent-performance">
          <FaUserFriends />
          <span>Agent Performance</span>
        </SidebarNavItem>
        
        <SidebarNavItem to="/reports/queue-performance">
          <FaChartBar />
          <span>Queue Performance</span>
        </SidebarNavItem>
        
        <SidebarNavItem to="/reports/interaction-details">
          <FaPhoneAlt />
          <span>Interaction Details</span>
        </SidebarNavItem>
        
        <SidebarNavItem to="/reports/custom">
          <FaListAlt />
          <span>Custom Reports</span>
        </SidebarNavItem>
        
        <SidebarSection>Configuration</SidebarSection>
        
        <SidebarNavItem to="/settings">
          <FaCog />
          <span>Settings</span>
        </SidebarNavItem>
      </SidebarNav>
      
      <SidebarFooter>
        <SidebarVersion>Version 1.0.0</SidebarVersion>
      </SidebarFooter>
    </SidebarContainer>
  )
}

const SidebarContainer = styled.aside`
  position: fixed;
  top: 60px;
  left: 0;
  bottom: 0;
  width: 250px;
  background-color: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  transform: ${props => props.$isOpen ? 'translateX(0)' : 'translateX(-100%)'};
  transition: transform 0.3s ease;
  z-index: 90;
  
  @media (max-width: 768px) {
    box-shadow: var(--shadow-lg);
  }
`

const SidebarHeader = styled.div`
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
`

const SidebarTitle = styled.h3`
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const SidebarNav = styled.nav`
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-md) 0;
`

const SidebarSection = styled.div`
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: var(--spacing-md);
`

const SidebarNavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  color: var(--text-secondary);
  text-decoration: none;
  border-left: 3px solid transparent;
  
  svg {
    margin-right: var(--spacing-sm);
    font-size: var(--font-size-md);
  }
  
  &:hover {
    background-color: var(--bg-tertiary);
    color: var(--text-primary);
    text-decoration: none;
  }
  
  &.active {
    color: var(--md-red);
    background-color: var(--bg-tertiary);
    border-left-color: var(--md-red);
    font-weight: 500;
  }
`

const SidebarFooter = styled.div`
  padding: var(--spacing-md);
  border-top: 1px solid var(--border-color);
  text-align: center;
`

const SidebarVersion = styled.div`
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
`

export default Sidebar
