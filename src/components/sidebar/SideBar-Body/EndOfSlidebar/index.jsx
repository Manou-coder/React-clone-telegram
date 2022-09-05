import Contacts from '../Contacts'
import '../../../../utils/style/EndOfSlidebar.css'
import Calls from '../Calls'
import { useState } from 'react'

function EndOfSlidebar({ inputLetters, setInputLetters, isContactsOpen, setContactsOpen }) {

  return (
    <div
      className="container-fluid bg-white"
      style={{
        height: 'calc(100vh)',
        overflowY: 'scroll',
        scrollbarWidth: 'none',
        width: '100%',
      }}
    >
      <div className="container-fluid p-0">
        {
          isContactsOpen ? <Contacts
            inputLetters={inputLetters}
            setInputLetters={setInputLetters}
          /> : <Calls />
        }
      </div>
    </div>
  )
}

export default EndOfSlidebar
