import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'
import { useEffect, useState } from 'react'
import { isRunningInGenesysCloud } from './utils/premiumAppIntegration'

function App() {
  const [isPremiumApp, setIsPremiumApp] = useState(false)
  
  useEffect(() => {
    // Check if running as Premium App
    const checkPremiumApp = () => {
      const isPremium = isRunningInGenesysCloud()
      setIsPremiumApp(isPremium)
      
      if (isPremium) {
        console.log('Running as Genesys Cloud Premium App')
        // Apply any Premium App specific styles or configurations
        document.body.classList.add('premium-app')
      }
    }
    
    checkPremiumApp()
  }, [])
  
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Layout isPremiumApp={isPremiumApp}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
