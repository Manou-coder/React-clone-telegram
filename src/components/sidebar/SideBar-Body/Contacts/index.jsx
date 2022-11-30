import Contact from '../../SideBar-Body/Contact'
import searchContact from '../../../../utils/functions/searchContact'
import getSearchedUser from '../../../../utils/functions/getSearchedUser'
import { useContext, useEffect, useState } from 'react'
import { UserAuth } from '../../../../utils/context/AuthContext'
import { SocketContactContext } from '../../../../utils/context/SocketContact'

function Contacts({ inputLetters }) {
  const { user } = UserAuth()
  const { allUsers } = useContext(SocketContactContext)

  // console.log('allUsers', allUsers)
  let searchedContactList = searchContact(allUsers, inputLetters)

  searchedContactList = searchedContactList.filter((e) => e.userId !== user.uid)

  return (
    <ul className="p-0 mt-2" style={{ listStyleType: 'none' }}>
      {searchedContactList.map((e, i) => (
        <Contact
          contact={searchedContactList[i]}
          name1={getSearchedUser(searchedContactList, i, inputLetters)[0]}
          name2={getSearchedUser(searchedContactList, i, inputLetters)[1]}
          name3={getSearchedUser(searchedContactList, i, inputLetters)[2]}
          random={getRandomNumber(searchedContactList)}
          photoURL={searchedContactList[i].photoURL}
          description={searchedContactList[i].isTyping}
          id={searchedContactList[i].id}
          key={i + 2}
        />
      ))}
    </ul>
  )
}

function getRandomNumber(arr) {
  return Math.floor(Math.random() * arr.length)
}

export default Contacts
