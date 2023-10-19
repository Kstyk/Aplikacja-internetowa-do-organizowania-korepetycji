import React, { useState, useEffect } from 'react'
import useAxios from '../utils/useAxios'
import LoadingComponent from '../components/LoadingComponent'
import { useForm } from 'react-hook-form'
import guest from '../assets/guest.png'
import showSuccessAlert from '../components/messages/SwalAlertSuccess'
import { useNavigate } from 'react-router-dom'

const ChangeAvatarPage = () => {
  document.title = 'Zmień avatar'

  const [loading, setLoading] = useState(true)
  const [waitingForResponseChangeAvatar, setWaitingForResponseChangeAvatar] =
    useState(false)
  const [waitingForResponseDeleteAvatar, setWaitingForResponseDeleteAvatar] =
    useState(false)

  const [currentAvatar, setCurrentAvatar] = useState()

  const nav = useNavigate()
  const api = useAxios()

  const fetchProfile = async () => {
    setLoading(true)
    await api
      .get(`/api/users/profile/`)
      .then((res) => {
        setCurrentAvatar(res.data.profile_image)
        setValue('profile_image', res.data.profile_image)
        setLoading(false)
      })
      .catch((err) => {
        setLoading(false)
        showAlertError(
          'Błąd',
          'Wystąpił błąd przy pobieraniu danych z serwera.'
        )
      })
  }

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: 'all',
  })

  const onSubmit = (data) => {
    setWaitingForResponseChangeAvatar(true)
    if (data.profile_image != '') {
      data.profile_image = data.profile_image[0]
    }

    api
      .put(`/api/users/profile/edit-informations/`, data, {
        headers: { 'content-type': 'multipart/form-data' },
      })
      .then((res) => {
        showSuccessAlert(
          'Sukces!',
          'Pomyślnie zaktualizowałeś swój avatar.',
          () => {
            nav('/profil')
          }
        )
        setWaitingForResponseChangeAvatar(false)
      })
      .catch((err) => {
        showAlertError(
          'Błąd',
          'Wystąpił błąd przy zmianie avataru. Sprawdź, czy typ przesyłanego pliku przez Ciebie jest typu graficznego.'
        )
        setWaitingForResponseChangeAvatar(false)
      })
  }

  const onSubmit2 = (data) => {
    setWaitingForResponseDeleteAvatar(true)
    data.profile_image = ''

    api
      .put(`/api/users/profile/edit-informations/`, data, {
        headers: { 'content-type': 'multipart/form-data' },
      })
      .then((res) => {
        showSuccessAlert('Sukces!', 'Pomyślnie usunąłeś swój avatar.', () => {
          nav('/profil')
        })
        setWaitingForResponseDeleteAvatar(false)
      })
      .catch((err) => {
        showAlertError(
          'Błąd',
          'Wystąpił błąd przy usuwaniu Twojego avatara. Przepraszamy za utrudnienia.'
        )
        setWaitingForResponseDeleteAvatar(false)
      })
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  return (
    <>
      <>
        <div>
          <div className="absolute left-0 right-0 top-[70px] h-[500px] bg-base-300 max-phone:hidden"></div>
          <div className="card mx-auto mb-10 mt-10 w-8/12 rounded-md bg-white px-5 py-5 shadow-xl max-lg:w-full max-md:w-8/12 max-phone:w-full">
            <h1 className="text-center text-xl font-bold uppercase tracking-wider text-gray-700">
              Zmień swój avatar
            </h1>
            <div className="my-4 border-b-[1px] border-base-100"></div>
            {loading ? (
              <LoadingComponent message="Pobieranie informacji..." />
            ) : (
              <>
                <label
                  htmlFor="actualAvatar"
                  className="block text-center text-lg font-bold uppercase tracking-wide text-gray-700"
                >
                  Twój aktualny avatar
                </label>
                <div className="avatar mt-3 flex justify-center">
                  <div className="w-6/12 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100 max-md:w-8/12">
                    <img
                      src={currentAvatar == null ? guest : `${currentAvatar}`}
                    />
                  </div>
                </div>
                <div className="my-4 border-b-[1px] border-base-100"></div>

                <form
                  onSubmit={handleSubmit(onSubmit2)}
                  className="mx-auto flex w-10/12 flex-col items-center justify-center space-y-4 max-md:w-full"
                >
                  <input
                    type="hidden"
                    name="profile_image"
                    id="profile_image"
                    defaultValue={null}
                    {...register('profile_image')}
                  />
                  <button className="btn-outline no-animation btn mt-2 h-10 !min-h-0 w-6/12 rounded-sm border-base-400 py-0 hover:bg-base-400 max-md:w-full max-phone:mx-auto">
                    {waitingForResponseDeleteAvatar ? (
                      <span className="loading loading-spinner "></span>
                    ) : (
                      'Zmień avatar'
                    )}
                  </button>
                </form>
                <div className="container mx-auto px-5 py-5">
                  <div className="relative border border-t-gray-600">
                    <h2 className="absolute left-1/2 top-0 flex -translate-x-1/2 -translate-y-1/2 transform">
                      <span className="bg-white px-2 text-sm font-medium uppercase tracking-wide">
                        Lub
                      </span>
                    </h2>
                  </div>
                </div>
                <label
                  htmlFor="actualAvatar"
                  className="block text-center text-lg font-bold uppercase tracking-wide text-gray-700"
                >
                  Wybierz nowy
                </label>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="mx-auto flex w-10/12 flex-col items-center justify-center space-y-4 max-md:w-full"
                >
                  <input
                    type="file"
                    id="profile_image"
                    className="file-input-bordered file-input w-full rounded-sm bg-transparent hover:border-[#aaabac]"
                    name="profile_image"
                    accept="image/png, image/jpeg"
                    required
                    {...register('profile_image')}
                  />
                  <button className="btn-outline no-animation btn mt-2 h-10 !min-h-0 w-6/12 rounded-sm border-base-400 py-0 hover:bg-base-400 max-md:w-full max-phone:mx-auto">
                    {waitingForResponseChangeAvatar ? (
                      <span className="loading loading-spinner "></span>
                    ) : (
                      'Zmień avatar'
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </>
    </>
  )
}

export default ChangeAvatarPage
