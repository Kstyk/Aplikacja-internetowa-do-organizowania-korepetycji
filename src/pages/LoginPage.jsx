import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import ErrorMessage from "../components/messages/ErrorMessage";
import transparent_logo from "../assets/transparent_logo.png";
import { Link } from "react-router-dom";
// import "../styles/button.css";

const LoginPage = () => {
  let { loginUser, error, setError } = useContext(AuthContext);

  return (
    <div>
      <div className="absolute top-[70px] left-0 right-0 h-[200px] max-phone:hidden bg-base-300 "></div>
      <div className="md:text-2xl max-md:text-xl max-phone:text-lg card bg-white rounded-md mt-10 mb-5 text-center p-4 flex flex-col phone:flex-row justify-between items-center z-30 shadow-xl w-10/12 max-lg:w-full max-md:w-8/12 max-phone:w-full mx-auto">
        <h1 className="text-center w-full">Logowanie</h1>
      </div>
      <div className="bg-white card shadow-xl h-full px-5 py-5 rounded-md mb-10 mx-auto w-10/12 max-lg:w-full flex flex-row max-md:flex-col max-md:w-8/12 max-phone:w-full">
        <div className="flex flex-col justify-center w-6/12 max-md:w-full mx-auto py-20 px-5 max-md:py-10">
          <img src={transparent_logo} alt="logo" />
          <p className="text-center mt-5 text-lg">
            Nie masz konta?{" "}
            <Link to="/register" className="hover:underline">
              Zarejestruj się już teraz!
            </Link>
          </p>
        </div>
        <div className="border-r-2 border-base-200 mr-5"></div>
        <form
          onSubmit={loginUser}
          className="flex flex-col justify-center w-6/12 max-md:w-full mx-auto"
        >
          <div className="items-center mb-4">
            <ErrorMessage error={error} setError={setError} />
            <input
              type="email"
              className="h-10 px-2 border-[1px] border-base-200 bg-transparent outline-none w-full relative hover:border-[#aaabac]"
              name="email"
              placeholder="Wprowadź email"
              required
            />
          </div>
          <div className="items-center mb-4">
            <input
              type="password"
              className="h-10 px-2 border-[1px] border-base-200 bg-transparent outline-none w-full relative hover:border-[#aaabac]"
              name="password"
              placeholder="Wprowadź hasło"
              required
            />
          </div>
          <div className="border-base-200 border-b-[1px]"></div>
          <button
            type="submit"
            className="btn btn-outline no-animation w-full max-phone:mx-auto h-10 py-0 !min-h-0 rounded-sm my-4 hover:bg-base-400 border-base-400"
          >
            Zaloguj
          </button>
          <div className="border-base-200 border-b-[1px]"></div>
          <span className="text-sm tracking-wider text-center mt-2">
            Zapomniałeś hasła?{" "}
            <Link to="/zapomniane-haslo" className="underline hover:font-bold">
              Zresetuj je tutaj
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
