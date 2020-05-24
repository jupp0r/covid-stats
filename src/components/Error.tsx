import React from "react";
import { useSelector } from "react-redux";

import { ErrorState } from "../store";

export const Error = (): JSX.Element => {
  const message = useSelector((state: ErrorState) => state.message);
  return <div>Error: {message}</div>;
};
