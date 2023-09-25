import React, { useContext } from 'react'
import AuthContext from '../../context/AuthContext'
import { Navigate, Outlet } from 'react-router-dom'

const TeacherAllowed = () => {
  const { user } = useContext(AuthContext)

  return user != null && user?.role == 'Teacher' ? (
    <>
      <Outlet />
    </>
  ) : (
    <>
      <Navigate to="/" replace />
    </>
  )
}

export default TeacherAllowed
