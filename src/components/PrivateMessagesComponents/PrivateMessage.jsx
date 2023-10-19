import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../../context/AuthContext'
import dayjs from 'dayjs'
import guest from '../../assets/guest.png'
import { backendUrl } from '../../variables/backendUrl'
import { Link } from 'react-router-dom'

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const PrivateMessage = ({ message }) => {
  const { user } = useContext(AuthContext)

  dayjs.locale('pl')
  const URL_REGEX =
    /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm

  return (
    <li
      className={classNames(
        'chat mb-1 mt-1 px-2 pb-2',
        user?.email === message.from_user.email ? 'chat-end' : 'chat-start'
      )}
    >
      <Link
        to={
          message?.from_user?.role?.label == 'Teacher'
            ? `/nauczyciel/${message?.from_user?.id}`
            : `/student/${message?.from_user?.id}`
        }
        className="chat-image avatar"
      >
        <div className="w-10 rounded-full ring-primary ring-offset-2 ring-offset-base-100 transition-all duration-200 hover:ring">
          <img
            title={
              user?.email == message.from_user.email
                ? user.email
                : message.from_user.email
            }
            src={
              message?.from_user?.profile_image != null
                ? `${message?.from_user?.profile_image}`
                : guest
            }
          />
        </div>
      </Link>
      <div className="chat-header flex gap-x-3">
        <time className="text-xs opacity-50">
          {dayjs(message.timestamp).format('dddd, HH:mm')}
        </time>
      </div>
      <div
        className={`chat-bubble max-w-[60%] break-words text-black hover:bg-opacity-80  ${
          user?.email !== message.from_user.email
            ? `bg-base-300`
            : `bg-base-200`
        }`}
      >
        {message.content.match(URL_REGEX) ? (
          <>
            <a
              target="_blank"
              href={message.content}
              className="text-blue-700 hover:underline"
            >
              {message.content}
            </a>{' '}
          </>
        ) : (
          message.content
        )}
      </div>
    </li>
  )
}

export default PrivateMessage
