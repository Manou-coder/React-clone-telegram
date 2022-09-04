// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css'
// Bootstrap Bundle JS
import 'bootstrap/dist/js/bootstrap.bundle.min'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App'
import Chat from './components/chat/Chat'
import SideBar from './components/sidebar/SideBar'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <App>
      <SideBar />
      <Chat />
    </App>
  </React.StrictMode>
)
