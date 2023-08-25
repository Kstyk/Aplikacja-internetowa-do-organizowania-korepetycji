import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import useAxios from "../utils/useAxios";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import LoadingComponent from "../components/LoadingComponent";
import Select from "react-select";
import ClassesCard from "../components/tutors components/ClassesCard";
import Pagination from "../components/Pagination";

const SearchClassesPage = () => {
  const { languageSlug, citySlug, searchText } = useParams();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const cityId = params.get("id");
  const api = useAxios();

  const [city, setCity] = useState(null);
  const [voivodeship, setVoivodeship] = useState(null);
  const [language, setLanguage] = useState(languageSlug);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500);

  const [classes, setClasses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [totalResults, setTotalResults] = useState();
  const [languages, setLanguages] = useState([]);
  const [cities, setCities] = useState([]);
  const [voivodeships, setVoivodeships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCity, setLoadingCity] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchText);

  const customSelectStyle = {
    control: (base) => ({
      ...base,
      boxShadow: "none",
      borderRadius: "none",
    }),
  };

  const clearFilters = () => {
    setCities([]);
    setSearchQuery([]);
    setCity(null);
    setVoivodeship(null);
    setMinPrice(0);
    setMaxPrice(500);
  };

  const fetchTutors = async () => {
    let baseurl = `/api/classes/?page_size=10&page=1`;

    if (searchQuery != null && searchQuery != "") {
      baseurl += `&search_text=${searchQuery}`;
    }

    if (languageSlug != null) {
      baseurl += `&language=${language}`;
    }

    if (citySlug != null) {
      baseurl += `&city=${cityId}`;
    }

    await api
      .get(baseurl)
      .then((res) => {
        if (res.data.classes == null) {
          setClasses(null);
          setTotalPages(0);
          setTotalResults(0);
          setCurrentPage(1);
        } else {
          setClasses(res.data.classes);
          setTotalPages(res.data.total_pages);
          setTotalResults(res.data.total_classes);
          setCurrentPage(res.data.page_number);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const searchTutors = async (page) => {
    setCurrentPage(page + 1);
    setLoading(true);

    let baseurl = `/api/classes/?page_size=10&page=${page}`;

    if (searchQuery != null && searchQuery != "") {
      baseurl += `&search_text=${searchQuery}`;
    }

    if (language != null) {
      baseurl += `&language=${
        language.slug != null ? language.slug : language
      }`;
    }

    if (voivodeship != null) {
      baseurl += `&voivodeship=${voivodeship.id}`;
    }

    if (city != null) {
      baseurl += `&city=${city.id}`;
    }

    if (minPrice != null) {
      baseurl += `&min_price=${minPrice}`;
    }

    if (maxPrice != null) {
      baseurl += `&max_price=${maxPrice}`;
    }

    await api
      .get(baseurl)
      .then((res) => {
        if (res.data.classes == null) {
          setClasses(null);
          setTotalPages(0);
          setTotalResults(0);
          setCurrentPage(1);
        } else {
          setClasses(res.data.classes);
          setTotalPages(res.data.total_pages);
          setTotalResults(res.data.total_classes);
          setCurrentPage(res.data.page_number);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    setLoading(false);
  };

  const fetchLanguages = async () => {
    await api
      .get(`/api/classes/languages`)
      .then((res) => {
        setLanguages(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchCity = async (cityId) => {
    if (cityId != null) {
      await api
        .get(`/api/users/address/city/${cityId}`)
        .then((res) => {
          setCities([...cities, res.data]);
          setCity(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const fetchCities = async (e) => {
    setLoadingCity(true);
    if (e.trim() != "") {
      await api
        .get(`/api/users/address/cities/?name=${e}`)
        .then((res) => {
          setCities(res.data);
          setLoadingCity(false);
        })
        .catch((err) => {
          console.log(err);
          setLoadingCity(false);
        });
    } else {
      setCities([]);
      setLoadingCity(false);
    }
  };

  const fetchVoivodeships = async () => {
    await api
      .get(`/api/users/address/voivodeships/`)
      .then((res) => {
        setVoivodeships(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCitySelectChange = (e) => {
    setCity(e);
    if (e != null) {
      setVoivodeship(voivodeships.find((voi) => voi.id == e.region_id && voi));
    } else setVoivodeship(null);
  };

  const handleVoivodeshipSelectChange = (e) => {
    setVoivodeship(e);
    setCity(null);
    setCities([]);
  };

  const handleLanguageSelectChange = (e) => {
    console.log(e);
    setLanguage(e);
  };

  const handleMinPrice = (e) => {
    setMinPrice(e.target.value);
  };
  const handleMaxPrice = (e) => {
    setMaxPrice(e.target.value);
  };

  const fetchingDatas = async () => {
    setLoading(true);
    await fetchVoivodeships();
    await fetchLanguages();
    await fetchCity(cityId);
    await fetchTutors();
    setLoading(false);
  };

  useEffect(() => {
    fetchingDatas();
  }, [setLoading]);

  return (
    <div>
      <div className="absolute top-[70px] left-0 right-0 h-[500px] bg-base-300 "></div>

      <div className="bg-base-100 card shadow-xl h-full px-5 py-5 mt-10 rounded-none mb-10 mx-auto">
        <div className="input-group">
          <input
            type="text"
            placeholder="Szukaj korepetycji"
            className="input input-bordered w-full !rounded-none focus:outline-none bg-white placeholder:text-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="btn btn-square bg-base-300 border-none !rounded-none"
            onClick={(e) => searchTutors(1)}
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
          </button>
        </div>

        <div className="selects mt-5 flex flex-col">
          <div className="flex flex-row max-phone:flex-col gap-x-5 justify-start">
            <Select
              className="px-0 h-10 w-4/12 max-md:w-5/12 max-phone:w-full text-gray-500 border-none shadow-none mt-2"
              menuPortalTarget={document.body}
              isClearable
              options={voivodeships}
              getOptionLabel={(option) => option.alternate_names}
              getOptionValue={(option) => option.slug}
              value={
                voivodeship != null
                  ? voivodeship
                  : city != null &&
                    voivodeships.find((voi) => voi.id == city?.region_id && voi)
              }
              placeholder={<span className="text-gray-400">Województwo</span>}
              onChange={(e) => handleVoivodeshipSelectChange(e)}
              noOptionsMessage={({ inputValue }) =>
                !inputValue ? "Brak województwa" : "Nie znaleziono"
              }
              styles={customSelectStyle}
            />
            <Select
              className="px-0 h-10 w-4/12 max-md:w-5/12 text-gray-500 border-none shadow-none mt-2"
              menuPortalTarget={document.body}
              isClearable
              options={cities}
              onInputChange={(e) => {
                fetchCities(e);
              }}
              value={city}
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.id}
              placeholder={<span className="text-gray-400">Miasto</span>}
              onChange={(e) => handleCitySelectChange(e)}
              noOptionsMessage={({ inputValue }) =>
                loadingCity
                  ? "Szukanie miast..."
                  : !inputValue
                  ? "Wpisz tekst..."
                  : "Nie znaleziono"
              }
              styles={customSelectStyle}
            />
            <Select
              className="px-0 h-10 w-4/12 max-md:w-5/12 text-gray-500 border-none shadow-none mt-2"
              menuPortalTarget={document.body}
              isClearable
              options={languages}
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.slug}
              placeholder={<span className="text-gray-400">Język</span>}
              onChange={(e) => handleLanguageSelectChange(e)}
              value={
                language != null &&
                languages.find((lang) => lang.slug == language && lang)
              }
              noOptionsMessage={({ inputValue }) =>
                !inputValue ? "Wpisz tekst..." : "Nie znaleziono"
              }
              styles={customSelectStyle}
            />
          </div>
          <div className="flex flex-row justify-between mt-3 max-[550px]:flex-col">
            <div className="w-5/12 max-[550px]:w-full">
              <label htmlFor="" className="text-[15px]">
                Cena minimalna za lekcję:{" "}
                {<span className="font-bold">{minPrice}</span>}
              </label>
              <input
                type="range"
                min={0}
                value={minPrice}
                max="500"
                className="range range-xs range-primary"
                onChange={(e) => {
                  handleMinPrice(e);
                }}
              />
            </div>
            <div className="w-5/12 max-[550px]:w-full">
              <label htmlFor="" className="text-[15px]">
                Cena maksymalna za lekcję:{" "}
                {<span className="font-bold">{maxPrice}</span>}
              </label>
              <input
                type="range"
                min={0}
                value={maxPrice}
                max="500"
                className="range range-xs range-primary"
                onChange={(e) => {
                  handleMaxPrice(e);
                }}
              />
            </div>
          </div>
          <div className="flex justify-between">
            <button
              onClick={(e) => searchTutors(1)}
              className="btn btn-outline no-animation w-3/12 max-md:w-5/12 h-10 py-0 !min-h-0 rounded-none mt-2 hover:bg-base-400 border-base-400"
            >
              Filtruj
            </button>
            <button
              onClick={(e) => clearFilters()}
              className="btn btn-outline no-animation w-3/12 max-md:w-5/12 h-10 py-0 !min-h-0 rounded-none mt-2 hover:bg-base-400 border-base-400"
            >
              Wyczyść filtry
            </button>
          </div>
        </div>
      </div>
      {loading ? (
        <div className="bg-inherit">
          <LoadingComponent message="Pobieramy dane..." />
        </div>
      ) : (
        <section className="mb-10">
          <div className="bg-base-100 card shadow-xl h-full px-5 py-5 mt-10 rounded-none mb-10 mx-auto gap-y-3">
            {classes == null && (
              <h1 className="text-lg">
                Brak wyników dopasowanych do podanych kryteriów.
              </h1>
            )}
            {classes?.map((classes) => (
              <ClassesCard key={classes.id} classes={classes} />
            ))}
          </div>
          <Pagination
            totalResults={totalResults}
            totalPages={totalPages}
            currentPage={currentPage}
            search={searchTutors}
          />
        </section>
      )}
    </div>
  );
};

export default SearchClassesPage;
