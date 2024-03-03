import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import { BiSolidQuoteRight, BiSolidQuoteLeft } from 'react-icons/bi'
import guest from '../../assets/guest.png'
import SendResponse from './SendResponse'

const ReceivedQuestionCard = ({ question, fetchQuestions }) => {
  const [isOpened, setIsOpened] = useState(false)
  return (
    <div
      className={`card rounded-md px-3 py-3 pb-5 shadow-md ${
        question?.accepted == true
          ? question?.bought
            ? 'shadow-base-400'
            : 'shadow-green-500'
          : question?.accepted == false
          ? 'shadow-red-200'
          : 'shadow-gray-200'
      }`}
    >
      <div className="flex w-full flex-row justify-between">
        <Link to={`/student/${question?.student?.id}`} className="avatar">
          <div className="mr-4 h-10 w-10 rounded-full ring-primary ring-offset-2 ring-offset-base-100 transition-all duration-200 hover:ring">
            <img
              src={
                question?.student_profile_image
                  ? `${question?.student_profile_image}`
                  : guest
              }
            />
          </div>
        </Link>
        <h2 className="text-md w-9/12 text-left uppercase tracking-wider text-gray-700 hover:underline">
          <Link to={`/student/${question?.student?.id}`}>
            {question?.student?.first_name} {question?.student?.last_name}
          </Link>
        </h2>
        <span className="text-sm text-gray-500">
          Wysłano: {dayjs(question?.sended_at).format('DD-MM-YYYY, HH:mm')}
        </span>
      </div>
      <div className="my-2 border-b-[1px] border-base-100"></div>
      <h2 className="text-md w-9/12 text-left uppercase tracking-wider text-gray-700 hover:underline">
        <Link to={`/zajecia/${question?.classes?.id}`}>
          {question?.classes?.name}
        </Link>
      </h2>
      <div className="my-2 border-b-[1px] border-base-100"></div>

      <div className="flex flex-row justify-between gap-x-2 text-left">
        <div className="w-4/12 ">
          <h4 className="text-md">Zażądany adres:</h4>
          <div className="mt-2  w-full break-words border-[1px] border-gray-400 bg-gray-100 px-3">
            {question?.address?.postal_code} {question?.address?.city?.name}{' '}
            <br />
            woj. {question?.address?.voivodeship?.name}
            <br />
            ul. {question?.address?.street} {question?.address?.building_number}
          </div>
        </div>
        <div className="w-8/12">
          <h4 className="text-md">Treść wiadomości studenta:</h4>
          <div className="relative mt-2 border-[1px] border-gray-400 bg-gray-100 px-8 py-3 ">
            <BiSolidQuoteLeft className="absolute -top-3 left-2 h-5 w-5" />
            <BiSolidQuoteRight className="absolute -bottom-3 right-2 h-5 w-5" />
            <p className="b break-words text-sm italic text-gray-700 phone:text-base">
              {question?.student_message}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-col items-center justify-center">
        <span>
          Status:{' '}
          <span
            className={`uppercase ${
              question?.accepted == true
                ? question?.bought
                  ? 'text-green-800'
                  : 'text-green-500'
                : question?.accepted == false
                ? 'text-red-500'
                : 'text-yellow-500'
            }`}
          >
            {question?.accepted == null && 'Oczekujące'}
            {question?.accepted == true &&
              question?.bought == false &&
              'Zaakceptowane'}
            {question?.accepted == true &&
              question?.bought == true &&
              'Zakupione'}
            {question?.accepted == false && 'Odrzucone'}
          </span>
        </span>
        {question.accepted == null && (
          <>
            {' '}
            <button
              onClick={() => setIsOpened(!isOpened)}
              className="btn-outline no-animation btn mb-2 mt-2 h-10 !min-h-0 w-full rounded-sm border-base-400 py-0 hover:bg-base-400 md:w-4/12"
            >
              Odpowiedz
            </button>
            <SendResponse
              opened={isOpened}
              setIsOpened={setIsOpened}
              fetchQuestions={fetchQuestions}
              question={question}
            />
          </>
        )}
      </div>
      {question?.teacher_message != null && (
        <div className="text-left">
          <h4 className="text-md">Twoja odpowiedź:</h4>
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

export default ReceivedQuestionCard
