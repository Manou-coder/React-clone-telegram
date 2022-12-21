import { useRef } from 'react'
import { useContext, useState } from 'react'
import { ThemeContext } from '../../../../utils/context/ThemeContext'
import colors from '../../../../utils/style/color'
import Avatar from '../../../../assets/img/avatar4.png'
import {
  getFromStorage,
  setActuallyContactIdInStorage,
  SocketContactContext,
} from '../../../../utils/context/SocketContact'
import { UserAuth } from '../../../../utils/context/AuthContext'
import { LanguageContext } from '../../../../utils/context/LanguageContext'
import { updateHasNewMessagesInDB } from '../../../../firebase-config'
import { imgError } from '../../../../utils/functions/returnAvatarIsImgError'
import { MessagesContext } from '../../../../utils/context/MessagesContext'
import { addZero } from '../../../../utils/functions/addZero'
import { svgSend } from '../../../../utils/functions/svgSend'
import { format, formatDistance, formatRelative, subDays } from 'date-fns'
import { enUS, he, fr } from 'date-fns/locale'

function MyCall({ contactId, startTime, isOutgoingCall, videoCall, id }) {
  //   const { user } = UserAuth()
  const {
    setMyContacts,
    setNewMessages,
    actuallyContactId,
    newMessages,
    setActuallyContactId,
    allUsers,
  } = useContext(SocketContactContext)
  //   const { setArrOfMessages } = useContext(MessagesContext)
  //   const { setIsChatOpen } = useContext(ThemeContext)

  // DARK MODE
  const { theme } = useContext(ThemeContext)

  const bgContact = theme === 'light' ? 'li-bg-light' : 'li-bg-dark'
  const colorName = theme === 'light' ? '' : 'text-white'
  const colorInfo = theme === 'light' ? '' : 'text-white-50'

  // LANGUAGE
  const { language } = useContext(LanguageContext)

  const _at = {
    en: 'at',
    fr: 'à',
    il: 'ב',
  }

  const contact = allUsers && allUsers.find((e) => e.userId === contactId)

  const localeLanguage = () => {
    if (language === 'il') {
      return he
    } else if (language === 'fr') {
      return fr
    } else {
      return enUS
    }
  }

  const logoRotate = isOutgoingCall ? 'rotate(315deg)' : 'rotate(135deg)'
  const logoFill = isOutgoingCall ? '#31a24c' : 'red'

  function calculDate(dateToStart) {
    const relativeFormatDate = formatRelative(
      new Date(dateToStart),
      new Date(),
      {
        locale: localeLanguage(),
      }
    )
    // console.log('relativeFormatDate', relativeFormatDate)
    if (!relativeFormatDate.includes('/')) {
      return relativeFormatDate
    } else {
      const normalFormatDate = format(
        new Date(startTime),
        `eeee d LLLL ${_at[language]} HH:mm`,
        {
          locale: localeLanguage(),
        }
      )
      return normalFormatDate
    }
  }

  return (
    <li
      className={`w-100 py-2 m-0 rounded ${bgContact}`}
      style={{ cursor: 'pointer' }}
      //   onClick={(e) => handleClickContact(e)}
    >
      <div className="row m-0 align-items-center">
        <div className="col-2">
          <div
            style={{
              height: '50px',
              width: '50px',
            }}
          >
            <img
              style={{
                height: '50px',
                width: '50px',
              }}
              src={contact ? contact.photoURL : Avatar}
              onError={(e) => imgError(e.target)}
              className="rounded-circle"
              alt="..."
            ></img>
          </div>
        </div>
        <div
          style={{
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}
          className="col"
        >
          <div>
            <h3 className={`m-0 fs-5 lh-1 ${colorName}`}>
              {contact && contact.displayName}
            </h3>
          </div>
          <div className="d-flex flex-row">
            <span className="me-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                style={{
                  fill: logoFill,
                  transform: logoRotate,
                  position: 'relative',
                  top: '-1px',
                }}
                height="0.8em"
              >
                <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
              </svg>
            </span>
            {/* <p className={`m-0 ${colorName}`}>18 decembre a 16:16</p> */}
            <p className={`m-0 ${colorName}`}>
              {/* {formatRelative(subDays(new Date(), 5), new Date(), {
                locale: fr,
              })}
              {format(
                new Date(startTime),
                `eeee d LLLL ${_at[language]} HH:mm`,
                {
                  locale: localeLanguage(),
                }
              )} */}
              {calculDate(startTime)}
            </p>
          </div>
        </div>
        <div
          style={{ height: '52.5px' }}
          className="col-2 p-0 d-flex justify-content-center align-items-center"
        >
          <span>
            {videoCall ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 576 512"
                style={{ fill: '#31a24c' }}
                height="1.25em"
              >
                <path d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2V384c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1V320 192 174.9l14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                style={{ fill: '#31a24c' }}
                height="1.25em"
              >
                <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" />
              </svg>
            )}
          </span>
        </div>
      </div>
    </li>
  )
}

export default MyCall
