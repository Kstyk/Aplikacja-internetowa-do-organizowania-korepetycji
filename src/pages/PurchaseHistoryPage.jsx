import React, { useState, useEffect, useContext } from 'react'
import useAxios from '../utils/useAxios'
import LoadingComponent from '../components/LoadingComponent'
import Pagination from '../components/Pagination'
import PurchaseHistoryTable from '../components/PurchaseHistorysComponents/PurchaseHistoryTable'

const PurchaseHistoryPage = () => {
  document.title = 'Historia zakupu zajęć'

  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(0)
  const [totalResults, setTotalResults] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [purchases, setPurchases] = useState([])
  const api = useAxios()

  const fetchHistory = async () => {
    setLoading(true)
    await api
      .get(`api/classes/purchase-classes/history/?page_size=10`)
      .then((res) => {
        if (res.data.results == null) {
          setPurchases(null)
          setTotalPages(0)
          setTotalResults(0)
          setCurrentPage(1)
        } else {
          setPurchases(res.data.results)
          setTotalPages(res.data.num_pages)
          setTotalResults(res.data.count)
          setCurrentPage(res.data.current_page)
        }
      })
      .catch((err) => {
        showAlertError(
          'Błąd',
          'Wystąpił błąd przy pobieraniu danych z serwera.'
        )
      })
    setLoading(false)
  }

  const searchPurchases = async (page) => {
    setLoading(true)
    let baseurl = `api/classes/purchase-classes/history/?page_size=10&page=${page}`

    await api
      .get(baseurl)
      .then((res) => {
        if (res.data.results == null) {
          setPurchases(null)
          setTotalPages(0)
          setTotalResults(0)
          setCurrentPage(1)
        } else {
          setPurchases(res.data.results)
          setTotalPages(res.data.num_pages)
          setTotalResults(res.data.count)
          setCurrentPage(res.data.current_page)
        }
      })
      .catch((err) => {
        showAlertError(
          'Błąd',
          'Wystąpił błąd przy pobieraniu danych z serwera.'
        )
      })

    setLoading(false)
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  return (
    <div className="flex flex-col pb-5">
      <div className="absolute left-0 right-0 top-[70px] h-[300px] bg-base-300 max-phone:hidden"></div>

      <>
        <div className="card z-30 mt-10 flex flex-row items-center justify-between rounded-md border-[1px] border-base-200 bg-white p-4 text-center shadow-xl max-md:text-xl  max-phone:text-lg md:text-2xl">
          <h1 className="w-full text-center text-xl font-bold uppercase tracking-wider text-gray-700">
            Historia zakupów
          </h1>
        </div>
        <div className="my-4 border-b-[1px] border-base-100"></div>

        <div className="card rounded-md bg-white p-6 shadow-xl">
          {loading ? (
            <LoadingComponent message="Ładowanie informacji o plikach..." />
          ) : (
            <>
              <PurchaseHistoryTable purchases={purchases} />
              {totalPages > 1 && (
                <Pagination
                  totalResults={totalResults}
                  totalPages={totalPages}
                  currentPage={currentPage}
                  search={searchPurchases}
                />
              )}
            </>
          )}
        </div>
      </>
    </div>
  )
}

export default PurchaseHistoryPage
