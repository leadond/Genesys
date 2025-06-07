import { useState } from 'react'
import styled from 'styled-components'
import { useAuth } from '../context/AuthContext'
import ConnectionStatus from '../components/ConnectionStatus'
import PremiumAppDebugger from '../components/PremiumAppDebugger'
import { FaInfoCircle, FaExternalLinkAlt, FaBug } from 'react-icons/fa'

const SettingsContainer = styled.div`
  padding: 20px;
`

const SettingsHeader = styled.div`
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

const SettingsSection = styled.div`
  margin-bottom: 30px;
  background-color: var(--bg-secondary);
  border-radius: 8px;
  padding: 20px;
  border: 1px solid var(--border-color);
`

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 15px;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
`

const FormGroup = styled.div`
  margin-bottom: 15px;
`

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: var(--text-primary);
`

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--bg-primary);
  color: var(--text-primary);
`

const Button = styled.button`
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  cursor: pointer;
  font-weight: 600;
  
  &:hover {
    background-color: var(--primary-dark);
  }
  
  &:disabled {
    background-color: var(--disabled);
    cursor: not-allowed;
  }
`

const InfoBox = styled.div`
  background-color: var(--info-bg);
  color: var(--info-text);
  padding: 15px;
  border-radius: 4px;
  margin: 15px 0;
  display: flex;
  gap: 10px;
  
  .icon {
    color: var(--info-icon);
    margin-top: 2px;
  }
  
  .content {
    flex: 1;
  }
`

const PremiumAppInfo = styled.div`
  background-color: var(--primary-light);
  color: var(--primary-dark);
  padding: 15px;
  border-radius: 4px;
  margin: 15px 0;
  
  h3 {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
  }
  
  ul {
    margin-left: 20px;
  }
  
  li {
    margin-bottom: 5px;
  }
`

const TroubleshootingSection = styled.div`
  background-color: #fff3cd;
  color: #856404;
  padding: 15px;
  border-radius: 4px;
  margin: 15px 0;
  border-left: 4px solid #ffeeba;
  
  h3 {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    color: #856404;
  }
  
  ul {
    margin-left: 20px;
  }
  
  li {
    margin-bottom: 8px;
  }
`

const Settings = () => {
  const { isAuthenticated, user, isPremiumApp, error } = useAuth()
  const [clientId, setClientId] = useState(import.meta.env.VITE_GENESYS_CLIENT_ID || '')
  const [environment, setEnvironment] = useState(import.meta.env.VITE_GENESYS_ENVIRONMENT || 'usw2.pure.cloud')
  
  const handleSaveSettings = () => {
    // In a real app, this would save to localStorage or a settings API
    alert('Settings saved!')
  }
  
  return (
    <SettingsContainer>
      <SettingsHeader>
        <h1>Settings</h1>
        <p>Configure your Genesys Cloud reporting application</p>
      </SettingsHeader>
      
      <ConnectionStatus />
      
      {isPremiumApp && (
        <PremiumAppInfo>
          <h3>
            <FaExternalLinkAlt /> Running as Genesys Cloud Premium App
          </h3>
          <p>This application is running as a Genesys Cloud Premium App, which means:</p>
          <ul>
            <li>Authentication is handled automatically through Genesys Cloud</li>
            <li>The application is embedded within the Genesys Cloud interface</li>
            <li>Some settings are managed by Genesys Cloud and cannot be changed here</li>
          </ul>
        </PremiumAppInfo>
      )}
      
      {isPremiumApp && error && (
        <TroubleshootingSection>
          <h3>
            <FaBug /> Authentication Troubleshooting
          </h3>
          <p>We detected an authentication issue with your Premium App. Here are some common solutions:</p>
          <ul>
            <li><strong>Check OAuth Permissions</strong> - Ensure your Premium App has all required permissions: <code>analytics:read</code>, <code>user:read</code>, <code>organization:read</code>, <code>routing:read</code>, <code>conversation:read</code></li>
            <li><strong>Verify Group Access</strong> - Make sure your user belongs to a group that has access to this Premium App</li>
            <li><strong>Check Iframe Settings</strong> - Ensure the Premium App's iframe sandbox settings include: <code>allow-same-origin</code>, <code>allow-scripts</code>, <code>allow-forms</code>, <code>allow-popups</code></li>
            <li><strong>CORS Configuration</strong> - Verify your hosting server allows requests from Genesys Cloud domains</li>
            <li><strong>Browser Cache</strong> - Try clearing your browser cache or using incognito mode</li>
          </ul>
          <p>For more detailed troubleshooting, use the Premium App Debugger below.</p>
        </TroubleshootingSection>
      )}
      
      {isPremiumApp && <PremiumAppDebugger />}
      
      <SettingsSection>
        <SectionTitle>Genesys Cloud Connection</SectionTitle>
        
        <FormGroup>
          <Label htmlFor="clientId">OAuth Client ID:</Label>
          <Input 
            type="text" 
            id="clientId" 
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            placeholder="Enter your Genesys Cloud OAuth Client ID"
            disabled={isPremiumApp}
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="environment">Genesys Cloud Environment:</Label>
          <Input 
            type="text" 
            id="environment" 
            value={environment}
            onChange={(e) => setEnvironment(e.target.value)}
            placeholder="e.g., usw2.pure.cloud"
            disabled={isPremiumApp}
          />
        </FormGroup>
        
        {isPremiumApp ? (
          <InfoBox>
            <div className="icon">
              <FaInfoCircle />
            </div>
            <div className="content">
              <p>When running as a Premium App, connection settings are managed by Genesys Cloud and cannot be modified here.</p>
            </div>
          </InfoBox>
        ) : (
          <Button 
            onClick={handleSaveSettings}
            disabled={!clientId || !environment}
          >
            Save Connection Settings
          </Button>
        )}
      </SettingsSection>
      
      {isAuthenticated && (
        <SettingsSection>
          <SectionTitle>User Information</SectionTitle>
          
          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Organization:</strong> {user?.organization || 'MDACC'}</p>
          <p><strong>Environment:</strong> {environment}</p>
        </SettingsSection>
      )}
      
      <SettingsSection>
        <SectionTitle>About</SectionTitle>
        
        <p><strong>Application:</strong> MD Anderson Cancer Center Genesys Cloud Reporting Tool</p>
        <p><strong>Version:</strong> 0.1.0</p>
        <p><strong>Environment:</strong> {isPremiumApp ? 'Genesys Cloud Premium App' : 'Standalone Application'}</p>
      </SettingsSection>
    </SettingsContainer>
  )
}

export default Settings
