import React, { useRef, useContext } from 'react'
import styled from 'styled-components'
import { UserAuth } from '../../../../utils/context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { ThemeContext } from '../../../../utils/context/ThemeContext'
import { useEffect } from 'react'
import { useState } from 'react'
import { LanguageContext } from '../../../../utils/context/LanguageContext'

const DivMenu = styled.div`
  position: absolute;
  z-index: 1021;
  background-color: rgb(255, 255, 255, 0.9);
  top: 48px;
  left: 42px;
  width: 300px;
`
const UlMenu = styled.ul`
  list-style-type: none;
  padding: 10px;
  margin-bottom: 0;
`

export default function ContactMenu({ iconBarIsActive, setIconBarIsActive }) {
  // const navigate = useNavigate()

  const { toggleTheme, theme } = useContext(ThemeContext)

  const { setLanguage, language } = useContext(LanguageContext)

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

  return (
    <div
      className={`rounded shadow`}
      style={{
        position: 'absolute',
        zIndex: '1021',
        top: '45px',
        right: '10px',
        backgroundColor: bgColor,
        color: textColor,
      }}
    >
      <ul
        style={{ listStyleType: 'none', marginBottom: '0px', padding: '8px' }}
      >
        <li
        // className="mx-2"
        //  onClick={() => setIconBarIsActive(true)}
        >
          <div>
            <div
              className={`row ${listItemMenuBgColor} py-2 m-0`}
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#staticBackdrop"
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
