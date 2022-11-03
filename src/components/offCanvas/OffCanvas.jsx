import React, { useContext, useEffect, useState } from 'react'
import { useRef } from 'react'
import styled from 'styled-components'
import { LanguageContext } from '../../utils/context/LanguageContext'
import { ThemeContext } from '../../utils/context/ThemeContext'
import OffCanvasContacts from './OffCanvasContacts'
import OffCanvasProfile from './OffCanvasProfile'

const Arrow = styled.span`
  display: flex;
  height: 40px;
  width: 40px;
  align-items: center;
  justify-content: center;
  &:hover {
    background-color: #f0f2f5;
    border-radius: 20px;
  }
`

export default function OffCanvas({ canvasOption }) {
  const offCanvas = useRef()

  function autosizeSideBar() {
    const divSidebar = document.querySelector('._sidebar')
    // console.log('divSidebar', divSidebar)

    if (divSidebar) {
      let widthDivSidebar = divSidebar.offsetWidth
      // console.log('widthDivSidebar', widthDivSidebar)
      offCanvas.current.style.width = `${widthDivSidebar + 1}px`
      offCanvas.current.style.border = `none`
    }
  }
  autosizeSideBar()

  // DARK MODE
  const { theme } = useContext(ThemeContext)
  const bgColor1 = theme === 'light' ? 'bg-white' : 'bg-black'
  const bgColor2 = theme === 'light' ? 'bg-light' : 'bg-dark'

  const [coucou, setCoucou] = useState('')

  useEffect(() => {
    setCoucou(canvasOption)
  }, [canvasOption, coucou, setCoucou])

  // LANGUAGE
  const { language } = useContext(LanguageContext)

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

  const offCanvasDirection =
    language === 'il' ? 'offcanvas-end' : 'offcanvas-start'

  const faArrow = language === 'il' ? 'fa-arrow-right' : 'fa-arrow-left'

  return (
    <>
      <div
        ref={offCanvas}
        className={`offcanvas ${offCanvasDirection}`}
        tabIndex="-1"
        id="offcanvasProfile"
        aria-labelledby="offcanvasExampleLabel"
      >
        <div className={`offcanvas-header ${bgColor1}`}>
          <div className="row align-items-center w-100">
            <div className="col-2">
              <Arrow role={'button'} data-bs-dismiss="offcanvas">
                <i className={`fa-solid ${faArrow} fa-lg offcanvas-button`}></i>
              </Arrow>
            </div>
            <div className="col text-center">
              <h5
                className="offcanvas-title text-primary"
                id="offcanvasExampleLabel"
              >
                {coucou === 'profile'
                  ? _myProfile[language]
                  : _contacts[language]}
              </h5>
            </div>
          </div>
        </div>
        <div className={`offcanvas-body ${bgColor2}`}>
          {coucou === 'profile' ? <OffCanvasProfile /> : <OffCanvasContacts />}
        </div>
      </div>
    </>
  )
}
