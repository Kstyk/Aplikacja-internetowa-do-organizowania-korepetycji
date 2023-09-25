import React from 'react'
import { Link } from 'react-router-dom'
import guest from '../../assets/guest.png'
import dayjs from 'dayjs'

const RoomCard = ({ room, user }) => {
  dayjs.locale('pl')

  return (
    <Link
      to={`/pokoj/${room.room_id}/`}
      className="card flex w-full flex-col items-center justify-center rounded-md border-[1px] bg-white p-5 transition-all duration-200 hover:bg-slate-100"
    >
      {room.users.map((u) =>
        u?.user?.email != user.email ? (
          <React.Fragment key={u?.user?.id}>
            <figure className="aspect-square w-4/12">
              <img
                src={
                  u?.profile_image == null
                    ? guest
                    : `http://127.0.0.1:8000${u?.profile_image}`
                }
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
