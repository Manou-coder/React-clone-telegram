/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Loading from '../../components/loading/Loading'
import { UserAuth } from '../context/AuthContext'

const ProtectedHome = ({ children }) => {
  const navigate = useNavigate()
  const { user, isProfileCreated } = UserAuth()
  const [showChildren, setShowChildren] = useState(false)

  useEffect(() => {
    if (user && !isProfileCreated) {
      console.log('le user existe mais le profile nexiste pas!')
      return navigate('/profile')
    }
    if (user && isProfileCreated) {
      console.log('user existe et aussi profile existe')
      return navigate('/chat')
    }
    console.log('user existe pas')
    setShowChildren(true)
  }, [user, isProfileCreated])

  return <>{showChildren ? children : <Loading />}</>
}

export default ProtectedHome
