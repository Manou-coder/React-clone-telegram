import { useContext, useEffect } from 'react'
import Message from '../Message'
import socket from '../../../../utils/socket.io'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { ThemeContext } from '../../../../utils/context/ThemeContext'
import { SocketContactContext } from '../../../../utils/context/SocketContact'

export default function MesssageBody({ message }) {
  const [messageDisplay, setMessageDisplay] = useState([])

  const { socketContact, setSocketContact } = useContext(SocketContactContext)

  socket.on('private message', (msg) => {
    console.log('msg.from', msg.from)
    console.log('socketContact.userId', socketContact.userId)

    if (msg.from !== socketContact.userId) {
      console.log('diffffffffffffffffffffffffffffffff')
      return
    }
    console.log('msg', msg)
    setMessageDisplay([
      ...messageDisplay,
      ...[
        {
          senderIsMe: false,
          sender: msg.from,
          message: msg.content,
        },
      ],
    ])
  })

  console.log('messageDisplay', messageDisplay)

  useEffect(() => {
    if (message[message.length - 1] === undefined) {
      return
    }
    setMessageDisplay([
      ...messageDisplay,
      ...[
        {
          senderIsMe: true,
          message: message[message.length - 1],
        },
      ],
    ])
  }, [message])

  const { theme } = useContext(ThemeContext)

  const wallpaper = theme === 'light' ? 'wallpapper' : 'wallpapper-black'

  return (
    <div
      className={`col h-100 ${wallpaper}`}
      style={{
        overflowY: 'scroll',
        scrollbarWidth: 'none',
        width: '100%',
      }}
    >
      <div className="container d-flex flex-column" style={{ width: '90%' }}>
        {/* <!-- this div is meant to put a space between the message bubbles and the nav bar --> */}
        <div className="w-100" style={{ padding: '12px 0px' }}></div>
        {/* ------------------------------------MESSAGES-HERE------------------------------------------- */}

        {messageDisplay.map((e, i) => (
          <Message
            messageDisplay={messageDisplay[i].message}
            myMessage={messageDisplay[i].senderIsMe}
            key={'u' + i}
          />
        ))}

        {/* ------------------------------------MESSAGES-HERE------------------------------------------- */}
        {/* <!-- this div is meant to put a space between the message bubbles and the message bar --> */}
        <div className="w-100" style={{ padding: '1px 0px' }}></div>
      </div>
    </div>
  )
}
