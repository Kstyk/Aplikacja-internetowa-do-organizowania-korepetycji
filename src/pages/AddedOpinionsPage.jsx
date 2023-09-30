import React from 'react'
import { useEffect } from 'react'
import useAxios from '../utils/useAxios'
import { useState } from 'react'
import showAlertError from '../components/messages/SwalAlertError'
import OpinionStudentViewCard from '../components/ClassesComponents/OpinionStudentViewCard'

const AddedOpinionsPage = () => {
  const api = useAxios()
  const [loading, setLoading] = useState(true)
  const [opinions, setOpinions] = useState([])
  const [hasMoreOpinions, setHasMoreOpinions] = useState(false)
  const [opinionPage, setOpinionPage] = useState(1)
  const [amountOfOpinions, setAmountOfOpinions] = useState(0)

  const fetchOpinions = async () => {
    await api
      .get(`/api/classes/added-opinions?page_size=10&page=1`)
      .then((res) => {
        setLoading(false)
        setOpinions(res.data.results)
        setHasMoreOpinions(res.data.next !== null)
        setOpinionPage(opinionPage + 1)
        setAmountOfOpinions(res.data.count)
      })
      .catch((err) => {
        showAlertError(
          'Błąd',
          'Wystąpił błąd przy pobieraniu danych z serwera.'
        )
        setLoading(false)
      })
  }

  const loadMoreOpinions = async () => {
    await api
      .get(`/api/classes/added-opinions?page=${opinionPage}&page_size=10`)
      .then((res) => {
        setLoading(false)
        setOpinions((prev) => prev.concat(res.data.results))
        setHasMoreOpinions(res.data.next !== null)
        setOpinionPage(opinionPage + 1)
      })
      .catch((err) => {
        showAlertError(
          'Błąd',
          'Wystąpił błąd przy pobieraniu danych z serwera.'
        )
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchOpinions()
  }, [])

  return (
    <>
      <div>
        <div className="absolute left-0 right-0 top-[70px] h-[500px] bg-base-300 max-phone:hidden"></div>

        <div className="card mx-auto mb-10 mt-10 h-full rounded-md bg-white px-5 py-5 shadow-xl max-lg:w-full">
          <h1 className="text-center text-xl font-bold uppercase tracking-wider text-gray-700">
            Otrzymane opinie
          </h1>
          <div className="my-4 border-b-[1px] border-base-100"></div>
          <div>
            {amountOfOpinions != 0 ? (
              <>
                <h2 className="text-center text-xl">
                  Wystawiłeś {amountOfOpinions}{' '}
                  {amountOfOpinions == 1 && 'opinię'}{' '}
                  {amountOfOpinions == 2 && 'opinie'}
                  {amountOfOpinions == 3 && 'opinie'}
                  {amountOfOpinions == 4 && 'opinie'}
                  {amountOfOpinions > 4 && 'opinii'}
                </h2>
              </>
            ) : (
              <h2 className="text-center text-xl">
                Nie wystawiłeś jeszcze żadnej opinii.
              </h2>
            )}
          </div>
          <div className="my-4 border-b-[1px] border-base-100"></div>

          {opinions?.length > 0 && (
            <>
              {opinions?.map((opinion) => (
                <OpinionStudentViewCard
                  opinion={opinion}
                  key={opinion.id}
                  page={opinionPage}
                />
              ))}
              {hasMoreOpinions && (
                <div className="px-5 max-phone:px-0">
                  <button
                    className={`btn-outline no-animation btn mt-2 h-10 !min-h-0 w-full rounded-none border-base-400 py-0 hover:bg-base-400 md:w-4/12`}
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
  )
}

export default AddedOpinionsPage
