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

  // PROBLEME avec 'searchContact()' il renvoi pas dans le meme ordre
  let searchedContactList = searchContact(allUsers, inputLetters)

  // let searchedContactList = allUsers

  // remove me of the list of contacts
  searchedContactList = searchedContactList.filter((e) => e.userId !== user.uid)

  // sort contacts by numeric alphabet order
  searchedContactList = searchedContactList.sort((a, b) =>
    a.displayName > b.displayName ? 1 : b.displayName > a.displayName ? -1 : 0
  )

  console.log(' searchedContactList 2', searchedContactList)

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
