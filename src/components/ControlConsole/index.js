import React, { useContext } from "react";
import Controls from "./controls";
import { useDispatch } from "react-redux";
import { useRequestAnimationFrame } from "request-animation-frame-hook";
import { updateAsync, setTimerState } from "../../redux/timer/timerSlice";
import { TreeContext } from "../../store/context/TreeContext";
import { useSelector } from "react-redux";
const ControlConsole = ({}) => {
  const data = useSelector((state) => state.data.masterData);
  const tree = useContext(TreeContext);
  const periodMax = tree?.root?.maximumHigh || 0;
  const dispatch = useDispatch();
  const autoStopCb = () => {
    console.log("stop CB");
    dispatch(setTimerState({ start: false, pause: false, stop: true }));
  };

  const [start, pause, setStart, setStop] = useRequestAnimationFrame(
    (data) => {
      const { counter, time } = data;
      dispatch(updateAsync({ counter, time }));
    },
    { stopRules: [periodMax, false, 1000], autoStopCb }
  );

  return (
    <Controls
      tree={tree}
      start={start}
      pause={pause}
      setStart={setStart}
      setStop={setStop}
    />
  );
};

export default ControlConsole;
