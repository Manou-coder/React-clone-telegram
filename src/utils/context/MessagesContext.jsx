import React, { useState, createContext } from 'react'
// import { useEffect } from 'react'

export const MessagesContext = createContext()

export const MessagesContextProvider = ({ children }) => {
  const [arrOfMessages, setArrOfMessages] = useState([])
  const [messageSend, setMessageSend] = useState([])

  return (
    <MessagesContext.Provider
      value={{ arrOfMessages, setArrOfMessages, messageSend, setMessageSend }}
    >
      {children}
    </MessagesContext.Provider>
  )
}
