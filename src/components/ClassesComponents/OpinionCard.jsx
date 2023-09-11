import React from "react";
import guest from "../../assets/guest.png";
import { backendUrl } from "../../variables/backendUrl";
import dayjs from "dayjs";
import { BiSolidQuoteLeft, BiSolidQuoteRight } from "react-icons/bi";

const OpinionCard = ({ opinion, page }) => {
  dayjs.locale("pl");
  return (
    <div
      className={`card w-full p-5 max-phone:px-0 hover:bg-gray-50 hover:shadow-sm rounded-sm animate__animated animate__fadeIn`}
    >
      <div className="header flex flex-row justify-between gap-x-2">
        <div className="flex flex-row gap-x-5 items-center">
          <div className="avatar">
            <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-full hover:ring ring-primary ring-offset-base-100 ring-offset-2 transition-all duration-200">
              <img
                src={
                  opinion?.student_profile_image
                    ? `${backendUrl}${opinion?.student_profile_image}`
                    : guest
                }
              />
            </div>
          </div>
          <div className="flex flex-col justify-start gap-y-2">
            <span className="name text-lg uppercase tracking-wider ">
              {opinion?.student?.first_name}
            </span>
            <div className="flex flex-row gap-x-3">
              <div className="rating rating-sm phone:rating-md">
                {Array.from({ length: 5 }, (_, index) => (
                  <input
                    key={index}
                    type="radio"
                    name={`${opinion?.id}__rate`}
                    className="mask mask-star-2 bg-base-300"
                    checked={opinion?.rate == index + 1 ? true : false}
                    readOnly
                  />
                ))}
              </div>
              <span className="text-xl hidden phone:block">
                {opinion?.rate} / 5
              </span>
            </div>
          </div>
        </div>
        <div className="date">
          <span className="text-gray-600 text-sm">
            {dayjs(opinion.published_date).format("DD MMMM YYYY")}
          </span>
        </div>
      </div>
      <div className="mt-5 px-8 py-3 bg-gray-100 border-gray-400 border-[1px] relative">
        <BiSolidQuoteLeft className="absolute -top-3 left-2 h-5 w-5" />
        <BiSolidQuoteRight className="absolute -bottom-3 right-2 h-5 w-5" />
        <p className="italic text-gray-700 b text-sm phone:text-base break-words">
          {opinion?.content}
        </p>
      </div>
    </div>
  );
};

export default OpinionCard;
