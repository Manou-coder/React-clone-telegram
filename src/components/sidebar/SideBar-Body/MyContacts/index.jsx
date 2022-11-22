import Contact from '../../SideBar-Body/Contact'
import ContactsList from '../../../../datas/Users.json'
import searchContact from '../../../../utils/functions/searchContact'
import getSearchedUser from '../../../../utils/functions/getSearchedUser'
import { useEffect, useState } from 'react'
import { db, readAllUsers } from '../../../../firebase-config'
import { UserAuth } from '../../../../utils/context/AuthContext'
import { doc, getDoc } from 'firebase/firestore'
import { useContext } from 'react'
import { SocketContactContext } from '../../../../utils/context/SocketContact'
import MyContact from '../MyContact'

function MyContacts({ inputLetters }) {
  const { user } = UserAuth()
  const { toggleChange, isChange } = useContext(SocketContactContext)
  //get all users

  const [allUsers, setAllUsers] = useState([])

  useEffect(() => {
    getAllUsers()
    // console.log('coucou')
  }, [isChange])

  async function getAllUsers() {
    const docRef = doc(db, 'users', user.uid)
    const docSnap = await getDoc(docRef)
    let listOfUsers
    if (docSnap.exists()) {
      // console.log('Document data:', docSnap.data().myContacts)
      listOfUsers = docSnap.data().myContacts
      // console.log('listOfUsers', listOfUsers)
      setAllUsers(listOfUsers)
      return
    } else {
      console.log('No such document!')
    }

    // const listOfUsers = await readAllUsers()
    // setAllUsers(listOfUsers.users)
  }

  let searchedContactList = searchContact(allUsers, inputLetters)

  // console.log('allUsers', allUsers)

  searchedContactList = searchedContactList.filter((e) => e.userId !== user.uid)

  // console.log('searchedContactList', searchedContactList)

  return (
    <ul className="p-0 mt-2" style={{ listStyleType: 'none' }}>
      {searchedContactList.map((e, i) => (
        <MyContact
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

export default MyContacts
