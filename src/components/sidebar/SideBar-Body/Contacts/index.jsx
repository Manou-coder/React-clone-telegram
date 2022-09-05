import Contact from '../../SideBar-Body/Contact'
import ContactsList from '../../../../datas/Users.json'
import searchContactByInput from '../../../../utils/functions/searchContact'
import getSearchedUser from '../../../../utils/functions/getSearchedUser'

function Contacts({ inputLetters }) {
  let searchedContactList = searchContactByInput(ContactsList, inputLetters)

  function contact(element) {
    return `${element.firstName} ${element.lastName}`
  }

  return (
    <ul className="p-0" style={{ listStyleType: 'none' }}>
      {searchedContactList.map((e, i) => (
        <Contact
          contact={contact(searchedContactList[i])}
          name1={getSearchedUser(searchedContactList, i, inputLetters)[0]}
          name2={getSearchedUser(searchedContactList, i, inputLetters)[1]}
          name3={getSearchedUser(searchedContactList, i, inputLetters)[2]}
          random={getRandomNumber(searchedContactList)}
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
