import '../../../../utils/style/EndOfSlidebar.css'
import { useContext, useState } from 'react'
import { ThemeContext } from '../../../../utils/context/ThemeContext'
import MyContacts from '../MyContacts'
import { SocketContactContext } from '../../../../utils/context/SocketContact'
import MyCalls from '../MyCalls'

function EndOfSlidebar({ inputLetters, setInputLetters, isContactsOpen }) {
  // DARK MODE
  const { theme } = useContext(ThemeContext)
  const { myContacts } = useContext(SocketContactContext)
  const bgColor = theme === 'light' ? 'bg-white' : 'bg-dark'
  return (
    <div
      className={`container-fluid ${bgColor}`}
      style={{
        height: 'calc(100vh)',
        overflowY: 'scroll',
        scrollbarWidth: 'none',
        width: '100%',
      }}
    >
      <div className="container-fluid p-0">
        {isContactsOpen && myContacts ? (
          <MyContacts
            inputLetters={inputLetters}
            setInputLetters={setInputLetters}
          />
        ) : (
          <MyCalls />
        )}
      </div>
    </div>
  )
}

export default EndOfSlidebar
