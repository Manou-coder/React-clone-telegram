import { useContext, useState } from 'react'
import { ThemeContext } from '../../../../utils/context/ThemeContext'
import colors from '../../../../utils/style/color'
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

export default function SearchedMessage({ message, resetSearchedMessages }) {
  const { user } = UserAuth()
  const { allUsers } = useContext(SocketContactContext)
  const { theme } = useContext(ThemeContext)

  // console.log('contact', contact)

  function handleClickContact(e) {
    // close the offCanvas
    offCanvasButton[1].click()
    resetSearchedMessages()
    const messageInDOM = document.getElementById(message.id)
    const children = messageInDOM.childNodes[0]
    const originalChildrenBgColor = children.style.backgroundColor
    if (!messageInDOM) {
      return
    }
    messageInDOM.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
    setTimeout(() => {
      children.style.backgroundColor = 'GrayText'
    }, 1000)
    setTimeout(() => {
      children.style.backgroundColor = originalChildrenBgColor
    }, 1500)
  }

  // DARK MODE

  const bgContact = theme === 'light' ? 'li-bg-light' : 'li-bg-dark'
  const colorName = theme === 'light' ? '' : 'text-white'
  const colorInfo = theme === 'light' ? '' : 'text-white-50'
  const offCanvasButton = document.getElementsByClassName('offcanvas-button')

  const sender =
    message && allUsers.find((user) => user.userId === message.from)
  //   console.log('message', message)
  //   console.log('sender', sender)

  return (
    <>
      {message && sender ? (
        <li
          className={`w-100 py-2 m-0 rounded ${bgContact}`}
          style={{ cursor: 'pointer' }}
          onClick={(e) => handleClickContact(e)}
          id={message.id}
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
                <img
                  style={{
                    height: '50px',
                    width: '50px',
                  }}
                  src={sender.photoURL}
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
                  {sender.displayName}
                </h3>
              </div>
              <div>
                <p
                  style={{
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    height: '24px',
                  }}
                  className={`mb-0 fw-light pt-0 ${colorInfo}`}
                >
                  {message.content}
                </p>
              </div>
            </div>
            <div style={{ height: '52.5px' }} className="col-1">
              <span
                className={`${colorInfo}`}
                style={{ position: 'absolute', right: '30px' }}
              >
                {new Date(message.time).toLocaleDateString()}
              </span>
            </div>
          </div>
        </li>
      ) : null}
    </>
  )
}
