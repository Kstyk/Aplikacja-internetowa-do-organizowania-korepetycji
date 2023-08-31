import React, { useEffect, useState, useContext } from "react";
import Chat from "./Chat";
import { useParams } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import RoomContext from "../../context/RoomContext";
import useAxios from "../../utils/useAxios";
import LoadingComponent from "../LoadingComponent";
import { useNavigate } from "react-router-dom";
import showAlertError from "../messages/SwalAlertError";
import Files from "./Files";
import RoomPageSchedule from "./RoomPageSchedule";

const Room = () => {
  const { roomId } = useParams();
  const { user, authTokens } = useContext(AuthContext);
  const { selectedTab, setSelectedTab, setRoom } = useContext(RoomContext);

  let api = useAxios();
  const nav = useNavigate();

  const [value, setValue] = useState("1");
  const [receiver, setReceiver] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const fetchReceiver = async () => {
    setLoading(true);
    await api
      .get(`api/rooms/${roomId}`)
      .then((res) => {
        const users = res.data.users;
        users.map((u) => (u != user.email ? setReceiver(u) : ""));
        setLoading(false);
      })
      .catch((err) => {
        if (err.response.status == 404) {
          showAlertError("Błąd", "Pokój o takim ID nie istnieje", () => {
            setLoading(false);
          });
          nav("/");
        }

        if (err.response.status == 403) {
          showAlertError("Błąd", "Nie masz dostępu do tego pokoju", () => {
            setLoading(false);
          });
          nav("/");
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    setRoom(roomId);
    fetchReceiver();
  }, []);

  return (
    <>
      {loading ? (
        <LoadingComponent />
      ) : (
        <>
          <div className="tabs z-30 bg-white mt-10 p-5 shadow-xl h-[100%]">
            <div
              className={`tab tab-bordered uppercase tracking-wide text-lg font-bold  hover:text-[#00000080] ${
                selectedTab == 1
                  ? "!text-gray-700 border-b-gray-700 transition-all duration-300"
                  : "text-[#00000080]"
              }`}
              onClick={() => {
                setSelectedTab(1);
              }}
            >
              Czat
            </div>
            <div
              className={`tab tab-bordered uppercase tracking-wide text-lg font-bold  hover:text-[#00000080] ${
                selectedTab == 2
                  ? "!text-gray-700 border-b-gray-700 transition-all duration-300"
                  : "text-[#00000080]"
              }`}
              onClick={() => {
                setSelectedTab(2);
              }}
            >
              Pliki
            </div>
            <div
              className={`tab tab-bordered uppercase tracking-wide text-lg font-bold  hover:text-[#00000080] ${
                selectedTab == 3
                  ? "!text-gray-700 border-b-gray-700 transition-all duration-300"
                  : "text-[#00000080]"
              }`}
              onClick={() => {
                setSelectedTab(3);
              }}
            >
              Terminarz
            </div>
          </div>
          {selectedTab == 1 && <Chat />}
          {selectedTab == 2 && <Files roomId={roomId} />}
          {selectedTab == 3 && <RoomPageSchedule roomId={roomId} />}
        </>
      )}
    </>
  );
};

export default Room;
