import { useEffect } from 'react'
import { useContext } from 'react'
import { Outlet } from 'react-router-dom'
import { ThemeContext } from '../../utils/context/ThemeContext'
import Chat from '../../components/chat/Chat'
import Modal from '../../components/modal/Modal'
import Sidebar from '../../components/sidebar/SideBar'
import { SocketContactContext } from '../../utils/context/SocketContact'

function App({ children }) {
  // DARK MODE
  const { theme } = useContext(ThemeContext)
  const bgColor = theme === 'light' ? 'bg-white' : 'bg-black'
  const { socketContact, actuallyContactId } = useContext(SocketContactContext)

  console.log()

  return (
    <div className={`container-fluid vh-100 vw-100 p-0 ${bgColor}`}>
      <div className="row vh-100 vw-100 m-0">
        {
          <>
            <Sidebar />
            {/* {JSON.stringify(socketContact) !== '{}' && <Chat />} */}
            {actuallyContactId && <Chat />}
          </>
        }
      </div>
      {/* <!-- Modal --> */}
      <Modal />
    </div>
  )
}

export default App
