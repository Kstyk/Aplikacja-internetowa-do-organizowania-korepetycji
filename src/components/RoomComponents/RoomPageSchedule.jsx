import React, { useState, useEffect } from "react";
import LoadingComponent from "../LoadingComponent";
import useAxios from "../../utils/useAxios";
import RoomSchedule from "../schedules/RoomSchedule";
import dayjs from "dayjs";

const RoomPageSchedule = ({ roomId }) => {
  const [loading, setLoading] = useState();
  const [schedule, setSchedule] = useState([]);
  const [nextSchedule, setNextSchedule] = useState(null);

  const api = useAxios();
  const fetchSchedule = async () => {
    await api
      .get(`api/rooms/${roomId}/schedules/`)
      .then((res) => {
        setSchedule(res.data.schedules);
        setNextSchedule(res.data.next_schedule);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchSchedule();
  }, [roomId]);

  return (
    <div className="mt-10">
      <div className="absolute top-[70px] left-0 right-0 h-[200px] bg-base-300 "></div>
      {loading ? (
        <LoadingComponent message="Ładowanie..." />
      ) : (
        <>
          <div className="card rounded-none shadow-xl bg-white mb-5 p-4">
            <h2 className="uppercase tracking-wide text-xl font-bold text-gray-700 mb-3 border-b-[1px]">
              Najbliższe zajęcia
            </h2>
            {nextSchedule == null ? (
              <span>Brak zajęć</span>
            ) : (
              <>
                <span>
                  {dayjs(nextSchedule?.date).format(
                    "dddd, DD-MM-YYYY, g. HH:mm"
                  )}{" "}
                  -{" "}
                  <span className="font-bold">
                    {nextSchedule?.place_of_classes}
                  </span>
                </span>
                <span className="font-bold uppercase">
                  {nextSchedule?.classes?.name}
                </span>
              </>
            )}
          </div>
          <RoomSchedule schedule={schedule} />
        </>
      )}
    </div>
  );
};

export default RoomPageSchedule;
