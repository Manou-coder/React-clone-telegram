import React, { useRef, useContext } from 'react'
import styled from 'styled-components'
import { UserAuth } from '../../../../utils/context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { ThemeContext } from '../../../../utils/context/ThemeContext'
import { useEffect } from 'react'
import { useState } from 'react'
import { LanguageContext } from '../../../../utils/context/LanguageContext'
import { PeerContext } from '../../../../utils/context/PeerContext'

export default function ContactMenu({ contact }) {
  const { theme, setModalName } = useContext(ThemeContext)
  const { language } = useContext(LanguageContext)
  const { videoCall, audioCall } = useContext(PeerContext)

  const bgColor =
    theme === 'light' ? 'rgb(255, 255, 255, 0.9)' : 'rgb(33, 37, 41, 0.9)'

  const textColor = theme === 'light' ? 'black' : 'white'

  const listItemMenuBgColor =
    theme === 'light' ? 'list-item-menu' : 'list-item-menu-black'

  const _deleteChat = {
    en: 'Delete chat',
    fr: "Supprimer l'échange",
    il: "למחוק צ'אט",
  }

  const _audioCall = {
    en: 'Audio call',
    fr: 'Appel audio ',
    il: 'שיחת שמע',
  }

  const _videoCall = {
    en: 'Video call',
    fr: 'Appel vidéo ',
    il: 'שיחת וידאו',
  }

  const _youCannotCall = {
    en: 'You cannot call a deleted account.',
    fr: 'Vous ne pouvez pas appeler un compte supprimé.',
    il: 'אתה לא יכול להתקשר לחשבון שנמחק.',
  }

  const _messageSearch = {
    en: 'Message search',
    fr: 'Recherche de messages ',
    il: 'חיפוש הודעות',
  }

  const rightPosition = language === 'il' ? '-125px' : '35px'

  return (
    <div
      className={`rounded shadow`}
      style={{
        position: 'absolute',
        width: 'max-content',
        zIndex: '1021',
        top: '45px',
        right: rightPosition,
        backgroundColor: bgColor,
        color: textColor,
      }}
    >
      <ul
        style={{ listStyleType: 'none', marginBottom: '0px', padding: '8px' }}
      >
        <li className="d-lg-none">
          <div>
            <div
              className={`row ${listItemMenuBgColor} py-2 m-0`}
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasRight"
            >
              <div className="col-2 d-flex justify-content-center align-items-center">
                <span className="d-flex">
                  <i className="fa-solid fa-magnifying-glass"></i>
                </span>
              </div>
              <div className="col ps-2">
                <span>{_messageSearch[language]}</span>
              </div>
            </div>
          </div>
        </li>
        <li className="d-lg-none">
          <div>
            <div
              className={`row ${listItemMenuBgColor} py-2 m-0`}
              type="button"
              onClick={() => {
                if (contact && contact.isDeleted) {
                  return alert(_youCannotCall[language])
                }
                audioCall()
              }}
            >
              <div className="col-2 d-flex justify-content-center align-items-center">
                <span className="d-flex">
                  <i className="fa-solid fa-phone"></i>
                </span>
              </div>
              <div className="col ps-2">
                <span>{_audioCall[language]}</span>
              </div>
            </div>
          </div>
        </li>
        <li className="d-lg-none">
          <div>
            <div
              className={`row ${listItemMenuBgColor} py-2 m-0`}
              type="button"
              onClick={() => {
                if (contact && contact.isDeleted) {
                  return alert(_youCannotCall[language])
                }
                videoCall()
              }}
            >
              <div className="col-2 d-flex justify-content-center align-items-center">
                <span className="d-flex">
                  <i className="fa-solid fa-video"></i>
                </span>
              </div>
              <div className="col ps-2">
                <span>{_videoCall[language]}</span>
              </div>
            </div>
          </div>
        </li>
        <li>
          <div>
            <div
              className={`row ${listItemMenuBgColor} py-2 m-0`}
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#staticBackdrop"
              onClick={() => setModalName('delete chat')}
            >
              <div className="col-2 d-flex justify-content-center align-items-center">
                <span className="d-flex">
                  <i className="fa-solid fa-trash-can"></i>
                </span>
              </div>
              <div className="col ps-2">
                <span>{_deleteChat[language]}</span>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  )
}
