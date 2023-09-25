import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../../context/AuthContext'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useNavigate, useParams } from 'react-router-dom'
import Message from './Message'
import ChatLoader from './ChatLoader'
import useAxios from '../../utils/useAxios'
import Modal from 'react-modal'
import { useRef } from 'react'
import Peer from 'peerjs'
import LoadingComponent from '../LoadingComponent'
import { NotificationContext } from '../../context/NotificationContext'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import { AiOutlineSend } from 'react-icons/ai'
import { FiPhoneCall } from 'react-icons/fi'
import { FcCallback, FcEndCall } from 'react-icons/fc'
import showAlertError from '../messages/SwalAlertError'

const Chat = ({ archivized }) => {
  const [message, setMessage] = useState('')
  const [messageHistory, setMessageHistory] = useState([])
  const [page, setPage] = useState(2)
  const [hasMoreMessages, setHasMoreMessages] = useState(false)
  const nav = useNavigate()

  const { roomId } = useParams()
  const { user, authTokens } = useContext(AuthContext)
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

  const [audioEnabled, setAudioEnabled] = useState(true)
  const [isCameraOn, setIsCameraOn] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const { readyState, sendJsonMessage } = useWebSocket(
    user ? `ws://127.0.0.1:8000/chats/${roomId}/` : null,
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
        switch (data.type) {
          case 'chat_message_echo':
            setMessageHistory((prev) => [data.message, ...prev])
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
    sendJsonMessage({
      type: 'chat_message',
      message,
      name: user ? user.username : '',
    })
    setMessage('')
  }

  function openModal() {
    checkMediaDevices()
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
      const hasCamera = devices.some((device) => device.kind === 'videoinput')

      // Tutaj możesz podjąć odpowiednie działania w zależności od wyników
      // TODO
      if (!hasMicrophone) {
        console.log('brak mikro')
      }

      if (!hasCamera) {
        console.log('brak kamery')
      }
    } catch (error) {
      console.error('Error checking media devices:', error)
    }
  }

  const startVideoCall = () => {
    checkMediaDevices()
    window.videocall.showModal()

    // const peer = new Peer({
    //   host: "localhost",
    //   port: 9000,
    //   path: "/myapp",
    // });
    const peer = new Peer()
    peer.on('open', (id) => {
      setPeerId(id)
    })

    peer.on('call', (call) => {
      var getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia

      getUserMedia({ video: true, audio: true }, (mediaStream) => {
        currentUserVideoRef.current.srcObject = mediaStream
        currentUserVideoRef.current.onloadedmetadata = () => {
          currentUserVideoRef.current.play()
        }
        call.answer(mediaStream)
        call.on('stream', function (remoteStream) {
          remoteVideoRef.current.srcObject = remoteStream
          remoteVideoRef.current.onloadedmetadata = () => {
            remoteVideoRef.current.play()
          }
        })
      })
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

    getUserMedia({ video: true, audio: true }, (mediaStream) => {
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
    const audio = await navigator.mediaDevices.getUserMedia({ audio: true })

    return new MediaStream([audio.getTracks()[0], stream.getTracks()[0]])
  }

  const toggleScreenSharing = async () => {
    if (isScreenSharing) {
      stopScreenSharing()
    } else {
      const stream = await getScreenshareWithMicrophone()
      setAudioEnabled(true)

      currentUserVideoRef.current.srcObject = stream
      let videoTrack = currentUserVideoRef.current.srcObject.getTracks()[0]

      videoTrack.onended = () => {
        stopScreenSharing()
      }

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
        audio: true,
      })
      .then((stream) => {
        currentUserVideoRef.current.srcObject = stream

        const call = peerInstance.current.call(remotePeerIdValue, stream)

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
          <div id="scrollableDiv" className="w-full">
            {readyState === ReadyState.CONNECTING ? (
              <LoadingComponent message="Ładowanie wiadomości..." />
            ) : (
              <>
                <>
                  {messageHistory.length != 0 ? (
                    <InfiniteScroll
                      dataLength={messageHistory.length}
                      next={fetchMessages}
                      className="fixed bottom-20 top-[16rem] flex w-[calc(100%-24px)] flex-col-reverse bg-white pt-2 phone:w-11/12 phone:border-t-2 md:w-10/12 lg:w-8/12"
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
                    <div className="h-full w-full text-center italic">
                      Brak nowych wiadomości.
                    </div>
                  )}
                  {archivized ? (
                    <div className="right- fixed bottom-0 mx-auto flex w-full flex-row items-center border-t-2 bg-white p-5 phone:w-11/12 md:w-10/12 lg:w-8/12">
                      <div className="flex h-10 w-full items-center justify-center italic text-gray-600">
                        <span>Historia czatu</span>
                      </div>
                    </div>
                  ) : (
                    <div className="fixed bottom-0 mx-auto flex w-[calc(100%-24px)] flex-row items-center justify-between border-t-2 bg-white p-5 max-phone:mr-3 phone:w-11/12 md:w-10/12 lg:w-8/12">
                      <div className="flex h-10 w-10/12 items-center justify-between border-b-2">
                        <input
                          type="text"
                          name="message"
                          placeholder="Napisz wiadomość..."
                          onChange={handleChangeMessage}
                          value={message}
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
                </>
              </>
            )}
          </div>
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
        <div className="absolute top-0 flex w-full flex-row justify-center gap-x-4 bg-black text-white">
          <form method="dialog m-0 p-0 min-h-0" id="closeCallForm">
            <div className="modal-action m-0 p-0">
              <button
                onClick={(e) => {
                  rejectVideoCall()
                  endVideoCall()
                }}
                className="modal-action m-0 flex h-1/4 items-center justify-center border-b-2 border-white p-0 hover:bg-slate-700"
              >
                Zakończ połączenie
              </button>
            </div>
          </form>
          <div
            onClick={() => toggleCamera()}
            className="flex h-1/4 items-center justify-center border-b-2 border-white hover:bg-slate-700"
          >
            {isCameraOn ? 'Wyłącz' : 'Włącz'} kamerę
          </div>
          <div
            onClick={() => toggleAudio()}
            className="flex h-1/4 items-center justify-center border-b-2 border-white hover:bg-slate-700"
          >
            {audioEnabled ? 'Wyłącz' : 'Włącz'} mikrofon
          </div>
          <div
            onClick={() => toggleScreenSharing()}
            className="flex h-1/4 items-center justify-center hover:bg-slate-700"
          >
            {isScreenSharing ? 'Zakończ udostępnianie' : 'Udostępnij ekran'}
          </div>
        </div>
        <video
          preload="none"
          ref={currentUserVideoRef}
          className="absolute bottom-0 left-0 w-2/12"
        />
      </dialog>
    </>
  )
}

export default Chat
