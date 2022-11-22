import { useEffect } from 'react'
import { useRef } from 'react'
import { useContext, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { ThemeContext } from '../../../../utils/context/ThemeContext'
import colors from '../../../../utils/style/color'
// import './index.css'
import Avatar from '../../../../assets/img/avatar4.png'
import { SocketContactContext } from '../../../../utils/context/SocketContact'
import { arrayUnion, doc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../../../firebase-config'
import { UserAuth } from '../../../../utils/context/AuthContext'

function MyContact({
  random,
  name1,
  name2,
  name3,
  contact,
  id,
  info,
  photoURL,
}) {
  const { user } = UserAuth()
  const { socketContact, setSocketContact, toggleChange } =
    useContext(SocketContactContext)
  const { setIsChatOpen } = useContext(ThemeContext)
  const navigate = useNavigate()
  const listOfContacts = useRef([])

  // console.log('contact', contact)

  function handleClickContact() {
    setSocketContact(contact)
    navigate(contact.userName)
    // console.log('mpàlçokijuyhbgtrvfdces')
    setIsChatOpen(true)
  }

  // DARK MODE
  const { theme } = useContext(ThemeContext)

  const bgContact = theme === 'light' ? 'li-bg-light' : 'li-bg-dark'
  const colorName = theme === 'light' ? '' : 'text-white'
  const colorInfo = theme === 'light' ? '' : 'text-white-50'

  return (
    <li
      className={`w-100 py-2 m-0 rounded ${bgContact}`}
      style={{ cursor: 'pointer' }}
      onClick={(e) => handleClickContact(e)}
      ref={listOfContacts}
    >
      <div className="row m-0 align-items-center">
        <div className="col-2">
          <div
            style={{
              height: '50px',
              width: '50px',
            }}
          >
            <img
              style={{
                height: '50px',
                width: '50px',
              }}
              src={photoURL ? photoURL : Avatar}
              className="rounded-circle"
              alt="..."
            ></img>
          </div>
        </div>
        <div className="col">
          <div>
            <h3 className={`mb-0 fs-5 lh-1 ${colorName}`}>
              {name1}
              <span style={{ color: colors.primary }}>{name2}</span>
              {name3}
            </h3>
          </div>
          <div>
            <p className={`mb-0 fw-light pt-0 lh-1 ${colorInfo}`}>{info}</p>
          </div>
        </div>
        <div className="col-2 p-0">
          <span className={`badge rounded-pill bg-primary`}>
            {contact.hasNewMessages > 0 && contact.hasNewMessages}
          </span>
        </div>
      </div>
    </li>
  )
}

export default MyContact
