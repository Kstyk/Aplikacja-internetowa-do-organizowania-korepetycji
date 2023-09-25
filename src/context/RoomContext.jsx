import { createContext, useState, useEffect } from 'react'

const RoomContext = createContext()

export default RoomContext

export const RoomProvider = ({ children }) => {
  const [room, setRoom] = useState(null)
  const [selectedTab, setSelectedTab] = useState({ tab: 1 })

  useEffect(() => {
    if (room !== null) {
      const initialSelectedTab = sessionStorage.getItem(`selectedTab-${room}`)
      const initialTabData = initialSelectedTab
        ? JSON.parse(initialSelectedTab)
        : { tab: 1 }
      setSelectedTab(initialTabData)
    }
  }, [room])

  const [loading, setLoading] = useState()

  const handleSelectedTab = (val) => {
    const data = {
      tab: val,
      roomId: room,
    }
    setSelectedTab(data)
    sessionStorage.setItem(`selectedTab-${room}`, JSON.stringify(data))
  }

  let contextData = {
    selectedTab: selectedTab.tab,
    setSelectedTab: handleSelectedTab,
    setRoom: setRoom,
  }

  return (
    <RoomContext.Provider value={contextData}>
      {loading ? null : children}
    </RoomContext.Provider>
  )
}
