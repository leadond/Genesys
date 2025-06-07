import { useState } from 'react'
import styled from 'styled-components'
import { FaSave, FaKey, FaBell, FaUser, FaShieldAlt, FaDesktop } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

const Settings = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formError, setFormError] = useState(null)
  
  // Profile settings
  const [profileSettings, setProfileSettings] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    language: 'en-US',
    timezone: 'America/Chicago'
  })
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    desktopNotifications: true,
    alertSounds: true,
    dailyDigest: false,
    queueAlerts: true,
    systemUpdates: true
  })
  
  // Display settings
  const [displaySettings, setDisplaySettings] = useState({
    defaultDashboard: 'overview',
    tableRowsPerPage: '10',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h'
  })
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfileSettings({
      ...profileSettings,
      [name]: value
    })
  }
  
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target
    setNotificationSettings({
      ...notificationSettings,
      [name]: checked
    })
  }
  
  const handleDisplayChange = (e) => {
    const { name, value } = e.target
    setDisplaySettings({
      ...displaySettings,
      [name]: value
    })
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Simulate API call
    setTimeout(() => {
      setFormSubmitted(true)
      
      // Reset after 3 seconds
      setTimeout(() => {
        setFormSubmitted(false)
      }, 3000)
    }, 1000)
  }
  
  return (
    <SettingsContainer>
      <SettingsHeader>
        <h1>Settings</h1>
        <p>Manage your account settings and preferences</p>
      </SettingsHeader>
      
      <SettingsContent>
        <SettingsTabs>
          <SettingsTab 
            active={activeTab === 'profile'} 
            onClick={() => setActiveTab('profile')}
          >
            <FaUser />
            <span>Profile</span>
          </SettingsTab>
          
          <SettingsTab 
            active={activeTab === 'notifications'} 
            onClick={() => setActiveTab('notifications')}
          >
            <FaBell />
            <span>Notifications</span>
          </SettingsTab>
          
          <SettingsTab 
            active={activeTab === 'security'} 
            onClick={() => setActiveTab('security')}
          >
            <FaShieldAlt />
            <span>Security</span>
          </SettingsTab>
          
          <SettingsTab 
            active={activeTab === 'display'} 
            onClick={() => setActiveTab('display')}
          >
            <FaDesktop />
            <span>Display</span>
          </SettingsTab>
        </SettingsTabs>
        
        <SettingsPanel>
          {formSubmitted && (
            <SuccessMessage>
              Settings saved successfully!
            </SuccessMessage>
          )}
          
          {formError && (
            <ErrorMessage>
              {formError}
            </ErrorMessage>
          )}
          
          {activeTab === 'profile' && (
            <SettingsForm onSubmit={handleSubmit}>
              <FormSection>
                <SectionTitle>Personal Information</SectionTitle>
                
                <FormGroup>
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <FormInput 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={profileSettings.name}
                    onChange={handleProfileChange}
                  />
                </FormGroup>
                
                <FormGroup>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <FormInput 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={profileSettings.email}
                    onChange={handleProfileChange}
                    disabled
                  />
                  <FormHelpText>Email cannot be changed (managed by Genesys Cloud)</FormHelpText>
                </FormGroup>
                
                <FormGroup>
                  <FormLabel htmlFor="phone">Phone Number</FormLabel>
                  <FormInput 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    value={profileSettings.phone}
                    onChange={handleProfileChange}
                    placeholder="(123) 456-7890"
                  />
                </FormGroup>
              </FormSection>
              
              <FormSection>
                <SectionTitle>Regional Settings</SectionTitle>
                
                <FormGroup>
                  <FormLabel htmlFor="language">Language</FormLabel>
                  <FormSelect 
                    id="language" 
                    name="language" 
                    value={profileSettings.language}
                    onChange={handleProfileChange}
                  >
                    <option value="en-US">English (US)</option>
                    <option value="es-US">Spanish (US)</option>
                    <option value="fr-CA">French (Canada)</option>
                  </FormSelect>
                </FormGroup>
                
                <FormGroup>
                  <FormLabel htmlFor="timezone">Time Zone</FormLabel>
                  <FormSelect 
                    id="timezone" 
                    name="timezone" 
                    value={profileSettings.timezone}
                    onChange={handleProfileChange}
                  >
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  </FormSelect>
                </FormGroup>
              </FormSection>
              
              <FormActions>
                <SaveButton type="submit">
                  <FaSave />
                  <span>Save Changes</span>
                </SaveButton>
              </FormActions>
            </SettingsForm>
          )}
          
          {activeTab === 'notifications' && (
            <SettingsForm onSubmit={handleSubmit}>
              <FormSection>
                <SectionTitle>Notification Preferences</SectionTitle>
                
                <CheckboxGroup>
                  <FormCheckbox>
                    <input 
                      type="checkbox" 
                      id="emailNotifications" 
                      name="emailNotifications" 
                      checked={notificationSettings.emailNotifications}
                      onChange={handleNotificationChange}
                    />
                    <CheckboxLabel htmlFor="emailNotifications">
                      Email Notifications
                      <CheckboxDescription>Receive notifications via email</CheckboxDescription>
                    </CheckboxLabel>
                  </FormCheckbox>
                  
                  <FormCheckbox>
                    <input 
                      type="checkbox" 
                      id="desktopNotifications" 
                      name="desktopNotifications" 
                      checked={notificationSettings.desktopNotifications}
                      onChange={handleNotificationChange}
                    />
                    <CheckboxLabel htmlFor="desktopNotifications">
                      Desktop Notifications
                      <CheckboxDescription>Show notifications in your browser</CheckboxDescription>
                    </CheckboxLabel>
                  </FormCheckbox>
                  
                  <FormCheckbox>
                    <input 
                      type="checkbox" 
                      id="alertSounds" 
                      name="alertSounds" 
                      checked={notificationSettings.alertSounds}
                      onChange={handleNotificationChange}
                    />
                    <CheckboxLabel htmlFor="alertSounds">
                      Alert Sounds
                      <CheckboxDescription>Play sounds for important notifications</CheckboxDescription>
                    </CheckboxLabel>
                  </FormCheckbox>
                  
                  <FormCheckbox>
                    <input 
                      type="checkbox" 
                      id="dailyDigest" 
                      name="dailyDigest" 
                      checked={notificationSettings.dailyDigest}
                      onChange={handleNotificationChange}
                    />
                    <CheckboxLabel htmlFor="dailyDigest">
                      Daily Digest
                      <CheckboxDescription>Receive a daily summary of activities</CheckboxDescription>
                    </CheckboxLabel>
                  </FormCheckbox>
                </CheckboxGroup>
              </FormSection>
              
              <FormSection>
                <SectionTitle>Notification Types</SectionTitle>
                
                <CheckboxGroup>
                  <FormCheckbox>
                    <input 
                      type="checkbox" 
                      id="queueAlerts" 
                      name="queueAlerts" 
                      checked={notificationSettings.queueAlerts}
                      onChange={handleNotificationChange}
                    />
                    <CheckboxLabel htmlFor="queueAlerts">
                      Queue Alerts
                      <CheckboxDescription>Notifications about queue performance</CheckboxDescription>
                    </CheckboxLabel>
                  </FormCheckbox>
                  
                  <FormCheckbox>
                    <input 
                      type="checkbox" 
                      id="systemUpdates" 
                      name="systemUpdates" 
                      checked={notificationSettings.systemUpdates}
                      onChange={handleNotificationChange}
                    />
                    <CheckboxLabel htmlFor="systemUpdates">
                      System Updates
                      <CheckboxDescription>Notifications about system maintenance and updates</CheckboxDescription>
                    </CheckboxLabel>
                  </FormCheckbox>
                </CheckboxGroup>
              </FormSection>
              
              <FormActions>
                <SaveButton type="submit">
                  <FaSave />
                  <span>Save Changes</span>
                </SaveButton>
              </FormActions>
            </SettingsForm>
          )}
          
          {activeTab === 'security' && (
            <SettingsForm onSubmit={handleSubmit}>
              <FormSection>
                <SectionTitle>API Credentials</SectionTitle>
                <p>Your API credentials are managed through Genesys Cloud. To update your credentials, please visit the Genesys Cloud Admin portal.</p>
                
                <ApiCredentialsInfo>
                  <ApiCredentialItem>
                    <ApiCredentialLabel>Client ID:</ApiCredentialLabel>
                    <ApiCredentialValue>••••••••••••••••</ApiCredentialValue>
                  </ApiCredentialItem>
                  
                  <ApiCredentialItem>
                    <ApiCredentialLabel>Client Secret:</ApiCredentialLabel>
                    <ApiCredentialValue>••••••••••••••••</ApiCredentialValue>
                  </ApiCredentialItem>
                  
                  <ApiCredentialItem>
                    <ApiCredentialLabel>Last Updated:</ApiCredentialLabel>
                    <ApiCredentialValue>May 15, 2023</ApiCredentialValue>
                  </ApiCredentialItem>
                </ApiCredentialsInfo>
                
                <ManageCredentialsButton>
                  <FaKey />
                  <span>Manage in Genesys Cloud</span>
                </ManageCredentialsButton>
              </FormSection>
              
              <FormSection>
                <SectionTitle>Session Settings</SectionTitle>
                
                <FormGroup>
                  <FormLabel htmlFor="sessionTimeout">Session Timeout</FormLabel>
                  <FormSelect 
                    id="sessionTimeout" 
                    name="sessionTimeout" 
                    defaultValue="60"
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="120">2 hours</option>
                  </FormSelect>
                  <FormHelpText>Your session will expire after this period of inactivity</FormHelpText>
                </FormGroup>
              </FormSection>
              
              <FormActions>
                <SaveButton type="submit">
                  <FaSave />
                  <span>Save Changes</span>
                </SaveButton>
              </FormActions>
            </SettingsForm>
          )}
          
          {activeTab === 'display' && (
            <SettingsForm onSubmit={handleSubmit}>
              <FormSection>
                <SectionTitle>Display Preferences</SectionTitle>
                
                <FormGroup>
                  <FormLabel htmlFor="defaultDashboard">Default Dashboard</FormLabel>
                  <FormSelect 
                    id="defaultDashboard" 
                    name="defaultDashboard" 
                    value={displaySettings.defaultDashboard}
                    onChange={handleDisplayChange}
                  >
                    <option value="overview">Overview</option>
                    <option value="queues">Queue Performance</option>
                    <option value="agents">Agent Performance</option>
                  </FormSelect>
                </FormGroup>
                
                <FormGroup>
                  <FormLabel htmlFor="tableRowsPerPage">Table Rows Per Page</FormLabel>
                  <FormSelect 
                    id="tableRowsPerPage" 
                    name="tableRowsPerPage" 
                    value={displaySettings.tableRowsPerPage}
                    onChange={handleDisplayChange}
                  >
                    <option value="10">10 rows</option>
                    <option value="25">25 rows</option>
                    <option value="50">50 rows</option>
                    <option value="100">100 rows</option>
                  </FormSelect>
                </FormGroup>
              </FormSection>
              
              <FormSection>
                <SectionTitle>Date and Time Format</SectionTitle>
                
                <FormGroup>
                  <FormLabel htmlFor="dateFormat">Date Format</FormLabel>
                  <FormSelect 
                    id="dateFormat" 
                    name="dateFormat" 
                    value={displaySettings.dateFormat}
                    onChange={handleDisplayChange}
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </FormSelect>
                </FormGroup>
                
                <FormGroup>
                  <FormLabel htmlFor="timeFormat">Time Format</FormLabel>
                  <FormSelect 
                    id="timeFormat" 
                    name="timeFormat" 
                    value={displaySettings.timeFormat}
                    onChange={handleDisplayChange}
                  >
                    <option value="12h">12-hour (1:30 PM)</option>
                    <option value="24h">24-hour (13:30)</option>
                  </FormSelect>
                </FormGroup>
              </FormSection>
              
              <FormActions>
                <SaveButton type="submit">
                  <FaSave />
                  <span>Save Changes</span>
                </SaveButton>
              </FormActions>
            </SettingsForm>
          )}
        </SettingsPanel>
      </SettingsContent>
    </SettingsContainer>
  )
}

