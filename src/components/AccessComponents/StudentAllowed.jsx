import React, { useContext } from 'react'
import AuthContext from '../../context/AuthContext'
import { Navigate, Outlet } from 'react-router-dom'

const StudentAllowed = () => {
  const { user } = useContext(AuthContext)

  return user != null && user?.role == 'Student' ? (
    <>
      <Outlet />
    </>
  ) : (
    <>
      <Navigate to="/" replace />
    </>
  )
}

export default StudentAllowed
