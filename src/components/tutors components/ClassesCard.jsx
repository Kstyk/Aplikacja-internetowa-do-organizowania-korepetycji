import React from "react";
import { MdOutlineLocationOn } from "react-icons/md";
import guest from "../../assets/guest.png";
import { AiOutlinePhone } from "react-icons/ai";
import { Link, useParams } from "react-router-dom";
import { backendUrl } from "../../variables/backendUrl";

const ClassesCard = (props) => {
  const { classes } = props;

  return (
    <div className="card border-[1px] border-base-200 p-4 rounded-none bg-white">
      <div className="flex flex-row">
        <div className="flex flex-col phone:w-10/12 phone:border-r-[1px] border-base-200 pr-4">
          <div className="phone:hidden w-full mb-2 pb-2 border-b-[1px] border-base-200">
            <div className="rating rating-xs mr-2 ">
              <input
                type="radio"
                name="rating-6"
                className="mask mask-star-2 bg-base-400"
                readOnly
              />
              <input
                type="radio"
                name="rating-6"
                className="mask mask-star-2 bg-base-400"
                readOnly
              />
              <input
                type="radio"
                name="rating-6"
                className="mask mask-star-2 bg-base-400"
                readOnly
              />
              <input
                type="radio"
                name="rating-6"
                className="mask mask-star-2 bg-base-400"
                readOnly
              />
              <input
                type="radio"
                name="rating-6"
                className="mask mask-star-2 bg-base-400"
                readOnly
              />
            </div>
            <span className="text-center text-xs mt-2 text-base-400">
              (66 opinii)
            </span>
          </div>
          <div className="text-gray-500 text-sm">
            Język {classes.language.name}
          </div>
          <Link
            to={`/classes/${classes?.id}`}
            params={{
              classesId: classes?.id,
            }}
          >
            <h1 className="text-xl font-semibold uppercase border-b-[1px] pb-1 mb-1 border-base-200">
              {classes.name}
            </h1>
          </Link>
          <Link
            to={`/teachers/${classes?.teacher?.user?.id}`}
            params={{
              teacherId: classes?.teacher?.user?.id,
            }}
          >
            <div className="flex flex-row align-middle items-center border-b-[1px] border-base-200 pb-1 mb-1 gap-x-5">
              <div className="avatar py-3">
                <div className="w-20 rounded-full hover:ring ring-primary ring-offset-base-100 ring-offset-2 transition-all duration-200">
                  <img
                    src={
                      classes?.teacher?.profile_image == null
                        ? guest
                        : `${backendUrl}${classes?.teacher?.profile_image}`
                    }
                  />
                </div>
              </div>
              <h2 className="text-lg ">
                {classes.teacher?.user?.first_name}{" "}
                {classes.teacher?.user?.last_name}
              </h2>
            </div>
          </Link>
          <div className="description text-justify text-sm pt-1">
            {classes.description.length > 250
              ? classes.description
                  .replace(/(<([^>]+)>)/gi, " ")
                  .substring(0, 250) + "..."
              : classes.description.replace(/(<([^>]+)>)/gi, " ")}
          </div>
          <div className="phone:hidden border-t-[1px] pt-2 mt-2 border-base-200 flex flex-row items-center">
            <div className="pr-2 border-r-[1px] border-base-200">
              <span className="text-lg font-bold text-center max-md:text-base">
                {classes.price_for_lesson} PLN
              </span>
              <span className="text-center max-md:text-sm"> za godzinę</span>
            </div>
            <div className="pl-2 text-sm">
              {classes?.teacher?.phone_number != null ? (
                <span className="flex flex-row items-center">
                  <AiOutlinePhone className="mr-2 text-[1.5em]" />
                  {classes?.teacher?.phone_number}
                </span>
              ) : (
                "Brak numeru telefonu"
              )}
            </div>
          </div>
          <div className="text-sm pt-2 mt-2 border-t-[1px] border-base-200 text-gray-400">
            {classes?.teacher?.phone_number != null ? (
              <span className="flex flex-row items-center">
                <AiOutlinePhone className="mr-2 text-[1.5em] text-[gray]" />|{" "}
                {classes?.teacher?.phone_number} |{" "}
                {classes?.teacher?.user.email}
              </span>
            ) : (
              <span className="flex flex-row">
                {" "}
                <AiOutlinePhone className="mr-2 text-[1.5em] text-[gray]" />
                Brak numeru telefonu | {classes?.teacher?.user.email}
              </span>
            )}
          </div>
          <div className="flex items-center mt-2 border-t-[1px] pt-2 border-base-200">
            <div className="flex flex-row text-sm text-gray-400">
              <MdOutlineLocationOn
                className="mr-2"
                style={{
                  color: "gray",
                  fontSize: "1.5em",
                  verticalAlign: "middle",
                }}
              />
              {classes.teacher?.place_of_classes.map((item) =>
                item == "online" ? "Online" : ""
              )}
              {" | "}
              {classes.teacher?.cities_of_work.length > 0
                ? classes.teacher.cities_of_work
                    .map((city) => city.name)
                    .slice(0, 10) // Pobierz maksymalnie 3 miasta
                    .join(" | ")
                    .substring(0, 100) // Ogranicz do 100 znaków
                : ""}
            </div>
          </div>
        </div>
        <div className="flex flex-col w-2/12 pl-4 max-phone:hidden">
          <span className="text-lg font-bold text-center max-md:text-base">
            {classes.price_for_lesson} PLN
          </span>
          <span className="text-center max-md:text-sm">za godzinę</span>
          <div className="rating lg:rating-sm max-lg:rating-xs mx-auto mt-2 pt-2 border-t-[1px] border-base-200">
            <input
              type="radio"
              name="rating-6"
              className="mask mask-star-2 bg-base-400"
              readOnly
            />
            <input
              type="radio"
              name="rating-6"
              className="mask mask-star-2 bg-base-400"
              readOnly
            />
            <input
              type="radio"
              name="rating-6"
              className="mask mask-star-2 bg-base-400"
              readOnly
            />
            <input
              type="radio"
              name="rating-6"
              className="mask mask-star-2 bg-base-400"
              readOnly
            />
            <input
              type="radio"
              name="rating-6"
              className="mask mask-star-2 bg-base-400"
              readOnly
            />
          </div>
          <span className="text-center text-xs mt-2 text-base-400">
            (66 opinii)
          </span>
        </div>
      </div>
    </div>
  );
};

export default ClassesCard;
