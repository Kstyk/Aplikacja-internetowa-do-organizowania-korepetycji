import React, { useState, useEffect } from "react";
import SelectSlotsTeacherSchedule from "../components/schedules/SelectSlotsTeacherSchedule";
import useAxios from "../utils/useAxios";
import showAlertError from "../components/messages/SwalAlertError";
import showSuccessAlert from "../components/messages/SwalAlertSuccess";
import { timeslots } from "../variables/Timeslots";
import { days } from "../variables/Days";

const ModifyTimeslotsPage = () => {
  const [timeSlotsTeacher, setTimeSlotsTeacher] = useState([]);
  const api = useAxios();

  const editSchedule = () => {
    api
      .post(`/api/classes/timeslots/create/`, timeSlotsTeacher)
      .then((res) => {
        showSuccessAlert("Sukces", "Pomyślnie zedytowałeś swój harmonogram.");
      })
      .catch((err) => {
        showAlertError("Błąd", "Wystąpił błąd edycji harmonogramu.");
      });
  };

  return (
    <div className="pt-10">
      <div className="absolute top-[70px] left-0 right-0 h-[200px] bg-base-300"></div>

      <div className="card shadow-xl bg-white p-5 rounded-none mb-5">
        <h1 className="text-2xl text-center">Ustal swój harmonogram</h1>
        <div className="border-b-[1px] border-base-100 my-4"></div>
        <h2 className="text-lg text-center">Wybrane terminy:</h2>
        <section className="mb-3">
          {timeSlotsTeacher.map((slot) => (
            <div
              key={slot.day_of_week + "-" + slot.timeslot_index}
              className="text-center uppercase text-xs tracking-wide border-b-[1px] border-base-300 py-2"
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
                      (timeslot) => timeslot.timeslot === slot.timeslot_index
                    ).start
                  }{" "}
                  -{" "}
                  {
                    timeslots.find(
                      (timeslot) => timeslot.timeslot === slot.timeslot_index
                    ).end
                  }
                </span>
              ) : null}
            </div>
          ))}
        </section>

        <div className="w-full flex justify-center">
          <button
            onClick={() => editSchedule()}
            className="btn btn-outline no-animation h-10 py-0 !min-h-0 rounded-none mt-2 hover:bg-base-400 border-base-400 w-full md:w-6/12 lg:w-3/12 mb-2"
          >
            Edytuj harmonogram
          </button>
        </div>
        <div className="border-b-[1px] border-base-100 my-4"></div>

        <SelectSlotsTeacherSchedule
          timeSlotsTeacher={timeSlotsTeacher}
          setTimeSlotsTeacher={setTimeSlotsTeacher}
        />
      </div>
    </div>
  );
};

export default ModifyTimeslotsPage;
