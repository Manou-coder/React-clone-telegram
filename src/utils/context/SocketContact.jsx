import React, { useState, createContext, useContext } from 'react'
import { useEffect } from 'react'
import {
  getAllUsersFromDB,
  getHasNewMessagesFromDB,
} from '../../firebase-config'
import { UserAuth } from './AuthContext'
import socket from '../socket.io'
import {
  addBadgeDateToArr,
  setAllMessagesIsReceivedInDB,
} from '../../components/chat/Chat-Body/MessageBody'
import { MessagesContext } from './MessagesContext'

export const SocketContactContext = createContext()

export const SocketContactProvider = ({ children }) => {
  // --------------------------------------------------------------------------------
  const { user } = UserAuth()
  const [socketContact, setSocketContact] = useState({})
  const [actuallyContactId, setActuallyContactId] = useState(
    getFromStorage('actuallyContactId')
  )
  const [allUsers, setAllUsers] = useState(getFromStorage('allUsers'))
  const [newMessages, setNewMessages] = useState(getFromStorage('newMessages'))
  const [myContacts, setMyContacts] = useState(getFromStorage('myContacts'))
  const { setArrOfMessages } = useContext(MessagesContext)

  // -----------------  SOCKET CONTACT "ID" WITH LOCALE STORAGE

  // useEffect(() => {
  //   const actuallyContactId = localStorage
  // }, [allUsers])

  // ------------- SOCKET CONTACT WITH URL

  // Get the UserName Of SocketContact from URL
  const userNameOfContact = getUserNameOfContactFromURL()

  // Change the 'socketContact' to each URL changed from'AllUsers'
  useEffect(() => {
    if (allUsers && allUsers.length > 0) {
      setSocketContactFromAllUsers(
        userNameOfContact,
        setSocketContact,
        allUsers
      )
    }
  }, [userNameOfContact, allUsers])

  // ----------------------------- ALL USERS --------------------

  // set 'allUsers' whith allUsers in app from DB
  useEffect(() => {
    setAllUsersFromDB()
  }, [])

  // ----------------------------- HAS NEW MESSAGES --------------------

  // set 'newmessages' whith newmessages from DB
  useEffect(() => {
    if (user !== null) {
      setNewMessagesFromDB(user.uid)
    }
  }, [user])

  // --------------------- SOCKET --------------------------------------------

  // create socket.io client side and send 'user.uid' as 'userName'
  useEffect(() => {
    if (user !== null) {
      startSocket(user.uid)
    }
  }, [user])

  // when a user disconnect of the app so update 'allUsers' wthin this user
  useEffect(() => {
    socket.on('user disonnected', ({ contactId, usersList }) => {
      // setContactIsDisconnectInMyContacts(contactId, setMyContacts)
      setContactIsDisconnectInMyContacts(contactId, setAllUsers)
    })
    return () => {
      socket.off('user disonnected')
    }
  })

  // Update IsTyping
  useEffect(() => {
    socket.on('typingResponse', ({ contactId, typingStatus }) => {
      setContactIsTypingInMyContacts(contactId, typingStatus, setMyContacts)
    })
    return () => {
      socket.off('typingResponse')
    }
  })

  // Update New User
  useEffect(() => {
    socket.on('new user', ({ contactId, usersList }) => {
      if (contactId === user.uid) {
        // console.log("It's me!!!")
        return
      }
      setMyContactsWithNewUserIsConnected(contactId)
      setAllMessagesIsReceivedInDBAndInChat(contactId, usersList)
    })

    return () => {
      socket.off('new user')
    }
  })

  // -------------------------- Functions Internes ------------------------------

  async function setAllUsersFromDB() {
    const allUsers = await getAllUsersFromDB()
    // console.log('allUsers', allUsers)
    setInStorage('allUsers', allUsers)
    setAllUsers(allUsers)
  }

  async function setNewMessagesFromDB(myId) {
    const newMessages = await getHasNewMessagesFromDB(myId)
    // console.log('newMessages', newMessages)
    setInStorage('newMessages', newMessages)
    setNewMessages(newMessages)
  }

  async function setAllMessagesIsReceivedInDBAndInChat(contactId, usersList) {
    // set all messages whith 'ok' status to 'received' status
    const arrMessagesReceived = await setAllMessagesIsReceivedInDB(
      user.uid,
      contactId,
      usersList
    )
    // console.log('newArr5', arrMessagesReceived)
    // add Badge to 'arrMessagesReceived'
    const arrMessagesReceivedWithBadge = addBadgeDateToArr(arrMessagesReceived)
    // set 'arrOfMessages' in the chat whith the new arr of messages
    setAllMessagesIsReceivedInChat(
      contactId,
      socketContact.userId,
      arrMessagesReceivedWithBadge,
      setArrOfMessages
    )
  }

  function setMyContactsWithNewUserIsConnected(contactId) {
    setMyContacts((curr) => {
      for (const contact of curr) {
        if (contact.userId === contactId) {
          contact.isConnect = true
        }
      }
      curr = JSON.parse(JSON.stringify(curr))
      return curr
    })
  }

  return (
    <SocketContactContext.Provider
      value={{
        socketContact,
        setSocketContact,
        actuallyContactId,
        setActuallyContactId,
        allUsers,
        setAllUsers,
        myContacts,
        setMyContacts,
        newMessages,
        setNewMessages,
        setAllUsersFromDB,
      }}
    >
      {children}
    </SocketContactContext.Provider>
  )
}

