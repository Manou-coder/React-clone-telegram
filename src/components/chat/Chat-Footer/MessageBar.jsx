import { useState } from 'react'
import color from '../../../utils/style/color'
import socket from '../../../utils/socket.io';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usersList } from '../../../utils/socket.io';

const arrOfKey = []

export default function MessageBar({ message, setMessage, sendMessage, setSendMessage }) {

  const params = useParams()

  // console.log('params', params);

  let userReceiver = params.name

  // console.log('userReceiver', userReceiver);

  // console.log('usersList', usersList);

  function getReceiver() {
    for (const user of usersList) {
      console.log('user', user);
      console.log('user.userName', user.userName);
      console.log('params.name', params.name);
      if (user.userName === userReceiver) {
        console.log('bravo');
        return user
      }
    }
  }


  console.log('getReceiver()', getReceiver());



  const alignCenter =
    'row bg-white rounded-5 py-1 w-100 w-lg-75 align-items-center'
  const alignBaseline = alignCenter.replace(
    'align-items-center',
    'align-items-baseline'
  )

  const [classNameBar, setClassNameBar] = useState(alignCenter)

  const [messageInput, setMessageInput] = useState('')

  const iconSearchColor = messageInput.trim() === '' ? color.black : color.primary

  const cursorPointer = messageInput.trim() === '' ? 'default' : 'pointer'

  // console.log('messageBAr', message);

  function socketEmitPrivateMessage(msg, receiver) {
    socket.emit('private message', { content: msg, to: receiver })
  }


  function autoResizeBar(event) {
    event.style.height = 'auto'
    event.style.height = event.scrollHeight + 'px'
    if (event.scrollHeight > 30) {
      setClassNameBar(alignBaseline)
    } else {
      setClassNameBar(alignCenter)
    }
  }

  function checkMessage(e) {
    console.log('messageInput', messageInput);
    if (messageInput.trim() === '') {
      return
    }
    setMessage([...message, [messageInput]])
    let textarea = document.getElementById('autoresizing')
    console.log(textarea);
    //   socket.emit('chat message', messageInput)
    // socket.emit('private message', { content: messageInput, to: receiver })
    socketEmitPrivateMessage(messageInput, getReceiver())
    textarea.value = ''
    setMessageInput('')
  }


  function checkKey(e) {
    if (messageInput.trim() === '') {
      return
    }
    arrOfKey.push(e.key)
    if (arrOfKey[arrOfKey.length - 2] === 'Shift') {
      console.log('cocuou');
      return
    }
    if (e.key !== 'Enter') {
      return
    }
    if (messageInput.trim() === '') {
      e.target.value = ''
    }
    e.preventDefault();
    setMessage([...message, [messageInput]])
    // socket.emit('chat message', messageInput)
    socketEmitPrivateMessage(messageInput, getReceiver())
    e.target.value = ''
    setMessageInput('')
  }

  return (
    <div className="row sticky-bottom py-1 bg-light w-100 m-0 p-0">
      <div className="col py-1 d-flex justify-content-center">
        <div
          className={classNameBar}
          style={{ position: 'relative', bottom: '2px' }}
        >
          <div className="col-1 d-flex justify-content-start">
            <span>
              <i className="fa-solid fa-face-smile fa-lg"></i>
            </span>
          </div>
          <div className="d-none d-lg-block col-1 d-flex justify-content-start">
            <span>
              <i className="fa-solid fa-paperclip fa-lg"></i>
            </span>
          </div>
          <div className="col">
            <textarea
              id="autoresizing"
              onInput={(e) => autoResizeBar(e.target)}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e => checkKey(e))}
              rows="1"
              placeholder="Messsage..."
              style={{
                position: 'relative',
                border: 'none',
                outline: 'none',
                resize: 'none',
                width: '100%',
                bottom: '-2px',
              }}
            ></textarea>
          </div>
          <div className="col-1 d-flex justify-content-end">
            <span onClick={(e) => checkMessage(e)}>
              {/* ICON SEARCH - equal to ("fa-solid fa-paper-plane fa-lg") */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style={{
                fill: iconSearchColor,
                position: 'relative',
                bottom: '2px',
                cursor: cursorPointer
              }}
                height="1.25em" >
                <path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L277.3 424.9l-40.1 74.5c-5.2 9.7-16.3 14.6-27 11.9S192 499 192 488V392c0-5.3 1.8-10.5 5.1-14.7L362.4 164.7c2.5-7.1-6.5-14.3-13-8.4L170.4 318.2l-32 28.9 0 0c-9.2 8.3-22.3 10.6-33.8 5.8l-85-35.4C8.4 312.8 .8 302.2 .1 290s5.5-23.7 16.1-29.8l448-256c10.7-6.1 23.9-5.5 34 1.4z" /></svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}


