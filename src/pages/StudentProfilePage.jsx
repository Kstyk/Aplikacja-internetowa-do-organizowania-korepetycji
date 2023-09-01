import React, { useContext, useState, useEffect } from "react";
import useAxios from "../utils/useAxios";
import AuthContext from "../context/AuthContext";
import guest from "../assets/guest.png";
import LoadingComponent from "../components/LoadingComponent";
import {
  AiOutlinePhone,
  AiOutlineMail,
  AiOutlineMan,
  AiOutlineWoman,
  AiOutlineCalendar,
} from "react-icons/ai";

const StudentProfilePage = () => {
  const api = useAxios();
  const { user } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    setLoading(true);
    await api
      .get(`/api/users/profile/${user?.user_id}`)
      .then((res) => {
        setProfile(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <>
      {loading ? (
        <LoadingComponent message="Ładowanie informacji o nauczycielu..." />
      ) : (
        <section className="mt-10 w-6/12 max-md:w-10/12 max-phone:w-full max-phone:px-3 mb-10 mx-auto">
          <div className="absolute top-[70px] left-0 right-0 h-[500px] bg-base-300"></div>
          <div className="md:text-2xl max-md:text-xl max-phone:text-lg card bg-white rounded-none mb-5 text-center p-4 border-[1px] border-base-200 flex flex-row justify-between items-center z-30 shadow-xl">
            <h1 className="text-center w-full">
              {profile?.user?.first_name} {profile?.user?.last_name}
            </h1>
          </div>
          <div className="card  border-[1px] border-base-200 py-4 rounded-none bg-white md:w-full max-md:w-full flex items-center justify-center shadow-xl">
            <div className="avatar flex justify-center">
              <div className="w-5/12 max-md:w-8/12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img
                  src={
                    profile?.profile_image == null
                      ? guest
                      : `${profile?.profile_image}`
                  }
                />
              </div>
            </div>

            <div className="profile mt-10 w-full flex flex-col items-center justify-center gap-y-5">
              <div className="border-b-[1px] border-base-100 mb-2 w-full"></div>
              <section className="w-6/12 max-phone:w-full flex justify-center max-phone:justify-start max-phone:items-start flex-col items-center">
                <div className="contact">
                  <label className="block uppercase tracking-wide text-gray-700 text-lg font-bold">
                    Dane kontaktowe
                  </label>
                </div>
                <div className="flex flex-row w-full justify-center gap-x-3">
                  <AiOutlineMail className="w-6 h-6 text-base-400" />

                  {profile?.user?.email}
                </div>
                <div className="flex flex-row w-full justify-center gap-x-3">
                  <AiOutlinePhone className="w-6 h-6 text-base-400" />
                  {profile?.phone_number == null
                    ? "Nie podano"
                    : profile?.phone_number}
                </div>
              </section>
              {profile?.address != null && (
                <div className="contact flex justify-center flex-col w-full">
                  <label className="block uppercase tracking-wide text-gray-700 text-lg font-bold text-center">
                    Adres
                  </label>
                  <div className="flex flex-row w-full justify-center gap-x-5">
                    <div className="data w-9/12 flex justify-center text-center">
                      {profile?.address?.postal_code}{" "}
                      {profile?.address?.city.name}
                      {profile?.address?.street != null
                        ? `, ulica ${profile?.address?.street}`
                        : ""}{" "}
                      {profile?.address?.building_number != null
                        ? profile?.address?.building_number
                        : ""}
                      <br />
                      {profile?.address?.voivodeship?.alternate_names}
                    </div>
                  </div>
                </div>
              )}

              {profile?.sex != null && (
                <div className="sex flex justify-center flex-col items-center w-full">
                  <label className="block uppercase tracking-wide text-gray-700 text-lg font-bold text-center">
                    Płeć
                  </label>
                  <div className="data w-9/12 flex flex-row justify-center text-center">
                    {profile?.sex == "kobieta" ? (
                      <section className="flex gap-x-3">
                        {" "}
                        <AiOutlineWoman className="w-6 h-6 text-base-400" />
                        <span>Kobieta</span>
                      </section>
                    ) : (
                      <section className="flex gap-x-3">
                        {" "}
                        <AiOutlineMan className="w-6 h-6 text-base-400" />
                        <span>Mężczyzna</span>
                      </section>
                    )}
                  </div>
                </div>
              )}

              {profile?.year_of_birth != null && (
                <div className="sex flex justify-center flex-col items-center w-full">
                  <label className="block uppercase tracking-wide text-gray-700 text-lg font-bold text-center">
                    Rok urodzenia
                  </label>
                  <div className="data w-9/12 flex flex-row justify-center text-center">
                    <section className="flex gap-x-3">
                      {" "}
                      <AiOutlineCalendar className="w-6 h-6 text-base-400" />
                      <span>{profile?.year_of_birth}</span>
                    </section>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default StudentProfilePage;
