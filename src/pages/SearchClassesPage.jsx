import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import useAxios from "../utils/useAxios";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import LoadingComponent from "../components/LoadingComponent";
import Select from "react-select";

const SearchClassesPage = () => {
  const { languageSlug, citySlug, searchText } = useParams();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const cityId = params.get("id");
  const api = useAxios();

  const [city, setCity] = useState(null);
  const [voivodeship, setVoivodeship] = useState(null);

  const [tutors, setTutors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [totalResults, setTotalResults] = useState();
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

  const fetchTutors = async () => {
    let baseurl = `/api/classes/?page_size=10&page=1`;
    console.log(searchText);

    if (searchQuery != null && searchQuery != "") {
      baseurl += `&search_text=${searchQuery}`;
    }

    if (languageSlug != null) {
      baseurl += `&language=${languageSlug}`;
    }

    if (citySlug != null) {
      baseurl += `&city=${cityId}`;
    }

    await api
      .get(baseurl)
      .then((res) => {
        setTutors(res.data.classes);
        setTotalPages(res.data.total_pages);
        setTotalResults(res.data.total_classes);
        setCurrentPage(res.data.page_number);
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
    console.log(e);
    setCity(e);
    setVoivodeship(voivodeships.find((voi) => voi.id == e.region_id && voi));
  };

  const handleVoivodeshipSelectChange = (e) => {
    setVoivodeship(e);
    setCity(null);
    setCities([]);
  };

  const fetchingDatas = async () => {
    setLoading(true);
    await fetchVoivodeships();
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
      {loading ? (
        <div className="bg-inherit">
          <LoadingComponent message="Pobieramy dane..." />
        </div>
      ) : (
        <div className="bg-base-100 card shadow-xl h-full px-5 py-5 mt-10 rounded-none mb-10 mx-auto">
          <div className="input-group">
            <input
              type="text"
              placeholder="Szukaj korepetytora"
              className="input input-bordered w-full !rounded-none focus:outline-none bg-white placeholder:text-gray-400"
              defaultValue={searchText}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="btn btn-square bg-base-300 border-none !rounded-none"
              onClick={(e) => fetchTutors()}
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

          <div className="selects mt-5">
            <Select
              className="px-0 h-10 w-4/12 text-gray-500 border-none shadow-none"
              menuPortalTarget={document.body}
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
              className="px-0 h-10 w-4/12 text-gray-500 border-none shadow-none"
              menuPortalTarget={document.body}
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
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchClassesPage;
