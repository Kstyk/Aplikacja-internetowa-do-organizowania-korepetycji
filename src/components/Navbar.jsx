import React, { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import { NotificationContext } from '../context/NotificationContext'
import './Navbar.scss'
import transparent_logo from '../assets/transparent_logo.png'
import guest from '../assets/guest.png'
import { backendUrl } from '../variables/backendUrl'
import { AiOutlineHome } from 'react-icons/ai'
import useAxios from '../utils/useAxios'

const Navbar = () => {
  const api = useAxios()
  const { user, logoutUser } = useContext(AuthContext)
  const { countunreadallprivatemessages, setCountunreadallprivatemessages } =
    useContext(NotificationContext)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const unreadCountMessages = async () => {
    await api.get(`/api/users/unread-messages-count/`).then((res) => {
      setCountunreadallprivatemessages(res.data.unread_count)
    })
  }

  useEffect(() => {
    if (user != null) {
      unreadCountMessages()
    }
  }, [])

  return (
    <>
      <nav className="navbar h-[70px] bg-base-100 max-sm:hidden">
        <div className="flex h-full w-full items-center justify-between">
          <Link
            className="hidden border-none bg-transparent text-xl normal-case md:block"
            to="/"
          >
            <img
              src={transparent_logo}
              alt="logo_transparent"
              className="h-14"
            />
          </Link>
          <ul>
            <li className="custom-border h-fit">
              <Link
                className="tooltip tooltip-bottom block border-none bg-transparent !text-sm font-bold !normal-case md:hidden"
                data-tip="Strona główna"
                to="/"
              >
                <AiOutlineHome className="h-10 w-10" />
              </Link>
            </li>
          </ul>
          {user?.role == 'Student' && (
            <ul className="flex flex-row items-center gap-2 px-1">
              <li className="custom-border h-fit text-center">
                <Link to="/szukaj-zajec">Szukaj zajęć </Link>
              </li>
              <li>
                <div className="h-full border-2 border-black"></div>
              </li>
              <li className="custom-border h-fit text-center">
                <Link to="/my-rooms">Twoje pokoje</Link>
              </li>
              <li>
                <div className="h-full border-2 border-black"></div>
              </li>
              <li className="custom-border h-fit text-center">
                <Link to="/profil-ucznia/harmonogram">Twój harmonogram</Link>
              </li>
              <li>
                <div className="h-full border-2 border-black"></div>
              </li>
              <li className="custom-border h-fit text-center">
                <Link to="/profil/dodane-opinie" className="">
                  Wystawione opinie{' '}
                </Link>
              </li>
              <li>
                <div className="h-full border-2 border-black"></div>
              </li>
              <div className="dropdown-end dropdown z-40">
                <label tabIndex={0} className="btn-ghost btn-circle avatar btn">
                  <div className="w-10 rounded-full">
                    <img
                      src={
                        user?.image != null && user?.image != ''
                          ? `${backendUrl}${user?.image}`
                          : guest
                      }
                    />
                  </div>
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu menu-sm z-[1] mt-3 w-52 rounded-none bg-base-100 p-2 shadow"
                >
                  <li className="custom-border-dropdown h-fit">
                    <Link
                      to="/skrzynka-odbiorcza"
                      className={`w-full rounded-none ${
                        countunreadallprivatemessages > 0 && 'font-bold'
                      }`}
                    >
                      <span>Skrzynka odbiorcza</span>
                      <span className="badge badge-primary">
                        {countunreadallprivatemessages}
                      </span>
                    </Link>
                  </li>
                  <li className="custom-border-dropdown h-fit">
                    <Link to="/profil-ucznia" className="rounded-none">
                      Profil
                    </Link>
                  </li>
                  <li className="custom-border-dropdown h-fit">
                    <Link
                      to="/profil/historia-zakupow"
                      className="rounded-none hover:bg-transparent"
                    >
                      Historia zakupów
                    </Link>
                  </li>

                  <li className="h-fit">
                    <details open>
                      <summary className="uppercase hover:bg-transparent">
                        Edytuj profil
                      </summary>
                      <ul className="flex flex-col">
                        <li className="custom-border-dropdown h-fit">
                          <Link className="rounded-none" to="/profil/edytuj">
                            Edytuj dane podstawowe
                          </Link>
                        </li>
                        <li className="custom-border-dropdown h-fit">
                          <Link
                            className="rounded-none"
                            to="/profil/edytuj-dodatkowe"
                          >
                            Edytuj dane dodatkowe
                          </Link>
                        </li>
                        <li className="custom-border-dropdown">
                          <Link
                            to="/profil/edytuj-avatar"
                            className="rounded-none"
                          >
                            Zmień avatar
                          </Link>
                        </li>
                        <li className="custom-border-dropdown">
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

                  <li className="custom-border-dropdown h-fit">
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
            <ul className="flex flex-row items-center gap-2 px-1">
              <li className="custom-border h-fit text-center">
                <Link to="/my-rooms">Twoje pokoje</Link>
              </li>
              <li>
                <div className="h-full border-2 border-black"></div>
              </li>
              <li className="custom-border h-fit text-center">
                <Link to="/profil/harmonogram">Twój harmonogram</Link>
              </li>
              <li>
                <div className="h-full border-2 border-black"></div>
              </li>
              <li className="custom-border h-fit text-center">
                <Link to="/profil/otrzymane-opinie">Otrzymane opinie</Link>
              </li>
              <li>
                <div className="h-full border-2 border-black"></div>
              </li>

              <div className="dropdown-end dropdown z-40">
                <label tabIndex={0} className="btn-ghost btn-circle avatar btn">
                  <div className="w-10 rounded-full">
                    <img
                      src={
                        user?.image != null && user?.image != ''
                          ? `${backendUrl}${user?.image}`
                          : guest
                      }
                    />
                  </div>
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu menu-sm z-[1] mt-3 w-52 rounded-none bg-base-100 p-2 shadow"
                >
                  <li className="custom-border-dropdown h-fit">
                    <Link
                      to="/skrzynka-odbiorcza"
                      className={`w-full rounded-none ${
                        countunreadallprivatemessages > 0 && 'font-bold'
                      }`}
                    >
                      <span>Skrzynka odbiorcza</span>
                      <span className="badge badge-primary">
                        {countunreadallprivatemessages}
                      </span>
                    </Link>
                  </li>
                  <li>
                    <details open>
                      <summary className="uppercase hover:bg-transparent">
                        Zajęcia
                      </summary>
                      <ul>
                        <li className="custom-border-dropdown h-fit">
                          <Link to="/zajecia">Lista zajęć</Link>
                        </li>
                        <li className="custom-border-dropdown h-fit">
                          <Link to="/zajecia/dodaj">Dodaj nowe zajęcia</Link>
                        </li>
                        <li className="custom-border-dropdown h-fit">
                          <Link to="/plan/edytuj">Ustal harmonogram</Link>
                        </li>
                        <li className="custom-border-dropdown h-fit">
                          <Link to="/profil/zakupione-zajecia">
                            Historia zakupionych zajęć
                          </Link>
                        </li>
                      </ul>
                    </details>
                  </li>
                  <li>
                    <details open>
                      <summary className="uppercase hover:bg-transparent">
                        Profil
                      </summary>
                      <ul>
                        <li className="custom-border-dropdown h-fit">
                          <Link to="/profil">Profil</Link>
                        </li>
                        <li className="custom-border-dropdown h-fit">
                          <Link to="/profil/edytuj">
                            Edytuj dane podstawowe
                          </Link>
                        </li>
                        <li className="custom-border-dropdown h-fit">
                          <Link to="/profil/edytuj-dodatkowe">
                            Edytuj dane dodatkowe
                          </Link>
                        </li>
                        <li className="custom-border-dropdown h-fit">
                          <Link
                            to="/profil/edytuj-avatar"
                            className="hover:bg-base-200 focus:bg-base-300"
                          >
                            Zmień avatar
                          </Link>
                        </li>
                        <li className="custom-border-dropdown h-fit">
                          <Link to="/profil/zmien-haslo">Zmień hasło</Link>
                        </li>
                      </ul>
                    </details>
                  </li>
                  <li className="custom-border-dropdown h-fit">
                    <Link to="/logowanie" onClick={logoutUser}>
                      Wyloguj
                    </Link>
                  </li>
                </ul>
              </div>
            </ul>
          )}
          {user == null && (
            <ul className="flex flex-row items-center gap-2 px-1">
              <li className="custom-border h-fit text-center">
                <Link to="/logowanie">Zaloguj</Link>
              </li>
              <li>
                <div className="h-full border-2 border-black"></div>
              </li>
              <li className="custom-border h-fit text-center">
                <Link to="/register">Zarejestruj</Link>
              </li>
            </ul>
          )}
        </div>
      </nav>
      <div className="navbar relative h-[70px] bg-base-100 pl-0 sm:hidden">
        <div className="flex-1">
          <Link
            className="block border-none bg-transparent text-xl normal-case sm:hidden"
            to="/"
          >
            <img
              src={transparent_logo}
              alt="logo_transparent"
              className="h-14"
            />
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
          className={`mobile-menu absolute left-0 right-0 top-[65px] z-[999] border-y-2 bg-base-100 ${
            showMobileMenu ? 'hidden' : 'block'
          }`}
        >
          <ul className="w-full bg-base-100 pt-2 text-lg">
            {user == null && (
              <>
                <li
                  onClick={() => setShowMobileMenu((prev) => !prev)}
                  className="flex h-8 w-full items-center pl-5 text-sm uppercase"
                >
                  {' '}
                  <Link to="/logowanie">Strona główna</Link>
                </li>
                <li
                  onClick={() => setShowMobileMenu((prev) => !prev)}
                  className="flex h-8 w-full items-center pl-5 text-sm uppercase"
                >
                  {' '}
                  <Link to="/logowanie">Zaloguj</Link>
                </li>
                <li
                  onClick={() => setShowMobileMenu((prev) => !prev)}
                  className="mb-2 flex h-8 w-full items-center pl-5 text-sm uppercase"
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
                    to="/skrzynka-odbiorcza"
                    className={`flex h-8 w-full items-center pl-5 text-sm uppercase ${
                      countunreadallprivatemessages > 0 && 'font-bold'
                    }`}
                  >
                    <span className="mr-3">Skrzynka odbiorcza</span>
                    <span className="badge badge-primary">
                      {countunreadallprivatemessages}
                    </span>
                  </Link>
                </li>
                <li onClick={() => setShowMobileMenu((prev) => !prev)}>
                  <Link
                    to="/szukaj-zajec"
                    className="flex h-8 w-full items-center pl-5 text-sm uppercase"
                  >
                    Szukaj zajęć{' '}
                  </Link>
                </li>

                <li onClick={() => setShowMobileMenu((prev) => !prev)}>
                  <Link
                    to="/my-rooms"
                    className="flex h-8 w-full items-center pl-5 text-sm uppercase"
                  >
                    Twoje pokoje
                  </Link>
                </li>

                <li onClick={() => setShowMobileMenu((prev) => !prev)}>
                  <Link
                    to="/my-rooms"
                    className="flex h-8 w-full items-center pl-5 text-sm uppercase"
                  >
                    Twój harmonogram
                  </Link>
                </li>
                <li onClick={() => setShowMobileMenu((prev) => !prev)}>
                  <Link
                    to="/profil/dodane-opinie"
                    className="flex h-8 w-full items-center pl-5 text-sm uppercase"
                  >
                    Wystawione opinie
                  </Link>
                </li>
                <div className="collapse-arrow collapse p-0 uppercase">
                  <input type="checkbox" className="absolute h-8 min-h-0" />
                  <div className="collapse-title flex h-8 min-h-0 items-center p-0 pl-5 text-sm">
                    Profil
                  </div>
                  <div className="collapse-content mb-3 ml-10 min-h-0 border-l-[1px] border-gray-300 !pb-0 text-sm">
                    <ul>
                      <li onClick={() => setShowMobileMenu((prev) => !prev)}>
                        <Link
                          to="/profil-ucznia"
                          className="flex h-8 w-full items-center text-sm uppercase"
                        >
                          Profil
                        </Link>
                      </li>

                      <li onClick={() => setShowMobileMenu((prev) => !prev)}>
                        <Link
                          className="flex h-8 w-full items-center text-sm uppercase"
                          to="/profil/edytuj"
                        >
                          Edytuj dane podstawowe
                        </Link>
                      </li>
                      <li onClick={() => setShowMobileMenu((prev) => !prev)}>
                        <Link
                          className="flex h-8 w-full items-center text-sm uppercase"
                          to="/profil/edytuj-dodatkowe"
                        >
                          Edytuj dane dodatkowe
                        </Link>
                      </li>
                      <li onClick={() => setShowMobileMenu((prev) => !prev)}>
                        <Link
                          to="/profil/edytuj-avatar"
                          className="flex h-8 w-full items-center text-sm uppercase"
                        >
                          Zmień avatar
                        </Link>
                      </li>
                      <li onClick={() => setShowMobileMenu((prev) => !prev)}>
                        <Link
                          className="flex h-8 w-full items-center text-sm uppercase"
                          to="/profil/zmien-haslo"
                        >
                          Zmień hasło
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <hr />
                <li
                  className="mb-2"
                  onClick={() => setShowMobileMenu((prev) => !prev)}
                >
                  <Link
                    to="/logowanie"
                    onClick={logoutUser}
                    className="flex h-8 w-full items-center pl-5 text-sm uppercase"
                  >
                    Wyloguj{' '}
                  </Link>
                </li>
              </>
            )}
            {user?.role == 'Teacher' && (
              <>
                <li onClick={() => setShowMobileMenu((prev) => !prev)}>
                  <Link
                    to="/skrzynka-odbiorcza"
                    className={`flex h-8 w-full items-center pl-5 text-sm uppercase ${
                      countunreadallprivatemessages > 0 && 'font-bold'
                    }`}
                  >
                    <span className="mr-3">Skrzynka odbiorcza</span>
                    <span className="badge badge-primary">
                      {countunreadallprivatemessages}
                    </span>
                  </Link>
                </li>
                <li onClick={() => setShowMobileMenu((prev) => !prev)}>
                  <Link
                    to="/my-rooms"
                    className="flex h-8 w-full items-center pl-5 text-sm uppercase"
                  >
                    Twoje pokoje
                  </Link>
                </li>

                <li onClick={() => setShowMobileMenu((prev) => !prev)}>
                  <Link
                    to="/profil/harmonogram"
                    className="flex h-8 w-full items-center pl-5 text-sm uppercase"
                  >
                    Twój harmonogram
                  </Link>
                </li>
                <li onClick={() => setShowMobileMenu((prev) => !prev)}>
                  <Link
                    to="/profil/otrzymane-opinie"
                    className="flex h-8 w-full items-center pl-5 text-sm uppercase"
                  >
                    Otrzymane opinie
                  </Link>
                </li>
                <div className="collapse-arrow collapse p-0 uppercase">
                  <input type="checkbox" className="absolute h-8 min-h-0" />
                  <div className="collapse-title flex h-8 min-h-0 items-center p-0 pl-5 text-sm">
                    Profil
                  </div>
                  <div className="collapse-content ml-10 min-h-0 border-l-[1px] border-gray-300 !pb-0 text-sm">
                    <ul>
                      <li onClick={() => setShowMobileMenu((prev) => !prev)}>
                        <Link
                          to="/profil-ucznia"
                          className="flex h-8 w-full items-center text-sm uppercase"
                        >
                          Profil
                        </Link>
                      </li>

                      <li onClick={() => setShowMobileMenu((prev) => !prev)}>
                        <Link
                          className="flex h-8 w-full items-center text-sm uppercase"
                          to="/profil/edytuj"
                        >
                          Edytuj dane podstawowe
                        </Link>
                      </li>
                      <li onClick={() => setShowMobileMenu((prev) => !prev)}>
                        <Link
                          className="flex h-8 w-full items-center text-sm uppercase"
                          to="/profil/edytuj-dodatkowe"
                        >
                          Edytuj dane dodatkowe
                        </Link>
                      </li>
                      <li onClick={() => setShowMobileMenu((prev) => !prev)}>
                        <Link
                          to="/profil/edytuj-avatar"
                          className="flex h-8 w-full items-center text-sm uppercase"
                        >
                          Zmień avatar
                        </Link>
                      </li>
                      <li onClick={() => setShowMobileMenu((prev) => !prev)}>
                        <Link
                          className="flex h-8 w-full items-center text-sm uppercase"
                          to="/profil/zmien-haslo"
                        >
                          Zmień hasło
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="collapse-arrow collapse p-0 uppercase">
                  <input type="checkbox" className="absolute h-8 min-h-0" />
                  <div className="collapse-title flex h-8 min-h-0 items-center p-0 pl-5 text-sm">
                    Zajęcia
                  </div>
                  <div className="collapse-content mb-3 ml-10 min-h-0 border-l-[1px] border-gray-300 !pb-0 text-sm">
                    <ul>
                      <li onClick={() => setShowMobileMenu((prev) => !prev)}>
                        <Link
                          to="/zajecia"
                          className="flex h-8 w-full items-center text-sm uppercase"
                        >
                          Lista zajęć
                        </Link>
                      </li>

                      <li onClick={() => setShowMobileMenu((prev) => !prev)}>
                        <Link
                          className="flex h-8 w-full items-center text-sm uppercase"
                          to="/zajecia/dodaj"
                        >
                          Dodaj nowe zajęcia{' '}
                        </Link>
                      </li>
                      <li onClick={() => setShowMobileMenu((prev) => !prev)}>
                        <Link
                          className="flex h-8 w-full items-center text-sm uppercase"
                          to="/plan/edytuj"
                        >
                          Ustal harmonogram{' '}
                        </Link>
                      </li>
                      <li onClick={() => setShowMobileMenu((prev) => !prev)}>
                        <Link className="flex h-8 w-full items-center text-sm uppercase">
                          Historia zakupionych zajęć{' '}
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <hr />
                <li
                  className="mb-2"
                  onClick={() => setShowMobileMenu((prev) => !prev)}
                >
                  <Link
                    to="/logowanie"
                    onClick={logoutUser}
                    className="flex h-8 w-full items-center pl-5 text-sm uppercase"
                  >
                    Wyloguj{' '}
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
