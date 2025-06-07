import { FaArrowUp, FaArrowDown } from 'react-icons/fa'

const StatCard = ({ title, value, icon, change, changeType, footer }) => {
  const isPositive = changeType === 'positive'
  const isNegative = changeType === 'negative'
  
  return (
    <div className="stat-card">
      <div className="stat-header">
        <div className="stat-title">{title}</div>
        {icon && <div className="stat-icon">{icon}</div>}
      </div>
      
      <div className="stat-value">{value}</div>
      
      {change && (
        <div className={`stat-change ${isPositive ? 'positive' : ''} ${isNegative ? 'negative' : ''}`}>
          {isPositive && <FaArrowUp />}
          {isNegative && <FaArrowDown />}
          <span>{change}</span>
        </div>
      )}
      
      {footer && <div className="stat-footer">{footer}</div>}
      
      <style jsx>{`
        .stat-card {
          background-color: white;
          border-radius: var(--border-radius-md);
          padding: 1.5rem;
          box-shadow: var(--shadow-md);
          height: 100%;
        }
        
        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        
        .stat-title {
          color: var(--md-medium-gray);
          font-size: 0.9rem;
          font-weight: 500;
        }
        
        .stat-icon {
          color: var(--md-red);
          font-size: 1.25rem;
        }
        
        .stat-value {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        
        .stat-change {
          display: flex;
          align-items: center;
          font-size: 0.85rem;
          margin-bottom: 1rem;
        }
        
        .stat-change.positive {
          color: var(--success);
        }
        
        .stat-change.negative {
          color: var(--danger);
        }
        
        .stat-change svg {
          margin-right: 0.25rem;
        }
        
        .stat-footer {
          color: var(--md-medium-gray);
          font-size: 0.8rem;
          border-top: 1px solid var(--md-light-gray);
          padding-top: 0.75rem;
        }
      `}</style>
    </div>
  )
}

export default StatCard
