// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css'
// Bootstrap Bundle JS
import 'bootstrap/dist/js/bootstrap.bundle.min'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './pages/chat/App'
import Home from './pages/home/Home'
import Profile from './pages/profile/Profile'
import Protected from './utils/Protected'
import { AuthContextProvider } from './utils/context/AuthContext'
import './utils/style/index.css'
import { ThemeProvider } from './utils/context/ThemeContext'
import { LanguageProvider } from './utils/context/LanguageContext'
import { SocketContactProvider } from './utils/context/SocketContact'
import { MessagesContextProvider } from './utils/context/MessagesContext'
import Error from './pages/error/Error'

import './utils/peerjs/peer'
import { PeerProvider } from './utils/context/PeerContext'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <BrowserRouter>
    <AuthContextProvider>
      <LanguageProvider>
        <ThemeProvider>
          <MessagesContextProvider>
            <PeerProvider>
              <SocketContactProvider>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route
                    path="profile"
                    element={
                      <Protected>
                        <Profile />
                      </Protected>
                    }
                  />
                  <Route
                    path="chat"
                    element={
                      <Protected>
                        <App />
                      </Protected>
                    }
                  >
                    <Route
                      path=":username"
                      element={
                        <Protected>
                          <App />
                        </Protected>
                      }
                    />
                  </Route>
                  <Route path="*" element={<Error />} />
                </Routes>
              </SocketContactProvider>
            </PeerProvider>
          </MessagesContextProvider>
        </ThemeProvider>
      </LanguageProvider>
    </AuthContextProvider>
  </BrowserRouter>
)
