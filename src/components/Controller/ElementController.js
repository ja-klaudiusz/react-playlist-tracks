import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setNowPlaying } from "../../redux/timer/timerSlice";
import { useRequestAnimationFrame } from "request-animation-frame-hook";

const ElementController = ({ elementId, duration }) => {
  const dispatch = useDispatch();
  const [isPlaying, setSetIsPlaying] = useState(false);
  const timerPause = useSelector((state) => state.timer.timerState.pause);
  const timerStop = useSelector((state) => state.timer.timerState.stop);

  const autoStopCb = () => {
    dispatch(setNowPlaying({ elementId, isPlaying: false }));
    setSetIsPlaying(false);
  };

  const [start, pause, setStart, setStop] = useRequestAnimationFrame(
    (data) => {},
    { stopRules: [duration || 0, false], autoStopCb }
  );

  useEffect(() => {
    if (!start && !pause && duration && !timerPause && !isPlaying) {
      setSetIsPlaying(true);
      setStart();
    } else if (
      !start &&
      pause &&
      duration &&
      !timerPause &&
      !timerStop &&
      isPlaying
    ) {
      setStart();
    }
  }, [start, pause, duration, timerPause, timerStop, isPlaying]);

  useEffect(() => {
    if (start && !pause && timerPause && duration) {
      console.log("pauza", elementId);
      setStart();
    }
  }, [start, pause, timerPause, duration]);

  useEffect(() => {
    if (duration && timerStop) {
      console.log(elementId, "stop");
      setStop();
      setSetIsPlaying(false);
      dispatch(setNowPlaying({ elementId, isPlaying: false }));
    }
  }, [timerStop, duration]);

  return null;
};

export default ElementController;
