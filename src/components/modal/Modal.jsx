import React, { useContext } from 'react'
import { ThemeContext } from '../../utils/context/ThemeContext'
import ModalDeleteChat from './ModalDeleteChat'

export default function Modal() {
  const { theme } = useContext(ThemeContext)
  const bgColor = theme === 'light' ? '' : '#212529'
  const textColor = theme === 'light' ? '' : 'white'
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
          <ModalDeleteChat />
        </div>
      </div>
    </div>
  )
}
