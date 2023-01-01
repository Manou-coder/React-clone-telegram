import React, { useContext, useEffect, useState } from 'react'
import { useRef } from 'react'
import styled from 'styled-components'
import { LanguageContext } from '../../utils/context/LanguageContext'
import { MessagesContext } from '../../utils/context/MessagesContext'
import { ThemeContext } from '../../utils/context/ThemeContext'
import color from '../../utils/style/color'
import SearchedMessage from '../chat/Chat-Header/SearchedMessage'
import SearchSideBar from '../sidebar/SideBar-Header/SearchSideBar'

const Arrow = styled.span`
  display: flex;
  height: 40px;
  width: 40px;
  align-items: center;
  justify-content: center;
  &:hover {
    background-color: #f0f2f5;
    border-radius: 20px;
  }
`

export default function OffCanvasRight() {
  const { language } = useContext(LanguageContext)
  const { theme, inputLetters, setInputLetters, inputSearchMessageRef } =
    useContext(ThemeContext)
  const { arrOfMessages } = useContext(MessagesContext)
  const offCanvasRef = useRef()
  const [arrOfSearchedMessages, setArrOfSearchedMessages] = useState([])

  // DARK MODE
  const bgColor1 = theme === 'light' ? 'bg-white' : 'bg-black'
  const bgColor2 = theme === 'light' ? 'bg-light' : 'bg-dark'

  const offCanvasDirection =
    language !== 'il' ? 'offcanvas-end' : 'offcanvas-start'

  const faArrow = language !== 'il' ? 'fa-arrow-right' : 'fa-arrow-left'

  const [borderColor, setBorderColor] = useState(false)

  const iconSearchColor = () => {
    if (borderColor) {
      return color.primary
    } else if (theme !== 'light') {
      return '#909294'
    } else {
      return color.black
    }
  }

  const shadowColor = !borderColor ? iconSearchColor() : color.primary
  const border = theme === 'light' ? 'border' : ''

  //   FUNCTION MESSAGE SEARCH

  useEffect(() => {
    searchMessageList()
  }, [inputLetters])

  const searchMessageList = () => {
    // console.log('inputLetters', inputLetters)
    if (!inputLetters) {
      console.log('aucune lettre')
      return []
    }
    const searchedMessages = arrOfMessages.filter((msg) => {
      if (msg.content) {
        const content = msg.content
        if (content.includes(inputLetters)) {
          return msg
        }
      }
    })
    setArrOfSearchedMessages(searchedMessages)
  }

  function resetSearchedMessages() {
    inputSearchMessageRef.current.value = ''
    setInputLetters('')
    setArrOfSearchedMessages([])
  }

  return (
    <>
      <div
        ref={offCanvasRef}
        className={`offcanvas ${offCanvasDirection} scrollbar-none col col-lg-4`}
        tabIndex="-1"
        id="offcanvasRight"
        aria-labelledby="offcanvasExampleLabel"
        style={{ border: 'none' }}
      >
        <div className={`offcanvas-header ${bgColor1}`}>
          <div className="col d-flex justify-content-center">
            <div
              className={`row w-100 ${bgColor1} ${border} rounded-5 my-2 py-2 align-items-center`}
              style={{ boxShadow: `0px 0px 0px 2px ${shadowColor}` }}
            >
              <div className="col-1">
                <span>
                  {/* ICON SEARCH - equal to ("fa-solid fa-magnifying-glass fa-lg") */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    style={{
                      fill: iconSearchColor(),
                      position: 'relative',
                      bottom: '2px',
                    }}
                    height="1.25em"
                  >
                    <path d="M500.3 443.7l-119.7-119.7c27.22-40.41 40.65-90.9 33.46-144.7C401.8 87.79 326.8 13.32 235.2 1.723C99.01-15.51-15.51 99.01 1.724 235.2c11.6 91.64 86.08 166.7 177.6 178.9c53.8 7.189 104.3-6.236 144.7-33.46l119.7 119.7c15.62 15.62 40.95 15.62 56.57 0C515.9 484.7 515.9 459.3 500.3 443.7zM79.1 208c0-70.58 57.42-128 128-128s128 57.42 128 128c0 70.58-57.42 128-128 128S79.1 278.6 79.1 208z" />
                  </svg>
                </span>
              </div>
              <div className="col">
                <SearchSideBar
                  setBorderColor={setBorderColor}
                  inputLetters={inputLetters}
                  setInputLetters={setInputLetters}
                  inputSearchMessageRef={inputSearchMessageRef}
                />
              </div>
            </div>
          </div>
          <div className="col-2 d-flex justify-content-center">
            <Arrow role={'button'} data-bs-dismiss="offcanvas">
              <i className={`fa-solid ${faArrow} fa-lg offcanvas-button`}></i>
            </Arrow>
          </div>
        </div>
        <div className={`offcanvas-body ${bgColor2}`}>
          <ul className="p-0 mt-2" style={{ listStyleType: 'none' }}>
            {arrOfSearchedMessages.map((msg, i) => (
              <SearchedMessage
                message={msg}
                key={msg.id}
                resetSearchedMessages={resetSearchedMessages}
              />
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
