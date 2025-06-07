import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { FaChartBar, FaUserFriends, FaPhoneAlt, FaClipboardList, FaFileAlt } from 'react-icons/fa'

const Reports = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  
  const reportCategories = [
    {
      id: 'agent',
      title: 'Agent Performance',
      icon: <FaUserFriends />,
      description: 'View detailed metrics on agent performance, including handle times, utilization, and quality scores.',
      path: '/reports/agent-performance'
    },
    {
      id: 'queue',
      title: 'Queue Performance',
      icon: <FaPhoneAlt />,
      description: 'Analyze queue metrics such as service level, abandon rate, and wait times across all channels.',
      path: '/reports/queue-performance'
    },
    {
      id: 'interaction',
      title: 'Interaction Details',
      icon: <FaClipboardList />,
      description: 'Search and view detailed information about specific customer interactions across all channels.',
      path: '/reports/interaction-details'
    },
    {
      id: 'custom',
      title: 'Custom Reports',
      icon: <FaFileAlt />,
      description: 'Create and schedule custom reports with the metrics and dimensions that matter to your business.',
      path: '/reports/custom-reports'
    }
  ]
  
  const filteredReports = reportCategories.filter(report => 
    report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.description.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  const handleReportClick = (path) => {
    navigate(path)
  }
  
  return (
    <ReportsContainer>
      <ReportsHeader>
        <h1>Reports</h1>
        <SearchInput 
          type="text" 
          placeholder="Search reports..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </ReportsHeader>
      
      <ReportCategoriesGrid>
        {filteredReports.map(report => (
          <ReportCard 
            key={report.id}
            onClick={() => handleReportClick(report.path)}
          >
            <ReportIcon>{report.icon}</ReportIcon>
            <ReportTitle>{report.title}</ReportTitle>
            <ReportDescription>{report.description}</ReportDescription>
            <ViewReportButton>View Report</ViewReportButton>
          </ReportCard>
        ))}
        
        {filteredReports.length === 0 && (
          <NoResultsMessage>
            No reports found matching "{searchTerm}". Try a different search term.
          </NoResultsMessage>
        )}
      </ReportCategoriesGrid>
      
      <RecentReportsSection>
        <h2>Recent Reports</h2>
        <RecentReportsList>
          <RecentReportItem>
            <RecentReportTitle>
              <FaChartBar />
              <span>Agent Performance - May 2023</span>
            </RecentReportTitle>
            <RecentReportMeta>Viewed 2 hours ago</RecentReportMeta>
          </RecentReportItem>
          
          <RecentReportItem>
            <RecentReportTitle>
              <FaPhoneAlt />
              <span>Queue Performance - Last 30 Days</span>
            </RecentReportTitle>
            <RecentReportMeta>Viewed yesterday</RecentReportMeta>
          </RecentReportItem>
          
          <RecentReportItem>
            <RecentReportTitle>
              <FaClipboardList />
              <span>Interaction Details - Customer #12345</span>
            </RecentReportTitle>
            <RecentReportMeta>Viewed 3 days ago</RecentReportMeta>
          </RecentReportItem>
        </RecentReportsList>
      </RecentReportsSection>
      
      <FavoriteReportsSection>
        <h2>Favorite Reports</h2>
        <EmptyStateMessage>
          <p>You haven't saved any favorite reports yet.</p>
          <p>Click the star icon on any report to add it to your favorites.</p>
        </EmptyStateMessage>
      </FavoriteReportsSection>
    </ReportsContainer>
  )
}

const ReportsContainer = styled.div`
  padding: var(--spacing-md);
`

const ReportsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  
  h1 {
    font-size: var(--font-size-xl);
    color: var(--text-primary);
    margin: 0;
  }
`

const SearchInput = styled.input`
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  width: 300px;
  font-size: var(--font-size-md);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  
  &:focus {
    outline: none;
    border-color: var(--md-red);
    box-shadow: 0 0 0 2px rgba(229, 0, 0, 0.2);
  }
`

const ReportCategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
`

const ReportCard = styled.div`
  background-color: var(--bg-primary);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-lg);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
    border-color: var(--md-red);
  }
`

const ReportIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background-color: var(--md-light-red);
  color: var(--md-red);
  border-radius: 50%;
  margin-bottom: var(--spacing-md);
  
  svg {
    font-size: 24px;
  }
`

const ReportTitle = styled.h3`
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-sm);
  color: var(--text-primary);
`

const ReportDescription = styled.p`
  color: var(--text-secondary);
  margin-bottom: var(--spacing-md);
  line-height: 1.5;
`

const ViewReportButton = styled.button`
  background-color: transparent;
  color: var(--md-red);
  border: 1px solid var(--md-red);
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--md-red);
    color: white;
  }
`

const RecentReportsSection = styled.section`
  margin-bottom: var(--spacing-xl);
  
  h2 {
    font-size: var(--font-size-lg);
    margin-bottom: var(--spacing-md);
    color: var(--text-primary);
  }
`

const RecentReportsList = styled.div`
  background-color: var(--bg-primary);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
  overflow: hidden;
`

const RecentReportItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: var(--bg-secondary);
  }
`

const RecentReportTitle = styled.div`
  display: flex;
  align-items: center;
  color: var(--text-primary);
  
  svg {
    color: var(--md-red);
    margin-right: var(--spacing-sm);
  }
`

const RecentReportMeta = styled.div`
  color: var(--text-tertiary);
  font-size: var(--font-size-sm);
`

const FavoriteReportsSection = styled.section`
  margin-bottom: var(--spacing-xl);
  
  h2 {
    font-size: var(--font-size-lg);
    margin-bottom: var(--spacing-md);
    color: var(--text-primary);
  }
`

const EmptyStateMessage = styled.div`
  background-color: var(--bg-primary);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
  padding: var(--spacing-xl);
  text-align: center;
  color: var(--text-secondary);
  
  p {
    margin-bottom: var(--spacing-sm);
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`

const NoResultsMessage = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--text-secondary);
`

export default Reports
