/*
this function is used to filter the contact list according to the 'inputSearch' parameter;
the search is case insensitive; 
the function returns in a array the contacts who have the 'inputSearch' in this order: 
  1) at the beginning of their first name
  2) at the beginning of their last name
  3) wherever it is 
*/

export default function searchContact(arr, inputLetters) {
  if (inputLetters.trim() === '') {
    arr = arr.map((e) => JSON.stringify(e))
    arr = arr.sort()
    arr = arr.map((e) => JSON.parse(e))
    return arr
  }

  let regex1 = new RegExp('^' + inputLetters, 'i')
  let regex2 = new RegExp(inputLetters, 'i')

  let arrFirstName = arr.filter((element) => regex1.test(element.firstName))

  arrFirstName = arrFirstName.map((e) => JSON.stringify(e))

  arrFirstName = arrFirstName.sort()

  let arrLastName = arr.filter((element) => regex1.test(element.lastName))

  arrLastName = arrLastName.map((e) => JSON.stringify(e))

  arrLastName = arrLastName.sort()

  for (let i = 0; i < arrLastName.length; i++) {
    const element = arrLastName[i]
    if (!arrFirstName.includes(element)) {
      arrFirstName.push(element)
    }
  }

  const newArrLastAndFirst = arrFirstName

  let arrInput = arr.filter(
    (element) => regex2.test(element.lastName) || regex2.test(element.firstName)
  )

  arrInput = arrInput.map((e) => JSON.stringify(e))

  let newArr = []

  for (let i = 0; i < arrInput.length; i++) {
    const element = arrInput[i]
    if (!newArrLastAndFirst.includes(element)) {
      newArr.push(element)
    }
  }

  newArr = newArr.sort()

  newArr = [...newArrLastAndFirst, ...newArr]

  newArr = newArr.map((e) => JSON.parse(e))

  return newArr
}
