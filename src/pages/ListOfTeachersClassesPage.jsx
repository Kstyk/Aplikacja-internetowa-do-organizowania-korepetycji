import React, { useState, useEffect } from "react";
import useAxios from "../utils/useAxios";
import LoadingComponent from "../components/LoadingComponent";
import { Link } from "react-router-dom";
import { FiExternalLink, FiEdit } from "react-icons/fi";
import showAlertError from "../components/messages/SwalAlertError";

const ListOfTeachersClassesPage = () => {
  const api = useAxios();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClasses = async () => {
    await api
      .get(`/api/classes/teacher-classes/`)
      .then((res) => {
        setClasses(res.data);
      })
      .catch((err) => {
        showAlertError(
          "Błąd",
          "Wystąpił błąd podczas pobierania danych z serwera."
        );
      });
    setLoading(false);
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return (
    <div className="pt-10">
      <div className="absolute top-[70px] left-0 right-0 h-[200px] bg-base-300 max-phone:hidden"></div>
      {loading ? (
        <LoadingComponent message="Ładowanie informacji o plikach..." />
      ) : (
        <>
          <div className="bg-white card shadow-xl min-h-[40vh] px-5 py-5 rounded-md mb-10 mx-auto w-full">
            <h1 className="text-2xl text-center">Lista Twoich zajęć</h1>
            <div className="border-b-[1px] border-base-100 my-4"></div>
            <div className="container mx-auto text-gray-100 mb-10">
              <div className="flex flex-col text-xs">
                <div className="flex items-center justify-center text-left bg-transparent text-gray-700 border-b border-opacity-60 border-gray-700">
                  <div className="flex-1 px-2 py-3 sm:p-3 cursor-pointer hover:font-bold transition-all duration-300">
                    Zajęcia
                  </div>
                  <div className="hidden w-24 px-2 py-3 sm:p-3 sm:block cursor-pointer hover:font-bold transition-all duration-300 text-center">
                    Język zajęć
                  </div>
                  <div className="w-20 sm:w-24 px-2 py-3 sm:p-3 block cursor-pointer hover:font-bold transition-all duration-300 text-center">
                    Dostępne do zakupu
                  </div>
                  <div className="w-20 sm:w-24 px-2 py-3 text-center sm:p-3 block cursor-pointer hover:font-bold transition-all duration-300">
                    Podgląd
                  </div>
                  <div className="w-20 sm:w-24 px-2 py-3 text-center sm:p-3 block cursor-pointer hover:font-bold transition-all duration-300">
                    Edycja
                  </div>
                </div>
                {classes.length == 0 && (
                  <span className="text-black italic text-center mt-3">
                    Nie masz jeszcze stworzonych żadnych zajęć.
                  </span>
                )}
                {classes?.map((classes) => (
                  <div
                    key={classes?.id}
                    className={`flex border-b border-opacity-20 border-gray-700 bg-transparent text-black hover:bg-slate-100 ${
                      !classes?.able_to_buy && "text-slate-500"
                    } transition-all duration-200 `}
                  >
                    <div className="flex flex-1 items-center px-2 py-3 sm:p-3 sm:w-auto cursor-pointer sm:truncate">
                      <Link
                        className="hover:underline transition-all duration-200 sm:truncate"
                        to={`/zajecia/${classes?.id}`}
                      >
                        {classes?.name}
                      </Link>
                    </div>
                    <div className="hidden w-24 px-2 py-3 sm:p-3 sm:flex justify-center items-center text-center">
                      {classes?.language?.name}
                    </div>
                    <div className="w-20 sm:w-24 px-2 py-3 sm:p-3 flex justify-center items-center text-center">
                      {classes?.able_to_buy ? "Tak" : "Nie"}
                    </div>
                    <div className="w-20 sm:w-24 px-2 py-3 sm:p-3 flex justify-center items-center text-center">
                      <Link
                        className="hover:underline transition-all duration-200 sm:truncate"
                        to={`/zajecia/${classes?.id}`}
                      >
                        <FiExternalLink />
                      </Link>
                    </div>
                    <div className="w-20 sm:w-24 px-2 py-3 sm:p-3 flex justify-center items-center text-center">
                      <Link
                        className="hover:underline transition-all duration-200 sm:truncate"
                        to={`/zajecia/edytuj`}
                        state={{ classes: classes }}
                      >
                        <FiEdit />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>{" "}
          </div>
        </>
      )}
    </div>
  );
};

export default ListOfTeachersClassesPage;
