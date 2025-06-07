import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { FaDownload, FaFilter, FaSync } from 'react-icons/fa'

const AgentPerformance = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [agents, setAgents] = useState([])
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days ago
    end: new Date().toISOString().split('T')[0] // today
  })
  
  useEffect(() => {
    fetchAgentData()
  }, [dateRange])
  
  const fetchAgentData = async () => {
    try {
      setIsLoading(true)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Sample data - in a real app, this would come from the Genesys Cloud API
      const sampleAgents = [
        {
          id: '1',
          name: 'John Smith',
          calls: 87,
          avgHandleTime: 245,
          avgTalkTime: 180,
          avgHoldTime: 65,
          utilization: 78.5
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          calls: 92,
          avgHandleTime: 210,
          avgTalkTime: 165,
          avgHoldTime: 45,
          utilization: 82.3
        },
        {
          id: '3',
          name: 'Michael Brown',
          calls: 65,
          avgHandleTime: 320,
          avgTalkTime: 240,
          avgHoldTime: 80,
          utilization: 71.8
        },
        {
          id: '4',
          name: 'Emily Davis',
          calls: 78,
          avgHandleTime: 275,
          avgTalkTime: 210,
          avgHoldTime: 65,
          utilization: 75.2
        },
        {
          id: '5',
          name: 'David Wilson',
          calls: 103,
          avgHandleTime: 195,
          avgTalkTime: 150,
          avgHoldTime: 45,
          utilization: 85.7
        }
      ]
      
      setAgents(sampleAgents)
      setError(null)
    } catch (err) {
      console.error('Error fetching agent data:', err)
      setError('Failed to load agent performance data. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleDateChange = (e) => {
    const { name, value } = e.target
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  // Format seconds to mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  const exportData = () => {
    // In a real app, this would generate a CSV or Excel file
    alert('Export functionality would be implemented here')
  }
  
  if (isLoading) {
    return (
      <LoadingContainer>
        <Spinner />
        <p>Loading agent performance data...</p>
      </LoadingContainer>
    )
  }
  
  if (error) {
    return (
      <ErrorContainer>
        <ErrorMessage>{error}</ErrorMessage>
        <RefreshButton onClick={fetchAgentData}>
          Retry
        </RefreshButton>
      </ErrorContainer>
    )
  }
  
  return (
    <ReportContainer>
      <ReportHeader>
        <h1>Agent Performance</h1>
        <HeaderActions>
          <RefreshButton onClick={fetchAgentData}>
            <FaSync />
            <span>Refresh</span>
          </RefreshButton>
          <ExportButton onClick={exportData}>
            <FaDownload />
            <span>Export</span>
          </ExportButton>
        </HeaderActions>
      </ReportHeader>
      
      <FilterSection>
        <FilterTitle>
          <FaFilter />
          <span>Filters</span>
        </FilterTitle>
        
        <FilterGrid>
          <FilterGroup>
            <Label htmlFor="start">Start Date</Label>
            <Input
              type="date"
              id="start"
              name="start"
              value={dateRange.start}
              onChange={handleDateChange}
            />
          </FilterGroup>
          
          <FilterGroup>
            <Label htmlFor="end">End Date</Label>
            <Input
              type="date"
              id="end"
              name="end"
              value={dateRange.end}
              onChange={handleDateChange}
            />
          </FilterGroup>
          
          {/* Additional filters would go here */}
        </FilterGrid>
      </FilterSection>
      
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Agent Name</TableHeader>
              <TableHeader>Calls Handled</TableHeader>
              <TableHeader>Avg Handle Time</TableHeader>
              <TableHeader>Avg Talk Time</TableHeader>
              <TableHeader>Avg Hold Time</TableHeader>
              <TableHeader>Utilization %</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {agents.map(agent => (
              <TableRow key={agent.id}>
                <TableCell>{agent.name}</TableCell>
                <TableCell>{agent.calls}</TableCell>
                <TableCell>{formatTime(agent.avgHandleTime)}</TableCell>
                <TableCell>{formatTime(agent.avgTalkTime)}</TableCell>
                <TableCell>{formatTime(agent.avgHoldTime)}</TableCell>
                <TableCell>{agent.utilization}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </ReportContainer>
  )
}

const ReportContainer = styled.div`
  padding: var(--spacing-md);
`

const ReportHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  
  h1 {
    font-size: var(--font-size-xl);
    color: var(--text-primary);
  }
`

const HeaderActions = styled.div`
  display: flex;
  gap: var(--spacing-sm);
`

const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  font-weight: 500;
  
  svg {
    margin-right: var(--spacing-xs);
  }
  
  &:hover {
    background-color: var(--bg-tertiary);
  }
`

const ExportButton = styled.button`
  display: flex;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--md-red);
  color: white;
  border: none;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  font-weight: 500;
  
  svg {
    margin-right: var(--spacing-xs);
  }
  
  &:hover {
    background-color: var(--md-dark-red);
  }
`

const FilterSection = styled.div`
  background-color: var(--bg-primary);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
`

const FilterTitle = styled.h2`
  display: flex;
  align-items: center;
  font-size: var(--font-size-md);
  margin-bottom: var(--spacing-md);
  color: var(--text-primary);
  
  svg {
    margin-right: var(--spacing-xs);
    color: var(--text-secondary);
  }
`

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-md);
`

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
`

const Label = styled.label`
  font-weight: 500;
  margin-bottom: var(--spacing-xs);
  color: var(--text-primary);
`

const Input = styled.input`
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

const TableContainer = styled.div`
  background-color: var(--bg-primary);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  overflow: hidden;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`

const TableHead = styled.thead`
  background-color: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
`

const TableBody = styled.tbody``

const TableRow = styled.tr`
  &:not(:last-child) {
    border-bottom: 1px solid var(--border-color);
  }
  
  &:hover {
    background-color: var(--bg-tertiary);
  }
`

const TableHeader = styled.th`
  padding: var(--spacing-md);
  text-align: left;
  font-weight: 600;
  color: var(--text-primary);
`

const TableCell = styled.td`
  padding: var(--spacing-md);
  color: var(--text-primary);
`

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: var(--text-secondary);
`

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid rgba(229, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: var(--md-red);
  animation: spin 1s ease-in-out infinite;
  margin-bottom: var(--spacing-md);
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-xl);
`

const ErrorMessage = styled.div`
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  background-color: #f8d7da;
  color: #721c24;
  border-radius: var(--border-radius-sm);
  text-align: center;
  width: 100%;
  max-width: 500px;
`

export default AgentPerformance
