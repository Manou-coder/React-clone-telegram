import { Peer } from 'peerjs'
import React from 'react'
import { useContext } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useRef } from 'react'
import { UserAuth } from '../../utils/context/AuthContext'
import { SocketContactContext } from '../../utils/context/SocketContact'
import { ThemeContext } from '../../utils/context/ThemeContext'

export default function Calls() {
  const { user } = UserAuth()
  const { actuallyContactId, myPeer, setMyPeer } =
    useContext(SocketContactContext)
  const { setIsCallOpen } = useContext(ThemeContext)
  const grandVideo = useRef()
  const smallVideo = useRef()

  const [conn, setConn] = useState(null)

  useEffect(() => {
    console.log('myPeer', myPeer)
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

    myPeer.on('call', (call) => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          call.answer(stream) // Answer the call with an A/V stream.
          call.on('stream', (stream) => {
            addVideoStream(grandVideo.current, stream)
          })
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

  let renderVideo = (stream) => {
    console.log('stream', stream)
    console.log('grandVideo.current.src', grandVideo.current.src)
    grandVideo.current.src = stream
  }

  function connectToPeer() {
    playMyVideo()
    const connectionToAnotherPeer = myPeer.connect(actuallyContactId)
    setConn(connectionToAnotherPeer)
    connectionToAnotherPeer.on('data', (data) => {
      console.log(`received: ${data}`)
    })
    connectionToAnotherPeer.on('open', () => {
      connectionToAnotherPeer.send('hi!')
    })

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

  function playMyVideo() {
    smallVideo.current.muted = true
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        addVideoStream(smallVideo.current, stream)
      })
  }

  function addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
      video.play()
    })
  }
  return (
    <>
      <div
        style={{
          position: 'fixed',
          zIndex: '10000',
          // paddingTop: '100px',
          left: '0',
          top: '0',
          width: '100%',
          height: '100%',
          overflow: 'auto',
          backgroundColor: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(4px)',
          // -webkit-backdrop-filter: 'blur(4px)',
        }}
      >
        <div className="w-100 h-100 d-flex justify-content-center align-items-center">
          <button
            style={{ position: 'absolute', top: '0px', right: '0px' }}
            onClick={() => setIsCallOpen(false)}
          >
            Close
          </button>
          <button onClick={() => connectToPeer()}>APPEL</button>
          <input type={'text'} id="input-peer"></input>
          <div id="phone" className="bg-light h-75 w-50 rounded">
            <div id="video" style={{ height: '100%', position: 'relative' }}>
              <video
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '5px',
                }}
                ref={grandVideo}
                src=""
              ></video>
              <video
                style={{
                  position: 'absolute',
                  bottom: '5px',
                  right: '5px',
                  width: '25%',
                  height: '50%',
                  objectFit: 'cover',
                  borderRadius: '5px',
                }}
                ref={smallVideo}
                src=""
              ></video>
            </div>
          </div>
        </div>
      </div>
      <div></div>
    </>
  )
}
