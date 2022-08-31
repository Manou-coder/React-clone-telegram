/* eslint-disable import/no-anonymous-default-export */
// export default function (arr, letter) {
//   letter = 'manou'
//   letter = letter.toLowerCase()
//   if (letter === '') return []
//   return arr.filter(
//     (element) =>
//       element.firstName.toLowerCase().includes(letter) ||
//       element.lastName.toLowerCase().includes(letter)
//   )
// }

export default function (arr, letter) {
  // console.log('arr', arr)
  letter = letter.toLowerCase()
  if (letter === '') return arr
  return arr.filter((element) => element.name.toLowerCase().includes(letter))
}
