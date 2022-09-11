import { useEffect } from 'react'
import Message from '../Message'
// import TimeBadge from '../TimeBadge/index.jsx'
// import UserMessage from '../UserMessage'
import socket from '../../../../utils/socket.io';
import { useState } from 'react';
import { useParams } from 'react-router-dom';


export default function MesssageBody({ message, }) {

  // const params = useParams()

  const [messageDisplay, setMessageDisplay] = useState([])

  // socket.on('chat message', function (msg) {
  //   // console.log('msg', msg);
  //   setMessageDisplay([...messageDisplay, ...[{
  //     senderIsMe: false,
  //     message: msg
  //   }]])
  // });


  socket.on('private message', content => {
    console.log('content', content)
    setMessageDisplay([...messageDisplay, ...[{
      senderIsMe: false,
      message: content.content
    }]])
  })


  useEffect(() => {
    if (message[message.length - 1] === undefined) {
      return
    }
    setMessageDisplay([...messageDisplay, ...[{
      senderIsMe: true,
      message: message[message.length - 1]
    }]])
  }, [message])



  return (
    <div
      className="col h-100"
      style={{
        backgroundImage: 'url(/img/chat-wallpaper.jpg)',
        overflowY: 'scroll',
        scrollbarWidth: 'none',
        width: '100%',
      }}
    >
      <div className="container d-flex flex-column" style={{ width: '90%' }}>
        {/* <!-- this div is meant to put a space between the message bubbles and the nav bar --> */}
        <div
          className="w-100"
          style={{ padding: '12px 0px' }}
        ></div>
        {/* ------------------------------------MESSAGES-HERE------------------------------------------- */}

        {
          messageDisplay.map((e, i) => (
            <Message messageDisplay={messageDisplay[i].message} myMessage={messageDisplay[i].senderIsMe} key={'u' + i} />
          ))
        }

        {/* ------------------------------------MESSAGES-HERE------------------------------------------- */}
        {/* <!-- this div is meant to put a space between the message bubbles and the message bar --> */}
        <div
          className="w-100"
          style={{ padding: '1px 0px' }}
        ></div>
      </div>
    </div>
  )
}

