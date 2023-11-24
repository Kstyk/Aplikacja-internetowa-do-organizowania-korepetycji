import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import useAxios from '../../utils/useAxios'
import showAlertError from '../AlertsComponents/SwalAlertError'
import showSuccessAlert from '../AlertsComponents/SwalAlertSuccess'
import Modal from 'react-modal'
import { AiOutlineClose } from 'react-icons/ai'

const SendResponse = ({ opened, setIsOpened, question, fetchQuestions }) => {
  Modal.setAppElement('#root')
  const api = useAxios()
  const [waitingForResponse, setWaitingForResponse] = useState(false)
  const [backendErrors, setBackendErrors] = useState([])

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

  const onSubmit = (data) => {
    data.id = question?.id
    setWaitingForResponse(true)

    api
      .put(`/api/classes/response-ask/`, data)
      .then((res) => {
        closeModal()
        showSuccessAlert(
          'Wysłano odpowiedź',
          'Wysłałeś odpowiedź do studenta.',
          () => {
            fetchQuestions()
          }
        )
        setWaitingForResponse(false)
      })
      .catch((err) => {
        if (err.response.status == 400) {
          setBackendErrors(JSON.parse(err.request.response))
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
        contentLabel="Wyślij wiadomość prywatną"
        className={`animate__animated animate__zoomIn my-auto w-full rounded-sm bg-base-100 p-10 phone:w-10/12 sm:w-8/12 md:w-6/12`}
      >
        <button onClick={closeModal} className="float-right rounded-full">
          <AiOutlineClose className="h-6 w-6" />
        </button>
        <h3 className="text-center text-lg font-bold text-gray-800">
          Wyślij wiadomość prywatną
          <br />
        </h3>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center "
        >
          <label
            htmlFor="content"
            className="text-custom-darkgreen mt-2 block text-center text-sm font-bold leading-6"
          >
            Status
          </label>
          <div className="form-control">
            <label className="label cursor-pointer flex-row gap-x-3">
              <input
                type="radio"
                name="accepted"
                {...register('accepted')}
                className="radio checked:bg-green-400"
                value={true}
              />
              <span className="label-text">Akceptuj</span>
            </label>
          </div>
          <div className="form-control">
            <label className="label flex cursor-pointer flex-row gap-x-3">
              <input
                type="radio"
                name="accepted"
                {...register('accepted')}
                className="radio checked:bg-red-400"
                value={false}
              />
              <span className="label-text">Odrzuć</span>
            </label>
          </div>
          <small className="text-right text-red-400">
            {backendErrors?.accepted?.map((e, i) => (
              <span key={i}>
                {e} <br />
              </span>
            ))}
          </small>
          <label
            htmlFor="content"
            className="text-custom-darkgreen mt-2 block text-center text-sm font-bold leading-6"
          >
            Wiadomość
          </label>
          <textarea
            id="teacher_message"
            name="teacher_message"
            placeholder="Wprowadź tekst wiadomości do studenta"
            {...register('teacher_message')}
            className="textarea min-h-12 mt-2 block h-32 w-full rounded-md border-0 bg-white px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6"
          />
          <small className="text-right text-red-400">
            {backendErrors?.teacher_message?.map((e, i) => (
              <span key={i}>
                {e} <br />
              </span>
            ))}
          </small>
          <button
            type="submit"
            className="btn-outline no-animation btn mb-2 mt-2 h-10 !min-h-0 w-full rounded-sm border-base-400 py-0 hover:bg-base-400 md:w-6/12 xl:w-4/12"
          >
            {waitingForResponse ? (
              <span className="loading loading-spinner "></span>
            ) : (
              'Odpowiedz na zapytanie'
            )}
          </button>
        </form>
      </Modal>
    </div>
  )
}

export default SendResponse
