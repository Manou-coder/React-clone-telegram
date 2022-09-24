import React, { useRef } from 'react'
import styled from 'styled-components'
import './SettingsMenu.css'
import { UserAuth } from '../../../../utils/context/AuthContext'
import { useNavigate } from 'react-router-dom'

const DivMenu = styled.div`
  position: absolute;
  z-index: 1000;
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

export default function SettingsMenu() {
  const navigate = useNavigate()
  const { logOut } = UserAuth()
  async function handleLogOut() {
    await logOut()
    // navigate('../')
  }

  const inputDarkMode = useRef()
  function handleClickDarkMode() {
    inputDarkMode.current.click()
  }

  return (
    <DivMenu className="rounded shadow settings-menu">
      <UlMenu>
        <li className="mx-2">
          <div
            className="row list-item-menu py-2"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasProfile"
          >
            <div className="col-1">
              <i className="fa-solid fa-user"></i>
            </div>
            <div className="col ps-4">
              <span>My Profile</span>
            </div>
          </div>
        </li>
        <li className="mx-2">
          <div className="row list-item-menu py-2">
            <div className="col-1">
              <i className="fa-solid fa-address-book"></i>
            </div>
            <div className="col ps-4">
              <span>Contact</span>
            </div>
          </div>
        </li>
        <li className="mx-2">
          <div className="row list-item-menu py-2">
            <div className="col-1">
              <i className="fa-solid fa-globe"></i>
            </div>
            <div className="col ps-4">
              <span>Language</span>
            </div>
          </div>
        </li>
        <li className="mx-2">
          <div
            onClick={handleClickDarkMode}
            className="row list-item-menu py-2"
          >
            <div className="col-1">
              <i className="fa-solid fa-moon"></i>
            </div>
            <div className="col ps-4">
              <span>Dark Mode</span>
            </div>
            <div className="col-4">
              <label className="switch">
                <input ref={inputDarkMode} type="checkbox" />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </li>
        <li className="mx-2">
          <div onClick={handleLogOut} className="row list-item-menu py-2">
            <div className="col-1">
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
            </div>
            <div className="col ps-4">
              <span>Log Out</span>
            </div>
          </div>
        </li>
      </UlMenu>
    </DivMenu>
  )
}
