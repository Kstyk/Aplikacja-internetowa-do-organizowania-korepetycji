import React, { useRef, useEffect, useCallback } from "react";
import dayjs from "dayjs";
import "dayjs/locale/pl";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./schedule.scss";
import { useState } from "react";
import LoadingComponent from "../LoadingComponent";
import useAxios from "../../utils/useAxios";
import { timeslots } from "../../variables/Timeslots";
import CustomToolbar from "./CustomToolbar";
import Swal from "sweetalert2";

const ClassesPageSchedule = ({ classes }) => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  const [timeSlotsTeacher, setTimeSlotsTeacher] = useState([]);
  const [selected, setSelected] = useState([]);
  const [eventArray, setEventArray] = useState([]);
  dayjs.locale("pl");
  const localizer = dayjsLocalizer(dayjs);

  const today = new Date();

  const api = useAxios();

  const fetchSchedule = async () => {
    await api
      .get(`/api/classes/${classes?.teacher?.user?.id}/schedule`)
      .then((res) => {
        setSchedule(res.data);
        setEvents(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchTeacherTimeslots = async () => {
    await api
      .get(`/api/classes/${classes?.teacher?.user?.id}/timeslots/`)
      .then((res) => {
        setLoading(false);
        setTimeSlotsTeacher(res.data);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  let formats = {
    dateFormat: "dd",

    dayFormat: (date, culture, localizer) =>
      localizer.format(date, "dddd", culture),

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

  useEffect(() => {
    setEvents();

    return () => {
      window.clearTimeout(clickRef?.current);
    };
  }, []);

  const onSelectSlot = (slotInfo) => {
    window.clearTimeout(clickRef?.current);
    clickRef.current = window.setTimeout(() => {
      if (slotInfo.start > today) {
        var find = timeslots.find(
          (e) => e.start == dayjs(slotInfo.start).format("HH:mm")
        );
        let clickedSlot = {
          day_of_week: dayjs(slotInfo.start).day(),
          timeslot_index: find.timeslot,
        };

        let findTeacherSlot = timeSlotsTeacher.find(
          (slot) =>
            slot.day_of_week === clickedSlot.day_of_week &&
            slot.timeslot_index === clickedSlot.timeslot_index
        );

        findTeacherSlot = {
          ...findTeacherSlot,
          start: slotInfo.start,
          end: slotInfo.end,
        };

        if (findTeacherSlot != null) {
          if (
            selected?.find(
              (el) =>
                dayjs(el?.start).format("DD-MM-YYYYTHH:mm") ==
                  dayjs(findTeacherSlot.start).format("DD-MM-YYYYTHH:mm") &&
                dayjs(el?.end).format("DD-MM-YYYYTHH:mm") ==
                  dayjs(findTeacherSlot.end).format("DD-MM-YYYYTHH:mm")
            )
          ) {
            setSelected((current) =>
              current.filter(
                (element) =>
                  dayjs(element?.start).format("DD-MM-YYYYTHH:mm") !=
                    dayjs(findTeacherSlot.start).format("DD-MM-YYYYTHH:mm") &&
                  dayjs(element?.end).format("DD-MM-YYYYTHH:mm") !=
                    dayjs(findTeacherSlot.end).format("DD-MM-YYYYTHH:mm")
              )
            );
          } else {
            console.log(selected);
            setSelected((selected) => [...selected, findTeacherSlot]);
          }
        } else console.log(false);
      } else {
        const swalWithTailwindClasses = Swal.mixin({
          customClass: {
            confirmButton: "btn btn-success",
          },
          buttonsStyling: false,
        });

        swalWithTailwindClasses.fire({
          icon: "error",
          title: "Błąd",
          text: "Nie możesz wybrać daty dzisiejszej lub wcześniejszej.",
          customClass: {
            confirmButton:
              "btn btn-outline rounded-none outline-none border-[1px] text-black w-full",
            popup: "rounded-none bg-base-100",
          },
        });
      }
    }, 50);
  };

  const slotPropGetter = useCallback(
    (date) => {
      var find = eventArray.find(
        (event) =>
          dayjs(event.start).format("YYYY-MM-DDTHH:mm") ==
          dayjs(date).format("YYYY-MM-DDTHH:mm")
      );
      if (find == null) {
        const dayOfWeek = dayjs(date).day();
        const hour = dayjs(date).hour();

        const matchingTimeslot = timeSlotsTeacher?.filter(
          (timeslot) => timeslot.day_of_week === dayOfWeek
        );
        if (matchingTimeslot.length > 0) {
          const matchingTime = timeslots.filter((timeslot) => {
            let value = [];
            for (let i = 0; i < matchingTimeslot.length; i++) {
              let slot =
                timeslot.timeslot === matchingTimeslot[i].timeslot_index;
              if (slot) {
                value.push(timeslot);
              }
            }
            if (value.find((e) => e == timeslot)) return timeslot;
          });

          if (matchingTime) {
            let dayOfWeek = matchingTimeslot[0].day_of_week;
            for (let i = 0; i < matchingTime.length; i++) {
              if (
                hour >= parseInt(matchingTime[i].start.split(":")[0]) &&
                hour < parseInt(matchingTime[i].end.split(":")[0])
              ) {
                return {
                  className:
                    selected.length > 0 &&
                    selected?.find(
                      (el) =>
                        el?.day_of_week == dayOfWeek &&
                        el?.timeslot_index == matchingTime[i].timeslot &&
                        dayjs(el?.start).format("DD-MM-YYYYTHH:mm") ==
                          dayjs(date).format("DD-MM-YYYYTHH:mm")
                    )
                      ? "freeTimeSlot bg-base-200 hover:bg-base-300"
                      : "freeTimeSlot",
                };
              }
            }
          }
        }

        return {
          className: "slotDefault",
        };
      }
    },
    [timeSlotsTeacher, selected]
  );

  const eventStyleGetter = useCallback(
    (event, start, end, isSelected) => ({
      className: "eventCell",
    }),
    []
  );

  const setEvents = (schedule) => {
    setEventArray([]);
    schedule?.map((event) => {
      var findTimeslot = timeslots.find(
        (timeslot) => timeslot.start == dayjs(event.date).format("HH:mm")
      );

      console.log(findTimeslot);
      console.log(dayjs(event.date).format("YYYY-MM-DD"));
      var startDate = new Date(
        `${dayjs(event.date).format("YYYY-MM-DD")}T${findTimeslot.start}`
      );
      var endDate = new Date(
        `${dayjs(event.date).format("YYYY-MM-DD")}T${findTimeslot.end}`
      );

      let eventRecord = {
        id: event.id,
        start: startDate,
        end: endDate,
        title: "X",
      };

      setEventArray((curr) => [...curr, eventRecord]);
      console.log(eventArray);
    });
  };

  const allFunctions = async () => {
    setLoading(true);
    await fetchSchedule();
    await fetchTeacherTimeslots();
    setLoading(false);
  };

  useEffect(() => {
    if (classes != null) {
      allFunctions();
    }
  }, [classes]);

  return (
    <div>
      {loading ? (
        <LoadingComponent message="Ładowanie danych..." />
      ) : (
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
          tooltipAccessor={null}
          style={{ height: 500 }}
          timeslots={1}
          step={60}
          formats={formats}
          slotPropGetter={slotPropGetter}
          eventPropGetter={eventStyleGetter}
          onSelectSlot={onSelectSlot}
          selectable="ignoreEvents"
          components={{ toolbar: CustomToolbar }}
        />
      )}
    </div>
  );
};

export default ClassesPageSchedule;
