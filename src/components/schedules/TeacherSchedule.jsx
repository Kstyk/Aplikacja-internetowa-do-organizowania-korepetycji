import React, { useRef, useEffect, useCallback } from 'react'
import dayjs from 'dayjs'
import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './schedule.scss'
import { useState } from 'react'
import useAxios from '../../utils/useAxios'
import { timeslots } from '../../variables/Timeslots'
import CustomToolbar from './CustomToolbar'
import Swal from 'sweetalert2'

const TeacherSchedule = ({ teacherId }) => {
  const [loading, setLoading] = useState(false)
  const [eventArray, setEventArray] = useState([])
  dayjs.locale('pl')
  const localizer = dayjsLocalizer(dayjs)

  const [date, setDate] = useState(new Date())

  const api = useAxios()

  const fetchSchedule = async () => {
    await api
      .get(`/api/classes/${teacherId}/schedule`)
      .then((res) => {
        setEvents(res.data)
      })
      .catch((err) => {
        showAlertError(
          'Błąd',
          'Wystąpił błąd przy pobieraniu danych z serwera.'
        )
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
      className: 'eventCell',
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
      }

      setEventArray((curr) => [...curr, eventRecord])
    })
  }

  const allFunctions = async () => {
    setLoading(true)
    await fetchSchedule()
    setLoading(false)
  }

  useEffect(() => {
    if (teacherId != null) {
      allFunctions()
    }
  }, [teacherId])

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
    <div>
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
      />
    </div>
  )
}

export default TeacherSchedule
