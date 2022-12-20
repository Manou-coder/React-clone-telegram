import React, { useContext, useRef } from 'react'
import { SocketContactContext } from '../../utils/context/SocketContact'
import { imgError } from '../../utils/functions/returnAvatarIsImgError'
import RingtoneIncomingCall from '../../assets/sound/Redmi-Note-8-Pro.mp3'
import { useEffect } from 'react'
import Croix from '../../assets/svg/croix.svg'
import { ThemeContext } from '../../utils/context/ThemeContext'
import { PeerContext } from '../../utils/context/PeerContext'
import { LanguageContext } from '../../utils/context/LanguageContext'

export default function Toast() {
  const { setIsToastOpen } = useContext(ThemeContext)
  const { language } = useContext(LanguageContext)
  const ringtone = useRef()
  const { allUsers } = useContext(SocketContactContext)
  const { pickUp, call, setIsVideoCall, hangingUpToast } =
    useContext(PeerContext)

  // this contact is defined by the id of the peer contact who is calling
  const contact = allUsers && allUsers.find((e) => e.userId === call.peer)

  const isVideoCallFromContact = call.metadata.video

  const typeOfCall = isVideoCallFromContact
    ? _video[language]
    : _audio[language]

  return (
    <>
      <audio
        src={RingtoneIncomingCall}
        type="audio/mpeg"
        autoPlay
        loop
        ref={ringtone}
      ></audio>

      <div
        className="col-11 col-lg-3 rounded shadow py-2"
        style={{
          position: 'absolute',
          zIndex: '10000',
          top: '10px',
          right: ' 10px',
          backgroundColor: 'white',
        }}
      >
        <div className="d-flex align-items-center mb-2">
          <div className="col-2 ps-1">
            <img
              style={{ height: '30px', width: '30px' }}
              src={contact && contact.photoURL}
              onError={(e) => imgError(e.target)}
              className="rounded-circle"
              alt="..."
            ></img>
          </div>
          <div className="col">
            <strong className="">
              {contact &&
                contact.displayName +
                  ' ' +
                  _callYou[language] +
                  typeOfCall +
                  '...'}
            </strong>
          </div>
          <div
            className="col-1"
            style={{ cursor: 'pointer' }}
            onClick={() => setIsToastOpen(false)}
          >
            <img src={Croix} height="30px" alt=".." />
          </div>
        </div>
        <div className="d-flex justify-content-between">
          <div>
            <button
              onClick={() => {
                setIsVideoCall(false)
                pickUp()
                setIsToastOpen(false)
              }}
              className="btn btn-success btn-sm me-1"
            >
              <svg
                style={{
                  marginRight: '10px',
                  position: 'relative',
                  top: '-2px',
                }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                height="1.20em"
                fill="white"
              >
                <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" />
              </svg>
              {_audio[language]}
            </button>
            <button
              onClick={() => {
                setIsVideoCall(true)
                pickUp()
                setIsToastOpen(false)
              }}
              className="btn btn-success btn-sm"
            >
              <svg
                style={{
                  marginRight: '10px',
                  position: 'relative',
                  top: '-2px',
                }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                height="1.20em"
                fill="white"
              >
                <path d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2V384c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1V320 192 174.9l14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z" />
              </svg>
              {_video[language]}
            </button>
          </div>
          <button
            onClick={() => {
              // setIsToastOpen(false)
              hangingUpToast()
            }}
            className="btn btn-danger btn-sm "
          >
            {_hangUp[language]}
          </button>
        </div>
      </div>
    </>
  )
}

// LANGUAGE

const _audio = {
  en: 'Audio',
  fr: 'Audio',
  il: 'אודיו',
}

const _video = {
  en: 'Video',
  fr: 'Vidéo',
  il: 'וידאו',
}

const _hangUp = {
  en: 'Hang up',
  fr: 'Raccrocher',
  il: 'לסרב',
}

const _callYou = {
  en: 'call you on ',
  fr: 'vous appelle en ',
  il: 'מתקשר אליך ב',
}
