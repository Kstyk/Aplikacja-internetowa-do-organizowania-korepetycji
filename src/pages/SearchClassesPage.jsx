import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useAxios from '../utils/useAxios'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import LoadingComponent from '../components/LoadingComponent'
import Select from 'react-select'
import ClassesCard from '../components/ClassesComponents/ClassesCard'
import Pagination from '../components/Pagination'
import showAlertError from '../components/messages/SwalAlertError'

const SearchClassesPage = () => {
  const { languageSlug, citySlug, searchText } = useParams()
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const cityId = params.get('id')
  const api = useAxios()

  const [city, setCity] = useState(null)
  const [voivodeship, setVoivodeship] = useState(null)
  const [language, setLanguage] = useState(languageSlug)
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(500)
  const [sortBy, setSortBy] = useState(null)
  const [sortDirection, setSortDirection] = useState('ASC')

  const [classes, setClasses] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState()
  const [totalResults, setTotalResults] = useState()

  const [languages, setLanguages] = useState([])
  const [cities, setCities] = useState([])
  const [voivodeships, setVoivodeships] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingCity, setLoadingCity] = useState(false)
  const [searchQuery, setSearchQuery] = useState(searchText)

  const customSelectStyle = {
    control: (base) => ({
      ...base,
      boxShadow: 'none',
      borderRadius: '2px',
      borderColor: '#BFEAF5',
      '&:hover': {
        border: '1px solid #aaabac',
      },
    }),
  }
  const customSortSelectStyle = {
    control: (provided, state) => ({
      ...provided,
      boxShadow: 'none',
      borderRadius: '2px',
      borderColor: '#BFEAF5',
      minHeight: '30px',
      height: '30px',
      '&:hover': {
        border: '1px solid #aaabac',
      },
    }),
    valueContainer: (provided, state) => ({
      ...provided,
      height: '30px',
      padding: '0 6px',
    }),

    input: (provided, state) => ({
      ...provided,
      margin: '0px',
    }),

    indicatorsContainer: (provided, state) => ({
      ...provided,
      height: '30px',
    }),

    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        fontSize: '12px',
        paddingTop: '2px',
        paddingBottom: '2px',
        cursor: isDisabled ? 'not-allowed' : 'default',
      }
    },
  }

  const clearFilters = () => {
    setCities([])
    setSearchQuery([])
    setLanguage(null)
    setCity(null)
    setVoivodeship(null)
    setMinPrice(0)
    setMaxPrice(500)
  }

  const fetchTutors = async () => {
    let baseurl = `/api/classes/?page_size=10&page=1`

    if (searchQuery != null && searchQuery != '') {
      baseurl += `&search_text=${searchQuery}`
    }

    if (languageSlug != null) {
      baseurl += `&language=${language}`
    }

    if (citySlug != null) {
      baseurl += `&city=${cityId}`
    }

    await api
      .get(baseurl)
      .then((res) => {
        if (res.data.classes == null) {
          setClasses(null)
          setTotalPages(0)
          setTotalResults(0)
          setCurrentPage(1)
        } else {
          setClasses(res.data.classes)
          setTotalPages(res.data.total_pages)
          setTotalResults(res.data.total_classes)
          setCurrentPage(res.data.page_number)
        }
      })
      .catch((err) => {
        showAlertError(
          'Błąd',
          'Wystąpił błąd przy pobieraniu danych z serwera.'
        )
      })
  }

  const searchTutors = async (page) => {
    setLoading(true)

    let baseurl = `/api/classes/?page_size=10&page=${page}`

    if (searchQuery != null && searchQuery != '') {
      baseurl += `&search_text=${searchQuery}`
    }

    if (language != null) {
      baseurl += `&language=${language.slug != null ? language.slug : language}`
    }

    if (voivodeship != null) {
      baseurl += `&voivodeship=${voivodeship.id}`
    }

    if (city != null) {
      baseurl += `&city=${city.id}`
    }

    if (minPrice != null) {
      baseurl += `&min_price=${minPrice}`
    }

    if (maxPrice != null) {
      baseurl += `&max_price=${maxPrice}`
    }
    if (sortBy != null) {
      baseurl += `&sort_by=${sortBy}&sort_direction=${sortDirection}`
    }
    await api
      .get(baseurl)
      .then((res) => {
        if (res.data.classes == null) {
          setClasses(null)
          setTotalPages(0)
          setTotalResults(0)
          setCurrentPage(1)
        } else {
          setClasses(res.data.classes)
          setTotalPages(res.data.total_pages)
          setTotalResults(res.data.total_classes)
          setCurrentPage(res.data.page_number)
        }
      })
      .catch((err) => {
        showAlertError('Błąd', 'Wystąpił błąd przy wyszukiwaniu zajęć.')
      })
    setLoading(false)
  }

  const sortTutors = async (page) => {
    setLoading(true)

    let baseurl = `/api/classes/?page_size=10&page=${page}`

    if (searchQuery != null && searchQuery != '') {
      baseurl += `&search_text=${searchQuery}`
    }

    if (language != null) {
      baseurl += `&language=${language.slug != null ? language.slug : language}`
    }

    if (voivodeship != null) {
      baseurl += `&voivodeship=${voivodeship.id}`
    }

    if (city != null) {
      baseurl += `&city=${city.id}`
    }

    if (minPrice != null) {
      baseurl += `&min_price=${minPrice}`
    }

    if (maxPrice != null) {
      baseurl += `&max_price=${maxPrice}`
    }

    if (sortBy != null) {
      baseurl += `&sort_by=${sortBy}&sort_direction=${sortDirection}`
    }

    await api
      .get(baseurl)
      .then((res) => {
        if (res.data.classes == null) {
          setClasses(null)
          setTotalPages(0)
          setTotalResults(0)
          setCurrentPage(1)
        } else {
          setClasses(res.data.classes)
          setTotalPages(res.data.total_pages)
          setTotalResults(res.data.total_classes)
          setCurrentPage(res.data.page_number)
        }
      })
      .catch((err) => {
        showAlertError('Błąd', 'Wystąpił błąd przy wyszukiwaniu zajęć.')
      })
    setLoading(false)
  }

  const fetchLanguages = async () => {
    await api
      .get(`/api/classes/languages`)
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

  const fetchCity = async (cityId) => {
    if (cityId != null) {
      await api
        .get(`/api/users/address/city/${cityId}`)
        .then((res) => {
          setCities([...cities, res.data])
          setCity(res.data)
        })
        .catch((err) => {
          showAlertError(
            'Błąd',
            'Wystąpił błąd przy pobieraniu danych z serwera.'
          )
        })
    }
  }

  const fetchCities = async (e) => {
    setLoadingCity(true)
    if (e.trim() != '') {
      await api
        .get(`/api/users/address/cities/?name=${e}`)
        .then((res) => {
          setCities(res.data)
          setLoadingCity(false)
        })
        .catch((err) => {
          setLoadingCity(false)
        })
    } else {
      setCities([])
      setLoadingCity(false)
    }
  }

  const fetchVoivodeships = async () => {
    await api
      .get(`/api/users/address/voivodeships/`)
      .then((res) => {
        setVoivodeships(res.data)
      })
      .catch((err) => {
        showAlertError(
          'Błąd',
          'Wystąpił błąd przy pobieraniu danych z serwera.'
        )
      })
  }

  const handleCitySelectChange = (e) => {
    setCity(e)
    if (e != null) {
      setVoivodeship(voivodeships.find((voi) => voi.id == e.region_id && voi))
    } else setVoivodeship(null)
  }

  const handleVoivodeshipSelectChange = (e) => {
    setVoivodeship(e)
    setCity(null)
    setCities([])
  }

  const handleLanguageSelectChange = (e) => {
    setLanguage(e)
  }

  const handleMinPrice = (e) => {
    setMinPrice(e.target.value)
  }
  const handleMaxPrice = (e) => {
    setMaxPrice(e.target.value)
  }

  const fetchingDatas = async () => {
    setLoading(true)
    await fetchVoivodeships()
    await fetchLanguages()
    await fetchCity(cityId)
    await fetchTutors()
    setLoading(false)
  }

  useEffect(() => {
    fetchingDatas()
  }, [setLoading])

  return (
    <div>
      <div className="absolute left-0 right-0 top-[70px] h-[500px] bg-base-300 max-phone:hidden"></div>

      <div className="card mx-auto mb-10 mt-10 h-full rounded-md bg-base-100 px-5 py-5 shadow-xl">
        <div className="input-group">
          <input
            type="text"
            placeholder="Szukaj korepetycji"
            className="input-bordered input w-full !rounded-sm bg-white placeholder:text-gray-400 focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="btn-square btn !rounded-none border-none bg-base-300"
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
          <div className="flex flex-row justify-start gap-x-5 max-phone:flex-col">
            <Select
              className="mt-2 h-10 w-4/12 border-none px-0 text-gray-500 shadow-none max-md:w-5/12 max-phone:w-full"
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
                !inputValue ? 'Brak województwa' : 'Nie znaleziono'
              }
              styles={customSelectStyle}
            />
            <Select
              className="mt-2 h-10 w-4/12 border-none px-0 text-gray-500 shadow-none max-md:w-5/12 max-phone:w-full"
              menuPortalTarget={document.body}
              isClearable
              options={cities}
              onInputChange={(e) => {
                fetchCities(e)
              }}
              value={city}
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.id}
              placeholder={<span className="text-gray-400">Miasto</span>}
              onChange={(e) => handleCitySelectChange(e)}
              noOptionsMessage={({ inputValue }) =>
                loadingCity
                  ? 'Szukanie miast...'
                  : !inputValue
                  ? 'Wpisz tekst...'
                  : 'Nie znaleziono'
              }
              styles={customSelectStyle}
            />
            <Select
              className="mt-2 h-10 w-4/12 border-none px-0 text-gray-500 shadow-none max-md:w-5/12 max-phone:w-full"
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
                !inputValue ? 'Wpisz tekst...' : 'Nie znaleziono'
              }
              styles={customSelectStyle}
            />
          </div>
          <div className="mt-3 flex flex-row justify-between max-[550px]:flex-col">
            <div className="w-5/12 max-[550px]:w-full">
              <label htmlFor="" className="text-[15px]">
                Cena minimalna za lekcję:{' '}
                {<span className="font-bold">{minPrice}</span>}
              </label>
              <input
                type="range"
                min={0}
                value={minPrice}
                max="500"
                className="range range-primary range-xs"
                onChange={(e) => {
                  handleMinPrice(e)
                }}
              />
            </div>
            <div className="w-5/12 max-[550px]:w-full">
              <label htmlFor="" className="text-[15px]">
                Cena maksymalna za lekcję:{' '}
                {<span className="font-bold">{maxPrice}</span>}
              </label>
              <input
                type="range"
                min={0}
                value={maxPrice}
                max="500"
                className="range range-primary range-xs"
                onChange={(e) => {
                  handleMaxPrice(e)
                }}
              />
            </div>
          </div>
          <div className="flex justify-between">
            <button
              onClick={(e) => searchTutors(1)}
              className="btn-outline no-animation btn mt-2 h-10 !min-h-0 w-3/12 rounded-sm border-base-400 py-0 hover:bg-base-400 max-md:w-5/12"
            >
              Filtruj
            </button>
            <button
              onClick={(e) => clearFilters()}
              className="btn-outline no-animation btn mt-2 h-10 !min-h-0 w-3/12 rounded-sm border-base-400 py-0 hover:bg-base-400 max-md:w-5/12"
            >
              Wyczyść filtry
            </button>
          </div>
          <div className="my-4 border-t-[1px] border-base-200"></div>
          <div className="flex w-full flex-col items-center justify-start gap-x-3 gap-y-3 sm:flex-row sm:gap-y-0">
            <div className="flex w-full flex-row gap-x-3 sm:w-6/12">
              <Select
                className="h-fit w-6/12 border-none px-0 text-sm text-gray-500 shadow-none"
                menuPortalTarget={document.body}
                isClearable
                options={[
                  { label: 'Alfabetycznie', value: 'name' },
                  { label: 'Cena za lekcję', value: 'price_for_lesson' },
                  { label: 'Średnia opinia', value: 'average_rating' },
                ]}
                placeholder={<span className="text-gray-400">Sortuj po</span>}
                noOptionsMessage={({ inputValue }) =>
                  !inputValue ? 'Wpisz tekst...' : 'Nie znaleziono'
                }
                onChange={(e) => setSortBy(e.value)}
                styles={customSortSelectStyle}
              />
              <Select
                className="h-fit w-6/12 border-none px-0 text-sm text-gray-500 shadow-none"
                menuPortalTarget={document.body}
                isClearable
                options={[
                  { label: 'Rosnąco', value: 'ASC' },
                  { label: 'Malejąco', value: 'DESC' },
                ]}
                placeholder={<span className="text-gray-400">Kierunek</span>}
                noOptionsMessage={({ inputValue }) =>
                  !inputValue ? 'Wpisz tekst...' : 'Nie znaleziono'
                }
                onChange={(e) => setSortDirection(e.value)}
                styles={customSortSelectStyle}
              />
            </div>
            <button
              className="btn-outline no-animation btn h-[30px] !min-h-0 w-2/12 rounded-sm border-base-400 py-0 text-xs hover:bg-base-400 max-md:w-5/12"
              onClick={() => sortTutors(1)}
            >
              Sortuj
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
          <div className="card mx-auto mb-10 mt-10 h-full gap-y-3 rounded-md bg-base-100 px-5 py-5 shadow-xl">
            {classes == null && (
              <h1 className="text-lg">
                Brak wyników dopasowanych do podanych kryteriów.
              </h1>
            )}
            {classes?.map((classes) => (
              <ClassesCard key={classes.id} classes={classes} />
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination
              totalResults={totalResults}
              totalPages={totalPages}
              currentPage={currentPage}
              search={searchTutors}
            />
          )}
        </section>
      )}
    </div>
  )
}

export default SearchClassesPage
