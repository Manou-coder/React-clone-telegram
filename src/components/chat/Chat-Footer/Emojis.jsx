import React, { useEffect, useRef } from 'react'
import { useContext } from 'react'
import { useState } from 'react'
import {
  animals_emojis,
  cars_emojis,
  smiley_emojis,
  symbol_emojis,
} from '../../../assets/emojis'
import { LanguageContext } from '../../../utils/context/LanguageContext'
import './Emojis.css'

let span = null

export default function Emojis({ textareaRef, setMessageInput }) {
  const [emojis, setEmojis] = useState('smiley')
  const { language } = useContext(LanguageContext)

  const obj_emojis = {
    smiley: smiley_emojis,
    animals: animals_emojis,
    car: cars_emojis,
    symbol: symbol_emojis,
  }

  const handleSetEmojis = (value) => {
    if (span) {
      span.style.fill = ''
    }
    span = document.getElementById(value)
    span.style.fill = 'rgb(13, 110, 253)'
    setEmojis(value)
  }

  const rightPosition = language === 'il' ? '12px' : ''

  return (
    <div
      className="div-emojis"
      style={{
        position: 'absolute',
        top: '-157px',
        width: '320px',
        padding: '8px',
        zIndex: '1',
        right: rightPosition,
      }}
    >
      <div className="grid-container prevent-select">
        {obj_emojis[emojis].map((emoji, i) => (
          <div
            className="grid-item"
            key={i}
            onClick={() => {
              // console.log('textareaRef', textareaRef.current.value)
              textareaRef.current.focus()
              textareaRef.current.value += emoji
              setMessageInput((curr) => curr + emoji)
            }}
          >
            {emoji}
          </div>
        ))}
      </div>
      <div className="d-flex justify-content-center align-items-center div_emojis mt-2">
        <div
          onMouseOver={() => handleSetEmojis('smiley')}
          className="col d-flex justify-content-center align-items-center"
          id="smiley"
        >
          <span className="d-flex justify-content-center align-items-center">
            {/* SMILEY */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              height={'1.25em'}
            >
              <path d="M256 352C293.2 352 319.2 334.5 334.4 318.1C343.3 308.4 358.5 307.7 368.3 316.7C378 325.7 378.6 340.9 369.6 350.6C347.7 374.5 309.7 400 256 400C202.3 400 164.3 374.5 142.4 350.6C133.4 340.9 133.1 325.7 143.7 316.7C153.5 307.7 168.7 308.4 177.6 318.1C192.8 334.5 218.8 352 256 352zM208.4 208C208.4 225.7 194 240 176.4 240C158.7 240 144.4 225.7 144.4 208C144.4 190.3 158.7 176 176.4 176C194 176 208.4 190.3 208.4 208zM304.4 208C304.4 190.3 318.7 176 336.4 176C354 176 368.4 190.3 368.4 208C368.4 225.7 354 240 336.4 240C318.7 240 304.4 225.7 304.4 208zM512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM256 48C141.1 48 48 141.1 48 256C48 370.9 141.1 464 256 464C370.9 464 464 370.9 464 256C464 141.1 370.9 48 256 48z" />
            </svg>
          </span>
        </div>
        <div
          onMouseOver={() => handleSetEmojis('animals')}
          className="col d-flex justify-content-center align-items-center"
        >
          <span className="d-flex justify-content-center align-items-center">
            {/* ANIMALS */}
            <svg
              id="animals"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              height={'1.25em'}
            >
              <path d="M226.5 92.9c14.3 42.9-.3 86.2-32.6 96.8s-70.1-15.6-84.4-58.5s.3-86.2 32.6-96.8s70.1 15.6 84.4 58.5zM100.4 198.6c18.9 32.4 14.3 70.1-10.2 84.1s-59.7-.9-78.5-33.3S-2.7 179.3 21.8 165.3s59.7 .9 78.5 33.3zM69.2 401.2C121.6 259.9 214.7 224 256 224s134.4 35.9 186.8 177.2c3.6 9.7 5.2 20.1 5.2 30.5v1.6c0 25.8-20.9 46.7-46.7 46.7c-11.5 0-22.9-1.4-34-4.2l-88-22c-15.3-3.8-31.3-3.8-46.6 0l-88 22c-11.1 2.8-22.5 4.2-34 4.2C84.9 480 64 459.1 64 433.3v-1.6c0-10.4 1.6-20.8 5.2-30.5zM421.8 282.7c-24.5-14-29.1-51.7-10.2-84.1s54-47.3 78.5-33.3s29.1 51.7 10.2 84.1s-54 47.3-78.5 33.3zM310.1 189.7c-32.3-10.6-46.9-53.9-32.6-96.8s52.1-69.1 84.4-58.5s46.9 53.9 32.6 96.8s-52.1 69.1-84.4 58.5z" />
            </svg>
          </span>
        </div>
        <div
          onMouseOver={() => handleSetEmojis('car')}
          className="col d-flex justify-content-center align-items-center"
          id="car"
        >
          <span className="d-flex justify-content-center align-items-center">
            {/* CAR */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              height={'1.25em'}
            >
              <path d="M135.2 117.4L109.1 192H402.9l-26.1-74.6C372.3 104.6 360.2 96 346.6 96H165.4c-13.6 0-25.7 8.6-30.2 21.4zM39.6 196.8L74.8 96.3C88.3 57.8 124.6 32 165.4 32H346.6c40.8 0 77.1 25.8 90.6 64.3l35.2 100.5c23.2 9.6 39.6 32.5 39.6 59.2V400v48c0 17.7-14.3 32-32 32H448c-17.7 0-32-14.3-32-32V400H96v48c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V400 256c0-26.7 16.4-49.6 39.6-59.2zM128 288c0-17.7-14.3-32-32-32s-32 14.3-32 32s14.3 32 32 32s32-14.3 32-32zm288 32c17.7 0 32-14.3 32-32s-14.3-32-32-32s-32 14.3-32 32s14.3 32 32 32z" />
            </svg>
          </span>
        </div>
        <div
          onMouseOver={() => handleSetEmojis('symbol')}
          className="col d-flex justify-content-center align-items-center"
          id="symbol"
        >
          <span className="d-flex justify-content-center align-items-center">
            {/* SYMBOLS */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              height={'1.25em'}
            >
              <path d="M224 445.3V323.5l-94.3 77.1c26.1 22.8 58.5 38.7 94.3 44.7zM89.2 351.1L224 240.8V66.7C133.2 81.9 64 160.9 64 256c0 34.6 9.2 67.1 25.2 95.1zm293.1 49.5L288 323.5V445.3c35.7-6 68.1-21.9 94.3-44.7zm40.6-49.5c16-28 25.2-60.5 25.2-95.1c0-95.1-69.2-174.1-160-189.3V240.8L422.8 351.1zM512 256c0 141.4-114.6 256-256 256S0 397.4 0 256S114.6 0 256 0S512 114.6 512 256z" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  )
}
