import Contacts from '../Contacts'
import '../../../../utils/style/EndOfSlidebar.css'
import Calls from '../Calls'
import { useContext, useState } from 'react'
import { ThemeContext } from '../../../../utils/context/ThemeContext'
import MyContacts from '../MyContacts'

function EndOfSlidebar({ inputLetters, setInputLetters, isContactsOpen }) {
  // DARK MODE
  const { theme } = useContext(ThemeContext)
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
        {isContactsOpen ? (
          // <Contacts
          //   inputLetters={inputLetters}
          //   setInputLetters={setInputLetters}
          // />
          <MyContacts
            inputLetters={inputLetters}
            setInputLetters={setInputLetters}
          />
        ) : (
          <Calls />
        )}
      </div>
    </div>
  )
}

export default EndOfSlidebar
