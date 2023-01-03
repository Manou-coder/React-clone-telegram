import React from 'react'
import { Navigate } from 'react-router-dom'
import { UserAuth } from './AuthContext'

const ProtectedUserCreated = ({ children }) => {
  const { isUserCreated } = UserAuth()
  console.log('sUserCreated', isUserCreated)
  if (!isUserCreated) {
    return <Navigate to="/profile" />
  }

  return children
}

export default ProtectedUserCreated
