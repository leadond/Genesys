import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { FaBug, FaChevronDown, FaChevronUp, FaClipboard, FaCheck } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import platformClient from 'purecloud-platform-client-v2'

const DebuggerContainer = styled.div`
  background-color: #1e1e1e;
  color: #e0e0e0;
  border-radius: 8px;
  margin: 20px 0;
  font-family: monospace;
  overflow: hidden;
`

const DebuggerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #333;
  cursor: pointer;
  
  .title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: bold;
  }
  
  .icon {
    color: #ff5757;
  }
`

const DebuggerContent = styled.div`
  padding: 16px;
  max-height: ${props => props.$isOpen ? '500px' : '0'};
  overflow-y: auto;
  transition: max-height 0.3s ease-in-out;
`

const DebugSection = styled.div`
  margin-bottom: 16px;
  
  h3 {
    color: #7cb7ff;
    margin-bottom: 8px;
    border-bottom: 1px solid #444;
    padding-bottom: 4px;
  }
  
  pre {
    background-color: #2a2a2a;
    padding: 8px;
    border-radius: 4px;
    overflow-x: auto;
    white-space: pre-wrap;
    word-break: break-word;
  }
`

const CopyButton = styled.button`
  background-color: #444;
  color: #e0e0e0;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  
  &:hover {
    background-color: #555;
  }
`

const PremiumAppDebugger = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [debugInfo, setDebugInfo] = useState({
    environment: null,
    isInIframe: false,
    clientInfo: null,
    authData: null,
    apiInstance: null,
    errors: []
  })
  
  const { isAuthenticated, isPremiumApp, error, detailedError } = useAuth()
  
  useEffect(() => {
    const gatherDebugInfo = () => {
      try {
        const client = platformClient.ApiClient.instance
        
        const info = {
          environment: client.environment || 'Not set',
          isInIframe: window.location !== window.parent.location,
          clientInfo: {
            version: platformClient.ApiClient.version,
            config: { ...client.config }
          },
          authData: client.authData ? {
            hasAccessToken: !!client.authData.accessToken,
            tokenExpiryTime: client.authData.tokenExpiryTime,
            state: client.authData.state
          } : null,
          apiInstance: {
            basePath: client.basePath,
            authentications: Object.keys(client.authentications || {})
          },
          errors: []
        }
        
        // Add any errors
        if (error) {
          info.errors.push({ type: 'Auth Error', message: error })
        }
        
        if (detailedError) {
          info.errors.push({ type: 'Detailed Error', message: detailedError })
        }
        
        setDebugInfo(info)
      } catch (err) {
        console.error('Error gathering debug info:', err)
        setDebugInfo(prev => ({
          ...prev,
          errors: [...prev.errors, { type: 'Debug Error', message: err.message }]
        }))
      }
    }
    
    gatherDebugInfo()
  }, [error, detailedError])
  
  const copyToClipboard = () => {
    const debugText = JSON.stringify(debugInfo, null, 2)
    navigator.clipboard.writeText(debugText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  
  return (
    <DebuggerContainer>
      <DebuggerHeader onClick={() => setIsOpen(!isOpen)}>
        <div className="title">
          <FaBug className="icon" />
          Premium App Debugger
        </div>
        <div>
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </div>
      </DebuggerHeader>
      
      {isOpen && (
        <DebuggerContent $isOpen={isOpen}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
            <CopyButton onClick={copyToClipboard}>
              {copied ? <><FaCheck /> Copied</> : <><FaClipboard /> Copy Debug Info</>}
            </CopyButton>
          </div>
          
          <DebugSection>
            <h3>Environment</h3>
            <pre>
              Running as Premium App: {isPremiumApp ? 'Yes' : 'No'}<br />
              Inside iframe: {debugInfo.isInIframe ? 'Yes' : 'No'}<br />
              Authenticated: {isAuthenticated ? 'Yes' : 'No'}<br />
              Genesys Environment: {debugInfo.environment}
            </pre>
          </DebugSection>
          
          <DebugSection>
            <h3>Client Info</h3>
            <pre>{JSON.stringify(debugInfo.clientInfo, null, 2)}</pre>
          </DebugSection>
          
          <DebugSection>
            <h3>Auth Data</h3>
            <pre>{JSON.stringify(debugInfo.authData, null, 2)}</pre>
          </DebugSection>
          
          <DebugSection>
            <h3>API Instance</h3>
            <pre>{JSON.stringify(debugInfo.apiInstance, null, 2)}</pre>
          </DebugSection>
          
          {debugInfo.errors.length > 0 && (
            <DebugSection>
              <h3>Errors</h3>
              {debugInfo.errors.map((err, index) => (
                <div key={index} style={{ marginBottom: '10px' }}>
                  <div style={{ color: '#ff5757' }}>{err.type}:</div>
                  <pre>{err.message}</pre>
                </div>
              ))}
            </DebugSection>
          )}
        </DebuggerContent>
      )}
    </DebuggerContainer>
  )
}

export default PremiumAppDebugger
