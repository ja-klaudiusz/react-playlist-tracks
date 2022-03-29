import React from "react";
import { useSelector } from "react-redux";

const Timer = ({ periodMax }) => {
  const ms = useSelector((state) => {
    const timerMs = state.timer.time.ms;
    const fractionTime = Math.floor(timerMs / 100);
    const time =
      timerMs !== null ? (fractionTime === 0 ? 0.01 : fractionTime) : null;
    return time;
  });

  const max = periodMax > 0 ? periodMax / 1000 : 0;
  return (
    <div className="flex flex-col justify-center items-center">
      <strong className="text-xs">{(max - ms / 10).toFixed(1)} s</strong>
    </div>
  );
};

export default Timer;
