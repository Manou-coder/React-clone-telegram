import React, { useContext } from 'react'
import { MessagesContext } from '../../utils/context/MessagesContext'
import { ThemeContext } from '../../utils/context/ThemeContext'

export default function OffCanvasBottom() {
  const { theme } = useContext(ThemeContext)
  const { imageToDisplay } = useContext(MessagesContext)
  const bgColor2 = theme === 'light' ? 'bg-light' : 'bg-dark'

  return (
    <>
      <div
        class={`offcanvas offcanvas-bottom ${bgColor2}`}
        tabindex="-1"
        id="offcanvasBottom"
        aria-labelledby="offcanvasBottomLabel"
        style={{
          height: '100%',
          color: theme === 'light' ? 'black' : 'white',
        }}
      >
        <div class="offcanvas-header">
          <h5 class="offcanvas-title" id="offcanvasBottomLabel">
            {' '}
          </h5>
          <button
            type="button"
            class="btn-close bg-light"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div
          class="offcanvas-body small"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div className="w-100 h-100 d-flex flex-column justify-content-center ">
            <img
              style={{
                margin: '0 auto',
                width: '100%',
                maxWidth: '600px',
                maxHeight: '100%',
                objectFit: 'contain',
              }}
              src={imageToDisplay.src}
              alt=""
            ></img>
            {/* <span style={{ textAlign: 'center' }}>{imageToDisplay.name}</span> */}
          </div>
        </div>
      </div>
    </>
  )
}
