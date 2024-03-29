import React, { useState, createContext } from 'react'

export const MessagesContext = createContext()

export const MessagesContextProvider = ({ children }) => {
  const [arrOfMessages, setArrOfMessages] = useState([])
  const [messageSend, setMessageSend] = useState([])
  const [updateMessageStorage, setUpdateMessageStorage] = useState(null)
  const [imageToDisplay, setImageToDisplay] = useState({ name: '', src: '' })

  return (
    <MessagesContext.Provider
      value={{
        arrOfMessages,
        setArrOfMessages,
        messageSend,
        setMessageSend,
        updateMessageStorage,
        setUpdateMessageStorage,
        imageToDisplay,
        setImageToDisplay,
      }}
    >
      {children}
    </MessagesContext.Provider>
  )
}
