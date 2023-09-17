import React, { useState, useEffect } from "react";
import useAxios from "../utils/useAxios";
import { useParams, useNavigate } from "react-router-dom";
import LoadingComponent from "../components/LoadingComponent";
import guest from "../assets/guest.png";
import { AiOutlinePhone, AiOutlineMail, AiOutlineHome } from "react-icons/ai";
import { MdOutlineLocationOn } from "react-icons/md";
import parse from "html-react-parser";
import { Link } from "react-router-dom";
import OpinionCard from "../components/ClassesComponents/OpinionCard";
import showAlertError from "../components/messages/SwalAlertError";

const TeacherPage = () => {
  const { teacherId } = useParams();
  const api = useAxios();
  const nav = useNavigate();

  const [profile, setProfile] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [opinions, setOpinions] = useState([]);
  const [hasMoreOpinions, setHasMoreOpinions] = useState(false);
  const [opinionPage, setOpinionPage] = useState(1);
  const [averageRating, setAverageRating] = useState(null);
  const [amountOfOpinions, setAmountOfOpinions] = useState(0);

  const fetchProfile = async () => {
    await api
      .get(`/api/users/profile/${teacherId}`)
      .then((res) => {
        if (res.data.user.role.label != "Teacher") {
          nav(-1);
          return;
        } else {
          setProfile(res.data);
        }
      })
      .catch((err) => {
        showAlertError(
          "Błąd",
          "Wystąpił błąd przy pobieraniu danych z serwera."
        );
      });
  };

  const fetchClassesTeacher = async () => {
    let baseurl = `/api/classes/?page_size=10&page=1&teacher=${teacherId}`;

    await api
      .get(baseurl)
      .then((res) => {
        setClasses(res.data.classes);
      })
      .catch((err) => {
        showAlertError(
          "Błąd",
          "Wystąpił błąd przy pobieraniu danych z serwera."
        );
      });
  };

  const fetchOpinions = async () => {
    await api
      .get(`/api/classes/${profile?.user?.id}/opinions?page_size=10`)
      .then((res) => {
        setLoading(false);
        setOpinions(res.data.results);
        setHasMoreOpinions(res.data.next !== null);
        setOpinionPage(opinionPage + 1);
        setAverageRating(res.data.average_rating);
        setAmountOfOpinions(res.data.count);
      })
      .catch((err) => {
        showAlertError(
          "Błąd",
          "Wystąpił błąd przy pobieraniu danych z serwera."
        );
        setLoading(false);
      });
  };

  const loadMoreOpinions = async () => {
    await api
      .get(
        `/api/classes/${profile?.user?.id}/opinions?page=${opinionPage}&page_size=10`
      )
      .then((res) => {
        setLoading(false);
        setOpinions((prev) => prev.concat(res.data.results));
        setHasMoreOpinions(res.data.next !== null);
        setOpinionPage(opinionPage + 1);
      })
      .catch((err) => {
        showAlertError(
          "Błąd",
          "Wystąpił błąd przy pobieraniu danych z serwera."
        );
        setLoading(false);
      });
  };

  const fetchAll = async () => {
    setLoading(true);
    await fetchProfile();
    await fetchClassesTeacher();
  };

  useEffect(() => {
    if (profile != null) {
      fetchOpinions();
    }
  }, [profile]);

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <>
      {loading ? (
        <LoadingComponent message="Ładowanie informacji o nauczycielu..." />
      ) : (
        <section className="mt-10 w-full max-phone:px-3 mb-10">
          <div className="absolute top-[70px] left-0 right-0 h-[500px] bg-base-300"></div>
          <div className="md:text-2xl max-md:text-xl max-phone:text-lg card bg-white rounded-none mb-5 text-center p-4 border-[1px] border-base-200 flex flex-row justify-between items-center z-30 shadow-xl">
            <h1 className="text-center w-full">
              {profile?.user?.first_name} {profile?.user?.last_name}
            </h1>
          </div>
          <div className="flex md:flex-row md:gap-x-2 max-md:flex-col ">
            <div className="card  border-[1px] border-base-200 py-4 rounded-none shadow-xl bg-white md:w-full max-md:w-full flex phone:flex-row max-phone:flex-col ">
              <div className="profile max-phone:pr-6 phone:pr-3 ml-3 w-4/12 sm:w-3/12 max-phone:w-full border-r-[1px] border-base-300 flex flex-col justify-start items-center max-phone:order-1">
                <div className="avatar">
                  <div className="w-20 rounded-full hover:ring ring-primary ring-offset-base-100 ring-offset-2 transition-all duration-200">
                    <img
                      src={
                        profile?.profile_image == null
                          ? guest
                          : `${profile?.profile_image}`
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
                    {profile?.phone_number && (
                      <li className="flex flex-row items-center gap-x-5">
                        <AiOutlinePhone className="w-6 h-6 text-base-400" />
                        <span className="text-sm">{profile?.phone_number}</span>
                      </li>
                    )}
                    <li className="flex flex-row items-center gap-x-5 flex-wrap">
                      <AiOutlineMail className="w-6 h-6 text-base-400" />
                      <span className="text-sm">{profile?.user?.email}</span>
                    </li>
                  </ul>
                  {profile?.place_of_classes && (
                    <>
                      <div className="border-b-[1px] border-base-100 my-4"></div>
                      <h3 className="text-sm mb-1">
                        Sposób prowadzenia zajęć:
                      </h3>
                      <ul className="w-full">
                        {profile?.place_of_classes.map((place, i) => (
                          <li
                            key={i}
                            className="flex flex-row items-center gap-x-5"
                          >
                            <MdOutlineLocationOn className="w-6 h-6 text-base-400" />
                            <span className="text-sm">
                              {place == "stationary" && "Stacjonarnie"}
                              {place == "online" && "Online"}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  <div className="border-b-[1px] border-base-100 my-4"></div>
                  {profile?.cities_of_work && (
                    <>
                      <h3 className="text-sm mb-1">
                        Miasta prowadzenia zajęć:
                      </h3>
                      <ul className="w-full">
                        {profile?.cities_of_work.map((city, i) => (
                          <li
                            key={i}
                            className="flex flex-row items-center gap-x-5"
                          >
                            <MdOutlineLocationOn className="w-6 h-6 text-base-400" />
                            <span className="text-sm">{city.name}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  <div className="border-b-[1px] border-base-100 my-4"></div>
                  {profile?.address != null && (
                    <div className="text-sm">
                      <h4 className="flex flex-row items-center gap-x-5">
                        <AiOutlineHome className="w-6 h-6 text-base-400" />
                        <span>Adres zamieszkania:</span>
                      </h4>
                      <div className="border-b-[1px] border-base-100 my-2"></div>

                      <section className="pl-5 gap-y-2 flex flex-col">
                        <div>
                          {profile?.address?.postal_code},{" "}
                          {profile?.address?.city?.name}
                        </div>
                        <div>
                          ul. {profile?.address?.street},{" "}
                          {profile?.address?.building_number}
                        </div>
                        <div>
                          {profile?.address?.voivodeship?.alternate_names}
                        </div>
                      </section>
                    </div>
                  )}
                  <div className="phone:hidden border-b-[1px] border-base-100 my-4"></div>
                </section>
              </div>
              <div className="content w-8/12 sm:w-9/12 max-phone:w-full px-4 max-phone:order-2 max-phone:pb-3 max-phone:mb-3">
                <div className="header flex flex-col">
                  <div className="flex flex-row w-full justify-between items-center">
                    <h1 className="text-3xl uppercase">
                      {profile?.user.first_name} {profile?.user.last_name}
                    </h1>
                  </div>
                  <div className="border-b-[1px] border-base-100 my-2"></div>

                  <div className="text-gray-700 flex flex-row items-center gap-x-3">
                    {averageRating != null ? (
                      <>
                        <div className="rating rating-sm phone:rating-md">
                          {Array.from({ length: 5 }, (_, index) => (
                            <input
                              key={index}
                              type="radio"
                              name={`average__rate`}
                              className="mask mask-star-2 bg-base-400"
                              checked={
                                Math.floor(averageRating) == index + 1
                                  ? true
                                  : false
                              }
                              readOnly
                            />
                          ))}
                        </div>
                        <span className="phone:text-xl sm:text-2xl">
                          {averageRating}/5
                        </span>
                        <span className="flex flex-row items-center">
                          ({amountOfOpinions} opinii)
                        </span>
                      </>
                    ) : (
                      <span className="text-sm">Brak wystawionych opinii</span>
                    )}
                  </div>
                </div>
                <div className="border-b-2 border-base-100 my-2"></div>
                <section className="flex flex-col gap-y-5">
                  <article className="describe !break-words">
                    <h2 className="block uppercase tracking-wide text-gray-700 text-lg font-bold border-b-[1px] border-base-100 mb-2">
                      O mnie
                    </h2>
                    {profile?.description == "" ||
                    profile?.description == null ? (
                      <p className="pl-2">Brak opisu.</p>
                    ) : (
                      <div className="pl-2">
                        {parse("" + profile?.description + "")}
                      </div>
                    )}
                  </article>
                  <article className="experience">
                    <h2 className="block uppercase tracking-wide text-gray-700 text-lg font-bold border-b-[1px] border-base-100 mb-2">
                      Doświadczenie
                    </h2>
                    {profile?.experience == "" ||
                    profile?.experience == null ? (
                      <p className="pl-2">Brak określonego doświadczenia.</p>
                    ) : (
                      <div className="pl-2">
                        {parse("" + profile?.experience + "")}
                      </div>
                    )}
                  </article>
                  <article className="known-languages">
                    <h2 className="block uppercase tracking-wide text-gray-700 text-lg font-bold border-b-[1px] border-base-100 mb-2">
                      Znane języki
                    </h2>
                    {profile?.known_languages.length == 0 && (
                      <p className="pl-2">Brak określonych języków</p>
                    )}
                    <ul className="pl-2">
                      {profile?.known_languages.map((language, i) => (
                        <li
                          className="hover:bg-base-100 transition-all duration-150 ease-linear p-2 border-b-[1px]  border-base-300 mb-2"
                          key={i}
                        >
                          <Link
                            to={`/search-classes/language/${language?.slug}`}
                            params={{ languageSlug: language?.slug }}
                          >
                            {language?.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </article>
                  <article className="classes">
                    <h2 className="block uppercase tracking-wide text-gray-700 text-lg font-bold border-b-[1px] border-base-100 mb-2">
                      Prowadzone zajęcia
                    </h2>
                    {profile?.classes?.length == 0 && (
                      <p className="pl-2">Brak zajęć</p>
                    )}
                    <ul className="pl-2">
                      {classes?.map((classTeacher, i) => (
                        <li
                          className="hover:bg-base-100 transition-all duration-150 ease-linear p-2 border-b-[1px]  border-base-300 mb-2 flex flex-row items-center gap-x-2"
                          key={i}
                        >
                          <Link
                            to={`/classes/${classTeacher?.id}`}
                            className="w-6/12"
                            params={{
                              classesId: classTeacher?.id,
                            }}
                          >
                            {classTeacher?.name}
                          </Link>
                          <span className="w-3/12">
                            {classTeacher?.price_for_lesson} zł /{" "}
                            <span className="text-gray-400">60 min</span>
                          </span>
                          <Link
                            to={`/classes/${classTeacher?.id}`}
                            params={{
                              classesId: classTeacher?.id,
                            }}
                            className="btn btn-outline no-animation h-10 py-0 !min-h-0 rounded-none mt-2 hover:bg-base-400 border-base-400 w-3/12"
                          >
                            Zobacz
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </article>
                </section>
              </div>
            </div>
          </div>

          {opinions?.length > 0 && (
            <div className="card border-[1px] border-base-200 p-5 rounded-none shadow-xl bg-white md:w-full max-md:w-full flex flex-col mt-2">
              <h1 className="block uppercase tracking-wide text-gray-700 text-xl font-bold border-b-[1px] border-base-100 mb-2 w-full">
                Opinie o nauczycielu
              </h1>

              {opinions?.map((opinion) => (
                <OpinionCard
                  opinion={opinion}
                  key={opinion.id}
                  page={opinionPage}
                />
              ))}
              {hasMoreOpinions && (
                <div className="px-5 max-phone:px-0">
                  <button
                    className={`btn btn-outline no-animation h-10 py-0 !min-h-0 rounded-none mt-2 hover:bg-base-400 border-base-400 w-full md:w-4/12`}
                    onClick={() => loadMoreOpinions()}
                  >
                    Załaduj więcej...
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      )}
    </>
  );
};

export default TeacherPage;
