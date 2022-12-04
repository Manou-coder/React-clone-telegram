import React from 'react'

export default function Calls() {
  //   const videoGrid = document.getElementById('video-grid')
  const myVideo = document.getElementById('my-video')
  //   myVideo.muted = true

  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: true,
    })
    .then((stream) => {
      addVideoStream(myVideo, stream)
    })

  function addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
      video.play()
    })
    // videoGrid.append(video)
  }
  return (
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
        <div id="phone" className="bg-light h-75 w-50 rounded">
          <div id="video" style={{ height: '100%' }}>
            <video
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              id="my-video"
              src=""
            ></video>
          </div>
        </div>
      </div>
    </div>
  )
}
