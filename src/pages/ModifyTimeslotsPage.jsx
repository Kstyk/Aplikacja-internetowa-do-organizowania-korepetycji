import React, { useState } from 'react'
import SelectSlotsTeacherSchedule from '../components/schedules/SelectSlotsTeacherSchedule'
import useAxios from '../utils/useAxios'
import showAlertError from '../components/messages/SwalAlertError'
import showSuccessAlert from '../components/messages/SwalAlertSuccess'
import { timeslots } from '../variables/Timeslots'
import { days } from '../variables/Days'
import LoadingComponent from '../components/LoadingComponent'

const ModifyTimeslotsPage = () => {
  document.title = 'Edytuj harmonogram zajęć'

  const [timeSlotsTeacher, setTimeSlotsTeacher] = useState([])
  const [loading, setLoading] = useState(true)
  const [waitingForResponse, setWaitingForResponse] = useState(false)
  const api = useAxios()

  const editSchedule = () => {
    setWaitingForResponse(true)
    api
      .post(`/api/classes/timeslots/create/`, timeSlotsTeacher)
      .then((res) => {
        setWaitingForResponse(false)
        showSuccessAlert('Sukces', 'Pomyślnie zedytowałeś swój harmonogram.')
      })
      .catch((err) => {
        setWaitingForResponse(false)
        showAlertError('Błąd', 'Wystąpił błąd edycji harmonogramu.')
      })
  }

  return (
    <div className="pt-10">
      <div className="absolute left-0 right-0 top-[70px] h-[200px] bg-base-300 max-phone:hidden"></div>

      <div className="card mb-5 rounded-md bg-white p-5 shadow-xl">
        <h1 className="text-center text-xl font-bold uppercase tracking-wider">
          Ustal swój harmonogram
        </h1>
        <div className="my-4 border-b-[1px] border-base-100"></div>
        {loading ? (
          <LoadingComponent message="Ładowanie danych o harmonogramie" />
        ) : (
          <>
            <h2 className="text-center text-lg">Wybrane terminy:</h2>
            <section className="mb-3">
              {timeSlotsTeacher.map((slot) => (
                <div
                  key={slot.day_of_week + '-' + slot.timeslot_index}
                  className="border-b-[1px] border-base-300 py-2 text-center text-xs uppercase tracking-wide"
                >
                  {days.find((day) => day.id === slot.day_of_week) ? (
                    <span className="mr-2">
                      {days.find((day) => day.id === slot.day_of_week).name},
                    </span>
                  ) : null}
                  {timeslots.find(
                    (timeslot) => timeslot.timeslot === slot.timeslot_index
                  ) ? (
                    <span>
                      {
                        timeslots.find(
                          (timeslot) =>
                            timeslot.timeslot === slot.timeslot_index
                        ).start
                      }{' '}
                      -{' '}
                      {
                        timeslots.find(
                          (timeslot) =>
                            timeslot.timeslot === slot.timeslot_index
                        ).end
                      }
                    </span>
                  ) : null}
                </div>
              ))}
            </section>

            <div className="flex w-full justify-center">
              <button
                onClick={() => editSchedule()}
                className="btn-outline no-animation btn mb-2 mt-2 h-10 !min-h-0 w-full rounded-sm border-base-400 py-0 hover:bg-base-400 md:w-6/12 lg:w-3/12"
              >
                {waitingForResponse ? (
                  <span className="loading loading-spinner "></span>
                ) : (
                  'Edytuj harmonogram'
                )}
              </button>
            </div>
            <div className="my-4 border-b-[1px] border-base-100"></div>
          </>
        )}
        <SelectSlotsTeacherSchedule
          timeSlotsTeacher={timeSlotsTeacher}
          setTimeSlotsTeacher={setTimeSlotsTeacher}
          setLoading={setLoading}
        />
      </div>
    </div>
  )
}

export default ModifyTimeslotsPage
