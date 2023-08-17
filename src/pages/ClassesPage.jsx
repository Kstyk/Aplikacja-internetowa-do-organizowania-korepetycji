import React, { useEffect } from "react";
import useAxios from "../utils/useAxios";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import ClassesPageSchedule from "../components/schedules/ClassesPageSchedule";
import LoadingComponent from "../components/LoadingComponent";
import SelectSlotsTeacherSchedule from "../components/schedules/SelectSlotsTeacherSchedule";
import guest from "../assets/guest.png";
import { AiOutlinePhone, AiOutlineMail } from "react-icons/ai";
import { MdOutlineLocationOn } from "react-icons/md";
import parse from "html-react-parser";

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
    <>
      {loading ? (
        <LoadingComponent message="Ładowanie informacji o zajęciach..." />
      ) : (
        <section className="mt-10 w-full max-phone:px-3 mb-10">
          <div className="absolute top-[70px] left-0 right-0 h-[500px] bg-base-300"></div>

          <div className="md:text-2xl max-md:text-xl max-phone:text-lg card bg-white rounded-none mb-5 text-center p-4 border-[1px] border-base-200 flex flex-row justify-between items-center z-30">
            <h1 className="text-center w-full">{classes?.name}</h1>
            <Link
              className={`btn btn-outline no-animation h-10 py-0 !min-h-0 rounded-none mt-2 hover:bg-base-400 border-base-400 w-2/12 ${
                classes?.able_to_buy ? "" : "btn-disabled"
              }`}
              to={`/classes/${classes?.id}/buy`}
            >
              Zakup zajęcia
            </Link>
          </div>

          <div className="flex md:flex-row md:gap-x-2 max-md:flex-col">
            <div className="card  border-[1px] border-base-200 py-4 rounded-none bg-white md:w-9/12 max-md:w-full flex phone:flex-row max-phone:flex-col ">
              <div className="profile max-phone:pr-6 phone:pr-3 ml-3 w-4/12 max-phone:w-full border-r-[1px] border-base-300 flex flex-col justify-center items-center max-phone:order-2">
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
                  {classes?.teacher?.place_of_classes && (
                    <>
                      <div className="border-b-[1px] border-base-100 my-4"></div>
                      <h3 className="text-sm mb-1">
                        Sposób prowadzenia zajęć:
                      </h3>
                      <ul className="w-full">
                        {classes?.teacher?.place_of_classes.map((place, i) => (
                          <li
                            key={i}
                            className="flex flex-row items-center gap-x-5"
                          >
                            <MdOutlineLocationOn className="w-6 h-6 text-base-400" />
                            <span className="text-sm">
                              {place == "teacher_home" && "U nauczyciela"}
                              {place == "student_home" && "U ucznia"}
                              {place == "online" && "Online"}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  <div className="border-b-[1px] border-base-100 my-4"></div>
                  <ul className="w-full">
                    {classes?.teacher?.cities_of_work.map((city, i) => (
                      <li
                        key={i}
                        className="flex flex-row items-center gap-x-5"
                      >
                        <MdOutlineLocationOn className="w-6 h-6 text-base-400" />
                        <span className="text-sm">{city.name}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="phone:hidden border-b-[1px] border-base-100 my-4"></div>
                </section>
              </div>
              <div className="content w-9/12 max-phone:w-full px-4 max-phone:order-1 max-phone:border-b-[1px] max-phone:border-base-200 max-phone:pb-3 max-phone:mb-3">
                <div className="header flex flex-row">
                  <div className="left w-8/12">
                    <Link
                      to={`/search-classes/language/${classes?.language.slug}`}
                      params={{ languageSlug: classes?.language.slug }}
                      className="text-gray-400 upper hover:underline"
                    >
                      Język {classes?.language.name}
                    </Link>
                    <h1 className="text-3xl uppercase">
                      {classes?.teacher?.user.first_name}{" "}
                      {classes?.teacher?.user.last_name}
                    </h1>
                  </div>
                  <div className="right w-4/12  flex items-center justify-end">
                    <span>
                      <span className="font-bold">
                        {classes?.price_for_lesson} PLN
                      </span>
                      <br /> za godzinę
                    </span>
                  </div>
                </div>
                <div className="border-b-[1px] border-base-100 my-4"></div>
                <article className="describe">
                  {parse("" + classes?.description + "")}
                </article>
              </div>
            </div>
            <div className="card border-[1px] border-base-200 p-4 rounded-none bg-white md:w-3/12 gap-y-5 max-md:w-full">
              <div>
                <h2 className="text-lg border-b-2 border-base-200">
                  O nuaczycielu
                </h2>
                <div className="text-sm pt-2">
                  {classes?.teacher?.description
                    ? parse("" + classes?.teacher?.description + "")
                    : "Brak opisu nauczyciela."}
                </div>
              </div>
              <div>
                <h2 className="text-lg border-b-2 border-base-200">
                  Doświadczenie nauczyciela
                </h2>
                <div className="text-sm pt-2">
                  {classes?.teacher?.experience
                    ? parse("" + classes?.teacher?.experience + "")
                    : "Brak podanego doświadczenia nauczyciela."}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default ClassesPage;
