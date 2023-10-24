import React, { useState, useEffect } from 'react'
import LoadingComponent from '../components/LoadingComponent'
import useAxios from '../utils/useAxios'
import showAlertError from '../components/messages/SwalAlertError'
import ReceivedQuestionCard from '../components/ClassesQuestionsComponents/ReceivedQuestionCard'

const ReceivedQuestionsAboutClassesPage = () => {
  document.title = 'Otrzymane zapytania'

  const api = useAxios()
  const [loading, setLoading] = useState(true)
  const [questions, setQuestions] = useState([])

  const fetchQuestions = async () => {
    setLoading(true)
    await api
      .get(`/api/classes/received-questions/`)
      .then((res) => {
        setQuestions(res.data)
      })
      .catch((err) =>
        showAlertError(
          'Błąd',
          'Wystąpił błąd przy pobieraniu danych z serwera.'
        )
      )
    setLoading(false)
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
              <div className="flex w-full flex-col gap-y-8 pb-5">
                {questions?.length > 0
                  ? questions?.map((q) => (
                      <ReceivedQuestionCard
                        key={q?.id}
                        question={q}
                        fetchQuestions={fetchQuestions}
                      />
                    ))
                  : 'Brak otrzymanych zapytań.'}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

export default ReceivedQuestionsAboutClassesPage
