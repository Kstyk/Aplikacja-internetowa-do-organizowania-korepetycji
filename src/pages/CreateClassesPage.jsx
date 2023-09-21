import React from "react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import useAxios from "../utils/useAxios";
import { useNavigate } from "react-router-dom";
import Editor from "../components/TextEditor/Editor";
import { useEffect } from "react";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import showSuccessAlert from "../components/messages/SwalAlertSuccess";
import showAlertError from "../components/messages/SwalAlertError";

const CreateClassesPage = () => {
  const api = useAxios();
  const nav = useNavigate();

  const [loadingCity, setLoadingCity] = useState(false);
  const [cities, setCities] = useState([]);
  const [backendErrors, setBackendErrors] = useState([]);
  const [isStationary, setIsStationary] = useState(false);
  const [descriptionHtml, setDescriptionHtml] = useState(null);
  const [languages, setLanguages] = useState([]);

  const customSelectStyle = {
    control: (base) => ({
      ...base,
      boxShadow: "none",
      borderRadius: "2px",
      borderColor: "#BFEAF5",
      "&:hover": {
        border: "1px solid #aaabac",
      },
    }),
  };
  const {
    register,
    handleSubmit,
    setValue,
    control,
    getValues,
    formState: { errors },
  } = useForm({
    mode: "all",
  });

  const addClassesOptionValidation = {
    cities_of_classes: {
      required:
        "Musisz wybrać przynajmniej jedno miasto przy zajęciach stacjonarnych.",
    },
    name: {
      required: "Nazwa zajęć jest wymagana.",
    },
    price_for_lesson: {
      required: "Cena zajęć jest wymagana.",
      min: {
        value: 1,
        message: "Minimalna cena za godzinę zajęć to 1 PLN.",
      },
    },
    language: {
      required: "Język zajęć jest wymagany.",
    },
  };

  const onSubmit = (formData) => {
    formData?.place_of_classes?.map(
      (place, i) => (formData.place_of_classes[i] = place.value)
    );

    formData?.cities_of_classes?.map(
      (city, i) => (formData.cities_of_classes[i] = city.id)
    );

    if (
      descriptionHtml != null &&
      descriptionHtml != formData.description &&
      formData.description.length > 0
    ) {
      formData.description = descriptionHtml;
    } else {
      formData.description = null;
    }

    api
      .post(`/api/classes/create/`, formData)
      .then((res) => {
        showSuccessAlert("Sukces!", res?.data?.success);
      })
      .catch((err) => {
        setBackendErrors(JSON.parse(err.request.response));
      });
  };

  const fetchLanguages = async () => {
    await api
      .get(`/api/classes/languages`)
      .then((res) => {
        setLanguages(res.data);
      })
      .catch((err) => {
        showAlertError(
          "Błąd",
          "Wystąpił błąd przy pobieraniu danych z serwera, przepraszamy."
        );
      });
  };

  const fetchCities = async (e) => {
    setLoadingCity(true);
    if (e.trim() != "") {
      await api
        .get(`/api/users/address/cities/?name=${e}`)
        .then((res) => {
          setCities(res.data);
          setLoadingCity(false);
        })
        .catch((err) => {
          setLoadingCity(false);
        });
    } else {
      setCities([]);
      setLoadingCity(false);
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  return (
    <div className="pt-10">
      <div className="absolute top-[70px] left-0 right-0 h-[200px] bg-base-300 max-phone:hidden"></div>

      <div className="bg-white card shadow-xl h-full px-5 py-5 rounded-md mb-10 mx-auto w-8/12 max-lg:w-full max-md:w-8/12 max-phone:w-full">
        <h1 className="text-2xl text-center">Dodaj nowe zajęcia</h1>
        <div className="border-b-[1px] border-base-100 my-4"></div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col justify-center space-y-4"
        >
          <div className="items-center">
            <div className="flex flex-col float-right w-full">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="name"
              >
                Nazwa zajęć
              </label>
              <input
                type="text"
                className=" h-10 px-2 border-[1px] border-base-200 bg-transparent outline-none w-full relative hover:border-[#aaabac] rounded-sm"
                name="name"
                placeholder="Nazwa zajęć"
                id="name"
                {...register("name", addClassesOptionValidation.name)}
              />
              <small className="text-red-400 text-right">
                {errors?.name && errors.name.message}
                {backendErrors?.name?.map((e, i) => (
                  <span key={i}>
                    {e} <br />
                  </span>
                ))}
              </small>
            </div>
          </div>
          <div className="items-center">
            <div className="flex flex-col float-right w-full">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="price_for_lesson"
              >
                Cena za godzinę zajęć
              </label>
              <input
                type="number"
                className=" h-10 px-2 border-[1px] border-base-200 bg-transparent outline-none w-full relative hover:border-[#aaabac] rounded-sm"
                name="price_for_lesson"
                placeholder="Cena zajęć"
                id="price_for_lesson"
                {...register(
                  "price_for_lesson",
                  addClassesOptionValidation.price_for_lesson
                )}
              />
              <small className="text-red-400 text-right">
                {errors?.price_for_lesson && errors.price_for_lesson.message}
                {backendErrors?.price_for_lesson?.map((e, i) => (
                  <span key={i}>
                    {e} <br />
                  </span>
                ))}
              </small>
            </div>
          </div>
          <div className="items-center">
            <div className="flex flex-col float-right w-full">
              <label
                className="uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 flex flex-row gap-x-2 items-center"
                htmlFor="able_to_buy"
              >
                Dostępność do zakupu{" "}
                <div
                  className="tooltip normal-case"
                  data-tip="Jeśli zaznaczysz to pole, zajęcia będą natychmiastowo dostępne do zakupu."
                >
                  <AiOutlineQuestionCircle className="h-4 w-4" />
                </div>
              </label>
              <div className="flex flex-row justify-start gap-x-3 items-center">
                <input
                  type="checkbox"
                  className="checkbox checked:bg-base-400"
                  name="able_to_buy"
                  placeholder="Cena zajęć"
                  id="able_to_buy"
                  {...register("able_to_buy")}
                />
                <label htmlFor="">Dostępne</label>
              </div>
              <small className="text-red-400 text-right">
                {errors?.able_to_buy && errors.able_to_buy.message}
                {backendErrors?.able_to_buy?.map((e, i) => (
                  <span key={i}>
                    {e} <br />
                  </span>
                ))}
              </small>
            </div>
          </div>
          <div className="items-center">
            <div className="flex flex-col float-right w-full">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="language"
              >
                Język zajęć
              </label>
              <Controller
                name="language"
                control={control}
                rules={addClassesOptionValidation.language}
                render={({ field }) => (
                  <Select
                    className="px-0 w-full text-gray-500 border-none shadow-none"
                    menuPortalTarget={document.body}
                    isClearable
                    options={languages}
                    {...field}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id}
                    placeholder={
                      <span className="text-gray-400">Język zajęć</span>
                    }
                    noOptionsMessage={() => "Nie znaleziono"}
                    styles={customSelectStyle}
                  />
                )}
              />
              <small className="text-red-400 text-right">
                {errors?.language && errors.language.message}
                {backendErrors?.language?.map((e, i) => (
                  <span key={i}>
                    {e} <br />
                  </span>
                ))}
              </small>
            </div>
          </div>
          <div className="items-center">
            <div className="flex flex-col float-right w-full">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="place_of_classes"
              >
                Rodzaj zajęć
              </label>
              <Controller
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    className="px-0 w-full text-gray-500 border-none shadow-none"
                    menuPortalTarget={document.body}
                    isClearable
                    isMulti
                    options={[
                      { label: "Stacjonarnie", value: "stationary" },
                      { label: "Online", value: "online" },
                    ]}
                    getOptionLabel={(option) => option.label}
                    getOptionValue={(option) => option.value}
                    placeholder={
                      <span className="text-gray-400">Rodzaj zajęć</span>
                    }
                    noOptionsMessage={() => "Nie znaleziono"}
                    styles={customSelectStyle}
                    onChange={(selectedOption) => {
                      setIsStationary(
                        selectedOption.find((opt) => opt.value == "stationary")
                      );
                      setValue("place_of_classes", selectedOption);
                    }}
                  />
                )}
                name={"place_of_classes"}
              />
              <small className="text-red-400 text-right">
                {errors?.city_of_classes && errors.city_of_classes.message}
                {backendErrors?.city_of_classes?.map((e, i) => (
                  <span key={i}>
                    {e} <br />
                  </span>
                ))}
              </small>
            </div>
          </div>
          {isStationary && (
            <div className="items-center">
              <div className="flex flex-col float-right w-full">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="city_of_classes"
                >
                  Miasto zajęć stacjonarnych{" "}
                </label>
                <Controller
                  name="cities_of_classes"
                  control={control}
                  render={({ field }) => (
                    <Select
                      className="px-0 w-full text-gray-500 border-none shadow-none"
                      menuPortalTarget={document.body}
                      isClearable
                      isMulti
                      options={cities}
                      {...field}
                      onInputChange={(e) => {
                        fetchCities(e);
                      }}
                      getOptionLabel={(option) =>
                        option.name + ", " + option.region_name
                      }
                      getOptionValue={(option) => option.id}
                      placeholder={
                        <span className="text-gray-400">Miasto</span>
                      }
                      noOptionsMessage={({ inputValue }) =>
                        loadingCity
                          ? "Szukanie miast..."
                          : !inputValue
                          ? "Wpisz tekst..."
                          : "Nie znaleziono"
                      }
                      styles={customSelectStyle}
                    />
                  )}
                />
                <small className="text-red-400 text-right">
                  {errors?.city_of_classes && errors.city_of_classes.message}
                  {backendErrors?.city_of_classes?.map((e, i) => (
                    <span key={i}>
                      {e} <br />
                    </span>
                  ))}
                </small>
              </div>
            </div>
          )}
          <div className="items-center">
            <div className="flex flex-col float-right w-full">
              <label
                htmlFor="description"
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              >
                Opis zajęć
              </label>
              <Editor
                setValue={setValue}
                setValueHtml={setDescriptionHtml}
                name="description"
                id="description"
                fieldName="description"
                {...register("description")}
              />
              <small className="text-red-400 text-right">
                {errors?.description && errors.description.message}
                {backendErrors?.description?.map((e, i) => (
                  <span key={i}>
                    {e} <br />
                  </span>
                ))}
              </small>
            </div>
          </div>
          <button className="btn btn-outline no-animation h-10 py-0 !min-h-0 rounded-sm mt-2 hover:bg-base-400 border-base-400 w-full md:w-6/12 mb-2">
            Dodaj zajęcia
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateClassesPage;
