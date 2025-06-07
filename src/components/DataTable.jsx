import { useState } from 'react'
import { FaSort, FaSortUp, FaSortDown, FaSearch, FaFilePdf, FaFileExcel } from 'react-icons/fa'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

const DataTable = ({ 
  data, 
  columns, 
  title, 
  pagination = true, 
  search = true,
  exportOptions = true,
  pageSize = 10
}) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState(null)
  const [sortDirection, setSortDirection] = useState('asc')
  const [searchTerm, setSearchTerm] = useState('')
  const [rowsPerPage, setRowsPerPage] = useState(pageSize)
  
  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }
  
  // Filter data based on search term
  const filteredData = data.filter(item => {
    if (!searchTerm) return true
    
    return columns.some(column => {
      const value = item[column.field]
      if (value === null || value === undefined) return false
      return String(value).toLowerCase().includes(searchTerm.toLowerCase())
    })
  })
  
  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0
    
    const aValue = a[sortField]
    const bValue = b[sortField]
    
    if (aValue === bValue) return 0
    
    const comparison = aValue > bValue ? 1 : -1
    return sortDirection === 'asc' ? comparison : -comparison
  })
  
  // Paginate data
  const totalPages = Math.ceil(sortedData.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const paginatedData = sortedData.slice(startIndex, startIndex + rowsPerPage)
  
  // Export to PDF
  const exportToPdf = () => {
    const doc = new jsPDF()
    
    // Add title
    if (title) {
      doc.setFontSize(18)
      doc.text(title, 14, 22)
      doc.setFontSize(12)
    }
    
    // Prepare table data
    const tableColumn = columns.map(col => col.header)
    const tableRows = sortedData.map(item => 
      columns.map(col => {
        const value = item[col.field]
        return value !== undefined && value !== null ? String(value) : ''
      })
    )
    
    // Add table
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: title ? 30 : 14,
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [229, 0, 0],
        textColor: 255,
        fontStyle: 'bold',
      },
    })
    
    // Save PDF
    doc.save(`${title || 'report'}.pdf`)
  }
  
  // Export to CSV
  const exportToCsv = () => {
    // Prepare CSV content
    const headers = columns.map(col => col.header).join(',')
    const rows = sortedData.map(item => 
      columns.map(col => {
        const value = item[col.field]
        // Wrap values with commas in quotes
        return value !== undefined && value !== null 
          ? String(value).includes(',') ? `"${value}"` : value 
          : ''
      }).join(',')
    ).join('\n')
    
    const csvContent = `${headers}\n${rows}`
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `${title || 'report'}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
  return (
    <div className="data-table-container">
      <div className="table-header">
        {title && <h3 className="table-title">{title}</h3>}
        
        <div className="table-actions">
          {search && (
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1) // Reset to first page on search
                }}
                className="search-input"
              />
            </div>
          )}
          
          {exportOptions && (
            <div className="export-buttons">
              <button className="btn btn-outline" onClick={exportToPdf}>
                <FaFilePdf className="btn-icon" />
                PDF
              </button>
              <button className="btn btn-outline" onClick={exportToCsv}>
                <FaFileExcel className="btn-icon" />
                CSV
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th 
                  key={column.field}
                  onClick={() => column.sortable !== false && handleSort(column.field)}
                  className={column.sortable !== false ? 'sortable' : ''}
                >
                  {column.header}
                  {column.sortable !== false && (
                    <span className="sort-icon">
                      {sortField !== column.field && <FaSort />}
                      {sortField === column.field && sortDirection === 'asc' && <FaSortUp />}
                      {sortField === column.field && sortDirection === 'desc' && <FaSortDown />}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((column) => (
                    <td key={column.field}>
                      {column.render ? column.render(row[column.field], row) : row[column.field]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="no-data">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {pagination && totalPages > 1 && (
        <div className="pagination">
          <div className="pagination-info">
            Showing {startIndex + 1} to {Math.min(startIndex + rowsPerPage, sortedData.length)} of {sortedData.length} entries
          </div>
          
          <div className="pagination-controls">
            <button
              className="pagination-button"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              First
            </button>
            <button
              className="pagination-button"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            
            <div className="pagination-pages">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum
                
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }
                
                return (
                  <button
                    key={pageNum}
                    className={`pagination-button ${currentPage === pageNum ? 'active' : ''}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>
            
            <button
              className="pagination-button"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
            <button
              className="pagination-button"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              Last
            </button>
          </div>
          
          <div className="rows-per-page">
            <span>Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value))
                setCurrentPage(1) // Reset to first page when changing page size
              }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .data-table-container {
          background-color: white;
          border-radius: var(--border-radius-md);
          box-shadow: var(--shadow-md);
          overflow: hidden;
        }
        
        .table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--md-light-gray);
        }
        
        .table-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0;
        }
        
        .table-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        
        .search-container {
          position: relative;
        }
        
        .search-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--md-medium-gray);
        }
        
        .search-input {
          padding: 0.5rem 0.75rem 0.5rem 2.25rem;
          border: 1px solid var(--md-light-gray);
          border-radius: var(--border-radius-sm);
          width: 250px;
        }
        
        .export-buttons {
          display: flex;
          gap: 0.5rem;
        }
        
        .table-wrapper {
          overflow-x: auto;
        }
        
        .data-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .data-table th, .data-table td {
          padding: 0.75rem 1rem;
          text-align: left;
          border-bottom: 1px solid var(--md-light-gray);
        }
        
        .data-table th {
          background-color: #f8f9fa;
          font-weight: 600;
          white-space: nowrap;
        }
        
        .data-table th.sortable {
          cursor: pointer;
        }
        
        .data-table th.sortable:hover {
          background-color: #f0f0f0;
        }
        
        .sort-icon {
          margin-left: 0.5rem;
          display: inline-block;
          vertical-align: middle;
        }
        
        .data-table tbody tr:hover {
          background-color: #f8f9fa;
        }
        
        .no-data {
          text-align: center;
          padding: 2rem !important;
          color: var(--md-medium-gray);
        }
        
        .pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border-top: 1px solid var(--md-light-gray);
        }
        
        .pagination-info {
          color: var(--md-medium-gray);
          font-size: 0.9rem;
        }
        
        .pagination-controls {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        
        .pagination-pages {
          display: flex;
          gap: 0.25rem;
        }
        
        .pagination-button {
          padding: 0.25rem 0.5rem;
          border: 1px solid var(--md-light-gray);
          background-color: white;
          border-radius: var(--border-radius-sm);
          cursor: pointer;
          min-width: 2rem;
          text-align: center;
        }
        
        .pagination-button:hover:not(:disabled) {
          background-color: #f0f0f0;
        }
        
        .pagination-button.active {
          background-color: var(--md-red);
          color: white;
          border-color: var(--md-red);
        }
        
        .pagination-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .rows-per-page {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--md-medium-gray);
          font-size: 0.9rem;
        }
        
        .rows-per-page select {
          padding: 0.25rem 0.5rem;
          border: 1px solid var(--md-light-gray);
          border-radius: var(--border-radius-sm);
        }
        
        @media (max-width: 992px) {
          .table-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          
          .search-input {
            width: 100%;
          }
          
          .pagination {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  )
}

export default DataTable
