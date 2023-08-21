import React, { useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import Select from "react-select";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegistrationPage = () => {
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
    first_name: { required: "Imię jest wymagane" },
    last_name: { required: "Nazwisko jest wymagane" },
    // email: { required: "Email jest wymagany" },
    password: {
      required: "Hasło jest wymagane",
      minLength: {
        value: 8,
        message: "Hasło musi mieć przynajmniej 8 znaków",
      },
    },
    confirm_password: {
      required: "Musisz powtórzyć hasło",
      validate: (val) => {
        if (watch("password") != val) {
          return "Hasła nie są identyczne";
        }
      },
    },
  };

  const selectOptions = roles;

  const onSubmit = (data) => {
    let role = data.role.value;

    data.role = role;

    console.log(data);

    axios
      .post("http://localhost:8000/api/users/register/", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(data);
        nav("/login");
      })
      .catch((err) => {
        console.log(err);
        setBackendErrors(JSON.parse(err.request.response));
      });
  };

  const handleError = (errors) => {};

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    await axios
      .get("http://localhost:8000/api/users/roles/", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setRoles(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <div className="absolute top-[70px] left-0 right-0 h-[500px] bg-base-300 "></div>

      <div className="bg-base-100 card shadow-xl h-full px-5 py-5 mt-10 rounded-none mb-10 mx-auto">
        <form
          onSubmit={handleSubmit(onSubmit, handleError)}
          className="flex flex-col space-y-4 w-full m-auto h-full"
        >
          <h1 className="font-semibold text-2xl pb-3 border-b-2 border-base-200">
            Rejestracja
          </h1>

          <div className="items-center">
            <label className="float-left text-xl" htmlFor="email">
              Email
            </label>
            <div className="flex flex-col float-right w-2/4">
              <input
                type="email"
                className=" h-10 px-2 border-b-[1px] border-l-[1px] border-base-200 bg-transparent outline-none"
                name="email"
                placeholder="Wprowadź email..."
                id="email"
                {...register("email", registerOptions.email)}
              />
              <small className="text-red-400 text-right">
                {console.log(errors)}
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
            <label className="float-left text-xl" htmlFor="password">
              Hasło
            </label>
            <div className="flex flex-col float-right w-2/4">
              <input
                type="password"
                className=" h-10 px-2 border-b-[1px] border-l-[1px] border-base-200 bg-transparent outline-none"
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
            <label className="float-left text-xl" htmlFor="confirm_password">
              Powtórz hasło
            </label>
            <div className="flex flex-col float-right w-2/4">
              <input
                type="password"
                className=" h-10 px-2 border-b-[1px] border-l-[1px] border-base-200 bg-transparent outline-none"
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
            <label className="float-left text-xl" htmlFor="first_name">
              Imię
            </label>
            <div className="flex flex-col float-right w-2/4">
              <input
                name="first_name"
                id="first_name"
                placeholder="Podaj imię..."
                className=" h-10 px-2 border-b-[1px] border-l-[1px] border-base-200 bg-transparent outline-none"
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
            <label className="float-left text-xl" htmlFor="last_name">
              Nazwisko
            </label>
            <div className="flex flex-col float-right w-2/4">
              <input
                name="last_name"
                id="last_name"
                placeholder="Podaj nazwisko..."
                className=" h-10 px-2 border-b-[1px] border-l-[1px] border-base-200 bg-transparent outline-none"
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
            <label className="float-left text-xl" htmlFor="role">
              Rola
            </label>
            <div className="flex flex-col float-right w-2/4">
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
                        borderRadius: "none",
                        borderColor: "#BFEAF5",
                        backgroundColor: "transparent",
                      }),
                    }}
                  />
                )}
              />
              <small className="text-red-400 text-right">
                {backendErrors?.role?.map((e, i) => (
                  <span key={i}>
                    {e} <br />
                  </span>
                ))}
              </small>
            </div>
          </div>
          <hr />
          <button className="btn btn-outline no-animation w-3/12 max-md:w-5/12 max-phone:w-10/12 max-phone:mx-auto h-10 py-0 !min-h-0 rounded-none mt-2 hover:bg-base-400 border-base-400">
            Zarejestruj
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
