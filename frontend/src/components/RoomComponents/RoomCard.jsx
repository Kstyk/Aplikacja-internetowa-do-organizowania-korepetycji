import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import guest from '../../assets/guest.png'
import dayjs from 'dayjs'
import { useContext } from 'react'
import { NotificationContext } from '../../context/NotificationContext'

const RoomCard = ({ room, user }) => {
  dayjs.locale('pl')

  return (
    <Link
      to={`/pokoj/${room.room_id}/`}
      className={`card indicator flex w-full flex-col items-center justify-center rounded-md border-[1px] bg-white p-5 transition-all duration-200 hover:bg-slate-100 ${
        room?.unread_messages_count > 0 && '!border-2 border-base-300'
      }`}
    >
      <span className="badge badge-primary indicator-item">
        <span
          className={`tooltip tooltip-left ${
            room?.unread_messages_count > 0 && 'font-bold'
          }`}
          data-tip={`Nieprzeczytanych wiadomości: ${room?.unread_messages_count}`}
        >
          {room?.unread_messages_count}
        </span>
      </span>

      {room.users.map((u) =>
        u?.user?.email != user.email ? (
          <React.Fragment key={u?.user?.id}>
            <figure className="aspect-square w-4/12">
              <img
                src={u?.profile_image == null ? guest : `${u?.profile_image}`}
                alt="Shoes"
                className="rounded-xl"
              />
            </figure>
            <div className="card-body flex flex-col justify-between pb-0 text-center">
              <h2>
                {room.archivized ? (
                  <div>{room.name}</div>
                ) : (
                  <div>
                    <span>
                      {u?.user?.first_name} {u?.user?.last_name} -{' '}
                      {u?.user?.email}
                    </span>
                  </div>
                )}
              </h2>
              <div className="closer-classes flex flex-col text-center">
                <span className="text-sm text-gray-500">
                  Najbliższe zajęcia:
                </span>
                <span className="text-sm text-gray-500">
                  {room?.next_classes
                    ? dayjs(room?.next_classes.date).format(
                        'dddd, DD MMMM, HH:mm'
                      )
                    : 'Brak zaplanowanych zajęć'}
                </span>
              </div>
            </div>
          </React.Fragment>
        ) : (
          ''
        )
      )}
    </Link>
  )
}

export default RoomCard
