import React from 'react'
import guest from '../../assets/guest.png'
import { backendUrl } from '../../variables/backendUrl'
import dayjs from 'dayjs'
import { BiSolidQuoteLeft, BiSolidQuoteRight } from 'react-icons/bi'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import UpdateRateTeacher from './UpdateRateTeacher'
import Swal from 'sweetalert2'
import showAlertError from '../messages/SwalAlertError'
import showSuccessAlert from '../messages/SwalAlertSuccess'
import useAxios from '../../utils/useAxios'

const OpinionStudentViewCard = ({ opinion, fetchOpinions }) => {
  const api = useAxios()

  dayjs.locale('pl')
  const [isOpenedUpdateModal, setIsOpenedUpdateModal] = useState(false)

  const deleteOpinion = async () => {
    Swal.fire({
      title: 'Jesteś pewien?',
      text: 'Nie będziesz mógł cofnąć tej operacji!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Usuń opinię',
      cancelButtonText: 'Zamknij okno',
      customClass: {
        confirmButton:
          'btn !rounded-sm !outline-none border-[1px] text-black w-full !bg-base-400 !focus:outline-none !focus:border-none',
        cancelButton:
          'btn !rounded-sm !outline-none border-[1px] text-black w-full !bg-red-500',
        popup: 'rounded-md bg-base-100',
      },
      showClass: {
        popup: 'animate__animated animate__zoomIn',
      },
      hideClass: {
        popup: 'animate__animated animate__zoomOut',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        api
          .delete(`api/classes/delete-opinion/${opinion?.id}/`)
          .then((res) => {
            showSuccessAlert('Sukces', 'Usunąłeś tę opinię.', () => {
              fetchOpinions()
            })
          })
          .catch((err) => {
            showAlertError('Niedozwolona akcja', err.response.data.error)
          })
      }
    })
  }

  return (
    <div
      className={`animate__animated animate__fadeIn card w-full rounded-md p-5 hover:bg-gray-50 hover:shadow-sm max-phone:px-0`}
    >
      <div className="header flex flex-col justify-between gap-x-2 phone:flex-row">
        <div className="order-2 flex flex-row items-center gap-x-5 phone:order-1">
          <Link to={`/nauczyciel/${opinion?.teacher?.id}`} className="avatar">
            <div className="h-12 w-12 rounded-full ring-primary ring-offset-2 ring-offset-base-100 transition-all duration-200 hover:ring sm:h-20 sm:w-20">
              <img
                src={
                  opinion?.teacher_profile_image
                    ? `${backendUrl}${opinion?.teacher_profile_image}`
                    : guest
                }
              />
            </div>
          </Link>
          <div className="flex flex-col justify-start gap-y-2">
            <Link
              to={`/nauczyciel/${opinion?.teacher?.id}`}
              className="name text-lg uppercase tracking-wider "
            >
              {opinion?.teacher?.first_name} {opinion?.teacher?.last_name}
            </Link>
            <div className="flex flex-row gap-x-3">
              <div className="rating rating-sm phone:rating-md">
                {Array.from({ length: 5 }, (_, index) => (
                  <input
                    key={index}
                    type="radio"
                    name={`${opinion?.id}__rate`}
                    className="mask mask-star-2 bg-base-400"
                    checked={opinion?.rate == index + 1 ? true : false}
                    readOnly
                  />
                ))}
              </div>
              <span className="hidden text-xl phone:block">
                {opinion?.rate} / 5
              </span>
            </div>
            <div className="w-full">
              <span className="text-sm">Dotyczy: </span>
              <Link
                className="text-sm uppercase hover:underline"
                to={`/zajecia/${opinion?.classes_rated?.id}`}
              >
                {opinion?.classes_rated?.name}
              </Link>
            </div>
          </div>
        </div>
        <div className="date order-1 phone:order-2">
          <span className="text-sm text-gray-600">
            {dayjs(opinion.published_date).format('DD MMMM YYYY')}
          </span>
        </div>
      </div>

      <div className="relative mt-5 border-[1px] border-gray-400 bg-gray-100 px-8 py-3">
        <BiSolidQuoteLeft className="absolute -top-3 left-2 h-5 w-5" />
        <BiSolidQuoteRight className="absolute -bottom-3 right-2 h-5 w-5" />
        <p className="b break-words text-sm italic text-gray-700 phone:text-base">
          {opinion?.content}
        </p>
      </div>
      <div className="flex w-full flex-row justify-end gap-x-4">
        <button
          className="mt-2 h-8 !min-h-0 rounded-sm !text-sm text-base-400 hover:underline"
          onClick={() => setIsOpenedUpdateModal(!isOpenedUpdateModal)}
        >
          Edytuj opinię
        </button>
        <UpdateRateTeacher
          opinion={opinion}
          opened={isOpenedUpdateModal}
          setIsOpened={setIsOpenedUpdateModal}
          fetchOpinions={fetchOpinions}
        />
        <button
          className="mt-2 h-8 !min-h-0 rounded-sm !text-sm text-red-800 hover:underline"
          onClick={() => deleteOpinion()}
        >
          Usuń opinię
        </button>
      </div>
    </div>
  )
}

export default OpinionStudentViewCard
