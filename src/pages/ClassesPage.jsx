import React, { useEffect } from "react";
import useAxios from "../utils/useAxios";
import { useState } from "react";
import { useParams } from "react-router-dom";
import ClassesPageSchedule from "../components/schedules/ClassesPageSchedule";
import LoadingComponent from "../components/LoadingComponent";
import SelectSlotsTeacherSchedule from "../components/schedules/SelectSlotsTeacherSchedule";
import guest from "../assets/guest.png";
import { AiOutlineClose } from "react-icons/ai";

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
          <div className="profile ml-3 pr-3 w-3/12 border-r-[1px] border-base-300 flex flex-col justify-center items-center">
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
            <label
              className="btn btn-outline no-animation h-10 py-0 !min-h-0 rounded-none mt-2 hover:bg-base-400 border-base-400"
              onClick={() => setIsModalSendMessageOpen((prev) => !prev)}
              htmlFor="sendMessage"
            >
              Wyślij wiadomość
            </label>
            <input type="checkbox" id="sendMessage" className="modal-toggle" />
            <div className="modal ">
              <div className="modal-box !rounded-none">
                <h3 className="text-xl  text-center mb-5">
                  Wyślij wiadomość do:{" "}
                  <span className="underline">
                    {classes?.teacher?.user?.first_name}{" "}
                    {classes?.teacher?.user?.last_name}
                  </span>
                </h3>
                <form action="" className="flex flex-col gap-y-2">
                  <input
                    type="email"
                    placeholder="Twój email"
                    className="input input-bordered w-full !rounded-none focus:outline-none bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Temat"
                    className="input input-bordered w-full !rounded-none focus:outline-none bg-white"
                  />
                  <textarea
                    name=""
                    id=""
                    rows="10"
                    className="w-full border-[1px] border-slate-300 focus:outline-none px-5"
                  ></textarea>
                  <button className="btn btn-outline no-animation h-10 py-0 !min-h-0 rounded-none mt-2 hover:bg-base-400 border-base-400">
                    Wyślij
                  </button>
                </form>
              </div>
              <label className="modal-backdrop" htmlFor="sendMessage">
                Close
              </label>
            </div>
          </div>
          <div className="content w-9/12"></div>
        </div>
        <div className="card border-[1px] border-base-200 p-4 rounded-none bg-white w-3/12"></div>
      </div>
    </section>
  );
};

export default ClassesPage;
