// import { useParams } from 'react-router-dom'
import io from 'socket.io-client'

// let str = window.location.href
// let url = new URL(str)
// let pathname = url.pathname
// let arrPathname = pathname.split('/')
// let userId = arrPathname[1]
// userId = userId.replace('%20', ' ')
// console.log('userId', userId)

// let usersList = []

// // io.on('connection', (socket) => {
// //   console.log(socket.id) // x8WIv7-mJelg7on_ALbx
// // })

// const SOCKET_URL = 'https://chat-example.michelmoreau.repl.co'

// const socket = io(SOCKET_URL, {
//   autoConnect: false,
//   reconnectionDelayMax: 10000,
// })

// const startSocket = () => {
//   const username = sessionStorage.getItem('userID')
//   socket.auth = { username }
//   socket.connect()
// }

// startSocket({ a: 'a' })

// socket.onAny((event, ...args) => {
//   // console.log('onAny', event, args)
// })

// socket.on('new user', (users) => {
//   // console.log('users', users)
//   usersList = users
// })

// socket.on('user disonnected', (users) => {
//   // console.log('users', users)
//   usersList = users
// })

// export { usersList }

// export default socket

const SOCKET_URL = 'https://chat-example.michelmoreau.repl.co'

const socket = io(SOCKET_URL, {
  autoConnect: false,
})

socket.onAny((event, ...args) => {
  console.log('onAny ' + event, args)
})

export default socket
