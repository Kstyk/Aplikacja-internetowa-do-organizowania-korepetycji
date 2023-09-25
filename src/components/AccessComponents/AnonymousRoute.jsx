import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import AuthContext from '../../context/AuthContext'

const AnonymousRoute = ({ children }) => {
  let { user } = useContext(AuthContext)
  return user == null ? <>{children}</> : <Navigate to="/" />
}

export default AnonymousRoute
