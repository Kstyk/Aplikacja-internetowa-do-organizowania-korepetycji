import React, { useEffect, useState, useContext } from "react";
import useAxios from "../utils/useAxios";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";
import LoadingComponent from "../components/LoadingComponent";
import RoomCard from "../components/RoomComponents/RoomCard";

const StartedRoomsPage = () => {
  const api = useAxios();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useContext(AuthContext);

  const fetchYourRooms = async () => {
    setLoading(true);
    await api
      .get("/api/rooms/all-rooms/")
      .then((res) => {
        setRooms(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    setLoading(false);
  };

  useEffect(() => {
    fetchYourRooms();
  }, []);

  return (
    <>
      {loading ? (
        <LoadingComponent message="Ładowanie danych o zajęciach" />
      ) : (
        <div className="pt-10">
          <div className="absolute top-[70px] left-0 right-0 h-[200px] bg-base-300"></div>

          <div className="card shadow-xl bg-white p-5 pb-10 rounded-none mb-5">
            <div className="w-full m-auto h-full">
              <h1 className="font-bold uppercase text-xl mb-5 border-b-2">
                Twoje pokoje
              </h1>
              <div className="flex flex-row flex-wrap gap-y-5 justify-between items-stretch">
                {rooms?.map((room, i) => (
                  <RoomCard room={room} user={user} key={room.room_id} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}{" "}
    </>
  );
};

export default StartedRoomsPage;
