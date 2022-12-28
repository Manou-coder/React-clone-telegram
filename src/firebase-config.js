import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import {
  doc,
  getFirestore,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  deleteDoc,
} from 'firebase/firestore'
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage'

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_FIREBASE_APP_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_APP_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_FIREBASE_APP_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_APP_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGE_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_MESSAGE_APP_ID,
// }

// V6

const firebaseConfig = {
  apiKey: 'AIzaSyCdfAoe1Xcsm11iokwHN2uQVDG_JALKGxU',
  authDomain: 'react-auth-rrv6-954c0.firebaseapp.com',
  projectId: 'react-auth-rrv6-954c0',
  storageBucket: 'react-auth-rrv6-954c0.appspot.com',
  messagingSenderId: '1089001112233',
  appId: '1:1089001112233:web:40b883ac4e0c8079849fb8',
}

// React-clone-telegram
// const firebaseConfig = {
//   apiKey: 'AIzaSyCHQD1NqBVQdQ_auXM2yoLQsXRV_sHPd-U',
//   authDomain: 'react-clone-telegram.firebaseapp.com',
//   projectId: 'react-clone-telegram',
//   storageBucket: 'react-clone-telegram.appspot.com',
//   messagingSenderId: '34430176565',
//   appId: '1:34430176565:web:35d130742ab59760e8907c',
// }

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// console.log('db', db)
// console.log('storage', storage)

// ------ 2 ------------- IMAGE PROFILE ---------------------------

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

// ----------------------------------------------------------

// ------- 4 --------------------- MY DB ---------------------------

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
    hasNewMessages: {},
  }
  await getMyProfileFromDB(uid)
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

export const setMyProfileInDB = async (userId, data) => {
  const docRef = doc(db, 'users', userId)
  try {
    const docSnap = await setDoc(docRef, data, { merge: true })
    console.log('docSnap', docSnap)
  } catch (error) {
    // console.dir(error)
  }
}

export const getMyProfileFromDB = async (userId) => {
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

// export const updateHasNewMessagesInDB = async (myId, contactId, operation) => {
//   const hasNewMessages = await getHasNewMessagesFromDB(myId)
//   // if hasNewMessages[contactId] not exists create it
//   if (hasNewMessages[contactId] === undefined) {
//     hasNewMessages[contactId] = 0
//   }
//   // if operation = add then add 1 else set to 0
//   if (operation === 'add') {
//     hasNewMessages[contactId] += 1
//   } else if (operation === 'suppr') {
//     hasNewMessages[contactId] = 0
//   }
//   finallyUpdateHasNewMessagesInDB(myId, hasNewMessages)
// }

export const updateHasNewMessagesInDB = async (myId, contactId, operation) => {
  // console.log('contactId', contactId)
  const hasNewMessages = await getHasNewMessagesFromDB(myId)
  // console.log('contactId', hasNewMessages)
  // console.log('hasNewMessages[contactId] 1', hasNewMessages[contactId])
  if (operation === 'add') {
    if (hasNewMessages[contactId] === undefined) {
      hasNewMessages[contactId] = 1
    } else {
      hasNewMessages[contactId] += 1
    }
  } else if (operation === 'suppr') {
    hasNewMessages[contactId] = 0
  }
  // console.log('hasNewMessages[contactId] 2', hasNewMessages[contactId])
  finallyUpdateHasNewMessagesInDB(myId, hasNewMessages)
}

// -----------------------------------------------------

// ------ 4 --------------------- USERSLIST -------------------------

export const saveMyProfileInUsersListDB = async (userId, data) => {
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

export const getAllUsersFromUsersListDB = async () => {
  const docRef = doc(db, 'usersList', 'usersList')
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    return docSnap.data().users
  } else {
    console.log('no such document')
    return null
  }
}

export const updateMyProfileInUsersListDB = async (myId, data) => {
  const allUsersFromUsersList = await getAllUsersFromUsersListDB()
  if (!allUsersFromUsersList) {
    console.log('no find allUsersFromUsersList!')
    return
  }
  const indexOfmyProfile = allUsersFromUsersList.findIndex(
    (user) => user.userId === myId
  )
  if (indexOfmyProfile < 0) {
    console.log('no find your index profile!')
    return
  }
  const myProfileInUsersList = allUsersFromUsersList[indexOfmyProfile]
  allUsersFromUsersList[indexOfmyProfile] = { ...myProfileInUsersList, ...data }
  await updateAllUsersInUsersListDB(allUsersFromUsersList)
}

export const updateAllUsersInUsersListDB = async (data) => {
  const docRef = doc(db, 'usersList', 'usersList')
  try {
    await updateDoc(docRef, {
      users: data,
    })
    console.log('doc updated !!')
  } catch (error) {
    console.dir(error)
  }
}

// -----------------------------------------------------------------

// ------ 3 ---------------------- USERSMESSAGES -----------------------

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

export const setMessagesWithThisContact = async (myId, contactId, arrMsg) => {
  const docRef = doc(db, 'usersMessages', myId)
  try {
    updateDoc(docRef, { [contactId]: arrMsg })
    console.log('doc updated !!')
  } catch (error) {
    console.log(error)
  }
}

export const getMessagesWithThisContact = async (myId, contactId) => {
  const docRef = doc(db, 'usersMessages', myId)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    return docSnap.data()[contactId]
  } else {
    console.log('No such document!')
    return null
  }
}

