import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import useAxios from "../utils/useAxios";
import LoadingComponent from "../components/LoadingComponent";
import showSuccessAlert from "../components/messages/SwalAlertSuccess";
import showAlertError from "../components/messages/SwalAlertError";

const EditBaseProfile = () => {
  const { user } = useContext(AuthContext);
  const [backendErrors, setBackendErrors] = useState({});
  const [baseUser, setBaseUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const nav = useNavigate();
  const api = useAxios();
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    mode: "all",
  });

  const editUserOptions = {
    first_name: { required: "Imię jest wymagane." },
    last_name: { required: "Nazwisko jest wymagane." },
  };

  const fetchBaseUser = async () => {
    await api
      .get(`/api/users/profile/base-user/`)
      .then((res) => {
        setBaseUser(res.data);
        setValue("first_name", res.data.first_name);
        setValue("last_name", res.data.last_name);
      })
      .catch((err) => {
        showAlertError(
          "Błąd",
          "Nie udało się pobrać danych z serwera, przepraszamy."
        );
      });
  };

  const fetchRoles = async () => {
    await api
      .get("/api/users/roles/")
      .then((res) => {
        setRoles(res.data);
      })
      .catch((err) => {
        showAlertError(
          "Błąd",
          "Nie udało się pobrać danych z serwera, przepraszamy."
        );
      });
  };

  const fetchAll = async () => {
    setLoading(true);
    await fetchRoles();
    await fetchBaseUser();
    setLoading(false);
  };

  const onSubmit = (data) => {
    api
      .put(`/api/users/edit/`, data)
      .then((res) => {
        if (res.status == 200) {
          showSuccessAlert(
            "Sukces",
            "Twoje dane zostały zaktualizowane.",
            () => {
              nav("/profil");
            }
          );
        }
      })
      .catch((err) => {
        setBackendErrors(JSON.parse(err.request.response));
      });
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <>
      {loading ? (
        <LoadingComponent message="Pobieranie informacji..." />
      ) : (
        <>
          <div>
            <div className="absolute top-[70px] left-0 right-0 h-[200px] bg-base-300 max-phone:hidden"></div>

            <div className="bg-white card shadow-xl h-full px-5 py-5 mt-10 rounded-md mb-10 mx-auto w-8/12 max-lg:w-full max-md:w-8/12 max-phone:w-full">
              <h1 className="text-2xl text-center">
                Edytuj podstawowe informacje
              </h1>
              <div className="border-b-[1px] border-base-100 my-4"></div>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col justify-center w-10/12 space-y-4 max-md:w-full mx-auto"
              >
                <section>
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    className="h-10 px-2 border-[1px] border-[#E2E3E4] w-full bg-transparent outline-none rounded-sm"
                    style={{ color: "#999999" }}
                    name="email"
                    value={baseUser?.email}
                    disabled
                    placeholder="Wprowadź email..."
                    id="email"
                  />
                </section>
                <section>
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="first_name"
                  >
                    Imię
                  </label>
                  <div className="flex flex-col float-right w-full">
                    <input
                      name="first_name"
                      id="first_name"
                      placeholder="Podaj imię..."
                      className="h-10 px-2 border-[1px] border-base-200 bg-transparent outline-none w-full relative hover:border-[#aaabac] rounded-sm"
                      type="text"
                      {...register("first_name", editUserOptions.first_name)}
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
                </section>
                <section>
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="last_name"
                  >
                    Nazwisko
                  </label>
                  <div className="flex flex-col float-right w-full">
                    <input
                      name="last_name"
                      id="last_name"
                      placeholder="Podaj nazwisko..."
                      className="h-10 px-2 border-[1px] border-base-200 bg-transparent outline-none w-full relative hover:border-[#aaabac] rounded-sm"
                      type="text"
                      {...register("last_name", editUserOptions.last_name)}
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
                </section>
                <section>
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="role"
                  >
                    Rola
                  </label>
                  <div className="flex flex-col float-right w-full">
                    <Select
                      className="h-10"
                      name="role"
                      placeholder="Wybierz rolę..."
                      options={roles}
                      isDisabled={true}
                      defaultValue=""
                      value={{
                        value: baseUser?.role?.value,
                        label: baseUser?.role?.label,
                      }}
                      styles={{
                        control: (base) => ({
                          ...base,
                          boxShadow: "none",
                          borderRadius: "none",
                          borderColor: "#E2E3E4",
                          backgroundColor: "transparent",
                        }),
                      }}
                    />
                  </div>
                </section>
                <button className="btn btn-outline no-animation w-6/12 max-md:w-5/12 max-phone:w-full max-phone:mx-auto h-10 py-0 !min-h-0 rounded-sm mt-2 hover:bg-base-400 border-base-400">
                  Edytuj
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default EditBaseProfile;
