import React, { useEffect, useState } from "react";
import useAxios from "../utils/useAxios";
import { useParams } from "react-router-dom";
import LoadingComponent from "../components/LoadingComponent";
import ClassesPageSchedule from "../components/schedules/ClassesPageSchedule";
import dayjs from "dayjs";
import { AiOutlineCalendar } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const BuyClassesPage = () => {
  const api = useAxios();
  const nav = useNavigate();

  const [classes, setClasses] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [showSchedule, setShowSchedule] = useState(true);
  const [placeOfClasses, setPlaceOfClasses] = useState("online");

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

  const handleChangePlace = (e) => {
    setPlaceOfClasses(e.target.value);
  };

  const purchaseClasses = async () => {
    let selected_slots = [];
    selected.map((selected) =>
      selected_slots.push(dayjs(selected.start).format("YYYY-MM-DDThh:mm:ss"))
    );
    const data = {
      selected_slots: selected_slots,
      classes_id: classesId,
      place_of_classes: placeOfClasses,
    };

    await api
      .post(`/api/classes/purchase_classes/`, data)
      .then((res) => {
        console.log(res.data);
        const swalWithTailwindClasses = Swal.mixin({
          customClass: {
            confirmButton: "btn btn-success",
          },
          buttonsStyling: false,
        });

        swalWithTailwindClasses
          .fire({
            icon: "success",
            title: "Udany zakup",
            text: "Udało ci się zakupić zajęcia! Teraz zostaniesz przekierowany do pokoju zajęć.",
            customClass: {
              confirmButton:
                "btn btn-outline rounded-none outline-none border-[1px] text-black w-full",
              popup: "rounded-none bg-base-100",
            },
          })
          .then(() => {
            let roomid = res.data.room.room_id;

            nav(`/rooms/${roomid}`);
          });
      })
      .catch((err) => {
        console.log(err);
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
            <section className="flex flex-row max-lg:flex-col">
              <div className="card shadow-md rounded-none p-4 flex flex-row justify-between max-phone:flex-col w-6/12 max-lg:w-full">
                <div className="max-phone:order-2">
                  <h3 className="font-bold mb-2">Wybrane daty zajęć:</h3>
                  {selected.length == 0 && (
                    <section className="flex flex-row items-center gap-x-3">
                      <AiOutlineCalendar className="w-6 h-6" />
                      <span className="italic">Brak wybranych zajęć.</span>
                    </section>
                  )}
                  {selected?.map((date, i) => (
                    <>
                      {console.log(date)}
                      <section
                        className="flex flex-row items-center gap-x-3"
                        key={i}
                      >
                        <AiOutlineCalendar className="w-6 h-6" />
                        {dayjs(date.start).format("YYYY-MM-DD HH:mm")}
                      </section>
                    </>
                  ))}
                </div>
                <div className="max-phone:order-1 max-phone:mb-3">
                  <h3 className="font-bold mb-2">Wybierz miejsce zajęć:</h3>

                  {classes?.teacher?.place_of_classes.map((place) => (
                    <div className="form-control" key={place}>
                      <label className="label cursor-pointer gap-x-4">
                        <input
                          type="radio"
                          name="radio-10"
                          className="radio checked:bg-base-400"
                          value={place}
                          onClick={(e) => handleChangePlace(e)}
                          defaultChecked={place == "online"}
                        />
                        <span className="label-text">
                          {place == "teacher_home" && "U nauczyciela"}
                          {place == "student_home" && "U studenta"}
                          {place == "online" && "Online"}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card shadow-md rounded-none p-4 flex flex-col max-phone:flex-col w-6/12 max-lg:w-full">
                <h2 className="font-bold text-lg text-right">Podsumowanie</h2>
                <div className=" w-full text-right">
                  Do zapłaty:
                  <br />
                  {selected.length} x{" "}
                  <span className="font-bold text-lg">
                    {classes?.price_for_lesson} PLN
                  </span>
                  <hr />
                  <span className="font-bold text-xl">
                    {classes?.price_for_lesson * selected.length} PLN
                  </span>
                </div>
                <div className="w-full flex justify-end">
                  <button
                    onClick={() => purchaseClasses()}
                    className="btn btn-outline no-animation h-12 py-0 !min-h-0 rounded-none mt-2 hover:bg-base-400 border-base-400 w-full md:w-6/12 lg:w-3/12 mb-2"
                  >
                    Finalizuj zakup
                  </button>
                </div>
              </div>
            </section>
            <section className="w-full flex justify-end">
              <button
                className="btn btn-outline no-animation h-12 py-0 !min-h-0 rounded-none mt-2 hover:bg-base-400 border-base-400 w-full md:w-6/12 lg:w-4/12 mb-2"
                onClick={() => {
                  setShowSchedule((prev) => !prev);
                }}
              >
                Pokaż/Ukryj harmonogram dostępnych slotów
              </button>
            </section>
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
