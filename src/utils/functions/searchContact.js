/*
this function is used to filter the contact list according to the 'inputSearch' parameter;
the search is case insensitive; 
the function returns in a array the contacts who have the 'inputSearch' in this order: 
  1) at the beginning of their first name
  2) at the beginning of their last name
  3) wherever it is 
*/

export default function searchContact(arr, inputLetters) {
  // console.log('arr', arr)

  if (!arr) {
    return []
  }
  if (inputLetters.trim() === '') {
    arr = arr.map((e) => JSON.stringify(e))
    arr = arr.map((e) => JSON.parse(e))
    return arr
  }

  // console.log('arr', arr)
  // console.log('inputLetters2', inputLetters)

  let regex1 = new RegExp('^' + inputLetters, 'i')
  let regex2 = new RegExp(inputLetters, 'i')

  // console.log('regex1', regex1)
  // console.log('regex2', regex2)

  // console.log(arr[0].displayName)

  // console.log(regex2.test(arr[0].displayName))

  let arrRegex1 = arr.filter((element) => regex1.test(element.displayName))

  // console.log('arrRegex1', arrRegex1)

  let arrRegex2 = arr.filter((element) => regex2.test(element.displayName))

  // console.log('arrRegex2', arrRegex2)

  // arrRegex1 = arrRegex1.map((e) => JSON.stringify(e))

  // console.log('arrRegex1', arrRegex1)

  // arrFirstName = arrFirstName.sort()

  // let arrLastName = arr.filter((element) => regex1.test(element.lastName))

  // arrLastName = arrLastName.map((e) => JSON.stringify(e))

  // arrLastName = arrLastName.sort()

  // for (let i = 0; i < arrLastName.length; i++) {
  //   const element = arrLastName[i]
  //   if (!arrFirstName.includes(element)) {
  //     arrFirstName.push(element)
  //   }
  // }

  // const newArrLastAndFirst = 'arrFirstName'

  // let arrInput = arr.filter(
  //   (element) => regex2.test(element.lastName) || regex2.test(element.firstName)
  // )

  // arrInput = arrInput.map((e) => JSON.stringify(e))

  // let newArr = []

  // for (let i = 0; i < arrInput.length; i++) {
  //   const element = arrInput[i]
  //   if (!newArrLastAndFirst.includes(element)) {
  //     newArr.push(element)
  //   }
  // }

  // newArr = newArr.sort()

  // newArr = [...newArrLastAndFirst, ...newArr]

  // newArr = newArr.map((e) => JSON.parse(e))

  // let newArr = [...arrRegex1, arrRegex2]

  // return newArr

  return arrRegex2
}
