/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useRef } from 'react'
import { useEffect } from 'react'
import { ThemeContext } from '../../../utils/context/ThemeContext'
import './index.css'

export default function ScrollButton({ lastMessageRef, scrollDiv }) {
  // DARK MODE
  const { theme } = useContext(ThemeContext)
  const scrollButton = useRef()

  const fillButton =
    theme === 'light' ? 'rgb(0, 0, 0, 0.3)' : 'rgb(256, 256, 256, 0.3)'

  // fades the scroll button when the div is scrolled and fades the scroll button when the div is in its normal state
  useEffect(() => {
    if (scrollDiv.current && scrollButton.current) {
      setInterval(() => {
        const scrollHeight = scrollDiv.current.scrollHeight
        const scrollTop = scrollDiv.current.scrollTop
        if (scrollHeight - scrollTop > 550) {
          scrollButton.current.classList = 'fadein'
        } else {
          scrollButton.current.classList = 'fadeout'
        }
      }, 100)
    }
  }, [scrollDiv.current, scrollButton.current])

  return (
    <div>
      <div
        className=""
        ref={scrollButton}
        onClick={() =>
          lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
        style={{
          height: '50px',
          width: '50px',
          borderRadius: '25px',
          position: 'absolute',
          bottom: '80px',
          right: '30px',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style={{
              fill: fillButton,
              height: '50px',
            }}
            viewBox="0 0 512 512"
          >
            <path
              d="M256,0C114.618,0,0,114.618,0,256s114.618,256,256,256s256-114.618,256-256S397.382,0,256,0z M256,469.333
				c-117.818,0-213.333-95.515-213.333-213.333S138.182,42.667,256,42.667S469.333,138.182,469.333,256S373.818,469.333,256,469.333
				z"
            />
            <path
              d="M347.582,198.248L256,289.83l-91.582-91.582c-8.331-8.331-21.839-8.331-30.17,0c-8.331,8.331-8.331,21.839,0,30.17
				l106.667,106.667c8.331,8.331,21.839,8.331,30.17,0l106.667-106.667c8.331-8.331,8.331-21.839,0-30.17
				C369.42,189.917,355.913,189.917,347.582,198.248z"
            />
          </svg>
        </span>
      </div>
    </div>
  )
}
