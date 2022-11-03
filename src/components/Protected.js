import React from 'react'
import { Navigate } from 'react-router-dom'
import { UserAuth } from '../utils/context/AuthContext'

const Protected = ({ children }) => {
  const { user } = UserAuth()
  // console.log('userProtected', user)
  if (!user) {
    return <Navigate to="/" />
  }

  return children
}

export default Protected
