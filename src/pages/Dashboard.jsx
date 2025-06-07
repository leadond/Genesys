import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useAuth } from '../context/AuthContext'
import ConnectionStatus from '../components/ConnectionStatus'
import DirectGenesysAuth from '../components/DirectGenesysAuth'

const DashboardContainer = styled.div`
  padding: 20px;
`

const WelcomeMessage = styled.div`
  margin-bottom: 30px;
  
  h1 {
    font-size: 1.8rem;
    margin-bottom: 10px;
    color: var(--primary);
  }
  
  p {
    color: var(--text-secondary);
  }
`

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth()
  
  return (
    <DashboardContainer>
      <WelcomeMessage>
        <h1>Genesys Cloud Reporting Dashboard</h1>
        <p>View and analyze contact center performance metrics</p>
      </WelcomeMessage>
      
      {/* Show connection status at the top of the dashboard */}
      <ConnectionStatus />
      
      {/* Show direct auth component if not authenticated */}
      {!isAuthenticated && <DirectGenesysAuth />}
      
      {isAuthenticated && (
        <div>
          <h2>Welcome, {user?.name}</h2>
          <p>You are successfully connected to the Genesys Cloud API.</p>
          <p>Your organization: {user?.organization || 'MDACC'}</p>
          <p>Environment: {import.meta.env.VITE_GENESYS_ENVIRONMENT || 'usw2.pure.cloud'}</p>
          
          {/* Dashboard content will go here */}
          <div style={{ marginTop: '30px' }}>
            <h3>Available Reports</h3>
            <p>Select a report type to begin:</p>
            
            {/* Placeholder for report selection */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
              gap: '20px',
              marginTop: '20px'
            }}>
              {['Queue Performance', 'Agent Statistics', 'Call Volume', 'Service Level'].map(report => (
                <div key={report} style={{
                  padding: '20px',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  ':hover': {
                    transform: 'translateY(-5px)'
                  }
                }}>
                  <h4>{report}</h4>
                  <p>View detailed {report.toLowerCase()} metrics</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </DashboardContainer>
  )
}

export default Dashboard
