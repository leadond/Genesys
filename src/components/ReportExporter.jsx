import { useState } from 'react'
import { FaFilePdf, FaFileExcel, FaFileImage, FaCog } from 'react-icons/fa'
import { jsPDF } from 'jspdf'
import { useTheme } from '../context/ThemeContext'

const ReportExporter = ({ 
  title, 
  description, 
  contentRef, 
  includeCharts = true,
  includeData = true,
  orientation = 'portrait'
}) => {
  const { logo, organizationName } = useTheme()
  const [showOptions, setShowOptions] = useState(false)
  const [exportOptions, setExportOptions] = useState({
    includeTitle: true,
    includeLogo: true,
    includeDate: true,
    includeDescription: true,
    includeCharts,
    includeData,
    orientation
  })
  
  const handleOptionChange = (option) => {
    setExportOptions({
      ...exportOptions,
      [option]: !exportOptions[option]
    })
  }
  
  const exportToPdf = async () => {
    const { 
      includeTitle, 
      includeLogo, 
      includeDate, 
      includeDescription,
      orientation
    } = exportOptions
    
    // Create PDF with proper orientation
    const doc = new jsPDF({
      orientation: orientation,
      unit: 'mm',
      format: 'a4'
    })
    
    // Set initial y position
    let yPos = 20
    
    // Add logo
    if (includeLogo && logo) {
      try {
        // Create an image element to get dimensions
        const img = new Image()
        img.src = logo
        
        await new Promise((resolve) => {
          img.onload = resolve
        })
        
        // Calculate scaled dimensions (max width 50mm)
        const maxWidth = 50
        const aspectRatio = img.width / img.height
        const width = Math.min(maxWidth, img.width)
        const height = width / aspectRatio
        
        // Add logo to PDF
        doc.addImage(logo, 'PNG', 20, yPos, width, height)
        yPos += height + 10
      } catch (error) {
        console.error('Error adding logo to PDF:', error)
      }
    }
    
    // Add title
    if (includeTitle && title) {
      doc.setFontSize(18)
      doc.setFont('helvetica', 'bold')
      doc.text(title, 20, yPos)
      yPos += 10
    }
    
    // Add date
    if (includeDate) {
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      const currentDate = new Date().toLocaleDateString()
      doc.text(`Generated on: ${currentDate}`, 20, yPos)
      yPos += 10
    }
    
    // Add organization name
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text(`Organization: ${organizationName}`, 20, yPos)
    yPos += 10
    
    // Add description
    if (includeDescription && description) {
      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')
      
      // Split description into lines to handle wrapping
      const splitDescription = doc.splitTextToSize(description, doc.internal.pageSize.getWidth() - 40)
      doc.text(splitDescription, 20, yPos)
      yPos += splitDescription.length * 7 + 10
    }
    
    // Add content
    if (contentRef && contentRef.current) {
      try {
        // For now, we'll just add a placeholder message
        // In a real implementation, you would use html2canvas or similar to capture the content
        doc.setFontSize(12)
        doc.text('Report content would be captured here in a production environment.', 20, yPos)
      } catch (error) {
        console.error('Error adding content to PDF:', error)
      }
    }
    
    // Save PDF
    doc.save(`${title || 'report'}.pdf`)
  }
  
  const exportToCsv = () => {
    // In a real implementation, you would extract data from charts and tables
    // For now, we'll just create a placeholder CSV
    const headers = ['Date', 'Metric', 'Value']
    const rows = [
      ['2023-01-01', 'Calls Handled', '120'],
      ['2023-01-01', 'Average Handle Time', '240'],
      ['2023-01-01', 'Abandonment Rate', '5%']
    ]
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')
    
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
    <div className="report-exporter">
      <div className="export-buttons">
        <button className="btn btn-outline" onClick={exportToPdf}>
          <FaFilePdf className="btn-icon" />
          Export PDF
        </button>
        <button className="btn btn-outline" onClick={exportToCsv}>
          <FaFileExcel className="btn-icon" />
          Export CSV
        </button>
        <button className="btn btn-outline" onClick={() => setShowOptions(!showOptions)}>
          <FaCog className="btn-icon" />
          Options
        </button>
      </div>
      
      {showOptions && (
        <div className="export-options">
          <h4>Export Options</h4>
          
          <div className="options-grid">
            <label className="option-label">
              <input
                type="checkbox"
                checked={exportOptions.includeTitle}
                onChange={() => handleOptionChange('includeTitle')}
              />
              Include Title
            </label>
            
            <label className="option-label">
              <input
                type="checkbox"
                checked={exportOptions.includeLogo}
                onChange={() => handleOptionChange('includeLogo')}
              />
              Include Logo
            </label>
            
            <label className="option-label">
              <input
                type="checkbox"
                checked={exportOptions.includeDate}
                onChange={() => handleOptionChange('includeDate')}
              />
              Include Date
            </label>
            
            <label className="option-label">
              <input
                type="checkbox"
                checked={exportOptions.includeDescription}
                onChange={() => handleOptionChange('includeDescription')}
              />
              Include Description
            </label>
            
            <label className="option-label">
              <input
                type="checkbox"
                checked={exportOptions.includeCharts}
                onChange={() => handleOptionChange('includeCharts')}
              />
              Include Charts
            </label>
            
            <label className="option-label">
              <input
                type="checkbox"
                checked={exportOptions.includeData}
                onChange={() => handleOptionChange('includeData')}
              />
              Include Data Tables
            </label>
          </div>
          
          <div className="orientation-options">
            <span>Orientation:</span>
            <label className="option-label">
              <input
                type="radio"
                name="orientation"
                value="portrait"
                checked={exportOptions.orientation === 'portrait'}
                onChange={() => setExportOptions({...exportOptions, orientation: 'portrait'})}
              />
              Portrait
            </label>
            <label className="option-label">
              <input
                type="radio"
                name="orientation"
                value="landscape"
                checked={exportOptions.orientation === 'landscape'}
                onChange={() => setExportOptions({...exportOptions, orientation: 'landscape'})}
              />
              Landscape
            </label>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .report-exporter {
          margin-bottom: 1.5rem;
        }
        
        .export-buttons {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        
        .export-options {
          background-color: #f8f9fa;
          border: 1px solid var(--md-light-gray);
          border-radius: var(--border-radius-md);
          padding: 1rem;
          margin-bottom: 1rem;
        }
        
        .export-options h4 {
          margin-top: 0;
          margin-bottom: 1rem;
        }
        
        .options-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
        }
        
        .option-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }
        
        .orientation-options {
          margin-top: 1rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        @media (max-width: 768px) {
          .options-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (max-width: 576px) {
          .options-grid {
            grid-template-columns: 1fr;
          }
          
          .export-buttons {
            flex-direction: column;
          }
          
          .orientation-options {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  )
}

export default ReportExporter
