import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setNowPlaying } from "../../redux/timer/timerSlice";

const Trigger = React.memo(({ elementId }) => {
  const dispatch = useDispatch();
  const elementDetail = useSelector(
    (state) => state.data.masterData[elementId]
  );
  const duration = elementDetail.period[1] - elementDetail.period[0];
  console.log(elementId, duration);
  useEffect(() => {
    dispatch(
      setNowPlaying({
        elementId,
        isPlaying: true,
        duration,
      })
    );
  }, [elementId]);
  return null;
});

export default Trigger;
