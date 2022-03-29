import React from "react";
import Element from "./Element";

const TrackElements = ({ data, even }) => {
  const { elements } = data;

  return (
    <div
      className={
        (even ? "bg-slate-800" : "bg-slate-900") +
        " flex flex-row justify-start items-center py-1 border-b border-slate-800 relative"
      }
    >
      <div className="w-full h-6 flex flex-row justify-start ">
        {elements.map((element) => {
          return (
            <Element
              key={element.id}
              id={element.id}
              periodStart={element.period[0]}
              periodEnd={element.period[1]}
              trackId={element.trackId}
              elementName={element.elementName}
            />
          );
        })}
      </div>
    </div>
  );
};

export default TrackElements;
