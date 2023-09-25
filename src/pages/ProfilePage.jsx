import React, { useState, useEffect, useContext } from 'react'
import useAxios from '../utils/useAxios'
import { useParams } from 'react-router-dom'
import LoadingComponent from '../components/LoadingComponent'
import guest from '../assets/guest.png'
import { AiOutlinePhone, AiOutlineMail, AiOutlineHome } from 'react-icons/ai'
import { MdOutlineLocationOn } from 'react-icons/md'
import parse from 'html-react-parser'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

const ProfilePage = () => {
  const { user } = useContext(AuthContext)
  const api = useAxios()

  const [profile, setProfile] = useState(null)
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchProfile = async () => {
    await api
      .get(`/api/users/profile/${user?.user_id}`)
      .then((res) => {
        setProfile(res.data)
      })
      .catch((err) => {})
  }

  const fetchClassesTeacher = async () => {
    let baseurl = `/api/classes/?page_size=10&page=1&teacher=${user?.user_id}`

    await api
      .get(baseurl)
      .then((res) => {
        setClasses(res.data.classes)
      })
      .catch((err) => {})
  }

  const fetchAll = async () => {
    setLoading(true)
    await fetchClassesTeacher()
    await fetchProfile()
    setLoading(false)
  }

  useEffect(() => {
    fetchAll()
  }, [])

  return (
    <>
      {loading ? (
        <LoadingComponent message="Ładowanie informacji o nauczycielu..." />
      ) : (
        <section className="mb-10 mt-10 w-full shadow-xl">
          <div className="absolute left-0 right-0 top-[70px] h-[500px] bg-base-300 max-phone:hidden"></div>
          <div className="card z-30 mb-5 flex flex-row items-center justify-between rounded-md border-[1px] border-base-200 bg-white py-4 text-center shadow-xl max-md:text-xl max-phone:text-lg md:text-2xl">
            <h1 className="w-full text-center">
              {profile?.user?.first_name} {profile?.user?.last_name}
            </h1>
          </div>
          <div className="flex max-md:flex-col md:flex-row md:gap-x-2">
            <div className="card flex rounded-md border-[1px] border-base-200 bg-white py-5 max-md:w-full max-phone:flex-col phone:flex-row phone:pb-10 md:w-full ">
              <div className="profile ml-3 flex w-4/12 flex-col items-center justify-start border-r-[1px] border-base-300 max-phone:order-1 max-phone:w-full max-phone:pr-6 phone:pr-3 sm:w-3/12">
                <div className="avatar">
                  <div className="w-20 rounded-full">
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
                        {profile?.place_of_classes == null ||
                          (profile?.place_of_classes?.length == 0 && (
                            <span className="text-xs">Nie określono.</span>
                          ))}
                        {profile?.place_of_classes?.map((place, i) => (
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
                  {profile?.cities_of_work?.length > 0 && (
                    <>
                      <div className="my-4 border-b-[1px] border-base-100"></div>
                      <ul className="w-full">
                        {profile?.cities_of_work?.map((city, i) => (
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
                  {profile?.address != null && (
                    <>
                      <div className="my-4 border-b-[1px] border-base-100"></div>
                      {profile?.address != null && (
                        <div className="text-sm">
                          <h4 className="flex flex-row items-center gap-x-5">
                            <AiOutlineHome className="h-6 w-6 text-base-400" />
                            <span>Adres zamieszkania:</span>
                          </h4>
                          <div className="my-2 border-b-[1px] border-base-100"></div>

                          <section className="flex flex-col gap-y-2 pl-5">
                            {profile?.address != null ? (
                              <>
                                <div>
                                  {profile?.address?.postal_code},{' '}
                                  {profile?.address?.city?.name}
                                </div>
                                <div>
                                  ul. {profile?.address?.street},{' '}
                                  {profile?.address?.building_number}
                                </div>
                                <div>
                                  {
                                    profile?.address?.voivodeship
                                      ?.alternate_names
                                  }
                                </div>
                              </>
                            ) : (
                              ''
                            )}
                          </section>
                        </div>
                      )}
                    </>
                  )}
                  <div className="my-4 border-b-[1px] border-base-100 phone:hidden"></div>
                </section>
              </div>
              <div className="content w-8/12 px-4 max-phone:order-2 max-phone:mb-3 max-phone:w-full max-phone:pb-3 sm:w-9/12">
                <div className="header flex flex-row">
                  <div className="left w-8/12">
                    <h1 className="text-3xl uppercase">
                      {profile?.user.first_name} {profile?.user.last_name}
                    </h1>
                  </div>
                </div>
                <div className="my-4 border-b-2 border-base-100"></div>
                <section className="flex flex-col gap-y-5">
                  <article className="describe">
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
                  <article className="known-languages">
                    <h2 className="mb-2 block border-b-[1px] border-base-100 text-lg font-bold uppercase tracking-wide text-gray-700">
                      Prowadzone zajęcia
                    </h2>
                    {profile?.classes?.length == 0 ||
                      (profile?.classes == null && (
                        <p className="pl-2">Brak zajęć</p>
                      ))}
                    <ul className="pl-2">
                      {profile?.classes?.map((classTeacher, i) => (
                        <li
                          className="mb-2 flex flex-row items-center gap-x-2 border-b-[1px]  border-base-300 p-2 transition-all duration-150 ease-linear hover:bg-base-100"
                          key={i}
                        >
                          <Link
                            to={`/classes/${classTeacher?.id}`}
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
                            to={`/classes/${classTeacher?.id}`}
                            params={{
                              classesId: classTeacher?.id,
                            }}
                            className="btn-outline no-animation btn mt-2 h-10 !min-h-0 w-3/12 rounded-none border-base-400 py-0 hover:bg-base-400"
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
        </section>
      )}
    </>
  )
}

export default ProfilePage
