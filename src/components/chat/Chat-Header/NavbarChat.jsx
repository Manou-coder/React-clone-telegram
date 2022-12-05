import { useEffect, useState } from 'react'
import { useContext } from 'react'
import { LanguageContext } from '../../../utils/context/LanguageContext'
import { SocketContactContext } from '../../../utils/context/SocketContact'
import { ThemeContext } from '../../../utils/context/ThemeContext'
import ContactMenu from './ContactMenu'
import useComponentVisible from '../../../utils/functions/useHandleClickOutside'
import Avatar from '../../../assets/img/avatar4.png'
import { imgError } from '../../../utils/functions/returnAvatarIsImgError'

export default function NavbarChat({ setIconBarIsActive, iconBarIsActive }) {
  const { actuallyContactId, allUsers } = useContext(SocketContactContext)

  const { setIsChatOpen, setIsCallOpen } = useContext(ThemeContext)

  const contact =
    allUsers && allUsers.find((e) => e.userId === actuallyContactId)

  function showSidebar() {
    setIsChatOpen(false)
  }

  // DARK MODE
  const { theme } = useContext(ThemeContext)
  const bgColor = theme === 'light' ? 'bg-light' : 'bg-dark'

  const colorName = theme === 'light' ? '' : 'text-white'
  const colorInfo = theme === 'light' ? '' : 'text-white-50'

  const iconColor = theme === 'light' ? 'black' : '#909294'
  const iconBars = theme === 'light' ? 'icon-bars-light' : ' icon-bars-dark'

  // console.log('socketContact', socketContact)

  const connectionStatus = () => {
    // console.log('type of', typeof contact.isConnect)
    if (contact && typeof contact.isConnect === 'number') {
      const date = new Date(contact.isConnect)
      const hoursAndMinutes = date.getHours() + ':' + addZero(date.getMinutes())
      // console.log(hoursAndMinutes) // 👉️ 8:33
      // new Date().toLocaleTimeString()
      return _lastSeen[language] + ' ' + hoursAndMinutes
    }
    if (contact && contact.isConnect) {
      return _online[language]
    } else {
      return _offline[language]
    }
  }

  function addZero(number) {
    if (number < 10) {
      return '0' + number
    } else {
      return number
    }
  }

  // LANGUAGE
  const { language } = useContext(LanguageContext)

  const _isTyping = {
    en: 'Is typing...',
    fr: "En train d'écrire...",
    il: 'כותב/ת',
  }

  const _lastSeen = {
    en: 'Last seen at',
    fr: 'Dernière vu à',
    il: 'נראה לאחרונה ב',
  }

  const _online = {
    en: 'Online',
    fr: 'En ligne',
    il: 'מחובר/ת',
  }

  const _offline = {
    en: 'Offline',
    fr: 'Hors ligne',
    il: 'לא מקוון',
  }

  const arrowHover =
    theme === 'light' ? 'arrow-hover-light' : 'arrow-hover-dark'

  // Detect click outside React component

  const { refComponent, refButton, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false)

  const handleClickRefButton = () => {
    isComponentVisible
      ? setIsComponentVisible(false)
      : setIsComponentVisible(true)
  }

  useEffect(() => {
    if (refButton.current && isComponentVisible) {
      if (theme === 'light') {
        refButton.current.style.backgroundColor = '#f0f2f5'
      } else {
        refButton.current.style.backgroundColor = 'rgb(43, 43, 43, 1)'
      }
    } else {
      refButton.current.style.backgroundColor = ''
    }
  }, [isComponentVisible])

  // function imgError(target) {
  //   // console.log('onerror', target.onerror)
  //   if (target.onerror === null) {
  //     target.src = Avatar
  //   }
  // }

  return (
    <div
      className={`row w-100 sticky-top ${bgColor} align-items-center m-0 mb-1`}
      style={{ minHeight: '58px' }}
    >
      <div
        className="col-2 h-100 d-lg-none d-flex align-items-center justify-content-center p-0"
        onClick={showSidebar}
      >
        <span className={`arrow ${arrowHover}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            style={{ fill: iconColor }}
            height="1.25em"
          >
            {language === 'il' ? (
              <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
            ) : (
              <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
            )}
          </svg>
        </span>
      </div>
      <div className="col-2 col-lg-1 py-1">
        <img
          style={{ height: '50px', width: '50px' }}
          src={contact && contact.photoURL}
          onError={(e) => imgError(e.target)}
          className="rounded-circle"
          alt="..."
        ></img>
      </div>
      <div className="col">
        <div>
          <h3 className={`mb-0 fs-5 lh-1 ${colorName}`}>
            {/* {socketContact.displayName} */}
            {contact && contact.displayName}
          </h3>
        </div>
        <div>
          <p className={`mb-0 fw-light pt-0 lh-1 ${colorInfo}`}>
            {contact && contact.isTyping
              ? _isTyping[language]
              : connectionStatus()}
          </p>
        </div>
      </div>
      <div className="d-none d-lg-flex col-lg-1">
        <span
          onClick={() => setIsCallOpen(true)}
          className={`icon-bars ${iconBars} d-flex justify-content-center align-items-center`}
        >
          {/* <i className="fa-solid fa-phone fa-lg"></i> */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            style={{ fill: iconColor }}
            height="1.25em"
          >
            <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" />
          </svg>
        </span>
      </div>
      <div className="d-none d-lg-flex col-lg-1">
        <span
          className={`icon-bars ${iconBars} d-flex justify-content-center align-items-center`}
        >
          {/* <i className="fa-solid fa-magnifying-glass fa-lg"></i> */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            style={{
              fill: iconColor,
            }}
            height="1.25em"
          >
            <path d="M500.3 443.7l-119.7-119.7c27.22-40.41 40.65-90.9 33.46-144.7C401.8 87.79 326.8 13.32 235.2 1.723C99.01-15.51-15.51 99.01 1.724 235.2c11.6 91.64 86.08 166.7 177.6 178.9c53.8 7.189 104.3-6.236 144.7-33.46l119.7 119.7c15.62 15.62 40.95 15.62 56.57 0C515.9 484.7 515.9 459.3 500.3 443.7zM79.1 208c0-70.58 57.42-128 128-128s128 57.42 128 128c0 70.58-57.42 128-128 128S79.1 278.6 79.1 208z" />
          </svg>
        </span>
      </div>
      <div
        className="col-2 col-lg-1 d-flex justify-content-center align-items-center position-relative"
        onClick={() => handleClickRefButton()}
      >
        <span className={`arrow ${arrowHover}`} ref={refButton}>
          {/* <i className="fa-solid fa-ellipsis fa-lg"></i> */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 128 512"
            style={{
              fill: iconColor,
            }}
            height="1.25em"
          >
            <path d="M64 360c30.9 0 56 25.1 56 56s-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56zm0-160c30.9 0 56 25.1 56 56s-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56zM120 96c0 30.9-25.1 56-56 56S8 126.9 8 96S33.1 40 64 40s56 25.1 56 56z" />
          </svg>
        </span>
        <div ref={refComponent}>{isComponentVisible && <ContactMenu />}</div>
      </div>
    </div>
  )
}
