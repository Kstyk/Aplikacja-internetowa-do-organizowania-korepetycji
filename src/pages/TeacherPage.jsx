import React, { useState, useEffect } from 'react'
import useAxios from '../utils/useAxios'
import { useParams, useNavigate } from 'react-router-dom'
import LoadingComponent from '../components/GeneralComponents/LoadingComponent'
import guest from '../assets/guest.png'
import { AiOutlinePhone, AiOutlineMail } from 'react-icons/ai'
import { MdOutlineLocationOn } from 'react-icons/md'
import parse from 'html-react-parser'
import { Link } from 'react-router-dom'
import OpinionCard from '../components/ClassesComponents/OpinionCard'
import showAlertError from '../components/AlertsComponents/SwalAlertError'
import SendPrivateMessage from '../components/PrivateMessagesComponents/SendPrivateMessage'

const TeacherPage = () => {
  document.title = 'Profil nauczyciela'

  const { teacherId } = useParams()
  const api = useAxios()
  const nav = useNavigate()

  const [profile, setProfile] = useState(null)
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)

  const [opinions, setOpinions] = useState([])
  const [hasMoreOpinions, setHasMoreOpinions] = useState(false)
  const [opinionPage, setOpinionPage] = useState(1)
  const [averageRating, setAverageRating] = useState(null)
  const [amountOfOpinions, setAmountOfOpinions] = useState(0)
  const [isOpened, setIsOpened] = useState(false)

  const fetchProfile = async () => {
    await api
      .get(`/api/users/profile/${teacherId}`)
      .then((res) => {
        if (res.data.user.role.label != 'Teacher') {
          nav(-1)
          return
        } else {
          setProfile(res.data)
        }
      })
      .catch((err) => {
        showAlertError(
          'Błąd',
          'Wystąpił błąd przy pobieraniu danych z serwera.'
        )
        nav('/')
      })
  }

  const fetchClassesTeacher = async () => {
    let baseurl = `/api/classes/?page_size=10&page=1&teacher=${teacherId}`

    await api
      .get(baseurl)
      .then((res) => {
        setClasses(res.data.classes)
      })
      .catch((err) => {
        showAlertError(
          'Błąd',
          'Wystąpił błąd przy pobieraniu danych z serwera.',
          () => nav('/')
        )
      })
  }

  const fetchOpinions = async () => {
    await api
      .get(`/api/classes/${profile?.user?.id}/opinions?page_size=10`)
      .then((res) => {
        setLoading(false)
        setOpinions(res.data.results)
        setHasMoreOpinions(res.data.next !== null)
        setOpinionPage(opinionPage + 1)
        setAverageRating(res.data.average_rating)
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
      .get(
        `/api/classes/${profile?.user?.id}/opinions?page=${opinionPage}&page_size=10`
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

  const fetchAll = async () => {
    setLoading(true)
    await fetchProfile()
    await fetchClassesTeacher()
  }

  useEffect(() => {
    if (profile != null) {
      fetchOpinions()
    }
  }, [profile])

  useEffect(() => {
    fetchAll()
  }, [])

  return (
    <>
      <section className="mb-10 mt-10 w-full">
        <div className="absolute left-0 right-0 top-[70px] h-[500px] bg-base-300 max-phone:hidden"></div>
        <div className="card z-30 mb-5 flex flex-row items-center justify-between rounded-md border-[1px] border-base-200 bg-white p-4 text-center shadow-xl">
          {loading ? (
            <LoadingComponent message="Ładowanie informacji o nauczycielu..." />
          ) : (
            <h1 className="w-full break-words px-2 text-center text-xl font-bold uppercase tracking-wider text-gray-700 max-md:text-xl max-phone:text-lg md:text-2xl">
              {profile?.user?.first_name} {profile?.user?.last_name}
            </h1>
          )}
        </div>
        {loading ? (
          ''
        ) : (
          <div className="flex max-md:flex-col md:flex-row md:gap-x-2 ">
            <div className="card flex rounded-md border-[1px] border-base-200 bg-white py-4 shadow-xl max-md:w-full max-phone:flex-col phone:flex-row md:w-full ">
              <div className="profile ml-3 flex w-4/12 flex-col items-center justify-start border-r-[1px] border-base-300 max-phone:order-1 max-phone:w-full max-phone:pr-6 phone:pr-3 sm:w-3/12">
                <div className="avatar">
                  <div className="w-20 rounded-full ring-primary ring-offset-2 ring-offset-base-100 transition-all duration-200 hover:ring">
                    <img
                      src={
                        profile?.profile_image == null
                          ? guest
                          : `${profile?.profile_image}`
                      }
                    />
                  </div>
                </div>
                <button
                  className="btn-outline no-animation btn mt-2 h-10 !min-h-0 w-full rounded-sm border-base-400 py-0 hover:bg-base-400"
                  onClick={() => setIsOpened(!isOpened)}
                >
                  Wyślij wiadomość
                </button>
                <SendPrivateMessage
                  toUser={profile}
                  opened={isOpened}
                  setIsOpened={setIsOpened}
                />
                <section className="infos flex w-full flex-col pt-4">
                  <div className="mb-4 border-b-[1px] border-base-100"></div>
                  <ul className="w-full">
                    {profile?.phone_number && (
                      <li className="flex flex-row items-center gap-x-5">
                        <AiOutlinePhone className="h-6 w-6 text-base-400" />
                        <span className="text-sm">{profile?.phone_number}</span>
                      </li>
                    )}
                    <li className="flex flex-row flex-wrap items-center gap-x-5">
                      <AiOutlineMail className="h-6 w-6 text-base-400" />
                      <span className="text-sm">{profile?.user?.email}</span>
                    </li>
                  </ul>
                  {profile?.place_of_classes && (
                    <>
                      <div className="my-4 border-b-[1px] border-base-100"></div>
                      <h3 className="mb-1 text-sm">
                        Sposób prowadzenia zajęć:
                      </h3>
                      <ul className="w-full">
                        {profile?.place_of_classes.map((place, i) => (
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
                  <div className="my-4 border-b-[1px] border-base-100"></div>
                  {profile?.cities_of_work && (
                    <>
                      <h3 className="mb-1 text-sm">
                        Miasta prowadzenia zajęć:
                      </h3>
                      <ul className="w-full">
                        {profile?.cities_of_work.map((city, i) => (
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
                  <div className="my-4 border-b-[1px] border-base-100"></div>

                  <div className="my-4 border-b-[1px] border-base-100 phone:hidden"></div>
                </section>
              </div>
              <div className="content w-8/12 px-4 max-phone:order-2 max-phone:mb-3 max-phone:w-full max-phone:pb-3 sm:w-9/12">
                <div className="header flex flex-col">
                  <div className="flex w-full flex-row items-center justify-between">
                    <h1 className="text-3xl uppercase">
                      {profile?.user.first_name} {profile?.user.last_name}
                    </h1>
                  </div>
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
                </div>
                <div className="my-2 border-b-2 border-base-100"></div>
                <section className="flex flex-col gap-y-5">
                  <article className="describe !break-words">
                    <h2 className="mb-2 block border-b-[1px] border-base-100 text-lg font-bold uppercase tracking-wide text-gray-700">
                      O mnie
                    </h2>
                    {profile?.description == '' ||
                    profile?.description == null ? (
                      <p className="pl-2">Brak opisu.</p>
                    ) : (
                      <div className="pl-2">
                        {parse('' + profile?.description + '')}
                      </div>
                    )}
                  </article>
                  <article className="experience">
                    <h2 className="mb-2 block border-b-[1px] border-base-100 text-lg font-bold uppercase tracking-wide text-gray-700">
                      Doświadczenie
                    </h2>
                    {profile?.experience == '' ||
                    profile?.experience == null ? (
                      <p className="pl-2">Brak określonego doświadczenia.</p>
                    ) : (
                      <div className="pl-2">
                        {parse('' + profile?.experience + '')}
                      </div>
                    )}
                  </article>
                  <article className="known-languages">
                    <h2 className="mb-2 block border-b-[1px] border-base-100 text-lg font-bold uppercase tracking-wide text-gray-700">
                      Znane języki
                    </h2>
                    {profile?.known_languages.length == 0 && (
                      <p className="pl-2">Brak określonych języków</p>
                    )}
                    <ul className="pl-2">
                      {profile?.known_languages.map((language, i) => (
                        <li
                          className="mb-2 border-b-[1px] border-base-300 p-2 transition-all duration-150  ease-linear hover:bg-base-100"
                          key={i}
                        >
                          <Link
                            to={`/search-classes/language/${language?.slug}`}
                            params={{ languageSlug: language?.slug }}
                          >
                            {language?.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </article>
                  <article className="classes">
                    <h2 className="mb-2 block border-b-[1px] border-base-100 text-lg font-bold uppercase tracking-wide text-gray-700">
                      Prowadzone zajęcia
                    </h2>
                    {profile?.classes?.length == 0 && (
                      <p className="pl-2">Brak zajęć</p>
                    )}
                    <ul className="pl-2">
                      {classes?.map((classTeacher, i) => (
                        <li
                          className="mb-2 flex flex-row items-center gap-x-2 border-b-[1px]  border-base-300 p-2 transition-all duration-150 ease-linear hover:bg-base-100"
                          key={i}
                        >
                          <Link
                            to={`/zajecia/${classTeacher?.id}`}
                            className="w-6/12"
                            params={{
                              classesId: classTeacher?.id,
                            }}
                          >
                            {classTeacher?.name}
                          </Link>
                          <span className="w-3/12">
                            {classTeacher?.price_for_lesson} zł /{' '}
                            <span className="text-gray-400">60 min</span>
                          </span>
                          <Link
                            to={`/zajecia/${classTeacher?.id}`}
                            params={{
                              classesId: classTeacher?.id,
                            }}
                            className="btn-outline no-animation btn mt-2 h-10 !min-h-0 w-3/12 rounded-sm border-base-400 py-0 hover:bg-base-400"
                          >
                            Zobacz
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </article>
                </section>
              </div>
            </div>
          </div>
        )}

        {opinions?.length > 0 && (
          <div className="card mt-2 flex flex-col rounded-md border-[1px] border-base-200 bg-white p-5 shadow-xl max-md:w-full md:w-full">
            <h1 className="mb-2 block w-full border-b-[1px] border-base-100 text-xl font-bold uppercase tracking-wide text-gray-700">
              Opinie o nauczycielu
            </h1>

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
          </div>
        )}
      </section>
    </>
  )
}

export default TeacherPage
