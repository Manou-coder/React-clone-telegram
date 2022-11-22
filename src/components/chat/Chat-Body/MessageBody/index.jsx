import { useContext, useEffect, useRef } from 'react'
import Message from '../Message'
import socket from '../../../../utils/socket.io'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { ThemeContext } from '../../../../utils/context/ThemeContext'
import { SocketContactContext } from '../../../../utils/context/SocketContact'
import { UserAuth } from '../../../../utils/context/AuthContext'
import { db, readDoc } from '../../../../firebase-config'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { MessagesContext } from '../../../../utils/context/MessagesContext'
import { async } from '@firebase/util'

let firstTime

export default function MesssageBody() {
  const { user } = UserAuth()
  const { isChatOpen } = useContext(ThemeContext)
  const { socketContact, setSocketContact, toggleChange } =
    useContext(SocketContactContext)
  const { arrOfMessages, setArrOfMessages, messageSend, setMessageSend } =
    useContext(MessagesContext)
  const lastMessageRef = useRef(null)
  const [coucou, setCoucou] = useState('')
  const [isLoading, setLoading] = useState(true)

  function addBadgeDateToArr(arr) {
    const newArr = []
    if (arr.length === 1) {
      newArr.push(arr[0])
    }
    for (let i = 0; i < arr.length - 1; i++) {
      const element = arr[i].time
      let date1 = new Date(element)
      let date2 = new Date(arr[i + 1].time)
      // console.log('date1', date1)
      // console.log('date2', date2)
      if (date1.getDate() === date2.getDate()) {
        // console.log('egal')
        newArr.push(arr[i])
      } else {
        // console.log('pas egal')
        newArr.push({ badgeTime: date2.getTime() })
        newArr.push(arr[i])
      }
    }
    newArr.unshift({ badgeTime: new Date(arr[0].time).getTime() })
    // console.log('newArr', newArr)
    return newArr
  }

  async function getAllMessagesFromDB() {
    setLoading(true)
    firstTime = true
    setMessageSend([])
    setArrOfMessages([])
    if (!socketContact.userId) {
      return
    }
    updateHasNewMessages(user.uid, socketContact.userId, 'suppr')
    toggleChange()
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
        console.log('arrMessagesWithHisContact2', arrMessagesWithHisContact)
        socket.emit('update status all messages', {
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

  useEffect(() => {
    socket.on('private message', ({ msg }) => {
      // console.log('msg', msg)
      // console.log('socketContact.userId', socketContact.userId)
      // console.log('msg.from', msg.from)
      if (socketContact.userId === msg.from && isChatOpen) {
        setRead(msg)
      } else {
        setReceived(msg)
      }
      firstTime = false
    })
    return () => {
      socket.off('private message')
    }
  })

  useEffect(() => {
    socket.on('update status all messages server', (data) => {
      // console.log('data3', data)
      if (socketContact.userId === data.from) {
        let newArr = [...arrOfMessages]
        if (data.statusMsg === 'read') {
          for (const msg of newArr) {
            // console.log('msg', msg)
            if (msg.from === user.uid && msg.to === socketContact.userId) {
              // console.log('vrai')
              msg.status = 'read'
            }
          }
          // console.log('newArr', newArr)
        }
        // newArr = addBadgeDateToArr(newArr)
        setArrOfMessages(newArr)
      }
    })
    return () => {
      socket.off('update status all messages server')
    }
  })

  useEffect(() => {
    socket.on('update message', ({ msg }) => {
      //jai pas trop compris a quoi set ce setCoucou mais il est tres important car grasse a lui le changement du svg est direct
      setCoucou(msg)
      // console.log('update msg', msg)
      for (let message of arrOfMessages) {
        if (message.id === msg.id) {
          // console.log(message)
          message.status = msg.status
          // setArrOfMessages(newArrOfMessages)
        }
      }
    })
    return () => {
      socket.off('update message')
    }
  }, [arrOfMessages])

  function setReceived(msg) {
    msg.status = 'received'
    socket.emit('message received', { msg: msg })
    if (msg.from !== socketContact.userId) {
      updateHasNewMessages(user.uid, msg.from, 'add')
      toggleChange()
      return console.log('diffffffffffffffffffffffffffffffff')
    } else {
      // console.log('msg', msg)
      // console.log('msg.content', msg.content)
      setArrOfMessages([...arrOfMessages, ...[msg]])
    }
  }

  function setRead(msg) {
    msg.status = 'read'
    socket.emit('message received', { msg: msg })
    if (msg.from !== socketContact.userId) {
      return console.log('diffffffffffffffffffffffffffffffff')
    } else {
      // console.log('msg', msg)
      // console.log('msg.content', msg.content)
      setArrOfMessages([...arrOfMessages, ...[msg]])
    }
  }

  async function updateHasNewMessages(myId, contactId, operation) {
    const docRef = doc(db, 'users', myId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      // console.log("Document data4:", docSnap.data());
      let myContacts = docSnap.data().myContacts
      //console.log("myContacts:", myContacts);
      for (let contact of myContacts) {
        //console.log("contact: ", contact);
        if (contact.userId === contactId) {
          // console.log('contactId: ', contactId)
          if (operation === 'add') {
            contact.hasNewMessages += 1
          } else if (operation === 'suppr') {
            contact.hasNewMessages = 0
          }
        }
      }
      await updateDoc(docRef, { myContacts: myContacts })
    } else {
      // doc.data() will be undefined in this case
      console.log('No such document!')
    }
  }

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    if (firstTime) {
      lastMessageRef.current?.scrollIntoView(false)
    } else {
      lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messageSend, arrOfMessages])

  // useEffect(() => {
  //   // console.log('arrOfMessages', arrOfMessages)
  //   if (messageSend[messageSend.length - 1] !== undefined) {
  //     if (arrOfMessages.length >= 1) {
  //       if (
  //         messageSend[messageSend.length - 1].id ===
  //         arrOfMessages[arrOfMessages.length - 1].id
  //       ) {
  //         // console.log('------------------égal----------------')
  //         let newArrOfMessages = [...arrOfMessages]
  //         arrOfMessages[arrOfMessages.length - 1].id =
  //           messageSend[messageSend.length - 1].id
  //         setArrOfMessages(newArrOfMessages)
  //         return
  //       }
  //     }

  //     setArrOfMessages([
  //       ...arrOfMessages,
  //       ...[messageSend[messageSend.length - 1]],
  //     ])
  //   }
  //   firstTime = false
  // }, [messageSend])

  let contactInDB

  useEffect(() => {
    socket.on('new user', (arrOfUsers) => {
      console.log('arrOfUsers', arrOfUsers)
      checkIfContactIdHasConnected(arrOfUsers)
    })

    return () => {
      socket.off('new user')
    }
  })

  async function checkIfContactIdHasConnected(arr) {
    const myId = user.uid
    let newUser = {}
    for (const user of arr) {
      // console.log('user', user)
      if (socketContact.userId === user.userId) {
        newUser = user
      }
    }

    const docRef = doc(db, 'usersList', 'usersList')
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      let data = docSnap.data().users
      console.log('Document data:', data)
      let dateInMs = new Date().getTime()
      for (const user of data) {
        // console.log('user data:', user)
        if (socketContact.userId === user.userId) {
          console.log('contact id:', user)
          contactInDB = user
          if (user.isConnect === true || user.isConnect > dateInMs) {
            console.log('connecté')
            const docRef2 = doc(db, 'usersMessages', myId)
            const docSnap2 = await getDoc(docRef2)
            if (docSnap2.exists()) {
              let data2 = docSnap2.data()[socketContact.userId]
              console.log('Document data2:', data2)
              const newArr = setAllMessagesIsReceived(data2)
              updateDoc(docRef2, { [socketContact.userId]: newArr })
            } else {
              console.log('No such document!')
            }
          }
        }
      }
    } else {
      console.log('No such document!')
    }

    if (socketContact.userId === newUser.userId) {
      // console.log('vrai')
      const newArr = setAllMessagesIsReceived(arrOfMessages)
      // newArr = addBadgeDateToArr(newArr)
      setArrOfMessages(newArr)
    }
  }

  function setAllMessagesIsReceived(arr) {
    let dateInMs = new Date().getTime()
    let newArr = [...arr]
    for (const msg of newArr) {
      // console.log('msg', msg)
      if (
        msg.from === user.uid &&
        msg.to === socketContact.userId &&
        msg.status === 'ok'
      ) {
        // console.log('vrai')
        msg.status = 'received'
      }
      console.log('contactInDB', contactInDB)
      if (contactInDB.isConnect > dateInMs) {
        msg.status = 'received'
      }
      // console.log('newArr', newArr)
    }
    return newArr
  }

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
          {/* <div className="w-100" style={{ padding: '12px 0px' }}></div> */}
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
