import React from "react";
import { Link } from "react-router-dom";
import guest from "../../assets/guest.png";
import dayjs from "dayjs";

const RoomCard = ({ room, user }) => {
  dayjs.locale("pl");

  return (
    <Link
      to={`/pokoj/${room.room_id}/`}
      className="card rounded-none bg-white hover:bg-slate-100 transition-all duration-200 border-[1px] flex flex-col items-center justify-center w-full p-5"
    >
      {room.users.map((u) =>
        u?.user?.email != user.email ? (
          <React.Fragment key={u?.user?.id}>
            <figure className="w-4/12 aspect-square">
              <img
                src={
                  u?.profile_image == null
                    ? guest
                    : `http://127.0.0.1:8000${u?.profile_image}`
                }
                alt="Shoes"
                className="rounded-xl"
              />
            </figure>
            <div className="card-body text-center pb-0 flex flex-col justify-between">
              <h2>
                {room.archivized ? (
                  <div>{room.name}</div>
                ) : (
                  <div>
                    <span>
                      {u?.user?.first_name} {u?.user?.last_name} -{" "}
                      {u?.user?.email}
                    </span>
                  </div>
                )}
              </h2>
              <div className="closer-classes text-center flex flex-col">
                <span className="text-gray-500 text-sm">
                  Najbliższe zajęcia:
                </span>
                <span className="text-gray-500 text-sm">
                  {room?.next_classes
                    ? dayjs(room?.next_classes.date).format(
                        "dddd, DD MMMM, HH:mm"
                      )
                    : "Brak zaplanowanych zajęć"}
                </span>
              </div>
            </div>
          </React.Fragment>
        ) : (
          ""
        )
      )}
    </Link>
  );
};

export default RoomCard;
