import { useContext, useEffect, useRef } from 'react'
import Message from '../Message'
import socket from '../../../../utils/socket.io'
import { useState } from 'react'
import { ThemeContext } from '../../../../utils/context/ThemeContext'
import {
  getFromStorage,
  setInStorage,
  SocketContactContext,
} from '../../../../utils/context/SocketContact'
import { UserAuth } from '../../../../utils/context/AuthContext'
import {
  getAllMessagesWhithThisContactFromDB,
  getAllUsersFromDB,
  getMessagesWithThisContact,
  setMessagesWithThisContact,
  updateHasNewMessagesInDB,
  updatetAllMessagesWhithThisContactInDB,
} from '../../../../firebase-config'
import { MessagesContext } from '../../../../utils/context/MessagesContext'
import ButtonScroll from '../../ButtonScroll'

let firstTime

export default function MesssageBody() {
  const { user } = UserAuth()
  const { isChatOpen } = useContext(ThemeContext)
  const { setNewMessages, actuallyContactId } = useContext(SocketContactContext)
  const { arrOfMessages, setArrOfMessages } = useContext(MessagesContext)
  const [isLoading, setLoading] = useState(true)
  const lastMessageRef = useRef(null)

  useEffect(() => {
    if (actuallyContactId && isChatOpen) {
      socket.emit('receiver status is read', {
        from: user.uid,
        to: actuallyContactId,
        statusContact: 'read',
      })

      return () => {
        socket.off('receiver status is read')
      }
    }
  }, [actuallyContactId, isChatOpen])

  async function getAllMessagesFromDB() {
    // check if messages in storage exsists and if yes set them in arrOFMessages
    const allMessagesWhithThisContactFromStorage =
      getFromStorage(actuallyContactId)
    if (allMessagesWhithThisContactFromStorage) {
      const allMessagesWithThisContactFromStorageWithBadge = addBadgeDateToArr(
        allMessagesWhithThisContactFromStorage
      )
      setArrOfMessages(allMessagesWithThisContactFromStorageWithBadge)
    } else {
      // start loading
      setLoading(true)
    }
    // set it's downloaded for the first time (that the scroll is auto and not 'smooth')
    firstTime = true

    // ----------------------------
    // get all messages with this contact from DB
    const allMessagesWithThisContactFromDB =
      await getAllMessagesWhithThisContactFromDB(user.uid, actuallyContactId)
    // console.log('allMessagesFromDB 1', allMessagesWithThisContactFromDB)

    // check if was not messages then stop loading and return
    if (!allMessagesWithThisContactFromDB) {
      console.log('No messages!!!')
      setLoading(false)
      return
    }

    // set this array with status 'read' for all messages that I received
    allMessagesWithThisContactFromDB.forEach((msg) => {
      if (msg.from !== user.uid) {
        msg.status = 'read'
      }
    })
    console.log('allMessagesFromDB 2', allMessagesWithThisContactFromDB)
    // add to this array badge time and update the CHAT with this array
    const allMessagesWithThisContactFromDBWithBadge = addBadgeDateToArr(
      allMessagesWithThisContactFromDB
    )
    setArrOfMessages(allMessagesWithThisContactFromDBWithBadge)

    // update DB with this array
    updatetAllMessagesWhithThisContactInDB(
      user.uid,
      actuallyContactId,
      allMessagesWithThisContactFromDB
    )

    // send my status is 'read' to the contact
    socket.emit('receiver status is read', {
      from: user.uid,
      to: actuallyContactId,
      statusContact: 'read',
    })
    // stop loading
    setLoading(false)
  }

  useEffect(() => {
    if (actuallyContactId) {
      getAllMessagesFromDB()
    }
  }, [actuallyContactId])

  // ---------------------- SOCKETS -----------------------------------------

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

      firstTime = false
    })
    return () => {
      socket.off('private message')
    }
  })

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

  // --------------------------- FUNCTIONS INTERNES -------------------

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

  // --------------------------- SET MESSAGES IN STORAGE --------------------------
  useEffect(() => {
    const arrOfMessagesWithinBadge = arrOfMessages.filter(
      (message) => message.status
    )
    setInStorage(actuallyContactId, arrOfMessagesWithinBadge)
  }, [arrOfMessages])

  // --------------------------- SROLL EFFECT --------------------------
  useEffect(() => {
    if (firstTime) {
      // 👇️ scroll to bottom QUICKLY first time to download all messages
      lastMessageRef.current?.scrollIntoView(false)
    } else {
      // 👇️ scroll to bottom SLOWLY every time messages change
      lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [arrOfMessages])

  return (
    <div
      className={`col h-100`}
      style={{
        overflowY: 'scroll',
        scrollbarWidth: 'none',
        width: '100%',
      }}
    >
      {isLoading ? (
        <div className="w-100 h-100 d-flex justify-content-center align-items-center">
          <div
            className="spinner-border text-primary"
            style={{
              width: '3rem',
              height: '3rem',
            }}
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="container d-flex flex-column" style={{ width: '90%' }}>
          {/* <!-- this div is meant to put a space between the message bubbles and the nav bar --> */}
          <div className="w-100" style={{ padding: '12px 0px' }}></div>
          {/* ------------------------------------MESSAGES-HERE------------------------------------------- */}

          {arrOfMessages.map((e, i) => {
            // console.log('arrOfMessages[i]', arrOfMessages[i])
            return (
              <Message
                from={arrOfMessages[i].from}
                status={arrOfMessages[i].status}
                content={
                  arrOfMessages[i].content + ' ' + i
                  //  + ' ' + arrOfMessages[i].id
                }
                myMessage={arrOfMessages[i].from === user.uid ? true : false}
                time={arrOfMessages[i].time}
                id={arrOfMessages[i].id}
                key={arrOfMessages[i].id}
                badgeTime={arrOfMessages[i].badgeTime}
              />
            )
          })}

          <ButtonScroll lastMessageRef={lastMessageRef} />

          <div className="mt-4" ref={lastMessageRef}></div>

          {/* ------------------------------------MESSAGES-HERE------------------------------------------- */}
          {/* <!-- this div is meant to put a space between the message bubbles and the message bar --> */}
          <div className="w-100" style={{ padding: '1px 0px' }}></div>
        </div>
      )}
    </div>
  )
}

// function qui ajoute des badges de dates au tableau des messages
export function addBadgeDateToArr(arr) {
  // console.log('arr1', arr)
  arr = arr.filter((e) => !e.badgeTime)
  // console.log('arr2', arr)
  const newArr2 = []
  if (arr.length === 0) {
    return newArr2
  }
  if (arr.length === 1) {
    newArr2.push(arr[0])
    // console.log('arr[0]', arr[0])
    newArr2.unshift({
      badgeTime: new Date(arr[0].time).getTime(),
      id: new Date(arr[0].time).getTime(),
    })
    return newArr2
  }
  newArr2.push({
    badgeTime: new Date(arr[0].time).getTime(),
    id: new Date(arr[0].time).getTime(),
  })
  for (let i = 0; i < arr.length - 1; i++) {
    const element = arr[i].time
    let date1 = new Date(element)
    let date2 = new Date(arr[i + 1].time)
    // console.log('element', element)
    // console.log('date1', date1)
    // console.log('date2', date2)
    if (date1.getDate() === date2.getDate()) {
      // console.log('egal')
      newArr2.push(arr[i])
    } else {
      // console.log('pas egal')
      newArr2.push(arr[i])
      newArr2.push({ badgeTime: date2.getTime(), id: date2.getTime() })
    }
  }
  // console.log(newArr2[0].time)
  // newArr2.unshift({ badgeTime: new Date(arr[0].time).getTime() })
  newArr2.push(arr[arr.length - 1])
  // console.log('newArr2', newArr2)
  // return arr
  return newArr2
}

export async function setAllMessagesIsReceivedInDB(
  myId,
  actuallyContactId,
  usersListFromSocket
) {
  // console.log('usersList', usersList)
  console.log('actuallyContactId', actuallyContactId)
  const socketUser = usersListFromSocket.find(
    (user) => actuallyContactId === user.userId
  )
  // console.log('socketUser', socketUser)

  // const usersListFromDB = await getUsersListFromDB()
  const allUsers = await getAllUsersFromDB()
  // console.log('usersListFromDB', usersListFromDB)

  const timeNowInMs = Date.now()
  // console.log('timeNowInMs', timeNowInMs)

  const contactInUsersListFromDB = allUsers.find(
    (user) => actuallyContactId === user.userId
  )
  // console.log('contactInUsersListFromDB', contactInUsersListFromDB)

  let newArr = []
  if (
    socketUser.userId === actuallyContactId ||
    contactInUsersListFromDB.isConnect > timeNowInMs
  ) {
    // console.log('connecté')
    const messagesWithThisContact = await getMessagesWithThisContact(
      myId,
      actuallyContactId
    )
    // console.log('messagesWithThisContact', messagesWithThisContact)
    newArr = setAllMessagesIsReceived(
      myId,
      contactInUsersListFromDB,
      actuallyContactId,
      messagesWithThisContact
    )
    // console.log('newArr', newArr)
    await setMessagesWithThisContact(
      myId,
      actuallyContactId,
      messagesWithThisContact
    )
  }

  if (actuallyContactId === socketUser.userId) {
    return newArr
  }
}

function setAllMessagesIsReceived(myId, contactInDB, actuallyContactId, arr) {
  console.log('arr', arr)
  let dateInMs = new Date().getTime()
  let newArr = [...arr]
  for (const msg of newArr) {
    if (
      msg.from === myId &&
      msg.to === actuallyContactId &&
      msg.status === 'ok'
    ) {
      msg.status = 'received'
    }
    if (
      msg.from === myId &&
      contactInDB.isConnect > dateInMs &&
      msg.status === 'ok'
    ) {
      msg.status = 'received'
    }
  }
  return newArr
}
