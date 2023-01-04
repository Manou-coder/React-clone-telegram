import { useContext, createContext, useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithCredential,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  deleteUser,
  getAuth,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  updatePassword,
  EmailAuthProvider,
  sendPasswordResetEmail,
} from 'firebase/auth'
import {
  auth,
  createUserInDB,
  db,
  getMyProfileFromDB,
  unsub,
} from '../../firebase-config'
import { useNavigate } from 'react-router-dom'
import { set } from 'date-fns'

const AuthContext = createContext()

export const AuthContextProvider = ({ children }) => {
  const [loadingData, setLoadingData] = useState(true)
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [isProfileCreated, setIsProfileCreated] = useState(null)
  const [userRef, setUserRef] = useState(null)

  async function getIsMyProfileCreated(user) {
    if (!user) {
      return false
    }
    const myProfile = await getMyProfileFromDB(user.uid)
    // console.log('myProfile', myProfile)
    // console.log('myProfile.isProfileCreated', myProfile.isProfileCreated)
    if (myProfile && myProfile.isProfileCreated) {
      return true
    }
    return false
  }

  function setUser2() {
    if (user !== null) {
      setUserRef(doc(db, 'users', user.uid))
      sessionStorage.setItem('userID', user.uid)
    }
  }

  useEffect(() => {
    setUser2()
  }, [user])

  // console.log(userRef)

  const signUp = (email, pwd) =>
    createUserWithEmailAndPassword(auth, email, pwd)

  const signIn = (email, pwd) => signInWithEmailAndPassword(auth, email, pwd)

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider)
      .then((res) => {
        console.log('userDB', res)
        createUserInDB(res.user)
          .then()
          .catch((err) => console.dir(err))
      })
      .catch((err) => console.log(err))
  }

  // const googleSignIn = async () => {
  //   const provider = new GoogleAuthProvider()
  //   try {
  //     const res = await signInWithPopup(auth, provider)
  //     console.log('manou', res)
  //     const baba = getMyProfileFromDB(res.user.uid)
  //     console.log('baba', baba)
  //   } catch (error) {
  //     console.dir(error)
  //   }

  const logOut = async () => {
    await signOut(auth)
    navigate('/')
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)
      const isMyProfileCreated = await getIsMyProfileCreated(currentUser)
      console.log('isMyProfileCreated', isMyProfileCreated)
      setIsProfileCreated(isMyProfileCreated)
      setLoadingData(false)
      console.log('User', currentUser)
    })
    return () => {
      unsubscribe()
    }
  }, [])

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
