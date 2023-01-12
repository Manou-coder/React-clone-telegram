/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react'
import { useContext } from 'react'
import {
  LazyLoadComponent,
  LazyLoadImage,
} from 'react-lazy-load-image-component'
import { LanguageContext } from '../../../../utils/context/LanguageContext'
import { ThemeContext } from '../../../../utils/context/ThemeContext'
import { useComponentVisibleRightClickMessage } from '../../../../utils/functions/useHandleClickOutside'
import MessageMenu from '../MessageMenu'
import 'react-lazy-load-image-component/src/effects/blur.css'
import { MessagesContext } from '../../../../utils/context/MessagesContext'
import React from 'react'

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
  const [isLoaderVisible, setIsLoaderVisible] = useState(true)

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

  // const { refComponentInScroll, isVisible } = useComponentVisibleInScroll()

  // useEffect(() => {
  //   console.log('isVisible: ', isVisible)
  // }, [isVisible])

  return (
    <div>
      {isBadgeTime ? (
        <div
          className={`w-100 d-flex justify-content-center my-4`}
          id={messageId}
        >
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
          className={`w-100 d-flex justify-content-${justifyContentMsg} mb-1 position-relative`}
          id={messageId}
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
                {type === 'image' && (
                  <div style={{ width: '225px', height: '225px' }}>
                    {/* <MyComponent> */}
                    <div
                      className="on-image"
                      style={{
                        height: '200px',
                        width: '200px',
                        borderRadius: '5px',
                        position: 'absolute',
                        top: '50%',
                        right: '50%',
                        transform: 'translate(50%, -50%)',
                        objectFit: 'cover',
                      }}
                    >
                      <LazyLoadImage
                        height={200}
                        width={200}
                        src={content}
                        placeholderSrc=""
                        effect="blur"
                        alt="img"
                      />
                    </div>
                    {isLoaderVisible ? <Loader messageId={messageId} /> : null}
                    {/* </MyComponent> */}
                  </div>
                )}
                {type === 'video' && (
                  <div style={{ width: '225px', height: '225px' }}>
                    <MyComponent>
                      {/* {console.log(MyComponent.prototype)} */}
                      <div
                        className="on-image"
                        style={{
                          height: '200px',
                          width: '200px',
                          borderRadius: '5px',
                          position: 'absolute',
                          top: '50%',
                          right: '50%',
                          transform: 'translate(50%, -50%)',
                          objectFit: 'cover',
                        }}
                      >
                        <figure
                          style={{
                            position: 'relative',
                            pointerEvents: 'all',
                          }}
                        >
                          <video
                            onMouseEnter={(e) => (e.target.controls = true)}
                            onMouseLeave={(e) => (e.target.controls = false)}
                            loop
                            muted
                            style={{
                              height: '200px',
                              width: '200px',
                              objectFit: 'cover',
                              pointerEvents: 'all',
                            }}
                            src={content}
                          ></video>
                        </figure>
                      </div>
                      {isLoaderVisible ? (
                        <Loader messageId={messageId} />
                      ) : null}
                    </MyComponent>
                  </div>
                )}
                {type === 'deleted message' && (
                  <span
                    className="px-1"
                    style={{ fontStyle: 'italic', color: 'GrayText' }}
                  >
                    {_thisMessageWasDeleted[language]}
                  </span>
                )}
                {type !== 'deleted message' &&
                type !== 'image' &&
                type !== 'video' ? (
                  <p
                    className="pb-0 px-1 mb-0 text-start"
                    style={{
                      maxWidth: '500px',
                    }}
                  >
                    {content}
                  </p>
                ) : null}
              </div>
              <div
                style={{
                  padding:
                    type === 'video' || type === 'image'
                      ? '4px 0px'
                      : '7px 0px',
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
                  {type === 'image' && <LogoImage />}
                  {type === 'video' && <LogoVideo />}
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

function Loader({ messageId }) {
  const [isLoaderVisible, setIsLoaderVisible] = useState(false)
  const { progress, setProgress, uploadTask, setUploadTask } =
    useContext(ThemeContext)
  const { arrOfMessages, setArrOfMessages } = useContext(MessagesContext)
  const elementsToTransform = useRef([])
  const addElements = (el) => {
    if (el && !elementsToTransform.current.includes(el)) {
      elementsToTransform.current.push(el)
    }
  }

  if (progress.id === messageId) {
    elementsToTransform?.current?.forEach(function (element) {
      element.style.transform = `rotate(${progress.percent * (180 / 100)}deg)`
    })
  }

  useEffect(() => {
    const sameId = progress.id === messageId ? progress.id : null
    // console.log('sameId: ', sameId)
    if (!sameId) return
    const divMessageId = document.getElementById(progress.id)
    console.log('divMessageId: ', divMessageId)
    if (!divMessageId) return
    const onImage = divMessageId.querySelector('.on-image')
    console.log('onImage: ', onImage)
    if (!onImage) return
    onImage.classList.add('on-image-blur')

    if (progress.id === messageId && progress.percent !== 0) {
      setIsLoaderVisible(true)
    }
    if (progress.id === messageId && progress.percent === 100) {
      onImage?.classList.remove('on-image-blur')
      setIsLoaderVisible(false)
    }
  }, [progress])

  return (
    <>
      {isLoaderVisible ? (
        <div className="circle-wrap" style={{ pointerEvents: 'all' }}>
          <div className="circle">
            <div className="mask full" ref={addElements}>
              <div className="fill" ref={addElements}></div>
            </div>
            <div className="mask half">
              <div className="fill" ref={addElements}></div>
            </div>
            {/* <div className="inside-circle"> {Math.round(progress) + ' %'} </div> */}
            <div
              style={{ cursor: 'pointer' }}
              className="inside-circle"
              onClick={() => {
                console.log('uploadTask', uploadTask)
                uploadTask?.cancel()
                setIsLoaderVisible(false)
                setArrOfMessages((curr) => curr.slice(0, -1))
                // il faut ici supprimer le message
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
                height={40}
                fill="black"
              >
                <path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z" />
              </svg>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

function MyComponent({ children }) {
  const { messageBodyRef } = useContext(ThemeContext)
  const [isVisible, setIsVisible] = useState(false)

  const elementRef = useRef(null)

  useEffect(() => {
    function handleScroll() {
      const element = elementRef.current
      if (!element) {
        return
      }
      const rect = element.getBoundingClientRect()
      // console.log('rect: ', rect)
      const viewHeight = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight
      )
      const messagBodyRect = messageBodyRef?.current?.getBoundingClientRect()
      // console.log('messagBodyRect: ', messagBodyRect)
      const messagBodyHeight = messagBodyRect?.height
      console.log(' messagBodyHeight: ', messagBodyHeight)
      console.log('rect.top: ', rect.top)
      console.log('rect.bottom: ', rect.bottom)
      // console.log('viewHeight: ', viewHeight)
      // const viewHeight2 = viewHeight * 0.8
      const messagBodyHeight2 = messagBodyHeight * 0.8
      // console.log('viewHeight2: ', viewHeight2)
      const isVisible = !(
        rect.bottom < 200 || rect.top - messagBodyHeight2 >= 0
      )
      setIsVisible(isVisible)
      // console.log('isVisible', isVisible)
    }

    messageBodyRef?.current?.addEventListener('scroll', handleScroll)
    return () => {
      messageBodyRef?.current?.removeEventListener('scroll', handleScroll)
    }
  }, [elementRef, messageBodyRef])

  useEffect(() => {
    if (!elementRef.current) {
      return
    }
    const element = elementRef.current
    const video = element.querySelector('video')
    // console.log('video: ', video)
    if (isVisible) {
      console.log('isVisible', isVisible)
      video.play()
    } else {
      console.log('isVisible', isVisible)
      video.pause()
    }
  }, [isVisible, elementRef])

  // children = React.Children.map(children, (el) => {
  //   return React.cloneElement(el, { isVisible: isVisible })
  // })

  return (
    <div style={{ height: '200px', width: '200px' }} ref={elementRef}>
      {/* {React.cloneElement(children, { isVisible: isVisible })} */}
      {children}
      {/* <VideoMessage isVisible={isVisible} children={children} /> */}
    </div>
  )
}

// function VideoMessage({ isVisible }) {
//   console.log('this', this)
//   return <div>{isVisible ? 'visible' : 'non visible'}</div>
// }

function VideoMessage(props) {
  console.log('props', props)
  return <div>{props.children}</div>
}

// function App() {
//   return (
//     <div>
//       <Parent>{console.log(children)}</Parent>
//     </div>
//   )
// }
// function Parent({ children }) {

//   return <div>{children}</div>
// }

function LogoImage() {
  return (
    <span
      style={{
        color: 'gray',
        fontSize: '0.8em',
        position: 'absolute',
        top: '2px',
        left: '11.5px',
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        height={'15px'}
        fill="gray"
      >
        <path d="M0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM323.8 202.5c-4.5-6.6-11.9-10.5-19.8-10.5s-15.4 3.9-19.8 10.5l-87 127.6L170.7 297c-4.6-5.7-11.5-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4s12.4 13.6 21.6 13.6h96 32H424c8.9 0 17.1-4.9 21.2-12.8s3.6-17.4-1.4-24.7l-120-176zM112 192c26.5 0 48-21.5 48-48s-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48z" />
      </svg>
    </span>
  )
}

function LogoVideo() {
  return (
    <span
      style={{
        color: 'gray',
        fontSize: '0.8em',
        position: 'absolute',
        top: '2px',
        left: '11.5px',
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        height={'15px'}
        fill="gray"
      >
        <path d="M0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM48 368v32c0 8.8 7.2 16 16 16H96c8.8 0 16-7.2 16-16V368c0-8.8-7.2-16-16-16H64c-8.8 0-16 7.2-16 16zm368-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V368c0-8.8-7.2-16-16-16H416zM48 240v32c0 8.8 7.2 16 16 16H96c8.8 0 16-7.2 16-16V240c0-8.8-7.2-16-16-16H64c-8.8 0-16 7.2-16 16zm368-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V240c0-8.8-7.2-16-16-16H416zM48 112v32c0 8.8 7.2 16 16 16H96c8.8 0 16-7.2 16-16V112c0-8.8-7.2-16-16-16H64c-8.8 0-16 7.2-16 16zM416 96c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V112c0-8.8-7.2-16-16-16H416zM160 128v64c0 17.7 14.3 32 32 32H320c17.7 0 32-14.3 32-32V128c0-17.7-14.3-32-32-32H192c-17.7 0-32 14.3-32 32zm32 160c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32H320c17.7 0 32-14.3 32-32V320c0-17.7-14.3-32-32-32H192z" />
      </svg>
    </span>
  )
}
