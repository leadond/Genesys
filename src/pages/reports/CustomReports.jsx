import { useState } from 'react'
import styled from 'styled-components'
import { FaInfoCircle, FaPlus } from 'react-icons/fa'

const CustomReports = () => {
  const [activeTab, setActiveTab] = useState('create')
  
  return (
    <ReportContainer>
      <ReportHeader>
        <h1>Custom Reports</h1>
      </ReportHeader>
      
      <TabContainer>
        <TabButton 
          $active={activeTab === 'create'} 
          onClick={() => setActiveTab('create')}
        >
          Create Report
        </TabButton>
        <TabButton 
          $active={activeTab === 'saved'} 
          onClick={() => setActiveTab('saved')}
        >
          Saved Reports
        </TabButton>
        <TabButton 
          $active={activeTab === 'scheduled'} 
          onClick={() => setActiveTab('scheduled')}
        >
          Scheduled Reports
        </TabButton>
      </TabContainer>
      
      {activeTab === 'create' && (
        <CreateReportSection>
          <InfoBox>
            <FaInfoCircle />
            <p>
              Create custom reports by selecting metrics, dimensions, and filters. 
              You can save your report configuration for future use or schedule it 
              for automatic generation.
            </p>
          </InfoBox>
          
          <ReportBuilderCard>
            <h2>Report Builder</h2>
            
            <FormGroup>
              <Label htmlFor="reportName">Report Name</Label>
              <Input 
                type="text" 
                id="reportName" 
                placeholder="Enter a name for your report"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Report Type</Label>
              <Select defaultValue="">
                <option value="" disabled>Select a report type</option>
                <option value="agent">Agent Performance</option>
                <option value="queue">Queue Performance</option>
                <option value="interaction">Interaction Details</option>
                <option value="survey">Survey Results</option>
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label>Date Range</Label>
              <DateRangeContainer>
                <DateInput type="date" />
                <DateSeparator>to</DateSeparator>
                <DateInput type="date" />
              </DateRangeContainer>
            </FormGroup>
            
            <MetricsSection>
              <SectionTitle>Metrics</SectionTitle>
              <MetricsList>
                <MetricItem>
                  <input type="checkbox" id="metric1" />
                  <label htmlFor="metric1">Number of Interactions</label>
                </MetricItem>
                <MetricItem>
                  <input type="checkbox" id="metric2" />
                  <label htmlFor="metric2">Average Handle Time</label>
                </MetricItem>
                <MetricItem>
                  <input type="checkbox" id="metric3" />
                  <label htmlFor="metric3">Average Wait Time</label>
                </MetricItem>
                <MetricItem>
                  <input type="checkbox" id="metric4" />
                  <label htmlFor="metric4">Abandon Rate</label>
                </MetricItem>
                <MetricItem>
                  <input type="checkbox" id="metric5" />
                  <label htmlFor="metric5">Service Level</label>
                </MetricItem>
                <AddMetricButton>
                  <FaPlus />
                  <span>Add Metric</span>
                </AddMetricButton>
              </MetricsList>
            </MetricsSection>
            
            <FiltersSection>
              <SectionTitle>Filters</SectionTitle>
              <p>Add filters to narrow down your report data.</p>
              <AddFilterButton>
                <FaPlus />
                <span>Add Filter</span>
              </AddFilterButton>
            </FiltersSection>
            
            <ButtonContainer>
              <SaveButton>Save Report</SaveButton>
              <GenerateButton>Generate Report</GenerateButton>
            </ButtonContainer>
          </ReportBuilderCard>
          
          <HelpSection>
            <h3>How to Create a Custom Report</h3>
            <ol>
              <li>Log in to your Genesys Cloud Admin account</li>
              <li>Navigate to Admin > Integrations > OAuth</li>
              <li>Create a new OAuth client with the following permissions:
                <ul>
                  <li>analytics:webview</li>
                  <li>analytics:userObservation</li>
                  <li>analytics:queueObservation</li>
                </ul>
              </li>
              <li>Use the client credentials to authenticate with this application</li>
            </ol>
          </HelpSection>
        </CreateReportSection>
      )}
      
      {activeTab === 'saved' && (
        <SavedReportsSection>
          <EmptyState>
            <p>You don't have any saved reports yet.</p>
            <button onClick={() => setActiveTab('create')}>Create Your First Report</button>
          </EmptyState>
        </SavedReportsSection>
      )}
      
      {activeTab === 'scheduled' && (
        <ScheduledReportsSection>
          <EmptyState>
            <p>You don't have any scheduled reports yet.</p>
            <button onClick={() => setActiveTab('create')}>Create a Scheduled Report</button>
          </EmptyState>
        </ScheduledReportsSection>
      )}
    </ReportContainer>
  )
}

const ReportContainer = styled.div`
  padding: var(--spacing-md);
`

