import React from "react";

const Pagination = (props) => {
  const { totalPages, totalResults, currentPage, search } = props;
  return (
    <>
      {totalResults > 0 && (
        <>
          <div
            data-theme="cupcake"
            className="join mt-5 flex flex-row justify-center w-full bg-inherit rounded-sm h-[40px] sm:h-[50px]"
          >
            <button
              className={`join-item btn text-xl min-h-0 h-full ${
                currentPage - 1 == 0
                  ? "text-white cursor-default hover:bg-base-200 hover:border-base-200"
                  : ""
              }`}
              onClick={() => {
                currentPage - 1 > 0 && search(1);
              }}
            >
              ⇤
            </button>
            <button
              className={`join-item btn min-h-0 h-full ${
                currentPage - 1 == 0
                  ? "text-white cursor-default hover:bg-base-200 hover:border-base-200"
                  : ""
              }`}
              onClick={() => {
                currentPage - 1 > 0 && search(currentPage - 1);
              }}
            >
              «
            </button>
            <button className="join-item btn min-h-0 h-full">
              Strona {currentPage} z {totalPages}
            </button>
            <button
              className={`join-item btn min-h-0 h-full ${
                currentPage == totalResults
                  ? "text-white cursor-default hover:bg-base-200 hover:border-base-200"
                  : ""
              }`}
              onClick={() => {
                currentPage != totalPages && search(currentPage + 1);
              }}
            >
              »
            </button>
            <button
              className={`join-item btn text-xl min-h-0 h-full ${
                currentPage == totalPages
                  ? "text-white cursor-default hover:bg-base-200 hover:border-base-200"
                  : ""
              }`}
              onClick={() => {
                currentPage != totalPages && search(totalPages);
              }}
            >
              ⇥
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default Pagination;
