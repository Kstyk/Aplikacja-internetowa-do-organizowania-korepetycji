import React, { useEffect, useState, useContext } from "react";
import useAxios from "../utils/useAxios";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";
import LoadingComponent from "../components/LoadingComponent";
import RoomCard from "../components/RoomComponents/RoomCard";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import ArchivizedRoomCard from "../components/RoomComponents/ArchivizedRoomCard";
import showAlertError from "../components/messages/SwalAlertError";

const StartedRoomsPage = () => {
  const api = useAxios();
  const [rooms, setRooms] = useState([]);
  const [archivizedRooms, setArchivizedRooms] = useState([]);
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
        showAlertError(
          "Błąd",
          "Wystąpił błąd przy pobieraniu danych z serwera."
        );
      });

    await api
      .get("/api/rooms/all-archivized-rooms/")
      .then((res) => {
        setArchivizedRooms(res.data);
      })
      .catch((err) => {
        showAlertError(
          "Błąd",
          "Wystąpił błąd przy pobieraniu danych z serwera."
        );
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
          <div className="absolute top-[70px] left-0 right-0 h-[200px] bg-base-300 max-phone:hidden"></div>

          <div className="card shadow-xl bg-white p-5 pb-10 rounded-md mb-5">
            <div className="w-full m-auto h-full">
              <h1 className="text-2xl text-center">Twoje pokoje</h1>

              <div className="border-b-[1px] border-base-100 my-4"></div>
              <div className="flex items-center w-full justify-center mb-10">
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
                      <div className="flex justify-center w-full">
                        <h2 className="text-center">
                          Nie masz żadnych aktywnych pokoi.
                        </h2>
                      </div>
                    )}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {rooms?.map((room, i) => (
                    <RoomCard room={room} user={user} key={room.room_id} />
                  ))}
                </div>
              </div>

              <h1 className="text-2xl text-center flex flex-row justify-center items-center gap-x-3">
                <div
                  className="tooltip"
                  data-tip="Pokoje, w których zostałeś sam - druga osoba opuściła pokój."
                >
                  <AiOutlineQuestionCircle />
                </div>
                <span>Zarchiwizowane pokoje</span>
              </h1>

              <div className="border-b-[1px] border-base-100 my-4"></div>
              <div className="flex w-full justify-center mb-10">
                {archivizedRooms?.length == 0 && (
                  <div className="h-full">
                    {user?.role == "Student" ? (
                      <div className="flex flex-col justify-center w-full h-full">
                        <h2 className="text-center">
                          Nie masz żadnych zarchiwizowanych pokoi.
                        </h2>
                      </div>
                    ) : (
                      <div className="flex flex-col justify-center  w-full h-full">
                        <h2>Nie masz żadnych zarchiwizowanych pokoi.</h2>
                      </div>
                    )}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {archivizedRooms?.map((room, i) => (
                    <ArchivizedRoomCard room={room} key={room.room_id} />
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
