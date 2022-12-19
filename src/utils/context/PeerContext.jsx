/* eslint-disable react-hooks/exhaustive-deps */
import Peer from 'peerjs'
import React, { useState, createContext } from 'react'
import { useContext } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'

import socket from '../socket.io'
import { UserAuth } from './AuthContext'
import { SocketContactContext } from './SocketContact'
import { ThemeContext } from './ThemeContext'

export const PeerContext = createContext()

export const PeerProvider = ({ children }) => {
  const { user } = UserAuth()
  const { actuallyContactId } = useContext(SocketContactContext)
  const { setIsToastOpen, setIsCallOpen } = useContext(ThemeContext)
  const [myPeer, setMyPeer] = useState(null)
  const [isCalling, setIsCalling] = useState(false)
  const [isCallAccepted, setIsCallAccepted] = useState(false)
  const [isCallAcceptedByMe, setIsCallAcceptedByMe] = useState(false)
  const [call, setCall] = useState(null)
  const [myStream, setMyStream] = useState(null)
  const [isCameraActive, setIsCameraActive] = useState(true)
  const [isMicroActive, setIsMicroActive] = useState(true)
  const grandVideo = useRef()
  const smallVideo = useRef()
  const ringtone = useRef()

  // ---------------- PEER -----------------------

  // Check if user exsists and if so then set the Peer with my user id
  useEffect(() => {
    if (user !== null) {
      setMyPeer(new Peer(user.uid))
    }
  }, [user])

  // Log my Peer and catch error with him
  useEffect(() => {
    if (!myPeer) {
      console.log("il n'y a pas de peer")
      return
    }
    myPeer.on('open', (id) => {
      console.log('My peer ID is: ' + id)
    })
    myPeer.on('error', (error) => {
      console.error(error)
    })

    return () => {
      myPeer.off('open')
      myPeer.off('error')
    }
  }, [myPeer])

  // When I receive a call show toast with the contact calling and the option to pick up or hang up
  useEffect(() => {
    if (!myPeer) {
      return
    }
    myPeer.on('call', (call) => {
      // set the call in 'setCall'
      setCall(call)
      // open the toast to be able to hang up or answer
      setIsToastOpen(true)
    })

    return () => {
      myPeer.off('call')
    }
  }, [myPeer])

  // Functions

  // activates the ringtone for outgoing calls if I am calling a contact and deactivates it when the call is answered or rejected
  useEffect(() => {
    if (ringtone.current) {
      if (isCalling) {
        ringtone.current.play()
      } else {
        ringtone.current.pause()
      }
    }
  }, [ringtone, isCalling])

  // ------------- FUNCTIONS --------------

  // call the contact
  function callTheContact() {
    //
    // // emit socket that I am calling
    // socket.emit('callUser', {
    //   from: user.uid,
    //   to: actuallyContactId,
    // })

    // request authorization to use the camera and the microphone and if so then call the contact
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((myStream) => {
        // save my stream
        setMyStream(myStream)
        // open call display
        setIsCallOpen(true)
        // create object of call
        const call = myPeer.call(actuallyContactId, myStream)
        // set the call in 'setCall'
        setCall(call)
        // I am calling and so the outgoing call music is activated
        setIsCalling(true)
        // function that fires when the contact answers the call and sends a stream
        call.on('stream', (streamOfContact) => {
          // turn off the outgoing call music
          setIsCalling(false)
          // define the call as accepted so that the application displays the stream instead of the call logo
          setIsCallAccepted(true)
          // display my video
          playMyVideo(smallVideo.current, myStream)
          // displays the video of the contact with the received stream
          addVideoStream(grandVideo.current, streamOfContact)
        })
      })
      .catch((err) => {
        console.log('Failed to get local stream', err)
      })
  }

  // pick up the phone
  function pickUp() {
    // open call display (it has to be here and not in navigator so that the muted is not null)
    setIsCallOpen(true)
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((myStream) => {
        // save my stream
        setMyStream(myStream)
        // define the call as accepted so that the application displays the stream instead of the call logo
        setIsCallAccepted(true)
        // listen to the contact's stream
        call.on('stream', (streamOfContact) => {
          // displays the video of the contact with the received stream
          addVideoStream(grandVideo.current, streamOfContact)
        })
        // Answer the call with my stream.
        call.answer(myStream)
        // display my video
        playMyVideo(smallVideo.current, myStream)
      })
      .catch((err) => {
        console.error('Failed to get local stream', err)
      })
  }

  //  hanging up the phone
  function hangingUp() {
    call.close()
    stopAllMyStreams(myStream)
    setIsCallOpen(false)
    setIsCalling(false)
    setIsCallAccepted(false)
  }

  function muteMyVideo() {
    stopMyVideoStream(myStream)
    setIsCameraActive(!isCameraActive)
  }

  function muteMyAudio() {
    stopMyAudioStream(myStream)
    setIsMicroActive(!isMicroActive)
  }

  return (
    <PeerContext.Provider
      value={{
        myPeer,
        setMyPeer,
        isCalling,
        setIsCalling,
        isCallAccepted,
        setIsCallAccepted,
        isCallAcceptedByMe,
        setIsCallAcceptedByMe,
        grandVideo,
        smallVideo,
        ringtone,
        call,
        setCall,
        hangingUp,
        pickUp,
        callTheContact,
        muteMyVideo,
        muteMyAudio,
        isCameraActive,
        isMicroActive,
      }}
    >
      {children}
    </PeerContext.Provider>
  )
}

