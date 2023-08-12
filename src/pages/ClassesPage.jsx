import React, { useEffect } from "react";
import useAxios from "../utils/useAxios";
import { useState } from "react";
import { useParams } from "react-router-dom";
import ClassesPageSchedule from "../components/schedules/ClassesPageSchedule";
import LoadingComponent from "../components/LoadingComponent";
import SelectSlotsTeacherSchedule from "../components/schedules/SelectSlotsTeacherSchedule";

const ClassesPage = () => {
  const api = useAxios();

  const [classes, setClasses] = useState(null);
  const [loading, setLoading] = useState(false);
  const { classesId } = useParams();

  const fetchClasses = async () => {
    setLoading(true);
    await api
      .get(`/api/classes/${classesId}`)
      .then((res) => {
        console.log(res.data);
        setClasses(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return (
    <div className="mt-3">
      <h1 className="text-2xl card bg-white rounded-none mb-5 text-center p-4 border-[1px] border-base-200">
        {classes?.name}
      </h1>
      <div className="card border-[1px] border-base-200 p-4 rounded-none bg-white">
        {/* <ClassesPageSchedule classes={classes} /> */}

        {/* <SelectSlotsTeacherSchedule /> */}
      </div>
    </div>
  );
};

export default ClassesPage;
