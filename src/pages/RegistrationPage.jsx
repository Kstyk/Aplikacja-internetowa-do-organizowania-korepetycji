import React, { useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import Select from "react-select";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import transparent_logo from "../assets/transparent_logo.png";
import { Link } from "react-router-dom";
import useAxios from "../utils/useAxios";
import { backendUrl } from "../variables/backendUrl";
import showSuccessAlert from "../components/messages/SwalAlertSuccess";

const RegistrationPage = () => {
  const api = useAxios();
  const { loginUser } = useContext(AuthContext);
  const [roles, setRoles] = useState([]);
  const [backendErrors, setBackendErrors] = useState({});
  const nav = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm();

  const registerOptions = {
    first_name: { required: "Imię jest wymagane." },
    last_name: { required: "Nazwisko jest wymagane." },
    email: { required: "Email jest wymagany." },
    password: {
      required: "Hasło jest wymagane.",
      minLength: {
        value: 8,
        message: "Hasło musi mieć przynajmniej 8 znaków.",
      },
    },
    confirm_password: {
      required: "Musisz powtórzyć hasło.",
      validate: (val) => {
        if (watch("password") != val) {
          return "Hasła nie są identyczne.";
        }
      },
    },
    role: {
      required: "Rola jest wymagana.",
    },
  };

  const selectOptions = roles;

  const onSubmit = (data) => {
    let role = data.role.value;

    data.role = role;

    axios
      .post(`${backendUrl}/api/users/register/`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        showSuccessAlert(
          "Sukces",
          "Poprawnie zarejestrowano. Teraz możesz się zalogować.",
          () => {
            nav("/login");
          }
        );
      })
      .catch((err) => {
        setBackendErrors(JSON.parse(err.request.response));
      });
  };

  const handleError = (errors) => {};

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    await api
      .get("/api/users/roles/")
      .then((res) => {
        setRoles(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <div className="absolute top-[70px] left-0 right-0 h-[200px] max-phone:hidden bg-base-300 "></div>
      <div className="md:text-2xl max-md:text-xl max-phone:text-lg card bg-white rounded-md mt-10 mb-5 text-center p-4 flex flex-col phone:flex-row justify-between items-center z-30 shadow-xl w-10/12 max-lg:w-full max-md:w-8/12 max-phone:w-full mx-auto">
        <h1 className="text-center w-full">Rejestracja</h1>
      </div>
      <div className="bg-white card shadow-xl h-full px-5 pt-5 pb-5 rounded-md mb-10 mx-auto w-10/12 max-lg:w-full max-md:w-8/12 max-phone:w-full flex flex-row max-md:flex-col">
        <div className="flex flex-col justify-center w-6/12 max-md:w-full mx-auto py-20 px-5 max-md:py-10">
          <img src={transparent_logo} alt="logo" />
          <p className="text-center mt-5 text-lg">
            Masz już konto?{" "}
            <Link to="/login" className="hover:underline">
              Zaloguj się już teraz!
            </Link>
          </p>
        </div>
        <div className="border-r-2 border-base-200 mr-5"></div>
        <form
          onSubmit={handleSubmit(onSubmit, handleError)}
          className="flex flex-col justify-center w-6/12 space-y-4 max-md:w-full mx-auto"
        >
          <div className="items-center">
            <div className="flex flex-col float-right w-full">
              <input
                type="email"
                className="h-10 px-2 border-[1px] border-base-200 bg-transparent outline-none w-full relative hover:border-[#aaabac] rounded-sm"
                name="email"
                placeholder="Wprowadź email..."
                id="email"
                {...register("email", registerOptions.email)}
              />
              <small className="text-red-400 text-right">
                {errors?.email && errors.email.message}
                {backendErrors?.email?.map((e, i) => (
                  <span key={i}>
                    {e} <br />
                  </span>
                ))}
              </small>
            </div>
          </div>
          <div className="items-center">
            <div className="flex flex-col float-right w-full">
              <input
                type="password"
                className="h-10 px-2 border-[1px] border-base-200 bg-transparent outline-none w-full relative hover:border-[#aaabac] rounded-sm"
                name="password"
                placeholder="Podaj hasło..."
                id="password"
                {...register("password", registerOptions.password)}
              />
              <small className="text-red-400 text-right">
                {errors?.password && errors.password.message}
                {backendErrors?.password?.map((e, i) => (
                  <span key={i}>
                    {e} <br />
                  </span>
                ))}
              </small>
            </div>
          </div>
          <div className="items-center">
            <div className="flex flex-col float-right w-full">
              <input
                type="password"
                className="h-10 px-2 border-[1px] border-base-200 bg-transparent outline-none w-full relative hover:border-[#aaabac] rounded-sm"
                id="confirm_password"
                placeholder="Powtórz hasło..."
                {...register(
                  "confirm_password",
                  registerOptions.confirm_password
                )}
              />
              <small className="text-red-400 text-right">
                {errors?.confirm_password && errors.confirm_password.message}
              </small>
            </div>
          </div>
          <div className="items-center">
            <div className="flex flex-col float-right w-full">
              <input
                name="first_name"
                id="first_name"
                placeholder="Podaj imię..."
                className="h-10 px-2 border-[1px] border-base-200 bg-transparent outline-none w-full relative hover:border-[#aaabac] rounded-sm"
                type="text"
                {...register("first_name", registerOptions.first_name)}
              />
              <small className="text-red-400 text-right">
                {errors?.first_name && errors.first_name.message}
                {backendErrors?.first_name?.map((e, i) => (
                  <span key={i}>
                    {e} <br />
                  </span>
                ))}
              </small>
            </div>
          </div>
          <div className="items-center">
            <div className="flex flex-col float-right w-full">
              <input
                name="last_name"
                id="last_name"
                placeholder="Podaj nazwisko..."
                className="h-10 px-2 border-[1px] border-base-200 bg-transparent outline-none w-full relative hover:border-[#aaabac] rounded-sm"
                type="text"
                {...register("last_name", registerOptions.last_name)}
              />
              <small className="text-red-400 text-right">
                {errors?.last_name && errors.last_name.message}
                {backendErrors?.last_name?.map((e, i) => (
                  <span key={i}>
                    {e} <br />
                  </span>
                ))}
              </small>
            </div>
          </div>
          <div>
            <div className="flex flex-col float-right w-full">
              <Controller
                name="role"
                control={control}
                defaultValue=""
                rules={registerOptions.role}
                render={({ field }) => (
                  <Select
                    className="h-10"
                    placeholder="Wybierz rolę..."
                    options={selectOptions}
                    {...field}
                    label="Text field"
                    styles={{
                      control: (base) => ({
                        ...base,
                        boxShadow: "none",
                        borderRadius: "2px",
                        borderColor: "#BFEAF5",
                        backgroundColor: "transparent",
                      }),
                    }}
                  />
                )}
              />
              <small className="text-red-400 text-right">
                {errors?.role && errors.role.message}
                {backendErrors?.role?.map((e, i) => (
                  <span key={i}>
                    {e} <br />
                  </span>
                ))}
              </small>
            </div>
          </div>
          <hr />
          <button className="btn btn-outline no-animation w-full max-phone:mx-auto h-10 py-0 !min-h-0 rounded-sm mt-2 hover:bg-base-400 border-base-400">
            Zarejestruj
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
