import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useAxios from "../utils/useAxios";
import { useState } from "react";
import LoadingComponent from "../components/LoadingComponent";

const HomePage = () => {
  const api = useAxios();

  const [languages, setLanguages] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchLanguages = async () => {
    setLoading(true);
    await api
      .get(`/api/classes/languages/most-popular/`)
      .then((res) => {
        setLanguages(res.data);
      })
      .catch((err) => {
        console.log(err);
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
        console.log(err);
        setLoading(false);
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
          <div className="absolute top-[70px] left-0 right-0 h-[300px] bg-base-300 "></div>
          <div className="bg-base-100 card shadow-xl h-full px-5 py-5 mt-10 rounded-none mb-10 mx-auto">
            <h1 className="text-center text-4xl max-md:text-3xl">
              Znajdź korepetytora dla siebie lub dla swojego dziecka już dziś!
            </h1>
            <div className="form form-control mt-5 w-10/12 mx-auto">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Szukaj korepetytora"
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
              Wyszukaj korepetytorów po językach:
            </h2>
            <ul className="list-none flex flex-row justify-center flex-wrap">
              {languages.map((language) => (
                <Link
                  to={`/search-classes/language/${language.slug}`}
                  params={{ languageSlug: language.slug }}
                  key={language.id}
                  className="btn no-animation font-normal bg-transparent border-t-[1px] border-b-0 border-x-0 border-base-200 text-black hover:bg-opacity-30 rounded-none flex justify-between w-1/3 max-md:w-1/2 hover:border-t-0 hover:border-b-[1px]"
                >
                  <div>{language.name}</div>
                  <div className="text-sm text-gray-400">
                    ({language.num_classes})
                  </div>
                </Link>
              ))}
            </ul>
            <h2 className="text-center text-2xl max-md:text-xl mt-10 mb-2">
              Wyszukaj korepetytorów po najpopularniejszych lokalizacjach:
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
            <div className="bg-base-300 -mx-5 flex flex-col justify-center py-5 mt-10">
              <h1 className="text-center text-3xl mb-2">
                Załóż darmowe konto już dziś!
              </h1>
              <button className="btn bg-white mx-auto rounded-none hover:bg-base-100">
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
