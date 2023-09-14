import React from "react";
import SelectSlotsTeacherSchedule from "../components/schedules/SelectSlotsTeacherSchedule";

const ModifyTimeslotsPage = () => {
  return (
    <div className="pt-10">
      <div className="absolute top-[70px] left-0 right-0 h-[200px] bg-base-300"></div>

      <div className="card shadow-xl bg-white p-5 rounded-none mb-5">
        <SelectSlotsTeacherSchedule />
      </div>
    </div>
  );
};

export default ModifyTimeslotsPage;
