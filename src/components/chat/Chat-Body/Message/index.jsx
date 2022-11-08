import Check from '../../../../assets/img/check.svg'

export default function Message({ messageDisplay, myMessage, time }) {
  const justifyContentMsg = myMessage ? 'end' : 'start'
  const bgColorMsg = myMessage ? '#d9ffb5' : 'white'

  function convertTime(time) {
    if (isNaN(time)) {
      return ''
    }
    const date = new Date(time)
    return date.getHours() + ':' + date.getMinutes()
  }

  return (
    <div className={`w-100 d-flex justify-content-${justifyContentMsg} mb-1`}>
      <div
        className="rounded"
        style={{
          backgroundColor: bgColorMsg,
          boxShadow: ' 1px 1px 1px gray',
          position: 'relative',
          minWidth: '62px',
        }}
      >
        <div
          style={{
            overflowWrap: 'break-word',
            position: 'relative',
            whiteSpace: ' pre-wrap',
          }}
        >
          <p
            className="span-2 pb-0 px-1 mb-0 text-start"
            style={{
              maxWidth: '500px',
            }}
          >
            {messageDisplay}
          </p>
        </div>
        <div
          style={{
            padding: '7px 0px',
          }}
        >
          <div
            className="w-100 d-flex justify-content-end"
            style={{
              position: 'absolute',
              bottom: '-1px',
            }}
          >
            <span
              className="me-1"
              style={{
                fontSize: '0.8em',
                position: 'relative',
                top: '4px',
              }}
            >
              {convertTime(time)}
            </span>
            <div className="me-1">
              <span
                style={
                  {
                    // position: 'absolute',
                    // top: '-6px',
                    // left: '16px',
                  }
                }
              >
                {/* <svg
                  width="16"
                  height="11"
                  viewBox="0 0 16 11"
                  class=""
                  style={{
                    color: '#53bdeb',
                  }}
                >
                  <path
                    d="M11.071.653a.457.457 0 0 0-.304-.102.493.493 0 0 0-.381.178l-6.19 7.636-2.405-2.272a.463.463 0 0 0-.336-.146.47.47 0 0 0-.343.146l-.311.31a.445.445 0 0 0-.14.337c0 .136.047.25.14.343l2.996 2.996a.724.724 0 0 0 .501.203.697.697 0 0 0 .546-.266l6.646-8.417a.497.497 0 0 0 .108-.299.441.441 0 0 0-.19-.374L11.07.653Zm-2.45 7.674a15.31 15.31 0 0 1-.546-.355.43.43 0 0 0-.317-.12.46.46 0 0 0-.362.158l-.292.33a.482.482 0 0 0 .013.666l1.079 1.073c.135.135.3.203.495.203a.699.699 0 0 0 .552-.267l6.62-8.391a.446.446 0 0 0 .109-.298.487.487 0 0 0-.178-.375l-.355-.273a.487.487 0 0 0-.673.076L8.62 8.327Z"
                    fill="currentColor"
                  ></path>
                </svg> */}
                <svg
                  width="12"
                  height="11"
                  viewBox="0 0 12 11"
                  fill="none"
                  class=""
                >
                  <path
                    d="M11.155.653A.457.457 0 0 0 10.85.55a.493.493 0 0 0-.38.178L4.28 8.365 1.875 6.093a.463.463 0 0 0-.336-.146.47.47 0 0 0-.344.146l-.31.31a.445.445 0 0 0-.14.337c0 .136.046.25.14.343l2.995 2.996a.724.724 0 0 0 .502.203.697.697 0 0 0 .546-.266l6.646-8.417a.497.497 0 0 0 .108-.299.441.441 0 0 0-.19-.374l-.337-.273Z"
                    fill="currentcolor"
                  ></path>
                </svg>
                {/* <svg viewBox="0 0 16 15" width="16" height="15" class="">
                  <path
                    fill="currentColor"
                    d="M9.75 7.713H8.244V5.359a.5.5 0 0 0-.5-.5H7.65a.5.5 0 0 0-.5.5v2.947a.5.5 0 0 0 .5.5h.094l.003-.001.003.002h2a.5.5 0 0 0 .5-.5v-.094a.5.5 0 0 0-.5-.5zm0-5.263h-3.5c-1.82 0-3.3 1.48-3.3 3.3v3.5c0 1.82 1.48 3.3 3.3 3.3h3.5c1.82 0 3.3-1.48 3.3-3.3v-3.5c0-1.82-1.48-3.3-3.3-3.3zm2 6.8a2 2 0 0 1-2 2h-3.5a2 2 0 0 1-2-2v-3.5a2 2 0 0 1 2-2h3.5a2 2 0 0 1 2 2v3.5z"
                  ></path>
                </svg> */}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/*

            <svg
              width="16"
              height="11"
              viewBox="0 0 16 11"
              fill="none"
              class=""
            >
              <path
                d="M11.071.653a.457.457 0 0 0-.304-.102.493.493 0 0 0-.381.178l-6.19 7.636-2.405-2.272a.463.463 0 0 0-.336-.146.47.47 0 0 0-.343.146l-.311.31a.445.445 0 0 0-.14.337c0 .136.047.25.14.343l2.996 2.996a.724.724 0 0 0 .501.203.697.697 0 0 0 .546-.266l6.646-8.417a.497.497 0 0 0 .108-.299.441.441 0 0 0-.19-.374L11.07.653Zm-2.45 7.674a15.31 15.31 0 0 1-.546-.355.43.43 0 0 0-.317-.12.46.46 0 0 0-.362.158l-.292.33a.482.482 0 0 0 .013.666l1.079 1.073c.135.135.3.203.495.203a.699.699 0 0 0 .552-.267l6.62-8.391a.446.446 0 0 0 .109-.298.487.487 0 0 0-.178-.375l-.355-.273a.487.487 0 0 0-.673.076L8.62 8.327Z"
                fill="currentColor"
              ></path>
            </svg>
            */

/*
            <div
          className="row w-100 m-0"
          style={
            {
              // height: '15px',
            }
          }
        >
          <div className="col "></div>
          <div className="col-3 ">
            <p
              className="m-0"
              style={{
                fontSize: '0.7em',
                // lineHeight: '1px',
              }}
            >
              12:03
            </p>
          </div>
          <div className="col-4 position-relative">
            <span style={{ position: 'absolute', top: '-6px', left: '16px' }}>
              <svg
                width="12"
                height="11"
                viewBox="0 0 12 11"
                fill="none"
                class=""
              >
                <path
                  d="M11.155.653A.457.457 0 0 0 10.85.55a.493.493 0 0 0-.38.178L4.28 8.365 1.875 6.093a.463.463 0 0 0-.336-.146.47.47 0 0 0-.344.146l-.31.31a.445.445 0 0 0-.14.337c0 .136.046.25.14.343l2.995 2.996a.724.724 0 0 0 .502.203.697.697 0 0 0 .546-.266l6.646-8.417a.497.497 0 0 0 .108-.299.441.441 0 0 0-.19-.374l-.337-.273Z"
                  fill="currentcolor"
                ></path>
              </svg>
            </span>
          </div>
        </div>*/
