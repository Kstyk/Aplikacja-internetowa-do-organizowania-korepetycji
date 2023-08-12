import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import useWebSocket, { ReadyState } from "react-use-websocket";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate, useParams } from "react-router-dom";
import Message from "./Message";
import ChatLoader from "./ChatLoader";
import useAxios from "../utils/useAxios";
import Modal from "react-modal";
import { useRef } from "react";
import Peer from "peerjs";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messageHistory, setMessageHistory] = useState([]);
  const [page, setPage] = useState(2);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const nav = useNavigate();

  const { roomId } = useParams();
  const { user, authTokens } = useContext(AuthContext);
  const [secondUserProfile, setSecondUserProfile] = useState(null);

  let api = useAxios();
  // videocall
  const [peerId, setPeerId] = useState("");
  const [remotePeerIdValue, setRemotePeerIdValue] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);
  const [callButton, setCallButton] = useState(null);

  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const peerInstance = useRef(null);

  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const { readyState, sendJsonMessage } = useWebSocket(
    user ? `ws://127.0.0.1:8000/${roomId}/` : null,
    {
      queryParams: {
        userId: user ? user.user_id : "",
      },
      onOpen: (e) => {
        console.log("connected");
      },
      onClose: (e) => {
        console.log("disconnected");
        // nav("/");
      },
      onMessage: (e) => {
        const data = JSON.parse(e.data);
        switch (data.type) {
          case "chat_message_echo":
            setMessageHistory((prev) => [data.message, ...prev]);
            break;
          case "last_20_messages":
            setMessageHistory(data.messages);
            setHasMoreMessages(data.has_more);
            break;
          case "receivedpeer":
            // django potrzebuje 2-3 sekund by odeslac wiadomosc
            setRemotePeerIdValue(data.peer);
            setCallButton(true);
            localStorage.setItem("remotePeerId", data.peer);
            localStorage.setItem("callButton", true);
            break;
          case "rejected_call":
            endVideoCall();
          default:
            break;
        }
      },
    }
  );

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  const fetchMessages = async () => {
    await api
      .get(`api/rooms/messages/?room_id=${roomId}&page=${page}`)
      .then((res) => {
        console.log(res.data);
        setHasMoreMessages(res.data.next !== null);
        setPage(page + 1);
        setMessageHistory((prev) => prev.concat(res.data.results));
      })
      .catch((err) => {
        nav("/");
      });
  };

  const fetchSecondUserInRoom = async () => {
    await api
      .get(`api/rooms/room-users/${roomId}/`)
      .then((res) => {
        setSecondUserProfile(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchSecondUserInRoom();
  }, []);

  useEffect(() => {
    if (readyState == "Open") {
      fetchMessages();
    }
  }, [messageHistory]);

  function handleChangeMessage(e) {
    setMessage(e.target.value);
  }

  function handleSubmit() {
    sendJsonMessage({
      type: "chat_message",
      message,
      name: user ? user.username : "",
    });
    setMessage("");
  }

  function openModal() {
    setIsOpen(true);

    startVideoCall();
    if (remotePeerIdValue == "") {
      call(localStorage.getItem("remotePeerId"));
    } else {
      call(remotePeerIdValue);
    }
  }

  function afterOpenModal() {}

  function closeModal() {
    setIsOpen(false);
    setCallButton(false);
  }

  Modal.setAppElement("#root");

  useEffect(() => {
    if (peerId != "") {
      sendJsonMessage({
        type: "peer",
        peer: peerId,
        token: user.token,
      });
    }
  }, [peerId]);

  const startVideoCall = () => {
    const peer = new Peer();

    peer.on("open", (id) => {
      setPeerId(id);
      setIsOpen(true);
    });

    peer.on("call", (call) => {
      var getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;

      getUserMedia({ video: true, audio: true }, (mediaStream) => {
        currentUserVideoRef.current.srcObject = mediaStream;
        currentUserVideoRef.current.onloadedmetadata = () => {
          currentUserVideoRef.current.play();
        };
        call.answer(mediaStream);
        call.on("stream", function (remoteStream) {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.onloadedmetadata = () => {
            remoteVideoRef.current.play();
          };
        });
      });
    });

    peer.on("close", () => {
      console.log("Zakończono połączenie");
    });

    peerInstance.current = peer;
  };

  const call = async (remotePeerId) => {
    var getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;

    getUserMedia({ video: true, audio: true }, (mediaStream) => {
      currentUserVideoRef.current.srcObject = mediaStream;
      currentUserVideoRef.current.onloadedmetadata = () => {
        currentUserVideoRef.current.play();
      };

      const call = peerInstance.current.call(remotePeerId, mediaStream, {
        metadata: {
          callerPeerId: peerId,
        },
      });

      call.on(
        "stream",
        (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.onloadedmetadata = () => {
            remoteVideoRef.current.play();
          };
        },
        function (err) {
          console.log("Failed to get local stream", err);
        }
      );
    });
  };

  const rejectVideoCall = async () => {
    sendJsonMessage({
      type: "reject_peer",
      peer: peerId,
      token: user.token,
    });
  };

  const endVideoCall = async () => {
    stopScreenSharing();
    // Close the PeerJS connection
    if (peerInstance.current) {
      peerInstance.current.destroy();
      peerInstance.current = null;
    }

    // Stop the media streams and reset their references
    const currentUserStream = currentUserVideoRef.current.srcObject;
    const remoteStream = remoteVideoRef.current.srcObject;

    if (currentUserStream) {
      currentUserStream.getTracks().forEach((track) => track.stop());
      currentUserVideoRef.current.srcObject = null;
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => track.stop());
      remoteVideoRef.current.srcObject = null;
    }

    // Reset state variables
    setIsOpen(false);
    setCallButton(false);
    setPeerId("");
    setRemotePeerIdValue("");
    localStorage.removeItem("callButton");
    localStorage.removeItem("peerId");
  };

  const toggleAudio = async () => {
    const audioTracks = currentUserVideoRef.current.srcObject.getAudioTracks();
    audioTracks.forEach((track) => {
      track.enabled = !audioEnabled;
    });
    setAudioEnabled(!audioEnabled);
  };

  const toggleCamera = async () => {
    const tracks = currentUserVideoRef.current.srcObject.getTracks();
    tracks.forEach((track) => {
      if (track.kind === "video") {
        track.enabled = !isCameraOn;
        setIsCameraOn(!isCameraOn);
      }
    });
  };

  async function getScreenshareWithMicrophone() {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });
    const audio = await navigator.mediaDevices.getUserMedia({ audio: true });

    return new MediaStream([audio.getTracks()[0], stream.getTracks()[0]]);
  }

  const toggleScreenSharing = async () => {
    if (isScreenSharing) {
      stopScreenSharing();
    } else {
      console.log(peerId);

      const stream = await getScreenshareWithMicrophone();
      setAudioEnabled(true);

      currentUserVideoRef.current.srcObject = stream;
      let videoTrack = currentUserVideoRef.current.srcObject.getTracks()[0];

      videoTrack.onended = () => {
        stopScreenSharing();
      };

      const call = peerInstance.current.call(remotePeerIdValue, stream);
      call.on("stream", (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current.play();
      });

      setIsScreenSharing(true);
    }
  };

  const stopScreenSharing = () => {
    if (!isScreenSharing) return;
    setIsScreenSharing(false);
    const currentUserStream = currentUserVideoRef.current.srcObject;
    if (currentUserStream) {
      currentUserStream.getTracks().forEach((track) => track.stop());
    }
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        currentUserVideoRef.current.srcObject = stream;

        const call = peerInstance.current.call(remotePeerIdValue, stream);

        call.on("stream", (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play();
        });
      })
      .catch((error) => {
        // Handle any errors with revoking media permissions (optional)
        console.error("Error revoking media permissions:", error);
      });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="absolute top-[70px] left-0 right-0 h-[300px] bg-base-300 "></div>

      {/* <div className="chat chat-start w-full"> */}
      <div
        id="scrollableDiv"
        className="h-[calc(100vh-260px)] mt-10 flex flex-col-reverse relative w-full border border-gray-200 border-none overflow-y-auto p-6 bg-white card shadow-xl rounded-sm"
      >
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
      </div>
      {/* </div> */}
      {/* przyciski */}
      <div className="ml-5 mt-10 flex items-center">
        <input
          type="text"
          name="message"
          placeholder="Napisz wiadomość..."
          onChange={handleChangeMessage}
          value={message}
          className="shadow-sm sm:text-sm border-black border-[1px] bg-gray-100 rounded-none h-10 w-6/12 pl-5"
        />
        <button
          className="ml-3 bg-gray-100 px-3 py-1 h-10 border-black border-[1px]"
          onClick={handleSubmit}
        >
          Wyślij
        </button>
        <button
          className="ml-3 bg-gray-100 px-3 py-1 h-10 border-black border-[1px] "
          onClick={() => startVideoCall()}
        >
          Zadzwoń
        </button>

        <>
          {callButton == true ||
          localStorage.getItem("callButton") == "true" ? (
            <button
              className="ml-3 bg-gray-100 px-3 py-1 h-10 border-black border-[1px]"
              onClick={(e) => openModal()}
            >
              Odbierz połączenie
            </button>
          ) : (
            ""
          )}
          {callButton == true ||
          localStorage.getItem("callButton") == "true" ? (
            <button
              className="ml-3 bg-gray-100 px-3 py-1 h-10 border-black border-[1px]"
              onClick={(e) => {
                localStorage.removeItem("callButton");
                localStorage.removeItem("peerId");
                setCallButton(null);
                rejectVideoCall();
              }}
            >
              Zakończ połączenie
            </button>
          ) : (
            ""
          )}
        </>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        className="bg-black flex flex-row relative"
        style={{
          content: {
            height: "94vh",
            marginTop: "3vh",
            marginBottom: "3vh",
            width: "94%",
            marginLeft: "3%",
            marginRight: "3%",
          },
        }}
      >
        <div className="h-full w-10/12 ">
          <video
            preload="none"
            ref={remoteVideoRef}
            className="w-full h-full"
          />
        </div>
        <div className="w-2/12 bg-slate-500 h-full flex flex-col justify-between text-lg uppercase font-semibold">
          <div
            onClick={() => {
              rejectVideoCall();
              endVideoCall();
            }}
            className="border-b-2 border-white h-1/4 flex justify-center items-center hover:bg-slate-700"
          >
            Zakończ połączenie
          </div>
          <div
            onClick={() => toggleCamera()}
            className="border-b-2 border-white h-1/4 flex justify-center items-center hover:bg-slate-700"
          >
            {isCameraOn ? "Wyłącz" : "Włącz"} kamerę
          </div>
          <div
            onClick={() => toggleAudio()}
            className="border-b-2 border-white h-1/4 flex justify-center items-center hover:bg-slate-700"
          >
            {audioEnabled ? "Wyłącz" : "Włącz"} mikrofon
          </div>
          <div
            onClick={() => toggleScreenSharing()}
            className="h-1/4 flex justify-center items-center hover:bg-slate-700"
          >
            {isScreenSharing ? "Zakończ udostępnianie" : "Udostępnij ekran"}
          </div>
        </div>
        <video
          preload="none"
          ref={currentUserVideoRef}
          className="absolute bottom-0 left-0 w-2/12"
        />
      </Modal>
    </div>
  );
};

export default Chat;
