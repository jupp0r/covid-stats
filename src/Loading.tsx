import React from "react";
import { useSelector } from "react-redux";
import { LoadingState } from "./store";

export const Loading = () => {
  const progress = useSelector((state: LoadingState) => state.progress);
  return (
    <div>
      <div>
        loading covid: {progress.covid.done} / {progress.covid.total}
      </div>
      <div>
        loading population: {progress.population.done} /{" "}
        {progress.population.total}
      </div>
    </div>
  );
};
