import { useRef } from 'react'
import { useContext, useState } from 'react'
import { ThemeContext } from '../../../../utils/context/ThemeContext'
import colors from '../../../../utils/style/color'
import Avatar from '../../../../assets/img/avatar4.png'
import {
  getFromStorage,
  setActuallyContactIdInStorage,
  SocketContactContext,
} from '../../../../utils/context/SocketContact'
import { UserAuth } from '../../../../utils/context/AuthContext'
import { LanguageContext } from '../../../../utils/context/LanguageContext'
import { updateHasNewMessagesInDB } from '../../../../firebase-config'
import { imgError } from '../../../../utils/functions/returnAvatarIsImgError'
import { MessagesContext } from '../../../../utils/context/MessagesContext'
import { addZero } from '../../../../utils/functions/addZero'
import { svgSend } from '../../../../utils/functions/svgSend'
import { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

function MyContact({ name1, name2, name3, contact, description, photoURL }) {
  const navigate = useNavigate()
  const { user } = UserAuth()
  const {
    setMyContacts,
    setNewMessages,
    actuallyContactId,
    newMessages,
    setActuallyContactId,
  } = useContext(SocketContactContext)
  const { setArrOfMessages, updateMessageStorage, setUpdateMessageStorage } =
    useContext(MessagesContext)
  const { setIsChatOpen } = useContext(ThemeContext)
  const [lastMessage, setLastMessage] = useState({})

  // console.log('contact', contact)
  // console.log('description', description)

  useEffect(() => {
    if (!updateMessageStorage) {
      return
    }
    if (updateMessageStorage.contactId === contact.userId) {
      console.log('recu message de la part de ' + contact.displayName)
      const allMessagesWithThisContact = getFromStorage(contact.userId)
      console.log('lastMessage', lastMessage)
      if (
        !allMessagesWithThisContact &&
        allMessagesWithThisContact.length <= 0
      ) {
        console.log('error: no found message in storage with this contact!')
      }
      setLastMessage((curr) => {
        if (
          !allMessagesWithThisContact[allMessagesWithThisContact.length - 1]
        ) {
          return curr
        }
        curr = JSON.parse(
          JSON.stringify(
            allMessagesWithThisContact[allMessagesWithThisContact.length - 1]
          )
        )
        console.log('curr', curr)
        return curr
      })
    }
  }, [updateMessageStorage])

  useEffect(() => {
    if (!contact) {
      return
    }
    // console.log('rerender')
    const allMessagesWithThisContact = getFromStorage(contact.userId)
    if (allMessagesWithThisContact && allMessagesWithThisContact.length > 0) {
      setLastMessage(
        allMessagesWithThisContact[allMessagesWithThisContact.length - 1]
      )
      // console.log('lastMessageWithThisContact', lastMessageWithThisContact)
    }
  }, [])

  function handleClickContact() {
    // navigate to userName (its good for mobile)
    navigate('/chat/' + contact.userName)
    // empty the arrOfMessages if it's differnent contact
    if (contact.userId !== actuallyContactId) {
      setArrOfMessages([])
    }
    setActuallyContactId(contact.userId)
    setActuallyContactIdInStorage(contact.userId)
    setIsChatOpen(true)
    updateHasNewMessagesInDB(user.uid, contact.userId, 'suppr')
    setNewMessages((curr) => {
      curr[contact.userId] = 0
      return curr
    })
  }
  //
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

  function readableDate(timeInMs) {
    const date = new Date(timeInMs)
    const hoursAndMinutes = date.getHours() + ':' + addZero(date.getMinutes())
    return hoursAndMinutes
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
        <div
          style={{
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}
          className="col"
        >
          <div>
            <h3 className={`mb-0 fs-5 lh-1 ${colorName}`}>
              {name1}
              <span style={{ color: colors.primary }}>{name2}</span>
              {name3}
            </h3>
          </div>
          <div>
            {description ? (
              <p
                className={`mb-0 pt-0 lh-1`}
                style={{ color: '#00ff00', height: '24px' }}
              >
                {_isTyping[language]}
              </p>
            ) : (
              <p
                style={{
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  height: '24px',
                }}
                className={`mb-0 fw-light pt-0 ${colorInfo}`}
              >
                {lastMessage && lastMessage.content}
              </p>
            )}
          </div>
        </div>
        <div
          style={{ height: '52.5px' }}
          className="col-2 p-0 d-flex flex-column gap-2"
        >
          <div className="d-flex justify-content-center pe-2">
            <div className="d-flex justify-content-between w-100">
              <span className={`${colorInfo}`}>
                {lastMessage && lastMessage.from === user.uid
                  ? svgSend(lastMessage.status)
                  : null}
              </span>
              <span className={`${colorInfo}`}>
                {lastMessage && readableDate(lastMessage.time)}
              </span>
            </div>
          </div>
          <div className="d-flex justify-content-center">
            <span className={`badge rounded-pill bg-primary`}>
              {newMessages[contact.userId] > 0 && newMessages[contact.userId]}
              {!newMessages[contact.userId] && newMessages[contact.userId] > 0
                ? newMessages[contact.userId]
                : null}
            </span>
          </div>
        </div>
      </div>
    </li>
  )
}

export default MyContact
