import React, { useEffect } from 'react'
import { useContext } from 'react'
import { Outlet } from 'react-router-dom'
import { ThemeContext } from '../../utils/context/ThemeContext'
import Chat from '../../components/chat/Chat'
import Modal from '../../components/modal/Modal'
import Sidebar from '../../components/sidebar/SideBar'
import { SocketContactContext } from '../../utils/context/SocketContact'
import DefaultChat from '../../components/default chat/DefaultChat'
import Calls from '../../components/Calls/Calls'
import Toast from '../../components/Toasts/Toast'
import { useState } from 'react'
import { PeerContext, PeerProvider } from '../../utils/context/PeerContext'
import OffCanvasRight from '../../components/offCanvas/OffCanvasRight'

function App({ children }) {
  // DARK MODE
  const { theme, isCallOpen, isToastOpen } = useContext(ThemeContext)
  const bgColor = theme === 'light' ? 'bg-white' : 'bg-black'
  const { actuallyContactId, myContacts } = useContext(SocketContactContext)
  // throw new Error()

  checkDimensions()

  window.onresize = checkDimensions

  function checkDimensions(prevHeight) {
    // console.log(
    //   'Window dimensions: ' + window.innerWidth + ' x ' + window.innerHeight
    // )
    return window.innerHeight
  }
  return (
    <div
      className={`container-fluid vh-100 vw-100 p-0 ${bgColor}`}
      style={{ height: checkDimensions() }}
    >
      <div className="row vh-100 vw-100 m-0">
        {/* {myContacts && ( */}
        <>
          <Sidebar />
          {actuallyContactId ? <Chat /> : <DefaultChat />}
          {/* toasts */}
          {isToastOpen && <Toast />}
        </>
        {/* )} */}
      </div>
      {/* <!-- Modal --> */}
      <Modal />
      {/* call */}
      {isCallOpen && <Calls />}
      {/* OFF CANVAS */}
      <OffCanvasRight />
    </div>
  )
}

export default App
