import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setNowPlaying } from "../../../redux/timer/timerSlice";
import { useRequestAnimationFrame } from "request-animation-frame-hook";

const ElementDetails = ({ id, playingTime, draggClass, children }) => {
  const dispatch = useDispatch();
  const [isPlaying, setSetIsPlaying] = useState(false);
  const timerPause = useSelector((state) => state.timer.timerState.pause);
  const timerStop = useSelector((state) => state.timer.timerState.stop);

  const autoStopCb = () => {
    dispatch(setNowPlaying({ id, isPlaying: false }));
    setSetIsPlaying(false);
  };

  const [start, pause, setStart, setStop] = useRequestAnimationFrame(
    (data) => {},
    { stopRules: [playingTime || 0, false], autoStopCb }
  );

  useEffect(() => {
    if (!start && !pause && playingTime && !timerPause && !isPlaying) {
      setSetIsPlaying(true);
      setStart();
    } else if (
      !start &&
      pause &&
      playingTime &&
      !timerPause &&
      !timerStop &&
      isPlaying
    ) {
      setStart();
    }
  }, [start, pause, playingTime, timerPause, timerStop, isPlaying]);

  useEffect(() => {
    if (start && !pause && timerPause && playingTime) {
      console.log("pauza", id);
      setStart();
    }
  }, [start, pause, timerPause, playingTime]);

  useEffect(() => {
    if (playingTime && timerStop) {
      console.log(id, "stop");
      setStop();
      setSetIsPlaying(false);
      dispatch(setNowPlaying({ id, isPlaying: false }));
    }
  }, [timerStop, playingTime]);

  return <div className={draggClass}>{children}</div>;
};

export default ElementDetails;
