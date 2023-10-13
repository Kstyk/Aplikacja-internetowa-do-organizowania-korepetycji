import React, { useState, useEffect } from 'react'
import useAxios from '../utils/useAxios'
import LoadingComponent from '../components/LoadingComponent'
import { Link } from 'react-router-dom'
import { FiExternalLink, FiEdit } from 'react-icons/fi'
import showAlertError from '../components/messages/SwalAlertError'

const ListOfTeachersClassesPage = () => {
  document.title = 'Lista zajęć'

  const api = useAxios()
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchClasses = async () => {
    await api
      .get(`/api/classes/teacher-classes/`)
      .then((res) => {
        setClasses(res.data)
      })
      .catch((err) => {
        showAlertError(
          'Błąd',
          'Wystąpił błąd podczas pobierania danych z serwera.'
        )
      })
    setLoading(false)
  }

  useEffect(() => {
    fetchClasses()
  }, [])

  return (
    <div className="pt-10">
      <div className="absolute left-0 right-0 top-[70px] h-[200px] bg-base-300 max-phone:hidden"></div>
      {loading ? (
        <LoadingComponent message="Ładowanie informacji o plikach..." />
      ) : (
        <>
          <div className="card mx-auto mb-10 min-h-[40vh] w-full rounded-md bg-white px-5 py-5 shadow-xl">
            <h1 className="text-center text-xl font-bold uppercase tracking-wider text-gray-700">
              Lista Twoich zajęć
            </h1>
            <div className="my-4 border-b-[1px] border-base-100"></div>
            <div className="container mx-auto mb-10 text-gray-100">
              <div className="flex flex-col text-xs">
                <div className="flex items-center justify-center border-b border-gray-700 border-opacity-60 bg-transparent text-left text-gray-700">
                  <div className="flex-1 cursor-pointer px-2 py-3 transition-all duration-300 hover:font-bold sm:p-3">
                    Zajęcia
                  </div>
                  <div className="hidden w-24 cursor-pointer px-2 py-3 text-center transition-all duration-300 hover:font-bold sm:block sm:p-3">
                    Język zajęć
                  </div>
                  <div className="block w-20 cursor-pointer px-2 py-3 text-center transition-all duration-300 hover:font-bold sm:w-24 sm:p-3">
                    Dostępne do zakupu
                  </div>
                  <div className="block w-20 cursor-pointer px-2 py-3 text-center transition-all duration-300 hover:font-bold sm:w-24 sm:p-3">
                    Podgląd
                  </div>
                  <div className="block w-20 cursor-pointer px-2 py-3 text-center transition-all duration-300 hover:font-bold sm:w-24 sm:p-3">
                    Edycja
                  </div>
                </div>
                {classes.length == 0 && (
                  <span className="mt-3 text-center italic text-black">
                    Nie masz jeszcze stworzonych żadnych zajęć.
                  </span>
                )}
                {classes?.map((classes) => (
                  <div
                    key={classes?.id}
                    className={`flex border-b border-gray-700 border-opacity-20 bg-transparent text-black hover:bg-slate-100 ${
                      !classes?.able_to_buy && 'text-slate-500'
                    } transition-all duration-200 `}
                  >
                    <div className="flex flex-1 cursor-pointer items-center px-2 py-3 sm:w-auto sm:truncate sm:p-3">
                      <Link
                        className="transition-all duration-200 hover:underline sm:truncate"
                        to={`/zajecia/${classes?.id}`}
                      >
                        {classes?.name}
                      </Link>
                    </div>
                    <div className="hidden w-24 items-center justify-center px-2 py-3 text-center sm:flex sm:p-3">
                      {classes?.language?.name}
                    </div>
                    <div className="flex w-20 items-center justify-center px-2 py-3 text-center sm:w-24 sm:p-3">
                      {classes?.able_to_buy ? 'Tak' : 'Nie'}
                    </div>
                    <div className="flex w-20 items-center justify-center px-2 py-3 text-center sm:w-24 sm:p-3">
                      <Link
                        className="transition-all duration-200 hover:underline sm:truncate"
                        to={`/zajecia/${classes?.id}`}
                      >
                        <FiExternalLink />
                      </Link>
                    </div>
                    <div className="flex w-20 items-center justify-center px-2 py-3 text-center sm:w-24 sm:p-3">
                      <Link
                        className="transition-all duration-200 hover:underline sm:truncate"
                        to={`/zajecia/edytuj`}
                        state={{ classes: classes }}
                      >
                        <FiEdit />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>{' '}
          </div>
        </>
      )}
    </div>
  )
}

export default ListOfTeachersClassesPage
