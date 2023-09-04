import React, { useState, useEffect, useContext } from "react";
import useAxios from "../utils/useAxios";
import { useParams } from "react-router-dom";
import LoadingComponent from "../components/LoadingComponent";
import guest from "../assets/guest.png";
import { AiOutlinePhone, AiOutlineMail, AiOutlineHome } from "react-icons/ai";
import { MdOutlineLocationOn } from "react-icons/md";
import parse from "html-react-parser";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const api = useAxios();

  const [profile, setProfile] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    await api
      .get(`/api/users/profile/${user?.user_id}`)
      .then((res) => {
        setProfile(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchClassesTeacher = async () => {
    let baseurl = `/api/classes/?page_size=10&page=1&teacher=${user?.user_id}`;

    await api
      .get(baseurl)
      .then((res) => {
        setClasses(res.data.classes);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchAll = async () => {
    setLoading(true);
    await fetchClassesTeacher();
    await fetchProfile();
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <>
      {loading ? (
        <LoadingComponent message="Ładowanie informacji o nauczycielu..." />
      ) : (
        <section className="mt-10 w-full max-phone:px-3 mb-10 shadow-xl">
          <div className="absolute top-[70px] left-0 right-0 h-[500px] bg-base-300"></div>
          <div className="md:text-2xl max-md:text-xl max-phone:text-lg card bg-white rounded-none mb-5 text-center p-4 border-[1px] border-base-200 flex flex-row justify-between items-center z-30">
            <h1 className="text-center w-full">
              {profile?.user?.first_name} {profile?.user?.last_name}
            </h1>
          </div>
          <div className="flex md:flex-row md:gap-x-2 max-md:flex-col">
            <div className="card  border-[1px] border-base-200 pt-5 pb-5 phone:pb-10 rounded-none bg-white md:w-full max-md:w-full flex phone:flex-row max-phone:flex-col ">
              <div className="profile max-phone:pr-6 phone:pr-3 ml-3 w-4/12 max-phone:w-full border-r-[1px] border-base-300 flex flex-col justify-start items-center max-phone:order-1">
                <div className="avatar">
                  <div className="w-20 rounded-full">
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
                        {profile?.place_of_classes == null ||
                          (profile?.place_of_classes?.length == 0 && (
                            <span className="text-xs">Nie określono.</span>
                          ))}
                        {profile?.place_of_classes?.map((place, i) => (
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
                  {profile?.cities_of_work?.length > 0 && (
                    <>
                      <div className="border-b-[1px] border-base-100 my-4"></div>
                      <ul className="w-full">
                        {profile?.cities_of_work?.map((city, i) => (
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
                  {profile?.address != null && (
                    <>
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
                    </>
                  )}
                  <div className="phone:hidden border-b-[1px] border-base-100 my-4"></div>
                </section>
              </div>
              <div className="content w-full max-phone:w-full px-4 max-phone:order-2 max-phone:pb-3 max-phone:mb-3">
                <div className="header flex flex-row">
                  <div className="left w-8/12">
                    <h1 className="text-3xl uppercase">
                      {profile?.user.first_name} {profile?.user.last_name}
                    </h1>
                  </div>
                </div>
                <div className="border-b-2 border-base-100 my-4"></div>
                <section className="flex flex-col gap-y-5">
                  <article className="describe">
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
                  <article className="known-languages">
                    <h2 className="block uppercase tracking-wide text-gray-700 text-lg font-bold border-b-[1px] border-base-100 mb-2">
                      Prowadzone zajęcia
                    </h2>
                    {profile?.classes?.length == 0 ||
                      (profile?.classes == null && (
                        <p className="pl-2">Brak zajęć</p>
                      ))}
                    <ul className="pl-2">
                      {profile?.classes?.map((classTeacher, i) => (
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
        </section>
      )}
    </>
  );
};

export default ProfilePage;
