import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import {
  doc,
  getFirestore,
  setDoc,
  getDoc,
  onSnapshot,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_FIREBASE_APP_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_APP_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_FIREBASE_APP_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_APP_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGE_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_MESSAGE_APP_ID,
// }

const firebaseConfig = {
  apiKey: 'AIzaSyCdfAoe1Xcsm11iokwHN2uQVDG_JALKGxU',
  authDomain: 'react-auth-rrv6-954c0.firebaseapp.com',
  projectId: 'react-auth-rrv6-954c0',
  storageBucket: 'react-auth-rrv6-954c0.appspot.com',
  messagingSenderId: '1089001112233',
  appId: '1:1089001112233:web:40b883ac4e0c8079849fb8',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// console.log('db', db)
// console.log('storage', storage)

export const uploadImage = async (storageRef, file) => {
  storageRef = ref(storage, storageRef)
  try {
    const snapshot = await uploadBytes(storageRef, file)
    console.log('snaphot', snapshot)
  } catch (error) {
    console.dir(error)
  }
}

export const downloadImage = async (reference) => {
  // Create a reference to the file we want to download
  const storage = getStorage()
  const starsRef = ref(storage, reference)
  let urlAvatar
  await getDownloadURL(starsRef)
    .then((url) => {
      console.log('url ===', url)
      urlAvatar = url
    })
    .catch((error) => {
      console.dir(error)
    })
  return urlAvatar
}

export const createUserInDB = async (user) => {
  const { uid, email } = user
  const schemaUserDB = {
    email: email,
    displayName: '',
    userName: '',
    photoURL: '',
    userId: uid,
    isProfileCreated: false,
    myContacts: [],
  }
  await readDoc(uid)
    .then((res) => {
      if (res) {
        return console.log('yet saved')
      } else {
        setDoc(doc(db, 'users', uid), schemaUserDB)
          .then(console.log('userDB created: ', schemaUserDB))
          .catch((err) => console.dir(err))
      }
    })
    .catch((err) => console.dir(err))
}

export const saveUserInContactsList = async (userId, data) => {
  createUsersMessagesDB(userId)
  const docRef = doc(db, 'usersList', 'usersList')
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    const allUsers = docSnap.data()
    // console.log('Document data &&&&:', allUsers.users)
    const arrOfUsers = allUsers.users
    for (let i = 0; i < arrOfUsers.length; i++) {
      const element = arrOfUsers[i]
      console.log('element', element.userId)
      if (element.userId === userId) {
        console.log('element egal', element + ' ' + i)
        arrOfUsers[i] = data
        console.log('arrOfUsers', arrOfUsers)
        await setDoc(docRef, { users: arrOfUsers })
        return
      }
      await setDoc(
        docRef,
        {
          users: arrayUnion(data),
        },
        { merge: true }
      )
    }
  } else {
    // doc.data() will be undefined in this case
    console.log('No such document!')
    await setDoc(
      docRef,
      {
        users: arrayUnion(data),
      },
      { merge: true }
    )
  }
}

export const readDoc = async (userId) => {
  const docRef = doc(db, 'users', userId)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    // console.log('Document data:', docSnap.data())
    return docSnap.data()
  } else {
    console.log('No such document!')
    return null
  }
}

export const readAllUsers = async () => {
  const docRef = doc(db, 'usersList', 'usersList')
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    // console.log('Document data:', docSnap.data())
    return docSnap.data()
  } else {
    console.log('No such document!')
    return null
  }
}

export const setUserinDB = async (userId, data) => {
  const docRef = doc(db, 'users', userId)
  try {
    const docSnap = await setDoc(docRef, data, { merge: true })
    // console.log('docSnap', docSnap)
  } catch (error) {
    // console.dir(error)
  }
}

const createUsersMessagesDB = async (userId) => {
  const docRef = doc(db, 'usersMessages', userId)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    console.log('Document data:', docSnap.data())
    return
  } else {
    console.log('No such document!')
    await setDoc(docRef, { myId: userId })
    console.log('docRef cree!')
    return
  }
}
