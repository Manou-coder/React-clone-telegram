import React, { useContext, useRef } from 'react'
import { useState } from 'react'
import {
  deleteMyProfileImage,
  deleteMyUsers,
  deleteMyUsersCalls,
  deleteMyUsersMessages,
  setMyStatusInUsersList,
} from '../../firebase-config'
import { UserAuth } from '../../utils/context/AuthContext'
import { LanguageContext } from '../../utils/context/LanguageContext'
import { SocketContactContext } from '../../utils/context/SocketContact'

export default function ModalDeleteMyAccount() {
  const { user, deleteMyAccountFromFirebaseAuth } = UserAuth()
  const { setMyContacts, actuallyContactId, allUsers, setActuallyContactId } =
    useContext(SocketContactContext)
  const { language } = useContext(LanguageContext)
  const [isLoading, setIsLoading] = useState(false)
  const closeModal = useRef()

  async function deleteMyAccount() {
    setIsLoading(true)
    await deleteMyUsers(user.uid)
    await deleteMyUsersCalls(user.uid)
    await deleteMyUsersMessages(user.uid)
    await setMyStatusInUsersList(user.uid)
    await deleteMyProfileImage(`profile/${user.uid}`)
    await deleteMyAccountFromFirebaseAuth()
    closeModal.current.click()
    setIsLoading(false)
  }

  // ------------------------- Languages ---------------------------------

  const _deleteMyAccount = {
    en: 'Delete my account',
    fr: 'Supprimer mon compte',
    il: 'מחק את חשבון שלי',
  }

  const _areYouSure = {
    en: 'Are you sure you want to continue this operation?',
    fr: 'Êtes vous sur de vouloir continuer cette opération? ',
    il: 'האם אתה בטוח שברצונך להמשיך בפעולה זו?',
  }

  const _theDeletionOf = {
    en: '(The deletion of your account will be permanent and all your data will be lost.)',
    fr: '(La suppression de votre compte sera définitive et toutes vos données seront perdus.)',
    il: '(מחיקת החשבון שלך תהיה לצמיתות וכל הנתונים שלך יאבדו.)',
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
          <div className="col p-0">
            <h1 className="modal-title fs-5 fw-bold" id="staticBackdropLabel">
              {_deleteMyAccount[language]}
            </h1>
          </div>
          <div className="col-2 d-flex justify-content-center align-items-center">
            <button
              ref={closeModal}
              type="button"
              className="btn-close bg-light"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
        </div>
      </div>
      <div className="modal-body">
        <h5>{_areYouSure[language]}</h5>
        <h5>{_theDeletionOf[language]}</h5>
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
          onClick={() => deleteMyAccount()}
        >
          {isLoading && (
            <span
              className="spinner-border spinner-border-sm me-1"
              role="status"
              aria-hidden="true"
            ></span>
          )}
          {_deleteMyAccount[language]}
        </button>
      </div>
    </>
  )
}
