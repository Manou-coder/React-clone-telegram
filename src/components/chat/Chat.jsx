import MessageBar from './Chat-Footer/MessageBar'
import MesssageBody from '../chat/Chat-Body/MessageBody'
import NavbarChat from './Chat-Header/NavbarChat'
import { useContext, useState } from 'react'
import { ThemeContext } from '../../utils/context/ThemeContext'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'

export default function Chat() {
  let params = useParams()

  const [message, setMessage] = useState([])

  const [sendMessage, setSendMessage] = useState(false)

  const [showChat, setShowChat] = useState(false)

  const { theme } = useContext(ThemeContext)

  const wallpaper = theme === 'light' ? 'wallpapper' : 'wallpapper-black'

  console.log('params.username', params.username)

  function readParamsAndSetShowCat() {
    if (params.username !== undefined) {
      setShowChat(true)
    } else {
      setShowChat(false)
    }
  }

  useEffect(() => {
    readParamsAndSetShowCat()
  }, [params.username])

  return (
    <div className="col-12 col-lg-8 bg-light p-0 vh-100 d-flex flex-column _chat">
      {!showChat ? (
        <div className={`h-100 w-100 ${wallpaper}`}></div>
      ) : (
        <>
          <NavbarChat />
          <MesssageBody
            message={message}
            setMessage={setMessage}
            sendMessage={sendMessage}
            setSendMessage={setSendMessage}
          />
          <MessageBar
            message={message}
            setMessage={setMessage}
            sendMessage={sendMessage}
            setSendMessage={setSendMessage}
          />
        </>
      )}
    </div>
  )
}
