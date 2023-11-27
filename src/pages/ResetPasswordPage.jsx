import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import useAxios from '../utils/useAxios'
import transparent_logo from '../assets/transparent_logo.png'
import showAlertError from '../components/AlertsComponents/SwalAlertError'
import showSuccessAlert from '../components/AlertsComponents/SwalAlertSuccess'
import LoadingComponent from '../components/GeneralComponents/LoadingComponent'
import { useParams } from 'react-router-dom'
import { BiShow } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'

const ResetPasswordPage = () => {
  document.title = 'Resetowanie hasła'

  const api = useAxios()
  const nav = useNavigate()
  const { token } = useParams()
  const [loading, setLoading] = useState(false)
  const [backendErrors, setBackendErrors] = useState([])

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: 'all' })

  const resetOptions = {
    new_password: {
      required: 'Hasło jest wymagane.',
      minLength: {
        value: 8,
        message: 'Hasło musi mieć przynajmniej 8 znaków.',
      },
    },
    confirm_password: {
      required: 'Musisz powtórzyć hasło.',
      validate: (val) => {
        if (watch('new_password') != val) {
          return 'Hasła nie są identyczne.'
        }
      },
    },
  }

  const onSubmit = (data) => {
    data = {
      ...data,
      token: token,
    }

    setLoading(true)

    api
      .post(`/api/users/reset-password/`, data)
      .then((res) => {
        setLoading(false)
        showSuccessAlert(
          'Sukces!',
          'Pomyślnie zmieniono hasło, możesz teraz się zalogować.',
          () => {
            nav('/logowanie')
          }
        )
      })
      .catch((err) => {
        if (err.response.status == 400) {
          showAlertError('Błąd', err.response.data.error)
        }
        setBackendErrors(err.response.data)
        setLoading(false)
      })
  }

  const changeVisibility = (input) => {
    if (input == 'new_password') {
      let inp = document.getElementById('new_password')
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
    <div className="pt-10">
      <div className="absolute left-0 right-0 top-[70px] h-[200px] bg-base-300 max-phone:hidden"></div>

      <div className="px-5rounded-none card mx-auto mb-10 h-full w-10/12 flex-col rounded-md bg-white px-5 pb-10 pt-5 shadow-xl max-lg:w-full max-md:w-8/12 max-phone:w-full">
        <div className="mx-auto flex w-8/12 flex-col justify-center px-5 py-5 max-md:w-full">
          <img src={transparent_logo} alt="logo" />
        </div>
        <div className="mb-5 border-b-[1px] border-base-200"></div>

        <h2 className="text-center text-lg font-bold uppercase tracking-wider text-gray-700">
          Ustaw nowe hasło do swojego konta
        </h2>
        {loading ? (
          <div className="mt-2">
            <LoadingComponent message="Zmienianie hasła..." />
          </div>
        ) : (
          <>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mx-auto mt-5 flex w-8/12 flex-col justify-center space-y-4 max-md:w-full"
            >
              <div className="items-center">
                <div className="float-right flex w-full flex-col">
                  <div className="relative w-full">
                    <input
                      type="password"
                      className="relative h-10 w-full rounded-sm border-[1px] border-base-200 bg-transparent px-2 outline-none hover:border-[#aaabac]"
                      name="new_password"
                      placeholder="Podaj nowe hasło..."
                      id="new_password"
                      {...register('new_password', resetOptions.new_password)}
                    />
                    <BiShow
                      className="absolute right-1 top-[20%] h-6 w-6 text-slate-300"
                      onClick={() => changeVisibility('new_password')}
                    />
                  </div>
                  <small className="text-right text-red-400">
                    {errors?.new_password && errors.new_password.message}
                    {backendErrors?.new_password?.map((e, i) => (
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
                      placeholder="Powtórz nowe hasło..."
                      {...register(
                        'confirm_password',
                        resetOptions.confirm_password
                      )}
                    />
                    <BiShow
                      className="absolute right-1 top-[20%] h-6 w-6 text-slate-300"
                      onClick={() => changeVisibility('confirm_password')}
                    />
                  </div>
                  <small className="text-right text-red-400">
                    {errors?.confirm_password &&
                      errors.confirm_password.message}
                    {backendErrors?.confirm_password?.map((e, i) => (
                      <span key={i}>
                        {e} <br />
                      </span>
                    ))}
                  </small>
                </div>
              </div>
              <button className="btn-outline no-animation btn mt-5  h-10 !min-h-0 w-full rounded-sm border-base-400 py-0 hover:bg-base-400 max-phone:mx-auto">
                Zmień hasło
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default ResetPasswordPage
