import React, { useEffect, useRef } from 'react'
import './Home.css'
import Ilustration from '../../assets/img/27.svg'
import { UserAuth } from '../../utils/context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { auth, createUserInDB, readDoc } from '../../firebase-config'
import { GoogleAuthProvider } from 'firebase/auth'
import SignUpModal from './components/SignUpModal'
import SignInModal from './components/SignInModal'
import { useState } from 'react'
import IconGoogle from '../../assets/img/icon_google.png'

export default function Home() {
  // eslint-disable-next-line no-unused-vars
  const { googleSignIn, user, signInWithCredential } = UserAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      readDoc(user.uid)
        .then((res) => {
          console.log('res', res)
          if (res) {
            if (res.isProfileCreated) {
              navigate(`/chat`)
            } else {
              navigate('/profile')
            }
          } else {
            navigate('/profile')
          }
        })
        .catch((err) => console.dir(err))
    } else {
      setShowHome(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const divRef = useRef(null)

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
      .then((res) => {
        console.log('res', res)
        createUserInDB(res.user)
        navigate('/profile')
      })
      .catch((error) => {
        console.dir(error)
      })
  }

  const [signInShow, setSignInShow] = useState(true)

  let colorSignIn = signInShow && 'text-primary'
  let colorSignUp = !signInShow && 'text-primary'
  let justifyContent = signInShow ? 'start' : 'end'

  const [showHome, setShowHome] = useState(false)

  return (
    <div>
      {showHome && (
        <div className="container-fluid vh-100 p-0 wallpapper-black">
          <div className="row w-100 h-100 m-0">
            <div className="col-12 col-md-6 p-0">
              <div className="d-flex flex-column justify-content-center align-items-center h-100 w-100">
                <div className="mb-2">
                  <div
                    role={'button'}
                    style={{ minWidth: '300px', cursor: 'pointer' }}
                    className="row py-2 rounded-5 button-google"
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
                      <span>Continue with Google</span>
                    </div>
                  </div>
                  {/* <div ref={divRef} /> */}
                </div>
                <div
                  className="bg-white rounded p-4"
                  style={{ minWidth: '300px' }}
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
                            >
                              Sign In
                            </h5>
                          </div>
                          <div className="col p-0 text-end">
                            <h5
                              onClick={() => setSignInShow(false)}
                              style={{ cursor: 'pointer' }}
                              className={'modal-title ' + colorSignUp}
                            >
                              Sign Up
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
                            style={{ width: '30%' }}
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
                    width="600"
                    height="600"
                    src={Ilustration}
                    alt="man whith computer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
