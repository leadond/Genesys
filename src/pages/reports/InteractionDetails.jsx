import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { FaDownload, FaFilter, FaSync, FaSearch } from 'react-icons/fa'

const InteractionDetails = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [interactions, setInteractions] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days ago
    end: new Date().toISOString().split('T')[0] // today
  })
  
  useEffect(() => {
    fetchInteractionData()
  }, [dateRange])
  
  const fetchInteractionData = async () => {
    try {
      setIsLoading(true)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Sample data - in a real app, this would come from the Genesys Cloud API
      const sampleInteractions = [
        {
          id: '12345-abcde',
          timestamp: '2023-05-15T10:23:45Z',
          type: 'Call',
          direction: 'Inbound',
          ani: '+1234567890',
          dnis: '+1987654321',
          queue: 'Customer Service',
          agent: 'John Smith',
          duration: 245,
          waitTime: 35,
          disposition: 'Resolved'
        },
        {
          id: '67890-fghij',
          timestamp: '2023-05-15T11:45:12Z',
          type: 'Chat',
          direction: 'Inbound',
          ani: 'customer@example.com',
          dnis: 'support@company.com',
          queue: 'Technical Support',
          agent: 'Sarah Johnson',
          duration: 780,
          waitTime: 20,
          disposition: 'Escalated'
        },
        {
          id: '54321-klmno',
          timestamp: '2023-05-15T13:12:33Z',
          type: 'Call',
          direction: 'Outbound',
          ani: '+1987654321',
          dnis: '+1234567890',
          queue: 'Sales',
          agent: 'Michael Brown',
          duration: 320,
          waitTime: 0,
          disposition: 'Completed'
        },
        {
          id: '09876-pqrst',
          timestamp: '2023-05-15T14:30:45Z',
          type: 'Email',
          direction: 'Inbound',
          ani: 'inquiry@example.com',
          dnis: 'info@company.com',
          queue: 'General Inquiries',
          agent: 'Emily Davis',
          duration: 540,
          waitTime: 120,
          disposition: 'Pending'
        },
        {
          id: '13579-uvwxy',
          timestamp: '2023-05-15T16:05:22Z',
          type: 'Call',
          direction: 'Inbound',
          ani: '+1122334455',
          dnis: '+1987654321',
          queue: 'Billing',
          agent: 'David Wilson',
          duration: 185,
          waitTime: 45,
          disposition: 'Resolved'
        }
      ]
      
      setInteractions(sampleInteractions)
      setError(null)
    } catch (err) {
      console.error('Error fetching interaction data:', err)
      setError('Failed to load interaction details. Please try again later.')
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
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }
  
  // Format timestamp to readable date/time
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }
  
  // Format seconds to mm:ss
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  // Filter interactions based on search term
  const filteredInteractions = interactions.filter(interaction => {
    const searchLower = searchTerm.toLowerCase()
    return (
      interaction.id.toLowerCase().includes(searchLower) ||
      interaction.agent.toLowerCase().includes(searchLower) ||
      interaction.queue.toLowerCase().includes(searchLower) ||
      interaction.ani.toLowerCase().includes(searchLower) ||
      interaction.disposition.toLowerCase().includes(searchLower)
    )
  })
  
  const exportData = () => {
    // In a real app, this would generate a CSV or Excel file
    alert('Export functionality would be implemented here')
  }
  
  if (isLoading) {
    return (
      <LoadingContainer>
        <Spinner />
        <p>Loading interaction details...</p>
      </LoadingContainer>
    )
  }
  
  if (error) {
    return (
      <ErrorContainer>
        <ErrorMessage>{error}</ErrorMessage>
        <RefreshButton onClick={fetchInteractionData}>
          Retry
        </RefreshButton>
      </ErrorContainer>
    )
  }
  
  return (
    <ReportContainer>
      <ReportHeader>
        <h1>Interaction Details</h1>
        <HeaderActions>
          <RefreshButton onClick={fetchInteractionData}>
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
          
          <FilterGroup>
            <Label htmlFor="search">Search</Label>
            <SearchInput>
              <FaSearch />
              <Input
                type="text"
                id="search"
                placeholder="Search by ID, agent, queue, etc."
                value={searchTerm}
                onChange={handleSearch}
              />
            </SearchInput>
          </FilterGroup>
        </FilterGrid>
      </FilterSection>
      
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>ID</TableHeader>
              <TableHeader>Timestamp</TableHeader>
              <TableHeader>Type</TableHeader>
              <TableHeader>Direction</TableHeader>
              <TableHeader>ANI/From</TableHeader>
              <TableHeader>Queue</TableHeader>
              <TableHeader>Agent</TableHeader>
              <TableHeader>Duration</TableHeader>
              <TableHeader>Wait Time</TableHeader>
              <TableHeader>Disposition</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInteractions.map(interaction => (
              <TableRow key={interaction.id}>
                <TableCell>{interaction.id}</TableCell>
                <TableCell>{formatTimestamp(interaction.timestamp)}</TableCell>
                <TableCell>{interaction.type}</TableCell>
                <TableCell>{interaction.direction}</TableCell>
                <TableCell>{interaction.ani}</TableCell>
                <TableCell>{interaction.queue}</TableCell>
                <TableCell>{interaction.agent}</TableCell>
                <TableCell>{formatDuration(interaction.duration)}</TableCell>
                <TableCell>{interaction.waitTime}s</TableCell>
                <TableCell>
                  <DispositionBadge $disposition={interaction.disposition}>
                    {interaction.disposition}
                  </DispositionBadge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredInteractions.length === 0 && (
          <EmptyState>
            <p>No interactions found matching your criteria.</p>
          </EmptyState>
        )}
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
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
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

const SearchInput = styled.div`
  position: relative;
  
  svg {
    position: absolute;
    left: var(--spacing-sm);
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-tertiary);
  }
  
  input {
    padding-left: calc(var(--spacing-sm) * 2 + 16px);
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
  white-space: nowrap;
`

const TableCell = styled.td`
  padding: var(--spacing-md);
  color: var(--text-primary);
`

const DispositionBadge = styled.span`
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: 500;
  
  ${props => {
    switch (props.$disposition) {
      case 'Resolved':
        return `
          background-color: #d4edda;
          color: #155724;
        `
      case 'Escalated':
        return `
          background-color: #fff3cd;
          color: #856404;
        `
      case 'Pending':
        return `
          background-color: #cce5ff;
          color: #004085;
        `
      default:
        return `
          background-color: #e2e3e5;
          color: #383d41;
        `
    }
  }}
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

const EmptyState = styled.div`
  text-align: center;
  padding: var(--spacing-xl);
  
  p {
    color: var(--text-secondary);
  }
`

export default InteractionDetails
