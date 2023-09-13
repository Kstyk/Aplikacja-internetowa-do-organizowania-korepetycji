import React, { useContext } from "react";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

const PurchaseHistoryTable = (props) => {
  const { purchases } = props;
  const { user } = useContext(AuthContext);
  return (
    <div className="container mx-auto text-gray-100 mb-10">
      <div className="flex flex-col  text-xs">
        <div className="flex items-center justify-center text-left bg-transparent text-gray-700 border-b border-opacity-60 border-gray-700">
          <div
            className="flex-1 px-2 py-3 sm:p-3 cursor-pointer hover:font-bold transition-all duration-300"
            title="Sortuj po nazwie pliku"
          >
            Zajęcia
          </div>
          <div className="hidden w-24 px-2 py-3 sm:p-3 sm:block cursor-pointer hover:font-bold transition-all duration-300 text-center">
            Pokój
          </div>
          <div className="w-20 sm:w-24 px-2 py-3 sm:p-3 block cursor-pointer hover:font-bold transition-all duration-300 text-center">
            Liczba zajęć
          </div>
          <div className="w-20 sm:w-24 px-2 py-3 text-center sm:p-3 block cursor-pointer hover:font-bold transition-all duration-300">
            Zapłacona kwota
          </div>
          <div className="hidden w-24 px-2 py-3 text-right sm:p-3 sm:block cursor-pointer hover:font-bold transition-all duration-300">
            Data zakupu
          </div>
        </div>
        {purchases.length == 0 && (
          <span className="text-black italic text-center mt-3">
            Brak plików.
          </span>
        )}
        {purchases?.map((purchase) => (
          <div
            key={purchase.id}
            className="flex border-b border-opacity-20 border-gray-700 bg-transparent text-black hover:bg-slate-100 transition-all duration-200"
          >
            <div className="flex flex-1 items-center px-2 py-3 sm:p-3 sm:w-auto cursor-pointer sm:truncate">
              <Link
                className="hover:underline transition-all duration-200 sm:truncate"
                to={`/classes/${purchase?.classes?.id}`}
                title={purchase?.classes?.name}
              >
                {purchase?.classes?.name}
              </Link>
            </div>
            <div className="hidden w-24 px-2 py-3 sm:p-3 sm:flex justify-center items-center text-center">
              {purchase?.room != null ? (
                purchase?.room?.users.some((u) => {
                  if (u?.user?.id == user?.user_id) {
                    return true;
                  }
                }) ? (
                  <Link
                    className="underline"
                    to={`/pokoj/${purchase?.room?.room_id}`}
                  >
                    Link
                  </Link>
                ) : (
                  "Brak pokoju."
                )
              ) : (
                "Brak pokoju."
              )}
            </div>
            <div className="w-20 sm:w-24 px-2 py-3 sm:p-3 flex justify-center items-center text-center">
              {purchase?.amount_of_lessons}
            </div>
            <div className="w-20 sm:w-24 px-2 py-3 sm:p-3 flex justify-center items-center text-center">
              {purchase?.paid_price} zł
            </div>
            <div className="hidden w-24 px-2 py-3 text-right sm:p-3 sm:flex justify-center items-center text-gray-400">
              <p>
                {" "}
                {dayjs(purchase?.purchase_date).format("YYYY-MM-DD, HH:mm")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PurchaseHistoryTable;
