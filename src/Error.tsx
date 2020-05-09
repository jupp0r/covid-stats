import React from "react";

import { ErrorState } from "./store";
import { useSelector } from "react-redux";

export const Error = () => {
  const message = useSelector((state: ErrorState) => state.message);
  return <div>Error: {message}</div>;
};
