import _ from 'lodash'

function getSearchedUser(arr, index, inputSearch) {
  // console.log(arr)
  let searchedUser = arr[index]
  let nameOfUser = searchedUser.name

  if (inputSearch.trim() === '') {
    return [_.startCase(nameOfUser), '', '']
  }

  let firstOccurence = nameOfUser.indexOf(inputSearch)

  let inputSearchLength = inputSearch.length

  let firstParty = nameOfUser.slice(0, firstOccurence)

  let secondParty = nameOfUser.slice(firstOccurence + inputSearchLength)

  let secondParty2 = secondParty.split(' ')

  function capitalizeSecondParty() {
    const newArr = []
    newArr.push(secondParty2[0])
    if (secondParty2.length <= 1) {
      return secondParty2.join()
    }
    if (secondParty2.length > 1) {
      for (let index = 1; index < secondParty2.length; index++) {
        let word = secondParty2[index]
        newArr.push(_.startCase(word))
      }
      return newArr.join(' ')
    }
  }

  let secondParty3 = capitalizeSecondParty()

  let firstParty3 = _.startCase(firstParty)

  if (nameOfUser[firstOccurence - 1] === ' ' || firstParty === '') {
    inputSearch = ' ' + _.startCase(inputSearch)
  }

  return [firstParty3, inputSearch, secondParty3]
}
export default getSearchedUser