// -----2------------ MY CONTACTS ----------------

// get MyContacts
export const getMyContactsFromDB = async (myId) => {
  const docRef = doc(db, 'users', myId)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    const myContacts = docSnap.data().myContacts
    return myContacts
  } else {
    console.log('No such document!')
  }
}

// update MyContacts
export const updateMyContactsInDB = async (myId, contactId) => {
  const docRef = doc(db, 'users', myId)
  try {
    await updateDoc(docRef, {
      myContacts: contactId,
    })
    console.log('doc updated !!')
  } catch (error) {
    console.dir(error)
  }
}

//  ----------------------------------------------------------

// -----2------------ HAS NEW MESSGES ----------------

// get hasNewMessages
export const getHasNewMessagesFromDB = async (myId) => {
  const docRef = doc(db, 'users', myId)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    const hasNewMessages = docSnap.data().hasNewMessages
    return hasNewMessages
  } else {
    console.log('No such document!')
  }
}

// update hasNewMessages
export const finallyUpdateHasNewMessagesInDB = async (myId, data) => {
  const docRef = doc(db, 'users', myId)
  try {
    await updateDoc(docRef, {
      hasNewMessages: data,
    })
    console.log('doc updated !!')
  } catch (error) {
    console.dir(error)
  }
}

//  ----------------------------------------------------------

// -----2------------ USERS MESSAGES ----------------

// get allMessagesWhithThisContact
export const getAllMessagesWhithThisContactFromDB = async (myId, contactId) => {
  const docRef = doc(db, 'usersMessages', myId)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    const allMessagesWhithThisContact = docSnap.data()[contactId]
    // console.log('Document data:', allMessagesWhithThisContact)
    console.log('doc downloaded')
    return allMessagesWhithThisContact
  } else {
    console.log('No such document!')
  }
}

// update that I read all messages in the DB OF THIS CONTACT
export const updatetAllMessagesWhithThisContactInDB = async (
  myId,
  contactId,
  data
) => {
  const docRef = doc(db, 'usersMessages', myId)
  try {
    await updateDoc(docRef, {
      [contactId]: data,
    })
    console.log('doc updated !!')
  } catch (error) {
    console.dir(error)
  }
}

//  ----------------------------------------------------------

// -----3------------ MY CALLS----------------

// create users calls
const createUsersCallsDB = async (userId) => {
  const docRef = doc(db, 'usersCalls', userId)
  try {
    await setDoc(docRef, { myId: userId })
    console.log('usersCalls created!')
  } catch (error) {
    console.dir(error)
  }
}

// get MyCalls
export const getMyCallsFromDB = async (myId) => {
  const docRef = doc(db, 'usersCalls', myId)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    const myCalls = docSnap.data().myCalls
    return myCalls
  } else {
    console.log('No such document!')
    createUsersCallsDB(myId)
  }
}

// update MyCalls
export const updateMyCallsInDB = async (myId, call) => {
  const docRef = doc(db, 'usersCalls', myId)
  try {
    await updateDoc(docRef, {
      myCalls: call,
    })
    console.log('doc updated !!')
  } catch (error) {
    console.dir(error)
  }
}

//  ----------------------------------------------------------

// -----5------------ DELETE MY ACCOUNT ----------------

export const deleteMyUsers = async (myId) => {
  const docRef = doc(db, 'users', myId)
  try {
    await deleteDoc(docRef)
  } catch (error) {
    console.dir(error)
  }
}

export const deleteMyUsersMessages = async (myId) => {
  const docRef = doc(db, 'usersMessages', myId)
  try {
    await deleteDoc(docRef)
  } catch (error) {
    console.dir(error)
  }
}

export const deleteMyUsersCalls = async (myId) => {
  const docRef = doc(db, 'usersCalls', myId)
  try {
    await deleteDoc(docRef)
    console.log('userCall Supprimé')
  } catch (error) {
    console.dir(error)
  }
}

export const setMyStatusInUsersList = async (myId) => {
  const allUsersFromDB = await getAllUsersFromUsersListDB()
  const meInUsersList = allUsersFromDB.find((user) => user.userId === myId)
  if (meInUsersList) {
    meInUsersList.isDeleted = true
  }
  await updateAllUsersInUsersListDB(allUsersFromDB)
}

export const deleteMyProfileImage = async (storageRef, file) => {
  storageRef = ref(storage, storageRef)
  try {
    const snapshot = await deleteObject(storageRef)
    console.log('snaphot', snapshot)
  } catch (error) {
    console.dir(error)
  }
}
