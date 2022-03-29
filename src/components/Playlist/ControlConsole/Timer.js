import React from "react";
import { useSelector } from "react-redux";

import { queryPoint } from "../../../utils";

import Action from "./Action";

const Timer = ({ tree }) => {
  const ms = useSelector((state) => {
    const timerMs = state.timer.time.ms;
    const fractionTime = Math.floor(timerMs / 100);
    const time =
      timerMs !== null ? (fractionTime === 0 ? 0.01 : fractionTime) : null;
    return time;
  });

  const query = ms ? queryPoint(tree, ms * 100).result : [];
  const periodMax = tree?.root?.maximumHigh
    ? tree?.root?.maximumHigh / 1000
    : 0;
  return (
    <div className="flex flex-col justify-center items-center">
      <strong className="text-xs">{(periodMax - ms / 10).toFixed(1)} s</strong>

      {query.map((element, i) => {
        return <Action elementId={element.value} key={i} />;
      })}
    </div>
  );
};

export default Timer;
