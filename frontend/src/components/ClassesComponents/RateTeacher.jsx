import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import useAxios from '../../utils/useAxios'
import showAlertError from '../AlertsComponents/SwalAlertError'
import showSuccessAlert from '../AlertsComponents/SwalAlertSuccess'
import Select from 'react-select'
import Modal from 'react-modal'
import { AiOutlineClose } from 'react-icons/ai'

const RateTeacher = ({ teacher, student, opened, setIsOpened }) => {
  const api = useAxios()
  const [classes, setClasses] = useState([])
  const [waitingForResponse, setWaitingForResponse] = useState(false)

  const customSelectStyle = {
    control: (base) => ({
      ...base,
      boxShadow: 'none',
      borderRadius: '2px',
      '&:hover': {
        border: '1px solid #aaabac',
      },
    }),
  }

  const fetchClassesToRate = async () => {
    await api
      .get(
        `/api/classes/purchase-classes/classes-bought-by-student-teacher/?teacher_id=${teacher?.id}`
      )
      .then((res) => {
        setClasses(res.data)
      })
      .catch((err) => {
        if (err.response.status == 404) {
          showAlertError('Błąd', err.response.data.error)
        } else {
          showAlertError(
            'Błąd',
            'Wystąpił błąd przy pobieraniu zajęć do oceny.'
          )
        }
      })
  }

  useEffect(() => {
    if (opened) {
      fetchClassesToRate()
      openModal()
    }
  }, [opened])

  function openModal() {
    setIsOpened(true)
  }

  function afterOpenModal() {}

  function closeModal() {
    setIsOpened(false)
  }

  const customStyles = {
    overlay: {
      zIndex: 1000,
      background: 'rgb(80,80,80, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    mode: 'all',
  })

  const addRate = {
    classes_rated: {
      required: 'Zajęcia są wymagane.',
    },
  }

  const onSubmit = (data) => {
    setWaitingForResponse(true)
    if (data.rate == null) {
      data.rate = 5
    }

    data.teacher = teacher.id
    data.student = student.user_id
    data.classes_rated = data.classes_rated ? data.classes_rated.id : null

    api
      .post(`api/classes/add-opinion/`, data)
      .then((res) => {
        closeModal()
        showSuccessAlert(
          'Sukces!',
          'Pomyślnie dodałeś ocenę nauczycielowi. Możesz ją zobaczyć w zakładce "Wystawione Opinie".'
        )
        setWaitingForResponse(false)
      })
      .catch((err) => {
        closeModal()
        if (err.response.status == 400) {
          if (err.response.data.exist_opinion) {
            showAlertError(
              'Błąd',
              err.response.data.exist_opinion.map((error) => error)
            )
          }
          if (err.response.data.student) {
            showAlertError(
              'Błąd',
              err.response.data.student.map((error) => error)
            )
          }
          if (err.response.data.classes_rated) {
            showAlertError(
              'Błąd',
              err.response.data.classes_rated.map((error) => error)
            )
          }
          if (err.response.data.teacher) {
            showAlertError(
              'Błąd',
              err.response.data.teacher.map((error) => error)
            )
          }
          if (err.response.data.rate) {
            showAlertError(
              'Błąd',
              err.response.data.rate.map((error) => error)
            )
          }
          if (err.response.data.wrong_classes) {
            showAlertError(
              'Błąd',
              err.response.data.wrong_classes.map((error) => error)
            )
          }
          if (err.response.data.exist_opinion) {
            showAlertError(
              'Błąd',
              err.response.data.exist_opinion.map((error) => error)
            )
          }
        } else {
          showAlertError('Błąd', 'Nieudane dodanie opinii.')
        }
        setWaitingForResponse(false)
      })
  }

  return (
    <div className="flex items-center">
      <Modal
        isOpen={opened}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Oceń nauczyciela"
        className={`animate__animated animate__zoomIn my-auto w-full rounded-sm bg-base-100 p-10 phone:w-10/12 sm:w-8/12 md:w-6/12`}
      >
        <button onClick={closeModal} className="float-right rounded-full">
          <AiOutlineClose className="h-6 w-6" />
        </button>
        <h3 className="text-center text-lg font-bold text-gray-800">
          Wystaw ocenę dla:{' '}
          <span className="uppercase">
            {teacher?.first_name} {teacher?.last_name}
          </span>
        </h3>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center "
        >
          <label
            htmlFor="workQuality"
            className="text-custom-darkgreen mt-8 block text-center text-sm font-bold leading-6"
          >
            Zajęcia do oceny
          </label>
          <Controller
            name="classes_rated"
            control={control}
            render={({ field }) => (
              <Select
                {...register('classes_rated', addRate.classes_rated)}
                className="h-10 w-full border-none px-0 text-gray-500 shadow-none"
                isClearable
                options={classes}
                {...field}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id}
                placeholder={<span className="text-gray-400">Zajęcia</span>}
                noOptionsMessage={({ inputValue }) => 'Brak zajęć'}
                styles={customSelectStyle}
              />
            )}
          />
          <small className="w-full text-right text-red-400">
            {errors?.classes_rated && errors.classes_rated.message}
          </small>
          <label
            htmlFor="workQuality"
            className="text-custom-darkgreen mt-5 block text-center text-sm font-bold leading-6"
          >
            Ocena
          </label>
          <div className="rating flex justify-center phone:rating-lg">
            {Array.from({ length: 5 }, (_, index) => (
              <input
                key={index}
                type="radio"
                name="rate"
                {...register('rate')}
                value={`${index + 1}`}
                className="mask mask-star-2 bg-base-300"
              />
            ))}
          </div>
          <label
            htmlFor="meetingTheConditions"
            className="text-custom-darkgreen mt-2 block text-center text-sm font-bold leading-6"
          >
            Komentarz
          </label>
          <textarea
            id="content"
            name="content"
            placeholder="Wprowadź tekst komentarza"
            {...register('content')}
            className="textarea min-h-12 mt-2 block h-32 w-full rounded-md border-0 bg-white px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6"
          />
          <button
            type="submit"
            className="btn-outline no-animation btn mb-2 mt-2 h-10 !min-h-0 w-full rounded-sm border-base-400 py-0 hover:bg-base-400 md:w-5/12 xl:w-4/12"
          >
            {waitingForResponse ? (
              <span className="loading loading-spinner "></span>
            ) : (
              'Dodaj opinię'
            )}
          </button>
        </form>
      </Modal>
    </div>
  )
}

export default RateTeacher
