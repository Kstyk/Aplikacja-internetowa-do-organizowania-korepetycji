import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import useWebSocket, { ReadyState } from "react-use-websocket";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate, useParams } from "react-router-dom";
import Message from "./Message";
import ChatLoader from "./ChatLoader";
import usePeerJS from "../utils/usePeerJS";
import useAxios from "../utils/useAxios";
import Modal from "react-modal";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messageHistory, setMessageHistory] = useState([]);
  const [page, setPage] = useState(2);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const nav = useNavigate();

  const { roomId } = useParams();
  const { user, authTokens } = useContext(AuthContext);

  let api = useAxios();
  // videocall
  const {
    peerId,
    call,
    startVideoCall,
    remotePeerIdValue,
    setRemotePeerIdValue,
    remoteVideoRef,
    currentUserVideoRef,
    modalIsOpen,
    setIsOpen,
    callButton,
    setCallButton,
    toggleAudio,
    toggleCamera,
    endVideoCall,
    audioEnabled,
    isCameraOn,
    isScreenSharing,
    toggleScreenSharing,
    rejectVideoCall,
  } = usePeerJS(roomId);

  const { readyState, sendJsonMessage } = useWebSocket(
    user ? `ws://127.0.0.1:8000/${roomId}/` : null,
    {
      queryParams: {
        userId: user ? user.user_id : "",
        roomId: roomId,
      },
      onOpen: (e) => {
        console.log("connected");
        console.log(roomId);
      },
      onClose: (e) => {
        console.log(e);
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
        console.log(err);
        console.log(err.response.data.detail);
        console.log(err.response.data);
        nav("/");
      });
  };

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
      console.log("remote storage: " + localStorage.getItem("peerId"));
      call(localStorage.getItem("peerId"));
    } else {
      console.log("remote state: " + remotePeerIdValue);

      call(remotePeerIdValue);
    }
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  function closeModal() {
    setIsOpen(false);
    setCallButton(false);
  }

  Modal.setAppElement("#root");

  return (
    <div className="flex flex-col h-full">
      {/* <div>Status: {connectionStatus}</div> */}
      <div
        id="scrollableDiv"
        className="h-[calc(100vh-260px)] mt-3 flex flex-col-reverse relative w-full border border-gray-200 border-t-0 overflow-y-auto p-6"
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
            <Message key={message.id} message={message} />
          ))}
        </InfiniteScroll>
      </div>
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
          onClick={startVideoCall}
        >
          Zadzwoń
        </button>
        {callButton == true || localStorage.getItem("callButton") == "true" ? (
          <button
            className="ml-3 bg-gray-100 px-3 py-1 h-10 border-black border-[1px]"
            onClick={(e) => openModal()}
          >
            Odbierz połączenie
          </button>
        ) : (
          ""
        )}
        {callButton == true || localStorage.getItem("callButton") == "true" ? (
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
            onClick={() => endVideoCall()}
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
