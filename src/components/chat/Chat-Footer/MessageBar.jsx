import { useContext, useState } from 'react'
import color from '../../../utils/style/color'
import socket from '../../../utils/socket.io'
// eslint-disable-next-line no-unused-vars
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { usersList } from '../../../utils/socket.io'
import { ThemeContext } from '../../../utils/context/ThemeContext'
import { LanguageContext } from '../../../utils/context/LanguageContext'
import { SocketContactContext } from '../../../utils/context/SocketContact'

const arrOfKey = []

export default function MessageBar({
  message,
  setMessage,
  sendMessage,
  setSendMessage,
}) {
  const { socketContact, setSocketContact } = useContext(SocketContactContext)

  let str = window.location.href
  let url = new URL(str)
  let pathname = url.pathname
  let arrPathname = pathname.split('/')
  let myId = arrPathname[1]
  // console.log('myId', myId)

  // console.log('socketContact', socketContact)

  const alignCenter =
    'row bg-white rounded-5 py-1 w-100 w-lg-75 align-items-center'
  const alignBaseline = alignCenter.replace(
    'align-items-center',
    'align-items-baseline'
  )

  const [classNameBar, setClassNameBar] = useState(alignCenter)

  const [messageInput, setMessageInput] = useState('')

  const cursorPointer = messageInput.trim() === '' ? 'default' : 'pointer'

  // console.log('messageBAr', message);

  function socketEmitPrivateMessage(msg, receiver) {
    // console.log('receiver', receiver)
    socket.emit('private message', { content: msg, to: receiver, sender: myId })
  }

  function autoResizeBar(event) {
    event.style.height = 'auto'
    event.style.height = event.scrollHeight + 'px'
    if (event.scrollHeight > 30) {
      setClassNameBar(alignBaseline)
    } else {
      setClassNameBar(alignCenter)
    }
  }

  function checkMessage(e) {
    // console.log('messageInput', messageInput)
    if (messageInput.trim() === '') {
      return
    }
    // setMessage([...message, [messageInput]])
    // socketEmitPrivateMessage(messageInput, socketContact.userId)
    writeMessage()
    let textarea = document.getElementById('autoresizing')
    textarea.value = ''
    setMessageInput('')
  }

  function checkKey(e) {
    if (messageInput.trim() === '') {
      return
    }
    arrOfKey.push(e.key)
    if (arrOfKey[arrOfKey.length - 2] === 'Shift') {
      // console.log('cocuou')
      return
    }
    if (e.key !== 'Enter') {
      return
    }
    if (messageInput.trim() === '') {
      e.target.value = ''
    }
    e.preventDefault()
    // setMessage([...message, [messageInput]])
    // socketEmitPrivateMessage(messageInput, socketContact.userId)
    writeMessage()
    e.target.value = ''
    setMessageInput('')
  }

  function writeMessage() {
    console.log('messageInput', messageInput)
    setMessage([...message, [messageInput]])
    console.log('message', message)
    socketEmitPrivateMessage(messageInput, socketContact.userId)
  }

  // DARK MODE
  const { theme } = useContext(ThemeContext)
  const bgColor1 = theme === 'light' ? 'bg-light' : 'bg-dark'
  const bgColor2 = theme === 'light' ? 'bg-white' : 'bg-black'
  const fillColor = theme === 'light' ? 'white' : 'black'
  const textColor = theme === 'light' ? 'black' : 'White'
  const iconColor = theme === 'light' ? 'black' : '#909294'

  const iconSendColor = () => {
    if (messageInput.trim() !== '') {
      return color.primary
    } else if (theme === 'light') {
      return 'black'
    } else {
      return '#909294'
    }
  }

  const iconSend = () => {
    if (messageInput.trim() !== '' && theme === 'light') {
      return 'icon-bars icon-bars-light'
    } else if (messageInput.trim() !== '' && theme !== 'light') {
      return 'icon-bars icon-bars-light'
    } else if (messageInput.trim() === '') {
      return 'icon-bars-cursorDefault'
    }
  }

  const iconBars = theme === 'light' ? 'icon-bars-light' : ' icon-bars-dark'

  // LANGUAGE
  const { language } = useContext(LanguageContext)

  const _message = {
    en: 'Message...',
    fr: 'Message...',
    il: 'הודעה...',
  }

  return (
    <div className={`row sticky-bottom py-1 w-100 m-0 p-0 ${bgColor1}`}>
      <div className="col py-1 d-flex justify-content-center">
        <div
          // className={classNameBar}
          className={`row rounded-5 py-1 w-100 w-lg-75 align-items-baseline ${bgColor2}`}
          style={{ position: 'relative', bottom: '2px' }}
        >
          <div className="col-1 d-flex justify-content-start">
            <span
              className={`icon-bars ${iconBars} d-flex justify-content-center align-items-center`}
            >
              {/* <i className="fa-solid fa-face-smile fa-lg"></i> */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                style={{ fill: iconColor, position: 'relative' }}
                height="1.25em"
              >
                <path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM164.1 325.5C182 346.2 212.6 368 256 368s74-21.8 91.9-42.5c5.8-6.7 15.9-7.4 22.6-1.6s7.4 15.9 1.6 22.6C349.8 372.1 311.1 400 256 400s-93.8-27.9-116.1-53.5c-5.8-6.7-5.1-16.8 1.6-22.6s16.8-5.1 22.6 1.6zM208.4 208c0 17.7-14.3 32-32 32s-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32zm128 32c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32z" />
              </svg>
            </span>
          </div>
          <div className="d-none d-lg-block col-1 d-flex justify-content-start">
            <span
              className={`icon-bars ${iconBars} d-flex justify-content-center align-items-center`}
            >
              {/* <i className="fa-solid fa-paperclip fa-lg"></i> */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                style={{ fill: iconColor, position: 'relative' }}
                height="1.25em"
              >
                <path d="M396.2 83.8c-24.4-24.4-64-24.4-88.4 0l-184 184c-42.1 42.1-42.1 110.3 0 152.4s110.3 42.1 152.4 0l152-152c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-152 152c-64 64-167.6 64-231.6 0s-64-167.6 0-231.6l184-184c46.3-46.3 121.3-46.3 167.6 0s46.3 121.3 0 167.6l-176 176c-28.6 28.6-75 28.6-103.6 0s-28.6-75 0-103.6l144-144c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-144 144c-6.7 6.7-6.7 17.7 0 24.4s17.7 6.7 24.4 0l176-176c24.4-24.4 24.4-64 0-88.4z" />
              </svg>
            </span>
          </div>
          <div className="col">
            <textarea
              id="autoresizing"
              onInput={(e) => autoResizeBar(e.target)}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => checkKey(e)}
              rows="1"
              placeholder={_message[language]}
              style={{
                backgroundColor: fillColor,
                color: textColor,
                position: 'relative',
                border: 'none',
                outline: 'none',
                resize: 'none',
                width: '100%',
                bottom: '-2px',
              }}
            ></textarea>
          </div>
          <div className="col-1 d-flex justify-content-end">
            <span
              onClick={(e) => checkMessage(e)}
              className={`${iconSend()} d-flex justify-content-center align-items-center`}
            >
              {/* ICON SEARCH - equal to ("fa-solid fa-paper-plane fa-lg") */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                style={{
                  fill: iconSendColor(),
                  position: 'relative',
                  cursor: cursorPointer,
                }}
                height="1.25em"
              >
                <path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L277.3 424.9l-40.1 74.5c-5.2 9.7-16.3 14.6-27 11.9S192 499 192 488V392c0-5.3 1.8-10.5 5.1-14.7L362.4 164.7c2.5-7.1-6.5-14.3-13-8.4L170.4 318.2l-32 28.9 0 0c-9.2 8.3-22.3 10.6-33.8 5.8l-85-35.4C8.4 312.8 .8 302.2 .1 290s5.5-23.7 16.1-29.8l448-256c10.7-6.1 23.9-5.5 34 1.4z" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
