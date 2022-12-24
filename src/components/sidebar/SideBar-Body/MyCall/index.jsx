import { useEffect, useRef } from 'react'
import { useContext, useState } from 'react'
import { ThemeContext } from '../../../../utils/context/ThemeContext'
import Avatar from '../../../../assets/img/avatar4.png'
import {
  setActuallyContactIdInStorage,
  SocketContactContext,
} from '../../../../utils/context/SocketContact'
import { LanguageContext } from '../../../../utils/context/LanguageContext'
import { imgError } from '../../../../utils/functions/returnAvatarIsImgError'
import { calculDate } from '../../../../utils/functions/date'
import { useComponentVisibleRightClick } from '../../../../utils/functions/useHandleClickOutside'
import CallMenu from '../CallMenu'

let offsetX = 0
let offsetY = 0
let clientY = 0

function MyCall({ contactId, startTime, isOutgoingCall, videoCall, callId }) {
  //   const { user } = UserAuth()
  const { setActuallyContactId, allUsers } = useContext(SocketContactContext)
  const { setIsChatOpen } = useContext(ThemeContext)
  // const { myCall, setMyCall } = useState(null)
  function handleClickCall() {
    setActuallyContactId(contact.userId)
    setActuallyContactIdInStorage(contact.userId)
    setIsChatOpen(true)
  }

  // DARK MODE
  const { theme } = useContext(ThemeContext)

  const bgContact = theme === 'light' ? 'li-bg-light' : 'li-bg-dark'
  const colorName = theme === 'light' ? '' : 'text-white'

  // LANGUAGE
  const { language } = useContext(LanguageContext)

  const contact = allUsers && allUsers.find((e) => e.userId === contactId)

  const logoRotate = isOutgoingCall ? 'rotate(315deg)' : 'rotate(135deg)'
  const logoFill = isOutgoingCall ? '#31a24c' : 'red'

  const { refComponent, refButton, isComponentVisible, setIsComponentVisible } =
    useComponentVisibleRightClick(false)

  const handleClickRefButton = (e) => {
    e.preventDefault()
    clientY = e.clientY
    offsetX = e.nativeEvent.offsetX
    offsetY = e.nativeEvent.offsetY
    console.log('offsetX', offsetX)
    console.log('offsetY', offsetY)
    setIsComponentVisible(!isComponentVisible)
  }

  return (
    <div>
      <li
        className={`w-100 py-2 m-0 rounded ${bgContact}`}
        style={{ cursor: 'pointer', position: 'relative' }}
        onClick={() => handleClickCall()}
        ref={refButton}
        onContextMenu={(e) => handleClickRefButton(e)}
      >
        <div ref={refComponent}>
          {isComponentVisible && (
            <div
              style={{
                position: 'fixed',
                top: clientY - 100,
                left: language !== 'il' && offsetX,
                right: language === 'il' && offsetX,
                zIndex: '50000',
              }}
            >
              <CallMenu callId={callId} />
            </div>
          )}
        </div>
        <div
          className="row m-0 align-items-center"
          // IMPORTANT the style of "pointer-events = none" is used so that the offsetX and offsetY are not calculated from this event
          style={{ pointerEvents: 'none' }}
        >
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
                src={contact ? contact.photoURL : Avatar}
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
              <h3 className={`m-0 fs-5 lh-1 ${colorName}`}>
                {contact && contact.displayName}
              </h3>
            </div>
            <div className="d-flex flex-row">
              <span className="me-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  style={{
                    fill: logoFill,
                    transform: logoRotate,
                    position: 'relative',
                    top: '-1px',
                  }}
                  height="0.8em"
                >
                  <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
                </svg>
              </span>
              <p className={`m-0 ${colorName}`}>
                {calculDate(startTime, language)}
              </p>
            </div>
          </div>
          <div
            style={{ height: '52.5px' }}
            className="col-2 p-0 d-flex justify-content-center align-items-center"
          >
            <span>
              {videoCall ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 576 512"
                  style={{ fill: '#31a24c' }}
                  height="1.25em"
                >
                  <path d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2V384c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1V320 192 174.9l14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  style={{ fill: '#31a24c' }}
                  height="1.25em"
                >
                  <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" />
                </svg>
              )}
            </span>
          </div>
        </div>
      </li>
    </div>
  )
}

export default MyCall
