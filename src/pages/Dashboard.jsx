import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { FaPhoneAlt, FaEnvelope, FaComments, FaUsers, FaChartLine, FaExclamationTriangle } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

const Dashboard = () => {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  
  // Simulated data - in a real app, this would come from the Genesys Cloud API
  const [dashboardData, setDashboardData] = useState({
    callsToday: 0,
    emailsToday: 0,
    chatsToday: 0,
    agentsOnline: 0,
    serviceLevel: 0,
    abandonRate: 0
  })
  
  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setDashboardData({
        callsToday: 1247,
        emailsToday: 356,
        chatsToday: 189,
        agentsOnline: 42,
        serviceLevel: 87,
        abandonRate: 4.2
      })
      setIsLoading(false)
    }, 1500)
    
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <DashboardContainer>
      <WelcomeSection>
        <h1>Welcome back, {user?.name || 'User'}</h1>
        <p>Here's what's happening in your contact center today</p>
      </WelcomeSection>
      
      {isLoading ? (
        <LoadingState>
          <div className="loading-spinner"></div>
          <p>Loading dashboard data...</p>
        </LoadingState>
      ) : (
        <>
          <MetricsGrid>
            <MetricCard>
              <MetricIcon color="#4a6cf7">
                <FaPhoneAlt />
              </MetricIcon>
              <MetricContent>
                <MetricValue>{dashboardData.callsToday.toLocaleString()}</MetricValue>
                <MetricLabel>Calls Today</MetricLabel>
              </MetricContent>
            </MetricCard>
            
            <MetricCard>
              <MetricIcon color="#6c5ce7">
                <FaEnvelope />
              </MetricIcon>
              <MetricContent>
                <MetricValue>{dashboardData.emailsToday.toLocaleString()}</MetricValue>
                <MetricLabel>Emails Today</MetricLabel>
              </MetricContent>
            </MetricCard>
            
            <MetricCard>
              <MetricIcon color="#00b894">
                <FaComments />
              </MetricIcon>
              <MetricContent>
                <MetricValue>{dashboardData.chatsToday.toLocaleString()}</MetricValue>
                <MetricLabel>Chats Today</MetricLabel>
              </MetricContent>
            </MetricCard>
            
            <MetricCard>
              <MetricIcon color="#fdcb6e">
                <FaUsers />
              </MetricIcon>
              <MetricContent>
                <MetricValue>{dashboardData.agentsOnline}</MetricValue>
                <MetricLabel>Agents Online</MetricLabel>
              </MetricContent>
            </MetricCard>
            
            <MetricCard>
              <MetricIcon color="#00cec9">
                <FaChartLine />
              </MetricIcon>
              <MetricContent>
                <MetricValue>{dashboardData.serviceLevel}%</MetricValue>
                <MetricLabel>Service Level</MetricLabel>
              </MetricContent>
            </MetricCard>
            
            <MetricCard>
              <MetricIcon color="#e17055">
                <FaExclamationTriangle />
              </MetricIcon>
              <MetricContent>
                <MetricValue>{dashboardData.abandonRate}%</MetricValue>
                <MetricLabel>Abandon Rate</MetricLabel>
              </MetricContent>
            </MetricCard>
          </MetricsGrid>
          
          <DashboardSections>
            <DashboardSection>
              <SectionHeader>
                <h2>Queue Status</h2>
                <ViewAllLink>View All</ViewAllLink>
              </SectionHeader>
              
              <QueueTable>
                <thead>
                  <tr>
                    <th>Queue Name</th>
                    <th>Waiting</th>
                    <th>Longest Wait</th>
                    <th>Agents</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Main Line</td>
                    <td>3</td>
                    <td>1:24</td>
                    <td>12/15</td>
                    <td><StatusBadge status="normal">Normal</StatusBadge></td>
                  </tr>
                  <tr>
                    <td>Billing Support</td>
                    <td>7</td>
                    <td>4:12</td>
                    <td>5/8</td>
                    <td><StatusBadge status="warning">Warning</StatusBadge></td>
                  </tr>
                  <tr>
                    <td>Technical Support</td>
                    <td>1</td>
                    <td>0:45</td>
                    <td>8/10</td>
                    <td><StatusBadge status="normal">Normal</StatusBadge></td>
                  </tr>
                  <tr>
                    <td>Patient Scheduling</td>
                    <td>12</td>
                    <td>8:37</td>
                    <td>7/12</td>
                    <td><StatusBadge status="critical">Critical</StatusBadge></td>
                  </tr>
                  <tr>
                    <td>General Inquiries</td>
                    <td>2</td>
                    <td>1:05</td>
                    <td>10/12</td>
                    <td><StatusBadge status="normal">Normal</StatusBadge></td>
                  </tr>
                </tbody>
              </QueueTable>
            </DashboardSection>
            
            <DashboardSection>
              <SectionHeader>
                <h2>Recent Alerts</h2>
                <ViewAllLink>View All</ViewAllLink>
              </SectionHeader>
              
              <AlertsList>
                <AlertItem severity="high">
                  <AlertContent>
                    <AlertTitle>High abandon rate in Patient Scheduling queue</AlertTitle>
                    <AlertTime>15 minutes ago</AlertTime>
                  </AlertContent>
                </AlertItem>
                
                <AlertItem severity="medium">
                  <AlertContent>
                    <AlertTitle>Service level below target in Billing Support</AlertTitle>
                    <AlertTime>42 minutes ago</AlertTime>
                  </AlertContent>
                </AlertItem>
                
                <AlertItem severity="low">
                  <AlertContent>
                    <AlertTitle>Agent utilization above 90% for Technical Support team</AlertTitle>
                    <AlertTime>1 hour ago</AlertTime>
                  </AlertContent>
                </AlertItem>
                
                <AlertItem severity="info">
                  <AlertContent>
                    <AlertTitle>System maintenance scheduled for Sunday, 2:00 AM</AlertTitle>
                    <AlertTime>3 hours ago</AlertTime>
                  </AlertContent>
                </AlertItem>
              </AlertsList>
            </DashboardSection>
          </DashboardSections>
        </>
      )}
    </DashboardContainer>
  )
}

