import { useContext, useEffect } from 'react'
import { useState } from 'react'
import { LanguageContext } from '../../utils/context/LanguageContext'
import OffCanvas from '../offCanvas/OffCanvas'
import EndOfSlidebar from '../sidebar/SideBar-Body/EndOfSlidebar'
import Navbar from '../sidebar/SideBar-Header/NavBar'
import SlideMenu from '../sidebar/SideBar-Header/SlideMenu'
import Offline from './SideBar-Header/Offline/Offline'
import SettingsMenu from './SideBar-Header/SettingsMenu'

function Sidebar() {
  const [inputLetters, setInputLetters] = useState('')
  const [isContactsOpen, setContactsOpen] = useState(true)
  const [iconBarIsActive, setIconBarIsActive] = useState(false)
  const [canvasOption, setCanvasOption] = useState('profile')
  const [actualFlag, setActualFlag] = useState('')

  //CHECK INTERNET CONNECTION

  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      navigator.onLine ? setIsOffline(false) : setIsOffline(true)
    }, 3000)

    return () => clearInterval(interval)
  })

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     fetch('https://www.google.com/', {
  //       mode: 'no-cors',
  //     })
  //       .then(() => setIsOffline(false))
  //       .catch(() => setIsOffline(true))
  //   }, 3000)

  //   return () => clearInterval(interval)
  // }, [isOffline])

  // LANGUAGE
  const { language } = useContext(LanguageContext)

  const borderRight = language === 'il' ? '' : '1px solid black'
  const borderLeft = language === 'il' ? '1px solid black' : ''

  return (
    <div
      className="d-none d-lg-flex flex-column col-lg-4 p-0 sidebar vh-100 _sidebar"
      style={{
        borderRight: borderRight,
        borderLeft: borderLeft,
        position: 'relative',
      }}
    >
      {iconBarIsActive && (
        <SettingsMenu
          setCanvasOption={setCanvasOption}
          actualFlag={actualFlag}
          setActualFlag={setActualFlag}
        />
      )}
      <OffCanvas canvasOption={canvasOption} />
      <Navbar
        inputLetters={inputLetters}
        setInputLetters={setInputLetters}
        iconBarIsActive={iconBarIsActive}
        setIconBarIsActive={setIconBarIsActive}
      />
      {isOffline && <Offline />}
      <SlideMenu
        isContactsOpen={isContactsOpen}
        setContactsOpen={setContactsOpen}
      />
      <EndOfSlidebar
        inputLetters={inputLetters}
        setInputLetters={setInputLetters}
        isContactsOpen={isContactsOpen}
        setContactsOpen={setContactsOpen}
      />
    </div>
  )
}

export default Sidebar
