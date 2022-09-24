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
} from 'firebase/auth'
import { auth, createUserInDB, db, readDoc, unsub } from '../../firebase-config'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export const AuthContextProvider = ({ children }) => {
  const [loadingData, setLoadingData] = useState(true)
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [userRef, setUserRef] = useState(null)

  function setUser2() {
    if (user !== null) {
      setUserRef(doc(db, 'users', user.uid))
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

  const logOut = async () => {
    await signOut(auth)
    navigate('/')
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoadingData(false)
      console.log('User', currentUser)
    })
    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        googleSignIn,
        logOut,
        user,
        signInWithCredential,
        signUp,
        signIn,
        userRef,
      }}
    >
      {!loadingData && children}
    </AuthContext.Provider>
  )
}

export const UserAuth = () => {
  return useContext(AuthContext)
}
