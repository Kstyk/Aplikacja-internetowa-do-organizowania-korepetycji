import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import useAxios from "../utils/useAxios";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import LoadingComponent from "../components/LoadingComponent";

const SearchClassesPage = () => {
  const { languageSlug, citySlug, searchText } = useParams();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const cityId = params.get("id");

  const api = useAxios();

  const [tutors, setTutors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [totalResults, setTotalResults] = useState();
  const [cities, setCities] = useState([]);
  const [voivodeships, setVoivodeships] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTutors = async () => {
    let baseurl = `/api/classes/?page_size=10&page=1`;
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
        console.log(res);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const fetchCities = async () => {
    console.log(searchText);
    setLoading(true);
    await api
      .get(`/api/users/address/cities/`)
      .then((res) => {
        setCities(res.data);
      })
      .catch((err) => console.log(err));
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

  useEffect(() => {
    fetchCities();
    fetchVoivodeships();
    fetchTutors();
  }, []);

  return (
    <div>
      <div className="absolute top-[70px] left-0 right-0 h-[500px] bg-base-300 "></div>
      {loading ? (
        <div className="bg-inherit">
          <LoadingComponent message="Pobieramy dane..." />
        </div>
      ) : (
        <div className="bg-base-100 card shadow-xl h-full px-5 py-5 mt-10 rounded-none mb-10 mx-auto"></div>
      )}
    </div>
  );
};

export default SearchClassesPage;
