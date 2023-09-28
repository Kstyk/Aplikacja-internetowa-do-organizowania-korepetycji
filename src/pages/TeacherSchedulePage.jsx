import React from 'react'
import ClassesPageSchedule from '../components/schedules/ClassesPageSchedule'
import TeacherSchedule from '../components/schedules/TeacherSchedule'
import { useContext } from 'react'
import AuthContext from '../context/AuthContext'

const TeacherSchedulePage = () => {
  const { user } = useContext(AuthContext)
  return (
    <div>
      <TeacherSchedule teacherId={user?.user_id} />
    </div>
  )
}

export default TeacherSchedulePage
