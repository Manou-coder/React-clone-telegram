import React, { useContext } from 'react'
import { UserAuth } from '../../../../utils/context/AuthContext'
import { ThemeContext } from '../../../../utils/context/ThemeContext'
import { LanguageContext } from '../../../../utils/context/LanguageContext'
import {
  getAllMessagesWhithThisContactFromDB,
  updatetAllMessagesWhithThisContactInDB,
} from '../../../../firebase-config'
import { SocketContactContext } from '../../../../utils/context/SocketContact'
import { addBadgeDateToArr } from '../MessageBody'
import { MessagesContext } from '../../../../utils/context/MessagesContext'

export default function MessageMenu({
  messageId,
  arrOfSelectedMessages,
  setArrOfSelectedMessages,
}) {
  const { user } = UserAuth()
  const { theme } = useContext(ThemeContext)
  const { language } = useContext(LanguageContext)
  const { arrOfMessages, setArrOfMessages } = useContext(MessagesContext)
  const { actuallyContactId } = useContext(SocketContactContext)

  const bgColor = theme === 'light' ? 'rgb(255, 255, 255)' : 'rgb(33, 37, 41)'

  const textColor = theme === 'light' ? 'black' : 'white'

  const listItemMenuBgColor =
    theme === 'light' ? 'list-item-menu' : 'list-item-menu-black'

  const _deleteForMe = {
    en: 'Delete for me',
    fr: 'Supprimer pour moi',
    il: 'למחוק לכולם',
  }

  const _deleteForAll = {
    en: 'Delete for all',
    fr: 'Supprimer pour tous',
    il: 'מחק את כל השיחות',
  }

  const _selectedMesssageMany = {
    en: 'selected messages',
    fr: 'messages sélectionnés',
    il: 'הודעות נבחרו',
  }

  const _selectedMesssageOne = {
    en: 'selected message',
    fr: 'message sélectionné',
    il: 'הודעה נבחרה',
  }

  function deleteTheseMessagesForMe() {
    // array of messages without the messages that are in 'arrOfSelectedMessages'
    const arrWithoutTheseMessage = deleteTheseMessages(arrOfSelectedMessages)
    // update in DB only for me
    updatetAllMessagesWhithThisContactInDB(
      user.uid,
      actuallyContactId,
      arrWithoutTheseMessage
    )
    // add badge to this arr of messages and set the 'arrOfMessages' whith this arr
    const arrWhithBadge = addBadgeDateToArr(arrWithoutTheseMessage)
    // update in Chat
    setArrOfMessages(arrWhithBadge)
    // clear the arrOfSelectedMessages
    setArrOfSelectedMessages([])
  }

  async function deleteTheseMessageForAll() {
    // remove messages that are in 'arrOfSelectedmessages' only for me
    deleteTheseMessagesForMe()
    // DANGEROUS !!! - update in DB for actually contact (it's dangerous because it's another contact DB and not my DB)
    // get all messages from this contact with me, from the contact's db.
    const messagesOfActuallyContactInDB =
      await getAllMessagesWhithThisContactFromDB(actuallyContactId, user.uid)
    // create array of messages with only messages that have the same id as those in the 'arrOfSelectedMessages'
    const deletedMessage = messagesOfActuallyContactInDB.filter((message) =>
      arrOfSelectedMessages.includes(message.id)
    )
    console.log('deletedMessage', deletedMessage)
    if (deletedMessage) {
      // delete the contents of these messages and change their status to 'deleted message'
      deletedMessage.forEach((msg) => {
        msg.type = 'deleted message'
        msg.content = ''
      })
      // update in DB only for actually contact
      updatetAllMessagesWhithThisContactInDB(
        actuallyContactId,
        user.uid,
        messagesOfActuallyContactInDB
      )
    }
  }

  function deleteTheseMessages() {
    // remove all items that are not messages
    const arrWhitinBadge = arrOfMessages.filter((mesage) => mesage.status)
    // create array of messages without the messages that are in 'arrOfSelectedMessages'
    const arrWithoutTheseMessage = arrWhitinBadge.filter(
      (message) => !arrOfSelectedMessages.includes(message.id)
    )
    return arrWithoutTheseMessage
  }

  return (
    <div
      className={`rounded shadow`}
      style={{
        position: 'absolute',
        width: '230px',
        zIndex: '1021',
        backgroundColor: bgColor,
        color: textColor,
      }}
    >
      <ul
        style={{ listStyleType: 'none', marginBottom: '0px', padding: '8px' }}
      >
        <div>
          <span className="">
            <p
              style={{
                padding: '0px',
                paddingLeft: '10px',
                margin: '0px',
                marginBottom: '4px',
              }}
            >{`${arrOfSelectedMessages.length} ${
              arrOfSelectedMessages.length > 1
                ? _selectedMesssageMany[language]
                : _selectedMesssageOne[language]
            }`}</p>
          </span>
        </div>
        <li>
          <div>
            <div
              className={`row ${listItemMenuBgColor} py-2 m-0`}
              type="button"
              onClick={() => deleteTheseMessagesForMe()}
            >
              <div className="col-2 d-flex justify-content-center align-items-center">
                <span className="d-flex">
                  <i className="fa-solid fa-trash-can"></i>
                </span>
              </div>
              <div className="col ps-2">
                <span>{_deleteForMe[language]}</span>
              </div>
            </div>
          </div>
        </li>
        <li>
          <div>
            <div
              className={`row ${listItemMenuBgColor} py-2 m-0`}
              type="button"
              onClick={() => deleteTheseMessageForAll(messageId)}
            >
              <div className="col-2 d-flex justify-content-center align-items-center">
                <span className="d-flex">
                  <i className="fa-solid fa-trash-can"></i>
                </span>
              </div>
              <div className="col ps-2 text-danger fw-bold">
                <span>{_deleteForAll[language]}</span>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  )
}
