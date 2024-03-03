import React, { useContext } from 'react'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'
import AuthContext from '../../context/AuthContext'

const PurchaseHistoryTable = (props) => {
  const { purchases } = props
  const { user } = useContext(AuthContext)
  return (
    <div className="container mx-auto mb-10 text-gray-100">
      <div className="flex flex-col text-xs">
        <div className="flex items-center justify-center border-b border-gray-700 border-opacity-60 bg-transparent text-left text-gray-700">
          <div
            className="flex-1 cursor-pointer px-2 py-3 transition-all duration-300 hover:font-bold sm:p-3"
            title="Sortuj po nazwie pliku"
          >
            Zajęcia
          </div>
          <div className="hidden w-24 cursor-pointer px-2 py-3 text-center transition-all duration-300 hover:font-bold sm:block sm:p-3">
            Pokój
          </div>
          <div className="block w-20 cursor-pointer px-2 py-3 text-center transition-all duration-300 hover:font-bold sm:w-24 sm:p-3">
            Liczba zajęć
          </div>
          <div className="block w-20 cursor-pointer px-2 py-3 text-center transition-all duration-300 hover:font-bold sm:w-24 sm:p-3">
            Zapłacona kwota
          </div>
          <div className="hidden w-24 cursor-pointer px-2 py-3 text-right transition-all duration-300 hover:font-bold sm:block sm:p-3">
            Data zakupu
          </div>
        </div>
        {purchases.length == 0 && (
          <span className="mt-3 text-center italic text-black">
            Brak zakupionych zajęć.
          </span>
        )}
        {purchases?.map((purchase) => (
          <div
            key={purchase.id}
            className="flex border-b border-gray-700 border-opacity-20 bg-transparent text-black transition-all duration-200 hover:bg-slate-100"
          >
            <div className="flex flex-1 cursor-pointer items-center px-2 py-3 sm:w-auto sm:truncate sm:p-3">
              <Link
                className="transition-all duration-200 hover:underline sm:truncate"
                to={`/classes/${purchase?.classes?.id}`}
                title={purchase?.classes?.name}
              >
                {purchase?.classes?.name}
              </Link>
            </div>
            <div className="hidden w-24 items-center justify-center px-2 py-3 text-center sm:flex sm:p-3">
              {purchase?.room != null ? (
                purchase?.room?.users.some((u) => {
                  if (u?.user?.id == user?.user_id) {
                    return true
                  }
                }) ? (
                  <Link
                    className="underline"
                    to={`/pokoj/${purchase?.room?.room_id}`}
                  >
                    Link
                  </Link>
                ) : (
                  'Brak pokoju.'
                )
              ) : (
                'Brak pokoju.'
              )}
            </div>
            <div className="flex w-20 items-center justify-center px-2 py-3 text-center sm:w-24 sm:p-3">
              {purchase?.amount_of_lessons}
            </div>
            <div className="flex w-20 items-center justify-center px-2 py-3 text-center sm:w-24 sm:p-3">
              {purchase?.paid_price} zł
            </div>
            <div className="hidden w-24 items-center justify-center px-2 py-3 text-right text-gray-400 sm:flex sm:p-3">
              <p>
                {' '}
                {dayjs(purchase?.purchase_date).format('YYYY-MM-DD, HH:mm')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PurchaseHistoryTable
