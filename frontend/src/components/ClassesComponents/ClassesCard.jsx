import React from 'react'
import { MdOutlineLocationOn } from 'react-icons/md'
import guest from '../../assets/guest.png'
import { AiOutlinePhone } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import { backendUrl } from '../../variables/backendUrl'

const ClassesCard = (props) => {
  const { classes } = props

  return (
    <div className="card rounded-sm border-[1px] border-base-200 bg-white p-4">
      <div className="flex flex-row">
        <div className="flex flex-col border-base-200 pr-4 phone:w-10/12 phone:border-r-[1px]">
          <div className="mb-2 w-full border-b-[1px] border-base-200 pb-2 phone:hidden">
            <div className="rating rating-xs mr-2">
              {classes?.amount_of_opinions > 0 && (
                <div>
                  {Array.from({ length: 5 }, (_, index) => (
                    <input
                      key={index}
                      type="radio"
                      name={`${classes?.id}__rate_phone`}
                      className="mask mask-star-2 bg-base-400"
                      checked={
                        Math.floor(classes?.average_rate) == index + 1
                          ? true
                          : false
                      }
                      readOnly
                    />
                  ))}
                </div>
              )}
            </div>
            <span className="mt-2 text-center text-xs text-base-400">
              {classes?.amount_of_opinions == 0 && '(Brak opinii)'}
              {classes?.amount_of_opinions == 1 &&
                `(${classes?.amount_of_opinions} opinia)`}
              {classes?.amount_of_opinions == 2 &&
                `(${classes?.amount_of_opinions} opinie)`}
              {classes?.amount_of_opinions == 3 &&
                `(${classes?.amount_of_opinions} opinie)`}
              {classes?.amount_of_opinions == 4 &&
                `(${classes?.amount_of_opinions} opinie)`}
              {classes?.amount_of_opinions > 4 &&
                `(${classes?.amount_of_opinions} opinii)`}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            Język {classes.language.name}
          </div>
          <Link
            to={`/zajecia/${classes?.id}`}
            params={{
              classesId: classes?.id,
            }}
          >
            <h1 className="mb-1 border-b-[1px] border-base-200 pb-1 text-xl font-semibold uppercase text-gray-700">
              {classes.name}
            </h1>
          </Link>
          <Link
            to={`/nauczyciel/${classes?.teacher?.user?.id}`}
            params={{
              teacherId: classes?.teacher?.user?.id,
            }}
          >
            <div className="mb-1 flex flex-row items-center gap-x-5 border-b-[1px] border-base-200 pb-1 align-middle">
              <div className="avatar py-3">
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
              <h2 className="text-lg ">
                {classes.teacher?.user?.first_name}{' '}
                {classes.teacher?.user?.last_name}
              </h2>
            </div>
          </Link>
          <div className="description pt-1 text-justify text-sm">
            {classes.description.length > 250
              ? classes.description
                  .replace(/(<([^>]+)>)/gi, ' ')
                  .substring(0, 250) + '...'
              : classes.description.replace(/(<([^>]+)>)/gi, ' ')}
          </div>
          <div className="mt-2 flex flex-row items-center border-t-[1px] border-base-200 pt-2 phone:hidden">
            <div className="border-r-[1px] border-base-200 pr-2">
              <span className="text-center text-lg font-bold max-md:text-base">
                {classes.price_for_lesson} PLN
              </span>
              <span className="text-center max-md:text-sm"> za godzinę</span>
            </div>
            <div className="pl-2 text-sm">
              {classes?.teacher?.phone_number != null &&
              classes?.teacher?.phone_number != '' ? (
                <span className="flex flex-row items-center">
                  <AiOutlinePhone className="mr-2 text-[1.5em]" />
                  {classes?.teacher?.phone_number}
                </span>
              ) : (
                'Brak numeru telefonu'
              )}
            </div>
          </div>
          <div className="mt-2 border-t-[1px] border-base-200 pt-2 text-sm text-gray-400">
            {classes?.teacher?.phone_number != null ? (
              <span className="flex flex-row items-center">
                <AiOutlinePhone className="mr-2 text-[1.5em] text-[gray]" />|{' '}
                {classes?.teacher?.phone_number} |{' '}
                {classes?.teacher?.user.email}
              </span>
            ) : (
              <span className="flex flex-row">
                {' '}
                <AiOutlinePhone className="mr-2 text-[1.5em] text-[gray]" />
                Brak numeru telefonu | {classes?.teacher?.user.email}
              </span>
            )}
          </div>
          <div className="mt-2 flex items-center border-t-[1px] border-base-200 pt-2">
            <div className="flex flex-row text-sm text-gray-400">
              <MdOutlineLocationOn
                className="mr-2"
                style={{
                  color: 'gray',
                  fontSize: '1.5em',
                  verticalAlign: 'middle',
                }}
              />
              {classes?.place_of_classes.map((item) =>
                item == 'online' ? ' | Online' : ''
              )}

              {classes?.address ? ` | ${classes?.address?.city?.name}` : ''}
            </div>
          </div>
        </div>
        <div className="flex w-2/12 flex-col pl-4 max-phone:hidden">
          <span className="text-center text-lg font-bold max-md:text-base">
            {classes.price_for_lesson} PLN
          </span>
          <span className="text-center max-md:text-sm">za godzinę</span>
          <div className="rating mx-auto mt-2 flex w-full justify-center border-t-[1px] border-base-200 pt-2 max-lg:rating-xs lg:rating-sm">
            {classes?.amount_of_opinions > 0 && (
              <div>
                {Array.from({ length: 5 }, (_, index) => (
                  <input
                    key={index}
                    type="radio"
                    name={`${classes?.id}__rate`}
                    className="mask mask-star-2 bg-base-400"
                    checked={
                      Math.floor(classes?.average_rate) == index + 1
                        ? true
                        : false
                    }
                    readOnly
                  />
                ))}
              </div>
            )}
          </div>
          <span className="mt-2 text-center text-xs text-base-400">
            {classes?.amount_of_opinions == 0 && '(Brak opinii)'}
            {classes?.amount_of_opinions == 1 &&
              `(${classes?.amount_of_opinions} opinia)`}
            {classes?.amount_of_opinions == 2 &&
              `(${classes?.amount_of_opinions} opinie)`}
            {classes?.amount_of_opinions == 3 &&
              `(${classes?.amount_of_opinions} opinie)`}
            {classes?.amount_of_opinions == 4 &&
              `(${classes?.amount_of_opinions} opinie)`}
            {classes?.amount_of_opinions > 4 &&
              `(${classes?.amount_of_opinions} opinii)`}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ClassesCard
