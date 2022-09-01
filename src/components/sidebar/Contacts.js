import Contact from './Contact'
import ContactsList from '../../datas/Users.json'
import searchContactByInput from '../../utils/functions/searchContact'
import getSearchedUser from '../../utils/functions/getSearchedUser'

let ContactsListLowerCase = ContactsList.map((elem) => ({
  name: `${elem.firstName.toLowerCase()} ${elem.lastName.toLowerCase()}`,
}))

function Contacts({ inputLetters }) {
  inputLetters = inputLetters.toLowerCase()

  let searchedContactList = searchContactByInput(
    ContactsListLowerCase,
    inputLetters
  )

  return (
    <ul className="p-0" style={{ listStyleType: 'none' }}>
      {searchedContactList.map((e, i) => (
        <Contact
          name1={getSearchedUser(searchedContactList, i, inputLetters)[0]}
          name2={getSearchedUser(searchedContactList, i, inputLetters)[1]}
          name3={getSearchedUser(searchedContactList, i, inputLetters)[2]}
          random={getRandomNumber(searchedContactList)}
          id={i + 1}
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
