import React, { useRef, useEffect, useCallback, useContext } from "react";
import dayjs from "dayjs";
import "dayjs/locale/pl";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./schedule.scss";
import "./scheduleslotsteacher.scss";
import { useState } from "react";
import LoadingComponent from "../LoadingComponent";
import useAxios from "../../utils/useAxios";
import { timeslots } from "../../variables/Timeslots";
import CustomToolbar from "./CustomToolbar";
import Swal from "sweetalert2";
import CustomToolbarNoButtons from "./CustomToolbarNoButtons";
import AuthContext from "../../context/AuthContext";

const SelectSlotsTeacherSchedule = () => {
  const { user } = useContext(AuthContext);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  const [timeSlotsTeacher, setTimeSlotsTeacher] = useState([]);
  const [selected, setSelected] = useState([]);
  const [eventArray, setEventArray] = useState([]);
  dayjs.locale("pl");
  const localizer = dayjsLocalizer(dayjs);

  const today = new Date();

  const api = useAxios();

  const clickRef = useRef(null);

  const allFunctions = async () => {
    setLoading(true);
    await fetchTeacherTimeslots();
    setLoading(false);
  };

  useEffect(() => {
    if (user != null) {
      allFunctions();
    }
  }, [user]);

  const fetchTeacherTimeslots = async () => {
    await api
      .get(`/api/classes/${user?.user_id}/timeslots/`)
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
      localizer.format(start, "dddd", culture) +
      " — " +
      localizer.format(end, "dddd", culture),

    timeGutterFormat: (date, culture, localizer) =>
      localizer.format(date, "HH:mm", culture),

    agendaTimeFormat: (date, culture, localizer) =>
      localizer.format(date, "HH:mm", culture),
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

  const onSelectSlot = (slotInfo) => {
    window.clearTimeout(clickRef?.current);
    clickRef.current = window.setTimeout(() => {
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

      if (findTeacherSlot != null) {
        setTimeSlotsTeacher((current) =>
          current.filter((element) => findTeacherSlot != element)
        );
      } else {
        setTimeSlotsTeacher([...timeSlotsTeacher, clickedSlot]);
      }
    }, 50);
  };

  return (
    <Calendar
      localizer={localizer}
      defaultView="week"
      min={new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9)}
      max={new Date(today.getFullYear(), today.getMonth(), today.getDate(), 19)}
      views={{ week: true }}
      startAccessor="start"
      endAccessor="end"
      tooltipAccessor={null}
      style={{ height: 500 }}
      timeslots={1}
      step={60}
      formats={formats}
      components={{ toolbar: CustomToolbarNoButtons }}
      slotPropGetter={slotPropGetter}
      onSelectSlot={onSelectSlot}
      selectable="ignoreEvents"
    />
  );
};

export default SelectSlotsTeacherSchedule;