const SettingsContainer = styled.div`
  padding: var(--spacing-md);
`

const SettingsHeader = styled.div`
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

const SettingsContent = styled.div`
  display: flex;
  gap: var(--spacing-lg);
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const SettingsTabs = styled.div`
  width: 250px;
  background-color: var(--bg-primary);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
  overflow: hidden;
  
  @media (max-width: 768px) {
    width: 100%;
    display: flex;
    overflow-x: auto;
  }
`

const SettingsTab = styled.div`
  padding: var(--spacing-md);
  display: flex;
  align-items: center;
  cursor: pointer;
  border-left: 4px solid ${props => props.active ? 'var(--md-red)' : 'transparent'};
  background-color: ${props => props.active ? 'var(--md-light-red)' : 'transparent'};
  color: ${props => props.active ? 'var(--md-red)' : 'var(--text-primary)'};
  font-weight: ${props => props.active ? '600' : '400'};
  
  &:hover {
    background-color: ${props => props.active ? 'var(--md-light-red)' : 'var(--bg-hover)'};
  }
  
  svg {
    margin-right: var(--spacing-md);
    font-size: 18px;
  }
  
  @media (max-width: 768px) {
    border-left: none;
    border-bottom: 4px solid ${props => props.active ? 'var(--md-red)' : 'transparent'};
    padding: var(--spacing-md) var(--spacing-lg);
  }
`

