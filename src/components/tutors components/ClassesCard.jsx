import React from "react";
import { MdOutlineLocationOn } from "react-icons/md";
import guest from "../../assets/guest.png";

const ClassesCard = (props) => {
  const { classes } = props;

  return (
    <div className="card border-[1px] border-base-200 p-4 rounded-none bg-white">
      <div className="flex flex-row">
        <div className="flex flex-col w-10/12 border-r-[1px] border-base-200 pr-4">
          <div className="text-gray-500 text-sm">
            Język {classes.language.name}
          </div>
          <h1 className="text-xl font-semibold uppercase border-b-[1px] pb-1 mb-1 border-base-200">
            {classes.name}
          </h1>
          <div className="flex flex-row align-middle items-center border-b-[1px] border-base-200 pb-1 mb-1">
            <div className="avatar">
              <div className="w-20 rounded-full">
                <img
                  src={
                    classes?.teacher?.profile_image == null
                      ? guest
                      : `http://localhost:8000${classes?.teacher?.profile_image}`
                  }
                />
              </div>
            </div>
            <h2 className="text-lg ">
              {classes.teacher?.user?.first_name}{" "}
              {classes.teacher?.user?.last_name}
            </h2>
          </div>
          <div className="description text-justify text-sm">
            {classes.description.length > 250
              ? classes.description.substring(0, 250) + "..."
              : classes.description}
          </div>
          <div className="flex items-center mt-2 border-t-[1px] pt-2 border-base-200">
            <div className="flex flex-row text-sm text-gray-400">
              <MdOutlineLocationOn
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
        <div className="flex flex-col w-2/12 pl-4">sad</div>
      </div>
    </div>
  );
};

export default ClassesCard;
