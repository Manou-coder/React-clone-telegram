// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css'
// Bootstrap Bundle JS
import 'bootstrap/dist/js/bootstrap.bundle.min'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App'
import Chat from './components/chat/Chat'
import SideBar from './components/sidebar/SideBar'
// eslint-disable-next-line no-unused-vars
import socket from './utils/socket.io'
import Home from './pages/home/Home'
import Profile from './pages/profile/Profile'
import Protected from './components/Protected'
import { AuthContextProvider } from './utils/context/AuthContext'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <BrowserRouter>
    <AuthContextProvider>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route
          path="/profile"
          element={
            <Protected>
              <Profile />
            </Protected>
          }
        ></Route>
        <Route
          path="/:id"
          element={
            <App>
              <SideBar />
              <Chat />
            </App>
          }
        >
          <Route path="/:id/:name">
            {/* <App>
              <SideBar />
              <Chat />
            </App> */}
          </Route>
        </Route>
        <Route
          path="*"
          element={
            <main style={{ padding: '1rem' }}>
              <p>There's nothing here!</p>
            </main>
          }
        />
      </Routes>
    </AuthContextProvider>
  </BrowserRouter>
)
