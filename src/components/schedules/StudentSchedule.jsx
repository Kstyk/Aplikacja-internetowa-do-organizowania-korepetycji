import React, { useRef, useEffect, useCallback } from 'react'
import dayjs from 'dayjs'
import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './schedule.scss'
import { useState } from 'react'
import useAxios from '../../utils/useAxios'
import { timeslots } from '../../variables/Timeslots'
import CustomToolbar from './CustomToolbar'
import { Link } from 'react-router-dom'
import './schedule.scss'
import LoadingComponent from '../LoadingComponent'

const TeacherSchedule = ({ studentId }) => {
  const [loading, setLoading] = useState(true)
  const [eventArray, setEventArray] = useState([])
  const [slotInfo, setSlotInfo] = useState(null)
  dayjs.locale('pl')
  const localizer = dayjsLocalizer(dayjs)

  const [date, setDate] = useState(new Date())

  const api = useAxios()

  const fetchSchedule = async () => {
    setLoading(true)
    await api
      .get(`/api/classes/${studentId}/student-schedule`)
      .then((res) => {
        setEvents(res.data)
        setLoading(false)
      })
      .catch((err) => {
        showAlertError(
          'Błąd',
          'Wystąpił błąd przy pobieraniu danych z serwera.'
        )
        setLoading(false)
      })
  }

  let formats = {
    dateFormat: 'dd',

    dayFormat: (date, culture, localizer) =>
      localizer.format(date, 'dd', culture),

    dayRangeHeaderFormat: ({ start, end }, culture, localizer) =>
      localizer.format(start, 'DD-MM-YY', culture) +
      ' — ' +
      localizer.format(end, 'DD-MM-YY', culture),

    timeGutterFormat: (date, culture, localizer) =>
      localizer.format(date, 'HH:mm', culture),

    agendaTimeFormat: (date, culture, localizer) =>
      localizer.format(date, 'HH:mm', culture),
  }

  const clickRef = useRef(null)

  useEffect(() => {
    setEvents()

    return () => {
      window.clearTimeout(clickRef?.current)
    }
  }, [])

  const eventStyleGetter = useCallback(
    (event, start, end, isSelected) => ({
      className: 'flex items-center classes-cell text-xs phone:text-sm',
    }),
    []
  )

  const setEvents = (schedule) => {
    setEventArray([])
    schedule?.map((event) => {
      var findTimeslot = timeslots.find(
        (timeslot) => timeslot.start == dayjs(event.date).format('HH:mm')
      )

      var startDate = new Date(
        `${dayjs(event.date).format('YYYY-MM-DD')}T${findTimeslot.start}`
      )
      var endDate = new Date(
        `${dayjs(event.date).format('YYYY-MM-DD')}T${findTimeslot.end}`
      )

      let eventRecord = {
        id: event.id,
        start: startDate,
        end: endDate,
        title: 'X',
        resource: event,
      }

      setEventArray((curr) => [...curr, eventRecord])
    })
  }

  const allFunctions = async () => {
    await fetchSchedule()
  }

  useEffect(() => {
    if (studentId != null) {
      allFunctions()
    }
  }, [studentId])

  const onSelectEvent = (slotInfo) => {
    window.clearTimeout(clickRef?.current)
    setSlotInfo(slotInfo)
    clickRef.current = window.setTimeout(() => {
      window.my_modal_5.showModal(slotInfo)
    })
  }

  const minTime = new Date()
  minTime.setHours(9, 0, 0)
  const maxTime = new Date()
  maxTime.setHours(19, 0, 0)
  const onNavigate = useCallback(
    (newDate) => {
      setDate(newDate)
    },
    [setDate]
  )
  return (
    <>
      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <form
          method="dialog"
          className="modal-box flex flex-col gap-y-2 !rounded-md"
        >
          <div>
            <h2 className="mx-auto w-fit border-b-2 border-b-base-400 px-3 text-center font-bold uppercase tracking-wider text-gray-700">
              Zajęcia
            </h2>
            <p className="mt-1 w-full text-center">
              {slotInfo?.resource?.classes?.name}
            </p>
          </div>
          <div>
            <h2 className="mx-auto w-fit border-b-2 border-b-base-400 px-3 text-center font-bold uppercase tracking-wider text-gray-700">
              Język zajęć
            </h2>
            <p className="mt-1 w-full text-center">
              Język <span>{slotInfo?.resource?.classes?.language?.name}</span>
            </p>
          </div>
          <div>
            <h2 className="mx-auto w-fit border-b-2 border-b-base-400 px-3 text-center font-bold uppercase tracking-wider text-gray-700">
              Rodzaj zajęć
            </h2>
            <p className="mt-1 w-full text-center">
              Zajęcia{' '}
              {slotInfo?.resource?.place_of_classes == 'stationary'
                ? 'stacjonarne'
                : 'online'}
              {slotInfo?.resource?.place_of_classes == 'stationary' &&
                `, ${slotInfo?.resource?.city_of_classes?.name}`}
            </p>
          </div>
          <div>
            <h2 className="mx-auto w-fit border-b-2 border-b-base-400 px-3 text-center font-bold uppercase tracking-wider text-gray-700">
              Data zajęć
            </h2>
            <p className="mt-1 w-full text-center">
              {dayjs(slotInfo?.resource?.date).format(
                'dddd, DD-MM-YYYY, g. HH:mm'
              )}
            </p>
          </div>

          <div className="modal-action mx-auto">
            {slotInfo?.resource?.room && (
              <Link
                to={`/pokoj/${slotInfo?.resource?.room}`}
                className="btn-outline no-animation btn h-8 min-h-0 rounded-sm hover:bg-base-400 hover:text-white"
              >
                Przejdź do pokoju zajęć
              </Link>
            )}
            <button className="btn-outline no-animation btn h-8 min-h-0 rounded-sm hover:bg-base-400 hover:text-white">
              Zamknij
            </button>
          </div>
        </form>
      </dialog>
      {loading ? (
        <LoadingComponent message="Ładowanie harmonogramu" />
      ) : (
        <Calendar
          date={date}
          localizer={localizer}
          events={eventArray}
          defaultView="week"
          min={minTime}
          max={maxTime}
          views={{ week: true }}
          startAccessor="start"
          endAccessor="end"
          tooltipAccessor={null}
          timeslots={1}
          step={60}
          formats={formats}
          eventPropGetter={eventStyleGetter}
          selectable="ignoreEvents"
          components={{ toolbar: CustomToolbar }}
          onNavigate={onNavigate}
          onSelectEvent={onSelectEvent}
        />
      )}
    </>
  )
}

export default TeacherSchedule