// -------------------- FUNCTIONS ---------------------

function startSocket(userName) {
  const username = userName
  socket.auth = { username }
  socket.connect()
}

function getUserNameOfContactFromURL() {
  let str = window.location.href
  let url = new URL(str)
  let pathname = url.pathname
  let arrPathname = pathname.split('/')
  return arrPathname[arrPathname.length - 1]
}

function setContactIsDisconnectInMyContacts(contactId, setAllUsers) {
  // setMyContacts((curr) => {
  //   for (const contact of curr) {
  //     if (contact.userId === contactId) {
  //       contact.isConnect = Date.now()
  //     }
  //   }
  //   curr = JSON.parse(JSON.stringify(curr))
  //   return curr
  // })
  setAllUsers((curr) => {
    const contactOffline = curr.find((user) => user.userId === contactId)
    contactOffline.isConnect = Date.now()
    console.log('contactOffline', contactOffline)
    return curr
  })
}

function setContactIsTypingInMyContacts(
  contactId,
  typingStatus,
  setMyContacts
) {
  setMyContacts((curr) => {
    for (const contact of curr) {
      if (contact.userId === contactId) {
        contact.isTyping = typingStatus
      }
    }
    curr = JSON.parse(JSON.stringify(curr))
    // console.log('curr', curr)
    return curr
  })
}

async function setSocketContactFromAllUsers(
  userNameOfContact,
  setSocketContact,
  allUsers
) {
  const socketContact = allUsers.find(
    (user) => user.userName === userNameOfContact
  )
  // console.log('socketContact', socketContact)
  setSocketContact(socketContact)
}

function setAllMessagesIsReceivedInChat(
  contactId,
  socketCOntactId,
  arr,
  setArrOfMessages
) {
  if (socketCOntactId === contactId) {
    setArrOfMessages(arr)
  }
}

export function setActuallyContactIdInStorage(contactId) {
  localStorage.setItem('actuallyContactId', contactId)
}

export function getActuallyContactIdFromStorage() {
  localStorage.getItem('actuallyContactId')
}

export function getFromStorage(item) {
  item = localStorage.getItem(item)
  try {
    item = JSON.parse(item)
  } catch (error) {}
  // console.log('item ' + item, item)
  return item
}

export function setInStorage(key, item) {
  item = JSON.stringify(item)
  return localStorage.setItem(key, item)
}