const DashboardContainer = styled.div`
  padding: var(--spacing-md);
`

const WelcomeSection = styled.section`
  margin-bottom: var(--spacing-lg);
  
  h1 {
    font-size: var(--font-size-xl);
    color: var(--text-primary);
    margin-bottom: var(--spacing-xs);
  }
  
  p {
    color: var(--text-secondary);
  }
`

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl) 0;
  
  p {
    margin-top: var(--spacing-md);
    color: var(--text-secondary);
  }
`

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
`

const MetricCard = styled.div`
  background-color: var(--bg-primary);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-lg);
  display: flex;
  align-items: center;
  border: 1px solid var(--border-color);
`

const MetricIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: ${props => props.color}10;
  color: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: var(--spacing-md);
  
  svg {
    font-size: 20px;
  }
`

const MetricContent = styled.div`
  flex-grow: 1;
`

const MetricValue = styled.div`
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
`

const MetricLabel = styled.div`
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
`

const DashboardSections = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-lg);
  
  @media (min-width: 1200px) {
    grid-template-columns: 2fr 1fr;
  }
`

const DashboardSection = styled.section`
  background-color: var(--bg-primary);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
  overflow: hidden;
`

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
  
  h2 {
    font-size: var(--font-size-lg);
    margin: 0;
    color: var(--text-primary);
  }
`

const ViewAllLink = styled.a`
  color: var(--md-red);
  font-size: var(--font-size-sm);
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`

const QueueTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: var(--spacing-md);
    text-align: left;
    border-bottom: 1px solid var(--border-color);
  }
  
  th {
    font-weight: 600;
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
  }
  
  td {
    color: var(--text-primary);
  }
  
  tr:last-child td {
    border-bottom: none;
  }
`

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: 600;
  
  ${props => {
    if (props.status === 'normal') {
      return `
        background-color: #d4edda;
        color: #155724;
      `;
    } else if (props.status === 'warning') {
      return `
        background-color: #fff3cd;
        color: #856404;
      `;
    } else if (props.status === 'critical') {
      return `
        background-color: #f8d7da;
        color: #721c24;
      `;
    }
  }}
`

const AlertsList = styled.div`
  padding: var(--spacing-md);
`

const AlertItem = styled.div`
  padding: var(--spacing-md);
  border-radius: var(--border-radius-sm);
  margin-bottom: var(--spacing-md);
  
  ${props => {
    if (props.severity === 'high') {
      return `
        background-color: #f8d7da;
        border-left: 4px solid #dc3545;
      `;
    } else if (props.severity === 'medium') {
      return `
        background-color: #fff3cd;
        border-left: 4px solid #ffc107;
      `;
    } else if (props.severity === 'low') {
      return `
        background-color: #d1ecf1;
        border-left: 4px solid #17a2b8;
      `;
    } else if (props.severity === 'info') {
      return `
        background-color: #e2e3e5;
        border-left: 4px solid #6c757d;
      `;
    }
  }}
  
  &:last-child {
    margin-bottom: 0;
  }
`

const AlertContent = styled.div``

const AlertTitle = styled.div`
  font-weight: 500;
  margin-bottom: var(--spacing-xs);
`

const AlertTime = styled.div`
  font-size: var(--font-size-sm);
  color: var(--text-tertiary);
`

export default Dashboard
