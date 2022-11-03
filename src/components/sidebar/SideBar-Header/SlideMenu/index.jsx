import { useContext } from 'react'
import { LanguageContext } from '../../../../utils/context/LanguageContext'
import { ThemeContext } from '../../../../utils/context/ThemeContext'
import './index.css'

export default function SlideMenu({ isContactsOpen, setContactsOpen }) {
  // DARK MODE
  const { theme } = useContext(ThemeContext)
  const bgColor = theme === 'light' ? 'bg-white' : 'bg-dark'

  const textColorContact = () => {
    if (isContactsOpen) {
      return 'text-primary'
    } else if (theme === 'light') {
      return ''
    } else {
      return 'text-white-50'
    }
  }

  const textColorCalls = () => {
    if (!isContactsOpen) {
      return 'text-primary'
    } else if (theme === 'light') {
      return ''
    } else {
      return 'text-white-50'
    }
  }

  const slideOption =
    theme === 'light' ? 'slide-option-light' : 'slide-option-dark'

  // LANGUAGE
  const { language } = useContext(LanguageContext)

  const _allChats = {
    en: 'All Chats',
    fr: 'Discussions',
    il: "צ'אטים",
  }

  const _calls = {
    en: 'Calls',
    fr: 'Appels',
    il: 'שיחות',
  }

  return (
    <div
      className={`row text-center py-3 w-100 m-0 ${bgColor}`}
      style={{ borderBottom: `1px solid black` }}
    >
      <div className="col">
        <div className="d-flex justify-content-center">
          <div
            className={`d-flex justify-content-center align-items-center slide-option ${slideOption}`}
          >
            <button
              style={{
                border: 'none',
                backgroundColor: 'transparent',
                position: 'relative',
                top: '-1px',
              }}
              className={`fw-bold cursor-pointer ${textColorContact()}`}
              onClick={() => setContactsOpen(true)}
            >
              {_allChats[language]}
            </button>
          </div>
        </div>
        {isContactsOpen ? (
          <div
            className="row bg-primary py-1 w-75 mt-1 rounded"
            style={{ margin: 'auto' }}
          ></div>
        ) : null}
      </div>
      <div className="col">
        <div className="d-flex justify-content-center">
          <div
            className={`d-flex justify-content-center align-items-center slide-option ${slideOption}`}
          >
            <button
              style={{
                border: 'none',
                backgroundColor: 'transparent',
                position: 'relative',
                top: '-1px',
              }}
              className={`fw-bold cursor-pointer ${textColorCalls()}`}
              onClick={() => setContactsOpen(false)}
            >
              {_calls[language]}
            </button>
          </div>
        </div>
        {!isContactsOpen ? (
          <div
            className="row bg-primary py-1 w-75 mt-1 rounded"
            style={{ margin: 'auto' }}
          ></div>
        ) : null}
      </div>
    </div>
  )
}
