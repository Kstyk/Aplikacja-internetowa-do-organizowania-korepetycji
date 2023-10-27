import React, { useState, useEffect, useContext } from 'react'
import { NotificationContext } from '../context/NotificationContext'
import AuthContext from '../context/AuthContext'
import useAxios from '../utils/useAxios'
import LoadingComponent from '../components/LoadingComponent'
import ConversationUserCard from '../components/PrivateMessagesComponents/ConversationUserCard'
import InfiniteScroll from 'react-infinite-scroll-component'
import ChatLoader from '../components/RoomComponents/ChatLoader'
import PrivateMessage from '../components/PrivateMessagesComponents/PrivateMessage'
import { AiOutlineSend } from 'react-icons/ai'
import { BiMessageSquareDetail } from 'react-icons/bi'
import showAlertError from '../components/messages/SwalAlertError'

const InboxPage = () => {
  document.title = 'Skryznka odbiorcza'

  const api = useAxios()
  const [loadingConversations, setLoadingConversations] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [conversationsUsers, setConversationsUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [hasMoreMessages, setHasMoreMessages] = useState(false)
  const [page, setPage] = useState(1)

  const {
    sendNotification,
    fromUserPrivateMessages,
    countUnreadPrivateMessages,
    toggleUpdateUnread,
  } = useContext(NotificationContext)
  const { user } = useContext(AuthContext)

  const [message, setMessage] = useState(null)

  useEffect(() => {
    if (fromUserPrivateMessages != null) {
      fetchUnreadPrivateMessagesUpdate()
    }
  }, [countUnreadPrivateMessages])

  useEffect(() => {
    fetchUnreadPrivateMessagesUpdate()
  }, [toggleUpdateUnread])

  const fetchUnreadPrivateMessagesUpdate = async () => {
    await api
      .get(`/api/users/private-conversations/`)
      .then((res) => {
        setConversationsUsers(res.data)
      })
      .catch((err) => {
        showAlertError(
          'Błąd',
          'Występił błąd przy pobieraniu rozpoczętych konwersacji.'
        )
      })
  }

  const fetchConversationUsers = async () => {
    setLoadingConversations(true)
    await api
      .get(`/api/users/private-conversations/`)
      .then((res) => {
        setConversationsUsers(res.data)
        setLoadingConversations(false)
      })
      .catch((err) => {
        setLoadingConversations(false)
        showAlertError(
          'Błąd',
          'Występił błąd przy pobieraniu rozpoczętych konwersacji.'
        )
      })
  }

  const fetchMessages = async (defaultPage = null) => {
    if (defaultPage != null) {
      setMessages([])
    }
    if (selectedUser != null) {
      sendNotification({
        type: 'read_private_messages',
        token: user.token,
        userId: selectedUser?.id,
      })
      setLoadingMessages(true)
      await api
        .get(
          `/api/users/private-conversation/messages/?user_id=${
            selectedUser?.id
          }&page=${defaultPage != null ? defaultPage : page}`
        )
        .then((res) => {
          setHasMoreMessages(res.data.next !== null)
          setPage(defaultPage != null ? 2 : page + 1)
          setMessages((prev) => prev.concat(res.data.results))
        })
        .catch((err) => {
          showAlertError(
            'Błąd',
            'Występił błąd przy wiadomości wybranej konwersacji.'
          )
        })
      setLoadingMessages(false)
    }
  }

  const fetchAfterSendMessages = async (defaultPage = null) => {
    if (defaultPage != null) {
      setMessages([])
    }
    if (selectedUser != null) {
      sendNotification({
        type: 'read_private_messages',
        token: user.token,
        userId: selectedUser?.id,
      })
      await api
        .get(
          `/api/users/private-conversation/messages/?user_id=${
            selectedUser?.id
          }&page=${defaultPage != null ? defaultPage : page}`
        )
        .then((res) => {
          setHasMoreMessages(res.data.next !== null)
          setPage(defaultPage != null ? 2 : page + 1)
          setMessages((prev) => prev.concat(res.data.results))
        })
        .catch((err) => {
          showAlertError(
            'Błąd',
            'Występił błąd przy wiadomości wybranej konwersacji.'
          )
        })
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [selectedUser])

  useEffect(() => {
    fetchConversationUsers()
  }, [])

  const handleChangeSelectedUser = (user) => {
    setSelectedUser(user)
    setPage(1)
    setMessages([])
  }

  function handleChangeMessage(e) {
    setMessage(e.target.value)
  }

  const handleSubmit = () => {
    let data = {}
    data.content = message
    data.to_user = selectedUser?.id

    api
      .post(`/api/users/send-private-message/`, data)
      .then((res) => {
        setPage(1)
        setMessage('')
        sendNotification({
          type: 'update_unread_private_messages_count',
          token: user.token,
          userId: selectedUser?.id,
        })
      })
      .catch((err) => {
        if (err.response.status == 400) {
          if (err.response.data.content) {
            showAlertError(
              'Błąd',
              err.response.data.content.map((error) => error)
            )
          }
          if (err.response.data.from_user) {
            showAlertError(
              'Błąd',
              err.response.data.from_user.map((error) => error)
            )
          }
          if (err.response.data.to_user) {
            showAlertError(
              'Błąd',
              err.response.data.to_user.map((error) => error)
            )
          }
          if (err.response.data.error) {
            showAlertError(
              'Błąd',
              err.response.data.error.map((error) => error)
            )
          }
        } else {
          showAlertError('Błąd', 'Nieudane wysłanie wiadomości prywatnej.')
        }
      })
    fetchMessages(1)
  }

  return (
    <div className="pt-10">
      <div className="absolute left-0 right-0 top-[70px] h-[200px] bg-base-300"></div>

      <div className="card mx-auto mb-10 flex h-[80vh] flex-row rounded-md bg-white shadow-xl">
        <div className="left flex h-full w-3/12 flex-col overflow-y-auto break-words border-r-2">
          {loadingConversations ? (
            <div className="p-2 text-center text-sm">
              <LoadingComponent message="Ładowanie konwersacji" />
            </div>
          ) : conversationsUsers.length == 0 ? (
            <span className="mt-5 p-2 text-center text-sm italic">
              Brak rozpoczętych konwersacji.
            </span>
          ) : (
            conversationsUsers.map((user) => (
              <ConversationUserCard
                key={user?.id}
                user={user}
                setSelectedUser={handleChangeSelectedUser}
                selectedUser={selectedUser}
              />
            ))
          )}
        </div>
        <div className="right h-full w-9/12 phone:pt-2">
          {selectedUser != null ? (
            <>
              <div className="flex h-[10%] items-center break-words border-b-2 px-2 phone:hidden">
                <h1 className="break-words text-xl font-bold uppercase tracking-wider">
                  {selectedUser?.first_name} {selectedUser?.last_name}
                </h1>
              </div>
              {loadingMessages ? (
                <div className="h-[80%] p-2 text-center text-sm phone:h-[90%]">
                  <LoadingComponent message="Ładowanie wiadomości" />
                </div>
              ) : (
                <div
                  className="chat-scroll flex h-[80%] flex-col-reverse overflow-y-auto border-b-2 phone:h-[90%]"
                  id="chat-scroll"
                >
                  <InfiniteScroll
                    dataLength={messages.length}
                    next={fetchMessages}
                    className="flex flex-col-reverse"
                    inverse={true}
                    hasMore={hasMoreMessages}
                    loader={<ChatLoader />}
                    scrollableTarget="chat-scroll"
                  >
                    {messages.map((message) => (
                      <PrivateMessage key={message.id} message={message} />
                    ))}
                  </InfiniteScroll>
                </div>
              )}
              <div className="flex h-[10%] w-full items-center px-5">
                <div className="flex h-12 w-full items-center justify-between border-b-2">
                  <input
                    type="text"
                    name="message"
                    placeholder="Napisz wiadomość..."
                    onChange={handleChangeMessage}
                    value={message || ''}
                    className="h-full w-11/12 pl-3 outline-none"
                  />

                  <button
                    className="tooltip ml-2 h-10 px-3 py-1"
                    data-tip="Wyślij wiadomość"
                    onClick={handleSubmit}
                  >
                    <AiOutlineSend className="h-5 w-5 phone:h-6 phone:w-6" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <BiMessageSquareDetail className="mx-auto h-48 w-48 text-gray-200" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default InboxPage
