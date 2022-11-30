import { useContext, useEffect, useRef } from 'react'
import Message from '../Message'
import socket from '../../../../utils/socket.io'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { ThemeContext } from '../../../../utils/context/ThemeContext'
import { SocketContactContext } from '../../../../utils/context/SocketContact'
import { UserAuth } from '../../../../utils/context/AuthContext'
import {
  db,
  getAllUsersFromDB,
  getMessagesWithThisContact,
  getUsersListFromDB,
  readDoc,
  setMessagesWithThisContact,
  updateHasNewMessagesInDB,
} from '../../../../firebase-config'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { MessagesContext } from '../../../../utils/context/MessagesContext'
import { async } from '@firebase/util'

let firstTime

export default function MesssageBody() {
  const { user } = UserAuth()
  const { isChatOpen } = useContext(ThemeContext)
  const { socketContact, setMyContacts, actuallyContactid } =
    useContext(SocketContactContext)
  const { arrOfMessages, setArrOfMessages, messageSend, setMessageSend } =
    useContext(MessagesContext)
  const [isLoading, setLoading] = useState(true)
  const lastMessageRef = useRef(null)

  async function getAllMessagesFromDB() {
    setLoading(true)
    firstTime = true
    setMessageSend([])
    setArrOfMessages([])
    // if (!socketContact.userId) {
    //   return
    // }
    if (!actuallyContactid) {
      return
    }
    // updateHasNewMessagesInDB(user.uid, socketContact.userId, 'suppr')
    // toggleChange()
    const docRef = doc(db, 'usersMessages', user.uid)
    const docRef2 = doc(db, 'usersMessages', socketContact.userId)
    // console.log('socketContact.userId', socketContact.userId)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      let arrMessagesWithHisContact = docSnap.data()[socketContact.userId]
      if (arrMessagesWithHisContact) {
        // console.log('arrMessagesWithHisContact', arrMessagesWithHisContact)
        for (const msg of arrMessagesWithHisContact) {
          // console.log('msg', msg)
          if (msg.to === user.uid && msg.from === socketContact.userId) {
            // console.log('vrai')
            msg.status = 'read'
          }
        }
        // console.log('arrMessagesWithHisContact2', arrMessagesWithHisContact)
        socket.emit('update contact status from client', {
          from: user.uid,
          to: socketContact.userId,
          statusMsg: 'read',
        })
        await updateDoc(docRef2, {
          [user.uid]: arrMessagesWithHisContact,
        })
        firstTime = true
        // setArrOfMessages(arrMessagesWithHisContact)
        const newArr = addBadgeDateToArr(arrMessagesWithHisContact)
        // console.log('newArr', newArr)
        setArrOfMessages(newArr)
        setLoading(false)
      } else {
        setArrOfMessages([])
        setLoading(false)
      }
      return docSnap.data()
    } else {
      console.log('No such document!')
      setLoading(false)
    }
  }

  useEffect(() => {
    if (socketContact !== '{}') {
      getAllMessagesFromDB()
      // setLoading(false)
    }
  }, [socketContact])

  // SOCKET - receives the message sent by the contact and sends back to the server my status about this message (if I have read it or just received it)
  useEffect(() => {
    socket.on('private message', ({ msg }) => {
      // console.log('msg', msg)

      function checkMyStatus() {
        if (socketContact.userId === msg.from && isChatOpen) {
          console.log('read')
          setRead(msg)
        } else if (socketContact.userId === msg.from && !isChatOpen) {
          console.log('received whit chat is closed')
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

  // SOCKET - update status all messages of chat when status contact changed
  useEffect(() => {
    socket.on('update contact status from server', (data) => {
      if (socketContact.userId === data.from) {
        let newArr = [...arrOfMessages]
        if (data.statusMsg === 'read') {
          for (const msg of newArr) {
            if (msg.from === user.uid && msg.to === socketContact.userId) {
              msg.status = 'read'
            }
          }
        }
        setArrOfMessages(newArr)
      }
    })
    return () => {
      socket.off('update contact status from server')
    }
  })

  // SOCKET - update status of each message (if the message has been sent to the server or if the contact has read or received the message )
  useEffect(() => {
    socket.on('update message', ({ msg }) => {
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
      socket.off('update message')
    }
  })

  // --------------------------- FUNCTIONS INTERNES -------------------

  function setReceived(msg) {
    msg.status = 'received'
    socket.emit('message received', { msg: msg })
    // updateHasNewMessagesInDB(user.uid, msg.from, 'add')
    updateHasNewMessagesInMyContacts(msg.from, setMyContacts)
    setArrOfMessages([...arrOfMessages, ...[msg]])
  }

  function setRead(msg) {
    msg.status = 'read'
    socket.emit('message received', { msg: msg })
    setArrOfMessages([...arrOfMessages, ...[msg]])
  }

  // --------------------------- SROLL EFFECT --------------------------
  useEffect(() => {
    if (firstTime) {
      // 👇️ scroll to bottom QUICKLY first time to download all messages
      lastMessageRef.current?.scrollIntoView(false)
    } else {
      // 👇️ scroll to bottom SLOWLY every time messages change
      lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messageSend, arrOfMessages])

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
    newArr2.unshift({ badgeTime: new Date(arr[0].time).getTime() })
    return newArr2
  }
  newArr2.push({ badgeTime: new Date(arr[0].time).getTime() })
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
      newArr2.push({ badgeTime: date2.getTime() })
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
  socketContactId,
  usersListFromSocket
) {
  // console.log('usersList', usersList)
  console.log('socketContactId', socketContactId)
  const socketUser = usersListFromSocket.find(
    (user) => socketContactId === user.userId
  )
  // console.log('socketUser', socketUser)

  // const usersListFromDB = await getUsersListFromDB()
  const allUsers = await getAllUsersFromDB()
  // console.log('usersListFromDB', usersListFromDB)

  const timeNowInMs = Date.now()
  // console.log('timeNowInMs', timeNowInMs)

  const contactInUsersListFromDB = allUsers.find(
    (user) => socketContactId === user.userId
  )
  // console.log('contactInUsersListFromDB', contactInUsersListFromDB)

  let newArr = []
  if (
    socketUser.userId === socketContactId ||
    contactInUsersListFromDB.isConnect > timeNowInMs
  ) {
    // console.log('connecté')
    const messagesWithThisContact = await getMessagesWithThisContact(
      myId,
      socketContactId
    )
    // console.log('messagesWithThisContact', messagesWithThisContact)
    newArr = setAllMessagesIsReceived(
      myId,
      contactInUsersListFromDB,
      socketContactId,
      messagesWithThisContact
    )
    // console.log('newArr', newArr)
    await setMessagesWithThisContact(
      myId,
      socketContactId,
      messagesWithThisContact
    )
  }

  if (socketContactId === socketUser.userId) {
    return newArr
  }
}

function setAllMessagesIsReceived(myId, contactInDB, socketContactId, arr) {
  let dateInMs = new Date().getTime()
  let newArr = [...arr]
  for (const msg of newArr) {
    if (
      msg.from === myId &&
      msg.to === socketContactId &&
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

function updateHasNewMessagesInMyContacts(contactId, setMyContacts) {
  setMyContacts((curr) => {
    const contact = curr.find((user) => user.userId === contactId)
    contact.hasNewMessages += 1
    return curr
  })
}
