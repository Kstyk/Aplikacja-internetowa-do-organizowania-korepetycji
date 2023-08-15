import React, { useEffect } from "react";
import useAxios from "../utils/useAxios";
import { useState } from "react";
import { useParams } from "react-router-dom";
import ClassesPageSchedule from "../components/schedules/ClassesPageSchedule";
import LoadingComponent from "../components/LoadingComponent";
import SelectSlotsTeacherSchedule from "../components/schedules/SelectSlotsTeacherSchedule";
import guest from "../assets/guest.png";
import { AiOutlinePhone, AiOutlineMail } from "react-icons/ai";
import { MdOutlineLocationOn } from "react-icons/md";

const ClassesPage = () => {
  const api = useAxios();

  const [classes, setClasses] = useState(null);
  const [loading, setLoading] = useState(false);
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
    <section className="mt-10">
      <div className="absolute top-[70px] left-0 right-0 h-[500px] bg-base-300 "></div>

      <h1 className="text-2xl card bg-white rounded-none mb-5 text-center p-4 border-[1px] border-base-200">
        {classes?.name}
      </h1>
      <div className="flex flex-row gap-x-2">
        <div className="card border-[1px] border-base-200 py-4 rounded-none bg-white w-9/12 flex flex-row">
          <div className="profile ml-3 pr-3 w-4/12 border-r-[1px] border-base-300 flex flex-col justify-center items-center">
            <div className="avatar">
              <div className="w-20 rounded-full">
                <img
                  src={
                    classes?.teacher?.profile_image == null
                      ? guest
                      : `${classes?.teacher?.profile_image}`
                  }
                />
              </div>
            </div>
            <button
              className="btn btn-outline no-animation h-10 py-0 !min-h-0 rounded-none mt-2 hover:bg-base-400 border-base-400 w-full"
              onClick={() => setIsModalSendMessageOpen((prev) => !prev)}
              onClickCapture={() =>
                window.open(
                  "mailto:email@example.com?subject=Subject&body=Body%20goes%20here"
                )
              }
            >
              Wyślij wiadomość
            </button>

            <section className="infos flex flex-col w-full pt-4">
              <div className="border-b-[1px] border-base-100 mb-4"></div>
              <ul className="w-full">
                {classes?.teacher?.phone_number && (
                  <li className="flex flex-row items-center gap-x-5">
                    <AiOutlinePhone className="w-6 h-6 text-base-400" />
                    <span className="text-sm">
                      {classes?.teacher?.phone_number}
                    </span>
                  </li>
                )}
                <li className="flex flex-row items-center gap-x-5 flex-wrap">
                  <AiOutlineMail className="w-6 h-6 text-base-400" />
                  <span className="text-sm">
                    {classes?.teacher?.user?.email}
                  </span>
                </li>
              </ul>
              <div className="border-b-[1px] border-base-100 my-4"></div>
              <ul className="w-full">
                {classes?.teacher?.cities_of_work.map((city) => (
                  <li className="flex flex-row items-center gap-x-5">
                    <MdOutlineLocationOn className="w-6 h-6 text-base-400" />
                    <span className="text-sm">{city.name}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
          <div className="content w-9/12"></div>
        </div>
        <div className="card border-[1px] border-base-200 p-4 rounded-none bg-white w-3/12"></div>
      </div>
    </section>
  );
};

export default ClassesPage;
