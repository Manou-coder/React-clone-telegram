import React, { useContext, useEffect, useState } from 'react'
import Avatar from '../../assets/img/avatar4.png'
import { useRef } from 'react'
import {
  downloadImage,
  getAllUsersFromUsersListDB,
  getMyProfileFromDB,
  saveMyProfileInUsersListDB,
  setMyProfileInDB,
  updateMyProfileInUsersListDB,
  uploadImage,
} from '../../firebase-config'
import { UserAuth } from '../../utils/context/AuthContext'
import { updateDoc } from 'firebase/firestore'
import Check from '../../assets/img/check.svg'
import { imgError } from '../../utils/functions/returnAvatarIsImgError'
import { ThemeContext } from '../../utils/context/ThemeContext'
import { LanguageContext } from '../../utils/context/LanguageContext'
import { resizeFile } from '../../utils/functions/resizeImage'

export default function OffCanvasProfile({ offCanvas, setOffCanvas }) {
  const { user, userRef } = UserAuth()
  const [validation, setValidation] = useState('')
  const [loadingAvatar, setLoadingAvatar] = useState(false)
  const [loadingForm, setLoadingForm] = useState(false)
  const [isCheck, setIscheck] = useState(false)
  const profileName = useRef(null)
  const profileAvatar = useRef(null)
  const profileUserName = useRef(null)
  const inputAvatar = useRef(null)
  const check = useRef(null)

  useEffect(() => {
    if (offCanvas.name === 'myProfile' && profileAvatar.current) {
      // console.log('offCanvas', offCanvas)
      showMyProfile()
    }
  }, [offCanvas])

  async function showMyProfile() {
    const myProfileInDB = await getMyProfileFromDB(user.uid)
    // console.log('myProfileInDB', myProfileInDB)
    if (!myProfileInDB) {
      return
    }
    const { displayName, userName, photoURL } = myProfileInDB
    // console.log(displayName, userName, photoURL)
    if (myProfileInDB.photoURL !== '') {
      profileAvatar.current.src = photoURL
    } else {
      profileAvatar.current.src = Avatar
    }
    profileName.current.value = displayName
    profileUserName.current.value = userName
  }

  //Loading data information of user DB

  const uploadAvatar = async (e) => {
    e.preventDefault()
    console.log('AVATAR', inputAvatar.current.files[0])
    setLoadingAvatar(true)
    // ----------------------------------------------
    try {
      const file = inputAvatar.current.files[0]
      // sets the image quality to 80%
      const fileResizing = await resizeFile(file)
      console.log(fileResizing)
      await uploadImage(`profile/${user.uid}`, fileResizing)
    } catch (err) {
      console.log(err)
      return
    }
    // ----------------------------------------
    // it's important to download the image because without it we can't get the full url of firebase
    const urlAvatar = await downloadImage(`profile/${user.uid}`)
    // update in my DB
    await updateDoc(userRef, {
      photoURL: urlAvatar,
    })
    await setMyProfileInDB(user.uid, { photoURL: urlAvatar })
    // update in usersList in DB
    await updateMyProfileInUsersListDB(user.uid, { photoURL: urlAvatar })
    // change the profile avatar with the new url avatar
    profileAvatar.current.src = urlAvatar
    setLoadingAvatar(false)
  }

  async function createProfile(e) {
    e.preventDefault()
    setLoadingForm(true)
    const allUsers = await getAllUsersFromUsersListDB()
    if (!allUsers) {
      console.log('no find all users')
      return
    }
    // searches for a user from the userList who has the same userName
    const isSameUserName = allUsers.find(
      (user) => user.userName === profileUserName.current.value
    )
    // if this username is already in use and it is not my own username return an error in 'validation'
    if (isSameUserName && isSameUserName.userId !== user.uid) {
      console.log('find same user')
      setLoadingForm(false)
      setValidation(_thisUsername[language])
      return
    }
    await setMyProfileInDB(user.uid, {
      displayName: profileName.current.value,
      userName: profileUserName.current.value,
    })
    // here it is different from the form of 'profile.jsx' because the function is 'update' and not 'save'
    await updateMyProfileInUsersListDB(user.uid, {
      displayName: profileName.current.value,
      userName: profileUserName.current.value,
      userId: user.uid,
      photoURL: profileAvatar.current.src,
    })
    setLoadingForm(false)
    animeCheck()
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

  function animeCheck() {
    setIscheck(true)
    setTimeout(() => {
      setIscheck(false)
    }, 1000)
  }

  // DARK MODE
  const { theme } = useContext(ThemeContext)
  const bgColor1 = theme === 'light' ? 'bg-white' : 'bg-black'
  const bgColor2 = theme === 'light' ? 'bg-light' : 'bg-dark'
  const textColor = theme === 'light' ? 'text-dark' : 'text-light'

  // LANGUAGE
  const { language } = useContext(LanguageContext)

  const _avatarInfo = {
    en: 'Click on the image to add or change your profile picture.',
    fr: "Cliquez sur l'image pour ajouter ou modifier votre photo de profil.",
    il: 'לחץ על התמונה כדי להוסיף או לשנות את תמונת הפרופיל שלך.',
  }

  const _nameInfo = {
    en: 'This name will see shown on your profile.',
    fr: 'Ce nom apparaîtra sur votre profil.',
    il: 'השם הזה יוצג בפרופיל שלך.',
  }

  const _yourName = {
    en: 'Name',
    fr: 'Nom',
    il: 'שם',
  }

  const _userNameInfo = {
    en: 'This name is used to identify you by all users of this platform. It is unique and must start with an @.',
    fr: 'Ce nom est utilisé pour vous identifier par tous les utilisateurs de cette plateforme. Il est unique et doit commencer par un @.',
    il: 'שם זה משמש לזיהויך על ידי כל המשתמשים בפלטפורמה זו. שם זה ייחודי וחייב להתחיל עם @.',
  }

  const _userName = {
    en: 'Username',
    fr: "Nom d'utilisateur",
    il: 'שם משתמש',
  }

  const _submit = {
    en: 'Submit',
    fr: 'Envoyer',
    il: 'שלח',
  }

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
    <div
      className={`offcanvas-body ${bgColor2}`}
      onClick={() => handleClickAnywhere()}
    >
      <div className="profile-body d-flex flex-column justify-content-center container">
        <form className="mt-2" onSubmit={(e) => uploadAvatar(e)}>
          <div className="position-relative">
            <div className="picture d-flex justify-content-center mb-4">
              <div className="position-relative">
                <div className="tooltip2 position-absolute">
                  <span
                    className="tooltiptext2"
                    style={{ top: '0px', left: '20px', width: '150px' }}
                  >
                    {_avatarInfo[language]}
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
                  onError={(e) => imgError(e.target)}
                  ref={profileAvatar}
                  style={{
                    height: '175px',
                    width: '175px',
                    cursor: 'pointer',
                  }}
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
            id="avatar"
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
                  <span className="tooltiptext2">{_nameInfo[language]}</span>
                </div>
              </div>
              <div className="col">
                <h6
                  className="text-primary"
                  style={{ marginLeft: '-8px', cursor: 'context-menu' }}
                >
                  {_yourName[language]}
                </h6>
              </div>
            </div>
            <input
              ref={profileName}
              name="name"
              required
              type="text"
              className={`form-control ${bgColor1} ${textColor}`}
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
                    {_userNameInfo[language]}
                  </span>
                </div>
              </div>
              <div className="col">
                <h6
                  className="text-primary"
                  style={{ marginLeft: '-8px', cursor: 'context-menu' }}
                >
                  {_userName[language]}
                </h6>
              </div>
            </div>
            <input
              ref={profileUserName}
              onKeyUp={(e) => addAt(e.target)}
              name="Username"
              required
              type="text"
              className={`form-control ${bgColor1} ${textColor}`}
              id="Username"
            />
            {validation !== '' && (
              <p className="text-danger mt-1">{validation}</p>
            )}
          </div>
          <button className="btn btn-primary mt-4 w-100">
            {_submit[language]}
          </button>
          <div className="row justify-content-center mt-2">
            {loadingForm && (
              <div
                className="spinner-border text-primary mt-2"
                role="status"
              ></div>
            )}
            {isCheck && (
              <img
                ref={check}
                style={{ height: '40px' }}
                src={Check}
                alt="check"
              />
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
