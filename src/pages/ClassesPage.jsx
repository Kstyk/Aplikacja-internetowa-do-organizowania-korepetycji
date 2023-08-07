import React, { useEffect } from "react";
import useAxios from "../utils/useAxios";
import { useState } from "react";
import { useParams } from "react-router-dom";
import ClassesPageSchedule from "../components/schedules/ClassesPageSchedule";
import LoadingComponent from "../components/LoadingComponent";

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
    <div>
      {classes?.name}
      <div>
        <ClassesPageSchedule classes={classes} />
      </div>
    </div>
  );
};

export default ClassesPage;
