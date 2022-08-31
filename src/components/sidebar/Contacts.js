import Contact from './Contact'
import listContact from '../../datas/Users.json'
import searchContactByInput from './functionSearch'
import { useState } from 'react'

let inputSearch
let newFile

let coucou = listContact.map((elem) => ({
  name: `${elem.firstName.toLowerCase()} ${elem.lastName.toLowerCase()}`,
}))

// console.log('coucou', coucou)

// console.log('newFile', newFile)

function Contacts({ inputLetters, setInputLetters }) {
  const [spanLetter, setSpanLetter] = useState('a')
  inputSearch = inputLetters

  // newFile = searchContactByInput(listContact, inputSearch)
  newFile = searchContactByInput(coucou, inputSearch)

  // console.log('inputLetters', inputLetters)
  // console.log(newFile)

  // let ContactNameLowerCase = getContactNameLowerCase(listContact)
  // console.log('ContactNameLowerCase', ContactNameLowerCase)

  // newFile = searchContactByInput(ContactNameLowerCase, inputSearch)
  // console.log('newFile', newFile)
  return (
    <ul className="p-0" style={{ listStyleType: 'none' }}>
      {newFile.map((e, i) => (
        <Contact
          name1={getSearchedUser(i, inputSearch)[0]}
          name2={getSearchedUser(i, inputSearch)[1]}
          name3={getSearchedUser(i, inputSearch)[2]}
          inputLetters={inputLetters}
          setInputLetters={setInputLetters}
          spanLetter={spanLetter}
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

function getSearchedUser(index, inputSearch) {
  let searchedUser = newFile[index]
  // let nameOfUser = `${searchedUser.firstName} ${searchedUser.lastName}`
  let nameOfUser = searchedUser.name
  if (inputSearch === '') {
    return [nameOfUser, '', '']
  }
  let coucou = new RegExp('^' + inputSearch)
  console.log(coucou)
  nameOfUser = nameOfUser.split(coucou)
  // console.log('nameOfUser', nameOfUser)
  // console.log('inputSearch', inputSearch)
  return [nameOfUser[0], inputSearch, nameOfUser[1]]
}

function testZazato() {
  let za = 'za'
  // let input = /^za/
  let input = new RegExp('^' + za)
  let zazato = 'zazato zazato'
  return zazato.split(input)
}

// console.log(testZazato())

function testSidonia() {
  let za = 'ma'
  // let input = /^za/
  let input = new RegExp('^' + za)
  let zazato = 'sidonia stringman'
  return zazato.split(input)
}

// console.log(testSidonia())

function testSidonia2(index, inputSearch) {
  inputSearch = 'ma'
  let nameOfUser = 'sidonia stringman'
  // let nameOfUser = 'manou haouzi'
  let coucou = new RegExp('^' + inputSearch)
  console.log(coucou)
  nameOfUser = nameOfUser.split(coucou)
  // console.log('nameOfUser', nameOfUser)
  // console.log('inputSearch', inputSearch)
  if (nameOfUser[1] === undefined) {
    nameOfUser[1] = ''
  }
  return [nameOfUser[0], inputSearch, nameOfUser[1]]
}

console.log(testSidonia2())
// function getContactNameLowerCase(arr) {
//   return arr.map(
//     (element) =>
//       element.firstName.toLowerCase() + ' ' + element.lastName.toLowerCase()
//   )
// }

export default Contacts