const ReportHeader = styled.div`
  margin-bottom: var(--spacing-lg);
  
  h1 {
    font-size: var(--font-size-xl);
    color: var(--text-primary);
  }
`

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: var(--spacing-lg);
`

const TabButton = styled.button`
  padding: var(--spacing-md) var(--spacing-lg);
  background: none;
  border: none;
  border-bottom: 3px solid ${props => props.$active ? 'var(--md-red)' : 'transparent'};
  color: ${props => props.$active ? 'var(--text-primary)' : 'var(--text-secondary)'};
  font-weight: ${props => props.$active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    color: var(--text-primary);
  }
`

const CreateReportSection = styled.div``

const InfoBox = styled.div`
  display: flex;
  align-items: flex-start;
  padding: var(--spacing-md);
  background-color: var(--bg-secondary);
  border-radius: var(--border-radius-md);
  margin-bottom: var(--spacing-lg);
  
  svg {
    color: var(--md-red);
    margin-right: var(--spacing-md);
    font-size: var(--font-size-lg);
    flex-shrink: 0;
  }
  
  p {
    margin: 0;
    color: var(--text-secondary);
  }
`

const ReportBuilderCard = styled.div`
  background-color: var(--bg-primary);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  
  h2 {
    font-size: var(--font-size-lg);
    margin-bottom: var(--spacing-md);
    color: var(--text-primary);
  }
`

const FormGroup = styled.div`
  margin-bottom: var(--spacing-md);
`

const Label = styled.label`
  display: block;
  font-weight: 500;
  margin-bottom: var(--spacing-xs);
  color: var(--text-primary);
`

const Input = styled.input`
  width: 100%;
  padding: var(--spacing-sm);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  
  &:focus {
    outline: none;
    border-color: var(--md-red);
  }
`

const Select = styled.select`
  width: 100%;
  padding: var(--spacing-sm);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  
  &:focus {
    outline: none;
    border-color: var(--md-red);
  }
`

const DateRangeContainer = styled.div`
  display: flex;
  align-items: center;
`

const DateInput = styled.input`
  flex: 1;
  padding: var(--spacing-sm);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  
  &:focus {
    outline: none;
    border-color: var(--md-red);
  }
`

const DateSeparator = styled.span`
  margin: 0 var(--spacing-sm);
  color: var(--text-secondary);
`

const MetricsSection = styled.div`
  margin-bottom: var(--spacing-lg);
`

const SectionTitle = styled.h3`
  font-size: var(--font-size-md);
  margin-bottom: var(--spacing-sm);
  color: var(--text-primary);
`

const MetricsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-sm);
`

const MetricItem = styled.div`
  display: flex;
  align-items: center;
  
  input {
    margin-right: var(--spacing-xs);
  }
  
  label {
    color: var(--text-primary);
  }
`

const AddMetricButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: 1px dashed var(--border-color);
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-sm);
  color: var(--text-secondary);
  cursor: pointer;
  
  svg {
    margin-right: var(--spacing-xs);
  }
  
  &:hover {
    color: var(--md-red);
    border-color: var(--md-red);
  }
`

const FiltersSection = styled.div`
  margin-bottom: var(--spacing-lg);
  
  p {
    color: var(--text-secondary);
    margin-bottom: var(--spacing-sm);
  }
`

const AddFilterButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: 1px dashed var(--border-color);
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-sm);
  color: var(--text-secondary);
  cursor: pointer;
  
  svg {
    margin-right: var(--spacing-xs);
  }
  
  &:hover {
    color: var(--md-red);
    border-color: var(--md-red);
  }
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
`

const SaveButton = styled.button`
  padding: var(--spacing-sm) var(--spacing-lg);
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background-color: var(--bg-tertiary);
  }
`

const GenerateButton = styled.button`
  padding: var(--spacing-sm) var(--spacing-lg);
  background-color: var(--md-red);
  color: white;
  border: none;
  border-radius: var(--border-radius-sm);
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background-color: var(--md-dark-red);
  }
`

const HelpSection = styled.div`
  background-color: var(--bg-primary);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-lg);
  
  h3 {
    font-size: var(--font-size-md);
    margin-bottom: var(--spacing-md);
    color: var(--text-primary);
  }
  
  ol {
    padding-left: var(--spacing-lg);
    color: var(--text-primary);
  }
  
  li {
    margin-bottom: var(--spacing-sm);
  }
  
  ul {
    padding-left: var(--spacing-lg);
    margin-top: var(--spacing-xs);
    color: var(--text-secondary);
  }
`

const SavedReportsSection = styled.div`
  min-height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const ScheduledReportsSection = styled.div`
  min-height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const EmptyState = styled.div`
  text-align: center;
  padding: var(--spacing-xl);
  
  p {
    color: var(--text-secondary);
    margin-bottom: var(--spacing-md);
  }
  
  button {
    padding: var(--spacing-sm) var(--spacing-lg);
    background-color: var(--md-red);
    color: white;
    border: none;
    border-radius: var(--border-radius-sm);
    font-weight: 500;
    cursor: pointer;
    
    &:hover {
      background-color: var(--md-dark-red);
    }
  }
`

export default CustomReports
