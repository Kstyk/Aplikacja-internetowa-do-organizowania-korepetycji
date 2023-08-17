import React, { useEffect, useState } from "react";
import useAxios from "../utils/useAxios";
import { useParams } from "react-router-dom";
import LoadingComponent from "../components/LoadingComponent";
import ClassesPageSchedule from "../components/schedules/ClassesPageSchedule";
import dayjs from "dayjs";
import { AiOutlineCalendar } from "react-icons/ai";

const BuyClassesPage = () => {
  const api = useAxios();

  const [classes, setClasses] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [showSchedule, setShowSchedule] = useState(true);

  const { classesId } = useParams();

  const fetchClasses = async () => {
    setLoading(true);
    await api
      .get(`/api/classes/${classesId}`)
      .then((res) => {
        console.log(res.data);
        setClasses(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchClasses();
  }, []);
  return (
    <>
      {loading ? (
        <LoadingComponent message="Ładowanie danych o zajęciach" />
      ) : (
        <div className="pt-10">
          <div className="absolute top-[70px] left-0 right-0 h-[200px] bg-base-300"></div>

          <div className="card shadow-sm bg-white p-5 rounded-none mb-5">
            <h1 className="text-xl">{classes?.name}</h1>
            <div className="border-b-[1px] border-base-100 my-4"></div>
            <h3>Wybrane daty zajęć:</h3>
            {selected?.map((date, i) => (
              <>
                {console.log(date)}
                <section className="flex flex-row items-center" key={i}>
                  <AiOutlineCalendar className="w-6 h-6" />
                  {dayjs(date.start).format("YYYY-MM-DD HH:mm")}
                </section>
              </>
            ))}
            <button
              onClick={() => {
                setShowSchedule((prev) => !prev);
              }}
            >
              Pokaż/Ukryj harmonogram dostępnych slotów
            </button>
            {showSchedule && (
              <div className={`animate__animated animate__fadeIn`}>
                <ClassesPageSchedule
                  classes={classes}
                  selected={selected}
                  setSelected={setSelected}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default BuyClassesPage;
