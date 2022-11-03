import { useParams } from 'react-router-dom'
import io from 'socket.io-client'

let str = window.location.href
let url = new URL(str)
let pathname = url.pathname
let arrPathname = pathname.split('/')
let userId = arrPathname[1]
userId = userId.replace('%20', ' ')
console.log('userId', userId)

let usersList = []

const socket = io('https://chat-example.michelmoreau.repl.co', {
  reconnectionDelayMax: 10000,
  auth: {
    token: '123',
  },
  query: {
    userId: userId,
  },
})

socket.onAny((event, ...args) => {
  // console.log('onAny', event, args)
})

socket.on('new user', (users) => {
  // console.log('users', users)
  usersList = users
})

socket.on('user disonnected', (users) => {
  // console.log('users', users)
  usersList = users
})

export { usersList }

export default socket
