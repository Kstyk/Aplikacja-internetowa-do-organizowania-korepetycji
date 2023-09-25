import React from 'react'
import { useForm } from 'react-hook-form'
import useAxios from '../../utils/useAxios'
import showAlertError from '../messages/SwalAlertError'
import showSuccessAlert from '../messages/SwalAlertSuccess'
import Modal from 'react-modal'
import { AiOutlineClose } from 'react-icons/ai'
import { useEffect } from 'react'

const RateTeacher = ({ teacher, student, opened, setIsOpened }) => {
  useEffect(() => {
    if (opened) {
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
  } = useForm({
    mode: 'all',
  })

  const api = useAxios()

  const onSubmit = (data) => {
    if (data.rate == null) {
      data.rate = 5
    }

    data.teacher = teacher.id
    data.student = student.user_id

    api
      .post(`api/classes/add-opinion/`, data)
      .then((res) => {
        closeModal()
        showSuccessAlert('Sukces!', 'Pomyślnie dodałeś ocenę nauczycielowi.')
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
        } else {
          showAlertError('Błąd', 'Nieudane dodanie opinii.')
        }
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
        <div className="alert alert-info mt-2 rounded-sm border-none bg-blue-200">
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
          <span className="text-sm">
            Zastanów się dobrze, co chcesz wpisać w ocenie nauczyciela. Raz
            dodanej oceny już nie możesz edytować ani usuwać. Dodatkowo, dla
            każdego nauczyciela możesz dodać tylko jedną opinię.
          </span>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center "
        >
          <label
            htmlFor="workQuality"
            className="text-custom-darkgreen mt-8 block text-center text-sm font-bold leading-6"
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
            className="btn-outline no-animation btn mb-2 mt-2 h-10 !min-h-0 w-full rounded-none border-base-400 py-0 hover:bg-base-400 md:w-5/12 xl:w-4/12"
          >
            Dodaj opinię
          </button>
        </form>
      </Modal>
    </div>
  )
}

export default RateTeacher
