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
  const { actuallyContactId, allUsers } = useContext(SocketContactContext)
  const { setIsCallOpen } = useContext(ThemeContext)
  const [myPeer, setMyPeer] = useState(null)
  const [isCalling, setIsCalling] = useState(false)
  const [isCallAccepted, setIsCallAccepted] = useState(false)
  const [conn, setConn] = useState(null)
  const connectToPeer = useRef()
  const grandVideo = useRef()
  const smallVideo = useRef()
  const musique2 = useRef()

  // ---------------- PEER -----------------------

  useEffect(() => {
    if (user !== null) {
      //   setMyPeer((curr) => {
      //     curr = new Peer(user.uid)
      //     console.log('curr', curr)
      //     curr.on('open', (id) => {
      //       console.log('My peer ID is: ' + id)
      //     })
      //     curr.on('error', (error) => {
      //       console.error(error)
      //     })
      //     return curr
      //   })
      setMyPeer(new Peer(user.uid))
    }
  }, [user])

  useEffect(() => {
    // console.log('myPeer', myPeer)
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

  useEffect(() => {
    if (!myPeer || !conn) {
      console.log("il n'y a pas de conn ou de peer")
      return
    }
    console.log('conn exists!')
    // Handle incoming data connection
    myPeer.on('connection', (conn) => {
      console.log('incoming peer connection!')
      conn.on('data', (data) => {
        console.log(`received: ${data}`)
      })
      conn.on('open', () => {
        console.log('open')
        conn.send('hello!')
      })
    })

    // c'est celui la AUSSI qui recoit la video du contact
    myPeer.on('call', (call) => {
      alert('vous recevez un appel')
      setIsCallAccepted(true)
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          call.answer(stream) // Answer the call with an A/V stream.
          // call.on('stream', (stream) => {
          //   addVideoStream(grandVideo.current, stream)
          // })
        })
        .catch((err) => {
          console.error('Failed to get local stream', err)
        })
    })

    return () => {
      myPeer.off('connection')
      myPeer.off('call')
      conn.off('data')
    }
  }, [myPeer, conn])

  // Functions

  useEffect(() => {
    // alert('baba')
    if (isCalling) {
      console.log('baaba')
      const connectToPeer = () => {
        socket.emit('callUser', {
          from: user.uid,
          to: actuallyContactId,
        })
        setIsCalling(true)

        playMyVideo(smallVideo)
        const connectionToAnotherPeer = myPeer.connect(actuallyContactId)
        setConn(connectionToAnotherPeer)
        connectionToAnotherPeer.on('data', (data) => {
          console.log(`received: ${data}`)
        })
        connectionToAnotherPeer.on('open', () => {
          connectionToAnotherPeer.send('hi!')
        })

        // c'est celui la qui recoit la video du contact
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((stream) => {
            let call = myPeer.call(actuallyContactId, stream)
            call.on('stream', (stream) => {
              addVideoStream(grandVideo.current, stream)
            })
          })
          .catch((err) => {
            console.log('Failed to get local stream', err)
          })
      }
      connectToPeer()
    }
  }, [isCalling, smallVideo])

  function playMyVideo(video) {
    console.log('video.current', video.current)
    video.current.muted = true
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        addVideoStream(video.current, stream)
      })
  }

  function addVideoStream(video, stream) {
    console.log('video.srcObject', video.srcObject)
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
      video.play()
    })
  }

  // met la musique d'appel si unn contact est appele et enleve si on ferme la fenetre
  useEffect(() => {
    if (musique2.current) {
      if (isCalling) {
        musique2.current.play()
      } else {
        musique2.current.pause()
      }
    }
  }, [musique2, isCalling])

  return (
    <PeerContext.Provider
      value={{
        myPeer,
        setMyPeer,
        isCalling,
        setIsCalling,
        isCallAccepted,
        setIsCallAccepted,
        conn,
        setConn,
        grandVideo,
        smallVideo,
        musique2,
      }}
    >
      {children}
    </PeerContext.Provider>
  )
}
