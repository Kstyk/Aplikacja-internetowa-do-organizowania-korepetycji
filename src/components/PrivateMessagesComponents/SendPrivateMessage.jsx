import React, { useEffect, useState, useContext } from 'react'
import { useForm } from 'react-hook-form'
import useAxios from '../../utils/useAxios'
import showAlertError from '../messages/SwalAlertError'
import showSuccessAlert from '../messages/SwalAlertSuccess'
import Modal from 'react-modal'
import { AiOutlineClose } from 'react-icons/ai'
import { NotificationContext } from '../../context/NotificationContext'
import AuthContext from '../../context/AuthContext'

const SendPrivateMessage = ({ toUser, opened, setIsOpened }) => {
  Modal.setAppElement('#root')
  const api = useAxios()
  const [waitingForResponse, setWaitingForResponse] = useState(false)
  const { sendNotification } = useContext(NotificationContext)
  const { user } = useContext(AuthContext)

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
    setWaitingForResponse(true)
    data.to_user = toUser?.user?.id

    api
      .post(`/api/users/send-private-message/`, data)
      .then((res) => {
        closeModal()
        showSuccessAlert('Sukces!', 'Udało się wysłać wiadomość.')
        setWaitingForResponse(false)
        sendNotification({
          type: 'update_unread_private_messages_count',
          token: user.token,
          userId: toUser?.user?.id,
        })
      })
      .catch((err) => {
        closeModal()
        if (err.response.status == 400) {
          if (err.response.data.content) {
            showAlertError(
              'Błąd',
              err.response.data.content.map((error) => error)
            )
          }
          if (err.response.data.from_user) {
            showAlertError(
              'Błąd',
              err.response.data.from_user.map((error) => error)
            )
          }
          if (err.response.data.to_user) {
            showAlertError(
              'Błąd',
              err.response.data.to_user.map((error) => error)
            )
          }
          if (err.response.data.error) {
            showAlertError(
              'Błąd',
              err.response.data.error.map((error) => error)
            )
          }
        } else {
          showAlertError('Błąd', 'Nieudane wysłanie wiadomości prywatnej.')
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
          <span className="uppercase">
            {' '}
            {toUser?.user?.first_name} {toUser?.user?.last_name}
          </span>
        </h3>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center "
        >
          <label
            htmlFor="content"
            className="text-custom-darkgreen mt-2 block text-center text-sm font-bold leading-6"
          >
            Wiadomość
          </label>
          <textarea
            id="content"
            name="content"
            placeholder="Wprowadź tekst wiadomości"
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
              'Wyślij wiadomość'
            )}
          </button>
        </form>
      </Modal>
    </div>
  )
}

export default SendPrivateMessage
