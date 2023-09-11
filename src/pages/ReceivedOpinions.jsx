import React from "react";
import { useEffect } from "react";
import useAxios from "../utils/useAxios";
import { useState } from "react";
import OpinionCard from "../components/ClassesComponents/OpinionCard";
import showAlertError from "../components/messages/SwalAlertError";

const ReceivedOpinions = () => {
  const api = useAxios();
  const [loading, setLoading] = useState(true);
  const [opinions, setOpinions] = useState([]);
  const [hasMoreOpinions, setHasMoreOpinions] = useState(false);
  const [opinionPage, setOpinionPage] = useState(1);
  const [averageRating, setAverageRating] = useState(null);
  const [amountOfOpinions, setAmountOfOpinions] = useState(0);

  const fetchOpinions = async () => {
    await api
      .get(`/api/classes/my-opinions?page_size=10&page=1`)
      .then((res) => {
        setLoading(false);
        setOpinions(res.data.results);
        setHasMoreOpinions(res.data.next !== null);
        setOpinionPage(opinionPage + 1);
        setAverageRating(res.data.average_rating);
        setAmountOfOpinions(res.data.count);
      })
      .catch((err) => {
        showAlertError(
          "Błąd",
          "Wystąpił błąd przy pobieraniu danych z serwera."
        );
        setLoading(false);
      });
  };

  const loadMoreOpinions = async () => {
    await api
      .get(`/api/classes/my-opinions?page=${opinionPage}&page_size=10`)
      .then((res) => {
        setLoading(false);
        setOpinions((prev) => prev.concat(res.data.results));
        setHasMoreOpinions(res.data.next !== null);
        setOpinionPage(opinionPage + 1);
      })
      .catch((err) => {
        showAlertError(
          "Błąd",
          "Wystąpił błąd przy pobieraniu danych z serwera."
        );
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOpinions();
  }, []);

  return (
    <>
      <div>
        <div className="absolute top-[70px] left-0 right-0 h-[500px] bg-base-300 "></div>

        <div className="bg-white card shadow-xl h-full px-5 py-5 mt-10 rounded-none mb-10 mx-auto w-8/12 max-lg:w-full max-md:w-8/12 max-phone:w-full">
          <h1 className="text-2xl text-center">Otrzymane opinie</h1>
          <div className="border-b-[1px] border-base-100 my-4"></div>
          <div>
            <h2 className="text-center text-xl">
              Otrzymałeś {amountOfOpinions} {amountOfOpinions == 1 && "opinię"}{" "}
              {amountOfOpinions == 2 && "opinie"}
              {amountOfOpinions == 3 && "opinie"}
              {amountOfOpinions == 4 && "opinie"}
              {amountOfOpinions > 4 && "opinii"}
            </h2>
            <h3 className="text-center text-lg">
              Średnia ocena: {averageRating}
            </h3>
          </div>
          <div className="border-b-[1px] border-base-100 my-4"></div>

          {opinions?.length > 0 && (
            <>
              {opinions?.map((opinion) => (
                <OpinionCard
                  opinion={opinion}
                  key={opinion.id}
                  page={opinionPage}
                />
              ))}
              {hasMoreOpinions && (
                <div className="px-5 max-phone:px-0">
                  <button
                    className={`btn btn-outline no-animation h-10 py-0 !min-h-0 rounded-none mt-2 hover:bg-base-400 border-base-400 w-full md:w-4/12`}
                    onClick={() => loadMoreOpinions()}
                  >
                    Załaduj więcej...
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ReceivedOpinions;
