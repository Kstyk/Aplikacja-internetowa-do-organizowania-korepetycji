import React from "react";

const LoadingComponent = (props) => {
  return (
    <div className="w-full pt-10 mt-10 flex flex-col items-center justify-center bg-inherit">
      <span className="loading loading-spinner loading-lg text-base-400"></span>
      <span className="text-black text-center">{props.message}</span>
    </div>
  );
};

export default LoadingComponent;
