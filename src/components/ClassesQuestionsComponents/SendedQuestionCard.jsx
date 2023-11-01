import React from 'react'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import { BiSolidQuoteRight, BiSolidQuoteLeft } from 'react-icons/bi'

const SendedQuestionCard = ({ question }) => {
  return (
    <div
      className={`card rounded-md px-3 py-2 pb-5 shadow-md ${
        question?.accepted == true
          ? 'shadow-green-200'
          : question?.accepted == false
          ? 'shadow-red-200'
          : 'shadow-gray-200'
      }`}
    >
      <div className="flex w-full flex-row justify-between">
        <h2 className="text-md w-9/12 text-left font-bold uppercase tracking-wider text-gray-700 hover:underline">
          <Link to={`/zajecia/${question?.classes?.id}`}>
            {question?.classes?.name}
          </Link>
        </h2>
        <span className="text-sm text-gray-500">
          Wysłano: {dayjs(question?.sended_at).format('DD-MM-YYYY, HH:mm')}
        </span>
      </div>
      <div className="my-2 border-b-[1px] border-base-100"></div>
      <div className="flex flex-col justify-between gap-x-2 text-left phone:flex-row">
        <div className="w-full phone:w-4/12 ">
          <h4 className="text-md">Zażądany adres:</h4>
          <div className="mt-2  w-full break-words border-[1px] border-gray-400 bg-gray-100 px-3">
            {question?.address?.postal_code} {question?.address?.city?.name}{' '}
            <br />
            woj. {question?.address?.voivodeship?.name}
            <br />
            ul. {question?.address?.street} {question?.address?.building_number}
          </div>
        </div>
        <div className="mt-3 w-full phone:mt-0 phone:w-8/12">
          <h4 className="text-md">Treść twojej wiadomości:</h4>
          <div className="relative mt-2 border-[1px] border-gray-400 bg-gray-100 px-8 py-3 ">
            <BiSolidQuoteLeft className="absolute -top-3 left-2 h-5 w-5" />
            <BiSolidQuoteRight className="absolute -bottom-3 right-2 h-5 w-5" />
            <p className="b break-words text-sm italic text-gray-700 phone:text-base">
              {question?.student_message}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <span>
          Status:{' '}
          <span
            className={`uppercase ${
              question?.accepted == true
                ? 'text-green-500'
                : question?.accepted == false
                ? 'text-red-500'
                : 'text-yellow-500'
            }`}
          >
            {question?.accepted == null && 'Oczekujące'}
            {question?.accepted == true && 'Zaakceptowane'}
            {question?.accepted == false && 'Odrzucone'}
          </span>
        </span>
      </div>
      {question?.teacher_message && (
        <div className="text-left">
          <h4 className="text-md">Treść odpowiedzi:</h4>
          <div className="relative mt-2 border-[1px] border-gray-400 bg-gray-100 px-8 py-3">
            <BiSolidQuoteLeft className="absolute -top-3 left-2 h-5 w-5" />
            <BiSolidQuoteRight className="absolute -bottom-3 right-2 h-5 w-5" />
            <p className="b break-words text-sm italic text-gray-700 phone:text-base">
              {question?.teacher_message}
            </p>
          </div>
        </div>
      )}
      <div>
        {console.log(question)}
        {question?.accepted == true && (
          <Link
            to={`/zajecia/${question?.classes?.id}/zakup-po-zapytaniu`}
            state={{ address: question?.address }}
            className="btn-outline no-animation btn mb-2 mt-2 h-10 !min-h-0 w-full rounded-sm border-base-400 py-0 hover:bg-base-400 md:w-5/12 xl:w-4/12"
          >
            Zakup
          </Link>
        )}
      </div>
    </div>
  )
}

export default SendedQuestionCard
