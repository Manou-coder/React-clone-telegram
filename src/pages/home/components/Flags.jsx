import React, { useContext, useState } from 'react'
import { LanguageContext } from '../../../utils/context/LanguageContext'
import EnglandFlag from '../../../assets/img/united-kingdom.png'
import FranceFlag from '../../../assets/img/france.png'
import IsraelFlag from '../../../assets/img/israel.png'
import useComponentVisible from '../../../utils/functions/useHandleClickOutside'
import { ThemeContext } from '../../../utils/context/ThemeContext'

export default function Flags() {
  const { setLanguage, language } = useContext(LanguageContext)
  const { theme } = useContext(ThemeContext)

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

  // Detect click outside React component

  const { refComponent, refButton, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false)

  const handleClickRefButton = () => {
    isComponentVisible
      ? setIsComponentVisible(false)
      : setIsComponentVisible(true)
  }

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div
        className="position-relative"
        style={{ padding: '0px' }}
        onClick={() => handleClickRefButton()}
      >
        <img
          style={{ cursor: 'pointer' }}
          src={objFlag[language]}
          alt={objFlag[language]}
          height={'30px'}
        />
        <div ref={refComponent}>
          {isComponentVisible && (
            <ul
              className="d-flex flex-column justify-content-center align-items-center"
              style={{
                listStyleType: 'none',
                padding: '4px 4px 4px 4px',
                backgroundColor: theme === 'light' ? 'white' : 'black',
                borderRadius: '5px',
                position: 'absolute',
                top: '-7px',
                right: '-7px',
                zIndex: '1000',
                gap: '5px',
              }}
            >
              <li onClick={() => setLanguage2('en')}>
                <div className="flag-icon" style={{ cursor: 'pointer' }}>
                  <img
                    src={EnglandFlag}
                    alt="EnglandFlag"
                    height={'30px'}
                    name="en"
                  />
                </div>
              </li>
              <li onClick={() => setLanguage2('fr')}>
                <div className="flag-icon" style={{ cursor: 'pointer' }}>
                  <img
                    src={FranceFlag}
                    alt="FranceFlag"
                    height={'30px'}
                    name="fr"
                  />
                </div>
              </li>
              <li onClick={() => setLanguage2('il')}>
                <div className="flag-icon" style={{ cursor: 'pointer' }}>
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
  )
}
