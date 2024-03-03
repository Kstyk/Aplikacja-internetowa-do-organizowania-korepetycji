import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import axios from 'axios'
import Select from 'react-select'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import transparent_logo from '../assets/transparent_logo.png'
import { Link } from 'react-router-dom'
import useAxios from '../utils/useAxios'
import { backendUrl } from '../variables/backendUrl'
import showSuccessAlert from '../components/AlertsComponents/SwalAlertSuccess'
import { BiShow } from 'react-icons/bi'

const RegistrationPage = () => {
  document.title = 'Rejestracja'

  const api = useAxios()
  const [roles, setRoles] = useState([])
  const [backendErrors, setBackendErrors] = useState({})
  const [waitingForResponse, setWaitingForResponse] = useState(false)

  const nav = useNavigate()
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm()

  const registerOptions = {
    first_name: { required: 'Imię jest wymagane.' },
    last_name: { required: 'Nazwisko jest wymagane.' },
    email: { required: 'Email jest wymagany.' },
    password: {
      required: 'Hasło jest wymagane.',
      minLength: {
        value: 8,
        message: 'Hasło musi mieć przynajmniej 8 znaków.',
      },
    },
    confirm_password: {
      required: 'Musisz powtórzyć hasło.',
      validate: (val) => {
        if (watch('password') != val) {
          return 'Hasła nie są identyczne.'
        }
      },
    },
    role: {
      required: 'Rola jest wymagana.',
    },
  }

  const selectOptions = roles

  const onSubmit = (data) => {
    setWaitingForResponse(true)
    let role = data.role.value

    data.role = role

    axios
      .post(`${backendUrl}/api/users/register/`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        showSuccessAlert(
          'Sukces',
          'Poprawnie zarejestrowano. Teraz możesz się zalogować.',
          () => {
            nav('/logowanie')
          }
        )
        setWaitingForResponse(false)
      })
      .catch((err) => {
        setBackendErrors(JSON.parse(err.request.response))
        setWaitingForResponse(false)
      })
  }

  const handleError = (errors) => {}

  useEffect(() => {
    fetchRoles()
  }, [])

  useEffect(() => {
    roles?.map((role) =>
      role.label == 'Teacher' ? (role.label = 'Korepetytor') : ''
    )
  }, [roles])

  const fetchRoles = async () => {
    await api
      .get('/api/users/roles/')
      .then((res) => {
        setRoles(res.data)
      })
      .catch((err) => {})
  }

  const changeVisibility = (input) => {
    if (input == 'password') {
      let inp = document.getElementById('password')
      if (inp.type === 'password') {
        inp.type = 'text'
      } else {
        inp.type = 'password'
      }
    }

    if (input == 'confirm_password') {
      let inp = document.getElementById('confirm_password')
      if (inp.type === 'password') {
        inp.type = 'text'
      } else {
        inp.type = 'password'
      }
    }
  }

  return (
    <div>
      <div className="absolute left-0 right-0 top-[70px] h-[200px] bg-base-300 max-phone:hidden "></div>
      <div className="card z-30 mx-auto mb-5 mt-10 flex w-10/12 flex-col items-center justify-between rounded-md bg-white p-4 text-center shadow-xl max-lg:w-full max-md:w-8/12 max-md:text-xl max-phone:w-full max-phone:text-lg phone:flex-row md:text-2xl">
        <h1 className="w-full text-center text-xl font-bold uppercase tracking-wider text-gray-700">
          Rejestracja
        </h1>
      </div>
      <div className="card mx-auto mb-10 flex h-full w-10/12 flex-row rounded-md bg-white px-5 pb-5 pt-5 shadow-xl max-lg:w-full max-md:w-8/12 max-md:flex-col max-phone:w-full">
        <div className="mx-auto flex w-6/12 flex-col justify-center px-5 py-20 max-md:w-full max-md:py-10">
          <img src={transparent_logo} alt="logo" />
          <p className="mt-5 text-center text-lg">
            Masz już konto?{' '}
            <Link to="/logowanie" className="hover:underline">
              Zaloguj się już teraz!
            </Link>
          </p>
        </div>
        <div className="mr-5 border-r-2 border-base-200"></div>
        <form
          onSubmit={handleSubmit(onSubmit, handleError)}
          className="mx-auto flex w-6/12 flex-col justify-center space-y-4 max-md:w-full"
        >
          <div className="items-center">
            <div className="float-right flex w-full flex-col">
              <input
                type="email"
                className="relative h-10 w-full rounded-sm border-[1px] border-base-200 bg-transparent px-2 outline-none hover:border-[#aaabac]"
                name="email"
                placeholder="Wprowadź email..."
                id="email"
                {...register('email', registerOptions.email)}
              />
              <small className="text-right text-red-400">
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
            <div className="float-right flex w-full flex-col">
              <div className="relative w-full">
                <input
                  type="password"
                  className="relative h-10 w-full rounded-sm border-[1px] border-base-200 bg-transparent px-2 outline-none hover:border-[#aaabac]"
                  name="password"
                  placeholder="Podaj hasło..."
                  id="password"
                  {...register('password', registerOptions.password)}
                />
                <BiShow
                  className="absolute right-1 top-[20%] h-6 w-6 text-slate-300 hover:cursor-pointer"
                  onClick={() => changeVisibility('password')}
                />
              </div>
              <small className="text-right text-red-400">
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
            <div className="float-right flex w-full flex-col">
              <div className="relative w-full">
                <input
                  type="password"
                  className="relative h-10 w-full rounded-sm border-[1px] border-base-200 bg-transparent px-2 outline-none hover:border-[#aaabac]"
                  id="confirm_password"
                  placeholder="Powtórz hasło..."
                  {...register(
                    'confirm_password',
                    registerOptions.confirm_password
                  )}
                />
                <BiShow
                  className="absolute right-1 top-[20%] h-6 w-6 text-slate-300 hover:cursor-pointer"
                  onClick={() => changeVisibility('confirm_password')}
                />
              </div>
              <small className="text-right text-red-400">
                {errors?.confirm_password && errors.confirm_password.message}
              </small>
            </div>
          </div>
          <div className="items-center">
            <div className="float-right flex w-full flex-col">
              <input
                name="first_name"
                id="first_name"
                placeholder="Podaj imię..."
                className="relative h-10 w-full rounded-sm border-[1px] border-base-200 bg-transparent px-2 outline-none hover:border-[#aaabac]"
                type="text"
                {...register('first_name', registerOptions.first_name)}
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
          </div>
          <div className="items-center">
            <div className="float-right flex w-full flex-col">
              <input
                name="last_name"
                id="last_name"
                placeholder="Podaj nazwisko..."
                className="relative h-10 w-full rounded-sm border-[1px] border-base-200 bg-transparent px-2 outline-none hover:border-[#aaabac]"
                type="text"
                {...register('last_name', registerOptions.last_name)}
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
          </div>
          <div>
            <div className="float-right flex w-full flex-col">
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
                        boxShadow: 'none',
                        borderRadius: '2px',
                        backgroundColor: 'transparent',
                      }),
                    }}
                  />
                )}
              />
              <small className="text-right text-red-400">
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
          <button className="btn-outline no-animation btn mt-2 h-10 !min-h-0 w-full rounded-sm border-base-400 py-0 hover:bg-base-400 max-phone:mx-auto">
            {waitingForResponse ? (
              <span className="loading loading-spinner "></span>
            ) : (
              'Zarejestruj'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default RegistrationPage
