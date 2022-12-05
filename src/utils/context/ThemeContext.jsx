import React, { useState, createContext } from 'react'
import { useEffect } from 'react'

export const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('')
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isCallOpen, setIsCallOpen] = useState(false)

  function checkDarkMode() {
    if (localStorage.getItem('mode')) {
      setTheme(localStorage.getItem('mode'))
      return
    }
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      setTheme('dark')
      localStorage.setItem('mode', 'dark')
      return
    } else {
      setTheme('light')
      localStorage.setItem('mode', 'light')
      return
    }
  }

  useEffect(() => {
    checkDarkMode()
  }, [])

  const toggleTheme = () => {
    const mode = theme === 'light' ? 'dark' : 'light'
    setTheme(mode)
    localStorage.setItem('mode', mode)
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        isChatOpen,
        setIsChatOpen,
        isCallOpen,
        setIsCallOpen,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
