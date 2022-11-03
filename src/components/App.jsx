import { useContext } from 'react'
import { Outlet } from 'react-router-dom'
import { ThemeContext } from '../utils/context/ThemeContext'

function App({ children }) {
  // DARK MODE
  const { theme } = useContext(ThemeContext)
  const bgColor = theme === 'light' ? 'bg-white' : 'bg-black'

  return (
    <div className={`container-fluid vh-100 vw-100 p-0 ${bgColor}`}>
      <div className="row vh-100 vw-100 m-0">{children}</div>
    </div>
  )
}

export default App
