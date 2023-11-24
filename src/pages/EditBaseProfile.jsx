import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Select from 'react-select'
import { useNavigate } from 'react-router-dom'
import useAxios from '../utils/useAxios'
import LoadingComponent from '../components/GeneralComponents/LoadingComponent'
import showSuccessAlert from '../components/AlertsComponents/SwalAlertSuccess'
import showAlertError from '../components/AlertsComponents/SwalAlertError'

const EditBaseProfile = () => {
  document.title = 'Edytuj dane podstawowe'

  const [backendErrors, setBackendErrors] = useState({})
  const [baseUser, setBaseUser] = useState(null)
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [waitingForResponse, setWaitingForResponse] = useState(false)

  const nav = useNavigate()
  const api = useAxios()
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    mode: 'all',
  })

  const editUserOptions = {
    first_name: { required: 'Imię jest wymagane.' },
    last_name: { required: 'Nazwisko jest wymagane.' },
  }

  const fetchBaseUser = async () => {
    await api
      .get(`/api/users/profile/base-user/`)
      .then((res) => {
        setBaseUser(res.data)
        setValue('first_name', res.data.first_name)
        setValue('last_name', res.data.last_name)
      })
      .catch((err) => {
        showAlertError(
          'Błąd',
          'Nie udało się pobrać danych z serwera, przepraszamy.'
        )
      })
  }

  const fetchRoles = async () => {
    await api
      .get('/api/users/roles/')
      .then((res) => {
        setRoles(res.data)
      })
      .catch((err) => {
        showAlertError(
          'Błąd',
          'Nie udało się pobrać danych z serwera, przepraszamy.'
        )
      })
  }

  const fetchAll = async () => {
    setLoading(true)
    await fetchRoles()
    await fetchBaseUser()
    setLoading(false)
  }

  const onSubmit = (data) => {
    setWaitingForResponse(true)
    api
      .put(`/api/users/edit/`, data)
      .then((res) => {
        if (res.status == 200) {
          showSuccessAlert(
            'Sukces',
            'Twoje dane zostały zaktualizowane.',
            () => {
              nav('/profil')
            }
          )
        }
        setWaitingForResponse(false)
      })
      .catch((err) => {
        setBackendErrors(JSON.parse(err.request.response))
        setWaitingForResponse(false)
      })
  }

  useEffect(() => {
    fetchAll()
  }, [])

  return (
    <>
      <>
        <div>
          <div className="absolute left-0 right-0 top-[70px] h-[200px] bg-base-300 max-phone:hidden"></div>

          <div className="card mx-auto mb-10 mt-10 h-full w-8/12 rounded-md bg-white px-5 py-5 shadow-xl max-lg:w-full max-md:w-8/12 max-phone:w-full">
            <h1 className="text-center text-xl font-bold uppercase tracking-wider text-gray-700">
              Edytuj podstawowe informacje
            </h1>
            <div className="my-4 border-b-[1px] border-base-100"></div>
            {loading ? (
              <LoadingComponent message="Pobieranie aktualnych danych" />
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mx-auto flex w-10/12 flex-col justify-center space-y-4 max-md:w-full"
              >
                <section>
                  <label
                    className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    className="h-10 w-full rounded-sm border-[1px] border-[#E2E3E4] bg-transparent px-2 outline-none"
                    style={{ color: '#999999' }}
                    name="email"
                    value={baseUser?.email}
                    disabled
                    placeholder="Wprowadź email..."
                    id="email"
                  />
                </section>
                <section>
                  <label
                    className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
                    htmlFor="first_name"
                  >
                    Imię
                  </label>
                  <div className="float-right flex w-full flex-col">
                    <input
                      name="first_name"
                      id="first_name"
                      placeholder="Podaj imię..."
                      className="relative h-10 w-full rounded-sm border-[1px] border-base-200 bg-transparent px-2 outline-none hover:border-[#aaabac]"
                      type="text"
                      {...register('first_name', editUserOptions.first_name)}
                    />
                    <small className="text-right text-red-400">
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
                    className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
                    htmlFor="last_name"
                  >
                    Nazwisko
                  </label>
                  <div className="float-right flex w-full flex-col">
                    <input
                      name="last_name"
                      id="last_name"
                      placeholder="Podaj nazwisko..."
                      className="relative h-10 w-full rounded-sm border-[1px] border-base-200 bg-transparent px-2 outline-none hover:border-[#aaabac]"
                      type="text"
                      {...register('last_name', editUserOptions.last_name)}
                    />
                    <small className="text-right text-red-400">
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
                    className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
                    htmlFor="role"
                  >
                    Rola
                  </label>
                  <div className="float-right flex w-full flex-col">
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
                          boxShadow: 'none',
                          borderRadius: 'none',
                          borderColor: '#E2E3E4',
                          backgroundColor: 'transparent',
                        }),
                      }}
                    />
                  </div>
                </section>
                <button className="btn-outline no-animation btn mt-2 h-10 !min-h-0 w-6/12 rounded-sm border-base-400 py-0 text-base-400 hover:bg-base-400 hover:text-white max-md:w-5/12 max-phone:mx-auto max-phone:w-full">
                  {waitingForResponse ? (
                    <span className="loading loading-spinner "></span>
                  ) : (
                    'Edytuj'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </>
    </>
  )
}

export default EditBaseProfile
