import React, { useEffect, useState, useContext } from "react";
import Chat from "./Chat";
import { useParams } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import RoomContext from "../../context/RoomContext";
import useAxios from "../../utils/useAxios";
import LoadingComponent from "../LoadingComponent";
import { useNavigate } from "react-router-dom";
import showAlertError from "../messages/SwalAlertError";
import showSuccessAlert from "../messages/SwalAlertSuccess";

import Files from "./Files";
import RoomPageSchedule from "./RoomPageSchedule";
import Swal from "sweetalert2";

const Room = () => {
  const { roomId } = useParams();
  const { user, authTokens } = useContext(AuthContext);
  const { selectedTab, setSelectedTab, setRoom } = useContext(RoomContext);

  let api = useAxios();
  const nav = useNavigate();

  const [name, setName] = useState();
  const [isArchivized, setIsArchivized] = useState();
  const [loading, setLoading] = useState(true);

  const fetchReceiver = async () => {
    setLoading(true);
    await api
      .get(`api/rooms/${roomId}`)
      .then((res) => {
        setIsArchivized(res.data.archivized);
        setName(res.data.name);
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

  const leaveTheRoom = async () => {
    Swal.fire({
      title: "Jesteś pewien?",
      text: "Nie będziesz mógł cofnąć tej operacji!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Opuść pokój",
      cancelButtonText: "Zamknij okno",
      customClass: {
        confirmButton:
          "btn  rounded-none outline-none border-[1px] text-black w-full",
        cancelButton:
          "btn  rounded-none outline-none border-[1px] text-black w-full",
        popup: "rounded-none bg-base-100",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        api
          .post(`api/rooms/${roomId}/leave/`)
          .then((res) => {
            showSuccessAlert(
              "Opuściłeś pokój",
              "Zostaniesz przekierowany do strony głównej",
              () => {
                nav("/");
              }
            );
          })
          .catch((err) => {
            console.log(err);
            showAlertError("Niedozwolona akcja", err.response.data.error);
          });
      }
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
          <div className="z-30 flex flex-row bg-white mt-10 p-5 pb-0 w-full tab-bordered justify-between gap-x-5">
            <h1 className="text-base phone:text-lg sm:text-xl uppercase tracking-wide font-bold ">
              {name}
            </h1>
            <button
              onClick={() => leaveTheRoom()}
              className="hover:underline uppercase text-gray-500 text-xs phone:text-sm"
            >
              Opuść pokój
            </button>
          </div>
          <div className="tabs z-30 bg-white p-5 shadow-xl h-[100%]">
            <div
              className={`tab tab-bordered uppercase tracking-wide text-sm phone:text-base font-bold  hover:text-[#00000080] ${
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
              className={`tab tab-bordered uppercase tracking-wide text-sm phone:text-base font-bold  hover:text-[#00000080] ${
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
              className={`tab tab-bordered uppercase tracking-wide text-sm phone:text-base font-bold  hover:text-[#00000080] ${
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
          {selectedTab == 1 && (
            <div className="bg-white">
              <Chat archivized={isArchivized} />
            </div>
          )}
          {selectedTab == 2 && <Files roomId={roomId} />}
          {selectedTab == 3 && <RoomPageSchedule roomId={roomId} />}
        </>
      )}
    </>
  );
};

export default Room;
