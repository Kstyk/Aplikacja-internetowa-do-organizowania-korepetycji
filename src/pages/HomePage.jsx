import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useAxios from "../utils/useAxios";
import { useState } from "react";
import LoadingComponent from "../components/LoadingComponent";
import books from "../assets/books.jpg";
import showAlertError from "../components/messages/SwalAlertError";

const HomePage = () => {
  const api = useAxios();

  const [languages, setLanguages] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchLanguages = async () => {
    setLoading(true);
    await api
      .get(`/api/classes/languages/most-popular/`)
      .then((res) => {
        setLanguages(res.data);
      })
      .catch((err) => {
        showAlertError(
          "Błąd",
          "Wystąpił błąd przy pobieraniu danych z serwera."
        );
      });
  };

  const fetchCities = async () => {
    await api
      .get(`/api/users/address/cities/most-popular/`)
      .then((res) => {
        setCities(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        showAlertError(
          "Błąd",
          "Wystąpił błąd przy pobieraniu danych z serwera."
        );
      });
  };

  useEffect(() => {
    fetchLanguages();
    fetchCities();
  }, []);

  return (
    <div>
      {loading ? (
        <div className="bg-inherit">
          <LoadingComponent message="Pobieramy dane..." />
        </div>
      ) : (
        <>
          <div className="absolute top-[70px] left-0 right-0 h-[300px] bg-base-300 max-phone:hidden"></div>

          <div className="bg-base-100 card shadow-xl h-full px-5 pt-5 mt-10 rounded-md mb-10 mx-auto">
            <div
              className="hero h-[300px] mb-10"
              style={{
                backgroundImage: `url(${books})`,
              }}
            >
              <div className="hero-overlay bg-opacity-60"></div>
              <div className="hero-content text-center text-neutral-content">
                <div className="max-w-md">
                  <h1 className="mb-5 text-5xl font-bold">Korki.PL</h1>
                  <p className="mb-5">
                    Wyszukaj zajęcia lub sam zostań korepetytorem!
                  </p>
                </div>
              </div>
            </div>
            <h1 className="text-center text-4xl max-md:text-3xl max-phone:text-2xl bg-base-200 hover:bg-opacity-80 transition-all duration-200 border-y-2 border-base-100 py-5 -mx-5 mb-10 text-gray-700 relative px-10 ">
              <div className="absolute border-8 border-base-100 h-full left-5 top-0 bg-transparent"></div>
              <div className="absolute border-2 border-base-100 h-full left-2 top-0 bg-transparent"></div>
              <div className="absolute border-8 border-base-100 h-full right-5 top-0 bg-transparent"></div>
              <div className="absolute border-2 border-base-100 h-full right-2 top-0 bg-transparent"></div>
              Znajdź korepetytora dla siebie lub dla swojego dziecka już dziś!
            </h1>
            <div className="form form-control w-10/12 mx-auto">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Szukaj zajęć"
                  className="input input-bordered w-full !rounded-none focus:outline-none bg-white"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Link
                  to={`/search-classes/text/${searchQuery}`}
                  params={{ searchText: searchQuery }}
                  type="submit"
                  className="btn btn-square bg-base-300 border-none !rounded-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </Link>
              </div>
            </div>
            <h2 className="text-center text-2xl max-md:text-xl mt-10 mb-2">
              Wyszukaj zajęcia po językach:
            </h2>
            <ul className="list-none flex flex-row justify-center flex-wrap">
              {languages.map((language) => (
                <Link
                  to={`/search-classes/language/${language.slug}`}
                  params={{ languageSlug: language.slug }}
                  key={language.id}
                  className="btn no-animation font-normal bg-transparent border-t-[1px] border-b-0 border-x-0 border-base-200 text-black hover:bg-opacity-30 rounded-sm flex justify-between w-1/3 max-md:w-1/2 hover:border-t-0 hover:border-b-[1px]"
                >
                  <div>{language.name}</div>
                  <div className="text-sm text-gray-400">
                    ({language.num_classes})
                  </div>
                </Link>
              ))}
            </ul>
            <h2 className="text-center text-2xl max-md:text-xl mt-10 mb-2">
              Wyszukaj zajęcia po najpopularniejszych lokalizacjach:
            </h2>
            <ul className="list-none flex flex-row justify-center flex-wrap">
              {cities.map((city) => (
                <Link
                  to={`/search-classes/city/${city.slug}?id=${city.id}`}
                  params={{ citySlug: city.slug }}
                  key={city.id}
                  className="btn no-animation font-normal bg-transparent border-t-[1px] border-b-0 border-x-0 border-base-200 text-black hover:bg-opacity-30 rounded-none flex justify-between w-1/3 max-md:w-1/2 hover:border-t-0 hover:border-b-[1px]"
                >
                  <div>{city.name}</div>
                  <div className="text-sm text-gray-400">
                    ({city.num_tutors})
                  </div>
                </Link>
              ))}
            </ul>
            <div className="bg-gradient-to-b from-base-100 to-base-200 -mx-5 flex flex-col justify-center py-20 mt-10 rounded-md">
              <h1 className="text-center text-3xl mb-2">
                Załóż darmowe konto już dziś!
              </h1>
              <button className="btn btn-outline no-animation w-3/12 max-md:w-5/12 max-phone:w-10/12 max-phone:mx-auto h-15 mx-auto py-0 !min-h-0 rounded-sm mt-2 hover:bg-base-400 border-base-400">
                Zarejestruj się
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
