import { useContext, useState } from 'react'
import { ThemeContext } from '../../../../utils/context/ThemeContext'
import colors from '../../../../utils/style/color'
import './index.css'
import Avatar from '../../../../assets/img/avatar4.png'
import {
  setActuallyContactIdInStorage,
  SocketContactContext,
} from '../../../../utils/context/SocketContact'
import {
  updateHasNewMessagesInDB,
  updateMyContactsInDB,
} from '../../../../firebase-config'
import { UserAuth } from '../../../../utils/context/AuthContext'
import { imgError } from '../../../../utils/functions/returnAvatarIsImgError'

function Contact({ name1, name2, name3, contact, description, photoURL }) {
  const { user } = UserAuth()
  const {
    setMyContacts,
    newMessages,
    setNewMessages,
    setActuallyContactId,
    actuallyContactId,
    myContacts,
  } = useContext(SocketContactContext)

  // console.log('contact', contact)

  function handleClickContact(e) {
    // close the offCanvas
    offCanvasButton[0].click()
    // set actually contact id whith this contact
    setActuallyContactId(contact.userId)
    setActuallyContactIdInStorage(contact.userId)
    // check if this contact has not yet in myContacts and if not so add this to myContacts (in DB and in 'myContacts)
    if (!myContacts.includes(contact.userId)) {
      addThisContactIdInMyContactsDB(user.uid, contact.userId, myContacts)
      setMyContacts((curr) => {
        curr.push(contact.userId)
        return curr
      })
    }
    // if this contact has New Messages so it delete there (in DB and in 'myContacts)
    if (newMessages[contact.userId] > 0) {
      updateHasNewMessagesInDB(user.uid, actuallyContactId, 'suppr')
      setNewMessages((curr) => {
        curr[contact.userId] = 0
        curr = JSON.parse(JSON.stringify(curr))
        return curr
      })
    }
  }

  // DARK MODE
  const { theme } = useContext(ThemeContext)

  const bgContact = theme === 'light' ? 'li-bg-light' : 'li-bg-dark'
  const colorName = theme === 'light' ? '' : 'text-white'
  const colorInfo = theme === 'light' ? '' : 'text-white-50'

  const offCanvasButton = document.getElementsByClassName('offcanvas-button')
  // console.log('offcanvas-button', offCanvasButton)

  const bgColorOfBadgeIsOnline = contact.isConnect === true ? '#31a24c' : 'red'
  const boxShadowOfBadgeIsOnline = theme === 'light' ? 'white' : '#212529'

  // console.log('contact NEW MESSAGE', newMessages[contact.userId])

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
              position: 'relative',
            }}
          >
            <span
              style={{
                padding: '7px',
                backgroundColor: bgColorOfBadgeIsOnline,
                position: 'absolute',
                borderRadius: '7px',
                top: '0px',
                left: ' 0px',
                boxShadow: '0px 0px 0px 2px ' + boxShadowOfBadgeIsOnline,
              }}
            ></span>
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
                {/* {_isTyping[language]} */}isTyping
              </p>
            ) : (
              <p className={`mb-0 fw-light pt-0 lh-1 ${colorInfo}`}>
                {/* {'coucou'} */}
                {contact && contact.userName}
              </p>
            )}
          </div>
        </div>
        <div className="col-2 p-0">
          <span className={`badge rounded-pill bg-primary`}>
            {contact && newMessages && newMessages[contact.userId] > 0
              ? newMessages[contact.userId]
              : null}
          </span>
        </div>
      </div>
    </li>
  )
}

export default Contact

export async function addThisContactIdInMyContactsDB(
  myId,
  contactId,
  myContacts
) {
  // const myContactsInDB = await getMyContactsFromDB(myId)
  console.log(' myContacts ', myContacts)
  // if this contact is already existing no need to update
  if (myContacts.includes(contactId)) {
    console.log('utilisateur déjà exisistant dans Mycontacts !!')
    return
  }
  const myContactsWhithNewContact = [...myContacts, contactId]
  // console.log('myContactsWhithNewContact', myContactsWhithNewContact)
  updateMyContactsInDB(myId, myContactsWhithNewContact)
}