const SettingsPanel = styled.div`
  flex-grow: 1;
  background-color: var(--bg-primary);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
  padding: var(--spacing-lg);
`

const SettingsForm = styled.form``

const FormSection = styled.div`
  margin-bottom: var(--spacing-xl);
  
  &:last-child {
    margin-bottom: 0;
  }
`

const SectionTitle = styled.h2`
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-md);
  color: var(--text-primary);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--border-color);
`

const FormGroup = styled.div`
  margin-bottom: var(--spacing-md);
`

const FormLabel = styled.label`
  display: block;
  margin-bottom: var(--spacing-xs);
  color: var(--text-primary);
  font-weight: 500;
`

const FormInput = styled.input`
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-size: var(--font-size-md);
  
  &:focus {
    outline: none;
    border-color: var(--md-red);
    box-shadow: 0 0 0 2px rgba(227, 38, 54, 0.2);
  }
  
  &:disabled {
    background-color: var(--bg-tertiary);
    cursor: not-allowed;
  }
`

const FormSelect = styled.select`
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-size: var(--font-size-md);
  
  &:focus {
    outline: none;
    border-color: var(--md-red);
    box-shadow: 0 0 0 2px rgba(227, 38, 54, 0.2);
  }
`

const FormHelpText = styled.div`
  font-size: var(--font-size-sm);
  color: var(--text-tertiary);
  margin-top: var(--spacing-xs);
`

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`

const FormCheckbox = styled.div`
  display: flex;
  align-items: flex-start;
  
  input {
    margin-top: 5px;
    margin-right: var(--spacing-sm);
  }
