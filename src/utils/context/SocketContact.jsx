import { async } from '@firebase/util'
import React, { useState, createContext } from 'react'
import { useEffect } from 'react'
import { readAllUsers } from '../../firebase-config'
import socket from '../socket.io'

export const SocketContactContext = createContext()

export const SocketContactProvider = ({ children }) => {
  const [socketContact, setSocketContact] = useState({})
  const [allUsers, setAllUsers] = useState({})

  useEffect(() => {
    getSocketContact()
  }, [window.location.href, socket])

  async function getSocketContact() {
    let str = window.location.href
    let url = new URL(str)
    let pathname = url.pathname
    let arrPathname = pathname.split('/')
    let userNameOfContact = arrPathname[arrPathname.length - 1]
    // console.log('userNameOfContact', userNameOfContact)

    // let allContacts = await readAllUsers()
    // allContacts = allContacts.users
    // setAllUsers(allContacts)
    // console.log('allContacts', allContacts)

    let allContacts = await getAllUsers()
    // console.log('allContacts', allContacts)

    for (const user of allContacts) {
      // console.log('e', e)
      if (user.userName === userNameOfContact) {
        // console.log('mami', user)
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
    console.log('allContacts', allContacts)
    setAllUsers(allContacts)
    return allContacts
  }

  socket.on('new user', (users) => {
    // console.log('users', users)
    setTimeout(() => {
      getSocketContact()
    }, 2000)
  })

  socket.on('user disonnected', (users) => {
    // console.log('users', users)
    setTimeout(() => {
      getSocketContact()
    }, 2000)
  })

  return (
    <SocketContactContext.Provider
      value={{ socketContact, setSocketContact, allUsers, setAllUsers }}
    >
      {children}
    </SocketContactContext.Provider>
  )
}
