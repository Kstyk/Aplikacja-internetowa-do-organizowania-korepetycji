import React, { useState, useEffect, useContext } from 'react'
import useAxios from '../utils/useAxios'
import LoadingComponent from '../components/GeneralComponents/LoadingComponent'
import guest from '../assets/guest.png'
import { AiOutlinePhone, AiOutlineMail } from 'react-icons/ai'
import { MdOutlineLocationOn } from 'react-icons/md'
import parse from 'html-react-parser'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

const ProfilePage = () => {
  document.title = 'Twój profil'

  const { user } = useContext(AuthContext)
  const api = useAxios()

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async () => {
    await api
      .get(`/api/users/profile/${user?.user_id}`)
      .then((res) => {
        setProfile(res.data)
      })
      .catch((err) => {})
  }

  const fetchAll = async () => {
    setLoading(true)
    await fetchProfile()
    setLoading(false)
  }

  useEffect(() => {
    fetchAll()
  }, [])

  return (
    <>
      <section className="mb-10 mt-10 w-full shadow-xl">
        <div className="absolute left-0 right-0 top-[70px] h-[500px] bg-base-300 max-phone:hidden"></div>
        <div className="card z-30 mb-5 flex flex-row items-center justify-between rounded-md border-[1px] border-base-200 bg-white py-4 text-center shadow-xl">
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

                  <div className="my-4 border-b-[1px] border-base-100 phone:hidden"></div>
                </section>
              </div>
              <div className="content w-8/12 px-4 max-phone:order-2 max-phone:mb-3 max-phone:w-full max-phone:pb-3 sm:w-9/12">
                <div className="header flex flex-row">
                  <div className="left w-full">
                    <h1 className="w-full break-words text-xl font-bold uppercase tracking-wider text-gray-700">
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
                </section>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  )
}

export default ProfilePage
