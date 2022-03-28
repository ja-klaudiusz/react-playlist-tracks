import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setTimerState, setNowPlaying } from "../../redux/timer/timerSlice";

import { queryPoint } from "../../utils";
import "./../../styles.css";
import NewElement from "../Timeline/NewElement";
import IconButton from "../UiElements/IconButton";

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

const Timer = ({ tree }) => {
  const ms = useSelector((state) => {
    const timerMs = state.timer.time.ms;
    const fractionTime = Math.floor(timerMs / 100);
    const time =
      timerMs !== null ? (fractionTime === 0 ? 0.01 : fractionTime) : null;
    return time;
  });

  const query = ms ? queryPoint(tree, ms * 100).result : [];
  const periodMax = tree?.root?.maximumHigh
    ? tree?.root?.maximumHigh / 1000
    : 0;
  return (
    <div className="flex flex-col justify-center items-center">
      <strong className="text-xs">{(periodMax - ms / 10).toFixed(1)} s</strong>

      {query.map((element, i) => {
        return <Action elementId={element.value} key={i} />;
      })}
    </div>
  );
};

const Controls = ({ start, pause, setStart, setStop, tree }) => {
  const [modalType, setModalType] = useState(null);
  const dispatch = useDispatch();

  return (
    <div className="flex flex-row justify-between bg-slate-900 text-slate-200 px-2 border-b border-b-slate-700 h-7">
      <div className="flex flex-row items-center w-24 justify-between">
        {start ? (
          <IconButton
            size="md"
            icon="pause"
            title="Pause"
            onClick={() => {
              setStart();
              dispatch(
                setTimerState({ start: false, pause: true, stop: false })
              );
            }}
          />
        ) : (
          <IconButton
            size="md"
            icon="play"
            title="Play"
            onClick={() => {
              setStart();
              dispatch(
                setTimerState({ start: true, pause: false, stop: false })
              );
            }}
          />
        )}

        <IconButton
          size="md"
          icon="stop"
          title="Stop"
          onClick={() => {
            setStop();
            dispatch(setTimerState({ start: false, pause: false, stop: true }));
          }}
          disabled={!pause && !start}
        />

        <IconButton
          size="md"
          icon="add"
          title="Add new track"
          onClick={() => {
            setModalType("new_element");
          }}
          disabled={pause || start}
        />
      </div>
      <Timer tree={tree} />
      {modalType === "new_element" ? (
        <NewElement
          onClose={() => {
            setModalType(null);
          }}
        />
      ) : null}
    </div>
  );
};

export default Controls;
