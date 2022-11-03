import React, { useState, createContext } from 'react'
import { useEffect } from 'react'

export const LanguageContext = createContext()

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('')

  function checkLanguage() {
    if (localStorage.getItem('language')) {
      setLanguage(localStorage.getItem('language'))
      if (localStorage.getItem('language') === 'il') {
        document.getElementsByTagName('html')[0].setAttribute('dir', 'rtl')
      } else {
        document.getElementsByTagName('html')[0].setAttribute('dir', 'ltr')
      }
      return
    }
    if (navigator.language && /^fr\b/.test(navigator.language)) {
      setLanguage('fr')
      localStorage.setItem('language', 'fr')
      return
    }
    if (navigator.language && /^il\b/.test(navigator.language)) {
      setLanguage('il')
      localStorage.setItem('language', 'il')
      document.getElementsByTagName('html')[0].setAttribute('dir', 'rtl')
      return
    } else {
      setLanguage('en')
      localStorage.setItem('language', 'en')
      return
    }
  }

  useEffect(() => {
    checkLanguage()
  }, [])

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}
