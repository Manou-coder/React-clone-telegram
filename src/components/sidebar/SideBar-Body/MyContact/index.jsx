import { useRef } from 'react'
import { useContext, useState } from 'react'
import { ThemeContext } from '../../../../utils/context/ThemeContext'
import colors from '../../../../utils/style/color'
import Avatar from '../../../../assets/img/avatar4.png'
import {
  setActuallyContactIdInStorage,
  SocketContactContext,
} from '../../../../utils/context/SocketContact'
import { UserAuth } from '../../../../utils/context/AuthContext'
import { LanguageContext } from '../../../../utils/context/LanguageContext'
import { updateHasNewMessagesInDB } from '../../../../firebase-config'
import { imgError } from '../../../../utils/functions/returnAvatarIsImgError'
import { MessagesContext } from '../../../../utils/context/MessagesContext'

function MyContact({ name1, name2, name3, contact, description, photoURL }) {
  const { user } = UserAuth()
  const {
    setMyContacts,
    setNewMessages,
    actuallyContactId,
    newMessages,
    setActuallyContactId,
  } = useContext(SocketContactContext)
  const { setArrOfMessages } = useContext(MessagesContext)
  const { setIsChatOpen } = useContext(ThemeContext)

  // console.log('contact', contact)
  // console.log('description', description)

  function handleClickContact() {
    // empty the arrOfMessages
    setArrOfMessages([])
    setActuallyContactId(contact.userId)
    setActuallyContactIdInStorage(contact.userId)
    setIsChatOpen(true)
    updateHasNewMessagesInDB(user.uid, actuallyContactId, 'suppr')
    // updateHasNewMessagesInDB(user.uid, socketContact.userId, 'add')
    setNewMessages((curr) => {
      curr[contact.userId] = 0
      return curr
    })
  }

  // DARK MODE
  const { theme } = useContext(ThemeContext)

  const bgContact = theme === 'light' ? 'li-bg-light' : 'li-bg-dark'
  const colorName = theme === 'light' ? '' : 'text-white'
  const colorInfo = theme === 'light' ? '' : 'text-white-50'

  // LANGUAGE
  const { language } = useContext(LanguageContext)

  const _isTyping = {
    en: 'Is typing...',
    fr: "En train d'écrire...",
    il: 'כותב/ת',
  }

  return (
    <li
      className={`w-100 py-2 m-0 rounded ${bgContact}`}
      style={{ cursor: 'pointer' }}
      onClick={(e) => handleClickContact(e)}
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
              onError={(e) => imgError(e.target)}
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
            {description ? (
              <p className={`mb-0 pt-0 lh-1`} style={{ color: '#00ff00' }}>
                {_isTyping[language]}
              </p>
            ) : (
              <p className={`mb-0 fw-light pt-0 lh-1 ${colorInfo}`}>
                {'coucou'}
              </p>
            )}
          </div>
        </div>
        <div className="col-2 p-0">
          <span className={`badge rounded-pill bg-primary`}>
            {newMessages[contact.userId] > 0 && newMessages[contact.userId]}
          </span>
        </div>
      </div>
    </li>
  )
}

export default MyContact
