import React, { useState, useEffect } from 'react'
import useAxios from '../utils/useAxios'
import { Link } from 'react-router-dom'
import LoadingComponent from '../components/LoadingComponent'
import ConversationUserCard from '../components/PrivateMessagesComponents/ConversationUserCard'
import InfiniteScroll from 'react-infinite-scroll-component'
import ChatLoader from '../components/RoomComponents/ChatLoader'
import PrivateMessage from '../components/PrivateMessagesComponents/PrivateMessage'

const InboxPage = () => {
  const api = useAxios()
  const [loadingConversations, setLoadingConversations] = useState(false)
  const [loadingConversation, setLoadingConversation] = useState(false)
  const [conversationsUsers, setConversationsUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [messages, setMessages] = useState([])

  const fetchConversationUsers = async () => {
    setLoadingConversations(true)
    await api
      .get(`/api/users/private-conversations/`)
      .then((res) => {
        setConversationsUsers(res.data)
        console.log(res)
        setLoadingConversations(false)
      })
      .catch((err) => {
        console.log(err)
        setLoadingConversations(false)
      })
  }

  const fetchMessages = async () => {
    if (selectedUser != null) {
      setLoadingConversation(true)

      await api
        .get(
          `/api/users/private-conversation/messages/?user_id=${selectedUser?.id}`
        )
        .then((res) => {
          setMessages(res.data.results)
          setLoadingConversation(false)
          console.log(res)
        })
        .catch((err) => {
          console.log(err)
          setLoadingConversation(false)
        })
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [selectedUser])

  useEffect(() => {
    fetchConversationUsers()
  }, [])

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
                setSelectedUser={setSelectedUser}
              />
            ))
          )}
        </div>
        <div className="right h-full w-9/12">
          {loadingConversation ? (
            <LoadingComponent />
          ) : (
            <InfiniteScroll
              dataLength={messages.length}
              next={fetchMessages}
              className="flex flex-col-reverse"
              inverse={true}
              hasMore={false}
              loader={<ChatLoader />}
              scrollableTarget="right"
            >
              {messages.map((message) => (
                <PrivateMessage key={message.id} message={message} />
              ))}
            </InfiniteScroll>
          )}
        </div>
      </div>
    </div>
  )
}

export default InboxPage
