import React from 'react'

const LoadingComponent = (props) => {
  return (
    <div className="mt-10 flex w-full flex-col items-center justify-center bg-inherit pt-10">
      <span className="loading loading-spinner loading-lg text-base-400"></span>
      <span className="text-center text-black">{props.message}</span>
    </div>
  )
}

export default LoadingComponent
