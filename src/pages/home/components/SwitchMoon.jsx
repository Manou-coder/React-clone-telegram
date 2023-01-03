import React, { useContext, useEffect, useRef } from 'react'
import { LanguageContext } from '../../../utils/context/LanguageContext'
import { ThemeContext } from '../../../utils/context/ThemeContext'

export default function SwitchMoon() {
  const { toggleTheme, theme } = useContext(ThemeContext)
  const { language } = useContext(LanguageContext)
  const inputDarkMode = useRef()
  useEffect(() => {
    darkMode()
  }, [theme])

  function darkMode(params) {
    // console.log('theme ================', theme)
    if (inputDarkMode.current) {
      if (theme === 'dark') {
        inputDarkMode.current.checked = 'true'
      }
    }
  }

  const themeToggleHe = language === 'il' ? 'theme__toggle_he' : ''
  return (
    <label htmlFor="theme" className="theme" onClick={() => toggleTheme()}>
      {/* <span>Light</span> */}
      <span className="theme__toggle-wrap">
        <input
          type="checkbox"
          className={'theme__toggle ' + themeToggleHe}
          id="theme"
          role="switch"
          name="theme"
          value="dark"
          ref={inputDarkMode}
        />
        <span className="theme__fill"></span>
        <span className="theme__icon">
          <span className="theme__icon-part"></span>
          <span className="theme__icon-part"></span>
          <span className="theme__icon-part"></span>
          <span className="theme__icon-part"></span>
          <span className="theme__icon-part"></span>
          <span className="theme__icon-part"></span>
          <span className="theme__icon-part"></span>
          <span className="theme__icon-part"></span>
          <span className="theme__icon-part"></span>
        </span>
      </span>
      {/* <span>Dark</span> */}
    </label>
  )
}
