/* eslint-disable import/no-anonymous-default-export */
export default function (arr, inputSearch) {
  return arr.filter(
    (element) =>
      element.firstName.includes(inputSearch) ||
      element.lastName.includes(inputSearch)
  )
}

// export default function (arr, inputSearch) {
//   const newArr = []
//   for (const element of arr) {
//     if (element.firstName.includes(inputSearch)) {
//       newArr.push(element)
//     }
//   }
//   console.log(newArr)
//   return newArr
// }

// const _ = require('lodash')

// const obj1 = {
//   foo: 'bar',
// }

// const obj2 = {
//   foo: 'bar',
// }

// const comparateur = _.isEqual(obj1, obj2)

// console.log(comparateur)
