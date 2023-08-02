import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="absolute top-[70px] left-0 right-0 h-[300px] bg-base-300">
      <div className="w-8/12 mx-auto bg-base-100 card shadow-xl h-full px-5 py-5 mt-10 rounded-none mb-10">
        <h1 className="text-center text-4xl">
          Znajdź korepetytora dla siebie lub dla swojego dziecka już dziś!
        </h1>
        <div className="form-control mt-5 w-10/12 mx-auto">
          <div className="input-group">
            <input
              type="text"
              placeholder="Szukaj korepetytora"
              className="input input-bordered w-full !rounded-none focus:outline-none"
            />
            <button className="btn btn-square bg-base-300 border-none !rounded-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
