import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import useAxios from '../utils/useAxios'
import { useNavigate } from 'react-router-dom'
import showSuccessAlert from '../components/messages/SwalAlertSuccess'
import { BiShow } from 'react-icons/bi'

const ChangePasswordPage = () => {
  document.title = 'Zmień hasło'

  const api = useAxios()

  const [backendErrors, setBackendErrors] = useState({})
  const [waitingForResponse, setWaitingForResponse] = useState(false)

  const nav = useNavigate()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'all',
  })

  const changePasswordOptions = {
    old_password: {
      required: 'Obecne hasło jest wymagane.',
    },
    new_password: {
      required: 'Hasło jest wymagane.',
      minLength: {
        value: 8,
        message: 'Hasło musi mieć przynajmniej 8 znaków.',
      },
    },
    confirm_new_password: {
      required: 'Musisz powtórzyć hasło.',
      validate: (val) => {
        if (watch('new_password') != val) {
          return 'Hasła nie są identyczne.'
        }
      },
    },
  }

  const onSubmit = (data) => {
    setWaitingForResponse(true)
    api
      .post(`/api/users/change-password/`, data)
      .then((res) => {
        showSuccessAlert(
          'Zmieniono hasło',
          'Pomyślnie zmieniłeś hasło do swojego konta',
          () => {
            nav('/profil')
          }
        )
        setWaitingForResponse(false)
      })
      .catch((err) => {
        setBackendErrors(err.response.data)
        setWaitingForResponse(false)
      })
  }

  const changeVisibility = (input) => {
    if (input == 'old_password') {
      let inp = document.getElementById('old_password')
      if (inp.type === 'password') {
        inp.type = 'text'
      } else {
        inp.type = 'password'
      }
    }

    if (input == 'new_password') {
      let inp = document.getElementById('new_password')
      if (inp.type === 'password') {
        inp.type = 'text'
      } else {
        inp.type = 'password'
      }
    }

    if (input == 'confirm_new_password') {
      let inp = document.getElementById('confirm_new_password')
      if (inp.type === 'password') {
        inp.type = 'text'
      } else {
        inp.type = 'password'
      }
    }
  }

  return (
    <>
      <div>
        <div className="absolute left-0 right-0 top-[70px] h-[500px] bg-base-300 max-phone:hidden"></div>

        <div className="card mx-auto mb-10 mt-10 h-full w-8/12 rounded-md bg-white px-5 py-5 shadow-xl max-lg:w-full max-md:w-8/12 max-phone:w-full">
          <h1 className="text-center text-xl font-bold uppercase tracking-wider text-gray-700">
            Zmień hasło
          </h1>
          <div className="my-4 border-b-[1px] border-base-100"></div>
          <p className="text-justify text-sm">
            Tutaj możesz zmienić hasło. Musisz podać obecne hasło oraz
            dwukrotnie powtórzyć nowe hasło. Nowe hasło musi posiadać co
            najmniej 8 znaków, nie może być powszechnie używanym hasłem, nie
            może być podobne do twoich danych osobistych oraz nie może się
            składać tylko z cyfr.
          </p>
          <div className="my-4 border-b-[1px] border-base-100"></div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mx-auto flex w-10/12 flex-col justify-center space-y-4 max-md:w-full"
          >
            <div className="items-center">
              <div className="float-right flex w-full flex-col">
                <div className="relative w-full">
                  <input
                    type="password"
                    className="relative h-10 w-full rounded-sm border-[1px] border-base-200 bg-transparent px-2 outline-none hover:border-[#aaabac]"
                    name="old_password"
                    placeholder="Podaj obecne hasło..."
                    id="old_password"
                    {...register(
                      'old_password',
                      changePasswordOptions.old_password
                    )}
                  />
                  <BiShow
                    className="absolute right-1 top-[20%] h-6 w-6 cursor-pointer text-slate-300"
                    onClick={() => changeVisibility('old_password')}
                  />
                </div>
                <small className="text-right text-red-400">
                  {errors?.old_password && errors.old_password.message}
                  {backendErrors?.old_password?.map((e, i) => (
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
                    name="new_password"
                    placeholder="Podaj nowe hasło..."
                    id="new_password"
                    {...register(
                      'new_password',
                      changePasswordOptions.new_password
                    )}
                  />
                  <BiShow
                    className="absolute right-1 top-[20%] h-6 w-6 cursor-pointer text-slate-300"
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
                    id="confirm_new_password"
                    placeholder="Powtórz nowe hasło..."
                    {...register(
                      'confirm_new_password',
                      changePasswordOptions.confirm_new_password
                    )}
                  />
                  <BiShow
                    className="absolute right-1 top-[20%] h-6 w-6 cursor-pointer text-slate-300"
                    onClick={() => changeVisibility('confirm_new_password')}
                  />
                </div>
                <small className="text-right text-red-400">
                  {errors?.confirm_new_password &&
                    errors.confirm_new_password.message}
                  {backendErrors?.confirm_new_password?.map((e, i) => (
                    <span key={i}>
                      {e} <br />
                    </span>
                  ))}
                </small>
              </div>
            </div>
            <button className="btn-outline no-animation btn mt-2 h-10 !min-h-0 w-6/12 rounded-sm border-base-400 py-0 hover:bg-base-400 max-md:w-5/12 max-phone:mx-auto max-phone:w-full">
              {waitingForResponse ? (
                <span className="loading loading-spinner "></span>
              ) : (
                'Zmień hasło'
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default ChangePasswordPage
