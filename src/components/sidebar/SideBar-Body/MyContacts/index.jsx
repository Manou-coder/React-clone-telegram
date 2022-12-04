import searchContact from '../../../../utils/functions/searchContact'
import getSearchedUser from '../../../../utils/functions/getSearchedUser'
import { useEffect, useMemo, useState } from 'react'
import { getMyContactsFromDB } from '../../../../firebase-config'
import { UserAuth } from '../../../../utils/context/AuthContext'
import { useContext } from 'react'
import { SocketContactContext } from '../../../../utils/context/SocketContact'
import MyContact from '../MyContact'

function MyContacts({ inputLetters }) {
  const { user } = UserAuth()
  const { myContacts, allUsers } = useContext(SocketContactContext)

  const myContactsObj = []
  for (const contactId of myContacts) {
    // console.log(contactId, 'contactId')
    const contactObj = allUsers.find((contact) => contact.userId === contactId)
    // console.log('contactObj', contactObj)
    myContactsObj.push(contactObj)
  }

  // console.log('myContactsObj', myContactsObj)

  // console.log('myContacts', myContacts)

  let searchedContactList = searchContact(myContactsObj, inputLetters)
  searchedContactList = searchedContactList.filter((e) => e.userId !== user.uid)
  // console.log('searchedContactList', searchedContactList)

  // --------------------- INTERNES FUNCTIONS ---------------------

  // async function setMyContactsFromDB() {
  //   const myContactsFromDB = await getMyContactsFromDB(user.uid)
  //   console.log('myContactsFromDB', myContactsFromDB)
  //   // searches in 'allUsers' for contacts that have the same id as in 'myContactsFromDB' and adds them to 'myContacts'
  //   const myContacts = []
  //   for (const contactId of myContactsFromDB) {
  //     for (const contact of allUsers) {
  //       if (contactId === contact.userId) {
  //         myContacts.push(contact)
  //       }
  //     }
  //   }
  //   // console.log('myContacts 5', myContacts)
  //   setMyContacts(myContacts)
  // }

  return (
    <ul className="p-0 mt-2" style={{ listStyleType: 'none' }}>
      {searchedContactList.map((e, i) => (
        <MyContact
          contact={searchedContactList[i]}
          name1={getSearchedUser(searchedContactList, i, inputLetters)[0]}
          name2={getSearchedUser(searchedContactList, i, inputLetters)[1]}
          name3={getSearchedUser(searchedContactList, i, inputLetters)[2]}
          photoURL={searchedContactList[i].photoURL}
          description={searchedContactList[i].isTyping}
          id={searchedContactList[i].id}
          key={i + 2}
        />
      ))}
    </ul>
  )
}

export default MyContacts