`

const CheckboxLabel = styled.label`
  display: flex;
  flex-direction: column;
  cursor: pointer;
  color: var(--text-primary);
  font-weight: 500;
`

const CheckboxDescription = styled.span`
  font-size: var(--font-size-sm);
  color: var(--text-tertiary);
  font-weight: 400;
  margin-top: 2px;
`

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: var(--spacing-xl);
`

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  background-color: var(--md-red);
  color: white;
  border: none;
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-sm) var(--spacing-lg);
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  svg {
    margin-right: var(--spacing-sm);
  }
  
  &:hover {
    background-color: var(--md-dark-red);
  }
`

const SuccessMessage = styled.div`
  background-color: #d4edda;
  color: #155724;
  padding: var(--spacing-md);
  border-radius: var(--border-radius-sm);
  margin-bottom: var(--spacing-lg);
  border-left: 4px solid #28a745;
`

const ErrorMessage = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: var(--spacing-md);
  border-radius: var(--border-radius-sm);
  margin-bottom: var(--spacing-lg);
  border-left: 4px solid #dc3545;
`

const ApiCredentialsInfo = styled.div`
  background-color: var(--bg-tertiary);
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-md);
  margin: var(--spacing-md) 0;
`

const ApiCredentialItem = styled.div`
  display: flex;
  margin-bottom: var(--spacing-sm);
  
  &:last-child {
    margin-bottom: 0;
  }
`

const ApiCredentialLabel = styled.div`
  width: 120px;
  font-weight: 500;
  color: var(--text-primary);
`

const ApiCredentialValue = styled.div`
  color: var(--text-secondary);
`

const ManageCredentialsButton = styled.button`
  display: flex;
  align-items: center;
  background-color: transparent;
  color: var(--md-red);
  border: 1px solid var(--md-red);
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  svg {
    margin-right: var(--spacing-sm);
  }
  
  &:hover {
    background-color: var(--md-red);
    color: white;
  }
`

export default Settings
