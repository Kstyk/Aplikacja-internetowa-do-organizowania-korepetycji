import React, { useState, useEffect } from 'react'
import LoadingComponent from '../components/GeneralComponents/LoadingComponent'
import useAxios from '../utils/useAxios'
import showAlertError from '../components/AlertsComponents/SwalAlertError'
import ReceivedQuestionCard from '../components/ClassesQuestionsComponents/ReceivedQuestionCard'
import Pagination from '../components/GeneralComponents/Pagination'

const ReceivedQuestionsAboutClassesPage = () => {
  document.title = 'Otrzymane zapytania'

  const api = useAxios()
  const [loading, setLoading] = useState(true)
  const [loadingNextPage, setLoadingNextPage] = useState(false)
  const [questions, setQuestions] = useState([])

  const [totalPages, setTotalPages] = useState(0)
  const [totalResults, setTotalResults] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  const fetchQuestions = async () => {
    setLoading(true)
    await api
      .get(`/api/classes/received-questions/?page=1&page_size=10`)
      .then((res) => {
        if (res.data.results == null) {
          setQuestions(null)
          setTotalPages(0)
          setTotalResults(0)
          setCurrentPage(1)
        } else {
          setQuestions(res.data.results)
          setTotalPages(res.data.num_pages)
          setTotalResults(res.data.count)
          setCurrentPage(res.data.current_page)
        }
      })
      .catch((err) =>
        showAlertError(
          'Błąd',
          'Wystąpił błąd przy pobieraniu danych z serwera.'
        )
      )
    setLoading(false)
  }

  const fetchPageQuestions = async (page) => {
    setLoadingNextPage(true)
    await api
      .get(`/api/classes/received-questions/?page=${page}&page_size=10`)
      .then((res) => {
        if (res.data.results == null) {
          setQuestions(null)
          setTotalPages(0)
          setTotalResults(0)
          setCurrentPage(1)
        } else {
          setQuestions(res.data.results)
          setTotalPages(res.data.num_pages)
          setTotalResults(res.data.count)
          setCurrentPage(res.data.current_page)
        }
      })
      .catch((err) =>
        showAlertError(
          'Błąd',
          'Wystąpił błąd przy pobieraniu danych z serwera.'
        )
      )
    setLoadingNextPage(false)
  }

  useEffect(() => {
    fetchQuestions()
  }, [])

  return (
    <>
      <section className="mb-10 mt-10 w-full max-md:px-3 max-sm:px-0">
        <div className="absolute left-0 right-0 top-[70px] h-[500px] bg-base-300 max-phone:hidden"></div>

        <div className="card z-30 mx-auto mb-5 flex  w-full flex-col items-center justify-between rounded-md border-[1px] border-base-200 bg-white  p-4 text-center shadow-xl phone:flex-row">
          <div className="mx-auto w-full">
            <h1 className="w-full text-center text-xl font-bold uppercase tracking-wider text-gray-700">
              Otrzymane zapytania
            </h1>
            <div className="my-4 border-b-[1px] border-base-100"></div>
            {loading ? (
              <LoadingComponent message="Pobieranie zapytań..." />
            ) : (
              <div className="w-full">
                <div>
                  {loadingNextPage ? (
                    <LoadingComponent message="Ładowanie następnej strony..." />
                  ) : (
                    <div className="flex w-full flex-col gap-y-8 pb-5">
                      {questions?.length > 0
                        ? questions?.map((q) => (
                            <section key={q?.id}>
                              <ReceivedQuestionCard
                                question={q}
                                fetchQuestions={fetchQuestions}
                              />
                              <div className="my-5 border-b-[1px] border-base-200"></div>
                            </section>
                          ))
                        : 'Brak otrzymanych zapytań.'}
                    </div>
                  )}
                </div>
                <div>
                  {totalPages > 1 && (
                    <Pagination
                      totalResults={totalResults}
                      totalPages={totalPages}
                      currentPage={currentPage}
                      search={fetchPageQuestions}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

export default ReceivedQuestionsAboutClassesPage
