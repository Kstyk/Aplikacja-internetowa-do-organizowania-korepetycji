import React, { useContext, useEffect, useState, useId } from 'react'
import AuthContext from '../../context/AuthContext'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useParams } from 'react-router-dom'
import Message from './Message'
import ChatLoader from './ChatLoader'
import useAxios from '../../utils/useAxios'
import Modal from 'react-modal'
import { useRef } from 'react'
import Peer from 'peerjs'
import LoadingComponent from '../GeneralComponents/LoadingComponent'
import { NotificationContext } from '../../context/NotificationContext'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import { AiOutlineSend } from 'react-icons/ai'
import { FiPhoneCall } from 'react-icons/fi'
import { FcCallback, FcEndCall } from 'react-icons/fc'
import {
  BiMicrophoneOff,
  BiMicrophone,
  BiCameraOff,
  BiCamera,
} from 'react-icons/bi'
import { RiChat4Line, RiChatOffLine } from 'react-icons/ri'
import { LuScreenShareOff, LuScreenShare } from 'react-icons/lu'
import showAlertError from '../AlertsComponents/SwalAlertError'

const Chat = ({ archivized }) => {
  const [message, setMessage] = useState('')
  const [messageHistory, setMessageHistory] = useState([])
  const [page, setPage] = useState(2)
  const [hasMoreMessages, setHasMoreMessages] = useState(false)

  const { roomId } = useParams()
  const { user } = useContext(AuthContext)
  const { sendNotification } = useContext(NotificationContext)
  const [secondUserProfile, setSecondUserProfile] = useState(null)

  let api = useAxios()
  // videocall
  const [peerId, setPeerId] = useState('')
  const [remotePeerIdValue, setRemotePeerIdValue] = useState('')
  const [callButton, setCallButton] = useState(null)

  const remoteVideoRef = useRef(null)
  const currentUserVideoRef = useRef(null)
  const peerInstance = useRef(null)

  const [microphoneConnected, setMicrophoneConnected] = useState()
  const [cameraConnected, setCameraConnected] = useState()
  const [waitingForResponse, setWaitingForResponse] = useState(false)

  const [audioEnabled, setAudioEnabled] = useState(true)
  const [isCameraOn, setIsCameraOn] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [showChat, setShowChat] = useState(false)

  const { readyState, sendJsonMessage } = useWebSocket(
    user
      ? `ws://127.0.0.1:8000/chats/${roomId}/`
      : // `wss://korepetycje-backend.azurewebsites.net/chats/${roomId}/`
        null,
    {
      queryParams: {
        userId: user ? user.user_id : '',
      },
      onOpen: (e) => {},
      onClose: (e) => {
        // nav("/");
      },
      onMessage: (e) => {
        const data = JSON.parse(e.data)
        sendJsonMessage({ type: 'read_messages' })
        switch (data.type) {
          case 'chat_message_echo':
            setMessageHistory((prev) => [data.message, ...prev])
            setWaitingForResponse(false)
            break
          case 'last_20_messages':
            setMessageHistory(data.messages)
            setHasMoreMessages(data.has_more)
            break
          case 'received_peer':
            setRemotePeerIdValue(data.peer)
            break
          case 'rejected_call':
            endVideoCall()
            if (peerId != '') {
              document.getElementById('closeCallForm').submit()
            }
          default:
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

  useEffect(() => {
    if (connectionStatus === 'Open') {
      sendJsonMessage({
        type: 'read_messages',
      })
    }
  }, [connectionStatus, sendJsonMessage])

  const fetchMessages = async () => {
    await api
      .get(`api/rooms/messages/?room_id=${roomId}&page=${page}`)
      .then((res) => {
        setHasMoreMessages(res.data.next !== null)
        setPage(page + 1)
        setMessageHistory((prev) => prev.concat(res.data.results))
      })
      .catch((err) => {
        showAlertError('Błąd', 'Wystąpił błąd przy pobieraniu wiadomości.')
      })
  }

  const fetchSecondUserInRoom = async () => {
    await api
      .get(`api/rooms/room-users/${roomId}/`)
      .then((res) => {
        setSecondUserProfile(res.data)
      })
      .catch((err) => {
        showAlertError(
          'Błąd',
          'Wystąpił błąd przy pobieraniu wiadomości o pokoju.'
        )
      })
  }

  useEffect(() => {
    fetchSecondUserInRoom()
    checkMediaDevices()
  }, [])

  useEffect(() => {
    if (readyState == 'Open') {
      fetchMessages()
    }
  }, [messageHistory])

  function handleChangeMessage(e) {
    setMessage(e.target.value)
  }

  function handleSubmit() {
    if (message.trim() != '') {
      sendJsonMessage({
        type: 'chat_message',
        message,
        name: user ? user.username : '',
      })
      sendNotification({
        type: 'update_unread_messages_count',
        token: user.token,
        roomId: roomId,
      })
      setMessage('')
      setWaitingForResponse(true)
    }
  }

  function openModal() {
    window.videocall.showModal()

    startVideoCall()
    if (remotePeerIdValue == '') {
      call(localStorage.getItem('remotePeerId'))
    } else {
      call(remotePeerIdValue)
    }
  }

  Modal.setAppElement('#root')

  useEffect(() => {
    if (peerId != '') {
      sendJsonMessage({
        type: 'peer',
        peer: peerId,
        token: user.token,
      })

      sendNotification({
        type: 'call_incoming',
        peer: peerId,
        token: user.token,
        roomId: roomId,
      })
    }
  }, [peerId])

  const checkMediaDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()

      const hasMicrophone = devices.some(
        (device) => device.kind === 'audioinput'
      )
      const hasCamera = devices.some(
        (device) =>
          device.kind === 'videoinput' &&
          device.deviceId != '' &&
          device.deviceId != null
      )
      if (!hasMicrophone) {
        setMicrophoneConnected(false)
      } else {
        setMicrophoneConnected(true)
      }

      if (!hasCamera) {
        setCameraConnected(false)
      } else {
        setCameraConnected(true)
      }
    } catch (error) {
      console.error('Error checking media devices:', error)
    }
  }

  const startVideoCall = () => {
    checkMediaDevices()
    window.videocall.showModal()

    // const peer = new Peer({
    //   host: 'localhost',
    //   port: 9000,
    //   path: '/',
    // })
    const peer = new Peer()
    peer.on('open', (id) => {
      setPeerId(id)
    })

    peer.on('call', (call) => {
      var getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia
      getUserMedia(
        { video: true, audio: microphoneConnected },
        (mediaStream) => {
          currentUserVideoRef.current.srcObject = mediaStream
          console.log(mediaStream)

          currentUserVideoRef.current.onloadedmetadata = () => {
            currentUserVideoRef.current.play()
          }
          call.answer(mediaStream)
          const audioTracks =
            currentUserVideoRef.current.srcObject.getAudioTracks()
          audioTracks.forEach((track) => {
            console.log(user.email + ' , ' + track.enabled)
          })

          call.on('stream', function (remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream
            remoteVideoRef.current.onloadedmetadata = () => {
              remoteVideoRef.current.play()
            }
          })
        }
      )
    })

    peer.on('close', () => {
      console.log('Zakończono połączenie')
    })

    peerInstance.current = peer
  }

  const call = async (remotePeerId) => {
    var getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia

    getUserMedia({ video: true, audio: microphoneConnected }, (mediaStream) => {
      currentUserVideoRef.current.srcObject = mediaStream
      currentUserVideoRef.current.onloadedmetadata = () => {
        currentUserVideoRef.current.play()
      }

      const call = peerInstance.current.call(remotePeerId, mediaStream, {
        metadata: {
          callerPeerId: peerId,
        },
      })

      call.on(
        'stream',
        (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream
          remoteVideoRef.current.onloadedmetadata = () => {
            remoteVideoRef.current.play()
          }
        },
        function (err) {
          showAlertError('Błąd', 'Błąd przy strumieniowaniu obrazu.')
        }
      )
    })
  }

  const rejectVideoCall = async () => {
    sendJsonMessage({
      type: 'reject_peer',
      peer: peerId,
      token: user.token,
    })
  }

  const endVideoCall = async () => {
    // Reset state variables
    setCallButton(false)
    setPeerId('')
    setRemotePeerIdValue('')
    localStorage.removeItem('callButton')
    localStorage.removeItem('peerId')

    stopScreenSharing()
    // Close the PeerJS connection
    if (peerInstance.current) {
      peerInstance.current.destroy()
      peerInstance.current = null
    }

    // Stop the media streams and reset their references
    const currentUserStream = currentUserVideoRef.current.srcObject
    const remoteStream = remoteVideoRef.current.srcObject

    if (currentUserStream) {
      currentUserStream.getTracks().forEach((track) => track.stop())
      currentUserVideoRef.current.srcObject = null
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => track.stop())
      remoteVideoRef.current.srcObject = null
    }
  }

  const toggleAudio = async () => {
    const audioTracks = currentUserVideoRef.current.srcObject.getAudioTracks()
    audioTracks.forEach((track) => {
      track.enabled = !audioEnabled
    })
    setAudioEnabled(!audioEnabled)
  }

  const toggleCamera = async () => {
    const tracks = currentUserVideoRef.current.srcObject.getTracks()
    tracks.forEach((track) => {
      if (track.kind === 'video') {
        track.enabled = !isCameraOn
        setIsCameraOn(!isCameraOn)
      }
    })
  }

  async function getScreenshareWithMicrophone() {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    })

    if (microphoneConnected) {
      const audio = await navigator.mediaDevices.getUserMedia({
        audio: microphoneConnected,
      })
      return new MediaStream([audio.getTracks()[0], stream.getTracks()[0]])
    } else return new MediaStream([stream.getTracks()[0]])
  }

  const toggleScreenSharing = async () => {
    if (isScreenSharing) {
      stopScreenSharing()
    } else {
      const stream = await getScreenshareWithMicrophone()

      currentUserVideoRef.current.srcObject = stream
      let videoTrack = currentUserVideoRef.current.srcObject.getTracks()[0]

      videoTrack.onended = () => {
        stopScreenSharing()
      }

      const audioTracks = currentUserVideoRef.current.srcObject.getAudioTracks()
      audioTracks.forEach((track) => {
        track.enabled = audioEnabled
      })

      const call = peerInstance.current.call(remotePeerIdValue, stream)
      call.on('stream', (remoteStream) => {
        remoteVideoRef.current.pause()
        remoteVideoRef.current.srcObject = remoteStream

        remoteVideoRef.current.addEventListener('loadedmetadata', () => {
          remoteVideoRef.current.play()
        })
      })

      setIsScreenSharing(true)
    }
  }

  const stopScreenSharing = () => {
    if (!isScreenSharing) return
    setIsScreenSharing(false)
    const currentUserStream = currentUserVideoRef.current.srcObject
    if (currentUserStream) {
      currentUserStream.getTracks().forEach((track) => track.stop())
    }
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: microphoneConnected,
      })
      .then((stream) => {
        currentUserVideoRef.current.srcObject = stream

        const call = peerInstance.current.call(remotePeerIdValue, stream)
        const audioTracks =
          currentUserVideoRef.current.srcObject.getAudioTracks()
        audioTracks.forEach((track) => {
          track.enabled = audioEnabled
        })
        call.on('stream', (remoteStream) => {
          remoteVideoRef.current.pause()
          remoteVideoRef.current.srcObject = remoteStream

          remoteVideoRef.current.addEventListener('loadedmetadata', () => {
            remoteVideoRef.current.play()
          })
        })
      })
      .catch((error) => {})
  }

  return (
    <>
      <div className="flex h-full flex-col">
        <div className="!z-10 flex h-full flex-col justify-between">
          <div
            id="scrollableDiv"
            className="card fixed bottom-20 top-[16rem] flex w-[calc(100%-24px)] flex-col-reverse overflow-y-auto rounded-none border border-none border-gray-200 bg-white shadow-xl phone:p-6 sm:w-11/12 sm:border-t-2 md:w-10/12 lg:w-8/12"
          >
            {readyState === ReadyState.CONNECTING ? (
              <LoadingComponent message="Ładowanie wiadomości..." />
            ) : (
              <>
                <>
                  {messageHistory.length != 0 ? (
                    <InfiniteScroll
                      dataLength={messageHistory.length}
                      next={fetchMessages}
                      className="flex flex-col-reverse"
                      inverse={true}
                      hasMore={hasMoreMessages}
                      loader={<ChatLoader />}
                      scrollableTarget="scrollableDiv"
                    >
                      {messageHistory.map((message) => (
                        <Message
                          key={message.id}
                          message={message}
                          secondUser={secondUserProfile}
                        />
                      ))}
                    </InfiniteScroll>
                  ) : (
                    <div className="bottom-20 top-[16rem] mt-5 flex h-[60vh] w-full justify-center bg-white pt-5 text-center italic text-black">
                      Brak nowych wiadomości.
                    </div>
                  )}
                </>
              </>
            )}
          </div>
          {archivized ? (
            <div className="right fixed bottom-0 mx-auto flex w-full flex-row items-center border-t-2 bg-white p-5 phone:w-11/12 md:w-10/12 lg:w-8/12">
              <div className="flex h-10 w-full items-center justify-center italic text-gray-600">
                <span>Historia czatu</span>
              </div>
            </div>
          ) : (
            <div className="fixed bottom-0 mx-auto flex w-[calc(100%-24px)] flex-row items-center justify-between border-t-2 bg-white p-5 max-sm:mr-3 sm:w-11/12 md:w-10/12 lg:w-8/12">
              <div className="flex h-10 w-10/12 items-center justify-between border-b-2">
                <input
                  type="text"
                  name="message"
                  placeholder="Napisz wiadomość..."
                  onChange={handleChangeMessage}
                  value={message}
                  className="h-full w-11/12 pl-3 outline-none"
                />
                {waitingForResponse ? (
                  <span className="loading loading-spinner loading-sm h-5 phone:h-6 phone:w-6"></span>
                ) : (
                  <button
                    className="tooltip ml-2 h-10 px-3 py-1"
                    data-tip="Wyślij wiadomość"
                    onClick={handleSubmit}
                  >
                    <AiOutlineSend className="h-5 w-5 phone:h-6 phone:w-6" />
                  </button>
                )}
              </div>

              <>
                <button
                  className="ml-3px-3 tooltip h-10 py-1"
                  data-tip="Zadzwoń"
                  onClick={() => startVideoCall()}
                >
                  <FiPhoneCall className="h-5 w-5 phone:h-6 phone:w-6" />
                </button>
                {callButton == true ||
                localStorage.getItem('callButton') == 'true' ? (
                  <button
                    className="tooltip ml-3 h-10 py-1"
                    data-tip="Odbierz połączenie"
                    onClick={(e) => openModal()}
                  >
                    <FcCallback className="h-7 w-7 phone:h-8 phone:w-8" />
                  </button>
                ) : (
                  ''
                )}
                {callButton == true ||
                localStorage.getItem('callButton') == 'true' ? (
                  <button
                    className="tooltip ml-3 h-10 py-1"
                    data-tip="Odrzuć połączenie"
                    onClick={(e) => {
                      localStorage.removeItem('callButton')
                      localStorage.removeItem('peerId')
                      setCallButton(null)
                      rejectVideoCall()
                    }}
                  >
                    <FcEndCall className="h-7 w-7 phone:h-8 phone:w-8" />
                  </button>
                ) : (
                  ''
                )}
              </>
            </div>
          )}
          {/* </div> */}
        </div>

        {/* modal videocall */}
      </div>
      <dialog
        id="videocall"
        className="modal relative !z-[999] flex flex-row items-center justify-center bg-black"
      >
        <div className={`${peerId != '' ? 'block' : 'hidden'}`}>
          <TransformWrapper minScale={0.5} initialScale={1}>
            <TransformComponent>
              <div
                className={`${
                  peerId != '' ? 'h-[100vh] w-[100vw]' : ''
                } mx-auto`}
              >
                <video
                  preload="none"
                  ref={remoteVideoRef}
                  className="h-full w-full"
                />
              </div>
            </TransformComponent>
          </TransformWrapper>
        </div>
        <div className="absolute top-0 flex w-full flex-row items-center justify-center gap-x-4 bg-black text-white">
          <form method="dialog m-0 p-0 min-h-0" id="closeCallForm">
            <div className="modal-action m-0 p-0">
              <button
                onClick={(e) => {
                  rejectVideoCall()
                  endVideoCall()
                }}
                className="modal-action tooltip tooltip-bottom m-0 flex h-1/4 items-center justify-center rounded-full p-2  hover:bg-slate-700"
                data-tip="Zakończ połączenie"
              >
                <FcEndCall className="h-7 w-7 phone:h-8 phone:w-8" />
              </button>
            </div>
          </form>
          <div
            onClick={() => toggleCamera()}
            className="tooltip tooltip-bottom flex h-1/4 items-center justify-center rounded-full p-2 hover:bg-slate-700"
            data-tip={isCameraOn ? 'Kamera włączona' : 'Kamera wyłączona'}
          >
            {isCameraOn ? (
              <BiCamera className="h-7 w-7 phone:h-8 phone:w-8" />
            ) : (
              <BiCameraOff className="h-7 w-7 phone:h-8 phone:w-8" />
            )}
          </div>
          <div
            onClick={() => toggleAudio()}
            className={`tooltip tooltip-bottom flex h-1/4 items-center justify-center rounded-full p-2 hover:bg-slate-700 ${
              !microphoneConnected && 'text-slate-600'
            }`}
            data-tip={
              microphoneConnected
                ? audioEnabled
                  ? 'Mikrofon włączony'
                  : 'Mikrofon wyłączony'
                : 'Brak podłączonego mirkofonu'
            }
          >
            {audioEnabled ? (
              <BiMicrophone className="h-7 w-7 phone:h-8 phone:w-8" />
            ) : (
              <BiMicrophoneOff className="h-7 w-7 phone:h-8 phone:w-8" />
            )}
          </div>
          <div
            onClick={() => toggleScreenSharing()}
            className="tooltip tooltip-bottom flex h-1/4 items-center justify-center rounded-full p-2 hover:bg-slate-700"
            data-tip={
              isScreenSharing ? 'Zakończ udostępnianie' : 'Udostępnij ekran'
            }
          >
            {isScreenSharing ? (
              <LuScreenShareOff className="h-7 w-7 phone:h-8 phone:w-8" />
            ) : (
              <LuScreenShare className="h-7 w-7 phone:h-8 phone:w-8" />
            )}
          </div>
          <div
            onClick={() => setShowChat((prev) => !prev)}
            className="tooltip tooltip-bottom flex h-1/4 items-center justify-center rounded-full p-2 hover:bg-slate-700"
            data-tip={showChat ? 'Ukryj czat' : 'Pokaż czat'}
          >
            {showChat ? (
              <RiChatOffLine className="h-8 w-8 phone:h-9 phone:w-9" />
            ) : (
              <RiChat4Line className="h-8 w-8 phone:h-9 phone:w-9" />
            )}
          </div>
        </div>
        <video
          preload="none"
          ref={currentUserVideoRef}
          className="absolute bottom-0 left-0 w-6/12 rounded-tr-md shadow-2xl shadow-gray-500 phone:w-4/12 sm:w-2/12"
        />
        <div
          id="scrollableDivVideoCall"
          className={
            showChat
              ? `card fixed bottom-20 right-0 top-[54px] flex w-10/12 flex-col-reverse overflow-y-auto rounded-none border border-none border-gray-200 bg-white py-6 shadow-xl sm:w-7/12 md:w-5/12 lg:w-4/12 xl:w-3/12`
              : 'hidden'
          }
        >
          {readyState === ReadyState.CONNECTING ? (
            <LoadingComponent message="Ładowanie wiadomości..." />
          ) : (
            <>
              <>
                {messageHistory.length != 0 ? (
                  <InfiniteScroll
                    dataLength={messageHistory.length}
                    next={fetchMessages}
                    className="flex w-full flex-col-reverse bg-white pt-2"
                    inverse={true}
                    hasMore={hasMoreMessages}
                    loader={<ChatLoader />}
                    scrollableTarget="scrollableDivVideoCall"
                  >
                    {messageHistory.map((message) => (
                      <Message
                        key={message.id}
                        message={message}
                        secondUser={secondUserProfile}
                      />
                    ))}
                  </InfiniteScroll>
                ) : (
                  <div className="mt-5 flex h-[60vh] w-full justify-center bg-white pt-5 text-center italic text-black">
                    Brak nowych wiadomości.
                  </div>
                )}

                <div className="fixed bottom-0 right-0 mx-auto flex h-[10vh] w-10/12 flex-row items-center justify-between border-t-2 bg-white p-5 sm:w-7/12 md:w-5/12 lg:w-4/12 xl:w-3/12">
                  <div className="flex h-10 w-10/12 items-center justify-between border-b-2">
                    <input
                      type="text"
                      name="message"
                      placeholder="Napisz wiadomość..."
                      onChange={handleChangeMessage}
                      value={message}
                      className="h-full w-11/12 pl-3 outline-none"
                    />
                    {waitingForResponse ? (
                      <span className="loading loading-spinner loading-sm h-5 phone:h-6 phone:w-6"></span>
                    ) : (
                      <button
                        className="tooltip ml-2 h-10 px-3 py-1"
                        data-tip="Wyślij wiadomość"
                        onClick={handleSubmit}
                      >
                        <AiOutlineSend className="h-5 w-5 phone:h-6 phone:w-6" />
                      </button>
                    )}
                  </div>
                </div>
              </>
            </>
          )}
        </div>
      </dialog>
    </>
  )
}

export default Chat
