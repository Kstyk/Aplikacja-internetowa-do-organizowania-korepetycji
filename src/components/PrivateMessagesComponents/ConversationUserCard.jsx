import React from 'react'
import { backendUrl } from '../../variables/backendUrl'
import guest from '../../assets/guest.png'
import { Link } from 'react-router-dom'
const ConversationUserCard = ({ user, setSelectedUser }) => {
  return (
    <div
      onClick={() => setSelectedUser(user)}
      className="flex w-full cursor-pointer flex-row items-center justify-center gap-x-2 rounded-md border-b-[1px] p-2 transition-all duration-200 hover:bg-gray-100 phone:justify-start"
    >
      <div className="avatar w-full phone:w-4/12">
        <div className="mx-auto w-12 rounded-full ring-primary ring-offset-2 ring-offset-base-100 transition-all duration-200 hover:ring">
          <img
            src={
              user?.profile_image != null
                ? `${backendUrl}${user?.profile_image}`
                : guest
            }
          />
        </div>
      </div>
      <div className="name hidden w-8/12 flex-col break-words text-sm uppercase phone:flex">
        <span className="truncate">{user?.first_name}</span>
        <span className="truncate">{user?.last_name}</span>
      </div>
    </div>
  )
}

export default ConversationUserCard
