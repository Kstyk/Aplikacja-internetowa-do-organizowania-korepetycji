import React, { useEffect, useState, useContext } from "react";
import Chat from "./Chat";
import { useParams } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import useAxios from "../../utils/useAxios";
import LoadingComponent from "../LoadingComponent";
import { useNavigate } from "react-router-dom";
import showAlertError from "../messages/SwalAlertError";
import Files from "./Files";

const Room = () => {
  const { roomId } = useParams();
  const { user, authTokens } = useContext(AuthContext);
  let api = useAxios();
  const nav = useNavigate();

  const [value, setValue] = useState("1");
  const [receiver, setReceiver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(1);

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
    fetchReceiver();
  }, []);

  return (
    <>
      {loading ? (
        <LoadingComponent />
      ) : (
        <>
          <div className="tabs z-50 bg-white mt-10 p-5 shadow-xl">
            <div
              className={`tab tab-bordered uppercase tracking-wide text-lg font-bold  hover:text-[#00000080] ${
                activeTab == 1
                  ? "!text-gray-700 border-b-gray-700 transition-all duration-300"
                  : "text-[#00000080]"
              }`}
              onClick={() => {
                setActiveTab(1);
              }}
            >
              Czat
            </div>
            <div
              className={`tab tab-bordered uppercase tracking-wide text-lg font-bold  hover:text-[#00000080] ${
                activeTab == 2
                  ? "!text-gray-700 border-b-gray-700 transition-all duration-300"
                  : "text-[#00000080]"
              }`}
              onClick={() => {
                setActiveTab(2);
              }}
            >
              Pliki
            </div>
            <div
              className={`tab tab-bordered uppercase tracking-wide text-lg font-bold  hover:text-[#00000080] ${
                activeTab == 3
                  ? "!text-gray-700 border-b-gray-700 transition-all duration-300"
                  : "text-[#00000080]"
              }`}
              onClick={() => {
                setActiveTab(3);
              }}
            >
              Terminarz
            </div>
          </div>
          {activeTab == 1 && <Chat />}
          {activeTab == 2 && <Files roomId={roomId} />}
        </>
      )}
    </>
  );
};

export default Room;
