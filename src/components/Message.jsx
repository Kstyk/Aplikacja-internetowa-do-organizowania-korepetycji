import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import dayjs from "dayjs";
import guest from "../assets/guest.png";

export function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Message = ({ message, secondUser }) => {
  const { user } = useContext(AuthContext);
  dayjs.locale("pl");

  return (
    <li
      className={classNames(
        "mt-1 mb-1 chat pb-2 px-2",
        user?.email === message.to_user.email ? "chat-start" : "chat-end"
      )}
    >
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img
            title={
              user?.email != message.to_user.email
                ? user.email
                : message.from_user.email
            }
            src={
              user?.email != message.to_user.email
                ? user?.image
                  ? `http://localhost:8000${user.image}`
                  : guest
                : secondUser?.profile_image
                ? `http://localhost:8000${secondUser.profile_image}`
                : guest
            }
          />
        </div>
      </div>
      <div className="chat-header flex gap-x-3">
        <time className="text-xs opacity-50">
          {dayjs(message.timestamp).format("dddd, HH:mm")}
        </time>
      </div>
      <div
        className={`chat-bubble max-w-[60%] break-words text-black hover:bg-opacity-80  ${
          user?.email === message.to_user.email ? `bg-base-300` : `bg-base-200`
        }`}
      >
        {message.content}
      </div>
      {/* <div className="flex flex-col">
        <div
          className={classNames(
            "relative max-w-xl rounded-lg px-2 py-1 text-gray-700 shadow",
            user?.email === message.to_user.email
              ? "bg-gray-300"
              : "bg-gray-200"
          )}
        >
          <div className="flex items-end">
            <span className=" w-[90%] inline-block break-words">
              {message.content}
            </span>
            <span
              className="ml-2"
              style={{
                fontSize: "0.6rem",
                lineHeight: "1rem",
              }}
            >
              {formatMessageTimestamp(message.timestamp)}
            </span>
          </div>
        </div>
        <span className="text-xs">Sended by {message.from_user.email}</span>
      </div> */}
    </li>
  );
};

export default Message;
