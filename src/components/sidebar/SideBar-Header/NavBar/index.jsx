import { useState } from 'react'
import SearchSideBar from '../SearchSideBar'
import color from '../../../../utils/style/color'

function NavBar({ inputLetters, setInputLetters }) {
  const [borderColor, setBorderColor] = useState(false)

  const shadowColor = !borderColor ? 'transparent' : color.primary

  const iconSearchColor = !borderColor ? color.black : color.primary

  return (
    <div
      className="row w-100 align-items-center sticky-top m-0 bg-white"
      style={{ height: '58px' }}
    >
      <div className="col-2 d-flex justify-content-center ">
        <span>
          <i className="fa-solid fa-bars fa-lg"></i>
        </span>
      </div>
      <div className="col d-flex justify-content-center">
        <div
          className={`row w-100 bg-white border rounded-5 my-2 py-2 align-items-center`}
          style={{ boxShadow: `0px 0px 0px 2px ${shadowColor}` }}
        >
          <div className="col-1">
            <span>
              {/* ICON SEARCH - equal to ("fa-solid fa-magnifying-glass fa-lg") */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                style={{
                  fill: iconSearchColor,
                  position: 'relative',
                  bottom: '2px',
                }}
                height="1.25em"
              >
                <path d="M500.3 443.7l-119.7-119.7c27.22-40.41 40.65-90.9 33.46-144.7C401.8 87.79 326.8 13.32 235.2 1.723C99.01-15.51-15.51 99.01 1.724 235.2c11.6 91.64 86.08 166.7 177.6 178.9c53.8 7.189 104.3-6.236 144.7-33.46l119.7 119.7c15.62 15.62 40.95 15.62 56.57 0C515.9 484.7 515.9 459.3 500.3 443.7zM79.1 208c0-70.58 57.42-128 128-128s128 57.42 128 128c0 70.58-57.42 128-128 128S79.1 278.6 79.1 208z" />
              </svg>
            </span>
          </div>
          <div className="col">
            <SearchSideBar
              setBorderColor={setBorderColor}
              inputLetters={inputLetters}
              setInputLetters={setInputLetters}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default NavBar
