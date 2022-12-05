// client-side js, loaded by index.html
// run by the browser each time the page is loaded

// import { Peer } from 'peerjs'

// export const myPeer = new Peer()

// console.log('myPeer', myPeer)

// let messagesEl = document.querySelector('.messages')
// let peerIdEl = document.querySelector('#connect-to-peer')
// let videoEl = document.querySelector('.remote-video')

// let logMessage = (message) => {
//   let newMessage = document.createElement('div')
//   newMessage.innerText = message
//   messagesEl.appendChild(newMessage)
// }

// let renderVideo = (stream) => {
//   videoEl.srcObject = stream
// }

// const params = new URL(document.location).searchParams
// const me = params.get('me')
// const you = params.get('you')

// console.log('params', params)
// console.log('me', me)
// console.log('you', you)

// // Register with the peer server
// let peer = new Peer(me)

// peer.on('open', (id) => {
//   console.log('My peer ID is: ' + id)
// })
// peer.on('error', (error) => {
//   console.error(error)
// })

// // Handle incoming data connection
// peer.on('connection', (conn) => {
//   console.log('incoming peer connection!')
//   conn.on('data', (data) => {
//     console.log(`received: ${data}`)
//   })
//   conn.on('open', () => {
//     conn.send('hello!')
//   })
// })

// // Handle incoming voice/video connection
// peer.on('call', (call) => {
//   navigator.mediaDevices
//     .getUserMedia({ video: true, audio: true })
//     .then((stream) => {
//       call.answer(stream) // Answer the call with an A/V stream.
//       call.on('stream', renderVideo)
//     })
//     .catch((err) => {
//       console.error('Failed to get local stream', err)
//     })
// })

// // Initiate outgoing connection
// export const connectToPeer = (peerId) => {
//   console.log('peerId', peerId.value)
//   peerId = peerId.value
//   // let peerId = you
//   console.log(`Connecting to ${peerId}...`)

//   let conn = peer.connect(peerId)
//   conn.on('data', (data) => {
//     console.log(`received: ${data}`)
//   })
//   conn.on('open', () => {
//     conn.send('hi!')
//   })

//   navigator.mediaDevices
//     .getUserMedia({ video: true, audio: true })
//     .then((stream) => {
//       let call = peer.call(peerId, stream)
//       call.on('stream', renderVideo)
//     })
//     .catch((err) => {
//       console.log('Failed to get local stream', err)
//     })
// }

// window.connectToPeer = connectToPeer

// // // The usage -
// // import { Peer } from 'peerjs'

// // // const peer = new Peer('pick-an-id')

// // let params = new URL(document.location).searchParams

// // const me = params.get('me')
// // const you = params.get('you')

// // console.log('params', params)
// // console.log('me', me)
// // console.log('you', you)

// // const peer = new Peer()

// // console.log('peer', peer)

// // peer.on('open', function (id) {
// //   console.log('My peer ID is: ' + id)
// // })

// // const conn = peer.connect(you)

// // console.log('conn', conn)

// // conn.on('open', () => {
// //   console.log('open')
// //   conn.send('hi!')
// // })

// // peer.on('connection', (conn) => {
// //   console.log('connection')
// //   conn.on('data', (data) => {
// //     // Will print 'hi!'
// //     console.log(data)
// //   })
// //   conn.on('open', () => {
// //     conn.send('hello!')
// //   })
// // })
