import { LinearProgress } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";

import { LoadingState } from "../store";
import { SpacedPaper } from "./SpacedPaper";

export const Loading = () => {
  const progress = useSelector((state: LoadingState) => state.progress);

  const normalize = ({ done, total }: { done: number; total: number }) =>
    (done / total) * 100;

  return (
    <SpacedPaper>
      <div>
        <h2>loading world covid data</h2>
        <LinearProgress
          variant="determinate"
          value={normalize(progress.covid)}
        />
      </div>
      <div>
        <h2>loading US covid data</h2>
        <LinearProgress variant="determinate" value={normalize(progress.us)} />
      </div>
      <div>
        <h2>loading world population data</h2>
        <LinearProgress
          variant="determinate"
          value={normalize(progress.population)}
        />
      </div>
      <div>
        <h2>loading US state data</h2>
        <LinearProgress
          variant="determinate"
          value={normalize(progress.stateInfo)}
        />
      </div>
    </SpacedPaper>
  );
};
