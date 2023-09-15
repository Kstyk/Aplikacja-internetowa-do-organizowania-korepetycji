import React, { useRef, useEffect, useCallback } from "react";
import dayjs from "dayjs";
import "dayjs/locale/pl";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./schedule.scss";
import { useState } from "react";
import useAxios from "../../utils/useAxios";
import CustomToolbar from "./CustomToolbar";
import { timeslots } from "../../variables/Timeslots";

const RoomSchedule = ({ schedule }) => {
  const [loading, setLoading] = useState(true);
  const [eventArray, setEventArray] = useState([]);
  const [slotInfo, setSlotInfo] = useState(null);

  dayjs.locale("pl");
  const localizer = dayjsLocalizer(dayjs);

  const today = new Date();

  const api = useAxios();

  let formats = {
    dateFormat: "dd",

    dayFormat: (date, culture, localizer) =>
      localizer.format(date, "dd", culture),

    dayRangeHeaderFormat: ({ start, end }, culture, localizer) =>
      localizer.format(start, "DD-MM-YY", culture) +
      " — " +
      localizer.format(end, "DD-MM-YY", culture),

    timeGutterFormat: (date, culture, localizer) =>
      localizer.format(date, "HH:mm", culture),

    agendaTimeFormat: (date, culture, localizer) =>
      localizer.format(date, "HH:mm", culture),
  };

  const clickRef = useRef(null);

  const eventStyleGetter = useCallback(
    (event, start, end, isSelected) => ({
      className: "flex items-center classes-cell text-xs phone:text-sm",
    }),
    []
  );

  const setEvents = (schedule) => {
    setEventArray([]);
    schedule?.map((event) => {
      var findTimeslot = timeslots.find(
        (timeslot) => timeslot.start == dayjs(event.date).format("HH:mm")
      );

      var startDate = new Date(
        `${dayjs(event.date).format("YYYY-MM-DD")}T${findTimeslot?.start}`
      );
      var endDate = new Date(
        `${dayjs(event.date).format("YYYY-MM-DD")}T${findTimeslot?.end}`
      );

      let eventRecord = {
        id: event.id,
        start: startDate,
        end: endDate,
        title: "X",
        resource: event,
      };

      setEventArray((curr) => [...curr, eventRecord]);
    });
  };

  const onSelectEvent = (slotInfo) => {
    window.clearTimeout(clickRef?.current);
    setSlotInfo(slotInfo);
    clickRef.current = window.setTimeout(() => {
      window.my_modal_5.showModal(slotInfo);
    });
  };

  const allFunctions = async () => {
    setLoading(true);
    setEvents(schedule);
    setLoading(false);
  };

  useEffect(() => {
    if (schedule != null) {
      allFunctions();
    }
  }, [schedule]);

  return (
    <div>
      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <form method="dialog" className="modal-box !rounded-none">
          <h3 className="font-bold text-lg">
            {slotInfo?.resource?.classes?.name}
          </h3>
          <p>
            Język <span>{slotInfo?.resource?.classes?.language?.name}</span>
          </p>
          <p>Zajęcia {slotInfo?.resource?.place_of_classes}</p>
          <p>
            Data:{" "}
            {dayjs(slotInfo?.resource?.date).format(
              "dddd, DD-MM-YYYY, g. HH:mm"
            )}
          </p>
          <div className="modal-action">
            <button className="btn btn-outline no-animation min-h-0 h-8 rounded-none hover:bg-base-400 hover:text-white">
              Zamknij
            </button>
          </div>
        </form>
      </dialog>
      <Calendar
        localizer={localizer}
        events={eventArray}
        defaultView="week"
        min={
          new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9)
        }
        max={
          new Date(today.getFullYear(), today.getMonth(), today.getDate(), 19)
        }
        views={{ week: true }}
        startAccessor="start"
        endAccessor="end"
        tooltipAccessor="Kliknij po więcej informacji"
        timeslots={1}
        step={60}
        formats={formats}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={onSelectEvent}
        components={{ toolbar: CustomToolbar }}
      />
    </div>
  );
};

export default RoomSchedule;
