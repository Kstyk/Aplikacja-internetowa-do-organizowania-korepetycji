import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext'
import ErrorMessage from '../components/messages/ErrorMessage'
import transparent_logo from '../assets/transparent_logo.png'
import { Link } from 'react-router-dom'

const LoginPage = () => {
  document.title = 'Logowanie'

  let { loginUser, error, setError, waitingForResponse } =
    useContext(AuthContext)

  return (
    <div>
      <div className="absolute left-0 right-0 top-[70px] h-[200px] bg-base-300 max-phone:hidden "></div>
      <div className="card z-30 mx-auto mb-5 mt-10 flex w-10/12 flex-col items-center justify-between rounded-md bg-white p-4 text-center shadow-xl max-lg:w-full max-md:w-8/12 max-md:text-xl max-phone:w-full max-phone:text-lg phone:flex-row md:text-2xl">
        <h1 className="w-full text-center text-xl font-bold uppercase tracking-wider text-gray-700">
          Logowanie
        </h1>
      </div>
      <div className="card mx-auto mb-10 flex h-full w-10/12 flex-row rounded-md bg-white px-5 py-5 shadow-xl max-lg:w-full max-md:w-8/12 max-md:flex-col max-phone:w-full">
        <div className="mx-auto flex w-6/12 flex-col justify-center px-5 py-20 max-md:w-full max-md:py-10">
          <img src={transparent_logo} alt="logo" />
          <p className="mt-5 text-center text-lg">
            Nie masz konta?{' '}
            <Link to="/rejestracja" className="hover:underline">
              Zarejestruj się już teraz!
            </Link>
          </p>
        </div>
        <div className="mr-5 border-r-2 border-base-200"></div>
        <form
          onSubmit={loginUser}
          className="mx-auto flex w-6/12 flex-col justify-center max-md:w-full"
        >
          <div className="mb-4 items-center">
            <ErrorMessage error={error} setError={setError} />
            <input
              type="email"
              className="relative h-10 w-full border-[1px] border-base-200 bg-transparent px-2 outline-none hover:border-[#aaabac]"
              name="email"
              placeholder="Wprowadź email"
              required
            />
          </div>
          <div className="mb-4 items-center">
            <input
              type="password"
              className="relative h-10 w-full border-[1px] border-base-200 bg-transparent px-2 outline-none hover:border-[#aaabac]"
              name="password"
              placeholder="Wprowadź hasło"
              required
            />
          </div>
          <div className="border-b-[1px] border-base-200"></div>
          <button
            type="submit"
            className="btn-outline no-animation btn my-4 h-10 !min-h-0 w-full rounded-sm border-base-400 py-0 text-base-400 hover:bg-base-400 hover:text-white max-phone:mx-auto"
          >
            {waitingForResponse ? (
              <span className="loading loading-spinner "></span>
            ) : (
              'Zaloguj'
            )}
          </button>
          <div className="border-b-[1px] border-base-200"></div>
          <span className="mt-2 text-center text-sm tracking-wider">
            Zapomniałeś hasła?{' '}
            <Link to="/zapomniane-haslo" className="underline hover:font-bold">
              Zresetuj je tutaj
            </Link>
          </span>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
