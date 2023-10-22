import React from 'react'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import { BiSolidQuoteRight, BiSolidQuoteLeft } from 'react-icons/bi'

const SendedQuestionCard = ({ question }) => {
  console.log(question)
  return (
    <div
      className={`card rounded-md px-3 py-2 pb-5 shadow-xl ${
        question?.accepted == true
          ? 'shadow-green-200'
          : question?.accepted == false
          ? 'shadow-red-200'
          : 'shadow-gray-200'
      }`}
    >
      <div className="flex w-full flex-row justify-between">
        <h2 className="text-md w-9/12 text-left uppercase tracking-wider text-gray-700 hover:underline">
          <Link to={`/zajecia/${question?.classes?.id}`}>
            {question?.classes?.name}
          </Link>
        </h2>
        <span className="text-sm text-gray-500">
          Wysłano: {dayjs(question?.sended_at).format('DD-MM-YYYY, HH:mm')}
        </span>
      </div>
      <div className="my-2 border-b-[1px] border-base-100"></div>
      <div className="text-left">
        <h4 className="text-md">Treść twojej wiadomości:</h4>
        <div className="relative mt-2 border-[1px] border-gray-400 bg-gray-100 px-8 py-3">
          <BiSolidQuoteLeft className="absolute -top-3 left-2 h-5 w-5" />
          <BiSolidQuoteRight className="absolute -bottom-3 right-2 h-5 w-5" />
          <p className="b break-words text-sm italic text-gray-700 phone:text-base">
            {question?.student_message}
          </p>
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
    </div>
  )
}

export default SendedQuestionCard
