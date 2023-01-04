/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useRef } from 'react'
import './Home.css'
import Ilustration from '../../assets/img/27.svg'
import { UserAuth } from '../../utils/context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { auth, createUserInDB, getMyProfileFromDB } from '../../firebase-config'
import { GoogleAuthProvider } from 'firebase/auth'
import SignUpModal from './components/SignUpModal'
import SignInModal from './components/SignInModal'
import { useState } from 'react'
import IconGoogle from '../../assets/img/icon_google.png'
import { LanguageContext } from '../../utils/context/LanguageContext'
import Flags from './components/Flags'
import SwitchMoon from './components/SwitchMoon'
import { ThemeContext } from '../../utils/context/ThemeContext'
import { getCanvasFont, getTextWidth } from '../../utils/functions/getTextWidth'

export default function Home() {
  // eslint-disable-next-line no-unused-vars
  const { googleSignIn, user, signInWithCredential, isProfileCreated } =
    UserAuth()
  const { theme } = useContext(ThemeContext)
  const { language } = useContext(LanguageContext)
  const [showHome, setShowHome] = useState(true)
  const [signInShow, setSignInShow] = useState(true)
  const [blueBarWidth, setBlueBarWidth] = useState({
    signIn: 0,
    signUp: 0,
  })
  const signInTitle = useRef()
  const signUpTitle = useRef()
  const divRef = useRef(null)
  const navigate = useNavigate()

  // useEffect(() => {
  //   if (isProfileCreated) {
  //     navigate('/profile')
  //     return
  //   }
  // }, [user])

  useEffect(() => {
    if (user === null) {
      /*global google */
      google.accounts.id.initialize({
        client_id:
          '610055838663-ubsdvvpd9h7p4l64cj37p7u08ijvpakt.apps.googleusercontent.com',
        callback: handleCredentialResponse,
        cancel_on_tap_outside: true,
      })
      google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // console.log(
          //   'notification.isNotDisplayed()',
          //   notification.isNotDisplayed()
          // )
          // console.log(
          //   'notification.isSkippedMoment()',
          //   notification.isSkippedMoment()
          // )
          // console.log('divRef.current', divRef.current)
          // if (divRef.current) {
          //   google.accounts.id.renderButton(divRef.current, {
          //     theme: 'outline',
          //     text: 'continue_with',
          //     size: 'large',
          //     width: '300px',
          //     shap: 'circle',
          //   })
          // }
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [divRef])

  function handleCredentialResponse(response) {
    // Build Firebase credential with the Google ID token.
    const idToken = response.credential
    const credential = GoogleAuthProvider.credential(idToken)
    console.log('credential', credential)

    // Sign in with credential from the Google user.
    signInWithCredential(auth, credential)
      .then(async (res) => {
        const cred = res.user
        console.log('cred', cred)
        createUserInDB(cred)
        // const isProfileCreated = await getMyProfileFromDB(cred.uid)
        console.log('isProfileCreated', isProfileCreated)
        // if (cred && isProfileCreated) {
        //   navigate(`/chat`)
        // } else {
        //   navigate(`/profile`)
        // }
      })
      .catch((error) => {
        console.dir(error)
      })
  }

  const colorSignIn = signInShow && 'text-primary'
  const colorSignUp = !signInShow && 'text-primary'
  const justifyContent = signInShow ? 'start' : 'end'
  const bgColor1 = theme === 'light' ? 'bg-light' : 'bg-dark'
  const bgColor2 = theme === 'light' ? 'bg-white' : 'bg-black'
  const textColor = theme === 'light' ? '' : 'text-white'
  const wallpaper = theme === 'light' ? 'wallpapper' : 'wallpapper-black'

  // resize blue bar relative to the length of the text
  useEffect(() => {
    if (!signInTitle.current || !signUpTitle.current) {
      return
    }
    const signInSize = getTextWidth(
      _signIn[language],
      getCanvasFont(signInTitle.current)
    )
    const signUpSize = getTextWidth(
      _signUp[language],
      getCanvasFont(signUpTitle.current)
    )
    // console.log('signInSize', signInSize)
    // console.log('signUpSize', signUpSize)
    setBlueBarWidth({
      ...blueBarWidth,
      ...{ signIn: signInSize, signUp: signUpSize },
    })
  }, [signInTitle.current, signUpTitle.current, language, signInShow])

  return (
    <div>
      {showHome && (
        <div
          className={`container-fluid vh-100 p-0 ${wallpaper} overflow-hidden`}
        >
          <nav>
            <div className="m-0 mt-2 d-flex justify-content-end align-items-center">
              <div className="">
                <SwitchMoon />
              </div>
              <div className="">
                <Flags />
              </div>
              <div className="ms-2"></div>
            </div>
          </nav>
          <div style={{ paddingTop: '70px' }}>
            <div className="row w-100 h-100 m-0">
              <div className="col-12 col-md-6 p-0">
                <div className="d-flex flex-column justify-content-center align-items-center h-100 w-100">
                  <div className="mb-2">
                    <div
                      role={'button'}
                      style={{ minWidth: '300px', cursor: 'pointer' }}
                      className={`row py-2 rounded-5 button-google ${bgColor1} ${textColor}`}
                      onClick={googleSignIn}
                    >
                      <div className="col-2">
                        <img
                          style={{ height: '2em' }}
                          src={IconGoogle}
                          alt="icon_google"
                        />
                      </div>
                      <div className="col pt-1">
                        <span>{_continueWithGoogle[language]}</span>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`rounded p-4 ${bgColor1} ${textColor}`}
                    style={{ width: '300px' }}
                  >
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="d-flex flex-column  modal-header mb-2">
                          <div className="row w-100 m-0">
                            <div className="col p-0">
                              <h5
                                onClick={() => setSignInShow(true)}
                                style={{ cursor: 'pointer' }}
                                className={'modal-title ' + colorSignIn}
                                ref={signInTitle}
                              >
                                {_signIn[language]}
                              </h5>
                            </div>
                            <div
                              className="col p-0"
                              style={{ textAlign: 'end' }}
                            >
                              <h5
                                onClick={() => setSignInShow(false)}
                                style={{ cursor: 'pointer' }}
                                className={'modal-title ' + colorSignUp}
                                ref={signUpTitle}
                              >
                                {_signUp[language]}
                              </h5>
                            </div>
                          </div>
                          <div
                            className={
                              'w-100 h-100 d-flex justify-content-' +
                              justifyContent
                            }
                          >
                            <div
                              className="row bg-primary py-1 mt-1 rounded m-0"
                              style={{
                                width: signInShow
                                  ? blueBarWidth.signIn
                                  : blueBarWidth.signUp,
                              }}
                            ></div>
                          </div>
                        </div>
                        {signInShow ? <SignInModal /> : <SignUpModal />}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-none d-md-flex col-md-6 p-0">
                <div className="d-flex justify-content-start align-items-center h-100 w-100">
                  <div>
                    <img
                      width="90%"
                      height="100%"
                      src={Ilustration}
                      alt="man whith computer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const _signIn = {
  en: 'Sign in',
  fr: "S'identifier",
  il: 'להתחבר',
}

const _signUp = {
  en: 'Sign up',
  fr: "S'inscrire",
  il: 'הירשם',
}

const _continueWithGoogle = {
  en: 'Continue with Google',
  fr: 'Continuer avec Google',
  il: 'המשך עם גוגל',
}
