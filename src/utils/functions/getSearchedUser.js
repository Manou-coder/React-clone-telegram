/* this function is used to return each contact in the list if 'inputSearch' is empty (into the 'firstParty') 
but if a contact is searched then it returns the name of the contact in three parts with the 'input search' in the middle, 
in order to be able to return it in <span> and give it a different color */

function getSearchedUser(arr, index, inputSearch) {
  let searchedUser = arr[index]
  // console.log('searchedUser', searchedUser)
  let nameOfUser = searchedUser.displayName

  // console.log('nameOfuser', nameOfUser)

  // console.log('inputSearch', inputSearch)

  let regex = new RegExp(inputSearch, 'i')
  // console.log('regex', regex)
  let regexUpperCase = new RegExp(inputSearch.toUpperCase())

  // this condition is used so that in the case where 'inputSearch' is empty then it returns the entire list of contacts in alphabetical order
  if (inputSearch.trim() === '') {
    return [nameOfUser, '', '', '']
  }

  let firstOccurence = nameOfUser.search(regex)

  console.log('firstOccurence', firstOccurence)

  let nameOfUserFirstOccurence = nameOfUser[firstOccurence]

  console.log(
    'nameOfUserFirstOccurence',
    nameOfUserFirstOccurence.toUpperCase()
  )

  // // this function is used so that in the case of 'Eloisa Sparklin' for example the result of the 'firstOccurence' is not the lowercase 's' but the uppercase 'S'
  let verifyFirstOccurence = () => {
    if (
      nameOfUser[firstOccurence].toUpperCase() !== nameOfUser[firstOccurence] &&
      nameOfUser.search(regexUpperCase) >= 0
    ) {
      firstOccurence = nameOfUser.search(regexUpperCase)
    }
  }

  verifyFirstOccurence()

  let inputSearchLength = inputSearch.length

  let firstParty = nameOfUser.slice(0, firstOccurence)

  let secondParty = nameOfUser.slice(
    firstOccurence,
    firstOccurence + inputSearchLength
  )

  let thirdParty = nameOfUser.slice(firstOccurence + inputSearchLength)

  return [firstParty, secondParty, thirdParty, searchedUser]
}

export default getSearchedUser
