import React from 'react'
import { Navigate } from 'react-router-dom'
import { UserAuth } from './AuthContext'

const Protected = ({ children }) => {
  const { user, isUserCreated } = UserAuth()
  if (!user) {
    return <Navigate to="/" />
  }
  if (isUserCreated) {
    return <Navigate to="/chat" />
  }
  return children
}

export default Protected
