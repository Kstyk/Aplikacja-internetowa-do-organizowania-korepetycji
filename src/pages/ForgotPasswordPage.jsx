import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import useAxios from '../utils/useAxios'
import transparent_logo from '../assets/transparent_logo.png'
import showAlertError from '../components/messages/SwalAlertError'
import LoadingComponent from '../components/LoadingComponent'

const ForgotPasswordPage = () => {
  const api = useAxios()
  const [loading, setLoading] = useState(false)
  const [isSended, setIsSended] = useState(false)

  const { register, handleSubmit } = useForm({ mode: 'all' })

  const onSubmit = (data) => {
    setLoading(true)

    api
      .post(`/api/users/reset-password-request/`, data)
      .then((res) => {
        setIsSended(true)
        setLoading(false)
      })
      .catch((err) => {
        if (err.response.status == 404) {
          showAlertError('Błąd', err.response.data.error)
        }
        setLoading(false)
      })
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
          Zresetuj hasło do swojego konta
        </h2>
        {loading ? (
          <LoadingComponent message="Oczekiwanie na odpowiedź serwera..." />
        ) : isSended ? (
          <div className="mx-auto mt-3 w-6/12 text-center">
            Wysłaliśmy link do resetu hasła na podany przez Ciebie email.
            Przejdź pod link wysłany w mailu w celu zresetowania hasła.
          </div>
        ) : (
          <>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mx-auto mt-5 flex w-8/12 flex-col justify-center max-md:w-full"
            >
              <div className="mb-5 items-center">
                <input
                  type="email"
                  className="relative h-10 w-full rounded-sm border-[1px] border-base-200 bg-transparent px-2 outline-none hover:border-[#aaabac]"
                  name="email"
                  {...register('email')}
                  placeholder="Wprowadź email"
                  required
                />
              </div>
              <div className="border-b-[1px] border-base-200"></div>
              <button className="btn-outline no-animation btn mt-5  h-10 !min-h-0 w-full rounded-sm border-base-400 py-0 hover:bg-base-400 max-phone:mx-auto">
                Wyślij link do resetowania hasła na podany email
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
export default ForgotPasswordPage
