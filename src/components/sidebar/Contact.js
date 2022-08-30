import { useState } from 'react'
import '../../styles/Contact.css'

function Contact({ name, random }) {
  const bgLight = 'w-100 py-2 m-0 rounded'
  const bgPrimary = bgLight + ' bg-white'

  const badgePrimary = 'badge bg-primary rounded-pill'
  const badgewhite = 'badge bg-light rounded-pill text-primary'

  const [bgInitial, setBgInitial] = useState(bgLight)

  const [badgeInitial, setBadgeInitial] = useState(badgePrimary)

  return (
    <li
      className={bgInitial}
      onMouseOver={() => {
        setBgInitial(bgPrimary)
        setBadgeInitial(badgewhite)
      }}
      onMouseOut={() => {
        setBgInitial(bgLight)
        setBadgeInitial(badgePrimary)
      }}
      style={{ cursor: 'pointer' }}
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
            <h3 className="mb-0 fs-5 lh-1">{name}</h3>
          </div>
          <div>
            <p className="mb-0 fw-light pt-0 lh-1">last seen</p>
          </div>
        </div>
        <div className="col-2 p-0">
          <span className={badgeInitial}>{random}</span>
        </div>
      </div>
    </li>
  )
}

export default Contact
