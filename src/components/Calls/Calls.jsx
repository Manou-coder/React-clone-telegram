import { Peer } from 'peerjs'
import React from 'react'
import { useContext } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useRef } from 'react'
import { UserAuth } from '../../utils/context/AuthContext'
import { SocketContactContext } from '../../utils/context/SocketContact'
import { ThemeContext } from '../../utils/context/ThemeContext'
import { imgError } from '../../utils/functions/returnAvatarIsImgError'
import socket from '../../utils/socket.io'
import SoundOutgoingCall from '../../assets/sound/appel-sortant.m4a'

export default function Calls() {
  const { user } = UserAuth()
  const { actuallyContactId, myPeer, setMyPeer, allUsers } =
    useContext(SocketContactContext)
  const { setIsCallOpen } = useContext(ThemeContext)
  const grandVideo = useRef()
  const smallVideo = useRef()
  const musique2 = useRef()

  const [conn, setConn] = useState(null)
  const [isCalling, setIsCalling] = useState(null)

  const contact =
    allUsers && allUsers.find((e) => e.userId === actuallyContactId)

  console.log('contact', contact)

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

    // c'est celui la AUSSI qui recoit la video du contact
    myPeer.on('call', (call) => {
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

  function connectToPeer() {
    socket.emit('callUser', {
      from: user.uid,
      to: actuallyContactId,
    })
    setIsCalling(true)

    playMyVideo()
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

  function playMyVideo() {
    musique2.current.play()
    console.log('smallVideo.current', smallVideo.current)
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
    console.log('video.srcObject', video.srcObject)
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
      video.play()
    })
  }

  const displayVideo = isCalling ? '' : 'd-none'
  const displayConatct = isCalling ? 'd-none' : ''

  return (
    <>
      <audio
        src={SoundOutgoingCall}
        type="audio/mpeg"
        autoplay
        ref={musique2}
      ></audio>
      <div
        style={{
          position: 'fixed',
          zIndex: '10000',
          left: '0',
          top: '0',
          width: '100%',
          height: '100%',
          overflow: 'auto',
          backgroundColor: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(4px)',
        }}
      >
        <div className="w-100 h-100 d-flex justify-content-center align-items-center">
          <span
            role={'button'}
            style={{ position: 'absolute', top: '0px', right: '10px' }}
            onClick={() => {
              musique2.current.pause()
              setIsCallOpen(false)
            }}
          >
            <svg
              style={{
                fill: 'black',
                height: '50px',
              }}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
            >
              <path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z" />
            </svg>
          </span>
          {/* media query in style.css (change height for 100% to 80%) */}
          <div id="video-container" className="col-12 col-lg-4 rounded">
            <button
              className="position-absolute "
              onClick={() => connectToPeer()}
            >
              APPEL
            </button>
            {/* DISPLAY ONLY IF IS CALLING TRUE */}
            <div
              className={displayVideo}
              id="video"
              style={{ height: '100%', position: 'relative' }}
            >
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
            {/* DISPLAY ONLY IF IS CALLING FALSE */}
            <div
              className={
                'h-100 d-flex justify-content-center align-items-center ' +
                displayConatct
              }
            >
              <div className="d-flex flex-column align-items-center gap-2">
                <img
                  style={{
                    width: '150px',
                    height: '150px',
                  }}
                  onError={(e) => imgError(e.target)}
                  className="rounded-circle"
                  src={contact.photoURL}
                  alt="avatar-contact"
                />
                <div className="text-center text-light">
                  <h1>{contact.displayName}</h1>
                  <h2>Appel en cours ...</h2>
                </div>
              </div>
            </div>
            <div
              id="menu-phone"
              style={{
                position: 'absolute',
                bottom: '40px',
                left: '',
                backgroundColor: '',
                height: '100px',
              }}
              className="d-flex"
            >
              <ButtonPhone
                name={'video'}
                buttonBgColor={'rgb(0,0,0, 0.2)'}
                svgSrc={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height={'30px'}
                    viewBox="0 0 576 512"
                    fill="white"
                  >
                    <path d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2V384c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1V320 192 174.9l14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z" />
                  </svg>
                }
              />
              <ButtonPhone
                name={'swap'}
                buttonBgColor={'rgb(0,0,0, 0.2)'}
                svgSrc={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height={'30px'}
                    viewBox="0 0 576 512"
                    fill="white"
                  >
                    <path d="M142.9 142.9c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H463.5c0 0 0 0 0 0H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5c7.7-21.8 20.2-42.3 37.8-59.8zM16 312v7.6 .7V440c0 9.7 5.8 18.5 14.8 22.2s19.3 1.7 26.2-5.2l41.6-41.6c87.6 86.5 228.7 86.2 315.8-1c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.2 62.2-162.7 62.5-225.3 1L185 329c6.9-6.9 8.9-17.2 5.2-26.2s-12.5-14.8-22.2-14.8H48.4h-.7H40c-13.3 0-24 10.7-24 24z" />
                  </svg>
                }
              />
              <ButtonPhone
                name={'micro'}
                buttonBgColor={'rgb(0,0,0)'}
                svgSrc={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height={'30px'}
                    fill="rgb(255,255,255, 0.7)"
                    viewBox="0 0 640 512"
                  >
                    <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L472.1 344.7c15.2-26 23.9-56.3 23.9-88.7V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 21.2-5.1 41.1-14.2 58.7L416 300.8V96c0-53-43-96-96-96s-96 43-96 96v54.3L38.8 5.1zM344 430.4c20.4-2.8 39.7-9.1 57.3-18.2l-43.1-33.9C346.1 382 333.3 384 320 384c-70.7 0-128-57.3-128-128v-8.7L144.7 210c-.5 1.9-.7 3.9-.7 6v40c0 89.1 66.2 162.7 152 174.4V464H248c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H344V430.4z" />
                  </svg>
                }
              />
              <ButtonPhone
                name={'telephone'}
                buttonBgColor={'red'}
                svgSrc={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height={'30px'}
                    fill="rgb(255,255,255)"
                    viewBox="0 0 640 512"
                    style={{
                      rotate: '135deg',
                      position: 'absolute',
                      top: '20px',
                      left: '10px',
                    }}
                  >
                    <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" />
                  </svg>
                }
              />
            </div>
          </div>
        </div>
      </div>
      <div></div>
    </>
  )
}

const ButtonPhone = ({ buttonBgColor, svgSrc }) => {
  return (
    <div className="col d-flex justify-content-center align-items-center">
      <span
        style={{
          backgroundColor: buttonBgColor,
          width: '60px',
          height: '60px',
          borderRadius: '30px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          position: 'relative',
        }}
      >
        {svgSrc}
      </span>
    </div>
  )
}
