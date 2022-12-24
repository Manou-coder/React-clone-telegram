import { useContext } from 'react'
import Check from '../../../../assets/img/check.svg'
import { UserAuth } from '../../../../utils/context/AuthContext'
import { LanguageContext } from '../../../../utils/context/LanguageContext'
import { ThemeContext } from '../../../../utils/context/ThemeContext'
import { useComponentVisibleRightClick } from '../../../../utils/functions/useHandleClickOutside'
import MessageMenu from '../MessageMenu'

let offsetX = 0
let offsetY = 0

export default function Message({
  content,
  myMessage,
  time,
  status,
  badgeTime,
  messageId,
}) {
  const { user } = UserAuth()
  const { language } = useContext(LanguageContext)
  const { theme } = useContext(ThemeContext)
  const justifyContentMsg = myMessage ? 'end' : 'start'
  // const bgColorMsg = myMessage ? '#d9ffb5' : 'white'
  const bgColorMsg = () => {
    if (theme === 'light') {
      if (myMessage) {
        return '#d9ffb5'
      } else {
        return 'white'
      }
    } else {
      if (myMessage) {
        return '#d9ffb5'
      } else {
        return '#212529'
      }
    }
  }
  const textColorMsg = () => {
    if (theme !== 'light') {
      if (myMessage) {
        return ''
      } else {
        return 'rgb(256, 256,256, 0.8)'
      }
    }
  }

  const bgColorBadgeTime =
    theme === 'light' ? 'rgb(255, 255, 255, 0.6)' : '#212529'
  const textColorBadgeTime = theme === 'light' ? '' : 'white'

  // console.log('content', content)
  // console.log(' myMessage', myMessage)
  // console.log('status', status)
  // console.log('badgeTime', badgeTime)

  // const isSelfMessage = true

  function convertTime(time) {
    if (isNaN(time)) {
      return ''
    }
    const date = new Date(time)
    return date.getHours() + ':' + addZero(date.getMinutes())
  }

  function addZero(number) {
    if (number < 10) {
      return '0' + number
    } else {
      return number
    }
  }

  const svgSend = (status) => {
    if (!myMessage) {
      return
    }
    if (status === 'ok') {
      return (
        <svg
          width="12"
          height="11"
          viewBox="0 0 12 11"
          fill="none"
          className=""
        >
          <path
            d="M11.155.653A.457.457 0 0 0 10.85.55a.493.493 0 0 0-.38.178L4.28 8.365 1.875 6.093a.463.463 0 0 0-.336-.146.47.47 0 0 0-.344.146l-.31.31a.445.445 0 0 0-.14.337c0 .136.046.25.14.343l2.995 2.996a.724.724 0 0 0 .502.203.697.697 0 0 0 .546-.266l6.646-8.417a.497.497 0 0 0 .108-.299.441.441 0 0 0-.19-.374l-.337-.273Z"
            fill="currentcolor"
          ></path>
        </svg>
      )
    } else if (status === 'received') {
      return (
        <svg
          width="16"
          height="11"
          viewBox="0 0 16 11"
          className=""
          // style={{
          //   color: '#53bdeb',
          // }}
        >
          <path
            d="M11.071.653a.457.457 0 0 0-.304-.102.493.493 0 0 0-.381.178l-6.19 7.636-2.405-2.272a.463.463 0 0 0-.336-.146.47.47 0 0 0-.343.146l-.311.31a.445.445 0 0 0-.14.337c0 .136.047.25.14.343l2.996 2.996a.724.724 0 0 0 .501.203.697.697 0 0 0 .546-.266l6.646-8.417a.497.497 0 0 0 .108-.299.441.441 0 0 0-.19-.374L11.07.653Zm-2.45 7.674a15.31 15.31 0 0 1-.546-.355.43.43 0 0 0-.317-.12.46.46 0 0 0-.362.158l-.292.33a.482.482 0 0 0 .013.666l1.079 1.073c.135.135.3.203.495.203a.699.699 0 0 0 .552-.267l6.62-8.391a.446.446 0 0 0 .109-.298.487.487 0 0 0-.178-.375l-.355-.273a.487.487 0 0 0-.673.076L8.62 8.327Z"
            fill="currentColor"
          ></path>
        </svg>
      )
    } else if (status === 'read') {
      return (
        <svg
          width="16"
          height="11"
          viewBox="0 0 16 11"
          className=""
          style={{
            color: '#53bdeb',
          }}
        >
          <path
            d="M11.071.653a.457.457 0 0 0-.304-.102.493.493 0 0 0-.381.178l-6.19 7.636-2.405-2.272a.463.463 0 0 0-.336-.146.47.47 0 0 0-.343.146l-.311.31a.445.445 0 0 0-.14.337c0 .136.047.25.14.343l2.996 2.996a.724.724 0 0 0 .501.203.697.697 0 0 0 .546-.266l6.646-8.417a.497.497 0 0 0 .108-.299.441.441 0 0 0-.19-.374L11.07.653Zm-2.45 7.674a15.31 15.31 0 0 1-.546-.355.43.43 0 0 0-.317-.12.46.46 0 0 0-.362.158l-.292.33a.482.482 0 0 0 .013.666l1.079 1.073c.135.135.3.203.495.203a.699.699 0 0 0 .552-.267l6.62-8.391a.446.446 0 0 0 .109-.298.487.487 0 0 0-.178-.375l-.355-.273a.487.487 0 0 0-.673.076L8.62 8.327Z"
            fill="currentColor"
          ></path>
        </svg>
      )
    } else {
      return (
        <svg viewBox="0 0 16 15" width="16" height="15" className="">
          <path
            fill="currentColor"
            d="M9.75 7.713H8.244V5.359a.5.5 0 0 0-.5-.5H7.65a.5.5 0 0 0-.5.5v2.947a.5.5 0 0 0 .5.5h.094l.003-.001.003.002h2a.5.5 0 0 0 .5-.5v-.094a.5.5 0 0 0-.5-.5zm0-5.263h-3.5c-1.82 0-3.3 1.48-3.3 3.3v3.5c0 1.82 1.48 3.3 3.3 3.3h3.5c1.82 0 3.3-1.48 3.3-3.3v-3.5c0-1.82-1.48-3.3-3.3-3.3zm2 6.8a2 2 0 0 1-2 2h-3.5a2 2 0 0 1-2-2v-3.5a2 2 0 0 1 2-2h3.5a2 2 0 0 1 2 2v3.5z"
          ></path>
        </svg>
      )
    }
  }

  const isBadgeTime = badgeTime ? true : false

  function explainTheDate(dateInMs) {
    let today = new Date()
    let d = new Date()
    let yesterday = new Date(d.setDate(d.getDate() - 1))
    if (new Date(dateInMs).getDate() === today.getDate()) {
      return _today[language]
    } else if (new Date(dateInMs).getDate() === yesterday.getDate()) {
      return _yesterday[language]
    } else {
      return new Date(dateInMs).toLocaleDateString()
    }
  }

  const _yesterday = {
    en: 'Yesterday',
    fr: 'Hier',
    il: 'אתמול',
  }

  const _today = {
    en: 'Today',
    fr: "Aujourd'hui",
    il: 'היום',
  }

  // Message Menu

  const { refComponent, refButton, isComponentVisible, setIsComponentVisible } =
    useComponentVisibleRightClick(false)

  const handleClickRefButton = (e) => {
    console.log('e', e)
    e.preventDefault()
    offsetX = e.nativeEvent.offsetX
    offsetY = e.nativeEvent.offsetY
    console.log('offsetX', offsetX)
    console.log('offsetY', offsetY)
    setIsComponentVisible(!isComponentVisible)
  }

  return (
    <div>
      {isBadgeTime ? (
        <div className={`w-100 d-flex justify-content-center my-4`}>
          <div
            className="rounded px-1"
            style={{
              color: textColorBadgeTime,
              backgroundColor: bgColorBadgeTime,
            }}
          >
            <span
              style={{
                fontSize: '0.9em',
                position: 'relative',
                top: '-1px',
              }}
            >
              {explainTheDate(badgeTime)}
              {/* {new Date(badgeTime).toLocaleDateString()} */}
            </span>
            {/* {new Date(badgeTime).toLocaleDateString()} */}
          </div>
        </div>
      ) : (
        <div
          className={`w-100 d-flex justify-content-${justifyContentMsg} mb-1`}
        >
          <div
            ref={refButton}
            onContextMenu={(e) => handleClickRefButton(e)}
            className="rounded"
            style={{
              backgroundColor: bgColorMsg(),
              color: textColorMsg(),
              boxShadow: theme === 'light' ? ' 1px 1px 1px gray' : '',
              position: 'relative',
              minWidth: '62px',
            }}
          >
            <div ref={refComponent}>
              {isComponentVisible && (
                <div
                  style={{
                    position: 'absolute',
                    top: offsetY,
                    left: offsetX,
                  }}
                >
                  <MessageMenu messageId={messageId} />
                </div>
              )}
            </div>
            <div
              style={{
                overflowWrap: 'break-word',
                position: 'relative',
                whiteSpace: 'pre-wrap',
              }}
            >
              <p
                className="pb-0 px-1 mb-0 text-start"
                style={{
                  // fontWeight: theme !== 'light' && !myMessage && '300',
                  maxWidth: '500px',
                }}
              >
                {content}
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
                  height: '24px',
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
                  {}
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
                    {svgSend(status)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
