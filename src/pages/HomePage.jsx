import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import useAxios from '../utils/useAxios'
import { useState } from 'react'
import LoadingComponent from '../components/LoadingComponent'
import books from '../assets/books.jpg'
import showAlertError from '../components/messages/SwalAlertError'

const HomePage = () => {
  document.title = 'korki.PL - strona główna'

  const api = useAxios()

  const [languages, setLanguages] = useState([])
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchLanguages = async () => {
    setLoading(true)
    await api
      .get(`/api/classes/languages/most-popular/`)
      .then((res) => {
        setLanguages(res.data)
      })
      .catch((err) => {
        showAlertError(
          'Błąd',
          'Wystąpił błąd przy pobieraniu danych z serwera.'
        )
      })
  }

  const fetchCities = async () => {
    await api
      .get(`/api/users/address/cities/most-popular/`)
      .then((res) => {
        setCities(res.data)
        setLoading(false)
      })
      .catch((err) => {
        setLoading(false)
        showAlertError(
          'Błąd',
          'Wystąpił błąd przy pobieraniu danych z serwera.'
        )
      })
  }

  useEffect(() => {
    fetchLanguages()
    fetchCities()
  }, [])

  return (
    <div>
      {loading ? (
        <div className="bg-inherit">
          <LoadingComponent message="Pobieramy dane..." />
        </div>
      ) : (
        <>
          <div className="absolute left-0 right-0 top-[70px] h-[300px] bg-base-300 max-phone:hidden"></div>

          <div className="card mx-auto mb-10 mt-10 h-full rounded-md bg-base-100 px-5 pt-5 shadow-xl">
            <div
              className="hero mb-10 h-[300px]"
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
            <h1 className="relative -mx-5 mb-10 border-y-2 border-base-100 bg-base-200 px-10 py-5 text-center text-4xl text-gray-700 transition-all duration-200 hover:bg-opacity-80 max-md:text-3xl max-phone:text-2xl ">
              <div className="absolute left-5 top-0 h-full border-8 border-base-100 bg-transparent"></div>
              <div className="absolute left-2 top-0 h-full border-2 border-base-100 bg-transparent"></div>
              <div className="absolute right-5 top-0 h-full border-8 border-base-100 bg-transparent"></div>
              <div className="absolute right-2 top-0 h-full border-2 border-base-100 bg-transparent"></div>
              Znajdź korepetytora dla siebie lub dla swojego dziecka już dziś!
            </h1>
            <div className="form form-control mx-auto w-10/12">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Szukaj zajęć"
                  className="input-bordered input w-full !rounded-none bg-white focus:outline-none"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Link
                  to={`/search-classes/text/${searchQuery}`}
                  params={{ searchText: searchQuery }}
                  type="submit"
                  className="btn-square btn !rounded-none border-none bg-base-300"
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
            <h2 className="mb-2 mt-10 text-center text-2xl max-md:text-xl">
              Wyszukaj zajęcia po językach:
            </h2>
            <ul className="flex list-none flex-row flex-wrap justify-center">
              {languages.map((language) => (
                <Link
                  to={`/szukaj-zajec/jezyk/${language.slug}`}
                  params={{ languageSlug: language.slug }}
                  key={language.id}
                  className="no-animation btn flex w-1/3 justify-between rounded-sm border-x-0 border-b-0 border-t-[1px] border-base-200 bg-transparent font-normal text-black hover:border-b-[1px] hover:border-t-0 hover:bg-opacity-30 max-md:w-1/2"
                >
                  <div>{language.name}</div>
                  <div className="text-sm text-gray-400">
                    ({language.num_classes})
                  </div>
                </Link>
              ))}
            </ul>
            <h2 className="mb-2 mt-10 text-center text-2xl max-md:text-xl">
              Wyszukaj zajęcia po najpopularniejszych lokalizacjach:
            </h2>
            <ul className="flex list-none flex-row flex-wrap justify-center">
              {cities.length > 0
                ? cities.map((city) => (
                    <Link
                      to={`/szukaj-zajec/miasto/${city.slug}?id=${city.id}`}
                      params={{ citySlug: city.slug }}
                      key={city.id}
                      className="no-animation btn flex w-1/3 justify-between rounded-none border-x-0 border-b-0 border-t-[1px] border-base-200 bg-transparent font-normal text-black hover:border-b-[1px] hover:border-t-0 hover:bg-opacity-30 max-md:w-1/2"
                    >
                      <div>{city.name}</div>
                      <div className="text-sm text-gray-400">
                        ({city.num_tutors})
                      </div>
                    </Link>
                  ))
                : 'Brak obecnie zajęć dostępnych stacjonarnie.'}
            </ul>
            <div className="-mx-5 mt-10 flex flex-col justify-center rounded-md bg-gradient-to-b from-base-100 to-base-200 py-20">
              <h1 className="mb-2 text-center text-3xl">
                Załóż darmowe konto już dziś!
              </h1>
              <button className="h-15 btn-outline no-animation btn mx-auto mt-2 !min-h-0 w-3/12 rounded-sm border-base-400 py-0 hover:bg-base-400 max-md:w-5/12 max-phone:mx-auto max-phone:w-10/12">
                Zarejestruj się
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default HomePage
