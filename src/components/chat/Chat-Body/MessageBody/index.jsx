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
  getAllUsersFromUsersListDB,
  getMessagesWithThisContact,
  setMessagesWithThisContact,
  updateHasNewMessagesInDB,
  updatetAllMessagesWhithThisContactInDB,
} from '../../../../firebase-config'
import { MessagesContext } from '../../../../utils/context/MessagesContext'
import ScrollButton from '../../ScrollButton'

let firstTime

export default function MesssageBody() {
  const { user } = UserAuth()
  const { isChatOpen, messageBarRef, messageBodyRef } = useContext(ThemeContext)
  const { setNewMessages, actuallyContactId } = useContext(SocketContactContext)
  const {
    arrOfMessages,
    setArrOfMessages,
    updateMessageStorage,
    setUpdateMessageStorage,
  } = useContext(MessagesContext)
  const [isLoading, setisLoading] = useState(true)
  const [arrOfSelectedMessages, setArrOfSelectedMessages] = useState([])
  const messagesDiv = useRef(null)
  const lastMessageRef = useRef(null)

  // socket emit if i read all messages
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
      setisLoading(true)
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
      setisLoading(false)
      return
    }

    // set this array with status 'read' for all messages that I received
    allMessagesWithThisContactFromDB.forEach((msg) => {
      if (msg.from !== user.uid) {
        msg.status = 'read'
      }
    })
    // console.log('allMessagesFromDB 2', allMessagesWithThisContactFromDB)
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
    setisLoading(false)
  }

  useEffect(() => {
    if (!actuallyContactId) {
      return
    }
    getAllMessagesFromDB()
  }, [actuallyContactId])

  // --------------------------- SET MESSAGES IN STORAGE AND UPDATE MESSAGE STORAGE--------------------------
  useEffect(() => {
    const arrOfMessagesWithinBadge = arrOfMessages.filter(
      (message) => message.status
    )
    setInStorage(actuallyContactId, arrOfMessagesWithinBadge)
    // IMPORTANT - update for lastMessage in myContact
    setUpdateMessageStorage((curr) => {
      return { ...curr, contactId: actuallyContactId }
    })
  }, [arrOfMessages])

  // --------------------------- SROLL EFFECT --------------------------
  useEffect(() => {
    // console.log('messagesDiv.current', messagesDiv.current)
    if (firstTime && messagesDiv.current) {
      // 👇️ scroll to bottom QUICKLY first time to download all messages
      messagesDiv.current.style.visibility = 'hidden'
      lastMessageRef.current?.scrollIntoView(false)
      setTimeout(() => {
        messagesDiv.current.style.visibility = 'visible'
        firstTime = false
      }, 250)
    } else if (!firstTime && messagesDiv.current) {
      // 👇️ scroll to bottom SLOWLY every time messages change
      lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [arrOfMessages, messagesDiv.current])

  // --------------------------- MESSAGE MOBILE EFFECT --------------------------
  useEffect(() => {
    if (firstTime && messagesDiv.current) {
      // 👇️ scroll to bottom QUICKLY first time to download all messages
      messagesDiv.current.style.visibility = 'hidden'
      lastMessageRef.current?.scrollIntoView(false)
      setTimeout(() => {
        messagesDiv.current.style.visibility = 'visible'
        firstTime = false
      }, 250)
    } else if (!firstTime && messagesDiv.current) {
      // 👇️ scroll to bottom SLOWLY every time messages change
      lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [arrOfMessages, messagesDiv.current])

  return (
    <div
      className={`message-body`}
      style={{
        overflowY: 'scroll',
        scrollbarWidth: 'none',
        height: '100%',
        width: '100%',
      }}
      ref={messageBodyRef}
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
        <div
          className="container d-flex flex-column"
          style={{ width: '90%' }}
          ref={messagesDiv}
        >
          {/* <!-- this div is meant to put a space between the message bubbles and the nav bar --> */}
          <div className="w-100" style={{ padding: '12px 0px' }}></div>
          {/* ------------------------------------MESSAGES-HERE------------------------------------------- */}

          {arrOfMessages.map((e, i) => {
            // console.log('arrOfMessages[i]', arrOfMessages[i])
            return (
              <Message
                from={arrOfMessages[i].from}
                status={arrOfMessages[i].status}
                // content={arrOfMessages[i].content + ' ' + i}
                content={arrOfMessages[i].content}
                myMessage={arrOfMessages[i].from === user.uid ? true : false}
                time={arrOfMessages[i].time}
                messageId={arrOfMessages[i].id}
                type={arrOfMessages[i].type}
                key={arrOfMessages[i].id}
                badgeTime={arrOfMessages[i].badgeTime}
                arrOfSelectedMessages={arrOfSelectedMessages}
                setArrOfSelectedMessages={setArrOfSelectedMessages}
              />
            )
          })}

          <ScrollButton
            lastMessageRef={lastMessageRef}
            messageBodyRef={messageBodyRef}
          />

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
  if (!arr || arr === 'undefined') {
    console.log('no arr!')
    return []
  }
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
  // console.log('actuallyContactId', actuallyContactId)
  const socketUser = usersListFromSocket.find(
    (user) => actuallyContactId === user.userId
  )
  // console.log('socketUser', socketUser)

  // const usersListFromDB = await getUsersListFromDB()
  const allUsers = await getAllUsersFromUsersListDB()
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
  // console.log('arr', arr)
  if (!arr) {
    console.log('probleme a resoudre')
    return
  }
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
