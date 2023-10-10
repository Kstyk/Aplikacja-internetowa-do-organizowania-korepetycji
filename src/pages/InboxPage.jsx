import React, { useState, useEffect } from 'react'
import useAxios from '../utils/useAxios'
import { Link } from 'react-router-dom'
import LoadingComponent from '../components/LoadingComponent'
import ConversationUserCard from '../components/PrivateMessagesComponents/ConversationUserCard'
import InfiniteScroll from 'react-infinite-scroll-component'
import ChatLoader from '../components/RoomComponents/ChatLoader'
import PrivateMessage from '../components/PrivateMessagesComponents/PrivateMessage'
import { AiOutlineSend } from 'react-icons/ai'
import { BiMessageSquareDetail } from 'react-icons/bi'
import showAlertError from '../components/messages/SwalAlertError'

const InboxPage = () => {
  const api = useAxios()
  const [loadingConversations, setLoadingConversations] = useState(false)
  const [loadingConversation, setLoadingConversation] = useState(false)
  const [conversationsUsers, setConversationsUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [hasMoreMessages, setHasMoreMessages] = useState(false)
  const [page, setPage] = useState(1)

  const [message, setMessage] = useState(null)

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
      })
  }

  const fetchMessages = async () => {
    if (selectedUser != null) {
      await api
        .get(
          `/api/users/private-conversation/messages/?user_id=${selectedUser?.id}&page=${page}`
        )
        .then((res) => {
          setHasMoreMessages(res.data.next !== null)
          setPage(page + 1)
          setMessages((prev) => prev.concat(res.data.results))
          console.log(res.data)
        })
        .catch((err) => {
          console.log(err)
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
        console.log(res)
        setMessages([])
        fetchMessages()
        setMessage('')
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
  }

  return (
    <div className="pt-10">
      <div className="absolute left-0 right-0 top-[70px] h-[200px] bg-base-300"></div>

      <div className="card mx-auto mb-10 flex h-[80vh] flex-row rounded-md bg-white shadow-xl">
        <div className="left flex h-full w-3/12 flex-col gap-y-1 overflow-y-auto break-words border-r-2">
          {loadingConversations ? (
            <LoadingComponent />
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
              />
            ))
          )}
        </div>
        <div className="right h-full w-9/12">
          {selectedUser != null ? (
            <>
              <div
                className="chat-scroll flex h-5/6 flex-col-reverse overflow-y-auto border-b-2 pb-2"
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
              <div className="flex h-1/6 w-full items-center px-5">
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
