import { Outlet } from "react-router-dom"

function App({ children }) {
  return (
    <div className="container-fluid vh-100 vw-100 p-0">
      <div className="row vh-100 vw-100 m-0">{children}</div>
      <Outlet />
    </div>
  )
}

export default App
