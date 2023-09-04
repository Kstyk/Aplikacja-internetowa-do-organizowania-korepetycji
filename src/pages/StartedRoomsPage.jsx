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
        console.log(res.data);
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
              <h1 className="text-2xl text-center">Twoje pokoje</h1>

              <div className="border-b-[1px] border-base-100 my-4"></div>
              <div className="min-h-[200px] flex items-center w-full justify-center">
                {rooms.length == 0 && (
                  <div className="h-full">
                    {user?.role == "Student" ? (
                      <div className="flex flex-col justify-center items-center w-full h-full">
                        <h2>Brak pokoi.</h2>
                        <Link
                          className="btn btn-outline no-animation  max-md:w-full max-phone:mx-auto h-10 py-0 !min-h-0 rounded-none mt-2 hover:bg-base-400 border-base-400"
                          to="/search-classes"
                        >
                          Kup swoje pierwsze zajęcia już teraz
                        </Link>
                      </div>
                    ) : (
                      "Teacher"
                    )}
                  </div>
                )}
                <div className="flex flex-row flex-wrap gap-y-5 justify-between items-stretch">
                  {rooms?.map((room, i) => (
                    <RoomCard room={room} user={user} key={room.room_id} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}{" "}
    </>
  );
};

export default StartedRoomsPage;
