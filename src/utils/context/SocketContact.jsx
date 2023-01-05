import React, {
  useState,
  createContext,
  useContext,
  useLayoutEffect,
} from 'react'
import { useEffect } from 'react'
import {
  getAllMessagesWhithThisContactFromDB,
  getAllUsersFromUsersListDB,
  getHasNewMessagesFromDB,
  getMyCallsFromDB,
  getMyContactsFromDB,
  updateHasNewMessagesInDB,
  updateMyContactsInDB,
} from '../../firebase-config'
import { UserAuth } from './AuthContext'
import socket from '../socket.io'
import {
  addBadgeDateToArr,
  setAllMessagesIsReceivedInDB,
} from '../../components/chat/Chat-Body/MessageBody'
import { MessagesContext } from './MessagesContext'
import { useNavigate } from 'react-router-dom'
import { addThisContactIdInMyContactsDB } from '../../components/sidebar/SideBar-Body/Contact'
import { ThemeContext } from './ThemeContext'

export const SocketContactContext = createContext()

// eslint-disable-next-line no-unused-vars
let firstTime

export const SocketContactProvider = ({ children }) => {
  const navigate = useNavigate()
  // --------------------------------------------------------------------------------
  const { user, isProfileCreated, setUser } = UserAuth()
  const { isChatOpen, messageBarRef, messageBodyRef } = useContext(ThemeContext)
  const { setArrOfMessages, arrOfMessages, setUpdateMessageStorage } =
    useContext(MessagesContext)
  const [actuallyContactId, setActuallyContactId] = useState('')
  const [allUsers, setAllUsers] = useState(getFromStorage('allUsers', []))
  const [newMessages, setNewMessages] = useState(
    getFromStorage('newMessages', [])
  )
  const [myContacts, setMyContacts] = useState(getFromStorage('myContacts', []))
  const [myCalls, setMyCalls] = useState(getFromStorage('myCalls', []))

  // ----------------------------- ALL USERS --------------------

  useEffect(() => {
    if (!user) return
    const myIdInStorage = getFromStorage('myId')
    console.log('myIdInStorage', myIdInStorage)
    if (!myIdInStorage) return setInStorage('myId', user.uid)
    if (myIdInStorage !== user.uid) {
      localStorage.clear()
      setUser((curr) => JSON.parse(JSON.stringify(curr)))
    }
  }, [user])

  // ----------------------------- ALL USERS --------------------

  // set 'allUsers' whith allUsers in app from DB
  useEffect(() => {
    // console.log('isProfileCreated', isProfileCreated)
    if (user && isProfileCreated && actuallyContactId === '') {
      // navigate to / (its good for mobile)
      // *******************************************************
      // **********************************************************
      // ************************************************************
      // IMPORTANT REGLER CA POUR LA NAVIGATION MOBILE
      // navigate('/')
    }
  }, [user])

  // ----------------------------- ALL USERS --------------------

  // set 'allUsers' whith allUsers in app from DB
  useEffect(() => {
    if (user !== null) {
      setAllUsersFromDB()
    }
  }, [user])

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

  // -------------------------- Has new messages add contact in my contact -------------

  useEffect(() => {
    if (!user || !allUsers || !newMessages || !myContacts) return
    addContactInMyContactsIfHasNewMessages(user.uid)
  }, [allUsers, newMessages])

  // --------------------- SOCKET --------------------------------------------

  // create socket.io client side and send 'user.uid' as 'userName'
  useEffect(() => {
    if (user !== null) {
      startSocket(user.uid)
    } else {
      socket.close()
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

  // ----------------- DOWNLOAD ALL USERS MESSAGES

  useEffect(() => {
    if (!user || !myContacts) return
    if (myContacts.length <= 0) return
    console.log(
      'kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk'
    )
    console.log('myContacts', myContacts)
    getAllUsersMessagesAndSetInStorage()
  }, [user, myContacts])

  // ---------------------- SOCKETS MESSAGE BODY -----------------------------------------

  // SOCKET - receives the message sent by the contact and sends back to the server my status about this message (if I have read it or just received it)
  useEffect(() => {
    socket.on('private message', ({ msg }) => {
      console.log('msg', msg)

      function checkMyStatus() {
        if (actuallyContactId === msg.from && isChatOpen) {
          console.log('read')
          setRead(msg)
        } else if (actuallyContactId === msg.from || !isChatOpen) {
          console.log('received whith chat is closed')
          setReceived(msg)
        } else {
          console.log('different user')
          setReceived(msg)
        }
      }
      checkMyStatus()

      // update in localStorage
      const allMessagesWhithThisContactFromStorage = getFromStorage(msg.from)
      if (allMessagesWhithThisContactFromStorage) {
        allMessagesWhithThisContactFromStorage.push(msg)
      }
      setInStorage(msg.from, allMessagesWhithThisContactFromStorage)
      // update for lastMessage in myContact
      setUpdateMessageStorage((curr) => {
        return { ...curr, contactId: msg.from }
      })

      firstTime = false
    })
    return () => {
      socket.off('private message')
    }
  }, [user])

  // SOCKET - update status all messages that I send on CHAT to 'read' when status contact read my messages (but the change in the db is done in the backend)
  useEffect(() => {
    socket.on('update receiver status is read', (contact) => {
      // check if the actually contact is the same of the contact was send 'update receiver status is read'
      // and if not the same return (and the next time I will chat with this contact the change will have already been made in the db )
      if (contact.from !== actuallyContactId) {
        console.log(
          "the contact who updated their status to 'read' is not the same as actually contact"
        )
        return
      }
      // update status all messages that I send on CHAT to 'read'
      updateAllMessagesToReadStatusInChat()
    })
    return () => {
      socket.off('update receiver status is read')
    }
  })

  // SOCKET - update status of each message (if the message has been sent to the server or if the contact has read or received the message )
  useEffect(() => {
    socket.on('update this message status', ({ msg }) => {
      console.log('msg', msg)
      const copyOfArrOfMessages = JSON.parse(JSON.stringify(arrOfMessages))
      const messageToUpdate = copyOfArrOfMessages.find(
        (message) => message.id === msg.id
      )
      messageToUpdate.status = msg.status
      const copyOfArrOfMessagesWithBadge =
        addBadgeDateToArr(copyOfArrOfMessages)
      setArrOfMessages(copyOfArrOfMessagesWithBadge)
    })
    return () => {
      socket.off('update this message status')
    }
  })

  // -------------------------- Functions Internes ------------------------------

  async function setAllUsersFromDB() {
    const allUsers = await getAllUsersFromUsersListDB()
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

  function updateMyContactsInDBAndStorage(myId, myContacts) {
    setInStorage('myContacts', myContacts)
    updateMyContactsInDB(myId, myContacts)
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

  async function addContactInMyContactsIfHasNewMessages(myId) {
    for (const userId in newMessages) {
      if (newMessages[userId]) {
        // check if this contact has not yet in myContacts and if not so add this to myContacts (in DB and in 'myContacts)
        if (myContacts.includes(userId)) {
          return
        } else {
          addThisContactIdInMyContactsDB(user.uid, userId, myContacts)
          setMyContacts((curr) => {
            curr.push(userId)
            return curr
          })
        }
      }
    }
  }

  async function getAllUsersMessagesAndSetInStorage() {
    for (const contactId of myContacts) {
      // console.log('contactId', contactId)
      const allMessagesWhithThisContact =
        await getAllMessagesWhithThisContactFromDB(user.uid, contactId)
      // console.log('allMessagesWhithThisContact', allMessagesWhithThisContact)
      setInStorage(contactId, allMessagesWhithThisContact)
      setUpdateMessageStorage((curr) => {
        return { ...curr, contactId: contactId }
      })
    }
  }

  // --------------------------- FUNCTIONS INTERNES MESSAGE BODY -------------------

  function setReceived(msg) {
    msg.status = 'received'
    socket.emit('message read or received', { msg: msg })
    // if message is recived and not read update has new messages to contact id 'msg.from'
    updateHasNewMessagesInDB(user.uid, msg.from, 'add')
    setNewMessages((curr) => {
      curr[msg.from] += 1
      curr = JSON.parse(JSON.stringify(curr))
      return curr
    })
  }

  function setRead(msg) {
    msg.status = 'read'
    socket.emit('message read or received', { msg: msg })
    // TO DO§!!! add badge time
    setArrOfMessages([...arrOfMessages, ...[msg]])
  }

  function updateAllMessagesToReadStatusInChat() {
    // console.log('arrOfMessages', arrOfMessages)
    // remove all badges from 'arrOfMessages' and return arr with only messages
    const arrWhitinBadge = arrOfMessages.filter((mesage) => mesage.status)
    // console.log('arrWhitinBadge', arrWhitinBadge)
    // return arr whith only my messages
    const arrOfMyMessages = arrWhitinBadge.filter(
      (mesage) => mesage.from === user.uid
    )
    // console.log('arrOfMyMessages', arrOfMyMessages)
    // verify if all messages that I send was read by the contact
    const isAllMessagesRead = arrOfMyMessages.every(
      (message) => message.status === 'read'
    )
    // console.log('isAllMessagesRead', isAllMessagesRead)
    // if all messages was not read by the contact then update a new arr of messages whith status read for each message that I send
    if (!isAllMessagesRead) {
      arrWhitinBadge.forEach((message) => {
        if (message.from === user.uid) {
          message.status = 'read'
        }
      })
    }
    // add badge to this arr of messages and set the 'arrOfMessages' whith this arr
    const arrWhithBadge = addBadgeDateToArr(arrWhitinBadge)
    setArrOfMessages(arrWhithBadge)
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
        updateMyContactsInDBAndStorage,
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
    if (!contactOffline) {
      return curr
    }
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
