import React from "react";
import { useForm } from "react-hook-form";
import useAxios from "../../utils/useAxios";
import showAlertError from "../messages/SwalAlertError";
import showSuccessAlert from "../messages/SwalAlertSuccess";
import Modal from "react-modal";
import { AiOutlineClose } from "react-icons/ai";

const RateTeacher = ({ teacher, student }) => {
  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {}

  function closeModal() {
    setIsOpen(false);
  }

  const customStyles = {
    overlay: {
      zIndex: 1000,
      background: "rgb(80,80,80, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "all",
  });

  const api = useAxios();

  const onSubmit = (data) => {
    if (data.rate == null) {
      data.rate = 5;
    }

    data.teacher = teacher.id;
    data.student = student.user_id;

    api
      .post(`api/classes/add-opinion/`, data)
      .then((res) => {
        closeModal();
        showSuccessAlert("Sukces!", "Pomyślnie dodałeś ocenę nauczycielowi.");
      })
      .catch((err) => {
        closeModal();
        if (err.response.status == 400) {
          if (err.response.data.exist_opinion) {
            showAlertError(
              "Błąd",
              err.response.data.exist_opinion.map((error) => error)
            );
          }
          if (err.response.data.student) {
            showAlertError(
              "Błąd",
              err.response.data.student.map((error) => error)
            );
          }
          if (err.response.data.teacher) {
            showAlertError(
              "Błąd",
              err.response.data.teacher.map((error) => error)
            );
          }
          if (err.response.data.rate) {
            showAlertError(
              "Błąd",
              err.response.data.rate.map((error) => error)
            );
          }
        } else {
          showAlertError("Błąd", "Nieudane dodanie opinii.");
        }
      });
  };

  return (
    <div className="flex items-center">
      <button
        className="hover:underline uppercase text-gray-500 text-xs phone:text-sm"
        onClick={openModal}
      >
        Oceń nauczyciela
      </button>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Oceń nauczyciela"
        className={`w-full rounded-sm phone:w-10/12 sm:w-8/12 md:w-6/12 bg-base-100 my-auto p-10 animate__animated animate__zoomIn`}
      >
        <button onClick={closeModal} className="float-right rounded-full">
          <AiOutlineClose className="h-6 w-6" />
        </button>
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
      </Modal>
    </div>
  );
};

export default RateTeacher;
