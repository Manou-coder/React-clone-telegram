/* eslint-disable import/no-anonymous-default-export */
export default function (arr, inputLetters) {
  // console.log('arr', arr)
  if (inputLetters.trim() === '') return arr

  let regex = new RegExp('^' + inputLetters)
  let regex2 = new RegExp(inputLetters)

  let arrStartInput = arr.filter((element) => regex.test(element.name))

  let arrInput = arr.filter((element) => regex2.test(element.name))

  console.log('arrStartInput', arrStartInput)

  console.log('arrInput', arrInput)

  // for (let index = 0; index < arrInput.length; index++) {
  //   const element = arrInput[index]
  //   for (const iterator of arrStartInput) {
  //     // console.log(iterator)
  //     if (iterator !== element) {
  //       arrInput.push(iterator)
  //     }
  //   }
  // }

  //  console.log('arrInput', arrInput)

  return arr.filter((element) =>
    element.name.toLowerCase().includes(inputLetters)
  )
}
