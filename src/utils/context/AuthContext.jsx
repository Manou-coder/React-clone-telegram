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
  //     const baba = readDoc(res.user.uid)
  //     console.log('baba', baba)
  //   } catch (error) {
  //     console.dir(error)
  //   }

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

  // galere de derniere minute g mis ici le actually contact id bien que normalement il doit etre dans 'socketContact' parce que je dois utiler l'id dans peer context qui est au dessus de 'socketContact'
  const [actuallyContactId, setActuallyContactId] = useState('')

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
        actuallyContactId,
        setActuallyContactId,
      }}
    >
      {!loadingData && children}
    </AuthContext.Provider>
  )
}

export const UserAuth = () => {
  return useContext(AuthContext)
}
