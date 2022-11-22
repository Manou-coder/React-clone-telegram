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
import { db } from '../../firebase-config'
import { UserAuth } from '../../utils/context/AuthContext'
import { LanguageContext } from '../../utils/context/LanguageContext'
import { MessagesContext } from '../../utils/context/MessagesContext'
import { SocketContactContext } from '../../utils/context/SocketContact'
import { ThemeContext } from '../../utils/context/ThemeContext'

export default function ModalDeleteChat() {
  const { user } = UserAuth()
  const { socketContact, isChange, toggleChange } =
    useContext(SocketContactContext)
  const { arrOfMessages, setArrOfMessages, messageSend, setMessageSend } =
    useContext(MessagesContext)
  const { theme, setIsChatOpen } = useContext(ThemeContext)
  const { language } = useContext(LanguageContext)
  const navigate = useNavigate()
  const closeModal = useRef()

  async function deleteChat() {
    setIsLoading(true)
    setMessageSend([])
    setArrOfMessages([])
    await deleteContact()
    await deleteMessages()
    closeModal.current.click()
    toggleChange()
    setIsChatOpen(false)
    navigate('/chat')
    setIsLoading(false)
  }

  async function deleteContact() {
    const contact = socketContact
    const docRef = doc(db, 'users', user.uid)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      let data = docSnap.data().myContacts
      let newData = data.filter((e) => e.userId !== contact.userId)
      await updateDoc(docRef, { myContacts: newData })
      // return
    } else {
      console.log('No such document!')
    }
  }

  async function deleteMessages() {
    const contactId = socketContact.userId
    console.log('contactId', contactId)
    const docRef = doc(db, 'usersMessages', user.uid)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      let data = docSnap.data()
      console.log('Document data contact:', data[contactId])
      await updateDoc(docRef, { [contactId]: deleteField() })
      // return
    } else {
      console.log('No such document!')
    }
  }

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

  const [isLoading, setIsLoading] = useState(false)

  return (
    <>
      <div className="modal-header w-100">
        <div className="row w-100 d-flex justify-content-center align-items-center m-0">
          <div className="col-2">
            <img
              style={{ height: '50px', width: '50px' }}
              src={socketContact.photoURL}
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
          <span className="fw-bold">{socketContact.displayName}</span>?
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
        {/* <button
          type="button"
          className="btn btn-danger"
          onClick={() => deleteChat()}
        >
          {_deleteChat[language]}
        </button> */}
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