function playMyVideo(video, stream) {
  console.log('video', video)
  // the sound of my video is muted so that I cannot hear myself when I speak with the contact
  video.muted = true
  addVideoStream(video, stream)
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
}

// // Remove all media streams (microphone and webcam will be disabled)
// function stopStreamedVideo(videoElem) {
//   console.log('videoElem', videoElem)
//   const stream = videoElem.srcObject
//   console.log('stream', stream)
//   // recover all the media Streams
//   const tracks = stream.getTracks()
//   // then stop them as well as remove them
//   tracks.forEach((track) => {
//     track.stop()
//     track.enabled = false
//   })
//   // remove the 'srcObject' from the video
//   videoElem.srcObject = null
// }

function stopAllMyStreams(stream) {
  console.log('stream', stream)
  const tracks = stream.getTracks()
  // then stop them as well as remove them
  tracks.forEach((track) => {
    track.stop()
    track.enabled = false
  })
}

function stopMyVideoStream(stream) {
  console.log('stream', stream)
  const tracks = stream.getTracks()
  console.log('tracks', tracks)
  const videoTrack = tracks.find((track) => track.kind === 'video')
  console.log('videoTrack', videoTrack)
  videoTrack.enabled = !videoTrack.enabled
}

function stopMyAudioStream(stream) {
  console.log('stream', stream)
  const tracks = stream.getTracks()
  console.log('tracks', tracks)
  const audioTrack = tracks.find((track) => track.kind === 'audio')
  console.log('audioTrack', audioTrack)
  audioTrack.enabled = !audioTrack.enabled
}

//
//
//
//
//
//
//
//
//
//
//
// function sends message with peerjs

// useEffect(() => {
//   if (!myPeer || !conn) {
//     console.log("il n'y a pas de conn ou de peer")
//     return
//   }
//   console.log('conn exists!')
//   // Handle incoming data connection
//   myPeer.on('connection', (conn) => {
//     console.log('incoming peer connection!')
//     conn.on('data', (data) => {
//       console.log(`received: ${data}`)
//     })
//     conn.on('open', () => {
//       console.log('open')
//       conn.send('hello!')
//     })
//   })

//   return () => {
//     myPeer.off('connection')
//     conn.off('data')
//   }
// }, [myPeer, conn])

// // I connect with the contact I am calling
// const connectionToAnotherPeer = myPeer.connect(actuallyContactId)
// // I set the connexion to 'setConn'
// setConn(connectionToAnotherPeer)

// connectionToAnotherPeer.on('data', (data) => {
//   console.log(`received: ${data}`)
// })
// connectionToAnotherPeer.on('open', () => {
//   connectionToAnotherPeer.send('hi!')
// })
