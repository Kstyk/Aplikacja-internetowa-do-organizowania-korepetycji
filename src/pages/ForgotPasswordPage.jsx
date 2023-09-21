import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useAxios from "../utils/useAxios";
import transparent_logo from "../assets/transparent_logo.png";
import showAlertError from "../components/messages/SwalAlertError";
import LoadingComponent from "../components/LoadingComponent";

const ForgotPasswordPage = () => {
  const api = useAxios();
  const [loading, setLoading] = useState(false);
  const [isSended, setIsSended] = useState(false);

  const { register, handleSubmit, formState } = useForm({ mode: "all" });

  const resetOptions = {
    email: {
      required: "Email jest wymagany.",
    },
  };

  const onSubmit = (data) => {
    setLoading(true);

    api
      .post(`/api/users/reset-password-request/`, data)
      .then((res) => {
        setIsSended(true);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response.status == 404) {
          showAlertError("Błąd", err.response.data.error);
        }
        setLoading(false);
      });
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
          <LoadingComponent message="Oczekiwanie na odpowiedź serwera..." />
        ) : isSended ? (
          <div className="text-center mt-3 w-6/12 mx-auto">
            Wysłaliśmy link do resetu hasła na podany przez Ciebie email.
            Przejdź pod link wysłany w mailu w celu zresetowania hasła.
          </div>
        ) : (
          <>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col justify-center w-8/12 max-md:w-full mx-auto mt-5"
            >
              <div className="items-center mb-5">
                <input
                  type="email"
                  className="h-10 px-2 border-[1px] border-base-200 bg-transparent outline-none w-full relative hover:border-[#aaabac] rounded-sm"
                  name="email"
                  {...register("email")}
                  placeholder="Wprowadź email"
                  required
                />
              </div>
              <div className="border-base-200 border-b-[1px]"></div>
              <button className="btn btn-outline no-animation w-full  max-phone:mx-auto h-10 py-0 !min-h-0 rounded-sm mt-5 hover:bg-base-400 border-base-400">
                Wyślij link do resetowania hasła na podany email
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
export default ForgotPasswordPage;
