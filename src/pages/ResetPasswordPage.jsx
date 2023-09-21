import React from "react";
import { useParams } from "react-router-dom";

const ResetPasswordPage = () => {
  const { token } = useParams();
  return <div>{token}</div>;
};

export default ResetPasswordPage;
