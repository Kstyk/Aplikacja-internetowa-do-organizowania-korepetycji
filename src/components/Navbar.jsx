import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "./Navbar.scss";

const Navbar = () => {
  let { user, logoutUser } = useContext(AuthContext);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <>
      <nav className="navbar bg-base-100 h-[70px] max-phone:hidden">
        <div className="flex-1"></div>
        <div className="flex-none">
          <Link
            className="btn border-none bg-white hover:bg-white normal-case text-xl"
            to="/"
          >
            korki.PL
          </Link>
          {user?.role == "Student" && (
            <ul className="menu menu-horizontal px-1 gap-3">
              <li>
                <Link to="#" className="focus:bg-base-300 hover:bg-base-200">
                  Szukaj korepetytorów
                </Link>
              </li>
              <li>
                <Link
                  to="/my-rooms"
                  className="focus:bg-base-300 hover:bg-base-200"
                >
                  Twoje pokoje
                </Link>
              </li>

              <div className="dropdown dropdown-end z-40">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                  Profil
                </label>
                <ul
                  tabIndex={0}
                  className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 border-base-300 border-2 rounded-none w-52"
                >
                  <li>
                    <Link
                      to="/profil-ucznia"
                      className="focus:bg-base-300  rounded-none"
                    >
                      Profil
                    </Link>
                  </li>
                  <li>
                    <a href="#" className="focus:bg-base-300 rounded-none">
                      Twoje pokoje
                    </a>
                  </li>
                  <li>
                    <Link
                      to="/profil/historia-zakupow"
                      className="focus:bg-base-300 rounded-none"
                    >
                      Historia zakupów
                    </Link>
                  </li>
                  <li>
                    <details open>
                      <summary className="rounded-none">Edytuj profil</summary>
                      <ul>
                        <li>
                          <Link className="rounded-none" to="/profil/edytuj">
                            Edytuj dane podstawowe
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="rounded-none"
                            to="/profil/edytuj-dodatkowe"
                          >
                            Edytuj dane dodatkowe
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/profil/edytuj-avatar"
                            className="rounded-none"
                          >
                            Zmień avatar
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="rounded-none"
                            to="/profil/zmien-haslo"
                          >
                            Zmień hasło
                          </Link>
                        </li>
                      </ul>
                    </details>
                  </li>

                  <li>
                    <Link
                      to="/login"
                      onClick={logoutUser}
                      className="rounded-none"
                    >
                      Wyloguj
                    </Link>
                  </li>
                </ul>
              </div>
            </ul>
          )}
          {user?.role == "Teacher" && (
            <ul className="menu menu-horizontal !px-0 gap-3">
              <li>
                <Link
                  to="/my-rooms"
                  className="focus:bg-base-300 hover:bg-base-200"
                >
                  Twoje pokoje
                </Link>
              </li>

              <div className="dropdown dropdown-end z-40">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">
                    <img src="/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                  </div>
                </label>
                <ul
                  tabIndex={0}
                  className=" mt-1z-[1] p-2 shadow shadow-base-400  menu menu-sm dropdown-content bg-white rounded-box w-52"
                >
                  <li>
                    <Link
                      to="/profil"
                      className="focus:bg-base-300 hover:bg-base-200"
                    >
                      Profil
                    </Link>
                  </li>
                  <li>
                    <a href="#" className="focus:bg-base-300 hover:bg-base-200">
                      Edytuj swoje oferty
                    </a>
                  </li>
                  <li>
                    <Link
                      to="/profil/otrzymane-opinie"
                      className="focus:bg-base-300 hover:bg-base-200"
                    >
                      Otrzymane opinie
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/plan/edytuj"
                      className="focus:bg-base-300 hover:bg-base-200"
                    >
                      Ustal harmonogram
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/zajecia/dodaj"
                      className="focus:bg-base-300 hover:bg-base-200"
                    >
                      Dodaj nowe zajęcia
                    </Link>
                  </li>

                  <li>
                    <a href="#" className="focus:bg-base-300 hover:bg-base-200">
                      Historia zakupów
                    </a>
                  </li>
                  <li>
                    <details open>
                      <summary className="focus:bg-base-300 hover:bg-base-200">
                        Edytuj profil
                      </summary>
                      <ul>
                        <li>
                          <Link
                            className="focus:bg-base-300 hover:bg-base-200"
                            to="/profil/edytuj"
                          >
                            Edytuj dane podstawowe
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="focus:bg-base-300 hover:bg-base-200"
                            to="/profil/edytuj-dodatkowe"
                          >
                            Edytuj dane dodatkowe
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/profil/edytuj-avatar"
                            className="focus:bg-base-300 hover:bg-base-200"
                          >
                            Zmień avatar
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/profil/zmien-haslo"
                            className="focus:bg-base-300 hover:bg-base-200"
                          >
                            Zmień hasło
                          </Link>
                        </li>
                      </ul>
                    </details>
                  </li>
                  <li>
                    <Link
                      to="/login"
                      onClick={logoutUser}
                      className="hover:bg-base-200"
                    >
                      Wyloguj
                    </Link>
                  </li>
                </ul>
              </div>
            </ul>
          )}
          {user == null && (
            <ul className="menu menu-horizontal px-1 gap-3">
              <li>
                <Link
                  to="/login"
                  className="focus:bg-base-300 hover:bg-base-200"
                >
                  Zaloguj
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="focus:bg-base-300 hover:bg-base-200"
                >
                  Zarejestruj
                </Link>
              </li>
            </ul>
          )}
        </div>
      </nav>
      <div className="navbar bg-base-100 phone:hidden pl-0 relative">
        <div className="flex-1">
          <Link
            className="btn border-none bg-white hover:bg-white normal-case text-xl"
            to="/"
          >
            korki.PL
          </Link>
        </div>
        <div className="flex-none">
          <button
            className="btn btn-square btn-ghost"
            onClick={() => setShowMobileMenu((prev) => !prev)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-5 h-5 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>
        <div
          className={`absolute z-[999] right-0 left-0 top-[60px] bg-white border-y-2 pb-5 mobile-menu ${
            showMobileMenu ? "menu-visible menu-fade-in" : "menu-fade-out"
          }`}
        >
          <ul className="w-full text-lg pt-2 ">
            {user == null && (
              <>
                <li
                  onClick={() => setShowMobileMenu((prev) => !prev)}
                  className="pl-5 w-full hover:bg-slate-100 h-10 flex items-center"
                >
                  {" "}
                  <Link to="/login">Strona główna</Link>
                </li>
                <li
                  onClick={() => setShowMobileMenu((prev) => !prev)}
                  className="pl-5 w-full hover:bg-slate-100 h-10 flex items-center"
                >
                  {" "}
                  <Link to="/login">Zaloguj</Link>
                </li>
                <li
                  onClick={() => setShowMobileMenu((prev) => !prev)}
                  className="pl-5 w-full hover:bg-slate-100 h-10 flex items-center"
                >
                  {" "}
                  <Link to="/register">Zarejestruj</Link>
                </li>
              </>
            )}
            {user?.role == "Student" && (
              <>
                <li onClick={() => setShowMobileMenu((prev) => !prev)}>
                  <Link
                    to="/profile"
                    className="pl-5 w-full hover:bg-slate-100 h-10 flex items-center"
                  >
                    Profil
                  </Link>
                </li>
                <li onClick={() => setShowMobileMenu((prev) => !prev)}>
                  <Link
                    to="/my-rooms"
                    className="pl-5 w-full hover:bg-slate-100 h-10 flex items-center"
                  >
                    Twoje pokoje
                  </Link>
                </li>
                <li onClick={() => setShowMobileMenu((prev) => !prev)}>
                  <a
                    href="#"
                    className="pl-5 w-full hover:bg-slate-100 h-10 flex items-center"
                  >
                    Historia zakupów
                  </a>
                </li>
                <li onClick={() => setShowMobileMenu((prev) => !prev)}>
                  <a
                    href="#"
                    className="pl-5 w-full hover:bg-slate-100 h-10 flex items-center"
                  >
                    Edytuj profil
                  </a>
                </li>
                <li onClick={() => setShowMobileMenu((prev) => !prev)}>
                  <Link
                    to="/login"
                    onClick={logoutUser}
                    className="pl-5 w-full hover:bg-slate-200 border-t-[1px] h-10 flex items-center"
                  >
                    Wyloguj
                  </Link>
                </li>
              </>
            )}
            {user?.role == "Teacher" && (
              <>
                <li onClick={() => setShowMobileMenu((prev) => !prev)}>
                  <Link
                    to="/profile"
                    className="pl-5 hover:bg-slate-100 h-10 flex items-center"
                  >
                    Profil
                  </Link>
                </li>
                <li onClick={() => setShowMobileMenu((prev) => !prev)}>
                  <a
                    href="#"
                    className="pl-5 hover:bg-slate-100 h-10 flex items-center"
                  >
                    Edytuj swoje oferty
                  </a>
                </li>
                <li onClick={() => setShowMobileMenu((prev) => !prev)}>
                  <a
                    href="#"
                    className="pl-5 hover:bg-slate-100 h-10 flex items-center"
                  >
                    Ustal harmonogram
                  </a>
                </li>

                <li onClick={() => setShowMobileMenu((prev) => !prev)}>
                  <a
                    href="#"
                    className="pl-5 hover:bg-slate-100 h-10 flex items-center"
                  >
                    Historia zakupów
                  </a>
                </li>
                <li onClick={() => setShowMobileMenu((prev) => !prev)}>
                  <a
                    href="#"
                    className="pl-5 hover:bg-slate-100 h-10 flex items-center"
                  >
                    Edytuj profil
                  </a>
                </li>
                <li onClick={() => setShowMobileMenu((prev) => !prev)}>
                  <Link
                    to="/login"
                    onClick={logoutUser}
                    className="pl-5 w-full hover:bg-slate-200 border-t-[1px] h-10 flex items-center"
                  >
                    Wyloguj
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
