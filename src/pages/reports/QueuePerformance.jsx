import { useState, useEffect, useRef } from 'react'
import { platformClient } from 'purecloud-platform-client-v2'
import { useAuth } from '../../context/AuthContext'
import DateRangePicker from '../../components/DateRangePicker'
import DataTable from '../../components/DataTable'
import BarChart from '../../components/charts/BarChart'
import LineChart from '../../components/charts/LineChart'
import PieChart from '../../components/charts/PieChart'
import ReportExporter from '../../components/ReportExporter'
import { subDays, format } from 'date-fns'

const QueuePerformance = () => {
  const { client } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [startDate, setStartDate] = useState(subDays(new Date(), 30))
  const [endDate, setEndDate] = useState(new Date())
  const [queueData, setQueueData] = useState([])
  const [selectedQueue, setSelectedQueue] = useState(null)
  const [queueDetails, setQueueDetails] = useState(null)
  const contentRef = useRef(null)
  
  // Fetch queue performance data
  useEffect(() => {
    const fetchQueueData = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        // In a real implementation, you would make API calls to Genesys Cloud
        // For this example, we'll use mock data
        
        // IMPORTANT: This is where you would make actual API calls using the Genesys Cloud SDK
        // const analyticsApi = new platformClient.AnalyticsApi()
        // const result = await analyticsApi.getAnalyticsQueuesObservations(...)
        
        // Mock data for demonstration
        const mockQueueData = [
          {
            id: '1',
            name: 'Main Queue',
            callsOffered: 520,
            callsHandled: 495,
            callsAbandoned: 25,
            serviceLevel: 92,
            avgWaitTime: 35,
            avgHandleTime: 240,
            maxWaitTime: 180,
            agentCount: 12
          },
          {
            id: '2',
            name: 'Technical Support',
            callsOffered: 320,
            callsHandled: 305,
            callsAbandoned: 15,
            serviceLevel: 88,
            avgWaitTime: 45,
            avgHandleTime: 320,
            maxWaitTime: 210,
            agentCount: 8
          },
          {
            id: '3',
            name: 'Billing',
            callsOffered: 280,
            callsHandled: 270,
            callsAbandoned: 10,
            serviceLevel: 95,
            avgWaitTime: 25,
            avgHandleTime: 210,
            maxWaitTime: 150,
            agentCount: 6
          },
          {
            id: '4',
            name: 'Sales',
            callsOffered: 350,
            callsHandled: 335,
            callsAbandoned: 15,
            serviceLevel: 90,
            avgWaitTime: 40,
            avgHandleTime: 280,
            maxWaitTime: 190,
            agentCount: 9
          },
          {
            id: '5',
            name: 'Customer Service',
            callsOffered: 420,
            callsHandled: 395,
            callsAbandoned: 25,
            serviceLevel: 85,
            avgWaitTime: 50,
            avgHandleTime: 260,
            maxWaitTime: 220,
            agentCount: 10
          }
        ]
        
        setQueueData(mockQueueData)
        
        // If a queue is selected, fetch its details
        if (selectedQueue) {
          // Mock queue details data
          const mockQueueDetails = {
            dailyStats: {
              dates: Array.from({ length: 30 }, (_, i) => {
                const date = subDays(new Date(), 29 - i)
                return format(date, 'MMM dd')
              }),
              callsOffered: Array.from({ length: 30 }, () => Math.floor(Math.random() * 30 + 10)),
              callsHandled: Array.from({ length: 30 }, () => Math.floor(Math.random() * 25 + 10)),
              callsAbandoned: Array.from({ length: 30 }, () => Math.floor(Math.random() * 5)),
              serviceLevel: Array.from({ length: 30 }, () => Math.floor(Math.random() * 15 + 80)),
            },
            hourlyStats: {
              hours: Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`),
              callVolume: Array.from({ length: 24 }, () => Math.floor(Math.random() * 20)),
              waitTime: Array.from({ length: 24 }, () => Math.floor(Math.random() * 60 + 20)),
            },
            dispositions: {
              labels: ['Resolved', 'Escalated', 'Callback', 'Transferred', 'Other'],
              values: [60, 15, 10, 10, 5],
            },
            agentPerformance: [
              {
                id: 'agent-1',
                name: 'John Smith',
                callsHandled: 85,
                avgHandleTime: 230,
                adherence: 92,
                satisfaction: 4.8
              },
              {
                id: 'agent-2',
                name: 'Maria Garcia',
                callsHandled: 92,
                avgHandleTime: 210,
                adherence: 95,
                satisfaction: 4.9
              },
              {
                id: 'agent-3',
                name: 'Robert Johnson',
                callsHandled: 78,
                avgHandleTime: 250,
                adherence: 90,
                satisfaction: 4.6
              },
              {
                id: 'agent-4',
                name: 'Lisa Chen',
                callsHandled: 88,
                avgHandleTime: 225,
                adherence: 94,
                satisfaction: 4.7
              },
              {
                id: 'agent-5',
                name: 'David Kim',
                callsHandled: 95,
                avgHandleTime: 215,
                adherence: 91,
                satisfaction: 4.8
              }
            ]
          }
          
          setQueueDetails(mockQueueDetails)
        }
      } catch (err) {
        console.error('Error fetching queue data:', err)
        setError('Failed to load queue performance data. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchQueueData()
  }, [startDate, endDate, selectedQueue])
  
  // Handle date range change
  const handleDateChange = (start, end) => {
    setStartDate(start)
    setEndDate(end)
  }
  
  // Handle queue selection
  const handleQueueSelect = (queueId) => {
    setSelectedQueue(queueId)
  }
  
  // Prepare table columns
  const columns = [
    { field: 'name', header: 'Queue Name' },
    { field: 'callsOffered', header: 'Calls Offered' },
    { field: 'callsHandled', header: 'Calls Handled' },
    { field: 'callsAbandoned', header: 'Calls Abandoned' },
    { field: 'serviceLevel', header: 'Service Level (%)', render: (value) => `${value}%` },
    { 
      field: 'avgWaitTime', 
      header: 'Avg Wait Time',
      render: (value) => `${Math.floor(value / 60)}:${(value % 60).toString().padStart(2, '0')}`
    },
    { 
      field: 'id', 
      header: 'Actions',
      sortable: false,
      render: (value) => (
        <button 
          className="btn btn-outline btn-sm"
          onClick={() => handleQueueSelect(value)}
        >
          View Details
        </button>
      )
    }
  ]
  
  // Prepare chart data for queue details
  const dailyCallsData = queueDetails ? {
    labels: queueDetails.dailyStats.dates,
    datasets: [
      {
        label: 'Calls Offered',
        data: queueDetails.dailyStats.callsOffered,
        borderColor: '#e50000',
        backgroundColor: 'rgba(229, 0, 0, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Calls Handled',
        data: queueDetails.dailyStats.callsHandled,
        borderColor: '#333333',
        backgroundColor: 'rgba(51, 51, 51, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Calls Abandoned',
        data: queueDetails.dailyStats.callsAbandoned,
        borderColor: '#ff6666',
        backgroundColor: 'rgba(255, 102, 102, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ]
  } : null
  
  const serviceLevelData = queueDetails ? {
    labels: queueDetails.dailyStats.dates,
    datasets: [
      {
        label: 'Service Level (%)',
        data: queueDetails.dailyStats.serviceLevel,
        borderColor: '#e50000',
        backgroundColor: 'rgba(229, 0, 0, 0.7)',
        type: 'bar'
      }
    ]
  } : null
  
  const hourlyCallsData = queueDetails ? {
    labels: queueDetails.hourlyStats.hours,
    datasets: [
      {
        label: 'Call Volume',
        data: queueDetails.hourlyStats.callVolume,
        borderColor: '#e50000',
        backgroundColor: 'rgba(229, 0, 0, 0.7)',
        type: 'bar'
      },
      {
        label: 'Avg Wait Time (sec)',
        data: queueDetails.hourlyStats.waitTime,
        borderColor: '#333333',
        backgroundColor: 'transparent',
        type: 'line',
        yAxisID: 'y1'
      }
    ]
  } : null
  
  const dispositionsData = queueDetails ? {
    labels: queueDetails.dispositions.labels,
    datasets: [
      {
        data: queueDetails.dispositions.values,
        backgroundColor: [
          '#e50000',
          '#ff3333',
          '#ff6666',
          '#ff9999',
          '#ffcccc',
        ],
        borderColor: '#ffffff',
        borderWidth: 1,
      }
    ]
  } : null
  
  // Prepare agent performance table columns
  const agentColumns = [
    { field: 'name', header: 'Agent Name' },
    { field: 'callsHandled', header: 'Calls Handled' },
    { 
      field: 'avgHandleTime', 
      header: 'Avg Handle Time',
      render: (value) => `${Math.floor(value / 60)}:${(value % 60).toString().padStart(2, '0')}`
    },
    { field: 'adherence', header: 'Adherence (%)', render: (value) => `${value}%` },
    { field: 'satisfaction', header: 'CSAT', render: (value) => value.toFixed(1) }
  ]
  
  if (isLoading && !queueData.length) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading queue performance data...</p>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="error-container">
        <div className="alert alert-danger">{error}</div>
        <button 
          className="btn btn-primary" 
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    )
  }
  
  // Find selected queue details
  const selectedQueueData = queueData.find(queue => queue.id === selectedQueue)
  
  return (
    <div className="queue-performance" ref={contentRef}>
      <div className="report-header">
        <h1 className="report-title">Queue Performance Report</h1>
        <div className="report-actions">
          <DateRangePicker 
            startDate={startDate} 
            endDate={endDate} 
            onChange={handleDateChange} 
          />
          <ReportExporter 
            title="Queue Performance Report" 
            description={`Detailed performance metrics for contact center queues from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}.`}
            contentRef={contentRef}
          />
        </div>
      </div>
      
      <div className="queue-table">
        <DataTable 
          data={queueData} 
          columns={columns} 
          title="Queue Performance Summary"
        />
      </div>
      
      {selectedQueueData && queueDetails && (
        <div className="queue-details">
          <div className="queue-details-header">
            <h2 className="queue-name">{selectedQueueData.name}</h2>
            <button 
              className="btn btn-outline"
              onClick={() => setSelectedQueue(null)}
            >
              Back to Summary
            </button>
          </div>
          
          <div className="queue-metrics">
            <div className="grid grid-4">
              <div className="metric-card">
                <div className="metric-value">{selectedQueueData.callsOffered}</div>
                <div className="metric-label">Calls Offered</div>
              </div>
              
              <div className="metric-card">
                <div className="metric-value">{selectedQueueData.serviceLevel}%</div>
                <div className="metric-label">Service Level</div>
              </div>
              
              <div className="metric-card">
                <div className="metric-value">
                  {Math.floor(selectedQueueData.avgWaitTime / 60)}:{(selectedQueueData.avgWaitTime % 60).toString().padStart(2, '0')}
                </div>
                <div className="metric-label">Avg Wait Time</div>
              </div>
              
              <div className="metric-card">
                <div className="metric-value">{(selectedQueueData.callsAbandoned / selectedQueueData.callsOffered * 100).toFixed(1)}%</div>
                <div className="metric-label">Abandon Rate</div>
              </div>
            </div>
          </div>
          
          <div className="queue-charts">
            <div className="grid grid-2">
              <div className="card">
                <h3 className="card-title">Daily Call Volume</h3>
                <LineChart 
                  data={dailyCallsData} 
                  xAxisLabel="Date" 
                  yAxisLabel="Number of Calls"
                />
              </div>
              
              <div className="card">
                <h3 className="card-title">Daily Service Level</h3>
                <BarChart 
                  data={serviceLevelData} 
                  xAxisLabel="Date" 
                  yAxisLabel="Service Level (%)"
                />
              </div>
            </div>
            
            <div className="grid grid-2">
              <div className="card">
                <h3 className="card-title">Hourly Distribution</h3>
                <BarChart 
                  data={hourlyCallsData} 
                  xAxisLabel="Hour of Day" 
                  yAxisLabel="Call Volume"
                />
              </div>
              
              <div className="card">
                <h3 className="card-title">Call Dispositions</h3>
                <PieChart data={dispositionsData} />
              </div>
            </div>
          </div>
          
          <div className="queue-agents">
            <DataTable 
              data={queueDetails.agentPerformance} 
              columns={agentColumns} 
              title="Agent Performance in Queue"
              pageSize={5}
            />
          </div>
        </div>
      )}
      
      <style jsx>{`
        .report-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--spacing-lg);
        }
        
        .report-title {
          margin: 0;
          font-size: 1.75rem;
          font-weight: 700;
        }
        
        .report-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        
        .queue-table {
          margin-bottom: var(--spacing-lg);
        }
        
        .queue-details {
          margin-top: var(--spacing-xl);
        }
        
        .queue-details-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-lg);
        }
        
        .queue-name {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
        }
        
        .queue-metrics {
          margin-bottom: var(--spacing-lg);
        }
        
        .metric-card {
          background-color: white;
          border-radius: var(--border-radius-md);
          padding: 1.5rem;
          box-shadow: var(--shadow-md);
          text-align: center;
        }
        
        .metric-value {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--md-red);
          margin-bottom: 0.5rem;
        }
        
        .metric-label {
          color: var(--md-medium-gray);
          font-size: 0.9rem;
        }
        
        .queue-charts {
          margin-bottom: var(--spacing-lg);
        }
        
        .card-title {
          margin-top: 0;
          margin-bottom: 1rem;
          font-size: 1.1rem;
          font-weight: 600;
        }
        
        .queue-agents {
          margin-bottom: var(--spacing-lg);
        }
        
        .btn-sm {
          padding: 0.25rem 0.5rem;
          font-size: 0.875rem;
        }
        
        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: 2rem;
        }
        
        @media (max-width: 992px) {
          .report-header {
            flex-direction: column;
            gap: 1rem;
          }
          
          .report-actions {
            width: 100%;
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  )
}

export default QueuePerformance
