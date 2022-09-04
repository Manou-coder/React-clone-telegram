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

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <App>
          <Route path='/' element={

            <><SideBar /><Chat /></>

          }>
          </Route>
        </App>
        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>There's nothing here!</p>
            </main>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode >
)
