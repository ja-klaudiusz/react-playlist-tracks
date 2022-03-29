import React from "react";
import { useSelector } from "react-redux";

const Track = ({ data, even }) => {
  const { trackId } = data;
  const track = useSelector((state) => state.data.tracks[trackId]);
  return (
    <div
      className={
        (even ? "bg-slate-600 text-slate-300" : "bg-slate-700 text-slate-400") +
        " h-8 px-2 w-full text-left text-sm flex flex-col justify-center"
      }
    >
      <div>{track?.name}</div>
    </div>
  );
};
export default Track;
