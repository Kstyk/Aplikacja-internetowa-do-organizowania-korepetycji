import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useAxios from "../utils/useAxios";
import { useNavigate } from "react-router-dom";
import showSuccessAlert from "../components/messages/SwalAlertSuccess";
import { BiShow } from "react-icons/bi";

const ChangePasswordPage = () => {
  const api = useAxios();

  const [backendErrors, setBackendErrors] = useState({});
  const nav = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "all",
  });

  const changePasswordOptions = {
    old_password: {
      required: "Obecne hasło jest wymagane.",
    },
    new_password: {
      required: "Hasło jest wymagane.",
      minLength: {
        value: 8,
        message: "Hasło musi mieć przynajmniej 8 znaków.",
      },
    },
    confirm_new_password: {
      required: "Musisz powtórzyć hasło.",
      validate: (val) => {
        if (watch("new_password") != val) {
          return "Hasła nie są identyczne.";
        }
      },
    },
  };

  const onSubmit = (data) => {
    api
      .post(`/api/users/change-password/`, data)
      .then((res) => {
        showSuccessAlert(
          "Zmieniono hasło",
          "Pomyślnie zmieniłeś hasło do swojego konta",
          () => {
            nav("/profil");
          }
        );
      })
      .catch((err) => {
        setBackendErrors(err.response.data);
      });
  };

  const changeVisibility = (input) => {
    if (input == "old_password") {
      let inp = document.getElementById("old_password");
      if (inp.type === "password") {
        inp.type = "text";
      } else {
        inp.type = "password";
      }
    }

    if (input == "new_password") {
      let inp = document.getElementById("new_password");
      if (inp.type === "password") {
        inp.type = "text";
      } else {
        inp.type = "password";
      }
    }

    if (input == "confirm_new_password") {
      let inp = document.getElementById("confirm_new_password");
      if (inp.type === "password") {
        inp.type = "text";
      } else {
        inp.type = "password";
      }
    }
  };

  return (
    <>
      <div>
        <div className="absolute top-[70px] left-0 right-0 h-[500px] bg-base-300 "></div>

        <div className="bg-white card shadow-xl h-full px-5 py-5 mt-10 rounded-none mb-10 mx-auto w-8/12 max-lg:w-full max-md:w-8/12 max-phone:w-full">
          <h1 className="text-2xl text-center">Zmień hasło</h1>
          <div className="border-b-[1px] border-base-100 my-4"></div>
          <p className="text-justify text-sm">
            Tutaj możesz zmienić hasło. Musisz podać obecne hasło oraz
            dwukrotnie powtórzyć nowe hasło. Nowe hasło musi posiadać co
            najmniej 8 znaków, nie może być powszechnie używanym hasłem, nie
            może być podobne do twoich danych osobistych oraz nie może się
            składać tylko z cyfr.
          </p>
          <div className="border-b-[1px] border-base-100 my-4"></div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col justify-center w-10/12 space-y-4 max-md:w-full mx-auto"
          >
            <div className="items-center">
              <div className="flex flex-col float-right w-full">
                <div className="w-full relative">
                  <input
                    type="password"
                    className=" h-10 px-2 border-b-[1px] border-l-[1px] border-base-200 bg-transparent outline-none w-full relative"
                    name="old_password"
                    placeholder="Podaj obecne hasło..."
                    id="old_password"
                    {...register(
                      "old_password",
                      changePasswordOptions.old_password
                    )}
                  />
                  <BiShow
                    className="absolute right-1 text-slate-300 top-[20%] h-6 w-6"
                    onClick={() => changeVisibility("old_password")}
                  />
                </div>
                <small className="text-red-400 text-right">
                  {errors?.old_password && errors.old_password.message}
                  {backendErrors?.old_password?.map((e, i) => (
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
                    className=" h-10 px-2 border-b-[1px] border-l-[1px] border-base-200 bg-transparent outline-none w-full relative"
                    name="new_password"
                    placeholder="Podaj nowe hasło..."
                    id="new_password"
                    {...register(
                      "new_password",
                      changePasswordOptions.new_password
                    )}
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
                    className=" h-10 px-2 border-b-[1px] border-l-[1px] border-base-200 bg-transparent outline-none w-full relative"
                    id="confirm_new_password"
                    placeholder="Powtórz nowe hasło..."
                    {...register(
                      "confirm_new_password",
                      changePasswordOptions.confirm_new_password
                    )}
                  />
                  <BiShow
                    className="absolute right-1 text-slate-300 top-[20%] h-6 w-6"
                    onClick={() => changeVisibility("confirm_new_password")}
                  />
                </div>
                <small className="text-red-400 text-right">
                  {errors?.confirm_new_password &&
                    errors.confirm_new_password.message}
                  {backendErrors?.confirm_new_password?.map((e, i) => (
                    <span key={i}>
                      {e} <br />
                    </span>
                  ))}
                </small>
              </div>
            </div>
            <button className="btn btn-outline no-animation w-6/12 max-md:w-5/12 max-phone:w-full max-phone:mx-auto h-10 py-0 !min-h-0 rounded-none mt-2 hover:bg-base-400 border-base-400">
              Zmień hasło
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChangePasswordPage;
