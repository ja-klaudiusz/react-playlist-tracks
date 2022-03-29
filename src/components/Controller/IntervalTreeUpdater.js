import React from "react";
import { useSelector } from "react-redux";

const IntervalTreeUpdater = ({ tree }) => {
  const data = useSelector((state) => state.data.masterData);
  tree.clear();
  for (let elementId of Object.keys(data)) {
    const element = data[elementId];
    tree.insert(element.period[0], element.period[1], elementId);
  }
  return null;
};

export default IntervalTreeUpdater;
