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
import './utils/style/index.css'
import { ThemeProvider } from './utils/context/ThemeContext'
import { LanguageProvider } from './utils/context/LanguageContext'
import { SocketContactProvider } from './utils/context/SocketContact'
import { MessagesContextProvider } from './utils/context/MessagesContext'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <BrowserRouter>
    <AuthContextProvider>
      <LanguageProvider>
        <ThemeProvider>
          <SocketContactProvider>
            <MessagesContextProvider>
              <Routes>
                <Route path="/" element={<Home />}></Route>
                <Route
                  path="profile"
                  element={
                    <Protected>
                      <Profile />
                    </Protected>
                  }
                ></Route>
                <Route
                  path="chat"
                  element={
                    <Protected>
                      <App>
                        <SideBar />
                        <Chat />
                      </App>
                    </Protected>
                  }
                >
                  <Route
                    path=":username"
                    element={
                      <Protected>
                        <App>
                          <SideBar />
                          <Chat />
                        </App>
                      </Protected>
                    }
                  ></Route>
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
            </MessagesContextProvider>
          </SocketContactProvider>
        </ThemeProvider>
      </LanguageProvider>
    </AuthContextProvider>
  </BrowserRouter>
)
