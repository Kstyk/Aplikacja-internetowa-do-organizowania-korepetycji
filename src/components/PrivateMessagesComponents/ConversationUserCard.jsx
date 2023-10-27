import React from 'react'
import { backendUrl } from '../../variables/backendUrl'
import guest from '../../assets/guest.png'

const ConversationUserCard = ({ user, setSelectedUser, selectedUser }) => {
  return (
    <div
      onClick={() => setSelectedUser(user)}
      className={`flex w-full cursor-pointer flex-row items-center justify-center gap-x-2 border-b-[1px] px-2 py-1 transition-all duration-200 first:rounded-tl-md hover:bg-gray-100 max-phone:flex-col phone:justify-start phone:py-3 ${
        selectedUser?.id == user?.id && 'bg-base-100'
      }`}
    >
      <div
        className={`avatar w-full phone:w-4/12 ${
          user?.unread_messages_count > 0 && 'indicator'
        }`}
      >
        {user?.unread_messages_count > 0 && (
          <span className="badge badge-primary indicator-item">
            {user?.unread_messages_count}
          </span>
        )}
        <div className="mx-auto w-12 rounded-full ring-primary ring-offset-2 ring-offset-base-100 transition-all duration-200 hover:ring">
          <img
            src={user?.profile_image != null ? `${user?.profile_image}` : guest}
          />
        </div>
      </div>
      <div
        className={`name w-11/12 flex-col break-words text-center text-xs uppercase phone:w-8/12 phone:text-sm ${
          user?.unread_messages_count > 0 && 'font-bold'
        }`}
      >
        <span className="truncate">{user?.first_name}</span>
        <span className="truncate">{user?.last_name}</span>
      </div>
    </div>
  )
}

export default ConversationUserCard
