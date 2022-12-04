import React, { useContext } from 'react'
import { ThemeContext } from '../../utils/context/ThemeContext'
import DefaultImgChat from '../../assets/img/undraw_chatting.svg'

export default function DefaultChat() {
  // DARK MODE
  const { theme } = useContext(ThemeContext)
  const wallpaper = theme === 'light' ? 'wallpapper' : 'wallpapper-black'

  return (
    <div
      className={`d-none d-lg-flex col-lg-8 p-0 vh-100  justify-content-center align-items-center position-relative ${wallpaper}`}
    >
      <img
        style={{ width: '50%' }}
        src={DefaultImgChat}
        alt="DefaultImgChat"
      ></img>
    </div>
  )
}
