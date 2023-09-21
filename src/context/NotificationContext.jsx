import React, { createContext, ReactNode, useContext, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { FiPhoneCall } from "react-icons/fi";

import AuthContext from "./AuthContext";

const DefaultProps = {
  connectionStatus: "Uninstantiated",
};

export const NotificationContext = createContext(DefaultProps);

export const NotificationContextProvider = ({ children }) => {
  const { authTokens, user } = useContext(AuthContext);

  const CustomToastWithLink = (fisrt_name, last_name, room_id) => (
    <div className="flex flex-col items-center">
      <span>
        {fisrt_name} {last_name} dzwoni do Ciebie
      </span>
      <Link
        className="btn text-sm min-h-0 h-10 px-3 border-2 hover:border-4 bg-slate-50 rounded-md w-full border-base-100 capitalize hover:bg-transparent hover:border-base-200 hover:text-base "
        to={`/pokoj/${room_id}`}
      >
        Przejdź do pokoju
      </Link>
    </div>
  );
  const { readyState, sendJsonMessage } = useWebSocket(
    user
      ? `ws://127.0.0.1:8000/notifications/?token=${authTokens?.access}`
      : null,
    {
      onOpen: () => {},
      onClose: () => {},
      onMessage: (e) => {
        const data = JSON.parse(e.data);
        switch (data.type) {
          case "incomingcall":
            localStorage.setItem("remotePeerId", data.peer);
            localStorage.setItem("callButton", true);
            toast.info(
              CustomToastWithLink(
                data?.caller?.first_name,
                data?.caller?.last_name,
                data?.room_id
              ),
              {
                draggable: true,
                icon: ({ theme, type }) => (
                  <FiPhoneCall className="!w-10  rounded-full text-red-800 shadow-red-200 shadow-xl aspect-square" />
                ),
              }
            );
            break;
          default:
            bash.error("Unknown message type!");
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

  return (
    <NotificationContext.Provider
      value={{
        connectionStatus,
        sendNotification: sendJsonMessage,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
