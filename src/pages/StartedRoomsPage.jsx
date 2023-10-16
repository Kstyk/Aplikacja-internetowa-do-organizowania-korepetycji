import React, { useEffect, useState, useContext } from 'react'
import useAxios from '../utils/useAxios'
import AuthContext from '../context/AuthContext'
import { Link } from 'react-router-dom'
import LoadingComponent from '../components/LoadingComponent'
import RoomCard from '../components/RoomComponents/RoomCard'
import { AiOutlineQuestionCircle } from 'react-icons/ai'
import ArchivizedRoomCard from '../components/RoomComponents/ArchivizedRoomCard'
import showAlertError from '../components/messages/SwalAlertError'
import { NotificationContext } from '../context/NotificationContext'

const StartedRoomsPage = () => {
  document.title = 'Twoje pokoje'

  const api = useAxios()
  const [rooms, setRooms] = useState([])
  const [archivizedRooms, setArchivizedRooms] = useState([])
  const [loading, setLoading] = useState(true)

  const { user } = useContext(AuthContext)

  const { roomToUpdate, countUnreadMessages } = useContext(NotificationContext)

  useEffect(() => {
    if (roomToUpdate != null) {
      fetchUnreadMessagesUpdate()
    }
  }, [countUnreadMessages])

  const fetchUnreadMessagesUpdate = async () => {
    await api
      .get('/api/rooms/all-rooms/')
      .then((res) => {
        setRooms(res.data)
      })
      .catch((err) => {
        showAlertError(
          'Błąd',
          'Wystąpił błąd przy pobieraniu danych z serwera.'
        )
      })
  }
  const fetchYourRooms = async () => {
    setLoading(true)
    await api
      .get('/api/rooms/all-rooms/')
      .then((res) => {
        setRooms(res.data)
      })
      .catch((err) => {
        showAlertError(
          'Błąd',
          'Wystąpił błąd przy pobieraniu danych z serwera.'
        )
      })

    await api
      .get('/api/rooms/all-archivized-rooms/')
      .then((res) => {
        setArchivizedRooms(res.data)
      })
      .catch((err) => {
        showAlertError(
          'Błąd',
          'Wystąpił błąd przy pobieraniu danych z serwera.'
        )
      })
    setLoading(false)
  }

  useEffect(() => {
    fetchYourRooms()
  }, [])

  return (
    <>
      <div className="w-full">
        <div className="absolute left-0 right-0 top-[70px] h-[500px] bg-base-300 max-phone:hidden"></div>

        <div className="card mx-auto mb-10 mt-10 h-full rounded-md bg-white px-5 py-5 shadow-xl max-lg:w-full">
          <div className="m-auto h-full w-full">
            <h1 className="text-center text-xl font-bold uppercase tracking-wider text-gray-700">
              Twoje pokoje
            </h1>

            <div className="my-4 border-b-[1px] border-base-100"></div>
            {loading ? (
              <LoadingComponent message="Ładowanie pokoi..." />
            ) : (
              <div className="mb-10 flex w-full items-center justify-center">
                {rooms.length == 0 && (
                  <div className="h-full">
                    {user?.role == 'Student' ? (
                      <div className="flex h-full w-full flex-col items-center justify-center">
                        <h2>Brak pokoi.</h2>
                        <Link
                          className="btn-outline no-animation btn  mt-2 h-10 !min-h-0 rounded-none border-base-400 py-0 hover:bg-base-400 max-md:w-full max-phone:mx-auto"
                          to="/search-classes"
                        >
                          Kup swoje pierwsze zajęcia już teraz
                        </Link>
                      </div>
                    ) : (
                      <div className="flex w-full justify-center">
                        <h2 className="text-center">
                          Nie masz żadnych aktywnych pokoi.
                        </h2>
                      </div>
                    )}
                  </div>
                )}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {rooms?.map((room, i) => (
                    <RoomCard room={room} user={user} key={room.room_id} />
                  ))}
                </div>
              </div>
            )}
            <h1 className="flex flex-row items-center justify-center gap-x-2 text-center text-xl font-bold uppercase tracking-wider text-gray-700">
              <div
                className="tooltip"
                data-tip="Pokoje, w których zostałeś sam - druga osoba opuściła pokój."
              >
                <AiOutlineQuestionCircle />
              </div>
              <span>Zarchiwizowane pokoje</span>
            </h1>

            <div className="my-4 border-b-[1px] border-base-100"></div>
            {loading ? (
              <LoadingComponent message="Ładowanie pokoi..." />
            ) : (
              <div className="mb-10 flex w-full justify-center">
                {archivizedRooms?.length == 0 && (
                  <div className="h-full">
                    {user?.role == 'Student' ? (
                      <div className="flex h-full w-full flex-col justify-center">
                        <h2 className="text-center">
                          Nie masz żadnych zarchiwizowanych pokoi.
                        </h2>
                      </div>
                    ) : (
                      <div className="flex h-full w-full  flex-col justify-center">
                        <h2>Nie masz żadnych zarchiwizowanych pokoi.</h2>
                      </div>
                    )}
                  </div>
                )}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {archivizedRooms?.map((room, i) => (
                    <ArchivizedRoomCard room={room} key={room.room_id} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default StartedRoomsPage
