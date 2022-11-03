import Contact from '../../SideBar-Body/Contact'
import ContactsList from '../../../../datas/Users.json'
import searchContact from '../../../../utils/functions/searchContact'
import getSearchedUser from '../../../../utils/functions/getSearchedUser'
import { useEffect, useState } from 'react'
import { readAllUsers } from '../../../../firebase-config'
import { UserAuth } from '../../../../utils/context/AuthContext'

function Contacts({ inputLetters }) {
  const { user } = UserAuth()

  //get all users

  const [allUsers, setAllUsers] = useState([])

  useEffect(() => {
    getAllUsers()
  }, [])

  async function getAllUsers() {
    const listOfUsers = await readAllUsers()
    setAllUsers(listOfUsers.users)
  }

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
