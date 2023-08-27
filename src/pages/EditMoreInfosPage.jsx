import React, { useState, useEffect } from "react";
import LoadingComponent from "../components/LoadingComponent";
import { useForm, Controller } from "react-hook-form";
import useAxios from "../utils/useAxios";
import { useNavigate } from "react-router-dom";
import Editor from "../components/TextEditor/Editor";
import Select from "react-select";
import showSuccessAlert from "../components/messages/SwalAlertSuccess";

const EditMoreInfosPage = () => {
  const [loading, setLoading] = useState(true);
  const api = useAxios();

  const [backendErrors, setBackendErrors] = useState({});
  const [descriptionHtml, setDescriptionHtml] = useState(null);
  const [experienceHtml, setExperienceHtml] = useState(null);

  const [cities, setCities] = useState([]);
  const [city, setCity] = useState(null);
  const [loadingCity, setLoadingCity] = useState(false);
  const [voivodeships, setVoivodeships] = useState([]);
  const [voivodeship, setVoivodeship] = useState(null);
  const [languages, setLanguages] = useState([]);

  const nav = useNavigate();
  const customSelectStyle = {
    control: (base) => ({
      ...base,
      boxShadow: "none",
      borderRadius: "none",
      borderColor: "#BFEAF5",
      "&:hover": {
        border: "1px solid #aaabac",
      },
    }),
  };

  const places_of_classes = [
    {
      value: "teacher_home",
      label: "U nauczyciela",
    },
    { value: "student_home", label: "U studenta" },
    { value: "online", label: "Online" },
  ];

  const sexs = [
    {
      value: "mężczyzna",
      label: "Mężczyzna",
    },
    { value: "kobieta", label: "Kobieta" },
  ];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setValues,
    control,
    getValues,
    formState: { errors },
  } = useForm({
    mode: "all",
  });

  const editProfile = {
    phone_number: {
      pattern: {
        value:
          /^[^a-zA-Z]*\+?\d{1,4}[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}[^a-zA-Z]*$/,
        message: "Nieprawidłowy format numeru telefonu.",
      },
    },
    postal_code: {
      pattern: {
        value: /^[0-9]{2}-[0-9]{3}$/,
        message: "Nieprawidłowy format kodu pocztowego.",
      },
    },
    street: {
      maxLength: {
        value: 50,
        message: "Ulica może mieć maksymalnie 50 znaków.",
      },
    },
    building_number: {
      maxLength: {
        value: 40,
        message: "Numer budynku nie może być dłuższy niż 50 znaków.",
      },
    },
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
          console.log(err);
          setLoadingCity(false);
        });
    } else {
      setCities([]);
      setLoadingCity(false);
    }
  };

  const handleCitySelectChange = (e) => {
    setVoivodeship(voivodeships.find((voi) => voi.id == e.region_id && voi));
  };

  const fetchLanguages = async () => {
    await api
      .get(`/api/classes/languages`)
      .then((res) => {
        setLanguages(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchVoivodeships = async () => {
    await api
      .get(`/api/users/address/voivodeships/`)
      .then((res) => {
        setVoivodeships(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchProfile = async () => {
    await api
      .get(`/api/users/profile/`)
      .then((res) => {
        setValue("description", res.data.description);
        setValue("year_of_birth", res.data.year_of_birth);
        setValue("phone_number", res.data.phone_number);
        setValue("known_languages", res.data.known_languages);
        setValue(
          "sex",
          sexs.map((sex) => res.data.sex == sex.value && sex)
        );

        let places = [];
        res.data.place_of_classes.forEach((place) => {
          const matchingPlace = places_of_classes.find(
            (place_obj) => place_obj.value === place
          );
          if (matchingPlace) {
            places.push(matchingPlace);
          }
        });
        setValue("place_of_classes", places);
        setValue("cities_of_work", res.data.cities_of_work);
        setValue("experience", res.data.experience);
        setValue("address.voivodeship", res.data.address.voivodeship);
        setValue("address.city", res.data.address.city);
        setValue("address.postal_code", res.data.address.postal_code);
        setValue("address.street", res.data.address.street);
        setValue("address.building_number", res.data.address.building_number);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchAll = async () => {
    setLoading(true);
    await fetchVoivodeships();
    await fetchLanguages();
    await fetchProfile();
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const onSubmit = (data) => {
    data.place_of_classes.map((place, i) => {
      data.place_of_classes[i] = place.value;
    });

    data.cities_of_work.map((city, i) => {
      data.cities_of_work[i] = city.id;
    });

    data.known_languages.map((language, i) => {
      data.known_languages[i] = language.id;
    });

    if (data.sex != null) {
      data.sex = data.sex.value;
    }

    if (data?.address?.voivodeship != null) {
      data.address.voivodeship = data.address.voivodeship.id;
    }

    if (data?.address?.city != null) {
      data.address.city = data.address.city.id;
    }

    if (
      descriptionHtml != null &&
      descriptionHtml != data.description &&
      data.description.length > 0
    ) {
      data.description = descriptionHtml;
    } else {
      data.description = null;
    }

    if (
      experienceHtml != null &&
      experienceHtml != data.experience &&
      data.experience.length > 0
    ) {
      data.experience = experienceHtml;
    } else {
      data.experience = null;
    }

    if (data.year_of_birth == "") {
      data.year_of_birth = null;
    }

    api
      .put(`/api/users/profile/edit-informations/`, data)
      .then((res) => {
        showSuccessAlert(
          "Sukces!",
          "Pomyślnie zedytowałeś dane swojego konta.",
          () => {
            nav("/profil");
          }
        );
      })
      .catch((err) => {
        setBackendErrors(JSON.parse(err.request.response));
      });
  };

  return (
    <>
      {loading ? (
        <LoadingComponent message="Pobieranie informacji..." />
      ) : (
        <>
          <div>
            <div className="absolute top-[70px] left-0 right-0 h-[500px] bg-base-300 "></div>

            <div className="bg-white card shadow-xl h-full px-5 py-5 mt-10 rounded-none mb-10 mx-auto w-8/12 max-lg:w-full max-md:w-8/12 max-phone:w-full">
              <h1 className="text-2xl text-center">
                Edytuj dodatkowe informacje
              </h1>
              <div className="border-b-[1px] border-base-100 my-4"></div>
              <p className="text-center text-sm">
                Dodaj więcej informacji o sobie tak, by uczniowie mogli Cię
                łatwiej wyszukać.
              </p>
              <div className="border-b-[1px] border-base-100 my-4"></div>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col justify-center w-10/12 space-y-4 max-md:w-full mx-auto"
              >
                <div className="items-center">
                  <div className="flex flex-col float-right w-full">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="year_of_birth"
                    >
                      Rok urodzenia
                    </label>
                    <input
                      type="number"
                      className=" h-10 px-2 border-[1px] border-base-200 bg-transparent outline-none w-full relative hover:border-[#aaabac]"
                      name="year_of_birth"
                      placeholder="Podaj rok urodzenia"
                      id="year_of_birth"
                      {...register("year_of_birth", editProfile.year_of_birth)}
                    />
                    <small className="text-red-400 text-right">
                      {errors?.year_of_birth && errors.year_of_birth.message}
                      {backendErrors?.year_of_birth?.map((e, i) => (
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
                      htmlFor="phone_number"
                    >
                      Numer telefonu
                    </label>
                    <input
                      type="text"
                      className=" h-10 px-2 border-[1px] border-base-200 bg-transparent outline-none w-full relative hover:border-[#aaabac]"
                      name="phone_number"
                      placeholder="Podaj numer telefonu"
                      id="phone_number"
                      {...register("phone_number", editProfile.phone_number)}
                    />
                    <small className="text-red-400 text-right">
                      {errors?.phone_number && errors.phone_number.message}
                      {backendErrors?.phone_number?.map((e, i) => (
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
                      htmlFor="sex"
                    >
                      Płeć
                    </label>
                    <Controller
                      name="sex"
                      control={control}
                      rules={editProfile.sex}
                      render={({ field }) => (
                        <Select
                          className="px-0 h-10 w-full text-gray-500 border-none shadow-none"
                          menuPortalTarget={document.body}
                          isClearable
                          options={sexs}
                          {...field}
                          placeholder={
                            <span className="text-gray-400">Płeć</span>
                          }
                          noOptionsMessage={() => "Brak opcji."}
                          styles={customSelectStyle}
                        />
                      )}
                    />
                    <small className="text-red-400 text-right">
                      {errors?.sex && errors.sex.message}
                      {backendErrors?.sex?.map((e, i) => (
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
                      Miejsca udzielania zajęć
                    </label>
                    <Controller
                      name="place_of_classes"
                      control={control}
                      rules={editProfile.place_of_classes}
                      render={({ field }) => (
                        <Select
                          className="px-0 w-full text-gray-500 border-none shadow-none"
                          isMulti
                          menuPortalTarget={document.body}
                          options={places_of_classes}
                          getOptionValue={(option) => option.value}
                          getOptionLabel={(option) => option.label}
                          {...field}
                          placeholder={
                            <span className="text-gray-400">
                              Miejsce udzielania zajęć
                            </span>
                          }
                          noOptionsMessage={() => "Brak opcji."}
                          styles={customSelectStyle}
                        />
                      )}
                    />
                    <small className="text-red-400 text-right">
                      {errors?.place_of_classes &&
                        errors.place_of_classes.message}
                      {backendErrors?.place_of_classes?.map((e, i) => (
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
                      htmlFor="cities_of_work"
                    >
                      Miasta, w których udzielam zajęć
                    </label>
                    <Controller
                      name="cities_of_work"
                      control={control}
                      {...register(
                        "cities_of_work",
                        editProfile.cities_of_work
                      )}
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
                          getOptionLabel={(option) => option.name}
                          getOptionValue={(option) => option.id}
                          placeholder={
                            <span className="text-gray-400">Miasta</span>
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
                      {errors?.cities_of_work && errors.cities_of_work.message}
                      {backendErrors?.cities_of_work?.map((e, i) => (
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
                      htmlFor="cities_of_work"
                    >
                      Znane języki
                    </label>
                    <Controller
                      name="known_languages"
                      control={control}
                      {...register(
                        "known_languages",
                        editProfile.known_languages
                      )}
                      render={({ field }) => (
                        <Select
                          className="px-0 w-full text-gray-500 border-none shadow-none"
                          menuPortalTarget={document.body}
                          isClearable
                          isMulti
                          options={languages}
                          {...field}
                          getOptionLabel={(option) => option.name}
                          getOptionValue={(option) => option.id}
                          placeholder={
                            <span className="text-gray-400">Języki</span>
                          }
                          noOptionsMessage={() => "Brak języków."}
                          styles={customSelectStyle}
                        />
                      )}
                    />
                    <small className="text-red-400 text-right">
                      {errors?.known_languages &&
                        errors.known_languages.message}
                      {backendErrors?.known_languages?.map((e, i) => (
                        <span key={i}>
                          {e} <br />
                        </span>
                      ))}
                    </small>
                  </div>
                </div>

                <div className="items-center block">
                  <div className="flex flex-col float-right w-full">
                    <label
                      htmlFor="description"
                      className="block uppercase tracking-wide text-gray-700 text-lg font-bold"
                    >
                      Adres
                    </label>
                    <div className="border-b-[1px] border-base-100 mb-2"></div>

                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="city"
                    >
                      Miasto{" "}
                    </label>
                    <Controller
                      name="address.city"
                      control={control}
                      {...register("address.city", editProfile.city)}
                      render={({ field }) => (
                        <Select
                          className="px-0 h-10 w-full text-gray-500 border-none shadow-none"
                          menuPortalTarget={document.body}
                          isClearable
                          options={cities}
                          {...field}
                          onInputChange={(e) => {
                            fetchCities(e);
                          }}
                          getOptionLabel={(option) => option.name}
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
                      {errors?.city && errors.city.message}
                      {backendErrors?.address?.city?.map((e, i) => (
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
                      htmlFor="voivodeship"
                    >
                      Województwo
                    </label>
                    <Controller
                      name="address.voivodeship"
                      control={control}
                      {...register(
                        "address.voivodeship",
                        editProfile.voivodeship
                      )}
                      render={({ field }) => (
                        <Select
                          className="px-0 h-10 text-gray-500 border-none shadow-none"
                          menuPortalTarget={document.body}
                          isClearable
                          {...field}
                          options={voivodeships}
                          getOptionLabel={(option) => option.alternate_names}
                          getOptionValue={(option) => option.slug}
                          placeholder={
                            <span className="text-gray-400">Województwo</span>
                          }
                          noOptionsMessage={({ inputValue }) =>
                            !inputValue ? "Brak województwa" : "Nie znaleziono"
                          }
                          styles={customSelectStyle}
                        />
                      )}
                    />
                    <small className="text-red-400 text-right">
                      {errors?.voivodeship && errors.voivodeship.message}
                      {backendErrors?.address?.voivodeship?.map((e, i) => (
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
                      htmlFor="postal_code"
                    >
                      Kod pocztowy
                    </label>
                    <input
                      type="text"
                      className=" h-10 px-2 border-[1px] border-base-200 bg-transparent outline-none w-full relative hover:border-[#aaabac]"
                      name="address.postal_code"
                      placeholder="Podaj kod pocztowy"
                      id="postal_code"
                      {...register(
                        "address.postal_code",
                        editProfile.postal_code
                      )}
                    />
                    <small className="text-red-400 text-right">
                      {errors?.postal_code && errors.postal_code.message}
                      {backendErrors?.address?.postal_code?.map((e, i) => (
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
                      htmlFor="street"
                    >
                      Ulica
                    </label>
                    <input
                      type="text"
                      className=" h-10 px-2 border-[1px] border-base-200 bg-transparent outline-none w-full relative hover:border-[#aaabac]"
                      name="address.street"
                      placeholder="Podaj ulicę"
                      id="street"
                      {...register("address.street", editProfile.street)}
                    />
                    <small className="text-red-400 text-right">
                      {errors?.street && errors.street.message}
                      {backendErrors?.address?.street?.map((e, i) => (
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
                      htmlFor="building_number"
                    >
                      Numer budynku
                    </label>
                    <input
                      type="text"
                      className=" h-10 px-2 border-[1px] border-base-200 bg-transparent outline-none w-full relative hover:border-[#aaabac]"
                      name="address.building_number"
                      placeholder="Podaj bnumer budynku"
                      id="building_number"
                      {...register(
                        "address.building_number",
                        editProfile.building_number
                      )}
                    />
                    <small className="text-red-400 text-right">
                      {errors?.building_number &&
                        errors.building_number.message}
                      {backendErrors?.address?.building_number?.map((e, i) => (
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
                      htmlFor="description"
                      className="block uppercase tracking-wide text-gray-700 text-lg font-bold"
                    >
                      O sobie
                    </label>
                    <div className="border-b-[1px] border-base-100 mb-2"></div>
                    <Editor
                      fieldValue={getValues("description")}
                      setValue={setValue}
                      setValueHtml={setDescriptionHtml}
                      name="description"
                      id="description"
                      fieldName="description"
                      {...register("description", editProfile.description)}
                    />

                    <span className="text-[11px] text-red-400">
                      <span>
                        {errors.description && errors.description.message}
                      </span>
                      <span className="flex flex-col">
                        {backendErrors?.description &&
                          backendErrors.description.map((err) => (
                            <span key={err}>{err}</span>
                          ))}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="items-center">
                  <div className="flex flex-col float-right w-full">
                    <label
                      htmlFor="experience"
                      className="block uppercase tracking-wide text-gray-700 text-lg font-bold"
                    >
                      Doświadczenie
                    </label>
                    <div className="border-b-[1px] border-base-100 mb-2"></div>

                    <Editor
                      fieldValue={getValues("experience")}
                      setValue={setValue}
                      setValueHtml={setExperienceHtml}
                      name="experience"
                      id="experience"
                      fieldName="experience"
                      {...register("experience", editProfile.experience)}
                    />

                    <span className="text-[11px] text-red-400">
                      <span>
                        {errors.experience && errors.experience.message}
                      </span>
                      <span className="flex flex-col">
                        {backendErrors?.experience &&
                          backendErrors.experience.map((err) => (
                            <span key={err}>{err}</span>
                          ))}
                      </span>
                    </span>
                  </div>
                </div>

                <button className="btn btn-outline no-animation w-6/12 max-md:w-5/12 max-phone:w-full max-phone:mx-auto h-10 py-0 !min-h-0 rounded-none mt-2 hover:bg-base-400 border-base-400">
                  Edytuj profil
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default EditMoreInfosPage;
