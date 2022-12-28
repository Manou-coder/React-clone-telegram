/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef } from 'react'
import './Profile.css'
import Avatar from '../../assets/img/avatar4.png'
import { UserAuth } from '../../utils/context/AuthContext'
import { camelCase } from 'lodash'
import {
  downloadImage,
  getAllUsersFromUsersListDB,
  getMyProfileFromDB,
  saveMyProfileInUsersListDB,
  setMyProfileInDB,
} from '../../firebase-config'
import { updateDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

import { uploadImage } from '../../firebase-config'
import { useContext } from 'react'
import { LanguageContext } from '../../utils/context/LanguageContext'

export default function Profile() {
  const navigate = useNavigate()
  const { user, userRef } = UserAuth()
  const { language } = useContext(LanguageContext)
  //states
  const [userDB, setUserDB] = useState({})
  const [isProfileAvatar, setisProfileAvatar] = useState(null)
  const [validation, setValidation] = useState('')
  //refs
  const profileName = useRef(null)
  const profileUserName = useRef(null)
  const inputAvatar = useRef(null)

  // console.log('isProfileAvatar', isProfileAvatar)

  //check if the user has already created a profile and if so, direct referral to the chat page
  useEffect(() => {
    if (user != null) {
      getMyProfileFromDB(user.uid)
        .then((res) => {
          // console.log('res', res)
          if (res) {
            if (!res.isProfileCreated) {
              setShowProfile(true)
            } else {
              navigate(`/chat`)
            }
          } else {
            setShowProfile(true)
          }
        })
        .catch((err) => console.dir(err))
    }
  }, [user])

  //if the user has logged in with a google account then the form will be automatically filled with their account information
  useEffect(() => {
    if (user !== null && profileName.current !== null) {
      try {
        const { displayName, photoURL } = user
        profileName.current.value = displayName
        createUserName(displayName)
        //  !!!!!!!!!!!!!!!! PROBLEME AVEC USER SANS GOOGLE ACCOUNT !!!!!!!!!!!!!!!!!!!!!!!!
        // probleme peut etre resolum
        // console.log('photoURL', photoURL)
        if (photoURL !== '' && photoURL !== null) {
          isProfileAvatar.src = photoURL
        } else {
          isProfileAvatar.src = Avatar
        }
      } catch (error) {
        console.log(error)
      }
    }
  }, [profileName.current])

  //waits for the DOM to be fully downloaded and displays the new profile picture
  useEffect(() => {
    if (isProfileAvatar !== null) {
      getProfilePictureInDB()
    }
  }, [isProfileAvatar])

  // retrieve the profile picture that was uploaded into the db
  async function getProfilePictureInDB() {
    const userDB = await getMyProfileFromDB(user.uid)
    setUserDB(userDB)
    console.log('userDB', userDB)
    if (userDB && userDB.photoURL !== '') {
      isProfileAvatar.src = userDB.photoURL
    }
  }

  //upload a profile picture to the db
  const uploadAvatar = async (e) => {
    e.preventDefault()
    setLoadingAvatar(true)
    await uploadImage(`profile/${user.uid}`, inputAvatar.current.files[0])
    const urlAvatar = await downloadImage(`profile/${user.uid}`)
    await updateDoc(userRef, {
      photoURL: urlAvatar,
    })
    const userDB = await getMyProfileFromDB(user.uid)
    isProfileAvatar.src = userDB.photoURL
    setLoadingAvatar(false)
  }

  //create a profile user in the db
  async function createProfile(e) {
    // console.log(userDB)
    e.preventDefault()
    setLoadingForm(true)
    const allUsers = await getAllUsersFromUsersListDB()
    if (allUsers) {
      const isSameUserName = allUsers.find(
        (user) => user.userName === profileUserName.current.value
      )
      if (isSameUserName) {
        setLoadingForm(false)
        setValidation(_thisUsername[language])
        return
      }
    }

    await setMyProfileInDB(user.uid, {
      displayName: profileName.current.value,
      userName: profileUserName.current.value,
      photoURL: isProfileAvatar.src,
      isProfileCreated: true,
    })

    await saveMyProfileInUsersListDB(user.uid, {
      displayName: profileName.current.value,
      userName: profileUserName.current.value,
      userId: user.uid,
      photoURL: isProfileAvatar.src,
    })
    console.log('oui')
    navigate('/chat')
  }

  //automatically adds a 'username' with an @ at the beginning of the word and a 'camelCase' structure
  function createUserName(name) {
    name = camelCase(name)
    profileUserName.current.value = '@' + name
  }

  // automatically adds an @ at the beginning of the word
  function addAt(elem) {
    let val = elem.value
    if (!val.match(/^@/)) {
      elem.value = '@' + val
    }
  }

  //simulates a click on an input type 'file'
  function addFile() {
    inputAvatar.current.click()
  }

  //loading states
  const [loadingForm, setLoadingForm] = useState(false)
  const [loadingAvatar, setLoadingAvatar] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  const _thisUsername = {
    en: 'This username is already used. Please enter a new username to continue.',
    fr: "Ce nom d'utilisateur est déjà utilisé. Veuillez entrer un nouveau nom d'utilisateur pour continuer.",
    il: 'שם המשתמש הזה כבר בשימוש. אנא הזן שם משתמש חדש כדי להמשיך.',
  }

  function handleClickAnywhere() {
    if (validation !== '') {
      setValidation('')
    }
  }

  return (
    <div>
      {showProfile && (
        <div
          className="container-fluid vh-100 p-0 d-flex justify-content-center align-items-center wallpapper-black"
          onClick={() => handleClickAnywhere()}
        >
          <div
            className="p-4 bg-white rounded d-flex"
            style={{ width: '300px', minWidth: '250px' }}
          >
            <div className="profile-content w-100">
              <div className="profile-header text-center mb-4">
                <h5 className="text-primary fw-bold">My Profile</h5>
              </div>
              <div className="profile-body d-flex flex-column justify-content-center">
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
                          ref={(e) => setisProfileAvatar(e)}
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
                    {validation !== '' && (
                      <p className="text-danger mt-1">{validation}</p>
                    )}
                  </div>
                  <button className="btn btn-primary mt-4 w-100">Submit</button>
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
