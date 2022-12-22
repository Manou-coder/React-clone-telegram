import React, { useRef, useContext } from 'react'
import styled from 'styled-components'
import { UserAuth } from '../../../../utils/context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { ThemeContext } from '../../../../utils/context/ThemeContext'
import { useEffect } from 'react'
import { useState } from 'react'
import { LanguageContext } from '../../../../utils/context/LanguageContext'
import { PeerContext } from '../../../../utils/context/PeerContext'
import MyCalls from '../MyCalls'
import { updateMyCallsInDB } from '../../../../firebase-config'
import { SocketContactContext } from '../../../../utils/context/SocketContact'

export default function CallMenu({ callId }) {
  const { user } = UserAuth()
  const { theme } = useContext(ThemeContext)
  const { language } = useContext(LanguageContext)
  const { myCalls, setMyCalls } = useContext(SocketContactContext)

  const bgColor = theme === 'light' ? 'rgb(255, 255, 255)' : 'rgb(33, 37, 41)'

  const textColor = theme === 'light' ? 'black' : 'white'

  const listItemMenuBgColor =
    theme === 'light' ? 'list-item-menu' : 'list-item-menu-black'

  const _deleteThisCall = {
    en: 'Delete this call',
    fr: 'Supprimer cet appel',
    il: 'מחק את השיחה הזו',
  }

  const _deleteAllCalls = {
    en: 'Delete all calls',
    fr: 'Supprimer tous les appels',
    il: 'מחק את כל השיחות',
  }

  function deleteThisCall(callId) {
    const myCallsWithoutThisCall = myCalls.filter((call) => call.id !== callId)
    updateMyCallsInDB(user.uid, myCallsWithoutThisCall)
    setMyCalls(myCallsWithoutThisCall)
  }

  function deleteAllCalls() {
    updateMyCallsInDB(user.uid, [])
    setMyCalls([])
  }

  return (
    <div
      className={`rounded shadow`}
      style={{
        position: 'absolute',
        width: '300px',
        zIndex: '1021',
        // right: rightPosition,
        backgroundColor: bgColor,
        color: textColor,
      }}
    >
      <ul
        style={{ listStyleType: 'none', marginBottom: '0px', padding: '8px' }}
      >
        <li>
          <div>
            <div
              className={`row ${listItemMenuBgColor} py-2 m-0`}
              type="button"
              onClick={() => deleteThisCall(callId)}
            >
              <div className="col-2 d-flex justify-content-center align-items-center">
                <span className="d-flex">
                  <i className="fa-solid fa-trash-can"></i>
                </span>
              </div>
              <div className="col ps-2">
                <span>{_deleteThisCall[language]}</span>
              </div>
            </div>
          </div>
        </li>
        <li>
          <div>
            <div
              className={`row ${listItemMenuBgColor} py-2 m-0`}
              type="button"
              onClick={() => deleteAllCalls()}
              //   data-bs-toggle="modal"
              //   data-bs-target="#staticBackdrop"
            >
              <div className="col-2 d-flex justify-content-center align-items-center">
                <span className="d-flex">
                  <i className="fa-solid fa-trash-can"></i>
                </span>
              </div>
              <div className="col ps-2 text-danger fw-bold">
                <span>{_deleteAllCalls[language]}</span>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  )
}
