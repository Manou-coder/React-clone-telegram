import { useState } from 'react'

function MessageBar() {
  const alignCenter =
    'row bg-white rounded-5 py-1 w-100 w-lg-75 align-items-center'
  const alignBaseline = alignCenter.replace(
    'align-items-center',
    'align-items-baseline'
  )

  const [classNameBar, setClassNameBar] = useState(alignCenter)

  function autoResizeBar(event) {
    event.style.height = 'auto'
    event.style.height = event.scrollHeight + 'px'
    if (event.scrollHeight > 30) {
      setClassNameBar(alignBaseline)
    } else {
      setClassNameBar(alignCenter)
    }
  }

  return (
    <div className="row sticky-bottom py-1 bg-light w-100 m-0 p-0">
      <div className="col py-1 d-flex justify-content-center">
        <div
          className={classNameBar}
          style={{ position: 'relative', bottom: '2px' }}
        >
          <div className="col-1 d-flex justify-content-start">
            <span>
              <i className="fa-solid fa-face-smile fa-lg"></i>
            </span>
          </div>
          <div className="d-none d-lg-block col-1 d-flex justify-content-start">
            <span>
              <i className="fa-solid fa-paperclip fa-lg"></i>
            </span>
          </div>
          <div className="col">
            <textarea
              id="autoresizing"
              onInput={(e) => autoResizeBar(e.target)}
              rows="1"
              placeholder="Messsage..."
              style={{
                position: 'relative',
                border: 'none',
                outline: 'none',
                resize: 'none',
                width: '100%',
                bottom: '-2px',
              }}
            ></textarea>
          </div>
          <div className="col-1 d-flex justify-content-end">
            <span>
              <i className="fa-solid fa-paper-plane fa-lg"></i>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessageBar
