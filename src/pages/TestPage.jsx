import TestConnection from '../components/TestConnection'
import GenesysLoginWindow from '../components/GenesysLoginWindow'
import { useState } from 'react'
import styled from 'styled-components'

const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`

const Card = styled.div`
  background-color: var(--bg-secondary);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`

const Button = styled.button`
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
  margin-top: 10px;

  &:hover {
    background-color: var(--primary-dark);
  }
`

const TestPage = () => {
  const [isLoginWindowOpen, setIsLoginWindowOpen] = useState(false)
  
  return (
    <PageContainer>
      <h1>Test Genesys Cloud Integration</h1>
      
      <Card>
        <h2>Login with Personal Credentials</h2>
        <p>
          Use this option to log in with your personal Genesys Cloud credentials.
          This will redirect you to the Genesys Cloud login page.
        </p>
        <Button onClick={() => setIsLoginWindowOpen(true)}>
          Open Login Window
        </Button>
        
        <GenesysLoginWindow 
          isOpen={isLoginWindowOpen} 
          onClose={() => setIsLoginWindowOpen(false)} 
        />
      </Card>
      
      <TestConnection />
      
      <Card>
        <h2>OAuth Configuration</h2>
        <p>
          Make sure your OAuth client in Genesys Cloud has the following configuration:
        </p>
        <ul>
          <li><strong>Grant Type:</strong> Token Implicit Grant (Browser)</li>
          <li><strong>Redirect URI:</strong> {window.location.origin + window.location.pathname}</li>
          <li><strong>Required Scopes:</strong> analytics:read, user:read, organization:read, routing:read, conversation:read</li>
        </ul>
        <p>
          For detailed setup instructions, refer to the <code>docs/oauth-setup.md</code> file.
        </p>
      </Card>
    </PageContainer>
  )
}

export default TestPage
