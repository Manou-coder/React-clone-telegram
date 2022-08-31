import { useState } from 'react'
import EndOfSlidebar from './EndOfSlidebar'
import Navbar from './Navbar'
import SlideMenu from './SlideMenu'

function Sidebar() {
  const [inputLetters, setInputLetters] = useState('')
  return (
    <div className="d-none d-lg-flex flex-column col-lg-4 p-0 sidebar vh-100 border-end border-secondary _sidebar">
      <Navbar inputLetters={inputLetters} setInputLetters={setInputLetters} />
      <SlideMenu />
      <EndOfSlidebar
        inputLetters={inputLetters}
        setInputLetters={setInputLetters}
      />
    </div>
  )
}

export default Sidebar
