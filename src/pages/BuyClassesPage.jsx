import React, { useEffect, useState } from 'react'
import useAxios from '../utils/useAxios'
import { useParams } from 'react-router-dom'
import LoadingComponent from '../components/LoadingComponent'
import ClassesPageSchedule from '../components/schedules/ClassesPageSchedule'
import dayjs from 'dayjs'
import { AiOutlineCalendar } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'
import showAlertError from '../components/messages/SwalAlertError'
import showSuccessAlert from '../components/messages/SwalAlertSuccess'
import Select from 'react-select'
import { useForm, Controller } from 'react-hook-form'

const BuyClassesPage = () => {
  const api = useAxios()
  const nav = useNavigate()

  const [classes, setClasses] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState([])
  const [showSchedule, setShowSchedule] = useState(true)
  const [placeOfClasses, setPlaceOfClasses] = useState('online')

  const { classesId } = useParams()

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    mode: 'all',
  })

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

  const onSubmit = (formData) => {
    if (formData.place_of_classes == 'online') {
      setValue('city_of_classes', null)
      formData.city_of_classes = null
    }

    let selected_slots = []
    selected.map((selected) =>
      selected_slots.push(dayjs(selected.start).format('YYYY-MM-DDTHH:mm:ss'))
    )
    const data = {
      ...formData,
      selected_slots: selected_slots,
      classes_id: classesId,
    }

    api
      .post(`/api/classes/purchase_classes/`, data)
      .then((res) => {
        showSuccessAlert(
          'Udany zakup',
          'Udało ci się zakupić zajęcia! Teraz zostaniesz przekierowany do pokoju zajęć.',
          () => {
            let roomid = res.data.room.room_id

            nav(`/pokoj/${roomid}`)
          }
        )
      })
      .catch((err) => {
        console.log(err)
        if (err.response.status == 400) {
          showAlertError('Błąd', err.response.data.error[0])
        } else if (err.response.status == 403) {
          showAlertError('Nieuprawniona akcja', err.response.data.detail)
        } else if (err.response.status == 401) {
          showAlertError(
            'Jesteś niezalogowany',
            'Zaloguj się na konto ucznia, by móc zakupić zajęcia.'
          )
        } else {
          showAlertError(
            'Błąd',
            'Wystąpił błąd przy zakupie zajęć. Przperaszamy za utrudnienia.'
          )
        }
        setSelected([])
      })
  }

  useEffect(() => {
    fetchClasses()
  }, [])
  return (
    <>
      {loading ? (
        <LoadingComponent message="Ładowanie danych o zajęciach" />
      ) : (
        <div className="pt-10">
          <div className="absolute left-0 right-0 top-[70px] h-[200px] bg-base-300 max-phone:hidden"></div>

          <div className="card mb-5 rounded-md bg-white p-5 shadow-sm">
            <h1 className="text-center text-xl font-bold uppercase tracking-wider text-gray-700">
              {classes?.name}
            </h1>
            <div className="my-4 border-b-[1px] border-base-100"></div>
            <section className="flex w-full flex-row max-lg:flex-col">
              <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                <div className="card flex w-full flex-row justify-between rounded-sm p-4 shadow-md max-lg:w-full max-phone:flex-col">
                  <div className="max-phone:order-2">
                    <h3 className="mb-2 font-bold">Wybrane daty zajęć:</h3>
                    {selected.length == 0 && (
                      <section className="flex flex-row items-center gap-x-3">
                        <AiOutlineCalendar className="h-6 w-6" />
                        <span className="italic">Brak wybranych zajęć.</span>
                      </section>
                    )}
                    {selected?.map((date, i) => (
                      <section
                        className="flex flex-row items-center gap-x-3"
                        key={i}
                      >
                        <AiOutlineCalendar className="h-6 w-6" />
                        {dayjs(date.start).format('YYYY-MM-DD HH:mm')}
                      </section>
                    ))}
                  </div>
                  <div className="max-phone:order-1 max-phone:mb-3">
                    <h3 className="mb-2 font-bold">Wybierz miejsce zajęć:</h3>

                    {classes?.place_of_classes.map((place) => (
                      <div className="form-control" key={place}>
                        <label className="label cursor-pointer gap-x-4">
                          <input
                            type="radio"
                            name="place_of_classes"
                            className="radio checked:bg-base-400"
                            value={place}
                            defaultChecked={place == 'online'}
                            onClick={() => {
                              setPlaceOfClasses(place)
                            }}
                            onChange={() => {
                              setValue('place_of_classes', place)
                            }}
                            {...register('place_of_classes')}
                          />
                          <span className="label-text">
                            {place == 'stationary' && 'Stacjonarnie'}
                            {place == 'online' && 'Online'}
                          </span>
                        </label>
                      </div>
                    ))}
                    {placeOfClasses == 'stationary' && (
                      <Controller
                        name="city_of_classes"
                        control={control}
                        render={({ field }) => (
                          <Select
                            className="mt-2 h-10 w-full border-none px-0 text-gray-500 shadow-none"
                            menuPortalTarget={document.body}
                            isClearable
                            options={classes?.cities_of_classes}
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option.id}
                            {...field}
                            placeholder={
                              <span className="text-gray-400">Miasto</span>
                            }
                            noOptionsMessage={({ inputValue }) =>
                              'Nie znaleziono'
                            }
                            styles={customSelectStyle}
                          />
                        )}
                      />
                    )}
                  </div>
                </div>
                <div className="card flex w-full flex-col rounded-sm p-4 shadow-md max-lg:w-full max-phone:flex-col ">
                  <h2 className="text-right text-lg font-bold">Podsumowanie</h2>
                  <div className=" w-full text-right">
                    Do zapłaty:
                    <br />
                    {selected.length} x{' '}
                    <span className="text-lg font-bold">
                      {classes?.price_for_lesson} PLN
                    </span>
                    <hr />
                    <span className="text-xl font-bold">
                      {classes?.price_for_lesson * selected.length} PLN
                    </span>
                  </div>
                  <div className="flex w-full justify-end">
                    <button
                      disabled={classes?.able_to_buy ? false : true}
                      className="btn-outline no-animation btn mb-2 mt-2 h-12 !min-h-0 w-full rounded-sm border-base-400 py-0 hover:bg-base-400 md:w-6/12 lg:w-3/12 "
                    >
                      Finalizuj zakup
                    </button>
                  </div>
                </div>
              </form>
            </section>
            <section className="mt-5 flex w-full justify-end">
              <button
                className="btn-outline no-animation btn mb-2 mt-2 h-12 !min-h-0 w-full rounded-sm border-base-400 py-0 hover:bg-base-400 md:w-6/12 lg:w-4/12"
                onClick={() => {
                  setShowSchedule((prev) => !prev)
                }}
              >
                Pokaż/Ukryj harmonogram dostępnych slotów
              </button>
            </section>
            {showSchedule && (
              <div className={`animate__animated animate__fadeIn`}>
                <ClassesPageSchedule
                  classes={classes}
                  selected={selected}
                  setSelected={setSelected}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default BuyClassesPage
