import React, { useContext } from 'react'
import { ThemeContext } from '../../utils/context/ThemeContext'
import ModalDeleteChat from './ModalDeleteChat'
import ModalDeleteMyAccount from './ModalDeleteMyAccount'

export default function Modal() {
  const { theme, modalName } = useContext(ThemeContext)
  const bgColor = theme === 'light' ? '' : '#212529'
  const textColor = theme === 'light' ? '' : 'white'

  function chooseModal(modalName) {
    if (modalName === 'delete chat') {
      return <ModalDeleteChat />
    } else if (modalName === 'delete messages') {
      return null
    } else if (modalName === 'delete my account') {
      return <ModalDeleteMyAccount />
    } else {
      return null
    }
  }
  return (
    <div
      className="modal fade"
      id="staticBackdrop"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex="-1"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div
          className="modal-content"
          style={{ backgroundColor: bgColor, color: textColor }}
        >
          {chooseModal(modalName)}
          {/* <ModalDeleteChat /> */}
        </div>
      </div>
    </div>
  )
}
