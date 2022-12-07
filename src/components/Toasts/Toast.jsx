import React, { useContext, useRef } from 'react'
import { SocketContactContext } from '../../utils/context/SocketContact'
import { imgError } from '../../utils/functions/returnAvatarIsImgError'
import Ringtone from '../../assets/sound/Redmi-Note-8-Pro.mp3'
import { useEffect } from 'react'

export default function Toast() {
  const musique = useRef()
  const { actuallyContactId, allUsers } = useContext(SocketContactContext)
  const contact =
    allUsers && allUsers.find((e) => e.userId === actuallyContactId)

  useEffect(() => {
    if (musique.current) {
      //   setTimeout(() => {
      //     musique.current.play()
      //   }, 2000)
    }
  }, [musique.current])
  return (
    <>
      <audio src={Ringtone} type="audio/mpeg" autoplay ref={musique}></audio>

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
        {/* <audio controls={true} autoPlay ref={musique}>
          <source src={Ringtone} type="audio/mpeg" />
        </audio> */}
        <div className="align-items-center mb-2">
          <img
            style={{ height: '30px', width: '30px' }}
            src={contact && contact.photoURL}
            onError={(e) => imgError(e.target)}
            className="rounded-circle"
            alt="..."
          ></img>
          <strong className="ms-2">
            {contact && contact.displayName} vous appelle...
          </strong>
        </div>
        <div className="d-flex justify-content-between">
          <button className="btn btn-danger btn-sm ">Raccrocher</button>
          <button className="btn btn-success btn-sm ">Décrocher</button>
        </div>
      </div>
    </>
  )
}
