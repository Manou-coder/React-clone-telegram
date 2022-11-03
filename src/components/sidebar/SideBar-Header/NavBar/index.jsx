import { useContext, useState } from 'react'
import SearchSideBar from '../SearchSideBar'
import color from '../../../../utils/style/color'
import './style.css'
import { ThemeContext } from '../../../../utils/context/ThemeContext'

function NavBar({
  inputLetters,
  setInputLetters,
  setIconBarIsActive,
  iconBarIsActive,
}) {
  // DARK MODE

  const { theme } = useContext(ThemeContext)

  const [borderColor, setBorderColor] = useState(false)

  const shadowColor = !borderColor ? 'transparent' : color.primary

  const iconSearchColor = () => {
    if (borderColor) {
      return color.primary
    } else if (theme !== 'light') {
      return '#909294'
    } else {
      return color.black
    }
  }

  const iconGrey = () => {
    if (!iconBarIsActive) {
      return ''
    } else if (theme === 'light') {
      return 'icon-bars-light-hover'
    } else {
      return 'icon-bars-dark-hover'
    }
  }

  function clickOutside(event) {
    // console.log('click')
    let target = event.target
    const allParentsOfTarget = []
    while (target) {
      allParentsOfTarget.unshift(target)
      target = target.parentElement
      try {
        let targetClassName = target.className
        // console.log('targetClassName', targetClassName)
        if (targetClassName.indexOf('settings-menu') >= 0) {
          return
        }
        if (
          targetClassName.indexOf('flag-icon') >= 0 ||
          targetClassName.indexOf('flag-icon2') >= 0
        ) {
          return
        }
      } catch (error) {}
    }
    setIconBarIsActive(false)
  }

  function iconeBarFunc(element) {
    if (!iconBarIsActive) {
      setIconBarIsActive(true)
      document.addEventListener('click', (e) => {
        clickOutside(e)
      })
    } else {
      setIconBarIsActive(false)
    }
  }

  const bgColor1 = theme === 'light' ? 'bg-white' : 'bg-dark'
  const bgColor2 = theme === 'light' ? 'bg-white' : 'bg-black'
  const border = theme === 'light' ? 'border' : ''
  const fill = theme === 'light' ? '' : '#909294'
  const iconBars = theme === 'light' ? 'icon-bars-light' : ' icon-bars-dark'

  return (
    <div
      className={`row w-100 align-items-center sticky-top m-0 ${bgColor1}`}
      style={{ height: '58px' }}
    >
      <div className="col-2 d-flex justify-content-center settings-menu">
        <span
          onClick={(e) => iconeBarFunc(e.target)}
          className={`icon-bars ${iconBars} d-flex justify-content-center align-items-center ${iconGrey()}`}
        >
          {/* <i className="fa-solid fa-bars fa-lg"></i> */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            style={{
              fill: fill,
            }}
            height="1.25em"
          >
            <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" />
          </svg>
        </span>
      </div>
      <div className="col d-flex justify-content-center">
        <div
          className={`row w-100 ${bgColor2} ${border} rounded-5 my-2 py-2 align-items-center`}
          style={{ boxShadow: `0px 0px 0px 2px ${shadowColor}` }}
        >
          <div className="col-1">
            <span>
              {/* ICON SEARCH - equal to ("fa-solid fa-magnifying-glass fa-lg") */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                style={{
                  fill: iconSearchColor(),
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
