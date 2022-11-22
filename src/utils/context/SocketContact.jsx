import React, { useState, createContext } from 'react'
import { useEffect } from 'react'
import { readAllUsers } from '../../firebase-config'
import io from 'socket.io-client'
import { UserAuth } from './AuthContext'
import socket from '../socket.io'

export const SocketContactContext = createContext()

const startSocket = (userName) => {
  const username = userName
  socket.auth = { username }
  socket.connect()
}

export const SocketContactProvider = ({ children }) => {
  const { user } = UserAuth()

  // create socket.io client side

  useEffect(() => {
    // console.log('-------user--------', user)
    if (user !== null) {
      startSocket(user.uid)
    }

    let usersList

    socket.on('users', (users) => {
      // console.log('users', users)
      users.forEach((user) => {
        user.self = user.userID === socket.id
        console.log('user', user)
        console.log('user.self', user.self)
      })
      // put the current user first, and then sort by username
      usersList = users.sort((a, b) => {
        if (a.self) return -1
        if (b.self) return 1
        if (a.username < b.username) return -1
        return a.username > b.username ? 1 : 0
      })
      console.log('usersList', usersList)
    })

    socket.on('user connected', (user) => {
      usersList.push(user)
    })

    return () => {
      socket.off('connect_error')
      socket.off('users')
    }
  }, [])

  const [socketContact, setSocketContact] = useState({})
  const [allUsers, setAllUsers] = useState({})
  const [isChange, setIsChange] = useState(false)

  const toggleChange = () => (isChange ? setIsChange(false) : setIsChange(true))

  let str = window.location.href
  let url = new URL(str)
  let pathname = url.pathname
  let arrPathname = pathname.split('/')
  let userNameOfContact = arrPathname[arrPathname.length - 1]

  useEffect(() => {
    getSocketContact()
  }, [userNameOfContact])

  async function getSocketContact() {
    let allContacts = await getAllUsers()
    for (const user of allContacts) {
      if (user.userName === userNameOfContact) {
        // console.log('user', user)
        setSocketContact(user)
      }
    }
  }

  async function updateSocketContact() {
    socket.on('update users', (msg) => {
      console.log('update', msg)
      getAllUsers()
    })
  }
  updateSocketContact()

  async function getAllUsers() {
    let allContacts = await readAllUsers()
    allContacts = allContacts.users
    // console.log('allContacts', allContacts)
    setAllUsers(allContacts)
    return allContacts
  }

  socket.on('new user', (users) => {
    // console.log('users', users)
    setTimeout(() => {
      toggleChange()
    }, 2000)
  })

  socket.on('user disonnected', (users) => {
    // console.log('users', users)
    setTimeout(() => {
      toggleChange()
    }, 2000)
  })

  return (
    <SocketContactContext.Provider
      value={{
        socketContact,
        setSocketContact,
        allUsers,
        setAllUsers,
        toggleChange,
        isChange,
      }}
    >
      {children}
    </SocketContactContext.Provider>
  )
}
