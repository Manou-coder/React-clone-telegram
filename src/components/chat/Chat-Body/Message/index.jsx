/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { useContext } from 'react'
import { LanguageContext } from '../../../../utils/context/LanguageContext'
import { ThemeContext } from '../../../../utils/context/ThemeContext'
import { useComponentVisibleRightClickMessage } from '../../../../utils/functions/useHandleClickOutside'
import MessageMenu from '../MessageMenu'

let offsetX = 0
let offsetY = 0

export default function Message({
  myMessage,
  time,
  content,
  type,
  status,
  badgeTime,
  messageId,
  arrOfSelectedMessages,
  setArrOfSelectedMessages,
}) {
  const { language } = useContext(LanguageContext)
  const { theme } = useContext(ThemeContext)

  // STYLE OF MESSAGES
  const bgColorMsg = () => {
    // if the message is selected and the click is on a message then color in gray
    if (arrOfSelectedMessages.includes(messageId) && isMessage) {
      return 'grey'
    }
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

  const justifyContentMsg = myMessage ? 'end' : 'start'
  const bgColorBadgeTime =
    theme === 'light' ? 'rgb(255, 255, 255, 0.6)' : '#212529'
  const textColorBadgeTime = theme === 'light' ? '' : 'white'
  const isBadgeTime = badgeTime ? true : false

  // MESSAGE MENU
  const {
    refComponent,
    refButton,
    isComponentVisible,
    setIsComponentVisible,
    isMessage,
  } = useComponentVisibleRightClickMessage(false)

  // Remove all messages from 'arrOfSelectedMessages' when user clicks outside of a message
  useEffect(() => {
    // [Here the variable 'isMessage' is true only if the user clicks on a message otherwise 'isMessage' will return false]
    if (!isMessage) {
      setArrOfSelectedMessages([])
    }
  }, [isMessage])

  const handleRightClickRefButton = (event) => {
    event.preventDefault()
    fixCursorPosition(event)
    manageArrOfSelectedMessages()
  }

  function handleClickRefButton(event) {
    event.preventDefault()
    fixCursorPosition(event)
    // the normal (left) click only works if the selection of messages has already started (in order to obtain a better user experience)
    if (arrOfSelectedMessages.length > 0) {
      manageArrOfSelectedMessages()
    }
  }

  function fixCursorPosition(event) {
    offsetX = event.nativeEvent.offsetX
    offsetY = event.nativeEvent.offsetY
  }

  function manageArrOfSelectedMessages() {
    setArrOfSelectedMessages((curr) => {
      // if the message already exists then delete it from the list (if the table is not empty then display the 'contextMenu') otherwise add it and display the 'contextMenu'
      // p.s: the deletion of the 'contextMenu' is managed in the hook 'useComponentVisibleRightClickMessage'
      if (curr.includes(messageId)) {
        curr = curr.filter((msgId) => msgId !== messageId)
        if (curr.length > 0) {
          setIsComponentVisible(true)
        }
        return curr
      } else {
        curr.push(messageId)
        setIsComponentVisible(true)
        return curr
      }
    })
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
              {explainTheDate(badgeTime, language)}
            </span>
          </div>
        </div>
      ) : (
        <div
          className={`w-100 d-flex justify-content-${justifyContentMsg} mb-1`}
        >
          <div
            ref={refButton}
            onContextMenu={(e) => handleRightClickRefButton(e)}
            onClick={(e) => handleClickRefButton(e)}
            // the class 'message' is very important because it allows the 'useComponentVisibleRightClickMessage' hook to detect if the click is on a message or not
            className="rounded message"
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
                    top: offsetY - 130,
                    left: contextLeftPosition(language, offsetX, myMessage),
                    right: contextRightPosition(language, offsetX, myMessage),
                  }}
                >
                  <MessageMenu
                    messageId={messageId}
                    arrOfSelectedMessages={arrOfSelectedMessages}
                    setArrOfSelectedMessages={setArrOfSelectedMessages}
                  />
                </div>
              )}
            </div>
            <div // IMPORTANT the style of "pointer-events = none" is used so that the offsetX and offsetY are not calculated from this event
              style={{ pointerEvents: 'none' }}
            >
              <div
                style={{
                  overflowWrap: 'break-word',
                  position: 'relative',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {type === 'deleted message' ? (
                  <span
                    className="px-1"
                    style={{ fontStyle: 'italic', color: 'GrayText' }}
                  >
                    {_thisMessageWasDeleted[language]}
                  </span>
                ) : (
                  <p
                    className="pb-0 px-1 mb-0 text-start"
                    style={{
                      maxWidth: '500px',
                    }}
                  >
                    {content}
                  </p>
                )}
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
                      color: type === 'deleted message' && 'GrayText',
                      fontSize: '0.8em',
                      position: 'relative',
                      top: '4px',
                    }}
                  >
                    {convertTime(time)}
                  </span>
                  {type !== 'deleted message' && (
                    <div className="me-1">
                      <span>{svgSend(status, myMessage)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const contextLeftPosition = (language, offsetX, myMessage) => {
  if (language !== 'il') {
    if (myMessage) {
      return offsetX - 230
    } else {
      return offsetX
    }
  } else {
    return ''
  }
}

const contextRightPosition = (language, offsetX, myMessage) => {
  if (language === 'il') {
    if (myMessage) {
      return offsetX - 230
    } else {
      return offsetX
    }
  } else {
    return ''
  }
}

const svgSend = (status, myMessage) => {
  if (!myMessage) {
    return
  }
  if (status === 'ok') {
    return (
      <svg width="12" height="11" viewBox="0 0 12 11" fill="none" className="">
        <path
          d="M11.155.653A.457.457 0 0 0 10.85.55a.493.493 0 0 0-.38.178L4.28 8.365 1.875 6.093a.463.463 0 0 0-.336-.146.47.47 0 0 0-.344.146l-.31.31a.445.445 0 0 0-.14.337c0 .136.046.25.14.343l2.995 2.996a.724.724 0 0 0 .502.203.697.697 0 0 0 .546-.266l6.646-8.417a.497.497 0 0 0 .108-.299.441.441 0 0 0-.19-.374l-.337-.273Z"
          fill="currentcolor"
        ></path>
      </svg>
    )
  } else if (status === 'received') {
    return (
      <svg width="16" height="11" viewBox="0 0 16 11">
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

function explainTheDate(dateInMs, language) {
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

const _thisMessageWasDeleted = {
  en: 'This message was deleted by the contact',
  fr: 'Ce message a été supprimé par le contact',
  il: 'הודעה זו נמחקה על ידי איש הקשר',
}
