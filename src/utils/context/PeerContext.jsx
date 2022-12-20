/* eslint-disable react-hooks/exhaustive-deps */
import Peer from 'peerjs'
import React, { useState, createContext } from 'react'
import { useContext } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'

import { v4 as uuidv4 } from 'uuid'
import socket from '../socket.io'
import { UserAuth } from './AuthContext'
import { SocketContactContext } from './SocketContact'
import { ThemeContext } from './ThemeContext'

export const PeerContext = createContext()

let video = true

export const PeerProvider = ({ children }) => {
  const { user } = UserAuth()
  const { actuallyContactId } = useContext(SocketContactContext)
  const { setIsToastOpen, setIsCallOpen } = useContext(ThemeContext)
  const [myPeer, setMyPeer] = useState(null)
  const [isCalling, setIsCalling] = useState(false)
  const [isCallAccepted, setIsCallAccepted] = useState(false)
  const [call, setCall] = useState(null)
  const [isVideoCall, setIsVideoCall] = useState(true)
  const [myStream, setMyStream] = useState(null)
  const [isCameraActive, setIsCameraActive] = useState(true)
  const [isMicroActive, setIsMicroActive] = useState(true)
  const [callObj, setCallObj] = useState(null)
  const [isFinishedCall, setIsFinishedCall] = useState(false)
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
      // console.log("il n'y a pas de peer")
      return
    }
    myPeer.on('open', (id) => {
      // console.log('My peer ID is: ' + id)
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
      // console.log('call', call)
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
    // request authorization to use the camera and the microphone and if so then call the contact
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((myStream) => {
        // save my streams
        setMyStream(myStream)
        // if the call is in audio only then deactivate the video of the stream
        setIsVideoCall((isVideoCall) => {
          if (!isVideoCall) {
            stopMyVideoStream(myStream)
          }
          return isVideoCall
        })
        // open call display
        setIsCallOpen(true)
        // create object of call and send the type of video in metadata (from the variable above the 'peerProvider' component)
        const call = myPeer.call(actuallyContactId, myStream, {
          metadata: { video: video },
        })
        // set the call in 'setCall'
        setCall(call)
        // I am calling and so the outgoing call music is activated
        setIsCalling(true)
        // if call exists so emit socket of this call
        if (call) {
          emitSocketCallContact(user.uid, actuallyContactId, setCallObj)
        }
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
        // if the call is in audio only then deactivate the video of the stream
        setIsVideoCall((isVideoCall) => {
          if (!isVideoCall) {
            stopMyVideoStream(myStream)
          }
          return isVideoCall
        })
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
    setMyStream(null)
    setCall(null)
    // socket
    emitSocketHangUp(callObj, setCallObj)
  }

  function muteMyVideo() {
    stopMyVideoStream(myStream)
    setIsCameraActive(!isCameraActive)
  }

  function muteMyAudio() {
    stopMyAudioStream(myStream)
    setIsMicroActive(!isMicroActive)
  }

  function swapVideo() {
    if (smallVideo.current && grandVideo.current) {
      changeVideoLocation(smallVideo.current, grandVideo.current)
    }
  }

  /* small clarification concerning the two functions that will follow ('videoCall' and 'audioCall'): I needed to add a video variable to that of 'setIsVideoCall' because in the 'callTheContact' function I need the immediate result of this condition to send it in metadata, or with 'setIsVideoCall' the result is not immediate but only at the next rendering (see React doc) */

  function videoCall() {
    video = true
    setIsVideoCall(true)
    setIsCameraActive(true)
    callTheContact()
  }

  function audioCall() {
    video = false
    setIsVideoCall(false)
    setIsCameraActive(false)
    callTheContact()
  }

  // ----------------------------------- SOCKET ----------------------

  // SOCKET - call contact you
  useEffect(() => {
    socket.on('call contact you', (data) => {
      console.log('call data', data)
      setCallObj({ ...data })
      /*STRANGE - I have to use a new state 'isFinishedCall' because if I use the 'hangingUp' function directly then socket.io creates a new user. don't ask me why I have no idea.*/
      if (data.callStatus === 'finished') {
        setIsFinishedCall(true)
      }
    })

    return () => {
      socket.off('call contact you')
    }
  })

  useEffect(() => {
    if (isFinishedCall) {
      if (setIsToastOpen && !isCallAccepted) {
        setIsToastOpen(false)
      } else {
        hangingUp()
      }
      setIsFinishedCall(false)
    }
  }, [isFinishedCall])

  return (
    <PeerContext.Provider
      value={{
        isCalling,
        setIsCalling,
        isCallAccepted,
        setIsCallAccepted,
        grandVideo,
        smallVideo,
        ringtone,
        call,
        setCall,
        hangingUp,
        pickUp,
        muteMyVideo,
        muteMyAudio,
        swapVideo,
        isCameraActive,
        isMicroActive,
        setIsVideoCall,
        videoCall,
        audioCall,
      }}
    >
      {children}
    </PeerContext.Provider>
  )
}

function playMyVideo(video, stream) {
  // console.log('video', video)
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

function stopAllMyStreams(stream) {
  // get all streams
  // console.log('stream', stream)
  const tracks = stream.getTracks()
  // stop them as well as remove them
  tracks.forEach((track) => {
    track.stop()
    track.enabled = false
  })
}

function stopMyVideoStream(stream) {
  const tracks = stream.getTracks()
  const videoTrack = tracks.find((track) => track.kind === 'video')
  videoTrack.enabled = !videoTrack.enabled
}

function stopMyAudioStream(stream) {
  const tracks = stream.getTracks()
  const audioTrack = tracks.find((track) => track.kind === 'audio')
  audioTrack.enabled = !audioTrack.enabled
}

function changeVideoLocation(video1, video2) {
  const srcObjectVideo1 = video1.srcObject
  const srcObjectVideo2 = video2.srcObject
  video1.srcObject = srcObjectVideo2
  video2.srcObject = srcObjectVideo1
}

function emitSocketCallContact(myId, contactId, setCallObj) {
  const callObj = {
    from: myId,
    to: contactId,
    id: uuidv4(),
    videoCall: video,
    callStatus: 'calling',
    time: Date.now(),
  }
  setCallObj({ ...callObj })
  socket.emit('call contact', callObj)
}

function emitSocketHangUp(callObj, setCallObj) {
  const newCallObj = {
    ...callObj,
    callStatus: 'finished',
    time: Date.now(),
  }
  console.log('newCallObj', newCallObj)
  setCallObj(newCallObj)
  socket.emit('call contact', newCallObj)
}
