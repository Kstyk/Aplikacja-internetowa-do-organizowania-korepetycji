import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import logo_transparent from "../assets/logo_transparent.png";

const Navbar = () => {
  let { user, logoutUser } = useContext(AuthContext);

  return (
    <nav className="navbar bg-base-100 h-[70px]">
      <div className="flex-1">
        <Link
          to="/"
          className="btn border-none bg-transparent hover:bg-transparent normal-case text-xl"
        >
          <img className="h-full w-10/12" src={logo_transparent} />
        </Link>
      </div>
      <div className="flex-none">
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

            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img src="/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
              >
                <li>
                  <Link
                    to="/profile"
                    className="focus:bg-base-300 hover:bg-base-200"
                  >
                    Profil
                  </Link>
                </li>
                <li>
                  <a href="#" className="focus:bg-base-300 hover:bg-base-200">
                    Twoje pokoje
                  </a>
                </li>
                <li>
                  <a href="#" className="focus:bg-base-300 hover:bg-base-200">
                    Historia zakupów
                  </a>
                </li>
                <li>
                  <a href="#" className="focus:bg-base-300 hover:bg-base-200">
                    Edytuj profil
                  </a>
                </li>
                <li>
                  <Link
                    to="/login"
                    onClick={logoutUser}
                    className="hover:bg-base-200"
                  >
                    Logout
                  </Link>
                </li>
              </ul>
            </div>
          </ul>
        )}
        {user?.role == "Teacher" && (
          <ul className="menu menu-horizontal px-1 gap-3">
            <li>
              <Link
                to="/my-rooms"
                className="focus:bg-base-300 hover:bg-base-200"
              >
                Twoje pokoje
              </Link>
            </li>

            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img src="/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
              >
                <li>
                  <Link
                    to="/profile"
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
                  <a href="#" className="focus:bg-base-300 hover:bg-base-200">
                    Ustal harmonogram
                  </a>
                </li>

                <li>
                  <a href="#" className="focus:bg-base-300 hover:bg-base-200">
                    Historia zakupów
                  </a>
                </li>
                <li>
                  <a href="#" className="focus:bg-base-300 hover:bg-base-200">
                    Edytuj profil
                  </a>
                </li>
                <li>
                  <Link
                    to="/login"
                    onClick={logoutUser}
                    className="hover:bg-base-200"
                  >
                    Logout
                  </Link>
                </li>
              </ul>
            </div>
          </ul>
        )}
        {user == null && (
          <ul className="menu menu-horizontal px-1 gap-3">
            <li>
              <Link to="/login" className="focus:bg-base-300 hover:bg-base-200">
                Login
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="focus:bg-base-300 hover:bg-base-200"
              >
                Register
              </Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
