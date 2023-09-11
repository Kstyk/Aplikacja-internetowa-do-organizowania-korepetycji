import React from "react";
import { useForm } from "react-hook-form";
import useAxios from "../../utils/useAxios";
import showAlertError from "../messages/SwalAlertError";

const RateTeacher = ({ teacher, student }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "all",
  });

  const api = useAxios();

  const onSubmit = (data) => {
    console.log(data);

    data.teacher = teacher.id;
    data.student = student.user_id;
    console.log(data);

    api
      .post(`api/classes/add-opinion/`, data)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        document.getElementById("rate_teacher").remove();
        if (err.response.data.teacher) {
          showAlertError(
            "Błąd",
            err.response.data.teacher.map((error) => error)
          );
        } else {
          showAlertError("Błąd", "Nieudane dodanie opinii.");
        }
        console.log(err);
      });
  };

  return (
    <dialog id="rate_teacher" className={`modal modal-middle`}>
      <div className="modal-box bg-white rounded-sm w-11/12 md:w-8/12 xl:w-6/12 max-w-5xl !z-20">
        <h3 className="font-bold text-lg text-gray-800 text-center">
          Wystaw ocenę dla:{" "}
          <span className="uppercase">
            {teacher?.first_name} {teacher?.last_name}
          </span>
        </h3>
        <div className="alert alert-info rounded-sm bg-blue-200 border-none mt-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-current shrink-0 w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span className="text-sm">
            Zastanów się dobrze, co chcesz wpisać w ocenie nauczyciela. Raz
            dodanej oceny już nie możesz edytować ani usuwać. Dodatkowo, dla
            każdego nauczyciela możesz dodać tylko jedną opinię.
          </span>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center "
        >
          <label
            htmlFor="workQuality"
            className="block text-sm leading-6 font-bold mt-8 text-center text-custom-darkgreen"
          >
            Ocena
          </label>
          <div className="rating phone:rating-lg flex justify-center">
            {Array.from({ length: 5 }, (_, index) => (
              <input
                key={index}
                type="radio"
                name="rate"
                {...register("rate")}
                value={`${index + 1}`}
                className="mask mask-star-2 bg-base-300"
              />
            ))}
          </div>
          <label
            htmlFor="meetingTheConditions"
            className="block text-sm leading-6 font-bold mt-2 text-center text-custom-darkgreen"
          >
            Komentarz
          </label>
          <textarea
            id="content"
            name="content"
            placeholder="Wprowadź tekst komentarza"
            {...register("content")}
            className="textarea w-full block rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-white focus:outline-none mt-2 min-h-12 h-32"
          />
          <button
            type="submit"
            className="btn btn-outline no-animation h-10 py-0 !min-h-0 rounded-none mt-2 hover:bg-base-400 border-base-400 w-full md:w-5/12 xl:w-4/12 mb-2"
          >
            Dodaj opinię
          </button>
        </form>
        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-outline no-animation h-10 py-0 !min-h-0 rounded-none mt-2 hover:bg-base-400 border-base-400 w-full mb-2">
              Zamknij
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default RateTeacher;
