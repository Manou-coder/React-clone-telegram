import { useEffect } from 'react'
import { useContext } from 'react'
import { Outlet } from 'react-router-dom'
import { ThemeContext } from '../../utils/context/ThemeContext'
import Chat from '../../components/chat/Chat'
import Modal from '../../components/modal/Modal'
import Sidebar from '../../components/sidebar/SideBar'
import { SocketContactContext } from '../../utils/context/SocketContact'
import DefaultChat from '../../components/default chat/DefaultChat'
import Calls from '../../components/Calls/Calls'

function App({ children }) {
  // DARK MODE
  const { theme } = useContext(ThemeContext)
  const bgColor = theme === 'light' ? 'bg-white' : 'bg-black'
  const { actuallyContactId, myContacts } = useContext(SocketContactContext)

  return (
    <div className={`container-fluid vh-100 vw-100 p-0 ${bgColor}`}>
      <div className="row vh-100 vw-100 m-0">
        {myContacts && (
          <>
            <Sidebar />
            {actuallyContactId ? (
              <Chat />
            ) : (
              // <div
              //   className={`col-lg-8 p-0 vh-100 bg-succes position-relative ${wallpaper}`}
              // ></div>
              <DefaultChat />
            )}
          </>
        )}
      </div>
      {/* <!-- Modal --> */}
      <Modal />
      {/* <Calls /> */}
    </div>
  )
}

export default App