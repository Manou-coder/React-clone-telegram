import Contact from './Contact'
import listContact from '../../datas/Users.json'
import searchContactByInput from './functionSearch'

let newFile = searchContactByInput(listContact, 'broo')

function Contacts() {
  // let newArray = Array(40)
  return (
    <ul className="p-0" style={{ listStyleType: 'none' }}>
      <Contact name="Nao France" random="1" />
      {/* {[...newArray].map((e, i) => ( */}
      {newFile.map((e, i) => (
        <Contact
          // name={getRandomUser(true)}
          name={getSearchedUser(true, i)}
          random={getRandomNumber()}
          id={i + 1}
          key={i + 2}
        />
      ))}
    </ul>
  )
}

function getRandomNumber() {
  return Math.floor(Math.random() * newFile.length)
}

function getRandomUser(genderOfName) {
  let randomUser = newFile[getRandomNumber()]
  // console.log(randomUser)
  return genderOfName === false
    ? randomUser.firstName
    : `${randomUser.firstName} ${randomUser.lastName}`
}

function getSearchedUser(genderOfName, index) {
  let searchedUser = newFile[index]
  // console.log(searchedUser)
  return genderOfName === false
    ? searchedUser.firstName
    : `${searchedUser.firstName} ${searchedUser.lastName}`
}

export default Contacts
