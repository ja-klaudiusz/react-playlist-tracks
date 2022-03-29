import React from "react";
import { useSelector } from "react-redux";

import { queryPoint } from "../../utils";
import Trigger from "./Trigger";

const Starter = ({ tree }) => {
  const ms = useSelector((state) => {
    const timerMs = state.timer.time.ms;
    const fractionTime = Math.floor(timerMs / 100);
    const time =
      timerMs !== null ? (fractionTime === 0 ? 0.01 : fractionTime) : null;
    return time;
  });

  const query = ms ? queryPoint(tree, ms * 100).result : [];

  return query.map((element, i) => {
    return <Trigger elementId={element.value} key={i} />;
  });
};

export default Starter;
