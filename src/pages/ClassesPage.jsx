import React, { useEffect } from 'react'
import useAxios from '../utils/useAxios'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import LoadingComponent from '../components/LoadingComponent'
import guest from '../assets/guest.png'
import { AiOutlinePhone, AiOutlineMail } from 'react-icons/ai'
import { MdOutlineLocationOn } from 'react-icons/md'
import parse from 'html-react-parser'
import showAlertError from '../components/messages/SwalAlertError'
import OpinionCard from '../components/ClassesComponents/OpinionCard'
import InfiniteScroll from 'react-infinite-scroll-component'

const ClassesPage = () => {
  document.title = 'Podgląd zajęć'
  const api = useAxios()

  const [classes, setClasses] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadingOpinions, setLoadingOpinions] = useState(true)

  const [opinions, setOpinions] = useState([])
  const [hasMoreOpinions, setHasMoreOpinions] = useState(false)
  const [opinionPage, setOpinionPage] = useState(1)
  const [averageRating, setAverageRating] = useState(null)
  const [amountOfOpinions, setAmountOfOpinions] = useState(0)

  const { classesId } = useParams()

  const fetchClasses = async () => {
    setLoading(true)
    await api
      .get(`/api/classes/${classesId}`)
      .then((res) => {
        setClasses(res.data)
        setLoading(false)
      })
      .catch((err) => {
        showAlertError(
          'Błąd',
          'Wystąpił błąd przy pobieraniu danych z serwera.'
        )
        setLoading(false)
      })
  }

  const fetchOpinions = async () => {
    setLoadingOpinions(true)
    await api
      .get(`/api/classes/${classes?.teacher?.user?.id}/opinions?page_size=10`)
      .then((res) => {
        setOpinions(res.data.results)
        setHasMoreOpinions(res.data.next !== null)
        setOpinionPage(opinionPage + 1)
        setAverageRating(res.data.average_rating)
        setAmountOfOpinions(res.data.count)
        setLoadingOpinions(false)
      })
      .catch((err) => {
        showAlertError(
          'Błąd',
          'Wystąpił błąd przy pobieraniu danych z serwera.'
        )
        setLoadingOpinions(false)
      })
  }

  const loadMoreOpinions = async () => {
    await api
      .get(
        `/api/classes/${classes?.teacher?.user?.id}/opinions?page=${opinionPage}&page_size=10`
      )
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
    fetchClasses()
  }, [])

  useEffect(() => {
    if (classes != null) {
      fetchOpinions()
    }
  }, [classes])

  return (
    <>
      <section className="mb-10 mt-10 w-full max-md:px-3 max-sm:px-0">
        <div className="absolute left-0 right-0 top-[70px] h-[500px] bg-base-300 max-phone:hidden"></div>

        <div className="card z-30 mb-5 flex flex-col items-center justify-between rounded-md border-[1px] border-base-200 bg-white p-4 text-center shadow-xl  phone:flex-row ">
          {loading ? (
            <LoadingComponent message="Ładowanie informacji o zajęciach..." />
          ) : (
            <>
              <h1 className="w-full text-center text-xl font-bold uppercase tracking-wider text-gray-700 max-md:text-xl max-phone:text-lg md:text-2xl">
                {classes?.name}
              </h1>
              <Link
                className={`btn-outline no-animation btn mt-2 h-10 !min-h-0 w-full rounded-sm border-base-400 py-0 hover:bg-base-400 phone:w-4/12 ${
                  classes?.able_to_buy ? '' : 'btn-disabled'
                }`}
                to={`/zajecia/${classes?.id}/kup`}
              >
                Zakup zajęcia
              </Link>
            </>
          )}
        </div>
        {loading ? (
          ''
        ) : (
          <div className="flex max-md:flex-col md:min-h-[50vh] md:flex-row md:gap-x-2">
            <div className="card  flex rounded-md border-[1px] border-base-200 bg-white py-4 shadow-xl max-md:w-full max-phone:flex-col phone:flex-row md:w-9/12">
              <div className="profile ml-3 flex w-4/12 flex-col items-center justify-start border-r-[1px] border-base-300 max-phone:order-2 max-phone:w-full max-phone:pr-6 phone:pr-3">
                <div className="avatar">
                  <div className="w-20 rounded-full ring-primary ring-offset-2 ring-offset-base-100 transition-all duration-200 hover:ring">
                    <img
                      src={
                        classes?.teacher?.profile_image == null
                          ? guest
                          : `${classes?.teacher?.profile_image}`
                      }
                    />
                  </div>
                </div>
                <button
                  className="btn-outline no-animation btn mt-2 h-10 !min-h-0 w-full rounded-sm border-base-400 py-0 hover:bg-base-400"
                  onClickCapture={() =>
                    window.open(
                      'mailto:email@example.com?subject=Subject&body=Body%20goes%20here'
                    )
                  }
                >
                  Wyślij wiadomość
                </button>

                <section className="infos flex w-full flex-col pt-4">
                  <div className="mb-4 border-b-[1px] border-base-100"></div>
                  <ul className="w-full">
                    {classes?.teacher?.phone_number && (
                      <li className="flex flex-row items-center gap-x-5">
                        <AiOutlinePhone className="h-6 w-6 text-base-400" />
                        <span className="text-sm">
                          {classes?.teacher?.phone_number}
                        </span>
                      </li>
                    )}
                    <li className="flex flex-row flex-wrap items-center gap-x-5">
                      <AiOutlineMail className="h-6 w-6 text-base-400" />
                      <span className="text-sm">
                        {classes?.teacher?.user?.email}
                      </span>
                    </li>
                  </ul>
                  {classes?.place_of_classes?.length > 0 && (
                    <>
                      <div className="my-4 border-b-[1px] border-base-100"></div>
                      <h3 className="mb-1 text-sm">
                        Sposób prowadzenia zajęć:
                      </h3>
                      <ul className="w-full">
                        {classes?.place_of_classes.map((place, i) => (
                          <li
                            key={i}
                            className="flex flex-row items-center gap-x-5"
                          >
                            <MdOutlineLocationOn className="h-6 w-6 text-base-400" />
                            <span className="text-sm">
                              {place == 'stationary' && 'Stacjonarnie'}
                              {place == 'online' && 'Online'}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  {classes?.cities_of_classes?.length > 0 && (
                    <>
                      <div className="my-4 border-b-[1px] border-base-100"></div>
                      <h3 className="mb-1 text-sm">
                        Miasta prowadzenia zajęć:
                      </h3>
                      <ul className="w-full">
                        {classes?.cities_of_classes.map((city, i) => (
                          <li
                            key={i}
                            className="flex flex-row items-center gap-x-5"
                          >
                            <MdOutlineLocationOn className="h-6 w-6 text-base-400" />
                            <span className="text-sm">{city.name}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  <div className="my-4 border-b-[1px] border-base-100 phone:hidden"></div>
                </section>
              </div>
              <div className="content w-9/12 px-4 max-phone:order-1 max-phone:mb-3 max-phone:w-full max-phone:border-b-[1px] max-phone:border-base-200 max-phone:pb-3">
                <div className="header flex flex-row">
                  <div className="left w-8/12">
                    <Link
                      to={`/szukaj-zajec/jezyk/${classes?.language.slug}`}
                      params={{
                        languageSlug: classes?.language.slug,
                      }}
                      className="upper text-gray-400 hover:underline"
                    >
                      Język {classes?.language.name}
                    </Link>
                    <h1 className="text-3xl uppercase">
                      <Link
                        to={`/nauczyciel/${classes?.teacher?.user?.id}`}
                        params={{
                          teacherId: classes?.teacher?.user?.id,
                        }}
                      >
                        {classes?.teacher?.user.first_name}{' '}
                        {classes?.teacher?.user.last_name}
                      </Link>
                    </h1>
                  </div>
                  <div className="right flex  w-4/12 items-center justify-end">
                    <span>
                      <span className="font-bold">
                        {classes?.price_for_lesson} PLN
                      </span>
                      <br /> za godzinę
                    </span>
                  </div>
                </div>{' '}
                <div className="my-2 border-b-[1px] border-base-100"></div>
                <div className="flex flex-row items-center gap-x-3 text-gray-700">
                  {averageRating != null ? (
                    <>
                      <div className="rating rating-sm phone:rating-md">
                        {Array.from({ length: 5 }, (_, index) => (
                          <input
                            key={index}
                            type="radio"
                            name={`average__rate`}
                            className="mask mask-star-2 bg-base-400"
                            checked={
                              Math.floor(averageRating) == index + 1
                                ? true
                                : false
                            }
                            readOnly
                          />
                        ))}
                      </div>
                      <span className="phone:text-xl sm:text-2xl">
                        {averageRating}/5
                      </span>
                      <span className="flex flex-row items-center">
                        ({amountOfOpinions} opinii)
                      </span>
                    </>
                  ) : (
                    <span className="text-sm">Brak wystawionych opinii</span>
                  )}
                </div>
                <div className="my-2 border-b-[1px] border-base-100"></div>
                <article className="describe">
                  {parse('' + classes?.description + '')}
                </article>
              </div>
            </div>
            <div className="card gap-y-5 rounded-md border-[1px] border-base-200 bg-white p-4 shadow-xl max-md:w-full md:w-3/12">
              <div>
                <h2 className="mb-2 block border-b-[1px] border-base-100 text-base font-bold uppercase tracking-wide text-gray-700">
                  O nuaczycielu
                </h2>
                <div className="pt-2 text-sm">
                  {classes?.teacher?.description
                    ? parse('' + classes?.teacher?.description + '')
                    : 'Brak opisu nauczyciela.'}
                </div>
              </div>
              <div>
                <h2 className="mb-2 block border-b-[1px] border-base-100 text-base font-bold uppercase tracking-wide text-gray-700">
                  Doświadczenie nauczyciela
                </h2>
                <div className="pt-2 text-sm">
                  {classes?.teacher?.experience
                    ? parse('' + classes?.teacher?.experience + '')
                    : 'Brak podanego doświadczenia nauczyciela.'}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="card mt-2 flex flex-col rounded-md border-[1px] border-base-200 bg-white p-5 shadow-xl max-md:w-full md:w-full">
          <h1 className="mb-2 block w-full border-b-[1px] border-base-100 text-xl font-bold uppercase tracking-wide text-gray-700">
            Opinie o nauczycielu
          </h1>
          {loadingOpinions ? (
            <LoadingComponent message="Ładowanie opinii..." />
          ) : opinions?.length > 0 ? (
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
                    className={`btn-outline no-animation btn mt-2 h-10 !min-h-0 w-full rounded-none border-base-400 py-0 hover:bg-base-400 md:w-4/12`}
                    onClick={() => loadMoreOpinions()}
                  >
                    Załaduj więcej...
                  </button>
                </div>
              )}
            </>
          ) : (
            <span className="text-right">Brak opinii</span>
          )}
        </div>
      </section>
    </>
  )
}

export default ClassesPage
