import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import Select from 'react-select'
import useAxios from '../utils/useAxios'
import Editor from '../components/TextEditor/Editor'
import { AiOutlineQuestionCircle } from 'react-icons/ai'
import showSuccessAlert from '../components/messages/SwalAlertSuccess'
import showAlertError from '../components/messages/SwalAlertError'
import LoadingComponent from '../components/LoadingComponent'

const EditClassesPage = () => {
  document.title = 'Edytuj zajęcia'

  const nav = useNavigate()
  const api = useAxios()
  const location = useLocation()
  const { classes } = location?.state || {}

  const [loadingCity, setLoadingCity] = useState(false)
  const [loading, setLoading] = useState(true)
  const [cities, setCities] = useState([])
  const [backendErrors, setBackendErrors] = useState([])
  const [isStationary, setIsStationary] = useState(false)
  const [descriptionHtml, setDescriptionHtml] = useState(classes?.description)
  const [languages, setLanguages] = useState([])

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
  const {
    register,
    handleSubmit,
    setValue,
    control,
    getValues,
    formState: { errors },
  } = useForm({
    mode: 'all',
  })

  const fetchAll = async () => {
    setLoading(true)

    if (!classes) {
      setLoading(false)
      nav('/')
    } else {
      await fetchLanguages()
      setValue('name', classes?.name)
      setValue('price_for_lesson', classes?.price_for_lesson)
      setValue('able_to_buy', classes?.able_to_buy)
      setValue('description', classes?.description)
      setDescriptionHtml(classes?.description)
      setValue('language', classes?.language)
      setValue('cities_of_classes', classes?.cities_of_classes)

      let place_of_classes = []
      classes?.place_of_classes?.map((place) => {
        if (place == 'stationary') {
          setIsStationary(true)
          place_of_classes.push({ label: 'Stacjonarnie', value: 'stationary' })
        }

        place == 'online' &&
          place_of_classes.push({ label: 'Online', value: 'online' })
      })

      setValue('place_of_classes', place_of_classes)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [])

  const addClassesOptionValidation = {
    cities_of_classes: {
      required:
        'Musisz wybrać przynajmniej jedno miasto przy zajęciach stacjonarnych.',
    },
    name: {
      required: 'Nazwa zajęć jest wymagana.',
    },
    price_for_lesson: {
      required: 'Cena zajęć jest wymagana.',
      min: {
        value: 1,
        message: 'Minimalna cena za godzinę zajęć to 1 PLN.',
      },
    },
    language: {
      required: 'Język zajęć jest wymagany.',
    },
  }

  const onSubmit = (formData) => {
    formData?.place_of_classes?.map(
      (place, i) => (formData.place_of_classes[i] = place.value)
    )

    formData?.cities_of_classes?.map(
      (city, i) => (formData.cities_of_classes[i] = city.id)
    )

    if (descriptionHtml != null && formData.description.length > 0) {
      formData.description = descriptionHtml
    } else {
      formData.description = null
    }

    api
      .put(`/api/classes/update/${classes?.id}/`, formData)
      .then((res) => {
        showSuccessAlert('Sukces!', res?.data?.success, () => {
          nav('/zajecia')
        })
      })
      .catch((err) => {
        if (err.response.status == 404 || err.response.status == 403) {
          showAlertError('Błąd', err.response.data.error)
        } else {
          setBackendErrors(JSON.parse(err.request.response))
        }
      })
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
          'Wystąpił błąd przy pobieraniu danych z serwera, przepraszamy.'
        )
      })
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

  return (
    <div>
      {loading ? (
        <div className="bg-inherit">
          <LoadingComponent message="Pobieramy dane..." />
        </div>
      ) : (
        <>
          <div className="pt-10">
            <div className="absolute left-0 right-0 top-[70px] h-[200px] bg-base-300"></div>

            <div className="card mx-auto mb-10 h-full w-8/12 rounded-md bg-white px-5 py-5 shadow-xl max-lg:w-10/12 max-md:w-full">
              <h1 className="text-center text-xl font-bold uppercase tracking-wider text-gray-700">
                Edytuj zajęcia
              </h1>
              <div className="my-4 border-b-[1px] border-base-100"></div>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex w-full flex-col justify-center space-y-4"
              >
                <div className="items-center">
                  <div className="float-right flex w-full flex-col">
                    <label
                      className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
                      htmlFor="name"
                    >
                      Nazwa zajęć
                    </label>
                    <input
                      type="text"
                      className="relative h-10 w-full rounded-sm border-[1px] border-base-200 bg-transparent px-2 outline-none hover:border-[#aaabac]"
                      name="name"
                      placeholder="Nazwa zajęć"
                      id="name"
                      {...register('name', addClassesOptionValidation.name)}
                    />
                    <small className="text-right text-red-400">
                      {errors?.name && errors.name.message}
                      {backendErrors?.name?.map((e, i) => (
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
                      htmlFor="price_for_lesson"
                    >
                      Cena za godzinę zajęć
                    </label>
                    <input
                      type="number"
                      className=" relative h-10 w-full rounded-sm border-[1px] border-base-200 bg-transparent px-2 outline-none hover:border-[#aaabac]"
                      name="price_for_lesson"
                      placeholder="Cena zajęć"
                      id="price_for_lesson"
                      {...register(
                        'price_for_lesson',
                        addClassesOptionValidation.price_for_lesson
                      )}
                    />
                    <small className="text-right text-red-400">
                      {errors?.price_for_lesson &&
                        errors.price_for_lesson.message}
                      {backendErrors?.price_for_lesson?.map((e, i) => (
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
                      className="mb-2 flex flex-row items-center gap-x-2 text-xs font-bold uppercase tracking-wide text-gray-700"
                      htmlFor="able_to_buy"
                    >
                      Dostępność do zakupu{' '}
                      <div
                        className="tooltip normal-case"
                        data-tip="Jeśli zaznaczysz to pole, zajęcia będą natychmiastowo dostępne do zakupu."
                      >
                        <AiOutlineQuestionCircle className="h-4 w-4" />
                      </div>
                    </label>
                    <div className="flex flex-row items-center justify-start gap-x-3">
                      <input
                        type="checkbox"
                        className="checkbox checked:bg-base-400"
                        name="able_to_buy"
                        placeholder="Cena zajęć"
                        id="able_to_buy"
                        {...register('able_to_buy')}
                      />
                      <label htmlFor="">Dostępne</label>
                    </div>
                    <small className="text-right text-red-400">
                      {errors?.able_to_buy && errors.able_to_buy.message}
                      {backendErrors?.able_to_buy?.map((e, i) => (
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
                      htmlFor="language"
                    >
                      Język zajęć
                    </label>
                    <Controller
                      name="language"
                      control={control}
                      rules={addClassesOptionValidation.language}
                      render={({ field }) => (
                        <Select
                          className="w-full border-none px-0 text-gray-500 shadow-none"
                          menuPortalTarget={document.body}
                          isClearable
                          options={languages}
                          {...field}
                          getOptionLabel={(option) => option.name}
                          getOptionValue={(option) => option.id}
                          placeholder={
                            <span className="text-gray-400">Język zajęć</span>
                          }
                          noOptionsMessage={() => 'Nie znaleziono'}
                          styles={customSelectStyle}
                        />
                      )}
                    />
                    <small className="text-right text-red-400">
                      {errors?.language && errors.language.message}
                      {backendErrors?.language?.map((e, i) => (
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
                      htmlFor="place_of_classes"
                    >
                      Rodzaj zajęć
                    </label>
                    <Controller
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          className="w-full border-none px-0 text-gray-500 shadow-none"
                          menuPortalTarget={document.body}
                          isClearable
                          isMulti
                          options={[
                            { label: 'Stacjonarnie', value: 'stationary' },
                            { label: 'Online', value: 'online' },
                          ]}
                          getOptionLabel={(option) => option.label}
                          getOptionValue={(option) => option.value}
                          placeholder={
                            <span className="text-gray-400">Rodzaj zajęć</span>
                          }
                          noOptionsMessage={() => 'Nie znaleziono'}
                          styles={customSelectStyle}
                          onChange={(selectedOption) => {
                            setIsStationary(
                              selectedOption.find(
                                (opt) => opt.value == 'stationary'
                              )
                            )
                            setValue('place_of_classes', selectedOption)
                          }}
                        />
                      )}
                      name={'place_of_classes'}
                    />
                    <small className="text-right text-red-400">
                      {errors?.city_of_classes &&
                        errors.city_of_classes.message}
                      {backendErrors?.city_of_classes?.map((e, i) => (
                        <span key={i}>
                          {e} <br />
                        </span>
                      ))}
                    </small>
                  </div>
                </div>
                {isStationary && (
                  <div className="items-center">
                    <div className="float-right flex w-full flex-col">
                      <label
                        className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
                        htmlFor="city_of_classes"
                      >
                        Miasto zajęć stacjonarnych{' '}
                      </label>
                      <Controller
                        name="cities_of_classes"
                        control={control}
                        render={({ field }) => (
                          <Select
                            className="w-full border-none px-0 text-gray-500 shadow-none"
                            menuPortalTarget={document.body}
                            isClearable
                            isMulti
                            options={cities}
                            {...field}
                            onInputChange={(e) => {
                              fetchCities(e)
                            }}
                            getOptionLabel={(option) =>
                              option.name + ', ' + option.region_name
                            }
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
                        {errors?.city_of_classes &&
                          errors.city_of_classes.message}
                        {backendErrors?.city_of_classes?.map((e, i) => (
                          <span key={i}>
                            {e} <br />
                          </span>
                        ))}
                      </small>
                    </div>
                  </div>
                )}
                <div className="items-center">
                  <div className="float-right flex w-full flex-col">
                    <label
                      htmlFor="description"
                      className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
                    >
                      Opis zajęć
                    </label>
                    <Editor
                      fieldValue={getValues('description')}
                      setValue={setValue}
                      setValueHtml={setDescriptionHtml}
                      name="description"
                      id="description"
                      fieldName="description"
                      {...register('description')}
                    />
                    <small className="text-right text-red-400">
                      {errors?.description && errors.description.message}
                      {backendErrors?.description?.map((e, i) => (
                        <span key={i}>
                          {e} <br />
                        </span>
                      ))}
                    </small>
                  </div>
                </div>
                <button className="btn-outline no-animation btn mb-2 mt-2 h-10 !min-h-0 w-full rounded-sm border-base-400 py-0 hover:bg-base-400 md:w-6/12">
                  Edytuj zajęcia
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default EditClassesPage
