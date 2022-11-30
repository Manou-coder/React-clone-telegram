import MessageBar from './Chat-Footer/MessageBar'
import MesssageBody from '../chat/Chat-Body/MessageBody'
import NavbarChat from './Chat-Header/NavbarChat'
import { useContext, useState } from 'react'
import { ThemeContext } from '../../utils/context/ThemeContext'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import ContactMenu from './Chat-Header/ContactMenu'

export default function Chat() {
  const params = useParams()
  const [showChat, setShowChat] = useState(false)
  const { theme, isChatOpen } = useContext(ThemeContext)

  const wallpaper = theme === 'light' ? 'wallpapper' : 'wallpapper-black'

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

  const displayChat = isChatOpen ? 'd-flex' : 'd-none d-lg-flex'

  return (
    <div
      className={`${displayChat} col-12 col-lg-8 p-0 vh-100 flex-column position-relative _chat ${wallpaper}`}
    >
      {/* {!showChat ? (
        <div className={`h-100 w-100`}></div>
      ) : ( */}
      <>
        <NavbarChat />
        <MesssageBody />
        <MessageBar />
      </>
      {/* )} */}
    </div>
  )
}
