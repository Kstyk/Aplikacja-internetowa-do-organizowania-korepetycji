import React, { useEffect, useContext } from "react";
import useAxios from "../utils/useAxios";
import { useState } from "react";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";

const StartedRoomsPage = () => {
  const api = useAxios();
  const [rooms, setRooms] = useState([]);

  const { user } = useContext(AuthContext);

  const fetchYourRooms = async () => {
    await api
      .get("/api/rooms/all-rooms/")
      .then((res) => {
        setRooms(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchYourRooms();
  }, []);

  return (
    <div className="bg-white h-full flex pt-10">
      <div className="w-8/12 m-auto h-full">
        <h1 className="font-semibold text-2xl pb-3 border-b-2">Twoje pokoje</h1>
        <ul>
          {rooms.map((room, i) => (
            <li
              className="pl-3 pt-3 pb-3 border-b-2 hover:bg-slate-200 cursor-pointer mb-2"
              key={room.room_id}
            >
              {room.users.map((u) =>
                u.email != user.email ? (
                  <div key={user.email}>
                    <Link to={`/pokoj/${room.room_id}/`}>
                      {u.first_name} {u.last_name} - {u.email}
                    </Link>
                  </div>
                ) : (
                  ""
                )
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StartedRoomsPage;
