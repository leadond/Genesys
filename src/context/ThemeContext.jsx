import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider = ({ children }) => {
  const [logo, setLogo] = useState('/assets/md-anderson-logo.png')
  const [primaryColor, setPrimaryColor] = useState('#e50000')
  const [organizationName, setOrganizationName] = useState(import.meta.env.VITE_ORGANIZATION_NAME || 'MD Anderson Cancer Center')
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode')
    return savedMode === 'true'
  })

  // Apply dark mode class to body when darkMode changes
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-theme')
    } else {
      document.body.classList.remove('dark-theme')
    }
    localStorage.setItem('darkMode', darkMode)
  }, [darkMode])

  // Apply primary color to CSS variables when it changes
  useEffect(() => {
    updatePrimaryColor(primaryColor)
  }, [primaryColor])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const updateLogo = (newLogo) => {
    setLogo(newLogo)
  }

  const updatePrimaryColor = (newColor) => {
    setPrimaryColor(newColor)
    document.documentElement.style.setProperty('--md-red', newColor)
    
    // Calculate darker and lighter variants
    const darkerColor = adjustColor(newColor, -20)
    const lighterColor = adjustColor(newColor, 20)
    
    document.documentElement.style.setProperty('--md-dark-red', darkerColor)
    document.documentElement.style.setProperty('--md-light-red', lighterColor)
  }

  const updateOrganizationName = (newName) => {
    setOrganizationName(newName)
  }

  // Helper function to adjust color brightness
  const adjustColor = (color, amount) => {
    return '#' + color.replace(/^#/, '').replace(/../g, color => 
      ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2)
    )
  }

  const value = {
    logo,
    primaryColor,
    organizationName,
    darkMode,
    updateLogo,
    updatePrimaryColor,
    updateOrganizationName,
    toggleDarkMode
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
