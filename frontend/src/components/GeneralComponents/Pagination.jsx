import React from 'react'

const Pagination = (props) => {
  const { totalPages, totalResults, currentPage, search } = props
  return (
    <>
      {totalResults > 0 && (
        <>
          <div
            data-theme="cupcake"
            className="join mt-5 flex h-[40px] w-full flex-row justify-center rounded-sm bg-inherit sm:h-[50px]"
          >
            <button
              className={`join-item btn h-full min-h-0 text-xl ${
                currentPage - 1 == 0
                  ? 'cursor-default text-white hover:border-base-200 hover:bg-base-200'
                  : ''
              }`}
              onClick={() => {
                currentPage - 1 > 0 && search(1)
              }}
            >
              ⇤
            </button>
            <button
              className={`join-item btn h-full min-h-0 ${
                currentPage - 1 == 0
                  ? 'cursor-default text-white hover:border-base-200 hover:bg-base-200'
                  : ''
              }`}
              onClick={() => {
                currentPage - 1 > 0 && search(currentPage - 1)
              }}
            >
              «
            </button>
            <button className="join-item btn h-full min-h-0">
              Strona {currentPage} z {totalPages}
            </button>
            <button
              className={`join-item btn h-full min-h-0 ${
                currentPage == totalResults
                  ? 'cursor-default text-white hover:border-base-200 hover:bg-base-200'
                  : ''
              }`}
              onClick={() => {
                currentPage != totalPages && search(currentPage + 1)
              }}
            >
              »
            </button>
            <button
              className={`join-item btn h-full min-h-0 text-xl ${
                currentPage == totalPages
                  ? 'cursor-default text-white hover:border-base-200 hover:bg-base-200'
                  : ''
              }`}
              onClick={() => {
                currentPage != totalPages && search(totalPages)
              }}
            >
              ⇥
            </button>
          </div>
        </>
      )}
    </>
  )
}

export default Pagination
