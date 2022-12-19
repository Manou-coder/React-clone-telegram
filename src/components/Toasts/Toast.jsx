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
  const { pickUp, call } = useContext(PeerContext)

  // this contact is defined by the id of the peer contact who is calling
  const contact = allUsers && allUsers.find((e) => e.userId === call.peer)

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
              {contact && contact.displayName + ' ' + _isCallingYou[language]}
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
          <button
            onClick={() => {
              setIsToastOpen(false)
            }}
            className="btn btn-danger btn-sm "
          >
            {_hangUp[language]}
          </button>
          <button
            onClick={() => {
              pickUp()
              setIsToastOpen(false)
            }}
            className="btn btn-success btn-sm "
          >
            {_pickUp[language]}
          </button>
        </div>
      </div>
    </>
  )
}

// LANGUAGE

const _pickUp = {
  en: 'Pick Up',
  fr: 'Décrocher',
  il: 'לענות',
}
const _hangUp = {
  en: 'Hang up',
  fr: 'Raccrocher',
  il: 'לסרב',
}

const _isCallingYou = {
  en: 'is calling you...',
  fr: 'vous appelle...',
  il: 'מתקשר אליך...',
}
