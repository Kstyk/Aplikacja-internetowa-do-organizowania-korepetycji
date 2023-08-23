import React, { useEffect, useState, useContext } from "react";
import Chat from "./Chat";
import { useParams } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import useAxios from "../utils/useAxios";
import LoadingComponent from "./LoadingComponent";
import { useNavigate } from "react-router-dom";
import showAlertError from "./messages/SwalAlertError";

const Room = () => {
  const [value, setValue] = useState("1");
  const [receiver, setReceiver] = useState(null);
  const [loading, setLoading] = useState(true);
  const { roomId } = useParams();
  const { user, authTokens } = useContext(AuthContext);
  let api = useAxios();
  const nav = useNavigate();

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

  return <>{loading ? <LoadingComponent /> : <Chat />}</>;
};

export default Room;
