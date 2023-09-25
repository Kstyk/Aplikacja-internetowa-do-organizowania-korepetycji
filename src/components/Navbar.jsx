import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import './Navbar.scss'

const Navbar = () => {
  let { user, logoutUser } = useContext(AuthContext)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  return (
    <>
      <nav className="navbar h-[70px] bg-base-100 max-phone:hidden">
        <div className="flex-1"></div>
        <div className="flex-none">
          <Link
            className="btn border-none bg-white text-xl normal-case hover:bg-white"
            to="/"
          >
            korki.PL
          </Link>
          {user?.role == 'Student' && (
            <ul className="menu menu-horizontal gap-3 px-1">
              <li>
                <Link to="#" className="hover:bg-base-200 focus:bg-base-300">
                  Szukaj korepetytorów
                </Link>
              </li>
              <li>
                <Link
                  to="/my-rooms"
                  className="hover:bg-base-200 focus:bg-base-300"
                >
                  Twoje pokoje
                </Link>
              </li>

              <div className="dropdown-end dropdown z-40">
                <label tabIndex={0} className="btn-ghost btn-circle avatar btn">
                  Profil
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu menu-sm z-[1] mt-3 w-52 rounded-none border-2 border-base-300 bg-base-100 p-2 shadow"
                >
                  <li>
                    <Link
                      to="/profil-ucznia"
                      className="rounded-none  focus:bg-base-300"
                    >
                      Profil
                    </Link>
                  </li>
                  <li>
                    <a href="#" className="rounded-none focus:bg-base-300">
                      Twoje pokoje
                    </a>
                  </li>
                  <li>
                    <Link
                      to="/profil/historia-zakupow"
                      className="rounded-none focus:bg-base-300"
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
                      to="/logowanie"
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
          {user?.role == 'Teacher' && (
            <ul className="menu menu-horizontal gap-3 !px-0">
              <li>
                <Link
                  to="/my-rooms"
                  className="hover:bg-base-200 focus:bg-base-300"
                >
                  Twoje pokoje
                </Link>
              </li>

              <div className="dropdown-end dropdown z-40">
                <label tabIndex={0} className="btn-ghost btn-circle avatar btn">
                  <div className="w-10 rounded-full">
                    <img src="/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                  </div>
                </label>
                <ul
                  tabIndex={0}
                  className=" mt-1z-[1] dropdown-content menu rounded-box  menu-sm w-52 bg-white p-2 shadow shadow-base-400"
                >
                  <li>
                    <Link
                      to="/profil"
                      className="hover:bg-base-200 focus:bg-base-300"
                    >
                      Profil
                    </Link>
                  </li>
                  <li>
                    <a href="#" className="hover:bg-base-200 focus:bg-base-300">
                      Edytuj swoje oferty
                    </a>
                  </li>
                  <li>
                    <Link
                      to="/profil/otrzymane-opinie"
                      className="hover:bg-base-200 focus:bg-base-300"
                    >
                      Otrzymane opinie
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/plan/edytuj"
                      className="hover:bg-base-200 focus:bg-base-300"
                    >
                      Ustal harmonogram
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/zajecia"
                      className="hover:bg-base-200 focus:bg-base-300"
                    >
                      Lista zajęć
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/zajecia/dodaj"
                      className="hover:bg-base-200 focus:bg-base-300"
                    >
                      Dodaj nowe zajęcia
                    </Link>
                  </li>

                  <li>
                    <a href="#" className="hover:bg-base-200 focus:bg-base-300">
                      Historia zakupów
                    </a>
                  </li>
                  <li>
                    <details open>
                      <summary className="hover:bg-base-200 focus:bg-base-300">
                        Edytuj profil
                      </summary>
                      <ul>
                        <li>
                          <Link
                            className="hover:bg-base-200 focus:bg-base-300"
                            to="/profil/edytuj"
                          >
                            Edytuj dane podstawowe
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="hover:bg-base-200 focus:bg-base-300"
                            to="/profil/edytuj-dodatkowe"
                          >
                            Edytuj dane dodatkowe
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/profil/edytuj-avatar"
                            className="hover:bg-base-200 focus:bg-base-300"
                          >
                            Zmień avatar
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/profil/zmien-haslo"
                            className="hover:bg-base-200 focus:bg-base-300"
                          >
                            Zmień hasło
                          </Link>
                        </li>
                      </ul>
                    </details>
                  </li>
                  <li>
                    <Link
                      to="/logowanie"
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
            <ul className="menu menu-horizontal gap-3 px-1">
              <li>
                <Link
                  to="/logowanie"
                  className="hover:bg-base-200 focus:bg-base-300"
                >
                  Zaloguj
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="hover:bg-base-200 focus:bg-base-300"
                >
                  Zarejestruj
                </Link>
              </li>
            </ul>
          )}
        </div>
      </nav>
      <div className="navbar relative h-[70px] bg-base-100 pl-0 phone:hidden">
        <div className="flex-1">
          <Link
            className="btn border-none bg-white text-xl normal-case hover:bg-white"
            to="/"
          >
            korki.PL
          </Link>
        </div>
        <div className="flex-none">
          <button
            className="btn-ghost btn-square btn"
            onClick={() => setShowMobileMenu((prev) => !prev)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-5 w-5 stroke-current"
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
          className={`mobile-menu absolute left-0 right-0 top-[60px] z-[999] border-y-2 bg-white pb-5 ${
            showMobileMenu ? 'menu-visible menu-fade-in' : 'menu-fade-out'
          }`}
        >
          <ul className="w-full pt-2 text-lg ">
            {user == null && (
              <>
                <li
                  onClick={() => setShowMobileMenu((prev) => !prev)}
                  className="flex h-10 w-full items-center pl-5 hover:bg-slate-100"
                >
                  {' '}
                  <Link to="/logowanie">Strona główna</Link>
                </li>
                <li
                  onClick={() => setShowMobileMenu((prev) => !prev)}
                  className="flex h-10 w-full items-center pl-5 hover:bg-slate-100"
                >
                  {' '}
                  <Link to="/logowanie">Zaloguj</Link>
                </li>
                <li
                  onClick={() => setShowMobileMenu((prev) => !prev)}
                  className="flex h-10 w-full items-center pl-5 hover:bg-slate-100"
                >
                  {' '}
                  <Link to="/register">Zarejestruj</Link>
                </li>
              </>
            )}
            {user?.role == 'Student' && (
              <>
                <li onClick={() => setShowMobileMenu((prev) => !prev)}>
                  <Link
                    to="/profile"
                    className="flex h-10 w-full items-center pl-5 hover:bg-slate-100"
                  >
                    Profil
                  </Link>
                </li>
                <li onClick={() => setShowMobileMenu((prev) => !prev)}>
                  <Link
                    to="/my-rooms"
                    className="flex h-10 w-full items-center pl-5 hover:bg-slate-100"
                  >
                    Twoje pokoje
                  </Link>
                </li>
                <li onClick={() => setShowMobileMenu((prev) => !prev)}>
                  <a
                    href="#"
                    className="flex h-10 w-full items-center pl-5 hover:bg-slate-100"
                  >
                    Historia zakupów
                  </a>
                </li>
                <li onClick={() => setShowMobileMenu((prev) => !prev)}>
                  <a
                    href="#"
                    className="flex h-10 w-full items-center pl-5 hover:bg-slate-100"
                  >
                    Edytuj profil
                  </a>
                </li>
                <li onClick={() => setShowMobileMenu((prev) => !prev)}>
                  <Link
                    to="/logowanie"
                    onClick={logoutUser}
                    className="flex h-10 w-full items-center border-t-[1px] pl-5 hover:bg-slate-200"
                  >
                    Wyloguj
                  </Link>
                </li>
              </>
            )}
            {user?.role == 'Teacher' && (
              <>
                <li onClick={() => setShowMobileMenu((prev) => !prev)}>
                  <Link
                    to="/profile"
                    className="flex h-10 items-center pl-5 hover:bg-slate-100"
                  >
                    Profil
                  </Link>
                </li>
                <li onClick={() => setShowMobileMenu((prev) => !prev)}>
                  <a
                    href="#"
                    className="flex h-10 items-center pl-5 hover:bg-slate-100"
                  >
                    Edytuj swoje oferty
                  </a>
                </li>
                <li onClick={() => setShowMobileMenu((prev) => !prev)}>
                  <a
                    href="#"
                    className="flex h-10 items-center pl-5 hover:bg-slate-100"
                  >
                    Ustal harmonogram
                  </a>
                </li>

                <li onClick={() => setShowMobileMenu((prev) => !prev)}>
                  <a
                    href="#"
                    className="flex h-10 items-center pl-5 hover:bg-slate-100"
                  >
                    Historia zakupów
                  </a>
                </li>
                <li onClick={() => setShowMobileMenu((prev) => !prev)}>
                  <a
                    href="#"
                    className="flex h-10 items-center pl-5 hover:bg-slate-100"
                  >
                    Edytuj profil
                  </a>
                </li>
                <li onClick={() => setShowMobileMenu((prev) => !prev)}>
                  <Link
                    to="/logowanie"
                    onClick={logoutUser}
                    className="flex h-10 w-full items-center border-t-[1px] pl-5 hover:bg-slate-200"
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
  )
}

export default Navbar
