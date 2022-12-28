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
import RingtoneOutgoingCall from '../../assets/sound/appel-sortant.m4a'
import Croix from '../../assets/svg/croix.svg'
import Expand from '../../assets/svg/expand.svg'
import { PeerContext } from '../../utils/context/PeerContext'
import { LanguageContext } from '../../utils/context/LanguageContext'

export default function Calls() {
  const { user } = UserAuth()
  const { actuallyContactId, allUsers } = useContext(SocketContactContext)
  const {
    call,
    isCallAccepted,
    ringtone,
    grandVideo,
    smallVideo,
    hangingUp,
    muteMyVideo,
    muteMyAudio,
    swapVideo,
    isCameraActive,
    isMicroActive,
    isContactHangingUp,
    isContactNotAnswer,
  } = useContext(PeerContext)
  const { language } = useContext(LanguageContext)

  // const contact =
  //   allUsers && allUsers.find((e) => e.userId === actuallyContactId)

  // this contact is defined by the id of the peer contact who is calling
  if (!call) {
    return
  }
  const contact = allUsers && allUsers.find((e) => e.userId === call.peer)

  const displayVideo = isCallAccepted ? '' : 'd-none'
  const displayContact = isCallAccepted ? 'd-none' : ''

  return (
    <>
      <audio
        src={RingtoneOutgoingCall}
        type="audio/mpeg"
        loop
        ref={ringtone}
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
          {/* isContactHangingUp */}
          {isContactHangingUp && (
            <div style={{ zIndex: '30000', position: 'absolute' }}>
              <h2 className="text-white">{`${contact && contact.displayName} ${
                _hangUp[language]
              }`}</h2>
            </div>
          )}
          {/* media query in style.css (change height for 100% to 80%) */}
          <div
            id="video-container"
            className="col-12 col-lg-4 rounded position-relative"
          >
            {/* CLOSE */}
            <span onClick={() => hangingUp()}>
              <img
                src={Croix}
                alt="close"
                style={{
                  height: '30px',
                  cursor: 'pointer',
                  position: 'absolute',
                  zIndex: '20000',
                  top: '0px',
                  right: '5px',
                }}
              />
            </span>
            {/* EXPAND */}
            <span className="d-none d-lg-block">
              <img
                src={Expand}
                alt="expand"
                style={{
                  height: '25px',
                  cursor: 'pointer',
                  position: 'absolute',
                  zIndex: '20000',
                  top: '4px',
                  left: '5px',
                }}
              />
            </span>
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
                  minWidth: '130px',
                  width: '25%',
                  height: '40%',
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
                displayContact
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
                  src={contact && contact.photoURL}
                  alt="avatar-contact"
                />
                <div className="text-center text-light">
                  <h1>{contact && contact.displayName}</h1>
                  <h3>
                    {!isContactNotAnswer
                      ? _callInProgress[language]
                      : `${contact && contact.displayName} ${
                          _DoNotAnswer[language]
                        }`}
                  </h3>
                </div>
              </div>
            </div>
            <div
              id="menu-phone"
              style={{
                position: 'absolute',
                bottom: '0px',
                left: '',
                backgroundColor: '',
                height: '100px',
                width: '100%',
              }}
              className="d-flex"
            >
              <ButtonPhone
                name={'video'}
                onClick={() => muteMyVideo()}
                buttonBgColor={isCameraActive ? 'black' : 'rgb(0,0,0, 0.2)'}
                svgSrc={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height={'40px'}
                    viewBox="0 0 256 256"
                    fill={isCameraActive ? 'rgb(255,255,255, 0.7)' : 'white'}
                  >
                    {isCameraActive ? Camera_slash : Camera}
                  </svg>
                }
              />
              <ButtonPhone
                name={'swap'}
                onClick={() => swapVideo()}
                buttonBgColor={'rgb(0,0,0, 0.2)'}
                svgSrc={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height={'30px'}
                    viewBox="0 0 512 512"
                    fill="white"
                  >
                    <path d="M142.9 142.9c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H463.5c0 0 0 0 0 0H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5c7.7-21.8 20.2-42.3 37.8-59.8zM16 312v7.6 .7V440c0 9.7 5.8 18.5 14.8 22.2s19.3 1.7 26.2-5.2l41.6-41.6c87.6 86.5 228.7 86.2 315.8-1c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.2 62.2-162.7 62.5-225.3 1L185 329c6.9-6.9 8.9-17.2 5.2-26.2s-12.5-14.8-22.2-14.8H48.4h-.7H40c-13.3 0-24 10.7-24 24z" />
                  </svg>
                }
              />
              <ButtonPhone
                name={'micro'}
                onClick={() => muteMyAudio()}
                buttonBgColor={isMicroActive ? 'black' : 'rgb(0,0,0, 0.2)'}
                svgSrc={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height={'30px'}
                    fill={isMicroActive ? 'rgb(255,255,255, 0.7)' : 'white'}
                    viewBox={isMicroActive ? '0 0 640 512' : '0 0 384 512'}
                  >
                    {isMicroActive ? Micro_slash : Micro}
                  </svg>
                }
              />
              <ButtonPhone
                onClick={() => hangingUp()}
                name={'telephone'}
                buttonBgColor={'red'}
                svgSrc={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height={'40px'}
                    fill="rgb(255,255,255)"
                    viewBox="0 0 640 640"
                    style={{
                      rotate: '135deg',
                      position: 'absolute',
                      left: '4px',
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

const ButtonPhone = ({ buttonBgColor, svgSrc, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="col d-flex justify-content-center align-items-center"
    >
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

const Camera = (
  <path d="M176,92v96a16.01833,16.01833,0,0,1-16,16H48A40.04584,40.04584,0,0,1,8,164V68A16.01833,16.01833,0,0,1,24,52H136A40.04584,40.04584,0,0,1,176,92Zm68.01562-18.91895a8.00341,8.00341,0,0,0-7.98437-.02734l-40,22.85742A8,8,0,0,0,192,102.85742v50.28516a8,8,0,0,0,4.03125,6.94629l40,22.85742A8.0003,8.0003,0,0,0,248,176V80A7.99807,7.99807,0,0,0,244.01562,73.08105Z" />
)

const Camera_slash = (
  <path d="M246.02344,69.62109a12.001,12.001,0,0,0-11.97754-.04l-38.063,21.75A44.043,44.043,0,0,0,152,48H121.69531a12,12,0,0,0,0,24H152a20.02229,20.02229,0,0,1,20,20v64.96094L43.78809,15.92773A11.99986,11.99986,0,0,0,26.03027,32.07227L40.51,48H24A20.02229,20.02229,0,0,0,4,68v96a44.04978,44.04978,0,0,0,44,44H176a19.85,19.85,0,0,0,8.303-1.82764l30.81811,33.89991a11.99986,11.99986,0,0,0,17.75782-16.14454L196,183.36084V164.67822L234.0459,186.419A12.00009,12.00009,0,0,0,252,176V80A12.00171,12.00171,0,0,0,246.02344,69.62109ZM48,184a20.02229,20.02229,0,0,1-20-20V72H62.32812L164.14624,184Zm180-28.67773-32-18.28614V118.96387l32-18.28614Z" />
)

const Micro = (
  <path d="M192 0C139 0 96 43 96 96V256c0 53 43 96 96 96s96-43 96-96V96c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 89.1 66.2 162.7 152 174.4V464H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H216V430.4c85.8-11.7 152-85.3 152-174.4V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 70.7-57.3 128-128 128s-128-57.3-128-128V216z" />
)

const Micro_slash = (
  <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L472.1 344.7c15.2-26 23.9-56.3 23.9-88.7V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 21.2-5.1 41.1-14.2 58.7L416 300.8V96c0-53-43-96-96-96s-96 43-96 96v54.3L38.8 5.1zM344 430.4c20.4-2.8 39.7-9.1 57.3-18.2l-43.1-33.9C346.1 382 333.3 384 320 384c-70.7 0-128-57.3-128-128v-8.7L144.7 210c-.5 1.9-.7 3.9-.7 6v40c0 89.1 66.2 162.7 152 174.4V464H248c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H344V430.4z" />
)

// Language

const _hangUp = {
  en: 'Hang up',
  fr: 'a raccroché',
  il: 'ניתק',
}

const _callInProgress = {
  en: 'Call in progress ...',
  fr: 'Appel en cours ...',
  il: 'מתקשר ...',
}

const _DoNotAnswer = {
  en: 'do not answer',
  fr: 'ne répond pas',
  il: 'לא עונה',
}
