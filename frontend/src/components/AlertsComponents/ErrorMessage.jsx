import React from 'react'
import { useState } from 'react'
import 'animate.css'

const ErrorMessage = (props) => {
  const { error, setError } = props

  return (
    <>
      {error != null ? (
        <div className="animate__animated animate__zoomIn alert alert-error mb-4 rounded-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
            onClick={() => setError(null)}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      ) : (
        ''
      )}
    </>
  )
}

export default ErrorMessage
