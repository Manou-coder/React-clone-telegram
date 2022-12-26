import React, { useContext } from 'react'
import { LanguageContext } from '../../../../utils/context/LanguageContext'

export default function Offline() {
  // LANGUAGE
  const { language } = useContext(LanguageContext)

  const _yourDevice = {
    en: 'Your Device is offline.',
    fr: 'Votre appareil est hors ligne.',
    il: 'המכשיר שלך לא מקוון.',
  }

  const _please = {
    en: 'Please check your ',
    fr: 'Veuillez vérifier votre ',
    il: 'אנא בדוק את ',
  }

  const _connection = {
    en: 'connection.',
    fr: 'connexion.',
    il: 'החיבור שלך',
  }
  return (
    <div className="bg-warning py-1">
      <div className="row">
        <div className="col-3 d-flex justify-content-center align-items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
            style={{
              height: '50px',
            }}
          >
            <rect fill="none" />
            <line
              x1="47.982"
              x2="207.982"
              y1="40"
              y2="216"
              fill="none"
              stroke="#000"
              strokellinecap="round"
              strokellinejoin="round"
              strokeWidth="24"
            />
            <path
              fill="none"
              stroke="#000"
              // strokeLinecap="round"
              // strokeLinejoin="round"
              strokeWidth="24"
              d="M25.04621 98.17952A145.88673 145.88673 0 0 1 72.40779 66.8671M58.961 132.12064a97.89874 97.89874 0 0 1 49.03639-26.105M92.90211 166.06177a50.81565 50.81565 0 0 1 67.576-2.317M116.96071 56.40892q5.45356-.4036 11.0139-.406A145.90176 145.90176 0 0 1 230.903 98.17952M167.79881 112.332a97.8573 97.8573 0 0 1 29.18942 19.78862"
            />
            <circle cx="128" cy="200" r="16" />
          </svg>
        </div>
        <div className="col">
          <h4 className="mb-0">{_yourDevice[language]}</h4>
          <h5 className="mb-0 lh-1">
            {_please[language]}
            <button
              style={{
                background: 'none',
                color: 'inherit',
                border: 'none',
                padding: '0',
                font: 'inherit',
                cursor: 'pointer',
                outline: 'inherit',
                textDecoration: 'underline',
              }}
              onClick={() => window.location.reload()}
            >
              {_connection[language]}
            </button>
          </h5>
        </div>
      </div>
    </div>
  )
}
