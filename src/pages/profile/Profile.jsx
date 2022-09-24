/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef } from 'react'
import './Profile.css'
import Avatar from '../../assets/img/avatar4.png'
import { UserAuth } from '../../utils/context/AuthContext'
import { camelCase } from 'lodash'
import { updateProfile } from 'firebase/auth'
import {
  auth,
  db,
  downloadImage,
  readDoc,
  setUserDB,
  setUserinDB,
} from '../../firebase-config'
import { addDoc, collection, setDoc, updateDoc } from 'firebase/firestore'
import { Navigate, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { startsWith } from 'lodash'
import { uploadImage } from '../../firebase-config'
import { click } from '@testing-library/user-event/dist/click'
import { async } from '@firebase/util'

export default function Profile() {
  const { user, userRef } = UserAuth()
  const [userDB, setUserDB] = useState({})

  useEffect(() => {
    if (profileAvatar.current) {
      baba()
    }
  })

  async function baba() {
    const coucou = await readDoc(user.uid)
    setUserDB(coucou)
    // console.log('coucou', coucou)
    // console.log('coucou.photoURL', coucou.photoURL)
    if (coucou.photoURL !== '') {
      profileAvatar.current.src = coucou.photoURL
    }
  }

  useEffect(() => {
    if (user != null) {
      readDoc(user.uid)
        .then((res) => {
          if (!res.isProfileCreated) {
            setShowProfile(true)
          } else {
            navigate(`/${res.userId}`)
          }
        })
        .catch((err) => console.dir(err))
    }
  }, [user])

  let loadingForm = false
  const navigate = useNavigate()

  const profileName = useRef(null)
  const profileAvatar = useRef(null)
  const profileUserName = useRef(null)
  const inputAvatar = useRef(null)

  function createUserName(name) {
    name = camelCase(name)
    profileUserName.current.value = '@' + name
  }

  const uploadAvatar = async (e) => {
    e.preventDefault()
    // console.log('AVATAR', inputAvatar.current.files[0])
    setLoadingAvatar(true)
    const bobo = await uploadImage(
      `profile/${user.uid}`,
      inputAvatar.current.files[0]
    )
    // console.log('bobo', bobo)
    const urlAvatar = await downloadImage(`profile/${user.uid}`)
    // console.log('URL', urlAvatar)
    // console.log('userRef', userRef)
    await updateDoc(userRef, {
      photoURL: urlAvatar,
    })
    const userDB = await readDoc(user.uid)
    // console.log('coco', userDB.photoURL)
    profileAvatar.current.src = userDB.photoURL
    setLoadingAvatar(false)
  }

  // useEffect(() => {
  //   if (user != null) {
  //     // console.log(profileName.current)
  //     try {
  //       const { displayName, photoURL, uid } = user
  //       // console.log(profileName)
  //       if (profileName.current) {
  //         console.log('value', profileName.current)
  //         profileName.current.value = displayName
  //         createUserName(displayName)
  //         if (profileName.current.src === '') {
  //           profileAvatar.current.src = photoURL
  //         } else {
  //           profileAvatar.current.src = Avatar
  //         }
  //       }
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   }
  // })

  async function createProfile(e) {
    console.log(userDB)
    e.preventDefault()
    loadingForm = true

    setUserinDB(user.uid, {
      displayName: profileName.current.value,
      userName: profileUserName.current.value,
      isProfileCreated: true,
    })
    // navigate(`/${user.uid}`)
  }

  function addAt(elem) {
    let val = elem.value
    if (!val.match(/^@/)) {
      elem.value = '@' + val
    }
  }

  function addFile() {
    inputAvatar.current.click()
  }

  const [loadingAvatar, setLoadingAvatar] = useState(false)

  const [showProfile, setShowProfile] = useState(false)

  return (
    <div>
      {showProfile && (
        <div className="container-fluid vh-100 p-0 d-flex justify-content-center align-items-center">
          <div
            className="p-4 bg-white rounded d-flex"
            style={{ width: '300px', minWidth: '250px' }}
          >
            <div className="profile-content w-100">
              <div className="profile-header text-center mb-4">
                <h5 className="text-primary fw-bold">My Profile</h5>
              </div>
              <div className="profile-body d-flex flex-column justify-content-center">
                {/* <form onSubmit={(e) => createProfile(e)}> */}
                <form onSubmit={(e) => uploadAvatar(e)}>
                  <div className="position-relative">
                    <div className="picture d-flex justify-content-center mb-4">
                      <div className="position-relative">
                        <div className="tooltip2 position-absolute">
                          <span
                            className="tooltiptext2"
                            style={{ top: '0px', left: '20px', width: '150px' }}
                          >
                            Click on the image to add or change your profile
                            picture.
                          </span>
                          <svg
                            version="1.1"
                            id="Capa_1"
                            x="0px"
                            y="0px"
                            viewBox="0 0 330 330"
                            style={{
                              color: 'white',
                            }}
                            height="15px"
                          >
                            <g>
                              <path
                                fill="rgb(13, 110, 253)"
                                d="M165,0C74.019,0,0,74.02,0,165.001C0,255.982,74.019,330,165,330s165-74.018,165-164.999C330,74.02,255.981,0,165,0z
		 M165,300c-74.44,0-135-60.56-135-134.999C30,90.562,90.56,30,165,30s135,60.562,135,135.001C300,239.44,239.439,300,165,300z"
                              />
                              <path
                                fill="rgb(13, 110, 253)"
                                d="M164.998,70c-11.026,0-19.996,8.976-19.996,20.009c0,11.023,8.97,19.991,19.996,19.991
		c11.026,0,19.996-8.968,19.996-19.991C184.994,78.976,176.024,70,164.998,70z"
                              />
                              <path
                                fill="rgb(13, 110, 253)"
                                d="M165,140c-8.284,0-15,6.716-15,15v90c0,8.284,6.716,15,15,15c8.284,0,15-6.716,15-15v-90C180,146.716,173.284,140,165,140z
		"
                              />
                            </g>
                          </svg>
                        </div>
                        <img
                          onClick={() => addFile()}
                          ref={profileAvatar}
                          style={{
                            height: '175px',
                            width: '175px',
                            cursor: 'pointer',
                          }}
                          src={Avatar}
                          className="rounded-circle"
                          alt="..."
                          id="avatar0"
                        ></img>
                        <svg
                          className="svg-icon"
                          onClick={() => addFile()}
                          style={{
                            width: '5em',
                            height: '5em',
                            fill: '	rgb(255, 255, 255, 0.8)',
                            position: 'absolute',
                            top: '42px',
                            left: '50px',
                            cursor: 'pointer',
                          }}
                          viewBox="0 0 1024 1024"
                          version="1.1"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M853.333333 448a42.666667 42.666667 0 0 0-42.666666 42.666667v298.666666a42.666667 42.666667 0 0 1-42.666667 42.666667H170.666667a42.666667 42.666667 0 0 1-42.666667-42.666667v-341.333333a42.666667 42.666667 0 0 1 42.666667-42.666667h85.333333a42.666667 42.666667 0 0 0 42.666667-29.013333l23.04-69.973333a42.666667 42.666667 0 0 1 40.533333-29.013334H597.333333a42.666667 42.666667 0 0 0 0-85.333333H360.106667A128 128 0 0 0 238.933333 279.466667l-13.653333 42.666666H170.666667a128 128 0 0 0-128 128v341.333334a128 128 0 0 0 128 128h597.333333a128 128 0 0 0 128-128v-298.666667a42.666667 42.666667 0 0 0-42.666667-44.8z m-384-42.666667a170.666667 170.666667 0 1 0 170.666667 170.666667 170.666667 170.666667 0 0 0-170.666667-170.666667z m0 256a85.333333 85.333333 0 1 1 85.333334-85.333333 85.333333 85.333333 0 0 1-85.333334 85.333333z m469.333334-469.333333h-42.666667v-42.666667a42.666667 42.666667 0 0 0-85.333333 0v42.666667h-42.666667a42.666667 42.666667 0 0 0 0 85.333333h42.666667v42.666667a42.666667 42.666667 0 0 0 85.333333 0v-42.666667h42.666667a42.666667 42.666667 0 0 0 0-85.333333z" />
                        </svg>
                        <div className="row justify-content-center">
                          {loadingAvatar && (
                            <div
                              className="spinner-border text-primary"
                              role="status"
                              style={{
                                position: 'absolute',
                                top: '73px',
                                left: '71px',
                              }}
                            ></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <input
                    ref={inputAvatar}
                    onChange={(e) => uploadAvatar(e)}
                    name="picture"
                    type="file"
                    className="form-control"
                    id="inputAvatar"
                    style={{ display: 'none' }}
                  />
                </form>
                <form onSubmit={(e) => createProfile(e)}>
                  <div className="profile-name mt-4">
                    <div className="row align-items-center">
                      <div className="col-1">
                        <div className="tooltip2">
                          <svg
                            className="position-relative"
                            version="1.1"
                            id="Capa_1"
                            x="0px"
                            y="0px"
                            viewBox="0 0 330 330"
                            style={{
                              top: '-6px',
                              color: 'white',
                            }}
                            height="15px"
                          >
                            <g>
                              <path
                                fill="rgb(13, 110, 253)"
                                d="M165,0C74.019,0,0,74.02,0,165.001C0,255.982,74.019,330,165,330s165-74.018,165-164.999C330,74.02,255.981,0,165,0z
		 M165,300c-74.44,0-135-60.56-135-134.999C30,90.562,90.56,30,165,30s135,60.562,135,135.001C300,239.44,239.439,300,165,300z"
                              />
                              <path
                                fill="rgb(13, 110, 253)"
                                d="M164.998,70c-11.026,0-19.996,8.976-19.996,20.009c0,11.023,8.97,19.991,19.996,19.991
		c11.026,0,19.996-8.968,19.996-19.991C184.994,78.976,176.024,70,164.998,70z"
                              />
                              <path
                                fill="rgb(13, 110, 253)"
                                d="M165,140c-8.284,0-15,6.716-15,15v90c0,8.284,6.716,15,15,15c8.284,0,15-6.716,15-15v-90C180,146.716,173.284,140,165,140z
		"
                              />
                            </g>
                          </svg>
                          <span className="tooltiptext2">
                            This name will see shown on your profile.
                          </span>
                        </div>
                      </div>
                      <div className="col">
                        <h6
                          className="text-primary"
                          style={{ marginLeft: '-8px', cursor: 'context-menu' }}
                        >
                          Your Name
                        </h6>
                      </div>
                    </div>
                    <input
                      onBlur={(e) => createUserName(e.target.value)}
                      ref={profileName}
                      name="name"
                      required
                      type="text"
                      className="form-control"
                      id="name"
                    />
                  </div>
                  <div className="mt-4">
                    <div className="row align-items-center">
                      <div className="col-1">
                        <div className="tooltip2">
                          <svg
                            className="position-relative"
                            version="1.1"
                            id="Capa_1"
                            x="0px"
                            y="0px"
                            viewBox="0 0 330 330"
                            style={{
                              top: '-6px',
                              color: 'white',
                            }}
                            height="15px"
                          >
                            <g>
                              <path
                                fill="rgb(13, 110, 253)"
                                d="M165,0C74.019,0,0,74.02,0,165.001C0,255.982,74.019,330,165,330s165-74.018,165-164.999C330,74.02,255.981,0,165,0z
		 M165,300c-74.44,0-135-60.56-135-134.999C30,90.562,90.56,30,165,30s135,60.562,135,135.001C300,239.44,239.439,300,165,300z"
                              />
                              <path
                                fill="rgb(13, 110, 253)"
                                d="M164.998,70c-11.026,0-19.996,8.976-19.996,20.009c0,11.023,8.97,19.991,19.996,19.991
		c11.026,0,19.996-8.968,19.996-19.991C184.994,78.976,176.024,70,164.998,70z"
                              />
                              <path
                                fill="rgb(13, 110, 253)"
                                d="M165,140c-8.284,0-15,6.716-15,15v90c0,8.284,6.716,15,15,15c8.284,0,15-6.716,15-15v-90C180,146.716,173.284,140,165,140z
		"
                              />
                            </g>
                          </svg>
                          <span className="tooltiptext2">
                            This name is used to identify you by all users of
                            this platform. It is unique and must start with an
                            @.
                          </span>
                        </div>
                      </div>
                      <div className="col">
                        <h6
                          className="text-primary"
                          style={{ marginLeft: '-8px', cursor: 'context-menu' }}
                        >
                          Your Username
                        </h6>
                      </div>
                    </div>
                    <input
                      ref={profileUserName}
                      onKeyUp={(e) => addAt(e.target)}
                      name="Username"
                      required
                      type="text"
                      className="form-control"
                      id="Username"
                    />
                  </div>
                  <button
                    className="btn btn-primary mt-4 w-100"
                    // onClick={(e) => createProfile(e)}
                  >
                    Submit
                  </button>
                  <div className="row justify-content-center">
                    {loadingForm && (
                      <div
                        className="spinner-border text-primary mt-2"
                        role="status"
                      ></div>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
