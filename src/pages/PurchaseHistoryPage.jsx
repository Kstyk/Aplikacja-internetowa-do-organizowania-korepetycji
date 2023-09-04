import React, { useState, useEffect, useContext } from "react";
import useAxios from "../utils/useAxios";
import LoadingComponent from "../components/LoadingComponent";
import Pagination from "../components/Pagination";
import PurchaseHistoryTable from "../components/StudentProfileComponents/PurchaseHistoryTable";

const PurchaseHistoryPage = () => {
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [purchases, setPurchases] = useState([]);
  const api = useAxios();

  const fetchHistory = async () => {
    setLoading(true);
    await api
      .get(`api/classes/purchase-classes/history/?page_size=10`)
      .then((res) => {
        console.log(res);
        if (res.data.results == null) {
          setPurchases(null);
          setTotalPages(0);
          setTotalResults(0);
          setCurrentPage(1);
        } else {
          setPurchases(res.data.results);
          setTotalPages(res.data.num_pages);
          setTotalResults(res.data.count);
          setCurrentPage(res.data.current_page);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    setLoading(false);
  };

  const searchPurchases = async (page) => {
    setLoading(true);
    let baseurl = `api/classes/purchase-classes/history/?page_size=10&page=${page}`;

    await api
      .get(baseurl)
      .then((res) => {
        console.log(res);
        if (res.data.results == null) {
          setPurchases(null);
          setTotalPages(0);
          setTotalResults(0);
          setCurrentPage(1);
        } else {
          setPurchases(res.data.results);
          setTotalPages(res.data.num_pages);
          setTotalResults(res.data.count);
          setCurrentPage(res.data.current_page);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    setLoading(false);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="flex flex-col">
      <div className="absolute top-[70px] left-0 right-0 h-[300px] bg-base-300 "></div>
      {loading ? (
        <LoadingComponent message="Ładowanie informacji o plikach..." />
      ) : (
        <>
          <div className="md:text-2xl max-md:text-xl max-phone:text-lg card bg-white rounded-none mb-5 text-center p-4 border-[1px] border-base-200 flex flex-row justify-between items-center z-30  mt-10 shadow-xl">
            <h1 className="text-center w-full">Historia zakuów</h1>
          </div>
          <div className="border-b-[1px] border-base-100 my-4"></div>

          <div className="card rounded-none bg-white p-6 shadow-xl">
            <PurchaseHistoryTable purchases={purchases} />
            {totalPages > 1 && (
              <Pagination
                totalResults={totalResults}
                totalPages={totalPages}
                currentPage={currentPage}
                search={searchPurchases}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PurchaseHistoryPage;
