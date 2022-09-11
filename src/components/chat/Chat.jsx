import MessageBar from './Chat-Footer/MessageBar'
import MesssageBody from '../chat/Chat-Body/MessageBody'
import NavbarChat from './Chat-Header/NavbarChat'
import { useState } from 'react'

export default function Chat() {

  const [message, setMessage] = useState([])

  const [sendMessage, setSendMessage] = useState(false)

  return (
    <div className="col-12 col-lg-8 bg-light p-0 vh-100 d-flex flex-column _chat">
      <NavbarChat />
      <MesssageBody message={message} setMessage={setMessage} sendMessage={sendMessage} setSendMessage={setSendMessage} />
      <MessageBar message={message} setMessage={setMessage} sendMessage={sendMessage} setSendMessage={setSendMessage} />
    </div>
  )
}

