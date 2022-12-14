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
  const [conn, setConn] = useState(null)
  const [call, setCall] = useState(null)
  const grandVideo = useRef()
  const smallVideo = useRef()
  const musique2 = useRef()

  // ---------------- PEER -----------------------

  useEffect(() => {
    if (user !== null) {
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

    return () => {
      myPeer.off('connection')
      myPeer.off('call')
      conn.off('data')
    }
  }, [myPeer, conn])

  useEffect(() => {
    if (!myPeer) {
      return
    }
    // c'est celui la AUSSI qui recoit la video du contact
    myPeer.on('call', (call) => {
      // alert('vous recevez un appel')
      // setIsToastOpen(true)
      setIsCallAccepted(true)
      // set le call
      setCall(call)
      console.log('call', call)
      // eslint-disable-next-line no-restricted-globals
      const isCallAcceptedByMe = confirm(
        `${call.peer} vous appelle. Voulez vous repondre ?`
      )
      if (isCallAcceptedByMe) {
        setIsCallOpen(true)
        // alert('jaccepte lappel')
        call.on('stream', (stream) => {
          addVideoStream(grandVideo.current, stream)
        })
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((stream) => {
            call.answer(stream) // Answer the call with an A/V stream.
            playMyVideo(smallVideo)
          })
          .catch((err) => {
            console.error('Failed to get local stream', err)
          })
      } else {
        // raccroche
        call.close()
        console.log('call', call)
        // alert("je n'accepte pas l'appel")
      }
    })

    return () => {
      myPeer.off('call')
    }
  }, [myPeer, isCallAcceptedByMe])

  // Functions

  useEffect(() => {
    // alert('baba')
    if (isCalling) {
      console.log('baaba')
      const connectToPeer = () => {
        // socket.emit('callUser', {
        //   from: user.uid,
        //   to: actuallyContactId,
        // })

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
            // set le  call
            setCall(call)
            call.on('stream', (stream) => {
              // alert('le contact a recu ton appel')
              setIsCalling(false)
              setIsCallAccepted(true)
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
      console.log()
      if (isCalling) {
        musique2.current.play()
      } else {
        musique2.current.pause()
      }
    }
  }, [musique2, isCalling])

  function hangingUp() {
    call.close()
    stopStreamedVideo(smallVideo.current)
    stopStreamedVideo(grandVideo.current)
    // setIsCallOpen(false)
    setIsCalling(false)
    // setIsCallAccepted(false)
  }

  function stopStreamedVideo(videoElem) {
    const stream = videoElem.srcObject
    const tracks = stream.getTracks()
    console.log('tracks', tracks)

    tracks.forEach((track) => {
      track.stop()
      // track.enabled = false
    })
    console.log('tracks', tracks)

    videoElem.srcObject = null
    console.log('smallVideo.current', smallVideo.current)
    console.log('grandVideo.current', grandVideo.current)
  }

  useEffect(() => {
    if (call) {
      call.on('close', () => alert('appel fini'))
    }
  }, [call])

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
        conn,
        setConn,
        grandVideo,
        smallVideo,
        musique2,
        call,
        setCall,
        hangingUp,
      }}
    >
      {children}
    </PeerContext.Provider>
  )
}
