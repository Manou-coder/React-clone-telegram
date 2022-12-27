import React, { useState, createContext, useContext } from 'react'
import { useEffect } from 'react'
import {
  getAllUsersFromDB,
  getHasNewMessagesFromDB,
  getMyCallsFromDB,
  getMyContactsFromDB,
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
  const { setArrOfMessages } = useContext(MessagesContext)
  const [actuallyContactId, setActuallyContactId] = useState('')
  const [allUsers, setAllUsers] = useState(getFromStorage('allUsers', []))
  const [newMessages, setNewMessages] = useState(
    getFromStorage('newMessages', [])
  )
  const [myContacts, setMyContacts] = useState(getFromStorage('myContacts', []))
  const [myCalls, setMyCalls] = useState(getFromStorage('myCalls', []))

  // ----------------------------- ALL USERS --------------------

  // set 'allUsers' whith allUsers in app from DB
  useEffect(() => {
    setAllUsersFromDB()
  }, [])

  // ----------------------------- MY CONTACTS --------------------

  // get and set 'MyContacts' from DB for the first time
  useEffect(() => {
    if (user !== null) {
      setMyContactsFromDB(user.uid, setMyContacts)
    }
  }, [user])

  // ----------------------------- MY CALLS --------------------

  // get and set 'MyContacts' from DB for the first time
  useEffect(() => {
    if (user !== null) {
      setMyCallsFromDB(user.uid, setMyCalls)
    }
  }, [user])

  // ----------------------------- HAS NEW MESSAGES --------------------

  // set 'newmessages' whith newmessages from DB
  useEffect(() => {
    if (user !== null) {
      setNewMessagesInChatFromDB(user.uid)
    }
  }, [user])

  // --------------------- SOCKET --------------------------------------------

  // create socket.io client side and send 'user.uid' as 'userName'
  useEffect(() => {
    if (user !== null) {
      startSocket(user.uid)
    }
  }, [user])

  // when a user disconnect of the app so update 'allUsers' within this user
  useEffect(() => {
    socket.on('user disonnected', ({ contactId, usersList }) => {
      setContactIsDisconnectInAllUsers(contactId, setAllUsers)
    })
    return () => {
      socket.off('user disonnected')
    }
  })

  // Update IsTyping
  useEffect(() => {
    socket.on('typingResponse', ({ contactId, typingStatus }) => {
      setContactIsTypingInAllUsers(contactId, typingStatus, setAllUsers)
    })
    return () => {
      socket.off('typingResponse')
    }
  })

  // SOCKET - update new user
  useEffect(() => {
    socket.on('new user', ({ contactId, usersList }) => {
      // it's me, so nothing to do !!!!
      if (contactId === user.uid) {
        return
      }
      // update connection status of new user only in CHAT not in DB (because in the backend the new user has already been added in the DB)
      setAllUsersWithNewUserIsConnected(contactId)
      // update all the messages that I sent to this new user, to 'received' status because he is connected now (in DB and in CHAT)
      setAllMessagesIsReceivedInDBAndInChat(contactId, usersList)
    })

    return () => {
      socket.off('new user')
    }
  })

  // -------------------------- Functions Internes ------------------------------

  async function setAllUsersFromDB() {
    const allUsers = await getAllUsersFromDB()
    console.log('allUsers', allUsers)
    setInStorage('allUsers', allUsers)
    setAllUsers((curr) => {
      curr = JSON.parse(JSON.stringify(allUsers))
      return curr
    })
  }

  async function setMyContactsFromDB(myId, setMyContacts) {
    const myContactsFromDB = await getMyContactsFromDB(myId)
    // console.log('myContactsFromDB', myContactsFromDB)
    setInStorage('myContacts', myContactsFromDB)
    setMyContacts(myContactsFromDB)
  }

  async function setMyCallsFromDB(myId, setMyCalls) {
    const myCallsFromDB = await getMyCallsFromDB(myId)
    // console.log('myCallsFromDB', myCallsFromDB)
    if (myCallsFromDB) {
      setInStorage('myCalls', myCallsFromDB)
      setMyCalls(myCallsFromDB)
    } else {
      setInStorage('myCalls', [])
      setMyCalls([])
    }
  }

  function updateMyCallsInChat(call) {
    const callsList = [...myCalls]
    // check if call exists
    let sameCall = callsList.find((element) => element.id === call.id)
    console.log('sameCall', sameCall)
    // if it exists so modify it else add this call to callsList
    if (sameCall) {
      sameCall = call
    } else {
      callsList.unshift(call)
    }
    setInStorage('myCalls', callsList)
    setMyCalls(callsList)
  }

  async function setNewMessagesInChatFromDB(myId) {
    const newMessages = await getHasNewMessagesFromDB(myId)
    // console.log('newMessages', newMessages)
    setInStorage('newMessages', newMessages)
    setNewMessages(newMessages)
  }

  async function setAllMessagesIsReceivedInDBAndInChat(contactId, usersList) {
    // set all messages whith 'ok' status to 'received' status in DB
    const arrMessagesReceived = await setAllMessagesIsReceivedInDB(
      user.uid,
      contactId,
      usersList
    )
    // add Badge to 'arrMessagesReceived' and set 'arrOfMessages' in the CHAT whith this
    const arrMessagesReceivedWithBadge = addBadgeDateToArr(arrMessagesReceived)
    setAllMessagesIsReceivedInChat(
      contactId,
      actuallyContactId,
      arrMessagesReceivedWithBadge,
      setArrOfMessages
    )
  }

  function setAllUsersWithNewUserIsConnected(contactId) {
    setAllUsers((curr) => {
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
        actuallyContactId,
        setActuallyContactId,
        allUsers,
        setAllUsers,
        myContacts,
        setMyContacts,
        newMessages,
        setNewMessages,
        setAllUsersFromDB,
        myCalls,
        setMyCalls,
        updateMyCallsInChat,
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

function setContactIsDisconnectInAllUsers(contactId, setAllUsers) {
  setAllUsers((curr) => {
    const contactOffline = curr.find((user) => user.userId === contactId)
    contactOffline.isConnect = Date.now()
    console.log('contactOffline', contactOffline)
    curr = JSON.parse(JSON.stringify(curr))
    return curr
  })
}

function setContactIsTypingInAllUsers(contactId, typingStatus, setAllUsers) {
  setAllUsers((curr) => {
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

export function getFromStorage(item, defaultItem) {
  item = localStorage.getItem(item)
  // if item is Object so it's parse it else nothig to do
  try {
    item = JSON.parse(item)
  } catch (error) {}
  // if item is not 'null' return item else return defaultItem
  if (item) {
    // console.log('item', item)
    return item
  } else {
    // console.log('defaultItem', defaultItem)
    return defaultItem
  }
}

export function setInStorage(key, item) {
  item = JSON.stringify(item)
  return localStorage.setItem(key, item)
}
