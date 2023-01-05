import { useContext, createContext, useEffect, useState } from 'react'
import { doc } from 'firebase/firestore'
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithCredential,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  deleteUser,
  EmailAuthProvider,
  sendPasswordResetEmail,
} from 'firebase/auth'
import {
  auth,
  createUserInDB,
  db,
  getMyProfileFromDB,
} from '../../firebase-config'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export const AuthContextProvider = ({ children }) => {
  const navigate = useNavigate()
  const [loadingData, setLoadingData] = useState(true)
  const [user, setUser] = useState(null)
  const [isProfileCreated, setIsProfileCreated] = useState(null)
  const [userRef, setUserRef] = useState(null)

  // listen for every change in 'user' of firebase and change 'user' as well as 'isProfileCreated'
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      const isMyProfileCreated = await getIsMyProfileCreated(currentUser)
      console.log('isMyProfileCreated', isMyProfileCreated)
      console.log('User', currentUser)
      setIsProfileCreated(isMyProfileCreated)
      setUser(currentUser)
      if (currentUser) {
      }
      setLoadingData(false)
    })
    return () => {
      unsubscribe()
    }
  }, [])

  // set reference of my profile in DB
  useEffect(() => {
    setUserRefInDB()
  }, [user])

  // ----------------------- FUNCTIONS ---------------------------

  async function getIsMyProfileCreated(user) {
    if (!user) {
      return false
    }
    const myProfile = await getMyProfileFromDB(user.uid)
    if (myProfile && myProfile.isProfileCreated) {
      return true
    }
    return false
  }

  function setUserRefInDB() {
    if (user !== null) {
      setUserRef(doc(db, 'users', user.uid))
      sessionStorage.setItem('userID', user.uid)
    }
  }

  const signUp = (email, pwd) =>
    createUserWithEmailAndPassword(auth, email, pwd)

  const signIn = (email, pwd) => signInWithEmailAndPassword(auth, email, pwd)

  const logOut = async () => {
    await signOut(auth)
    // very important to navigate '/' if not navigate app crash
    navigate('/')
  }

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider)
      .then((res) => {
        /* Here the user is redirected but navigation is managed in protected routes (because when a user is identified by firebase the 'user' and protected routes is rerender and  they takes him where he needs to be)*/
        createUserInDB(res.user)
      })
      .catch((err) => console.log(err))
  }

  // const googleProvider = new GoogleAuthProvider()

  // function reauthWithGoogle() {
  //   return reauthenticateWith(auth, googleProvider).catch((err) =>
  //     console.log(err)
  //   )
  // }
  const deleteMyAccountFromFirebaseAuth = async () => {
    try {
      await deleteUser(user)
    } catch (error) {
      console.dir(error)
      const password = prompt('Please enter your password :')
      const email = user.email
      const authCredential = EmailAuthProvider.credential(email, password)
      const credential = await signInWithCredential(auth, authCredential)
      console.log('credential', credential)
      await deleteUser(credential.user)
        .then(() => {
          console.log('account is finally deleted!')
        })
        .catch((error) => {
          console.dir(error)
          alert('Your account was not deleted, please try again!')
        })
    }
  }

  const sendEmailWhenForgot = (email) =>
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent!
        console.log('email sent!')
        // ..
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        // ..
        alert(errorMessage)
        console.log(errorCode)
      })

  return (
    <AuthContext.Provider
      value={{
        googleSignIn,
        logOut,
        setUser,
        user,
        signInWithCredential,
        signUp,
        signIn,
        userRef,
        deleteMyAccountFromFirebaseAuth,
        sendEmailWhenForgot,
        isProfileCreated,
        setIsProfileCreated,
        getIsMyProfileCreated,
      }}
    >
      {!loadingData && children}
    </AuthContext.Provider>
  )
}

export const UserAuth = () => {
  return useContext(AuthContext)
}
