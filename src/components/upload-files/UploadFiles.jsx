import { uuidv4 } from '@firebase/util'
import { set } from 'date-fns'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import React, { useContext, useState } from 'react'
import { useRef } from 'react'
import { storage } from '../../firebase-config'
import { UserAuth } from '../../utils/context/AuthContext'
import { MessagesContext } from '../../utils/context/MessagesContext'
import { SocketContactContext } from '../../utils/context/SocketContact'
import { ThemeContext } from '../../utils/context/ThemeContext'
import { addBadgeDateToArr } from '../chat/Chat-Body/MessageBody'
import './style.css'
import { startsWith } from 'lodash'
import { resizeFile } from '../../utils/functions/resizeImage'
import socket from '../../utils/socket.io'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'
import { useEffect } from 'react'

export default function UploadFiles() {
  const { user } = UserAuth()
  const { theme, progress, setProgress, uploadTask, setUploadTask } =
    useContext(ThemeContext)
  const { setArrOfMessages, arrOfMessages } = useContext(MessagesContext)
  const { actuallyContactId } = useContext(SocketContactContext)
  const inputForm = useRef()
  const iconBars = theme === 'light' ? 'icon-bars-light' : ' icon-bars-dark'
  const iconColor = theme === 'light' ? 'black' : '#909294'

  async function handleFileChange(event) {
    let file = event.target.files[0]
    console.log('file', file)

    if (!file) {
      console.log('no file!')
      return
    }

    if (file.size > 100000000) {
      alert('to much!')
      return
    }

    if (file.type.startsWith('image/')) {
      uploadImage(file)
      return
    }

    if (file.type.startsWith('video/')) {
      uploadVideo(file)
      return
    }

    alert('You can only send photos and videos!')
  }

  function showFileInChat(message) {
    const newArr = addBadgeDateToArr([...arrOfMessages, message])
    setArrOfMessages(newArr)
  }

  async function resizeImage(file) {
    try {
      // sets the image quality to 80%
      const fileResizing = await resizeFile(file)
      console.log(fileResizing)
      return fileResizing
    } catch (err) {
      console.log(err)
      return null
    }
  }

  function emitSocket(message) {
    console.log('message', message)
    socket.emit('private message', message)
  }

  function uploadFileInDB(file, messageId, type) {
    return new Promise((resolve, reject) => {
      if (!file) return null
      console.log('file.type', file.type)
      const metadata = {
        contentType: file.type,
      }

      // Upload file and metadata to the object 'images/mountains.jpg'
      const storageRef = ref(storage, `${type}/${messageId}`)
      const uploadTask = uploadBytesResumable(storageRef, file, metadata)

      // setUploadTask
      setUploadTask(uploadTask)

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress_storage =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          setProgress((progress) => {
            return { ...progress, percent: progress_storage, id: messageId }
          })
          console.log(`Upload is ${progress_storage}% done`)
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused')
              break
            case 'running':
              console.log('Upload is running')
              break
            default:
              console.log('default 1')
          }
        },
        (error) => {
          reject(error)
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL)
            resolve(downloadURL)
          })
        }
      )
    })
  }

  async function uploadImage(file) {
    console.log("it's an image")
    // try resizing image
    const fileResizing = await resizeImage(file)
    if (fileResizing) {
      file = fileResizing
    }
    console.log('file', file)
    // create message object
    const message = {
      content: URL.createObjectURL(file),
      to: actuallyContactId,
      from: user.uid,
      type: 'image',
      time: Date.now(),
      id: uuidv4(),
      status: 'waiting',
    }
    // show this message in chat whith objectURL
    showFileInChat(message)
    // try upload this file
    const fileUploaded = await uploadFileInDB(file, message.id, 'images').catch(
      (error) => console.log(error)
    )
    console.log('fileUploaded: ', fileUploaded)
    if (!fileUploaded) {
      return
    }
    // if file is uploaded
    message.content = fileUploaded
    // emit private message
    emitSocket(message)
  }

  async function uploadVideo(file) {
    console.log("it's an video")
    console.log('file', file)
    // create message object
    const message = {
      content: URL.createObjectURL(file),
      to: actuallyContactId,
      from: user.uid,
      type: 'video',
      time: Date.now(),
      id: uuidv4(),
      status: 'waiting',
    }
    // show this message in chat whith objectURL
    showFileInChat(message)
    // try upload this file
    const fileUploaded = await uploadFileInDB(file, message.id, 'videos').catch(
      (error) => console.log(error)
    )
    console.log('fileUploaded: ', fileUploaded)
    if (!fileUploaded) {
      return
    }
    // if file is uploaded
    message.content = fileUploaded
    // emit private message
    emitSocket(message)
  }

  return (
    <>
      <input
        ref={inputForm}
        type="file"
        onChange={handleFileChange}
        onClick={(e) => (e.target.value = null)}
        style={{ display: 'none' }}
      />
      <span
        className={`icon-bars ${iconBars} d-flex justify-content-center align-items-center`}
        onClick={() => inputForm?.current?.click()}
      >
        {/* <i className="fa-solid fa-paperclip fa-lg"></i> */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          style={{ fill: iconColor, position: 'relative' }}
          height="1.25em"
        >
          <path d="M396.2 83.8c-24.4-24.4-64-24.4-88.4 0l-184 184c-42.1 42.1-42.1 110.3 0 152.4s110.3 42.1 152.4 0l152-152c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-152 152c-64 64-167.6 64-231.6 0s-64-167.6 0-231.6l184-184c46.3-46.3 121.3-46.3 167.6 0s46.3 121.3 0 167.6l-176 176c-28.6 28.6-75 28.6-103.6 0s-28.6-75 0-103.6l144-144c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-144 144c-6.7 6.7-6.7 17.7 0 24.4s17.7 6.7 24.4 0l176-176c24.4-24.4 24.4-64 0-88.4z" />
        </svg>
      </span>
    </>
  )
}
