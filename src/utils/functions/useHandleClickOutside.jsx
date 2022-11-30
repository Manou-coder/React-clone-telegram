import { useEffect, useRef, useState } from 'react'

// export default function useHandleClickOutside(ref) {

// const ref = useRef(null)
//   useEffect(() => {
//     document.addEventListener('click', handleClickOutside, true)
//     return () => {
//       document.removeEventListener('click', handleClickOutside, true)
//     }
//   }, [])

//   const handleClickOutside = (e) => {
//     if (!ref.current.contains(e.target)) {
//       console.log('Clicked Outside...')
//     } else {
//       console.log('Clicked Inside Div')
//     }
//   }
// }

// export default function useComponentVisible(initialIsVisible) {
//   const [isComponentVisible, setIsComponentVisible] = useState(initialIsVisible)
//   const ref = useRef(null)

//   const handleClickOutside = (event) => {
//     if (ref.current && !ref.current.contains(event.target)) {
//       console.log('Clicked Outside...')
//       setIsComponentVisible(false)
//     } else {
//       console.log('Clicked Inside Div')
//     }
//   }

//   useEffect(() => {
//     document.addEventListener('click', handleClickOutside, true)
//     return () => {
//       document.removeEventListener('click', handleClickOutside, true)
//     }
//   }, [])

//   return { ref, isComponentVisible, setIsComponentVisible }
// }

export default function useComponentVisible(initialIsVisible) {
  const [isComponentVisible, setIsComponentVisible] = useState(initialIsVisible)
  const refComponent = useRef(null)
  const refButton = useRef(null)

  const handleClickOutside = (event) => {
    if (
      refComponent.current &&
      !refComponent.current.contains(event.target) &&
      !refButton.current.contains(event.target)
    ) {
      //   console.log('Clicked Outside...')
      setIsComponentVisible(false)
    } else if (refButton.current && refButton.current.contains(event.target)) {
      //   console.log('Clicked refButton..')
    } else {
      //   console.log('Clicked refComponent..')
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true)
    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  }, [])

  return { refComponent, refButton, isComponentVisible, setIsComponentVisible }
}
