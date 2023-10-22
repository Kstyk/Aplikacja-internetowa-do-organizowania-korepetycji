import React, { useState, useEffect } from 'react'
import LoadingComponent from '../components/LoadingComponent'
import { useForm, Controller } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import showAlertError from '../components/messages/SwalAlertError'
import showSuccessAlert from '../components/messages/SwalAlertSuccess'
import useAxios from '../utils/useAxios'
import Select from 'react-select'

const AskAboutClassesPage = () => {
  document.title = 'Zapytaj o dostępność zajęć'
  const api = useAxios()
  const { classesId } = useParams()

  const [loading, setLoading] = useState(false)
  const [classes, setClasses] = useState()
  const [backendErrors, setBackendErrors] = useState([])
  const [loadingCity, setLoadingCity] = useState(false)
  const [cities, setCities] = useState([])
  const [voivodeships, setVoivodeships] = useState([])
  const [waitingForResponse, setWaitingForResponse] = useState(false)

  const fetchClasses = async () => {
    setLoading(true)
    await api
      .get(`/api/classes/${classesId}`)
      .then((res) => {
        setClasses(res.data)
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
    fetchClasses()
    fetchVoivodeships()
  }, [])

  const customSelectStyle = {
    control: (base) => ({
      ...base,
      boxShadow: 'none',
      borderRadius: '2px',
      borderColor: '#BFEAF5',
      text: 'black',
      '&:hover': {
        border: '1px solid #aaabac',
      },
    }),
  }

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    mode: 'all',
  })

  const askAboutValidation = {
    student_message: {
      required: 'Treść wiadomości jest wymagana.',
    },
    city: {
      required: 'Miasto jest wymagane.',
    },
    voivodeship: {
      required: 'Województwo jest wymagane.',
    },
    postal_code: {
      required: 'Kod pocztowy jest wymagany.',
      pattern: {
        value: /^[0-9]{2}-[0-9]{3}$/,
        message: 'Nieprawidłowy format kodu pocztowego.',
      },
    },
    street: {
      required: 'Ulica jest wymagana.',
      maxLength: {
        value: 50,
        message: 'Ulica może mieć maksymalnie 50 znaków.',
      },
    },
    building_number: {
      required: 'Numer budynku jest wymagany.',
      maxLength: {
        value: 40,
        message: 'Numer budynku nie może być dłuższy niż 50 znaków.',
      },
    },
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
          showAlertError('Błąd', 'Nie udało się znaleźć żądanej miejscowości.')
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

  const onSubmit = (data) => {
    data.classes = classes?.id
    if (data?.address?.voivodeship != null) {
      data.address.voivodeship = data.address.voivodeship.id
    }

    if (data?.address?.city != null) {
      data.address.city = data.address.city.id
    }

    api
      .post(`/api/classes/ask-about/`, data)
      .then((res) => {
        showSuccessAlert(
          'Wysłano zapytanie',
          'Wysłano zapytania do nauczyciela o miejsce zajęć. Zostaniesz poinformowany mailowo, gdy już nauczyciel podejmie decyzję.'
        )
      })
      .catch((err) => {
        setBackendErrors(JSON.parse(err.request.response))
        console.log(err)
      })
  }

  return (
    <>
      <section className="mb-10 mt-10 w-full max-md:px-3 max-sm:px-0">
        <div className="absolute left-0 right-0 top-[70px] h-[500px] bg-base-300 max-phone:hidden"></div>

        <div className="card z-30 mx-auto mb-5 flex w-8/12 flex-col items-center justify-between rounded-md border-[1px] border-base-200 bg-white p-4  text-center shadow-xl max-md:w-10/12 max-phone:w-full phone:flex-row">
          {loading ? (
            <LoadingComponent message="Ładowanie informacji o zajęciach..." />
          ) : (
            <div className="mx-auto w-full">
              <h1 className="w-full text-center text-xl font-bold uppercase tracking-wider text-gray-700">
                {classes?.name}
              </h1>
              <div className="my-4 border-b-[1px] border-base-100"></div>
              <div className="alert alert-info w-full rounded-md bg-base-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="h-6 w-6 shrink-0 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span>
                  Tutaj możesz wysłać zapytanie do nauczyciela prowadzącego te
                  zajęcia w sprawie lokalizacji zajęć wybranej przez Ciebie.
                  Nauczyciel może odrzucić propozycję, jak i zaakceptować. Może
                  także dodać odpowiedź słowną. Dostaniesz wiadomość mailową,
                  gdy nauczyciel odpowie na twoje zapytanie. W przypadku
                  zaakceptowania miejsca zajęć, będziesz mógł zakupić zajęcia w
                  wybranym miejscu w dostępnych godzinach nauczyciela.
                </span>
              </div>
              <section className="mx-auto flex w-full flex-row max-lg:flex-col">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="mt-3 flex w-full flex-col gap-y-2 text-left"
                >
                  <div className="items-center">
                    <div className="float-right flex w-full flex-col">
                      <label
                        htmlFor="description"
                        className="block text-center text-lg font-bold uppercase tracking-wide text-gray-700"
                      >
                        Adres
                      </label>
                      <div className="mb-2 border-b-[1px] border-base-100"></div>

                      <label
                        className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
                        htmlFor="city"
                      >
                        Miasto{' '}
                      </label>
                      <Controller
                        name="address.city"
                        control={control}
                        rules={askAboutValidation.city}
                        render={({ field }) => (
                          <Select
                            className="h-10 w-full border-none px-0 text-gray-700 shadow-none"
                            isClearable
                            options={cities}
                            {...field}
                            onInputChange={(e) => {
                              fetchCities(e)
                            }}
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option.id}
                            placeholder={
                              <span className="text-gray-400">Miasto</span>
                            }
                            noOptionsMessage={({ inputValue }) =>
                              loadingCity
                                ? 'Szukanie miast...'
                                : !inputValue
                                ? 'Wpisz tekst...'
                                : 'Nie znaleziono'
                            }
                            styles={customSelectStyle}
                          />
                        )}
                      />
                      <small className="text-right text-red-400">
                        {errors?.address?.city &&
                          errors?.address?.city?.message}
                        {backendErrors?.address?.city?.map((e, i) => (
                          <span key={i}>
                            {e} <br />
                          </span>
                        ))}
                      </small>
                    </div>
                  </div>
                  <div className="items-center">
                    <div className="float-right flex w-full flex-col">
                      <label
                        className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
                        htmlFor="voivodeship"
                      >
                        Województwo
                      </label>
                      <Controller
                        name="address.voivodeship"
                        control={control}
                        rules={askAboutValidation.voivodeship}
                        render={({ field }) => (
                          <Select
                            className="h-10 border-none px-0 text-gray-700 shadow-none"
                            isClearable
                            {...field}
                            options={voivodeships}
                            getOptionLabel={(option) => option.alternate_names}
                            getOptionValue={(option) => option.slug}
                            placeholder={
                              <span className="text-gray-400">Województwo</span>
                            }
                            noOptionsMessage={({ inputValue }) =>
                              !inputValue
                                ? 'Brak województwa'
                                : 'Nie znaleziono'
                            }
                            styles={customSelectStyle}
                          />
                        )}
                      />
                      <small className="text-right text-red-400">
                        {errors?.address?.voivodeship &&
                          errors?.address?.voivodeship.message}
                        {backendErrors?.address?.voivodeship?.map((e, i) => (
                          <span key={i}>
                            {e} <br />
                          </span>
                        ))}
                      </small>
                    </div>
                  </div>
                  <div className="items-center">
                    <div className="float-right flex w-full flex-col">
                      <label
                        className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
                        htmlFor="postal_code"
                      >
                        Kod pocztowy
                      </label>
                      <input
                        type="text"
                        className=" relative h-10 w-full rounded-sm border-[1px] border-base-200 bg-transparent px-2 outline-none hover:border-[#aaabac]"
                        name="address.postal_code"
                        placeholder="Podaj kod pocztowy"
                        id="postal_code"
                        {...register(
                          'address.postal_code',
                          askAboutValidation.postal_code
                        )}
                      />
                      <small className="text-right text-red-400">
                        {errors?.address?.postal_code &&
                          errors?.address?.postal_code.message}
                        {backendErrors?.address?.postal_code?.map((e, i) => (
                          <span key={i}>
                            {e} <br />
                          </span>
                        ))}
                      </small>
                    </div>
                  </div>

                  <div className="items-center">
                    <div className="float-right flex w-full flex-col">
                      <label
                        className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
                        htmlFor="street"
                      >
                        Ulica
                      </label>
                      <input
                        type="text"
                        className=" relative h-10 w-full rounded-sm border-[1px] border-base-200 bg-transparent px-2 outline-none hover:border-[#aaabac]"
                        name="address.street"
                        placeholder="Podaj ulicę"
                        id="street"
                        {...register(
                          'address.street',
                          askAboutValidation.street
                        )}
                      />
                      <small className="text-right text-red-400">
                        {errors?.street && errors.street.message}
                        {backendErrors?.address?.street?.map((e, i) => (
                          <span key={i}>
                            {e} <br />
                          </span>
                        ))}
                      </small>
                    </div>
                  </div>
                  <div className="items-center">
                    <div className="float-right flex w-full flex-col">
                      <label
                        className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
                        htmlFor="building_number"
                      >
                        Numer budynku
                      </label>
                      <input
                        type="text"
                        className=" relative h-10 w-full rounded-sm border-[1px] border-base-200 bg-transparent px-2 outline-none hover:border-[#aaabac]"
                        name="address.building_number"
                        placeholder="Podaj numer budynku"
                        id="building_number"
                        {...register(
                          'address.building_number',
                          askAboutValidation.building_number
                        )}
                      />
                      <small className="text-right text-red-400">
                        {errors?.address?.building_number &&
                          errors?.address?.building_number.message}
                        {backendErrors?.address?.building_number?.map(
                          (e, i) => (
                            <span key={i}>
                              {e} <br />
                            </span>
                          )
                        )}
                      </small>
                    </div>
                  </div>

                  <div className="mt-2 items-center">
                    <div className="float-right flex w-full flex-col">
                      <label
                        htmlFor="student_message"
                        className="block text-center text-lg font-bold uppercase tracking-wide text-gray-700"
                      >
                        Wiadomość
                      </label>
                      <div className="mb-2 border-b-[1px] border-base-100"></div>
                      <textarea
                        name="student_message"
                        id="student_message"
                        cols="30"
                        rows="10"
                        className="border-[1px] border-[#BFEAF5] px-2 py-1 hover:border-[#aaabac] focus:outline-none"
                        {...register(
                          'student_message',
                          askAboutValidation.student_message
                        )}
                      ></textarea>
                      <small className="text-right text-red-400">
                        {errors?.student_message &&
                          errors?.student_message.message}
                        {backendErrors?.student_message?.map((e, i) => (
                          <span key={i}>
                            {e} <br />
                          </span>
                        ))}
                      </small>
                    </div>
                  </div>
                  <button className="btn-outline no-animation btn mt-2 h-10 !min-h-0 w-6/12 rounded-sm border-base-400 py-0 hover:bg-base-400 max-md:w-5/12 max-phone:mx-auto max-phone:w-full">
                    {waitingForResponse ? (
                      <span className="loading loading-spinner "></span>
                    ) : (
                      'Wyślij zapytanie'
                    )}
                  </button>
                </form>
              </section>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default AskAboutClassesPage
