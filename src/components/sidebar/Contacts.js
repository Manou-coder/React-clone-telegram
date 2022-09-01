import Contact from './Contact'
import listContact from '../../datas/Users.json'
import searchContactByInput from './functionSearch'
import capitalizeString from '../../utils/functions/capitalizeString'
const _ = require('lodash')

let inputSearch
let newFile

let coucou = listContact.map((elem) => ({
  name: `${elem.firstName.toLowerCase()} ${elem.lastName.toLowerCase()}`,
}))

// console.log('coucou', coucou)

// console.log('newFile', newFile)

function Contacts({ inputLetters, setInputLetters }) {
  inputSearch = inputLetters.toLowerCase()

  newFile = searchContactByInput(coucou, inputSearch)

  return (
    <ul className="p-0" style={{ listStyleType: 'none' }}>
      {newFile.map((e, i) => (
        <Contact
          name1={getSearchedUser(i, inputSearch)[0]}
          name2={getSearchedUser(i, inputSearch)[1]}
          name3={getSearchedUser(i, inputSearch)[2]}
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

// function getSearchedUser(index, inputSearch) {
//   let searchedUser = newFile[index]
//   let nameOfUser = searchedUser.name
//   if (inputSearch === '') {
//     return [nameOfUser, '', '']
//   }

//   console.log('---nameOfUser---', nameOfUser)

//   let firstOccurence = nameOfUser.indexOf(inputSearch)
//   console.log('---firstOccurence---', firstOccurence)

//   let inputSearchLength = inputSearch.length
//   console.log('---inputSearchLength---', inputSearchLength)

//   let firstParty = nameOfUser.slice(0, firstOccurence)
//   console.log('---firstParty---', firstParty)

//   let secondParty = nameOfUser.slice(firstOccurence + inputSearchLength)
//   console.log('---secondParty---', secondParty)

//   return [firstParty, inputSearch, secondParty]
// }

function getSearchedUser(index, inputSearch) {
  let searchedUser = newFile[index]
  let nameOfUser = searchedUser.name
  if (inputSearch === '') {
    return [_.startCase(nameOfUser), '', '']
  }

  console.log('---nameOfUser---', nameOfUser)

  let firstOccurence = nameOfUser.indexOf(inputSearch)
  console.log('---firstOccurence---', firstOccurence)

  let inputSearchLength = inputSearch.length
  console.log('---inputSearchLength---', inputSearchLength)

  let firstParty = nameOfUser.slice(0, firstOccurence)
  console.log('---firstParty---', firstParty)

  let secondParty = nameOfUser.slice(firstOccurence + inputSearchLength)
  console.log('---secondParty---', secondParty)

  let stringFinal = [firstParty, inputSearch, secondParty]
  console.log('stringFinal', stringFinal.join(''))

  if (firstParty === '') {
    inputSearch = capitalizeString(inputSearch)
  } else {
    firstParty = capitalizeString(firstParty)
  }

  // secondParty = _.startCase(secondParty)

  let secondParty2 = secondParty.split(' ')

  console.log('secondParty2.length', secondParty2.length)

  function capitalizeSecondParty() {
    const newArr = []
    newArr.push(secondParty2[0])
    if (secondParty2.length <= 1) {
      return secondParty2.join()
    }
    if (secondParty2.length > 1) {
      for (let index = 1; index < secondParty2.length; index++) {
        let word = secondParty2[index]
        console.log('word', word)
        word = capitalizeString(word)
        console.log('word2', word)
        newArr.push(word)
      }
      return newArr.join(' ')
    }
  }

  let secondParty3 = capitalizeSecondParty()
  console.log('secondParty3', secondParty3)

  console.log('secondParty2', secondParty2)

  let firstParty3 = _.startCase(firstParty)

  console.log('firstParty3', firstParty3)

  console.log('_______ ====', nameOfUser[firstOccurence - 1])

  if (nameOfUser[firstOccurence - 1] === ' ') {
    console.log('=======================================')
    inputSearch = ' ' + _.startCase(inputSearch)
  }

  return [firstParty3, inputSearch, secondParty3]
}

function testSidonia2(index, inputSearch) {
  inputSearch = 'at'
  let nameOfUser = 'zazato zazato alama Kalo'

  // inputSearch = 'h'
  // let nameOfUser = 'manou haouzi'

  console.log('---nameOfUser---', nameOfUser)

  let firstOccurence = nameOfUser.indexOf(inputSearch)
  console.log('---firstOccurence---', firstOccurence)

  let inputSearchLength = inputSearch.length
  console.log('---inputSearchLength---', inputSearchLength)

  let firstParty = nameOfUser.slice(0, firstOccurence)
  console.log('---firstParty---', firstParty)

  let secondParty = nameOfUser.slice(firstOccurence + inputSearchLength)
  console.log('---secondParty---', secondParty)

  let stringFinal = [firstParty, inputSearch, secondParty]
  console.log('stringFinal', stringFinal.join(''))

  if (firstParty === '') {
    inputSearch = capitalizeString(inputSearch)
  } else {
    firstParty = capitalizeString(firstParty)
  }

  // secondParty = _.startCase(secondParty)

  let secondParty2 = secondParty.split(' ')

  console.log('secondParty2.length', secondParty2.length)

  function capitalizeSecondParty() {
    const newArr = []
    newArr.push(secondParty2[0])
    if (secondParty2.length <= 1) {
      return secondParty2.join()
    }
    if (secondParty2.length > 1) {
      for (let index = 1; index < secondParty2.length; index++) {
        let word = secondParty2[index]
        console.log('word', word)
        word = capitalizeString(word)
        console.log('word2', word)
        newArr.push(word)
      }
      return newArr.join(' ')
    }
  }

  let secondParty3 = capitalizeSecondParty()
  console.log('secondParty3', secondParty3)

  console.log('secondParty2', secondParty2)

  let firstParty3 = _.startCase(firstParty)

  console.log('firstParty3', firstParty3)

  console.log('_______ ====', nameOfUser[firstOccurence - 1])

  if (nameOfUser[firstOccurence - 1] === ' ') {
    console.log('=======================================')
    inputSearch = _.startCase(inputSearch)
  }

  return [firstParty3, inputSearch, secondParty3]
}

console.log('testSidonia2 =', testSidonia2())

export default Contacts
