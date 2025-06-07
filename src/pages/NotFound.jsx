import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const NotFound = () => {
  const { logo } = useTheme()
  
  return (
    <div className="not-found">
      <div className="not-found-content">
        <img src={logo} alt="MD Anderson Logo" className="not-found-logo" />
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Page Not Found</h2>
        <p className="not-found-message">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary">
          Return to Dashboard
        </Link>
      </div>
      
      <style jsx>{`
        .not-found {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: #f8f9fa;
          padding: 1rem;
        }
        
        .not-found-content {
          text-align: center;
          max-width: 500px;
        }
        
        .not-found-logo {
          max-width: 200px;
          margin-bottom: 2rem;
        }
        
        .not-found-title {
          font-size: 6rem;
          font-weight: 700;
          color: var(--md-red);
          margin: 0;
          line-height: 1;
        }
        
        .not-found-subtitle {
          font-size: 1.5rem;
          margin-top: 0;
          margin-bottom: 1rem;
        }
        
        .not-found-message {
          color: var(--md-medium-gray);
          margin-bottom: 2rem;
        }
      `}</style>
    </div>
  )
}

export default NotFound
