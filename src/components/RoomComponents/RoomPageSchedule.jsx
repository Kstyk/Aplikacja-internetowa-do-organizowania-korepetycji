import React, { useState, useEffect } from 'react'
import LoadingComponent from '../GeneralComponents/LoadingComponent'
import useAxios from '../../utils/useAxios'
import RoomSchedule from '../ScheduleComponents/RoomSchedule'
import dayjs from 'dayjs'

const RoomPageSchedule = ({ roomId }) => {
  const [loading, setLoading] = useState(true)
  const [schedule, setSchedule] = useState([])
  const [nextSchedule, setNextSchedule] = useState(null)

  const api = useAxios()
  const fetchSchedule = async () => {
    setLoading(true)
    await api
      .get(`api/rooms/${roomId}/schedules/`)
      .then((res) => {
        setLoading(false)
        setSchedule(res.data.schedules)
        setNextSchedule(res.data.next_schedule)
      })
      .catch((err) => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchSchedule()
  }, [roomId])

  return (
    <div className="mt-10">
      {loading ? (
        <div className="relative rounded-md bg-white py-5 shadow-xl">
          <LoadingComponent message="Ładowanie harmonogramu" />
        </div>
      ) : (
        <>
          <div className="card mb-5 rounded-md bg-white p-4 shadow-xl">
            <h2 className="mb-3 border-b-[1px] text-xl font-bold uppercase tracking-wide text-gray-700">
              Najbliższe zajęcia
            </h2>
            {nextSchedule == null ? (
              <span>Brak zajęć</span>
            ) : (
              <>
                <span>
                  {dayjs(nextSchedule?.date).format(
                    'dddd, DD-MM-YYYY, g. HH:mm'
                  )}{' '}
                  -{' '}
                  <span className="font-bold">
                    {nextSchedule?.place_of_classes}
                  </span>
                </span>
                <span className="font-bold uppercase">
                  {nextSchedule?.classes?.name}
                </span>
              </>
            )}
          </div>
          <RoomSchedule schedule={schedule} />
        </>
      )}
    </div>
  )
}

export default RoomPageSchedule
