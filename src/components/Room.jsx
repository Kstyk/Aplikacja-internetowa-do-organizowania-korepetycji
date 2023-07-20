import React, { useEffect, useState, useContext } from "react";
import Chat from "./Chat";
import { useParams } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import useAxios from "../utils/useAxios";

const Room = () => {
  const [value, setValue] = useState("1");
  const [receiver, setReceiver] = useState(null);
  const { roomId } = useParams();
  const { user, authTokens } = useContext(AuthContext);
  let api = useAxios();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const fetchReceiver = async () => {
    await api.get(`api/rooms/${roomId}`).then((res) => {
      const users = res.data.users;
      users.map((u) => (u != user.email ? setReceiver(u) : ""));
    });
  };

  useEffect(() => {
    fetchReceiver();
  }, []);

  return <Chat />;
};

export default Room;
