import React from 'react'

const LoadingComponent = (props) => {
  return (
    <div className="mb-5 flex w-full flex-col items-center justify-center bg-transparent">
      <span className="loading loading-spinner loading-lg text-base-400"></span>
      <span className="text-center text-black">{props.message}</span>
    </div>
  )
}

export default LoadingComponent
