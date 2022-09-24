import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import OffCanvasProfile from '../offCanvas/OffCanvasProfile'
import EndOfSlidebar from '../sidebar/SideBar-Body/EndOfSlidebar'
import Navbar from '../sidebar/SideBar-Header/NavBar'
import SlideMenu from '../sidebar/SideBar-Header/SlideMenu'
import SettingsMenu from './SideBar-Header/SettingsMenu'

function Sidebar() {
  const [inputLetters, setInputLetters] = useState('')
  const [isContactsOpen, setContactsOpen] = useState(true)
  const [iconBarIsActive, setIconBarIsActive] = useState(false)
  return (
    <div className="d-none d-lg-flex flex-column col-lg-4 p-0 sidebar vh-100 border-end border-secondary _sidebar">
      {iconBarIsActive && <SettingsMenu />}
      <OffCanvasProfile />
      <Navbar
        inputLetters={inputLetters}
        setInputLetters={setInputLetters}
        iconBarIsActive={iconBarIsActive}
        setIconBarIsActive={setIconBarIsActive}
      />
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
      <Outlet />
    </div>
  )
}

export default Sidebar
