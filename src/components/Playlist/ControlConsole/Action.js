import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setNowPlaying } from "../../../redux/timer/timerSlice";

const Action = React.memo(({ elementId }) => {
  const dispatch = useDispatch();
  const elementDetail = useSelector(
    (state) => state.data.masterData[elementId]
  );

  useEffect(() => {
    dispatch(
      setNowPlaying({
        id: elementId,
        isPlaying: true,
        timeLong: elementDetail.period[1] - elementDetail.period[0],
      })
    );
  }, [elementId]);
  return null;
});

export default Action;
