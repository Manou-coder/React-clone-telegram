import {
  arrayRemove,
  deleteField,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore'
import React, { useContext, useRef } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  db,
  getMyContactsFromDB,
  updateMyContactsInDB,
} from '../../firebase-config'
import { UserAuth } from '../../utils/context/AuthContext'
import { LanguageContext } from '../../utils/context/LanguageContext'
import { MessagesContext } from '../../utils/context/MessagesContext'
import { SocketContactContext } from '../../utils/context/SocketContact'
import { ThemeContext } from '../../utils/context/ThemeContext'

export default function ModalDeleteChat() {
  const { user } = UserAuth()
  const { socketContact, setMyContacts } = useContext(SocketContactContext)
  const { setArrOfMessages, setMessageSend } = useContext(MessagesContext)
  const { theme, setIsChatOpen } = useContext(ThemeContext)
  const { language } = useContext(LanguageContext)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const closeModal = useRef()

  async function deleteChat() {
    setIsLoading(true)
    // empty the 'arrOfMessages
    setMessageSend([])
    setArrOfMessages([])
    // delete this contact and his messages from DB
    await deleteThisContactIdFromMyContactsDB(user.uid, socketContact.userId)
    await deleteMessages(user.uid, socketContact.userId)
    // delete this contact from 'myContacts'
    deleteThisContactIdFromMyContacts()
    // close the modal and navigate to '/chat'
    closeModal.current.click()
    setIsChatOpen(false)
    navigate('/chat')
    setIsLoading(false)
  }

  // ------------------ Internal Functions -------------------------------

  function deleteThisContactIdFromMyContacts() {
    setMyContacts((curr) => {
      // console.log('curr', curr)
      curr = curr.filter((e) => socketContact.userId !== e.userId)
      return curr
    })
  }

  // ------------------------- Languages ---------------------------------
  const _deleteChat = {
    en: 'Delete chat',
    fr: "Supprimer l'échange",
    il: "למחוק צ'אט",
  }

  const _permanentlyDelete = {
    en: 'Permanently delete the chat with ',
    fr: "Voulez-vous supprimer définitivement l'échange avec ",
    il: "מחק לצמיתות את הצ'אט עם ",
  }

  const _cancel = {
    en: 'Cancel',
    fr: 'Annuler',
    il: 'בטל',
  }

  return (
    <>
      <div className="modal-header w-100">
        <div className="row w-100 d-flex justify-content-center align-items-center m-0">
          <div className="col-2">
            <img
              style={{ height: '50px', width: '50px' }}
              src={socketContact && socketContact.photoURL}
              className="rounded-circle me-4"
              alt="..."
            ></img>
          </div>
          <div className="col">
            <h1 className="modal-title fs-5" id="staticBackdropLabel">
              {_deleteChat[language]}
            </h1>
          </div>
          <div className="col-2 d-flex justify-content-center align-items-center">
            <button
              ref={closeModal}
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
        </div>
      </div>
      <div className="modal-body">
        <h5>
          {_permanentlyDelete[language]}{' '}
          <span className="fw-bold">
            {socketContact && socketContact.displayName}
          </span>
          ?
        </h5>
      </div>
      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-secondary"
          data-bs-dismiss="modal"
        >
          {_cancel[language]}
        </button>
        <button
          className="btn btn-danger"
          type="button"
          onClick={() => deleteChat()}
        >
          {isLoading && (
            <span
              className="spinner-border spinner-border-sm me-1"
              role="status"
              aria-hidden="true"
            ></span>
          )}
          {_deleteChat[language]}
        </button>
      </div>
    </>
  )
}

// ------------------------- External Functions -----------------------------

async function deleteThisContactIdFromMyContactsDB(myId, contactId) {
  const myContactsInDB = await getMyContactsFromDB(myId)
  // console.log('contactId', contactId)
  // console.log('myContactsInDB ', myContactsInDB)
  const myContactsWhithinNewContact = myContactsInDB.filter(
    (contact_id) => contact_id !== contactId
  )
  // console.log(' myContactsWhithinNewContact', myContactsWhithinNewContact)
  updateMyContactsInDB(myId, myContactsWhithinNewContact)
}

async function deleteMessages(myId, contactId) {
  console.log('contactId', contactId)
  const docRef = doc(db, 'usersMessages', myId)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    let data = docSnap.data()
    console.log('Document data contact:', data[contactId])
    await updateDoc(docRef, { [contactId]: deleteField() })
  } else {
    console.log('No such document!')
  }
}
