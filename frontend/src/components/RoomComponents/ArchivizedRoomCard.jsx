import React from 'react'
import { Link } from 'react-router-dom'
import guest from '../../assets/guest.png'

const ArchivizedRoomCard = ({ room, user }) => {
  return (
    <Link
      to={`/pokoj/${room.room_id}/`}
      className="card flex w-full flex-col items-center justify-center rounded-md border-[1px] bg-white p-5 transition-all duration-200 hover:bg-slate-100"
    >
      <React.Fragment>
        <figure className="aspect-square w-4/12">
          <img
            src={
              room?.deleted_user?.profile_image == null
                ? guest
                : `${room?.deleted_user?.profile_image}`
            }
            className="rounded-xl"
          />
        </figure>
        <div className="card-body flex flex-col justify-between pb-0 text-center">
          <h2>
            <div>
              <span>
                {room?.deleted_user?.user?.first_name}{' '}
                {room?.deleted_user?.user?.last_name} -{' '}
                {room?.deleted_user?.user?.email}
              </span>
            </div>
          </h2>
          <div className="closer-classes flex flex-col text-center"></div>
        </div>
      </React.Fragment>
    </Link>
  )
}

export default ArchivizedRoomCard
