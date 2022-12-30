import React, { useState, createContext } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  const location = useLocation()
  const messageBarRef = useRef()
  const messageBodyRef = useRef()
  const [theme, setTheme] = useState('')
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isCallOpen, setIsCallOpen] = useState(false)
  const [isToastOpen, setIsToastOpen] = useState(false)
  const [modalName, setModalName] = useState(null)

  useEffect(() => {
    // console.log(location)
    if (location.pathname === '/chat/') {
      setIsChatOpen(false)
    }
  }, [location])

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
        isToastOpen,
        setIsToastOpen,
        modalName,
        setModalName,
        messageBarRef,
        messageBodyRef,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
