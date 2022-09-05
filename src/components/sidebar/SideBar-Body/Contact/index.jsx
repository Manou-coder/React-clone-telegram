import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import colors from '../../../../utils/style/color'

function Contact({ random, name1, name2, name3, contact, id }) {

  const location = useLocation()
  const navigate = useNavigate()

  const contactName = contact

  const [isActive, setIsActive] = useState(false)

  const bgContact = isActive ? 'bg-light' : 'bg-white'
  const bgBadge = isActive ? 'bg-white text-primary' : 'bg-primary'

  function nav() {
    if (location.pathname !== '/') {
      navigate('../' + contactName)
    } else {
      navigate(contactName)
    }
  }

  return (
    <li
      className={`w-100 py-2 m-0 rounded ${bgContact}`}
      onMouseOver={() => {
        setIsActive(true)
      }}
      onMouseOut={() => {
        setIsActive(false)
      }}
      style={{ cursor: 'pointer' }}
      onClick={() => nav()}
    >
      <div className="row m-0 align-items-center">
        <div className="col-2">
          <img
            style={{
              height: '50px',
              width: '50px',
            }}
            src={`https://picsum.photos/50/50?random=${random}`}
            className="rounded-circle"
            alt="..."
          ></img>
        </div>
        <div className="col">
          <div>
            <h3 className="mb-0 fs-5 lh-1">
              {name1}
              <span style={{ color: colors.primary }}>{name2}</span>
              {name3}
            </h3>
          </div>
          <div>
            <p className="mb-0 fw-light pt-0 lh-1">last seen</p>
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
