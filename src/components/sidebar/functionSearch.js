/* eslint-disable import/no-anonymous-default-export */
export default function (arr, letter) {
  // console.log('arr', arr)
  if (letter === '') return arr
  return arr.filter((element) => element.name.toLowerCase().includes(letter))
}
