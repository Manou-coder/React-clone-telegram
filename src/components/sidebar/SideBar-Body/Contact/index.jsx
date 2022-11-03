import { useEffect } from 'react'
import { useRef } from 'react'
import { useContext, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ThemeContext } from '../../../../utils/context/ThemeContext'
import colors from '../../../../utils/style/color'
import './index.css'
import Avatar from '../../../../assets/img/avatar4.png'
import { SocketContactContext } from '../../../../utils/context/SocketContact'

function Contact({ random, name1, name2, name3, contact, id, info, photoURL }) {
  const { socketContact, setSocketContact } = useContext(SocketContactContext)

  const location = useLocation()
  const navigate = useNavigate()

  const contactName = contact.firstName

  const [isHover, setIsHover] = useState(false)
  const [isSelected, setIsSelected] = useState(false)

  const bgBadge = isHover ? 'bg-white text-primary' : 'bg-primary'

  function handleClickContact(e) {
    // setIsSelected(false)
    // setIsSelected(true)
    offCanvasButton[0].click()
    setSocketContact(contact)
    nav(contact.userName)
  }

  function nav(name) {
    let pathId = location.pathname.split('/')[1]
    console.log('pathId', pathId)
    if (location.pathname !== '/') {
      navigate(`../${pathId}/${name}`)
    } else {
      navigate(`/${pathId}/${name}`)
    }
  }

  // DARK MODE
  const { theme } = useContext(ThemeContext)

  const bgContact = () => {
    if (isSelected) {
      return 'li-bg-primary'
    }
    if (!isSelected && theme === 'light') {
      return 'li-bg-light'
    } else if (!isSelected && theme !== 'light') {
      return 'li-bg-dark'
    }
  }

  const colorName = theme === 'light' ? '' : 'text-white'
  const colorInfo = theme === 'light' ? '' : 'text-white-50'

  const listOfContacts = useRef([])

  // console.log('photoURL', photoURL)

  const offCanvasButton = document.getElementsByClassName('offcanvas-button')
  // console.log('offcanvas-button', offCanvasButton)

  return (
    <li
      className={`w-100 py-2 m-0 rounded ${bgContact()}`}
      style={{ cursor: 'pointer' }}
      onClick={(e) => handleClickContact(e)}
      // onClick={(e) => coucou(e)}
      ref={listOfContacts}
    >
      <div className="row m-0 align-items-center">
        <div className="col-2">
          <img
            style={{
              height: '50px',
              width: '50px',
            }}
            // src={`https://picsum.photos/50/50?random=${random}`}
            src={photoURL ? photoURL : Avatar}
            className="rounded-circle"
            alt="..."
          ></img>
        </div>
        <div className="col">
          <div>
            <h3 className={`mb-0 fs-5 lh-1 ${colorName}`}>
              {name1}
              <span style={{ color: colors.primary }}>{name2}</span>
              {name3}
            </h3>
          </div>
          <div>
            <p className={`mb-0 fw-light pt-0 lh-1 ${colorInfo}`}>{info}</p>
          </div>
        </div>
        <div className="col-2 p-0">
          <span className={`badge rounded-pill ${bgBadge}`}>{random}</span>
        </div>
      </div>
    </li>
  )
}

export default Contact