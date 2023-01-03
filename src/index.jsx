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
import Protected from './utils/context/Protected'
import { AuthContextProvider } from './utils/context/AuthContext'
import './utils/style/index.css'
import { ThemeProvider } from './utils/context/ThemeContext'
import { LanguageProvider } from './utils/context/LanguageContext'
import { SocketContactProvider } from './utils/context/SocketContact'
import { MessagesContextProvider } from './utils/context/MessagesContext'
import Error from './pages/error/Error'

import './utils/peerjs/peer'
import { PeerProvider } from './utils/context/PeerContext'
import { ErrorBoundary } from './ErrorBoundary'
import ProtectedUserCreated from './utils/context/ProtectedUserCreated'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <BrowserRouter>
    <ErrorBoundary>
      <AuthContextProvider>
        <LanguageProvider>
          <ThemeProvider>
            <MessagesContextProvider>
              <SocketContactProvider>
                <PeerProvider>
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
                          <ProtectedUserCreated>
                            <App />
                          </ProtectedUserCreated>
                        </Protected>
                      }
                    >
                      <Route
                        path=":username"
                        element={
                          <Protected>
                            <ProtectedUserCreated>
                              <App />
                            </ProtectedUserCreated>
                          </Protected>
                        }
                      />
                    </Route>
                    <Route path="*" element={<Error />} />
                  </Routes>
                </PeerProvider>
              </SocketContactProvider>
            </MessagesContextProvider>
          </ThemeProvider>
        </LanguageProvider>
      </AuthContextProvider>
    </ErrorBoundary>
  </BrowserRouter>
)
