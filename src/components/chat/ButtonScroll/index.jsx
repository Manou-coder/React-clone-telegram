import React from 'react'

export default function ButtonScroll({ lastMessageRef }) {
  return (
    <div
      className="bg-primary"
      onClick={() =>
        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' })
      }
      style={{
        height: '50px',
        width: '50px',
        borderRadius: '25px',
        position: 'absolute',
        bottom: '80px',
        right: '30px',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        height="30px"
        viewBox="0 0 256 256"
        style={{ position: 'relative', top: '3px' }}
      >
        <defs></defs>
        <g
          style={{
            stroke: 'none',
            strokeWidth: '0',
            strokeDasharray: 'none',
            strokeLinecap: 'butt',
            strokeLinejoin: 'miter',
            strokeMiterlimit: '10',
            fill: 'none',
            fillRule: 'nonzero',
            opacity: '1',
          }}
          transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"
        >
          <path
            d="M 90 24.25 c 0 -0.896 -0.342 -1.792 -1.025 -2.475 c -1.366 -1.367 -3.583 -1.367 -4.949 0 L 45 60.8 L 5.975 21.775 c -1.367 -1.367 -3.583 -1.367 -4.95 0 c -1.366 1.367 -1.366 3.583 0 4.95 l 41.5 41.5 c 1.366 1.367 3.583 1.367 4.949 0 l 41.5 -41.5 C 89.658 26.042 90 25.146 90 24.25 z"
            style={{
              stroke: 'none',
              strokeWidth: '1',
              strokeDasharray: 'none',
              strokeLinecap: 'butt',
              strokeLinejoin: 'miter',
              strokeMiterlimit: '10',
              fill: 'white',
              fillRule: 'nonzero',
              opacity: '1',
            }}
            transform=" matrix(1 0 0 1 0 0) "
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  )
}
