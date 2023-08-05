import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import ErrorMessage from "../components/messages/ErrorMessage";
// import "../styles/button.css";

const LoginPage = () => {
  let { loginUser, error, setError } = useContext(AuthContext);

  return (
    <div>
      <div className="absolute top-[70px] left-0 right-0 h-[200px] bg-base-300 "></div>

      <div className="bg-base-100 card shadow-xl h-full px-5 py-5 mt-10 rounded-none mb-10 mx-auto">
        <form
          onSubmit={loginUser}
          className="flex flex-col w-full max-md:w-10/12 max-phone:w-full m-auto h-full"
        >
          <ErrorMessage error={error} setError={setError} />
          <h1 className="font-bold text-2xl pb-3 border-b-[1px] border-base-200 mb-4">
            Logowanie{" "}
          </h1>

          <div className="items-center mb-4">
            <label className="float-left text-xl" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              className="float-right w-2/4 h-10 px-2 border-b-[1px] border-l-[1px] border-base-200 bg-transparent outline-none"
              name="email"
              placeholder="Wprowadź email"
              required
            />
          </div>
          <div className="items-center mb-4">
            <label className="float-left text-xl" htmlFor="password">
              Hasło
            </label>
            <input
              type="password"
              className="float-right w-2/4 h-10 px-2 border-b-[1px] border-l-[1px] border-base-200 bg-transparent outline-none"
              name="password"
              placeholder="Wprowadź hasło"
              required
            />
          </div>
          <div className="border-base-200 border-b-[1px]"></div>
          <button
            type="submit"
            className="btn btn-outline no-animation w-3/12 max-md:w-5/12 max-phone:w-10/12 max-phone:mx-auto h-10 py-0 !min-h-0 rounded-none mt-2 hover:bg-base-400 border-base-400"
          >
            Zaloguj
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
