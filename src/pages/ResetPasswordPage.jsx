import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useAxios from "../utils/useAxios";
import transparent_logo from "../assets/transparent_logo.png";
import showAlertError from "../components/messages/SwalAlertError";
import LoadingComponent from "../components/LoadingComponent";
import { useParams } from "react-router-dom";
import { BiShow } from "react-icons/bi";
import showSuccessAlert from "../components/messages/SwalAlertSuccess";
import { useNavigate } from "react-router-dom";

const ResetPasswordPage = () => {
  const api = useAxios();
  const nav = useNavigate();
  const { token } = useParams();
  const [loading, setLoading] = useState(false);
  const [backendErrors, setBackendErrors] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: "all" });

  const resetOptions = {
    new_password: {
      required: "Hasło jest wymagane.",
      minLength: {
        value: 8,
        message: "Hasło musi mieć przynajmniej 8 znaków.",
      },
    },
    confirm_password: {
      required: "Musisz powtórzyć hasło.",
      validate: (val) => {
        if (watch("new_password") != val) {
          return "Hasła nie są identyczne.";
        }
      },
    },
  };

  const onSubmit = (data) => {
    data = {
      ...data,
      token: token,
    };

    setLoading(true);

    api
      .post(`/api/users/reset-password/`, data)
      .then((res) => {
        setLoading(false);
        showSuccessAlert(
          "Sukces!",
          "Pomyślnie zmieniono hasło, możesz teraz się zalogować.",
          () => {
            nav("/logowanie");
          }
        );
      })
      .catch((err) => {
        if (err.response.status == 400) {
          showAlertError("Błąd", err.response.data.error);
        }
        setBackendErrors(err.response.data);
        setLoading(false);
      });
  };

  const changeVisibility = (input) => {
    if (input == "new_password") {
      let inp = document.getElementById("new_password");
      if (inp.type === "password") {
        inp.type = "text";
      } else {
        inp.type = "password";
      }
    }

    if (input == "confirm_password") {
      let inp = document.getElementById("confirm_password");
      if (inp.type === "password") {
        inp.type = "text";
      } else {
        inp.type = "password";
      }
    }
  };

  return (
    <div className="pt-10">
      <div className="absolute top-[70px] left-0 right-0 h-[200px] bg-base-300 max-phone:hidden"></div>

      <div className="bg-white card shadow-xl h-full px-5rounded-none mb-10 mx-auto w-10/12 max-lg:w-full flex-col max-md:w-8/12 max-phone:w-full pt-5 pb-10 px-5 rounded-md">
        <div className="flex flex-col justify-center w-8/12 max-md:w-full mx-auto py-5 px-5">
          <img src={transparent_logo} alt="logo" />
        </div>
        <div className="border-base-200 border-b-[1px] mb-5"></div>

        <h2 className="text-2xl text-center">
          Zresetuj hasło do swojego konta
        </h2>
        {loading ? (
          <LoadingComponent message="Zmienianie hasła..." />
        ) : (
          <>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col justify-center w-8/12 max-md:w-full mx-auto mt-5 space-y-4"
            >
              <div className="items-center">
                <div className="flex flex-col float-right w-full">
                  <div className="w-full relative">
                    <input
                      type="password"
                      className="h-10 px-2 border-[1px] border-base-200 bg-transparent outline-none w-full relative hover:border-[#aaabac] rounded-sm"
                      name="new_password"
                      placeholder="Podaj nowe hasło..."
                      id="new_password"
                      {...register("new_password", resetOptions.new_password)}
                    />
                    <BiShow
                      className="absolute right-1 text-slate-300 top-[20%] h-6 w-6"
                      onClick={() => changeVisibility("new_password")}
                    />
                  </div>
                  <small className="text-red-400 text-right">
                    {errors?.new_password && errors.new_password.message}
                    {backendErrors?.new_password?.map((e, i) => (
                      <span key={i}>
                        {e} <br />
                      </span>
                    ))}
                  </small>
                </div>
              </div>
              <div className="items-center">
                <div className="flex flex-col float-right w-full">
                  <div className="w-full relative">
                    <input
                      type="password"
                      className="h-10 px-2 border-[1px] border-base-200 bg-transparent outline-none w-full relative hover:border-[#aaabac] rounded-sm"
                      id="confirm_password"
                      placeholder="Powtórz nowe hasło..."
                      {...register(
                        "confirm_password",
                        resetOptions.confirm_password
                      )}
                    />
                    <BiShow
                      className="absolute right-1 text-slate-300 top-[20%] h-6 w-6"
                      onClick={() => changeVisibility("confirm_password")}
                    />
                  </div>
                  <small className="text-red-400 text-right">
                    {errors?.confirm_password &&
                      errors.confirm_password.message}
                    {backendErrors?.confirm_password?.map((e, i) => (
                      <span key={i}>
                        {e} <br />
                      </span>
                    ))}
                  </small>
                </div>
              </div>
              <button className="btn btn-outline no-animation w-full  max-phone:mx-auto h-10 py-0 !min-h-0 rounded-sm mt-5 hover:bg-base-400 border-base-400">
                Zmień hasło
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
