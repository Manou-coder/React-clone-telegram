import io from 'socket.io-client'

const SOCKET_URL = 'https://chat-example.michelmoreau.repl.co'

const socket = io(SOCKET_URL, {
  autoConnect: false,
})

// socket.onAny((event, ...args) => {
//   console.log('onAny ' + event, args)
// })

export default socket
