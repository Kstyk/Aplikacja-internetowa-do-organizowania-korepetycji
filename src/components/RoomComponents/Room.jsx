import React, { useEffect, useState, useContext } from 'react'
import Chat from './Chat'
import { useParams } from 'react-router-dom'
import AuthContext from '../../context/AuthContext'
import RoomContext from '../../context/RoomContext'
import useAxios from '../../utils/useAxios'
import LoadingComponent from '../LoadingComponent'
import { useNavigate } from 'react-router-dom'
import showAlertError from '../messages/SwalAlertError'
import showSuccessAlert from '../messages/SwalAlertSuccess'

import Files from './Files'
import RoomPageSchedule from './RoomPageSchedule'
import Swal from 'sweetalert2'
import RateTeacher from '../ClassesComponents/RateTeacher'

const Room = () => {
  const [name, setName] = useState()

  document.title = `Pokój - ${name}`

  const { roomId } = useParams()
  const { user, authTokens } = useContext(AuthContext)
  const { selectedTab, setSelectedTab, setRoom } = useContext(RoomContext)

  let api = useAxios()
  const nav = useNavigate()

  const [teacher, setTeacher] = useState()
  const [isArchivized, setIsArchivized] = useState()
  const [loading, setLoading] = useState(true)
  const [isOpened, setIsOpened] = useState(false) // modal oceny nauczyciela

  const fetchReceiver = async () => {
    setLoading(true)
    await api
      .get(`api/rooms/${roomId}`)
      .then((res) => {
        setTeacher(res.data.users.find((u) => u.email != user.email))
        setIsArchivized(res.data.archivized)
        setName(res.data.name)
        setLoading(false)
      })
      .catch((err) => {
        if (err.response.status == 404) {
          showAlertError('Błąd', 'Pokój o takim ID nie istnieje', () => {
            setLoading(false)
          })
          nav('/')
        }

        if (err.response.status == 403) {
          showAlertError('Błąd', 'Nie masz dostępu do tego pokoju', () => {
            setLoading(false)
          })
          nav('/')
        }
        setLoading(false)
      })
  }

  const leaveTheRoom = async () => {
    Swal.fire({
      title: 'Jesteś pewien?',
      text: 'Nie będziesz mógł cofnąć tej operacji!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Opuść pokój',
      cancelButtonText: 'Zamknij okno',
      customClass: {
        confirmButton:
          'btn  rounded-none outline-none border-[1px] text-black w-full',
        cancelButton:
          'btn  rounded-none outline-none border-[1px] text-black w-full',
        popup: 'rounded-none bg-base-100',
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
          .post(`api/rooms/${roomId}/leave/`)
          .then((res) => {
            showSuccessAlert(
              'Opuściłeś pokój',
              'Zostaniesz przekierowany do strony głównej',
              () => {
                nav('/')
              }
            )
          })
          .catch((err) => {
            showAlertError('Niedozwolona akcja', err.response.data.error)
          })
      }
    })
  }

  useEffect(() => {
    setRoom(roomId)
    fetchReceiver()
  }, [])

  return (
    <div>
      <>
        <div className="absolute left-0 right-0 top-[70px] h-[300px] bg-base-300 max-phone:hidden"></div>

        <div className="tab-bordered relative mt-5 flex w-full flex-row justify-between gap-x-5 rounded-t-md bg-white p-5 pb-0 sm:mt-10">
          {loading ? (
            <LoadingComponent message="Ładowanie pokoju" />
          ) : (
            <>
              <h1 className="text-base font-bold uppercase tracking-wide text-gray-700 phone:text-lg sm:text-xl">
                {name}
              </h1>
              <section className="flex justify-end gap-x-5">
                {user?.role == 'Student' && (
                  <>
                    <button
                      className="text-xs uppercase text-gray-500 hover:underline phone:text-sm"
                      onClick={() => setIsOpened(!isOpened)}
                    >
                      Oceń nauczyciela
                    </button>
                    <RateTeacher
                      teacher={teacher}
                      student={user}
                      opened={isOpened}
                      setIsOpened={setIsOpened}
                    />
                  </>
                )}
                <button
                  onClick={() => leaveTheRoom()}
                  className="text-xs uppercase text-gray-500 hover:underline phone:text-sm"
                >
                  Opuść pokój
                </button>
              </section>
            </>
          )}
        </div>
        {loading ? (
          ''
        ) : (
          <>
            <div className="tabs relative h-[100%] bg-white p-5 shadow-xl max-sm:pl-0 phone:rounded-b-md">
              <div
                className={`tab-bordered tab text-sm font-bold uppercase tracking-wide hover:text-[#00000080]  phone:text-base ${
                  selectedTab == 1
                    ? 'border-b-gray-700 !text-gray-700 transition-all duration-300'
                    : 'text-[#00000080]'
                }`}
                onClick={() => {
                  setSelectedTab(1)
                }}
              >
                Czat
              </div>
              <div
                className={`tab-bordered tab text-sm font-bold uppercase tracking-wide hover:text-[#00000080]  phone:text-base ${
                  selectedTab == 2
                    ? 'border-b-gray-700 !text-gray-700 transition-all duration-300'
                    : 'text-[#00000080]'
                }`}
                onClick={() => {
                  setSelectedTab(2)
                }}
              >
                Pliki
              </div>
              <div
                className={`tab-bordered tab text-sm font-bold uppercase tracking-wide hover:text-[#00000080]  phone:text-base ${
                  selectedTab == 3
                    ? 'border-b-gray-700 !text-gray-700 transition-all duration-300'
                    : 'text-[#00000080]'
                }`}
                onClick={() => {
                  setSelectedTab(3)
                }}
              >
                Terminarz
              </div>
            </div>
            {selectedTab == 1 && (
              <div className="relative w-full">
                <Chat archivized={isArchivized} />
              </div>
            )}
            {selectedTab == 2 && <Files roomId={roomId} />}
            {selectedTab == 3 && <RoomPageSchedule roomId={roomId} />}
          </>
        )}
      </>
    </div>
  )
}

export default Room
