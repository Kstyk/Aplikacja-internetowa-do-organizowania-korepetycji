import React, { useState, useEffect } from "react";
import useAxios from "../utils/useAxios";
import LoadingComponent from "../components/LoadingComponent";
import { useForm } from "react-hook-form";
import guest from "../assets/guest.png";
import showSuccessAlert from "../components/messages/SwalAlertSuccess";
import { useNavigate } from "react-router-dom";

const ChangeAvatarPage = () => {
  const [imageUrl, setImageUrl] = useState();
  const [loading, setLoading] = useState(true);

  const [currentAvatar, setCurrentAvatar] = useState();

  const nav = useNavigate();
  const api = useAxios();

  const fetchProfile = async () => {
    setLoading(true);
    await api
      .get(`/api/users/profile/`)
      .then((res) => {
        setCurrentAvatar(res.data.profile_image);
        setValue("profile_image", res.data.profile_image);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "all",
  });

  const onSubmit = (data) => {
    if (data.profile_image != "") {
      data.profile_image = data.profile_image[0];
    }

    api
      .put(`/api/users/profile/edit-informations/`, data, {
        headers: { "content-type": "multipart/form-data" },
      })
      .then((res) => {
        showSuccessAlert(
          "Sukces!",
          "Pomyślnie zaktualizowałeś swój avatar.",
          () => {
            nav("/profil");
          }
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onSubmit2 = (data) => {
    data.profile_image = "";

    api
      .put(`/api/users/profile/edit-informations/`, data, {
        headers: { "content-type": "multipart/form-data" },
      })
      .then((res) => {
        console.log(res.data);

        showSuccessAlert("Sukces!", "Pomyślnie usunąłeś swój avatar.", () => {
          nav("/profil");
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <>
      {loading ? (
        <LoadingComponent message="Pobieranie informacji..." />
      ) : (
        <>
          <div>
            <div className="absolute top-[70px] left-0 right-0 h-[500px] bg-base-300 "></div>
            <div className="bg-white card shadow-xl px-5 py-5 mt-10 rounded-none mb-10 mx-auto w-8/12 max-lg:w-full max-md:w-8/12 max-phone:w-full">
              <h1 className="text-2xl text-center">Zmień swój avatar</h1>
              <div className="border-b-[1px] border-base-100 my-4"></div>
              <label
                htmlFor="actualAvatar"
                className="block uppercase tracking-wide text-gray-700 text-lg font-bold text-center"
              >
                Twój aktualny avatar
              </label>
              <div className="avatar flex justify-center mt-3">
                <div className="w-6/12 max-md:w-8/12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img
                    src={currentAvatar == null ? guest : `${currentAvatar}`}
                  />
                </div>
              </div>
              <div className="border-b-[1px] border-base-100 my-4"></div>

              <form
                onSubmit={handleSubmit(onSubmit2)}
                className="flex flex-col justify-center w-10/12 space-y-4 max-md:w-full mx-auto items-center"
              >
                <input
                  type="hidden"
                  name="profile_image"
                  id="profile_image"
                  defaultValue={null}
                  {...register("profile_image")}
                />
                <button className="btn btn-outline no-animation w-6/12 max-md:w-full max-phone:mx-auto h-10 py-0 !min-h-0 rounded-none mt-2 hover:bg-base-400 border-base-400">
                  Usuń avatar
                </button>
              </form>
              <div className="container mx-auto px-5 py-5">
                <div className="relative border border-t-gray-600">
                  <h2 className="absolute flex top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-white px-2 text-sm font-medium uppercase tracking-wide">
                      Lub
                    </span>
                  </h2>
                </div>
              </div>
              <label
                htmlFor="actualAvatar"
                className="block uppercase tracking-wide text-gray-700 text-lg font-bold text-center"
              >
                Wybierz nowy
              </label>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col justify-center w-10/12 space-y-4 max-md:w-full mx-auto items-center"
              >
                <input
                  type="file"
                  id="profile_image"
                  className="file-input file-input-bordered w-full rounded-none bg-transparent hover:border-[#aaabac]"
                  name="profile_image"
                  accept="image/png, image/jpeg"
                  //   onChange={this.handleImageChange}
                  required
                  {...register("profile_image")}
                />
                <button className="btn btn-outline no-animation w-6/12 max-md:w-full max-phone:mx-auto h-10 py-0 !min-h-0 rounded-none mt-2 hover:bg-base-400 border-base-400">
                  Zmień avatar
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ChangeAvatarPage;
