import { useState } from 'react'
import { useContext } from 'react'
import { useParams } from 'react-router-dom'
import { LanguageContext } from '../../../utils/context/LanguageContext'
import { SocketContactContext } from '../../../utils/context/SocketContact'
import { ThemeContext } from '../../../utils/context/ThemeContext'
import socket from '../../../utils/socket.io'
import styled from 'styled-components'

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

export default function NavbarChat() {
  const { socketContact, setSocketContact, allUsers } =
    useContext(SocketContactContext)

  function showSidebar() {
    let chat = document.querySelector('._chat')
    let sidebar = document.querySelector('._sidebar')
    chat.className = 'd-none'
    sidebar.className = 'd-flex flex-column _sidebar'
    sidebar.style.padding = '0px'
  }

  // DARK MODE
  const { theme } = useContext(ThemeContext)
  const bgColor = theme === 'light' ? 'bg-light' : 'bg-dark'

  const colorName = theme === 'light' ? '' : 'text-white'
  const colorInfo = theme === 'light' ? '' : 'text-white-50'

  const iconColor = theme === 'light' ? 'black' : '#909294'
  const iconBars = theme === 'light' ? 'icon-bars-light' : ' icon-bars-dark'

  // console.log('socketContact', socketContact)

  const [isTyping, setIsTyping] = useState(false)

  socket.on('typingResponse', (data) => {
    console.log('typing', data)
    if (socketContact.userId === data) {
      setIsTyping(true)
    }
    setTimeout(() => setIsTyping(false), 1000)
  })

  const connectionStatus = () => {
    console.log('type of', typeof socketContact.isConnect)
    if (typeof socketContact.isConnect === 'number') {
      const date = new Date(socketContact.isConnect)
      const hoursAndMinutes = date.getHours() + ':' + date.getMinutes()
      console.log(hoursAndMinutes) // 👉️ 8:33
      // new Date().toLocaleTimeString()
      return _lastSeen[language] + ' ' + hoursAndMinutes
    }
    if (socketContact.isConnect) {
      return _online[language]
    } else {
      return _offline[language]
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

  const faArrow = language === 'il' ? 'fa-arrow-right' : 'fa-arrow-left'

  return (
    <div className={`row w-100 sticky-top ${bgColor} align-items-center m-0`}>
      <div className="col-1 d-lg-none">
        {/* <span onClick={() => showSidebar()} style={{ cursor: 'pointer' }}>
          
          <i className="fa-solid fa-arrow-left fa-lg"></i>
        </span> */}
        <Arrow role={'button'} onClick={() => showSidebar()}>
          <i className={`fa-solid ${faArrow} fa-lg offcanvas-button`}></i>
        </Arrow>
      </div>
      <div className="col-2 col-lg-1 py-1">
        <img
          style={{ height: '50px', width: '50px' }}
          src={socketContact.photoURL}
          className="rounded-circle"
          alt="..."
        ></img>
      </div>
      <div className="col">
        <div>
          <h3 className={`mb-0 fs-5 lh-1 ${colorName}`}>
            {socketContact.displayName}
          </h3>
        </div>
        <div>
          <p className={`mb-0 fw-light pt-0 lh-1 ${colorInfo}`}>
            {isTyping ? _isTyping[language] : connectionStatus()}
          </p>
        </div>
      </div>
      <div className="d-none d-lg-flex col-lg-1">
        <span
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
      <div className="col-1 d-flex justify-content-center align-items-center">
        <span className={`icon-bars ${iconBars}`}>
          {/* <i className="fa-solid fa-ellipsis-vertical fa-lg"></i> */}
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
      </div>
    </div>
  )
}
