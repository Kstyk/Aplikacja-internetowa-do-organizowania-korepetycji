import React from "react";
import { Link } from "react-router-dom";
import guest from "../../assets/guest.png";

const ArchivizedRoomCard = ({ room, user }) => {
  return (
    <Link
      to={`/pokoj/${room.room_id}/`}
      className="card rounded-md bg-white hover:bg-slate-100 transition-all duration-200 border-[1px] flex flex-col items-center justify-center w-full p-5"
    >
      <React.Fragment>
        <figure className="w-4/12 aspect-square">
          <img
            src={
              room?.deleted_user?.profile_image == null
                ? guest
                : `http://127.0.0.1:8000${room?.deleted_user?.profile_image}`
            }
            alt="Shoes"
            className="rounded-xl"
          />
        </figure>
        <div className="card-body text-center pb-0 flex flex-col justify-between">
          <h2>
            <div>
              <span>
                {room?.deleted_user?.user?.first_name}{" "}
                {room?.deleted_user?.user?.last_name} -{" "}
                {room?.deleted_user?.user?.email}
              </span>
            </div>
          </h2>
          <div className="closer-classes text-center flex flex-col"></div>
        </div>
      </React.Fragment>
    </Link>
  );
};

export default ArchivizedRoomCard;
