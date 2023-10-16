import React, { createContext, useContext, useState } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { FiPhoneCall } from 'react-icons/fi'

import AuthContext from './AuthContext'

const DefaultProps = {
  connectionStatus: 'Uninstantiated',
}

export const NotificationContext = createContext(DefaultProps)

export const NotificationContextProvider = ({ children }) => {
  const { authTokens, user } = useContext(AuthContext)
  const [roomToUpdate, setRoomToUpdate] = useState(null)
  const [countUnreadMessages, setCountUnreadMessages] = useState()

  const [fromUserPrivateMessages, setFromUserPrivateMessages] = useState(null)
  const [countUnreadPrivateMessages, setCountUnreadPrivateMessages] = useState()
  const [toggleUpdateUnread, setToggleUpdateUnread] = useState(false)
  const [countunreadallprivatemessages, setCountunreadallprivatemessages] =
    useState()

  const CustomToastWithLink = (fisrt_name, last_name, room_id) => (
    <div className="flex flex-col items-center">
      <span>
        {fisrt_name} {last_name} dzwoni do Ciebie
      </span>
      <Link
        className="btn h-10 min-h-0 w-full rounded-md border-2 border-base-100 bg-slate-50 px-3 text-sm capitalize hover:border-4 hover:border-base-200 hover:bg-transparent hover:text-base "
        to={`/pokoj/${room_id}`}
      >
        Przejdź do pokoju
      </Link>
    </div>
  )
  const { readyState, sendJsonMessage } = useWebSocket(
    user
      ? `ws://korepetycje-backend.azurewebsites.net/notifications/?token=${authTokens?.access}`
      : null,
    {
      onOpen: () => {},
      onClose: () => {},
      onMessage: (e) => {
        const data = JSON.parse(e.data)
        switch (data.type) {
          case 'incomingcall':
            localStorage.setItem('remotePeerId', data.peer)
            localStorage.setItem('callButton', true)
            toast.info(
              CustomToastWithLink(
                data?.caller?.first_name,
                data?.caller?.last_name,
                data?.room_id
              ),
              {
                draggable: true,
                icon: ({ theme, type }) => (
                  <FiPhoneCall className="aspect-square  !w-10 rounded-full text-red-800 shadow-xl shadow-red-200" />
                ),
              }
            )
            break

          case 'updateunreadcount':
            setCountUnreadMessages(data.unread_messages)
            setRoomToUpdate(data.room_id)
            break
          case 'updateunreadprivatemessagescount':
            setCountunreadallprivatemessages(data.unread_all_messages)
            setCountUnreadPrivateMessages(data.unread_messages)
            setFromUserPrivateMessages(data.from_user)
            break
          case 'unread_private_messages_count_updated':
            setCountunreadallprivatemessages(data.unread_all_messages)
            setToggleUpdateUnread(!toggleUpdateUnread)
            break
          default:
            console.log(data)
            break
        }
      },
    }
  )

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState]

  return (
    <NotificationContext.Provider
      value={{
        connectionStatus,
        sendNotification: sendJsonMessage,
        roomToUpdate: roomToUpdate,
        countUnreadMessages: countUnreadMessages,
        countUnreadPrivateMessages: countUnreadPrivateMessages,
        fromUserPrivateMessages: fromUserPrivateMessages,
        toggleUpdateUnread: toggleUpdateUnread,
        countunreadallprivatemessages: countunreadallprivatemessages,
        setCountunreadallprivatemessages: setCountunreadallprivatemessages,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}
