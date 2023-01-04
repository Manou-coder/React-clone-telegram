import React, { useContext } from 'react'
import { ThemeContext } from '../../utils/context/ThemeContext'

export default function Loading() {
  const { theme } = useContext(ThemeContext)
  const wallpaper = theme === 'light' ? 'wallpapper' : 'wallpapper-black'
  return <div className={`vh-100 ${wallpaper}`}></div>
}
