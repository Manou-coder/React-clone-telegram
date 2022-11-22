import React, { useRef, useContext } from 'react'
import styled from 'styled-components'
import './SettingsMenu.css'
import { UserAuth } from '../../../../utils/context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { ThemeContext } from '../../../../utils/context/ThemeContext'
import { useEffect } from 'react'
import { useState } from 'react'
import EnglandFlag from '../../../../assets/img/united-kingdom.png'
import FranceFlag from '../../../../assets/img/france.png'
import IsraelFlag from '../../../../assets/img/israel.png'
import { LanguageContext } from '../../../../utils/context/LanguageContext'

const DivMenu = styled.div`
  position: absolute;
  z-index: 1021;
  background-color: rgb(255, 255, 255, 0.9);
  top: 48px;
  left: 42px;
  width: 300px;
`
const UlMenu = styled.ul`
  list-style-type: none;
  padding: 10px;
  margin-bottom: 0;
`

export default function SettingsMenu({ canvasOption, setCanvasOption }) {
  // console.log('setCanvasOption', setCanvasOption)
  // console.log('canvasOption', canvasOption)

  // const navigate = useNavigate()
  const { logOut } = UserAuth()
  async function handleLogOut() {
    await logOut()
    // navigate('../')
  }

  const inputDarkMode = useRef()

  const { toggleTheme, theme } = useContext(ThemeContext)

  const { setLanguage, language } = useContext(LanguageContext)

  const [inputValue, setInputValue] = useState('')
  const previousInputValue = useRef('')

  useEffect(() => {
    previousInputValue.current = inputValue
  }, [inputValue])

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

  function handleClickDarkMode(e) {
    e.preventDefault()
    toggleTheme()
    if (theme === 'light') {
      inputDarkMode.current.checked = true
    } else {
      inputDarkMode.current.checked = false
    }
  }

  const bgColor =
    theme === 'light' ? 'rgb(255, 255, 255, 0.9)' : 'rgb(33, 37, 41, 0.9)'

  const textColor = theme === 'light' ? 'black' : 'white'

  const listItemMenuBgColor =
    theme === 'light' ? 'list-item-menu' : 'list-item-menu-black'

  const [showIconsList, setShowIconsList] = useState(false)

  const toggleIconsList = () => {
    if (!showIconsList) {
      setShowIconsList(true)
    } else {
      setShowIconsList(false)
    }
  }

  const paddingIcon = !showIconsList ? '5px 0px' : '8px 0px'

  const objFlag = {
    fr: FranceFlag,
    en: EnglandFlag,
    il: IsraelFlag,
  }

  function setLanguage2(language) {
    localStorage.setItem('language', language)
    setLanguage(language)
    if (language === 'il') {
      document.getElementsByTagName('html')[0].setAttribute('dir', 'rtl')
    } else {
      document.getElementsByTagName('html')[0].setAttribute('dir', 'ltr')
    }
  }

  const _myProfile = {
    en: 'My Profile',
    fr: 'Mon Profil',
    il: 'הפרופיל שלי',
  }

  const _contacts = {
    en: 'Contacts',
    fr: 'Contacts',
    il: 'אנשי קשר',
  }

  const _language = {
    en: 'Language',
    fr: 'Langue',
    il: 'שפה',
  }

  const _darkMode = {
    en: 'Dark Mode',
    fr: 'Mode Nuit',
    il: 'מצב לילה',
  }

  const _logOut = {
    en: 'Log Out',
    fr: 'Se déconnecter',
    il: 'להתנתק',
  }

  return (
    <DivMenu
      className={`rounded shadow settings-menu`}
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
    >
      <UlMenu>
        <li className="mx-2" onClick={() => setCanvasOption('profile')}>
          <div
            className={`row ${listItemMenuBgColor} py-2`}
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasProfile"
          >
            <div className="col-1">
              <i className="fa-solid fa-user"></i>
            </div>
            <div className="col ps-4">
              <span>{_myProfile[language]}</span>
            </div>
          </div>
        </li>
        <li className="mx-2" onClick={() => setCanvasOption('contacts')}>
          <div
            className={`row ${listItemMenuBgColor} py-2`}
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasProfile"
          >
            <div className="col-1">
              <i className="fa-solid fa-address-book"></i>
            </div>
            <div className="col ps-4">
              <span>{_contacts[language]}</span>
            </div>
          </div>
        </li>
        <li className="mx-2" onClick={() => toggleIconsList()}>
          <div
            className={`row ${listItemMenuBgColor} d-flex align-items-center`}
            style={{ padding: paddingIcon }}
          >
            <div className="col-1">
              <i className="fa-solid fa-globe"></i>
            </div>
            <div className="col ps-4">
              <span>{_language[language]}</span>
            </div>
            <div className="col-4">
              <div className="d-flex justify-content-start align-items-center ">
                {!showIconsList ? (
                  <div className="flag-icon2" style={{ padding: '0px' }}>
                    <img
                      src={objFlag[language]}
                      alt={objFlag[language]}
                      height={'30px'}
                    />
                  </div>
                ) : (
                  <ul
                    className="d-flex flex-column justify-content-center align-items-center"
                    style={{
                      listStyleType: 'none',
                      padding: '4px 4px 4px 4px',
                      backgroundColor: 'white',
                      borderRadius: '5px',
                      position: 'absolute',
                      top: '48px',
                      zIndex: '1000',
                      gap: '5px',
                    }}
                  >
                    <li onClick={() => setLanguage2('en')}>
                      <div className="flag-icon">
                        <img
                          src={EnglandFlag}
                          alt="EnglandFlag"
                          height={'30px'}
                          name="en"
                        />
                      </div>
                    </li>
                    <li onClick={() => setLanguage2('fr')}>
                      <div className="flag-icon">
                        <img
                          src={FranceFlag}
                          alt="FranceFlag"
                          height={'30px'}
                          name="fr"
                        />
                      </div>
                    </li>
                    <li onClick={() => setLanguage2('il')}>
                      <div className="flag-icon">
                        <img
                          src={IsraelFlag}
                          alt="IsraelFlag"
                          height={'30px'}
                          name="il"
                        />
                      </div>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </li>
        <li className="mx-2" onClick={(e) => handleClickDarkMode(e)}>
          {/* <li className="mx-2" onClick={(e) => toggleTheme()}> */}
          <div className={`row ${listItemMenuBgColor} py-2`}>
            <div className="col-1">
              <i className="fa-solid fa-moon"></i>
            </div>
            <div className="col ps-4">
              <span>{_darkMode[language]}</span>
            </div>
            <div className="col-4">
              <label className="switch">
                <input ref={inputDarkMode} type="checkbox" />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </li>
        <li className="mx-2" onClick={handleLogOut}>
          <div className={`row ${listItemMenuBgColor} py-2`}>
            <div className="col-1">
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
            </div>
            <div className="col ps-4">
              <span>{_logOut[language]}</span>
            </div>
          </div>
        </li>
      </UlMenu>
    </DivMenu>
  )
}
